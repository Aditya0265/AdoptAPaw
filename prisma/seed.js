const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.dog.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash('admin', 10);
  
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@adoptapaw.com',
      password: adminPassword,
      phone: '+919876543210',
      address: 'AdoptAPaw HQ, Bangalore',
      verified: true,
      role: 'ADMIN'
    }
  });
  
  const dogs = [
    {
      name: 'Bruno',
      breed: 'Indian Pariah',
      age: '2 years',
      gender: 'MALE',
      location: 'Bangalore',
      contactNumber: '+919876543210',
      ownerName: 'Shelter Home',
      status: 'AVAILABLE',
      imageUrl: '/images/dog1.jpg'
    },
    {
      name: 'Lucy',
      breed: 'Labrador Retriever',
      age: '1 year',
      gender: 'FEMALE',
      location: 'Mumbai',
      contactNumber: '+919876543211',
      ownerName: 'Animal Care',
      status: 'AVAILABLE',
      imageUrl: '/images/dog2.jpg'
    },
    {
      name: 'Max',
      breed: 'Golden Retriever',
      age: '3 years',
      gender: 'MALE',
      location: 'Delhi',
      contactNumber: '+919876543212',
      ownerName: 'Dog Haven',
      status: 'AVAILABLE',
      imageUrl: '/images/dog3.jpg'
    },
    {
      name: 'Daisy',
      breed: 'Beagle',
      age: '4 months',
      gender: 'FEMALE',
      location: 'Hyderabad',
      contactNumber: '+919876543213',
      ownerName: 'Paw Palace',
      status: 'AVAILABLE',
      imageUrl: '/images/dog4.jpg'
    }
  ];

  for (const dog of dogs) {
    await prisma.dog.create({
      data: dog
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });