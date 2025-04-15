import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import RegisterForm from '../../../components/RegisterForm';

export default async function RegisterPage() {
  const session = await getServerSession();
  
  if (session) {
    redirect('/home');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
            <p className="text-gray-600 mt-2">
              Join the AdoptAPaw community and find your perfect companion.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <RegisterForm />
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}