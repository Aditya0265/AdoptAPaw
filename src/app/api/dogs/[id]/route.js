import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const dogId = params.id;
    
    const dog = await prisma.dog.findUnique({
      where: { id: dogId },
    });
    
    if (!dog) {
      return NextResponse.json(
        { message: 'Dog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(dog);
  } catch (error) {
    console.error('Error fetching dog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const dogId = params.id;
    const { status } = await request.json();
    
    if (status !== 'AVAILABLE' && status !== 'ADOPTED') {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const updatedDog = await prisma.dog.update({
      where: { id: dogId },
      data: { status },
    });
    
    return NextResponse.json(updatedDog);
  } catch (error) {
    console.error('Error updating dog status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}