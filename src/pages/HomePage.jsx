// pages/HomePage.jsx
import React, { useEffect } from "react";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Animation on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      icon: "💰",
      title: "Bulk Savings",
      desc: "Order raw materials in bulk at discounted prices directly from local sellers.",
      color: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      border: "border-amber-200",
    },
    {
      icon: "📍",
      title: "Local Discovery",
      desc: "Find nearby sellers to reduce delivery time, costs, and support your community.",
      color: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-100",
      border: "border-orange-200",
    },
    {
      icon: "📦",
      title: "Real-time Tracking",
      desc: "Vendors can easily track, manage, and complete their orders in real time.",
      color: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-100",
      border: "border-rose-200",
    },
    {
      icon: "🤝",
      title: "Trusted Network",
      desc: "Verified sellers and secure payments for peace of mind.",
      color: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      border: "border-emerald-200",
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      desc: "Optimized logistics for quicker turnaround times.",
      color: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      border: "border-blue-200",
    },
    {
      icon: "🎯",
      title: "Best Prices",
      desc: "Competitive rates with exclusive bulk discounts.",
      color: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      border: "border-purple-200",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      desc: "Sign up as a vendor or seller in just 2 minutes.",
      icon: "🔐",
    },
    {
      number: "02",
      title: "Place Order",
      desc: "Browse products and place bulk orders instantly.",
      icon: "🛒",
    },
    {
      number: "03",
      title: "Quick Delivery",
      desc: "Track your order until it reaches you.",
      icon: "🚚",
    },
    {
      number: "04",
      title: "Confirm & Rate",
      desc: "Confirm delivery and rate your experience.",
      icon: "⭐",
    },
  ];

  const testimonials = [
    {
      quote: "BazaarLink helped me reduce costs by 35%! Best platform for small business owners.",
      name: "Ramesh Kumar",
      role: "Street Vendor, Delhi",
      rating: 5,
    },
    {
      quote: "Finally a platform that understands local sellers. The order flow is seamless!",
      name: "Priya Sharma",
      role: "Raw Material Seller, Mumbai",
      rating: 5,
    },
    {
      quote: "My business has grown 2x since joining BazaarLink. Highly recommended!",
      name: "Ahmed Khan",
      role: "Restaurant Owner, Hyderabad",
      rating: 5,
    },
  ];

  const stats = [
    { value: "500+", label: "Active Sellers", icon: "🏪" },
    { value: "10,000+", label: "Orders Completed", icon: "✅" },
    { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
    { value: "24/7", label: "Customer Support", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-rose-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center fade-up">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 fade-up">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Everything you need in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                one platform
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Built for vendors and sellers who want a faster, smarter way to trade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className={`group bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 fade-up`}
              >
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14 fade-up">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              How it{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                Works
              </span>
            </h2>
            <p className="text-gray-500 mt-3">Get started in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative fade-up">
                <div className="text-center">
                  <div className="relative mb-4 inline-block">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl mx-auto border-2 border-orange-100">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 fade-up">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Loved by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                business owners
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 fade-up"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-orange-100 text-base sm:text-lg mb-8">
            Join thousands of businesses already using BazaarLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started Free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-200"
            >
              Login to Account
            </Link>
          </div>
          <p className="text-orange-100/80 text-xs mt-6">
            🎉 No credit card required • Free forever
          </p>
        </div>
      </section>



      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default HomePage;