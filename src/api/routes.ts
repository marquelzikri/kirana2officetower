import { applySecurityHeaders, authenticateRequest } from './auth';
import { handleAuthRoutes } from './authRoutes';
import {
  createPropertyInDb,
  createUserInDb,
  deletePropertyFromDb,
  deleteUserFromDb,
  type EnvWithDb,
  getAllUsersFromDb,
  getPropertiesFromDb,
  getPropertyByIdFromDb,
  seedPropertiesInDb,
  updatePropertyInDb,
} from './db';
import { getMediaResponse, uploadMediaToStorage } from './media';

export async function handleApiRequest(
  request: Request,
  env: EnvWithDb & { MEDIA_BUCKET?: any } = {}
): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const jsonResponse = (data: any, init?: ResponseInit): Response => {
    const res = Response.json(data, init);
    applySecurityHeaders(res.headers);
    return res;
  };

  // --- AUTHENTICATION & ONBOARDING ENDPOINTS ---
  if (pathname.startsWith('/api/auth/')) {
    const authRes = await handleAuthRoutes(request, env, pathname);
    if (authRes) return authRes;
  }

  // --- USER MANAGEMENT ENDPOINTS (OWNER ONLY) ---

  // GET /api/users
  if (pathname === '/api/users' && request.method === 'GET') {
    const { errorResponse } = await authenticateRequest(request, ['owner']);
    if (errorResponse) return errorResponse;

    try {
      const users = await getAllUsersFromDb(env);
      return jsonResponse({ users });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal mengambil daftar pengguna' }, { status: 500 });
    }
  }

  // POST /api/users
  if (pathname === '/api/users' && request.method === 'POST') {
    const { errorResponse } = await authenticateRequest(request, ['owner']);
    if (errorResponse) return errorResponse;

    try {
      const body: any = await request.json();
      if (!body.username || !body.password || !body.role || !body.name) {
        return jsonResponse(
          { error: 'Field wajib: username, password, role (owner/admin), name' },
          { status: 400 }
        );
      }

      if (!['owner', 'admin'].includes(body.role)) {
        return jsonResponse({ error: "Role harus 'owner' atau 'admin'" }, { status: 400 });
      }

      const createdUser = await createUserInDb(env, body);
      return jsonResponse(createdUser, { status: 201 });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal menambahkan pengguna baru' }, { status: 400 });
    }
  }

  // DELETE /api/users/:id
  const userMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (userMatch && userMatch[1] && request.method === 'DELETE') {
    const { payload, errorResponse } = await authenticateRequest(request, ['owner']);
    if (errorResponse) return errorResponse;

    const targetUserId = userMatch[1];
    if (targetUserId === payload?.userId) {
      return jsonResponse({ error: 'Anda tidak dapat menghapus akun Anda sendiri' }, { status: 400 });
    }

    try {
      await deleteUserFromDb(env, targetUserId);
      return jsonResponse({ success: true, message: 'Akun pengguna berhasil dihapus' });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal menghapus pengguna' }, { status: 500 });
    }
  }

  // --- PROPERTY & MEDIA ENDPOINTS ---

  // POST /api/upload - Upload media file to Cloudflare R2 / S3 storage (Admin & Owner)
  if (pathname === '/api/upload' && request.method === 'POST') {
    const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
    if (errorResponse) return errorResponse;

    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return jsonResponse({ error: "No file provided in form data field 'file'" }, { status: 400 });
      }

      const mediaUrl = await uploadMediaToStorage(env, file);
      return jsonResponse({ url: mediaUrl });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to upload file to Cloudflare storage' }, { status: 500 });
    }
  }

  // GET /api/media/:key - Serve uploaded media file (Public)
  const mediaMatch = pathname.match(/^\/api\/media\/([^/]+)$/);
  if (mediaMatch && mediaMatch[1] && request.method === 'GET') {
    const key = mediaMatch[1];
    return getMediaResponse(env, key);
  }

  // POST /api/properties/seed - Re-seed initial data (Owner Only)
  if (pathname === '/api/properties/seed' && request.method === 'POST') {
    const { errorResponse } = await authenticateRequest(request, ['owner']);
    if (errorResponse) return errorResponse;

    try {
      const count = await seedPropertiesInDb(env, true);
      return jsonResponse({ success: true, seededCount: count });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to seed database' }, { status: 500 });
    }
  }

  // GET /api/properties (Public)
  if (pathname === '/api/properties' && request.method === 'GET') {
    try {
      const searchQuery = url.searchParams.get('search') || '';
      const zone = url.searchParams.get('zone') || 'all';
      const condition = url.searchParams.get('condition') || 'all';
      const type = url.searchParams.get('type') || 'all';
      const sizeRange = url.searchParams.get('sizeRange') || 'all';
      const sortBy = url.searchParams.get('sortBy') || 'default';

      const properties = await getPropertiesFromDb(env, {
        search: searchQuery,
        zone,
        condition,
        type,
        sizeRange,
        sortBy,
      });

      return jsonResponse({
        properties,
        totalCount: properties.length,
      });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to fetch properties' }, { status: 500 });
    }
  }

  // POST /api/properties - Create a new property (Admin & Owner)
  if (pathname === '/api/properties' && request.method === 'POST') {
    const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
    if (errorResponse) return errorResponse;

    try {
      const body: any = await request.json();
      if (!body.title || !body.unitCode || !body.sizeSqm || !body.price) {
        return jsonResponse({ error: 'Missing required fields: title, unitCode, sizeSqm, price' }, { status: 400 });
      }

      const created = await createPropertyInDb(env, body);
      return jsonResponse(created, { status: 201 });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to create property' }, { status: 500 });
    }
  }

  // GET / PUT / DELETE /api/properties/:id
  const propMatch = pathname.match(/^\/api\/properties\/([^/]+)$/);
  if (propMatch && propMatch[1]) {
    const id: string = propMatch[1];

    if (request.method === 'GET') {
      try {
        const property = await getPropertyByIdFromDb(env, id);
        if (!property) {
          return jsonResponse({ error: 'Property not found' }, { status: 404 });
        }
        return jsonResponse(property);
      } catch (err: any) {
        return jsonResponse({ error: err.message || 'Failed to fetch property' }, { status: 500 });
      }
    }

    if (request.method === 'PUT') {
      const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
      if (errorResponse) return errorResponse;

      try {
        const body: any = await request.json();
        const updated = await updatePropertyInDb(env, id, body);
        return jsonResponse(updated);
      } catch (err: any) {
        return jsonResponse({ error: err.message || 'Failed to update property' }, { status: 500 });
      }
    }

    if (request.method === 'DELETE') {
      const { errorResponse } = await authenticateRequest(request, ['owner']);
      if (errorResponse) return errorResponse;

      try {
        await deletePropertyFromDb(env, id);
        return jsonResponse({ success: true, message: `Property ${id} deleted` });
      } catch (err: any) {
        return jsonResponse({ error: err.message || 'Failed to delete property' }, { status: 500 });
      }
    }
  }

  // Not an API route managed here
  return null;
}
