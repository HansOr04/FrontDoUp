import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Retrieves the current authenticated user's information
 * This is used by the client to get the user data after login
 */
export async function GET(request: NextRequest) {
  try {
    // Check for authenticated session from NextAuth
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // If there's a token, return the user data
    if (token) {
      return NextResponse.json({
        success: true,
        data: {
          id: token.id,
          name: token.name,
          walletAddress: token.walletAddress,
          verificationLevel: token.verificationLevel,
          walletAuthorized: token.walletAuthorized,
        }
      });
    }
    
    // Otherwise, try to get user data from the auth token in cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }
    
    // Call backend API to validate the token and get user data
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      // If the token is invalid, clear the cookie
      if (response.status === 401) {
        const nextResponse = NextResponse.json(
          { success: false, error: { message: 'Invalid token' } },
          { status: 401 }
        );
        
        nextResponse.cookies.delete('auth_token');
        return nextResponse;
      }
      
      return NextResponse.json(
        { success: false, error: { message: 'Failed to get user data' } },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data
    });
    
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}