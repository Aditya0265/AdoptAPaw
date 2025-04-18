// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.application.deleteMany({});
    await prisma.dog.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Creating admin user...");
    const adminPassword = await bcrypt.hash("admin", 10);

    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@adoptapaw.com",
        password: adminPassword,
        phone: "+919876543210",
        address: "AdoptAPaw HQ, Bangalore",
        verified: true,
        role: "ADMIN",
      },
    });

    console.log("Creating sample dogs...");
    const dogs = [
      {
        name: "Rocky",
        breed: "German Shepherd",
        age: "2 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543214",
        ownerName: "Happy Tails",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Bella",
        breed: "Pomeranian",
        age: "1.5 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543215",
        ownerName: "City Shelter",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Charlie",
        breed: "Dalmatian",
        age: "2.5 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543216",
        ownerName: "Animal Friends",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Luna",
        breed: "Shih Tzu",
        age: "1 year",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543217",
        ownerName: "Pet Pals",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Tiger",
        breed: "Boxer",
        age: "3 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543218",
        ownerName: "Doggy Den",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Milo",
        breed: "Indie",
        age: "2 months",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543219",
        ownerName: "Stray Love",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Coco",
        breed: "Pug",
        age: "1 year",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543220",
        ownerName: "Pet Planet",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Oscar",
        breed: "Siberian Husky",
        age: "2.5 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543221",
        ownerName: "Snow Tails",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Zoe",
        breed: "Cocker Spaniel",
        age: "6 months",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543222",
        ownerName: "Rescue Hub",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Rex",
        breed: "Rottweiler",
        age: "4 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543223",
        ownerName: "Guardian Paws",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Nala",
        breed: "Chihuahua",
        age: "2 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543224",
        ownerName: "Cute Companions",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Simba",
        breed: "Doberman",
        age: "3.5 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543225",
        ownerName: "WatchDog Shelter",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Rosie",
        breed: "French Bulldog",
        age: "1.2 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543226",
        ownerName: "Tiny Tails",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Buddy",
        breed: "Indian Pariah",
        age: "2 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543227",
        ownerName: "Local Shelter",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Misty",
        breed: "Spitz",
        age: "7 months",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543228",
        ownerName: "Fluffy Friends",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Shadow",
        breed: "Great Dane",
        age: "4 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543229",
        ownerName: "Big Dog Shelter",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Chloe",
        breed: "Lhasa Apso",
        age: "1 year",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543230",
        ownerName: "Little Paws",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Bolt",
        breed: "Whippet",
        age: "1.8 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543231",
        ownerName: "Race Paws",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Ruby",
        breed: "Indian Mongrel",
        age: "2.3 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543232",
        ownerName: "Open Shelter",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
      {
        name: "Thor",
        breed: "Bulldog",
        age: "3.7 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543233",
        ownerName: "Strong Paws",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      },
    ];

    for (const dog of dogs) {
      await prisma.dog.create({
        data: dog,
      });
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
