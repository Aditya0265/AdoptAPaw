
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false, message: 'No session found' },
        { status: 200 }
      );
    }
    
    
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    return NextResponse.json({
      authenticated: true,
      session: {
        user: {
          name: session.user.name,
          email: session.user.email,
          role: session.user.role, 
          verified: session.user.verified 
        }
      },
      dbUser: dbUser ? {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        verified: dbUser.verified
      } : null
    }, { status: 200 });
  } catch (error) {
    console.error('Session debug error:', error);
    return NextResponse.json(
      { message: 'Error fetching session', error: error.message },
      { status: 500 }
    );
  }
}