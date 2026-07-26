import { applySecurityHeaders, authenticateRequest } from './auth';
import { handleAuthRoutes } from './authRoutes';
import {
  createContactInDb,
  createInsightInDb,
  createPropertyInDb,
  createUserInDb,
  deleteContactFromDb,
  deleteInsightFromDb,
  deletePropertyFromDb,
  deleteUserFromDb,
  type EnvWithDb,
  getAllUsersFromDb,
  getContactsFromDb,
  getInsightByIdFromDb,
  getInsightBySlugFromDb,
  getInsightsFromDb,
  getPropertiesFromDb,
  getPropertyByIdFromDb,
  seedPropertiesInDb,
  updateContactStatusInDb,
  updateInsightInDb,
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

  // --- CONTACT & INQUIRY ENDPOINTS ---

  // POST /api/contacts - Submit contact form (Public)
  if (pathname === '/api/contacts' && request.method === 'POST') {
    try {
      const body: any = await request.json();
      const { name, email, phone, company, subject, message } = body || {};

      if (!name || !email || !phone || !subject || !message) {
        return jsonResponse(
          { error: 'Field wajib diisi: nama, email, no. telepon/WA, subjek, dan pesan' },
          { status: 400 }
        );
      }

      const created = await createContactInDb(env, { name, email, phone, company, subject, message });
      return jsonResponse({ success: true, contact: created }, { status: 201 });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal mengirim pesan kontak' }, { status: 500 });
    }
  }

  // GET /api/contacts - Fetch contact list (Admin & Owner)
  if (pathname === '/api/contacts' && request.method === 'GET') {
    const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
    if (errorResponse) return errorResponse;

    try {
      const statusFilter = url.searchParams.get('status') || 'all';
      const contacts = await getContactsFromDb(env, statusFilter);
      return jsonResponse({ contacts });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal mengambil daftar pesan kontak' }, { status: 500 });
    }
  }

  // PATCH or PUT /api/contacts/:id - Update status (Admin & Owner)
  const contactMatch = pathname.match(/^\/api\/contacts\/([^/]+)$/);
  if (contactMatch && contactMatch[1]) {
    const contactId = contactMatch[1];

    if (request.method === 'PATCH' || request.method === 'PUT') {
      const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
      if (errorResponse) return errorResponse;

      try {
        const body: any = await request.json();
        if (!body.status || !['unread', 'read', 'replied'].includes(body.status)) {
          return jsonResponse({ error: 'Status harus salah satu dari: unread, read, replied' }, { status: 400 });
        }

        const updated = await updateContactStatusInDb(env, contactId, body.status);
        return jsonResponse({ success: true, contact: updated });
      } catch (err: any) {
        return jsonResponse({ error: err.message || 'Gagal memperbarui status pesan' }, { status: 500 });
      }
    }

    if (request.method === 'DELETE') {
      const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
      if (errorResponse) return errorResponse;

      try {
        await deleteContactFromDb(env, contactId);
        return jsonResponse({ success: true, message: 'Pesan kontak berhasil dihapus' });
      } catch (err: any) {
        return jsonResponse({ error: err.message || 'Gagal menghapus pesan kontak' }, { status: 500 });
      }
    }
  }

  // --- INSIGHT / BLOG ENDPOINTS ---

  // GET /api/insights - List insights (Public: published only; Admin with ?all=true: all)
  if (pathname === '/api/insights' && request.method === 'GET') {
    try {
      const showAll = url.searchParams.get('all') === 'true';
      const statusFilter = url.searchParams.get('status') || 'all';
      const category = url.searchParams.get('category') || 'all';

      // If requesting all (including drafts), require admin/owner auth
      if (showAll) {
        const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
        if (errorResponse) return errorResponse;
      }

      const insights = await getInsightsFromDb(env, {
        status: statusFilter,
        category,
        showAll,
      });
      return jsonResponse({ insights });
    } catch (err: any) {
      return jsonResponse(
        { error: err.message || 'Gagal mengambil daftar insight' },
        { status: 500 }
      );
    }
  }

  // POST /api/insights - Create new insight (Admin & Owner)
  if (pathname === '/api/insights' && request.method === 'POST') {
    const { payload, errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
    if (errorResponse) return errorResponse;

    try {
      const body: any = await request.json();
      if (!body.title || !body.excerpt || !body.body || !body.category) {
        return jsonResponse(
          { error: 'Field wajib: title, excerpt, body, category' },
          { status: 400 }
        );
      }

      const created = await createInsightInDb(env, {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        body: body.body,
        coverImage: body.coverImage,
        category: body.category,
        authorId: payload!.userId,
        authorName: payload!.name,
        status: body.status,
      });
      return jsonResponse(created, { status: 201 });
    } catch (err: any) {
      return jsonResponse(
        { error: err.message || 'Gagal membuat insight baru' },
        { status: 500 }
      );
    }
  }

  // GET / PUT / DELETE /api/insights/:idOrSlug
  const insightMatch = pathname.match(/^\/api\/insights\/([^/]+)$/);
  if (insightMatch && insightMatch[1]) {
    const idOrSlug: string = insightMatch[1];

    if (request.method === 'GET') {
      try {
        // Try by slug first (public), then by ID
        let insight = await getInsightBySlugFromDb(env, idOrSlug);
        if (!insight) {
          insight = await getInsightByIdFromDb(env, idOrSlug);
        }
        if (!insight) {
          return jsonResponse({ error: 'Insight tidak ditemukan' }, { status: 404 });
        }
        return jsonResponse(insight);
      } catch (err: any) {
        return jsonResponse(
          { error: err.message || 'Gagal mengambil insight' },
          { status: 500 }
        );
      }
    }

    if (request.method === 'PUT') {
      const { errorResponse } = await authenticateRequest(request, ['admin', 'owner']);
      if (errorResponse) return errorResponse;

      try {
        const body: any = await request.json();
        const updated = await updateInsightInDb(env, idOrSlug, body);
        return jsonResponse(updated);
      } catch (err: any) {
        return jsonResponse(
          { error: err.message || 'Gagal memperbarui insight' },
          { status: 500 }
        );
      }
    }

    if (request.method === 'DELETE') {
      const { errorResponse } = await authenticateRequest(request, ['owner']);
      if (errorResponse) return errorResponse;

      try {
        await deleteInsightFromDb(env, idOrSlug);
        return jsonResponse({ success: true, message: 'Insight berhasil dihapus' });
      } catch (err: any) {
        return jsonResponse(
          { error: err.message || 'Gagal menghapus insight' },
          { status: 500 }
        );
      }
    }
  }

  // Not an API route managed here
  return null;
}

