import { NextRequest, NextResponse } from 'next/server';

/**
 * Checks a user's verification level against a required level
 */
export async function GET(request: NextRequest) {
  try {
    // Get level from query params
    const searchParams = new URL(request.url).searchParams;
    const level = searchParams.get('level');
    
    // Forward the request to the backend
    const url = new URL(`${process.env.BACKEND_API_URL}/api/worldverify/check`);
    if (level) {
      url.searchParams.set('level', level);
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to check verification level' } 
        },
        { status: response.status }
      );
    }

    // Get the data from the response
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data
    });
  } catch (error) {
    console.error('Error checking verification level:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}