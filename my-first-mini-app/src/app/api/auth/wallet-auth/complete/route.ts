import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles completion of wallet authorization
 * This endpoint is used to complete the wallet authentication process
 */
export async function POST(request: NextRequest) {
  try {
    const { requestId, signature, walletAddress } = await request.json();

    if (!requestId || !signature || !walletAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: 'Request ID, signature, and wallet address are required' } 
        },
        { status: 400 }
      );
    }

    // Get the nonce from cookies
    const nonce = request.cookies.get('world_nonce')?.value;

    // Forward request to backend API
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/walletauth/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': nonce ? `world_nonce=${nonce}` : '',
      },
      body: JSON.stringify({ 
        requestId, 
        signature, 
        walletAddress 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to complete wallet authorization' } 
        },
        { status: response.status }
      );
    }

    // Get the data from the response
    const data = await response.json();
    
    // Create the response
    const nextResponse = NextResponse.json({
      success: true,
      data: data.data
    });
    
    // Transfer cookies from the backend response
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      nextResponse.headers.set('set-cookie', cookies);
    }
    
    // Clear the nonce cookie since it's no longer needed
    nextResponse.cookies.delete('world_nonce');
    
    // Set authentication cookie
    if (data.data?.token) {
      nextResponse.cookies.set({
        name: 'auth_token',
        value: data.data.token,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Error in wallet authorization completion:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}