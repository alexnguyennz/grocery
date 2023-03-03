import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient({ req, res });

  // check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return res; // if there is a session, forward request to protected route

  // if no session, redirect to login page
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/';
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*'],
};
