import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

export function middleware(request: NextRequest) {
  const result = checkAdminAuth(request.headers.get('authorization'));
  if (result === 'ok') return NextResponse.next();
  return new NextResponse('Innlogging kreves.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="KreftInfo redaksjon", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
