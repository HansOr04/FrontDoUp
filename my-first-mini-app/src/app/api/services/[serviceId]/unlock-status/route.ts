import { NextRequest, NextResponse } from 'next/server';

/**
 * Checks if a service is unlocked for the current user
 */
export async function GET(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const serviceId = params.serviceId;
    
    if (!serviceId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: 'Service ID is required' } 
        },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/services/${serviceId}/unlocked`, {
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
          error: errorData.error || { message: 'Failed to check service unlock status' } 
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
    console.error('Error checking service unlock status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}