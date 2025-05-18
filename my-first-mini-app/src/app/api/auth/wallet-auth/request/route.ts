import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles wallet authorization request
 * This endpoint is used to initiate the wallet authentication process
 */
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: 'Wallet address is required' } 
        },
        { status: 400 }
      );
    }

    // Forward request to backend API
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/walletauth/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to request wallet authorization' } 
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
    
    return nextResponse;
  } catch (error) {
    console.error('Error in wallet authorization request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}