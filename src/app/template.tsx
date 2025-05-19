"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/UI/Header';
import { UserContextProvider } from '@/components/context/userContext';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <>
      <UserContextProvider>
        { pathname !== '/login' && pathname !== '/register' && <Header /> }
        {children}
      </UserContextProvider>
    </>
  );
} 