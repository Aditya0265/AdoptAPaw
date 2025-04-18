"use client"
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '../../lib/db';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DogCard from '../../components/DogCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login');
    },
  });
  
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch dogs when authenticated
    if (status === 'authenticated') {
      fetchDogs();
    }
  }, [status]);
  
  const fetchDogs = async () => {
    try {
      const response = await fetch('/api/dogs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dogs');
      }
      
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container-custom">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect Companion
            </h1>
            <p className="text-xl text-gray-600">
              Browse through our available dogs and begin your adoption journey today.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search by name, breed, location..."
                  className="input-field w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select className="input-field">
                  <option value="">Any Breed</option>
                  <option value="Indian Pariah">Indian Pariah</option>
                  <option value="Labrador Retriever">Labrador Retriever</option>
                  <option value="Golden Retriever">Golden Retriever</option>
                  <option value="Beagle">Beagle</option>
                  <option value="German Shepherd">German Shepherd</option>
                </select>
                
                <select className="input-field">
                  <option value="">Any Age</option>
                  <option value="Puppy">Puppy (0-1 year)</option>
                  <option value="Young">Young (1-3 years)</option>
                  <option value="Adult">Adult (3-7 years)</option>
                  <option value="Senior">Senior (7+ years)</option>
                </select>
                
                <select className="input-field">
                  <option value="">Any Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                
                <select className="input-field">
                  <option value="">Any Location</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
              
              <button className="btn-primary whitespace-nowrap">
                Apply Filters
              </button>
            </div>
          </div>
          
          {dogs.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No dogs available</h2>
              <p className="text-gray-600">
                Check back later or adjust your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}