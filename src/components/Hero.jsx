import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import bgImage from '../assets/bazarlink-bg.jpg';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (!user) {
      toast.error('Please login to access this feature');
      return;
    }
    navigate(path);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      
      {/* Responsive Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={bgImage} 
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Light overlay for text contrast */}
      {/* <div className="absolute inset-0 bg-white/40" /> */}
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 py-12 md:py-16 lg:py-20">

          {/* Left Content */}
          <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/10 backdrop-blur-sm border border-orange-200 text-orange-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="font-medium">✨ India's fastest growing B2B marketplace</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight sm:leading-[1.1] mb-4 sm:mb-6">
              Connect. Order.
              <span className="block text-orange-500 mt-1 sm:mt-2">
                Grow your business.
              </span>
            </h1>

    
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-10 sm:mb-12">
              <button
                onClick={() => handleProtectedClick('/bulk-order')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Start ordering 🚀
              </button>
              <button
                onClick={() => handleProtectedClick('/nearby')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white transition-all duration-200 text-sm sm:text-base"
              >
                Explore sellers →
              </button>
            </div>

 
          </div>

          {/* Right Side - Order Card */}
          <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 p-5 sm:p-6 shadow-xl ml-auto lg:ml-8">
              
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎯</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Start your journey</h3>
                <p className="text-gray-500 text-xs mb-5 sm:mb-6">
                  Get access to exclusive bulk deals
                </p>
              </div>
              
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 text-sm sm:text-base"
              >
                Create free account →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-gray-500 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
        
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;