'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiUser, FiCalendar, FiInfo } from 'react-icons/fi';

export default function DogCard({ dog }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="card h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 w-full bg-gray-300">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3 4.5a.5.5 0 0 1 1 0v9a.5.5 0 0 1-1 0v-9zm1-.5a1 1 0 0 0-1 1v9a1 1 0 0 0 2 0v-9a1 1 0 0 0-1-1zm11.585-.646a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-3.417 4.03a.5.5 0 0 1-.708.057l-2.015-1.729a.5.5 0 0 1-.278-.043L2.828 8.293a.5.5 0 0 1-.14-.676l2.169-2.823A.5.5 0 0 1 5.141 4.5h1.334c.193 0 .374.09.484.245l.829 1.142L9.637 3.4a.5.5 0 0 1 .486-.18l1.843.491a.5.5 0 0 1 .117.07l2.5 2a.5.5 0 0 1 .002.777zm.166 1.3L13 5.567v5.552l2.137-2.521zm-3.32 6.884 2.011-2.371h-2zm-3.427 0-1.387-1.21L5 14.738v-1.647l1.327.762 1.218 1.16a.25.25 0 0 0 .355-.03l.542-.577-1.328-.763zm5.39-10.028 1.548.413-1.433 1.434-.489-.911zm-6.902.022L4.322 6.256l1.663 1.91-.462-.83a.5.5 0 0 0-.447-.257zm4.954 2.22-1.431 1.454-1.323-.761L7.289 8.01c.125-.084.277-.084.405-.001zm1.767 3.858h-1.658l-1.932 2.226 1.262.725 2.406-2.793z"/>
          </svg>
        </div>
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-xl transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-50'}`} />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{dog.name}</h3>
          <p className="text-white/90">{dog.breed}</p>
        </div>
        {dog.status === 'ADOPTED' && (
          <div className="absolute top-4 right-4 bg-secondary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Adopted
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <FiCalendar className="h-4 w-4 mr-2" />
          <span>{dog.age}</span>
          <span className="mx-2">•</span>
          <span>{dog.gender === 'MALE' ? 'Male' : 'Female'}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FiMapPin className="h-4 w-4 mr-2" />
          <span>{dog.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FiUser className="h-4 w-4 mr-2" />
          <span>{dog.ownerName}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FiPhone className="h-4 w-4 mr-2" />
          <span>{dog.contactNumber}</span>
        </div>
        
        {dog.status === 'AVAILABLE' ? (
          <Link href={`/application/${dog.id}`} className="btn-primary w-full text-center mt-4">
            Adopt Me
          </Link>
        ) : (
          <button disabled className="w-full py-2 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed mt-4">
            Already Adopted
          </button>
        )}
      </div>
    </motion.div>
  );
}