import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which paths are protected (require authentication)
const protectedPaths = [
  '/home',
  '/profile',
  '/services/unlock',
  '/transactions',
];

// Define authentication paths
const authPaths = [
  '/login',
  '/connect-wallet',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );
  
  // Check if the path is an auth path
  const isAuthPath = authPaths.some(authPath => 
    path.startsWith(authPath)
  );
  
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;

  // Function to check if token is valid
  const isValidToken = async (token: string) => {
    try {
      // Call your backend API to validate the token
      const response = await fetch(`${process.env.BACKEND_API_URL}/api/walletauth/check`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // If accessing a protected path without a valid token, redirect to login
  if (isProtectedPath) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Validate the token
    const isValid = await isValidToken(authToken);
    
    if (!isValid) {
      // Clear the invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // If accessing an auth path with a valid token, redirect to home
  if (isAuthPath && authToken) {
    const isValid = await isValidToken(authToken);
    
    if (isValid) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    
    // If token is invalid, let them access the auth path
    // The token will be cleared in the auth pages if needed
  }

  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};