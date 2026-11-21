import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingWizardModal from './components/BookingWizardModal';
import AvailabilityModal from './components/AvailabilityModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import PortfolioStoryModal from './components/PortfolioStoryModal';
import PortalDirectoryModal from './components/PortalDirectoryModal';
import AuthModal from './components/AuthModal';

import PublicWebsite from './portals/public/PublicWebsite';
import ClientPortal from './portals/client/ClientPortal';
import PhotographerPortal from './portals/photographer/PhotographerPortal';
import AdminPortal from './portals/admin/AdminPortal';

function MainApp() {
  const { persona, setPersona, loading, currentUser } = useApp();

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [directoryModalOpen, setDirectoryModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-zinc-400 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center animate-pulse">
          <span className="font-serif font-bold text-xl">L</span>
        </div>
        <div className="text-sm tracking-wider font-light">Loading Lumen &amp; Co. Atelier ERP...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Universal Navbar with Role-Protected Portal Gating */}
      <Navbar
        onOpenBooking={() => setBookingModalOpen(true)}
        onOpenAvailability={() => setAvailabilityModalOpen(true)}
        onOpenDirectory={() => setDirectoryModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCorporate={() => {
          const el = document.getElementById('corporate-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main View Portals */}
      <main className="flex-1 w-full">
        {persona === 'public' && (
          <PublicWebsite
            onOpenBooking={() => setBookingModalOpen(true)}
            onOpenAvailability={() => setAvailabilityModalOpen(true)}
            onSelectService={svc => setSelectedService(svc)}
            onSelectStory={story => setSelectedStory(story)}
          />
        )}

        {/* Client Portal: Public View Allowed for Everyone */}
        {persona === 'client' && (
          <div className="w-full">
            {!currentUser && (
              <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 border-b border-cyan-500/30 px-4 py-2.5 text-center text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="font-semibold text-cyan-300">
                    ✨ Client Portal &bull; Public Preview View
                  </span>
                  <span className="text-zinc-400 text-[11px] hidden md:inline">
                    (Active Wedding Booking #PHOTO1024 &bull; Rahul Sharma &amp; Priya Patel)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-[11px] hidden sm:inline">
                    Explore gallery selection, retouch proofing, 4K film approval, album flipbook &amp; balance payment
                  </span>
                  <button
                    onClick={() => setPersona('public')}
                    className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[10px] font-bold border border-zinc-700 transition-all cursor-pointer"
                  >
                    &larr; Back to Website
                  </button>
                </div>
              </div>
            )}
            <ClientPortal />
          </div>
        )}

        {/* Photographer Portal: NOT visible to everyone, ONLY seen by Admin */}
        {persona === 'photographer' && (
          currentUser?.role === 'ADMIN' ? (
            <div className="w-full">
              <div className="bg-purple-950/60 border-b border-purple-500/30 px-4 py-2 text-center text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold">👑 Admin Master View:</span>
                  <span>Inspecting Lead Photographer Portal (Amit Sharma &bull; #PHOTO1024 Shoot Console)</span>
                </div>
                <button
                  onClick={() => setPersona('admin')}
                  className="px-3 py-0.5 rounded-full bg-purple-700 hover:bg-purple-600 text-white text-[10px] font-bold"
                >
                  Return to Admin ERP &rarr;
                </button>
              </div>
              <PhotographerPortal />
            </div>
          ) : (
            <div className="max-w-md mx-auto my-24 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-5 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                🔒
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Admin Restricted Portal
                </span>
                <h2 className="text-2xl font-bold font-serif text-white">Photographer Portal Restricted</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The Photographer Portal is strictly hidden from public view. Only the Studio Admin can view and manage photographer assignments, gear checkouts, shoot telemetry, and crew payroll.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Sign In as Studio Admin
                </button>
                <button
                  onClick={() => setPersona('public')}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-all cursor-pointer border border-zinc-800"
                >
                  Return to Public Website
                </button>
              </div>
            </div>
          )
        )}

        {/* Admin Portal: Strictly visible to Admin */}
        {persona === 'admin' && (
          currentUser?.role === 'ADMIN' ? (
            <AdminPortal />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                🔒
              </div>
              <h2 className="text-xl font-bold font-serif text-white">Studio Admin Access Required</h2>
              <p className="text-xs text-zinc-400">
                Only authenticated Studio Administrators can access the production ERP and financial telemetry.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase"
              >
                Admin Sign In
              </button>
            </div>
          )
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <BookingWizardModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      <AvailabilityModal
        isOpen={availabilityModalOpen}
        onClose={() => setAvailabilityModalOpen(false)}
        onProceedToBook={() => setBookingModalOpen(true)}
      />

      <PortalDirectoryModal
        isOpen={directoryModalOpen}
        onClose={() => setDirectoryModalOpen(false)}
      />

      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        onCheckAvailability={() => setAvailabilityModalOpen(true)}
        onRequestQuote={() => setBookingModalOpen(true)}
      />

      <PortfolioStoryModal
        story={selectedStory}
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
