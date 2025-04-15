'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiEdit } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login');
    },
  });
  
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isEditing, setIsEditing] = useState({
    profile: false,
    password: false,
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      try {
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [status]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const toggleEditing = (section) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
    setErrors({});
    setSuccessMessage('');
    
    // Reset password fields if canceling password edit
    if (section === 'password' && isEditing.password) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUserData(updatedUser);
      
      await update({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
        },
      });
      
      setSuccessMessage('Profile updated successfully');
      setIsEditing(prev => ({ ...prev, profile: false }));
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update password');
      }
      
      setSuccessMessage('Password updated successfully');
      setIsEditing(prev => ({ ...prev, password: false }));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading' || !userData) {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>
          
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
            >
              {successMessage}
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                    <button
                      onClick={() => toggleEditing('profile')}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      {isEditing.profile ? 'Cancel' : (
                        <>
                          <FiEdit className="mr-1" /> Edit
                        </>
                      )}
                    </button>
                  </div>
                  
                  {errors.general && (
                    <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                      {errors.general}
                    </div>
                  )}
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="input-label">Full Name</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing.profile}
                          className={`input-field pl-10 ${isEditing.profile ? '' : 'bg-gray-50'} ${errors.name ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="input-label">Email Address</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={userData.email}
                          disabled
                          className="input-field pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="input-label">Phone Number</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing.profile}
                          className={`input-field pl-10 ${isEditing.profile ? '' : 'bg-gray-50'} ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="input-label">Address</label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                          <FiMapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          id="address"
                          name="address"
                          rows="3"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing.profile}
                          className={`input-field pl-10 ${isEditing.profile ? '' : 'bg-gray-50'} ${errors.address ? 'border-red-500' : ''}`}
                        ></textarea>
                      </div>
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>
                    
                    {isEditing.profile && (
                      <div>
                        <button
                          type="submit"
                          className="btn-primary w-full flex justify-center items-center"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FiSave className="mr-2" />
                          )}
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Password</h2>
                    <button
                      onClick={() => toggleEditing('password')}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      {isEditing.password ? 'Cancel' : (
                        <>
                          <FiEdit className="mr-1" /> Change
                        </>
                      )}
                    </button>
                  </div>
                  
                  {isEditing.password ? (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="input-label">Current Password</label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="input-label">New Password</label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="input-label">Confirm New Password</label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-primary w-full flex justify-center items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <FiSave className="mr-2" />
                        )}
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  ) : (
                    <p className="text-gray-600">
                      To change your password, click the "Change" button above.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Your Applications</h2>
                  
                  <ul className="space-y-4 mt-6">
                    <li className="border-b border-gray-200 pb-4">
                      <a href="/application/1" className="block hover:text-primary-600 transition-colors">
                        <p className="font-medium">Bruno</p>
                        <p className="text-sm text-gray-500">Submitted on April 10, 2025</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                          Home Visit Scheduled
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/application/2" className="block hover:text-primary-600 transition-colors">
                        <p className="font-medium">Lucy</p>
                        <p className="text-sm text-gray-500">Submitted on March 28, 2025</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                          Completed
                        </span>
                      </a>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2">SMS Notifications</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You will receive SMS updates about your adoption applications at {userData.phone}.
                    </p>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked
                        className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">Receive SMS notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}