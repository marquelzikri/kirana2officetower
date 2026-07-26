import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';

export interface EnvWithMedia {
  DB?: any;
  MEDIA_BUCKET?: any; // Cloudflare R2 Bucket binding
}

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure local uploads directory exists for bun dev mode
if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
  try {
    if (!existsSync(UPLOADS_DIR)) {
      mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    // Ignore if running inside restricted worker runtime
  }
}

/**
 * Uploads a file to Cloudflare R2 bucket or local disk storage fallback.
 * Returns public access URL e.g. /api/media/media-1689000-xyz.jpg
 */
export async function uploadMediaToStorage(env: EnvWithMedia, file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${cleanExt || 'jpg'}`;
  const contentType = file.type || getContentTypeFromExt(cleanExt);

  if (env.MEDIA_BUCKET) {
    // Cloudflare R2 S3 Object Storage
    await env.MEDIA_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
    });
  } else {
    // Local storage fallback for bun dev mode
    const filePath = path.join(UPLOADS_DIR, key);
    writeFileSync(filePath, Buffer.from(buffer));
  }

  return `/api/media/${key}`;
}

/**
 * Retrieves a file from Cloudflare R2 bucket or local disk storage.
 */
export async function getMediaResponse(env: EnvWithMedia, key: string): Promise<Response> {
  const cleanKey = path.basename(key); // Sanitize path traversal

  if (env.MEDIA_BUCKET) {
    const object = await env.MEDIA_BUCKET.get(cleanKey);
    if (!object) {
      return Response.json({ error: 'Media file not found' }, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  } else {
    // Local storage fallback
    const filePath = path.join(UPLOADS_DIR, cleanKey);
    if (typeof Bun !== 'undefined') {
      const bunFile = Bun.file(filePath);
      if (!(await bunFile.exists())) {
        return Response.json({ error: 'Media file not found' }, { status: 404 });
      }
      return new Response(bunFile);
    } else {
      if (!existsSync(filePath)) {
        return Response.json({ error: 'Media file not found' }, { status: 404 });
      }
      const fileBuffer = readFileSync(filePath);
      const ext = cleanKey.split('.').pop() || '';
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': getContentTypeFromExt(ext),
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }
  }
}

function getContentTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'jpeg':
    case 'jpg':
    default:
      return 'image/jpeg';
  }
}
