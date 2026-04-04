import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import illustration from '../assets/bazaarlink-hero-img.png';

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
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-rose-50 pt-16">

      {/* ── Decorative background blobs ── */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-gradient-to-bl from-orange-200/40 to-rose-200/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/50 to-orange-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16 py-16 lg:py-24">

          {/* ── Left: Content ── */}
          <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Bulk ordering made elegant
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
              Move faster on{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  bulk orders,
                </span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-orange-100 -z-0 rounded" />
              </span>{" "}
              without the usual chaos.
            </h1>

            {/* Subtext */}
            <p className="text-gray-500 text-lg leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
              BulkBuddy helps vendors discover local sellers, place bulk requests, and track orders
              with a cleaner, simpler workflow.
            </p>

            {/* Highlights */}
            <div
              aria-label="Platform highlights"
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8"
            >
              {["🏪 Local sourcing", "⚡ Fast order flow", "🤝 Vendor & seller friendly"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <button
                onClick={() => handleProtectedClick('/bulk-order')}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-orange-200 hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Place Order
              </button>

              <button
                onClick={() => handleProtectedClick('/nearby')}
                className="group flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Nearby Sellers
              </button>
            </div>

            {/* Stats */}
            <div
              aria-label="Platform benefits"
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {[
                {
                  icon: "📍",
                  label: "Local",
                  desc: "Discover nearby sellers quickly",
                  color: "border-amber-200 bg-amber-50",
                },
                {
                  icon: "✨",
                  label: "Clean",
                  desc: "Simple flow for orders & tracking",
                  color: "border-emerald-200 bg-emerald-50",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`flex items-start gap-3 border ${stat.color} rounded-xl px-4 py-3 flex-1 max-w-[220px] mx-auto sm:mx-0`}
                >
                  <span className="text-xl mt-0.5">{stat.icon}</span>
                  <div>
                    <strong className="block text-sm font-bold text-gray-900">{stat.label}</strong>
                    <span className="text-xs text-gray-500 leading-tight">{stat.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-200 to-rose-200 blur-xl opacity-40 scale-105 pointer-events-none" />

              {/* Card frame */}
              <div className="relative bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-100/50 overflow-hidden p-3">
                <img
                  src={illustration}
                  alt="Bulk order illustration"
                  className="w-full h-full object-cover rounded-2xl"
                  loading="eager"
                />

                {/* Floating badge on image */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm border border-orange-100 rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
                  <span className="text-lg">🛒</span>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">New order</p>
                    <p className="text-xs font-bold text-gray-800">Bulk request sent</p>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Status</p>
                    <p className="text-xs font-bold text-emerald-700">Order confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;