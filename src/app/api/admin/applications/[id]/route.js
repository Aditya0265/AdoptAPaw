import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { sendApplicationUpdate } from '@/lib/twilio';

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
    
    const applicationId = params.id;
    const { status, homeVisitDate, finalVisitDate } = await request.json();
    
    const validStatuses = [
      'SUBMITTED',
      'HOME_VISIT_SCHEDULED',
      'HOME_VISIT_COMPLETED',
      'FINAL_VISIT_SCHEDULED',
      'COMPLETED',
      'REJECTED',
    ];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        dog: true,
      },
    });
    
    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }
    
    const updateData = { status };
    
    if (status === 'HOME_VISIT_SCHEDULED' && homeVisitDate) {
      updateData.homeVisitDate = new Date(homeVisitDate);
    }
    
    if (status === 'FINAL_VISIT_SCHEDULED' && finalVisitDate) {
      updateData.finalVisitDate = new Date(finalVisitDate);
    }
    
    if (status === 'COMPLETED') {
      await prisma.dog.update({
        where: { id: application.dogId },
        data: { status: 'ADOPTED' },
      });
    }
    
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        user: true,
        dog: true,
      },
    });
    
    try {
      await sendApplicationUpdate(
        application.user.phone,
        status,
        application.dog.name
      );
    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
    
    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}