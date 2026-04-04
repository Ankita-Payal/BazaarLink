// pages/HomePage.jsx
import React from "react";
import Hero from "../components/Hero";

const features = [
  {
    icon: "💰",
    title: "Bulk Savings",
    desc: "Order raw materials in bulk at discounted prices directly from local sellers.",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    icon: "📍",
    title: "Local Discovery",
    desc: "Find nearby sellers to reduce delivery time, costs, and support your community.",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    icon: "📦",
    title: "Order Tracking",
    desc: "Vendors can easily track, manage, and complete their orders in real time.",
    color: "bg-rose-50 border-rose-200",
    iconBg: "bg-rose-100",
  },
];

const steps = [
  {
    number: "01",
    title: "Login",
    desc: "Vendor or Seller logs in to the platform with their role-based account.",
    icon: "🔐",
  },
  {
    number: "02",
    title: "Place / Receive Orders",
    desc: "Vendors place bulk orders; Sellers receive and accept requests instantly.",
    icon: "🛒",
  },
  {
    number: "03",
    title: "Delivery & Confirm",
    desc: "Seller delivers within the agreed time, vendor confirms order completion.",
    icon: "✅",
  },
];

const testimonials = [
  {
    quote: "BulkBuddy helped me cut my costs by 30%. Highly recommended for every street vendor!",
    name: "Ramesh",
    role: "Street Vendor, Delhi",
    avatar: "R",
    color: "bg-orange-500",
  },
  {
    quote: "Finally a platform that supports local sellers. The order flow is simple and great!",
    name: "Priya",
    role: "Raw Material Seller, Mumbai",
    avatar: "P",
    color: "bg-rose-500",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <Hero />

      {/* ── Features ── */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-400" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              Platform Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                BulkBuddy?
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">
              Built for vendors and sellers who want a faster, smarter way to trade.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`group border ${f.color} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-11 h-11 ${f.iconBg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-rose-50 relative overflow-hidden">
        {/* Blob decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How It{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-orange-200 via-rose-200 to-orange-200 pointer-events-none" />

            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center relative">
                {/* Step circle */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-orange-200 shadow-md flex items-center justify-center text-2xl z-10 relative">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              What Our{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Quote icon */}
                <div className="text-orange-200 text-4xl font-serif leading-none mb-3 select-none">"</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 -mt-2">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-rose-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Ready to simplify your bulk orders?
          </h2>
          <p className="text-orange-100 text-sm mb-7">
            Join hundreds of vendors and sellers already using BulkBuddy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/signup"
              className="bg-white text-orange-600 font-bold text-sm px-6 py-3 rounded-xl shadow hover:shadow-lg hover:bg-orange-50 transition-all duration-200 active:scale-95"
            >
              Get Started Free
            </a>
            <a
              href="/login"
              className="border border-white/40 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              Login to Account
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">BB</span>
            </div>
            <span className="text-white font-bold text-sm">BulkBuddy</span>
          </div>

          <p className="text-xs text-center">
            &copy; {new Date().getFullYear()} BulkBuddy &bull; Made with ❤️ for street food heroes
          </p>

          <div className="flex items-center gap-4 text-xs">
            <a href="/about" className="hover:text-orange-400 transition-colors">About</a>
            <a href="/contact" className="hover:text-orange-400 transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;