import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';

export default async function LandingPage() {
  const session = await getServerSession();
  
  if (session) {
    redirect('/home');
  }
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <HeroSection />
      
      <section id="about" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-heading">About AdoptAPaw</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect loving homes with dogs in need of adoption across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Love & Care</h3>
              <p className="text-gray-600">
                Every dog deserves a loving home. We strive to match each dog with the perfect family.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Thorough Verification</h3>
              <p className="text-gray-600">
                We ensure all adopters are properly verified to guarantee the safety and well-being of our dogs.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Support Network</h3>
              <p className="text-gray-600">
                Join our community of dog lovers, with ongoing support for all adopters.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-heading">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple 4-step process to connect you with your new best friend.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-16">
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-3 text-primary-600">1. Create an account</h3>
                    <p className="text-gray-600">
                      Register with your details and verify your identity with Aadhaar.
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold z-10 hidden md:flex">1</div>
                
                <div className="md:w-1/2 md:pl-12">
                  <div className="h-full w-full rounded-xl bg-gray-200 hidden md:block">
                    <div className="relative h-64 w-full flex items-center justify-center text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 md:text-left">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-3 text-primary-600">2. Browse Available Dogs</h3>
                    <p className="text-gray-600">
                      Explore our collection of dogs looking for a loving home.
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold z-10 hidden md:flex">2</div>
                
                <div className="md:w-1/2 md:pr-12">
                  <div className="h-full w-full rounded-xl bg-gray-200 hidden md:block">
                    <div className="relative h-64 w-full flex items-center justify-center text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" viewBox="0 3 12 16">
                        <path d="M6.333 5.686c0 .31.083.581.27.814.448.551 1.113.37 1.847.37 0 0 .047-.005.277.005.23.01.374.464.483.707.067.155.13.3.196.449.057.129.122.282.265.443.083.091.106.189.106.297 0 .148-.055.277-.202.373-.16.105-.352.175-.515.235-.191.069-.406.122-.625.156-.053.083-.168.125-.294.125-.132 0-.26-.043-.352-.125-.168-.083-.368-.185-.504-.235-.137-.058-.238-.105-.356-.18-.098-.058-.208-.112-.34-.138-.019 0-.168-.018-.202-.18-.238.093-.585.138-.832.138-.527 0-1.112-.156-1.578-.555-.108-.09-.212-.19-.313-.299A3.294 3.294 0 0 1 3.62 8.88c0-1.08.578-1.829 1.152-2.311.257-.216.528-.356.79-.448.195-.066.399-.107.61-.107.152 0 .208.032.278.08.129.108.231.283.231.506zm-1.055 4.94c.155 0 .679.01.98.146.345.17.486.39.486.546 0 .203-.205.311-.38.311-.235 0-.375-.096-.586-.222-.214-.129-.532-.272-.758-.272-.157 0-.369.045-.5.211-.126.155-.232.375-.252.552-.025.177-.007.553.11.705.076.94.241.183.433.183.175 0 .357-.046.582-.138.252-.102.532-.235.777-.289.111-.03.237-.048.391-.048.394 0 .816.143 1.072.517.261.376.356.934.296 1.493-.067.606-.343 1.11-.678 1.433-.343.326-.706.548-1.072.623-.452.094-.878.086-1.151.086-.22 0-.455.004-.687.04-.198.03-.416.084-.608.175-.194.098-.356.226-.417.413-.048.17.025.313.12.393.1.088.288.138.466.138.425 0 .848-.043 1.274-.157.432-.12.905-.316 1.15-.554.343-.324.574-.62.574-.813 0-.117-.053-.17-.137-.17-.083 0-.18.045-.3.152-.121.111-.304.235-.548.318-.232.082-.487.138-.814.138-.254 0-.516-.037-.725-.136-.211-.094-.379-.224-.485-.387-.106-.17-.143-.358-.143-.56 0-.157.038-.313.105-.452.07-.142.186-.266.334-.363.14-.092.33-.158.544-.224.224-.065.444-.097.616-.097z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-3 text-primary-600">3. Home Visit Verification</h3>
                    <p className="text-gray-600">
                      Our NGO partners will visit your home to ensure it's suitable for your chosen dog.
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold z-10 hidden md:flex">3</div>
                
                <div className="md:w-1/2 md:pl-12">
                  <div className="h-full w-full rounded-xl bg-gray-200 hidden md:block">
                    <div className="relative h-64 w-full flex items-center justify-center text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 md:text-left">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-3 text-primary-600">4. Finalize Adoption</h3>
                    <p className="text-gray-600">
                      Visit our office to complete paperwork and welcome your new family member home!
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold z-10 hidden md:flex">4</div>
                
                <div className="md:w-1/2 md:pr-12">
                  <div className="h-full w-full rounded-xl bg-gray-200 hidden md:block">
                    <div className="relative h-64 w-full flex items-center justify-center text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.307a2.5 2.5 0 0 0 .65 1.682l.82.94a3 3 0 0 1 .779 2.015v5.557h1.5V11.443a3 3 0 0 0-.779-2.015l-.82-.94a1 1 0 0 1-.26-.673V4.5A1 1 0 0 1 4.5 3.5h7a1 1 0 0 1 1 1v2.307a1 1 0 0 1-.26.673l-.82.94a3 3 0 0 0-.779 2.015v1.557a2 2 0 1 0 4 0v-1.557a3 3 0 0 0-.779-2.015l-.82-.94a2.5 2.5 0 0 0-.65-1.682V4.5A2.5 2.5 0 0 0 11.5 2h-7ZM14 10.443v1.557a3 3 0 0 1-6 0v-1.557a4 4 0 0 1 1.039-2.686l.82-.94c.22-.252.361-.584.361-.934V4.5c0-.969.688-1.778 1.603-1.965A3.489 3.489 0 0 1 11.5 1h-7c-.587 0-1.137.158-1.622.431C3.78 1.639 4.69 2.5 4.5 3.5v2.307c0 .35.142.682.361.934l.82.94a4 4 0 0 1 1.039 2.686v5.557a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2h1a3 3 0 0 0 3-3v-2.557Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/auth/register" className="btn-primary text-lg py-3 px-8">
              Get Started
            </Link>
          </div>
        </div>
      </section>
      
      <section id="contact" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-heading">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help you on your adoption journey.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 bg-primary-600 text-white">
                <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                <p className="mb-6">
                  We'd love to hear from you. Reach out with any questions about adoption or our process.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                      <p className="font-medium">Address</p>
                      <p>403/9, Road No. 35, Aditya Enclave, Venkatagiri, Jubilee Hills, Hyderabad, Telangana 500033</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p className="font-medium">Email</p>
                      <p>info@bluecrossofhyd.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>+91 88866 76074</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="input-label">Full Name</label>
                    <input type="text" id="name" className="input-field" placeholder="Your Name" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="input-label">Email Address</label>
                    <input type="email" id="email" className="input-field" placeholder="Your Email" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="input-label">Subject</label>
                    <input type="text" id="subject" className="input-field" placeholder="Subject" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="input-label">Message</label>
                    <textarea id="message" rows="4" className="input-field" placeholder="Your Message"></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}