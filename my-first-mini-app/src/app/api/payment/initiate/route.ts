import { NextRequest, NextResponse } from 'next/server';

/**
 * Initiates a payment transaction
 */
export async function POST(request: NextRequest) {
  try {
    const { serviceId } = await request.json();

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
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/payment/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify({ serviceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to initiate payment' } 
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
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}