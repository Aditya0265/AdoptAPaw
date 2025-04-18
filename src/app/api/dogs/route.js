// src/app/api/dogs/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  try {
    const dogs = await prisma.dog.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(dogs);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}