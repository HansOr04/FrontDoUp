import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifies a World ID proof
 */
export async function POST(request: NextRequest) {
  try {
    const { action, payload } = await request.json();

    if (!action || !payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: 'Action and payload are required' } 
        },
        { status: 400 }
      );
    }

    // Forward the verification request to the backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/worldverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Verification failed' } 
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
    
    // Forward any cookies from the backend
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      nextResponse.headers.set('set-cookie', cookies);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Error verifying World ID:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}