// src/app/api/admin/dogs/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';

export async function POST(request) {
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
    
    const dogData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'breed', 'age', 'gender', 'location', 'contactNumber', 'ownerName', 'status'];
    for (const field of requiredFields) {
      if (!dogData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create the dog
    const newDog = await prisma.dog.create({
      data: {
        name: dogData.name,
        breed: dogData.breed,
        age: dogData.age,
        gender: dogData.gender,
        location: dogData.location,
        contactNumber: dogData.contactNumber,
        ownerName: dogData.ownerName,
        status: dogData.status,
        imageUrl: dogData.imageUrl || '/images/dog-placeholder.jpg',
      },
    });
    
    return NextResponse.json(newDog, { status: 201 });
  } catch (error) {
    console.error('Error adding dog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}