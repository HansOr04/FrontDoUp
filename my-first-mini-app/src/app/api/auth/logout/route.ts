
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles user logout
 * Clears the auth token cookie and notifies the backend
 */
export async function POST(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;
    
    // Create the response
    const nextResponse = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear the auth token cookie
    nextResponse.cookies.delete('auth_token');
    
    // If there's no token, just return success
    if (!authToken) {
      return nextResponse;
    }
    
    // Notify the backend about the logout
    try {
      await fetch(`${process.env.BACKEND_API_URL}/api/walletauth/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (error) {
      // If there's an error notifying the backend, still continue with the logout
      console.error('Error notifying backend about logout:', error);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Error logging out:', error);
    
    // Even if there's an error, attempt to clear the cookie
    const nextResponse = NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
    
    nextResponse.cookies.delete('auth_token');
    
    return nextResponse;
  }
}