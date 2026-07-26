import {
  createPropertyInDb,
  deletePropertyFromDb,
  type EnvWithDb,
  getPropertiesFromDb,
  getPropertyByIdFromDb,
  seedPropertiesInDb,
  updatePropertyInDb} from "./db";
import { getMediaResponse,uploadMediaToStorage } from "./media";

export async function handleApiRequest(request: Request, env: EnvWithDb & { MEDIA_BUCKET?: any } = {}): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // POST /api/upload - Upload media file to Cloudflare R2 / S3 storage
  if (pathname === "/api/upload" && request.method === "POST") {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return Response.json({ error: "No file provided in form data field 'file'" }, { status: 400 });
      }

      const mediaUrl = await uploadMediaToStorage(env, file);
      return Response.json({ url: mediaUrl });
    } catch (err: any) {
      return Response.json({ error: err.message || "Failed to upload file to Cloudflare storage" }, { status: 500 });
    }
  }

  // GET /api/media/:key - Serve uploaded media file
  const mediaMatch = pathname.match(/^\/api\/media\/([^/]+)$/);
  if (mediaMatch && mediaMatch[1] && request.method === "GET") {
    const key = mediaMatch[1];
    return getMediaResponse(env, key);
  }

  // POST /api/properties/seed - Re-seed initial data
  if (pathname === "/api/properties/seed" && request.method === "POST") {
    try {
      const count = await seedPropertiesInDb(env, true);
      return Response.json({ success: true, seededCount: count });
    } catch (err: any) {
      return Response.json({ error: err.message || "Failed to seed database" }, { status: 500 });
    }
  }

  // GET /api/properties
  if (pathname === "/api/properties" && request.method === "GET") {
    try {
      const searchQuery = url.searchParams.get("search") || "";
      const zone = url.searchParams.get("zone") || "all";
      const condition = url.searchParams.get("condition") || "all";
      const type = url.searchParams.get("type") || "all";
      const sizeRange = url.searchParams.get("sizeRange") || "all";
      const sortBy = url.searchParams.get("sortBy") || "default";

      const properties = await getPropertiesFromDb(env, {
        search: searchQuery,
        zone,
        condition,
        type,
        sizeRange,
        sortBy,
      });

      return Response.json({
        properties,
        totalCount: properties.length,
      });
    } catch (err: any) {
      return Response.json({ error: err.message || "Failed to fetch properties" }, { status: 500 });
    }
  }

  // POST /api/properties - Create a new property
  if (pathname === "/api/properties" && request.method === "POST") {
    try {
      const body: any = await request.json();
      if (!body.title || !body.unitCode || !body.sizeSqm || !body.price) {
        return Response.json({ error: "Missing required fields: title, unitCode, sizeSqm, price" }, { status: 400 });
      }

      const created = await createPropertyInDb(env, body);
      return Response.json(created, { status: 201 });
    } catch (err: any) {
      return Response.json({ error: err.message || "Failed to create property" }, { status: 500 });
    }
  }

  // GET / PUT / DELETE /api/properties/:id
  const propMatch = pathname.match(/^\/api\/properties\/([^/]+)$/);
  if (propMatch && propMatch[1]) {
    const id: string = propMatch[1];

    if (request.method === "GET") {
      try {
        const property = await getPropertyByIdFromDb(env, id);
        if (!property) {
          return Response.json({ error: "Property not found" }, { status: 404 });
        }
        return Response.json(property);
      } catch (err: any) {
        return Response.json({ error: err.message || "Failed to fetch property" }, { status: 500 });
      }
    }

    if (request.method === "PUT") {
      try {
        const body: any = await request.json();
        const updated = await updatePropertyInDb(env, id, body);
        return Response.json(updated);
      } catch (err: any) {
        return Response.json({ error: err.message || "Failed to update property" }, { status: 500 });
      }
    }

    if (request.method === "DELETE") {
      try {
        await deletePropertyFromDb(env, id);
        return Response.json({ success: true, message: `Property ${id} deleted` });
      } catch (err: any) {
        return Response.json({ error: err.message || "Failed to delete property" }, { status: 500 });
      }
    }
  }

  // Not an API route managed here
  return null;
}
