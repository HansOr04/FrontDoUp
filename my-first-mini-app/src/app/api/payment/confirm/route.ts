import { NextRequest, NextResponse } from 'next/server';

/**
 * Confirms a payment transaction
 */
export async function POST(request: NextRequest) {
  try {
    const { transaction_id, reference } = await request.json();

    if (!transaction_id || !reference) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: 'Transaction ID and reference are required' } 
        },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/payment/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify({ transaction_id, reference }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || { message: 'Failed to confirm payment' } 
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
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'Internal server error' } 
      },
      { status: 500 }
    );
  }
}