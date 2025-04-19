'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiAlertCircle, FiEdit } from 'react-icons/fi';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import StatusBar from '../../../components/StatusBar';

export default function ApplicationPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login');
    },
  });
  
  const [dog, setDog] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return;
      
      try {
        
        const dogResponse = await fetch(`/api/dogs/${params.id}`);
        
        if (!dogResponse.ok) {
          throw new Error('Dog not found');
        }
        
        const dogData = await dogResponse.json();
        setDog(dogData);
        
        
        const applicationResponse = await fetch(`/api/applications?dogId=${params.id}`);
        
        if (applicationResponse.ok) {
          const applicationData = await applicationResponse.json();
          
          if (applicationData.length > 0) {
            setApplication(applicationData[0]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, status]);
  
  const handleSubmitApplication = async () => {
    if (!confirmationChecked) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dogId: params.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      const data = await response.json();
      setApplication(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="btn-primary flex items-center justify-center mx-auto"
            >
              <FiArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!dog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dog Not Found</h2>
            <p className="text-gray-600 mb-6">The dog you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/home')}
              className="btn-primary flex items-center justify-center mx-auto"
            >
              <FiArrowLeft className="mr-2" /> Back to Dogs
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (dog.status === 'ADOPTED' && !application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-20">
          <div className="container-custom">
            <button
              onClick={() => router.back()}
              className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <FiAlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">This dog has already been adopted</h2>
                <p className="text-gray-600 mb-6">
                  We're sorry, but {dog.name} has already found a forever home. Please check out our other available dogs.
                </p>
                <button
                  onClick={() => router.push('/home')}
                  className="btn-primary"
                >
                  Browse More Dogs
                </button>
              </div>
            </div>
          </div>
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
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          
          {application ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Your Application for {dog.name}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Track the status of your adoption application below. We'll keep you updated every step of the way.
                  </p>
                  
                  <StatusBar currentStatus={application.status} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Image
                      src={dog.imageUrl}
                      alt={dog.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Dog Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{dog.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Breed</p>
                        <p className="font-medium">{dog.breed}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{dog.age}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{dog.gender === 'MALE' ? 'Male' : 'Female'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{dog.location}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{dog.contactNumber}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Next Steps
                      </h3>
                      
                      {application.status === 'SUBMITTED' && (
                        <p className="text-gray-600">
                          We're reviewing your application. Our team will contact you soon to schedule a home visit.
                        </p>
                      )}
                      
                      {application.status === 'HOME_VISIT_SCHEDULED' && (
                        <div>
                          <p className="text-gray-600 mb-2">
                            Your home visit has been scheduled for:
                          </p>
                          <p className="font-medium text-lg">
                            {new Date(application.homeVisitDate).toLocaleString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}
                      
                      {application.status === 'HOME_VISIT_COMPLETED' && (
                        <p className="text-gray-600">
                          Your home visit has been completed successfully! We'll schedule your final visit to our office soon.
                        </p>
                      )}
                      
                      {application.status === 'FINAL_VISIT_SCHEDULED' && (
                        <div>
                          <p className="text-gray-600 mb-2">
                            Please visit our office for the final paperwork and to take your new friend home:
                          </p>
                          <p className="font-medium text-lg mb-2">
                            {new Date(application.finalVisitDate).toLocaleString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-gray-600">
                            <strong>Address:</strong> AdoptAPaw Foundation, 123 Pet Street, Bangalore, Karnataka, India 560001
                          </p>
                        </div>
                      )}
                      
                      {application.status === 'COMPLETED' && (
                        <div className="text-center py-4">
                          <FiCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <p className="text-xl font-medium text-gray-800 mb-2">
                            Congratulations on your new family member!
                          </p>
                          <p className="text-gray-600">
                            We're so happy that {dog.name} has found a forever home with you.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6 md:w-1/2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {dog.name}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    <span className="font-medium">{dog.breed}</span> • {dog.age} • {dog.gender === 'MALE' ? 'Male' : 'Female'}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{dog.location}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Shelter/Owner</p>
                      <p className="font-medium">{dog.ownerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{dog.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Apply for Adoption
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      By submitting this application, you're taking the first step towards giving {dog.name} a loving home. Our team will review your application and contact you to schedule a home visit.
                    </p>
                    
                    <div className="mb-6">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={confirmationChecked}
                          onChange={() => setConfirmationChecked(!confirmationChecked)}
                          className="mt-1 h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">
                          I confirm that the information in my profile is accurate and I understand that a home visit will be conducted as part of the adoption process.
                        </span>
                      </label>
                    </div>
                    
                    <button
                      onClick={handleSubmitApplication}
                      disabled={!confirmationChecked || isSubmitting}
                      className="btn-primary w-full flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}