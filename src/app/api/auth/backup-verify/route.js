// src/app/api/auth/backup-verify/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function POST(request) {
  try {
    // Get the latest registered user
    const latestUser = await prisma.user.findFirst({
      where: {
        verified: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (latestUser) {
      // Update the user to be verified
      await prisma.user.update({
        where: { id: latestUser.id },
        data: { verified: true }
      });
      
      return NextResponse.json(
        { message: 'Latest user verified successfully', success: true },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { message: 'No unverified users found', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Backup verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}