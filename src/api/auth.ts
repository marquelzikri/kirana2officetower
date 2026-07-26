import type { JwtPayload, User, UserRole } from '@/types';

const AUTH_COOKIE_NAME = 'auth_token';
const JWT_SECRET = 'kirana_two_office_tower_jwt_secret_2026_super_secure';
const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24; // 24 hours

// --- 1. CRYPTOGRAPHY (WebCrypto - PBKDF2 & HMAC-SHA256) ---

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  return Array.from(new Uint8Array(derivedKey), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}

// --- 2. JWT TOKEN IMPLEMENTATION (HMAC-SHA256) ---

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createJwtToken(user: User): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey(JWT_SECRET);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dataToSign));
  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const encodedHeader = parts[0];
    const encodedPayload = parts[1];
    const encodedSignature = parts[2];

    if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const key = await getHmacKey(JWT_SECRET);
    const signatureBytes = Uint8Array.from(base64UrlDecode(encodedSignature), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(dataToSign)
    );

    if (!isValid) return null;

    const payload: JwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

// --- 3. COOKIE PARSING & SERIALIZATION ---

export function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  }
  return cookies;
}

export function buildAuthCookie(token: string, isProduction: boolean = false): string {
  const attributes = [
    `${AUTH_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${TOKEN_EXPIRY_SECONDS}`,
  ];
  if (isProduction) {
    attributes.push('Secure');
  }
  return attributes.join('; ');
}

export function buildLogoutCookie(): string {
  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getTokenFromRequest(request: Request): string | null {
  const cookies = parseCookies(request);
  if (cookies[AUTH_COOKIE_NAME]) {
    return cookies[AUTH_COOKIE_NAME];
  }
  // Optional fallback: Authorization Bearer header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// --- 4. RATE LIMITING & BRUTE FORCE PROTECTION ---

interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 5 * 60 * 1000; // 5 minutes

export function checkRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const attempt = loginAttempts.get(key);
  if (!attempt) return { allowed: true };

  const now = Date.now();
  if (attempt.count >= MAX_ATTEMPTS) {
    const timePassed = now - attempt.lastAttempt;
    if (timePassed < LOCKOUT_PERIOD_MS) {
      const waitSeconds = Math.ceil((LOCKOUT_PERIOD_MS - timePassed) / 1000);
      return { allowed: false, waitSeconds };
    } else {
      // Lockout expired, reset attempts
      loginAttempts.delete(key);
      return { allowed: true };
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(key) || { count: 0, lastAttempt: now };
  attempt.count += 1;
  attempt.lastAttempt = now;
  loginAttempts.set(key, attempt);
}

export function clearFailedAttempts(key: string): void {
  loginAttempts.delete(key);
}

// --- 5. SECURITY HEADERS ---

export function applySecurityHeaders(headers: Headers): Headers {
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-XSS-Protection', '1; mode=block');
  return headers;
}

// --- 6. AUTHENTICATION & AUTHORIZATION HELPERS ---

export async function authenticateRequest(
  request: Request,
  allowedRoles?: UserRole[]
): Promise<{ payload: JwtPayload | null; errorResponse: Response | null }> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return {
      payload: null,
      errorResponse: Response.json(
        { error: 'Akses ditolak: Autentikasi diperlukan (Token tidak ditemukan)' },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    return {
      payload: null,
      errorResponse: Response.json(
        { error: 'Sesi tidak valid atau telah kadaluarsa. Silakan login kembali.' },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
    return {
      payload,
      errorResponse: Response.json(
        { error: `Akses ditolak: Peran '${payload.role}' tidak memiliki izin untuk aksi ini` },
        { status: 403 }
      ),
    };
  }

  return { payload, errorResponse: null };
}
