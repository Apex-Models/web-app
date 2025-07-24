"use client";
import Header from '@/components/UI/Header';
import { UserContextProvider } from '@/components/context/userContext';

export default function Template({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <UserContextProvider>
        <Header />
        {children}
      </UserContextProvider>
    </>
  );
} 