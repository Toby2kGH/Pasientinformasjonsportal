import { NextRequest, NextResponse } from 'next/server';

// Demo protection for the editorial area. Production must use HelseID instead.
export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER ?? 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse('Admin er deaktivert: ADMIN_PASSWORD er ikke satt.', { status: 503 });
  }

  const header = request.headers.get('authorization') ?? '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = atob(encoded);
    const sep = decoded.indexOf(':');
    if (sep > 0 && decoded.slice(0, sep) === user && decoded.slice(sep + 1) === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Innlogging kreves', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="KreftInfo admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
