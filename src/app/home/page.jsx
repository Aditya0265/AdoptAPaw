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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  
  useEffect(() => {
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
      
      // Extract unique breeds and locations for filters
      const breeds = [...new Set(data.map(dog => dog.breed))];
      const locations = [...new Set(data.map(dog => dog.location))];
      
      setAvailableBreeds(breeds);
      setAvailableLocations(locations);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters to dogs
  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = 
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBreed = breedFilter === '' || dog.breed === breedFilter;
    const matchesGender = genderFilter === '' || dog.gender === genderFilter;
    const matchesLocation = locationFilter === '' || dog.location === locationFilter;
    
    let matchesAge = true;
    if (ageFilter !== '') {
      const ageInYears = parseFloat(dog.age);
      if (ageFilter === 'Puppy' && !isNaN(ageInYears)) {
        matchesAge = ageInYears <= 1;
      } else if (ageFilter === 'Young' && !isNaN(ageInYears)) {
        matchesAge = ageInYears > 1 && ageInYears <= 3;
      } else if (ageFilter === 'Adult' && !isNaN(ageInYears)) {
        matchesAge = ageInYears > 3 && ageInYears <= 7;
      } else if (ageFilter === 'Senior' && !isNaN(ageInYears)) {
        matchesAge = ageInYears > 7;
      }
    }
    
    return matchesSearch && matchesBreed && matchesGender && matchesLocation && matchesAge;
  });
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setBreedFilter('');
    setAgeFilter('');
    setGenderFilter('');
    setLocationFilter('');
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select 
                  className="input-field"
                  value={breedFilter}
                  onChange={(e) => setBreedFilter(e.target.value)}
                >
                  <option value="">Any Breed</option>
                  {availableBreeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
                
                <select 
                  className="input-field"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                >
                  <option value="">Any Age</option>
                  <option value="Puppy">Puppy (0-1 year)</option>
                  <option value="Young">Young (1-3 years)</option>
                  <option value="Adult">Adult (3-7 years)</option>
                  <option value="Senior">Senior (7+ years)</option>
                </select>
                
                <select 
                  className="input-field"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">Any Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                
                <select 
                  className="input-field"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">Any Location</option>
                  {availableLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="btn-secondary whitespace-nowrap"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {filteredDogs.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No dogs found</h2>
              <p className="text-gray-600">
                Check back later or adjust your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} isAdmin={session?.user?.role === 'ADMIN'} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}