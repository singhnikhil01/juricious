'use client';

import React from 'react';
import { AppProvider, useApp } from '../lib/AppContext';
import { PublicSite } from '../components/PublicSite';
import { WaitlistPage } from '../components/WaitlistPage';
import { FeedbackPage } from '../components/FeedbackPage';
import { AdminArea } from '../components/AdminArea';
import { WaitlistModal } from '../components/WaitlistModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { ComingSoonModal } from '../components/ComingSoonModal';
import { CourtDiaryInteractiveModal } from '../components/CourtDiaryInteractiveModal';
import { SmsParserInteractiveModal } from '../components/SmsParserInteractiveModal';
import { CourtFeeCalculatorModal } from '../components/CourtFeeCalculatorModal';

function MainContent() {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'public' && <PublicSite />}
      {currentView === 'waitlist' && <WaitlistPage />}
      {currentView === 'feedback' && <FeedbackPage />}
      {currentView === 'admin' && <AdminArea />}

      {/* Global Interactive Modals */}
      <WaitlistModal />
      <FeedbackModal />
      <ComingSoonModal />
      <CourtDiaryInteractiveModal />
      <SmsParserInteractiveModal />
      <CourtFeeCalculatorModal />
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#FF9933] selection:text-[#0A0A0A]">
        <MainContent />
      </div>
    </AppProvider>
  );
}
