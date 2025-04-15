import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and verification code are required' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.verified) {
      return NextResponse.json(
        { message: 'User is already verified' },
        { status: 400 }
      );
    }
    
    const verificationCode = '123456'; // In a real app, this would be checked against a stored code
    
    if (code !== verificationCode) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });
    
    return NextResponse.json(
      { message: 'User verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}