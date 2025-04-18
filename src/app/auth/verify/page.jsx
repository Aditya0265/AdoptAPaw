import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import VerificationForm from '../../../components/VerificationForm';

export default function VerificationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Aadhaar Verification</h1>
            <p className="text-gray-600 mt-2">
              We're verifying your identity to ensure a secure adoption process.
            </p>
          </div>
          
          <VerificationForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}