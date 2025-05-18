import { NextRequest, NextResponse } from 'next/server';

/**
 * Simulates a payment (only for development purposes)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: 'Payment simulation is only available in development mode' } 
        },
        { status: 403 }
      );
    }

    const { serviceId, reference } = await request.json();

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
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/payment/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify({ serviceId, reference }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to simulate payment' } 
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
    console.error('Error simulating payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}