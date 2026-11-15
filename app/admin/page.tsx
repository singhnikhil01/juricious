'use client';

import React from 'react';
import { AppProvider } from '../../lib/AppContext';
import { AdminArea } from '../../components/AdminArea';

export default function AdminPage() {
  return (
    <AppProvider>
      <AdminArea />
    </AppProvider>
  );
}
