import {
  applySecurityHeaders,
  authenticateRequest,
  buildAuthCookie,
  buildLogoutCookie,
  checkRateLimit,
  createJwtToken,
  recordFailedAttempt,
  verifyPassword,
} from './auth';
import { createUserInDb, type EnvWithDb, getUserByUsernameFromDb, getUsersCountFromDb } from './db';

const jsonResponse = (data: any, init?: ResponseInit): Response => {
  const res = Response.json(data, init);
  applySecurityHeaders(res.headers);
  return res;
};

export async function handleAuthRoutes(
  request: Request,
  env: EnvWithDb,
  pathname: string
): Promise<Response | null> {
  // GET /api/auth/setup-status
  if (pathname === '/api/auth/setup-status' && request.method === 'GET') {
    try {
      const count = await getUsersCountFromDb(env);
      return jsonResponse({
        hasUsers: count > 0,
        count,
      });
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Failed to check setup status' }, { status: 500 });
    }
  }

  // POST /api/auth/onboard-owner
  if (pathname === '/api/auth/onboard-owner' && request.method === 'POST') {
    try {
      const count = await getUsersCountFromDb(env);
      if (count > 0) {
        return jsonResponse(
          { error: 'Akun Owner sudah terdaftar dalam sistem. Silakan login.' },
          { status: 400 }
        );
      }

      const body: any = await request.json();
      const { username, password, name } = body || {};

      if (!username || !password || !name) {
        return jsonResponse({ error: 'Field wajib: username, password, name' }, { status: 400 });
      }

      if (String(password).length < 6) {
        return jsonResponse({ error: 'Password minimal 6 karakter' }, { status: 400 });
      }

      const createdUser = await createUserInDb(env, {
        username: String(username).trim(),
        password: String(password),
        name: String(name).trim(),
        role: 'owner',
      });

      const token = await createJwtToken(createdUser);
      const isProd = process.env.NODE_ENV === 'production';
      const cookieHeader = buildAuthCookie(token, isProd);

      const res = jsonResponse({
        success: true,
        user: createdUser,
        message: 'Registrasi Owner berhasil. Sesi Anda telah diaktifkan.',
      });

      res.headers.append('Set-Cookie', cookieHeader);
      return res;
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal mendaftar sebagai Owner' }, { status: 500 });
    }
  }

  // POST /api/auth/login
  if (pathname === '/api/auth/login' && request.method === 'POST') {
    try {
      const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'client-ip';
      const rateCheck = checkRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return jsonResponse(
          { error: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${rateCheck.waitSeconds} detik.` },
          { status: 429 }
        );
      }

      const body: any = await request.json();
      const { username, password } = body || {};

      if (!username || !password) {
        return jsonResponse({ error: 'Username dan password wajib diisi.' }, { status: 400 });
      }

      const userRow = await getUserByUsernameFromDb(env, String(username).trim());
      if (!userRow) {
        recordFailedAttempt(clientIp);
        return jsonResponse({ error: 'Username atau password tidak cocok.' }, { status: 401 });
      }

      const isValid = await verifyPassword(password, userRow.salt, userRow.password_hash);
      if (!isValid) {
        recordFailedAttempt(clientIp);
        return jsonResponse({ error: 'Username atau password tidak cocok.' }, { status: 401 });
      }

      const user = {
        id: userRow.id,
        username: userRow.username,
        role: userRow.role,
        name: userRow.name,
      };

      const token = await createJwtToken(user);
      const isProd = process.env.NODE_ENV === 'production';
      const cookieHeader = buildAuthCookie(token, isProd);

      const res = jsonResponse({
        success: true,
        user,
        message: `Berhasil masuk sebagai ${userRow.role.toUpperCase()}`,
      });

      res.headers.append('Set-Cookie', cookieHeader);
      return res;
    } catch (err: any) {
      return jsonResponse({ error: err.message || 'Gagal memproses login' }, { status: 500 });
    }
  }

  // POST /api/auth/logout
  if (pathname === '/api/auth/logout' && request.method === 'POST') {
    const res = jsonResponse({ success: true, message: 'Berhasil keluar (Logout)' });
    res.headers.append('Set-Cookie', buildLogoutCookie());
    return res;
  }

  // GET /api/auth/me
  if (pathname === '/api/auth/me' && request.method === 'GET') {
    const { payload, errorResponse } = await authenticateRequest(request);
    if (errorResponse) return errorResponse;

    return jsonResponse({
      authenticated: true,
      user: {
        id: payload!.userId,
        username: payload!.username,
        role: payload!.role,
        name: payload!.name,
      },
    });
  }

  return null;
}
