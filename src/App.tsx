import React from 'react';
import { useApp } from './context/AppContext';
import { DevPreviewBar } from './components/common/DevPreviewBar';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { IntegrationChecklistModal } from './components/common/IntegrationChecklistModal';

// Customer Components
import { CustomerHome } from './components/customer/CustomerHome';
import { CustomerRequestsView } from './components/customer/CustomerRequestsView';
import { CustomerJobTracker } from './components/customer/CustomerJobTracker';
import { CustomerAccountView } from './components/customer/CustomerAccountView';
import { PostRequestModal } from './components/customer/PostRequestModal';
import { BookingConfirmModal } from './components/customer/BookingConfirmModal';
import { ProviderProfileModal } from './components/customer/ProviderProfileModal';

// Provider Components
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { ProviderOffersView } from './components/provider/ProviderOffersView';
import { ProviderJobsView } from './components/provider/ProviderJobsView';
import { ProviderEarningsView } from './components/provider/ProviderEarningsView';
import { ProviderProfileView } from './components/provider/ProviderProfileView';
import { QuoteComposerModal } from './components/provider/QuoteComposerModal';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';

// Chat & Auth Modals
import { ChatModal } from './components/chat/ChatModal';
import { PhoneAuthModal } from './components/auth/PhoneAuthModal';
import { APP_CONFIG } from './config';

export function AppContent() {
  const { role, activeCustomerTab, activeProviderTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F8] text-[#151515] pb-20 sm:pb-8">
      
      {/* Dev Switcher Bar */}
      <DevPreviewBar />

      {/* Main Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <main className="flex-1 flex flex-col">
        {role === 'customer' && (
          <>
            {activeCustomerTab === 'home' && <CustomerHome />}
            {activeCustomerTab === 'requests' && <CustomerRequestsView />}
            {activeCustomerTab === 'offers' && <CustomerRequestsView />}
            {activeCustomerTab === 'messages' && <CustomerJobTracker />}
            {activeCustomerTab === 'account' && <CustomerAccountView />}
          </>
        )}

        {role === 'provider' && (
          <>
            {activeProviderTab === 'nearby' && <ProviderDashboard />}
            {activeProviderTab === 'offers' && <ProviderOffersView />}
            {activeProviderTab === 'jobs' && <ProviderJobsView />}
            {activeProviderTab === 'earnings' && <ProviderEarningsView />}
            {activeProviderTab === 'profile' && <ProviderProfileView />}
          </>
        )}

        {role === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Modals & Dialogs */}
      <PostRequestModal />
      <QuoteComposerModal />
      <BookingConfirmModal />
      <ProviderProfileModal />
      <ChatModal />
      <IntegrationChecklistModal />
      <PhoneAuthModal />

      {/* Mobile Navigation */}
      <BottomNav />

      {/* Minimal Footer */}
      <footer className="hidden sm:block border-t border-gray-200 bg-white py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#151515]">{APP_CONFIG.brandName}</span>
            <span>—</span>
            <span>inDrive-Style Customer Controlled Services Marketplace</span>
          </div>
          <div>
            <span>Default Market: <b>Islamabad & Rawalpindi, Pakistan (PKR)</b></span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return <AppContent />;
}
