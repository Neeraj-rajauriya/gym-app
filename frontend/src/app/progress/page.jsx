'use client';
export const dynamic = "force-dynamic";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function ProgressPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId; // Make sure your JWT includes userId
      
      if (userId) {
        router.push(`/progress/${userId}`);
      } else {
        throw new Error('User ID not found in token');
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading your progress...</h1>
        <p>Redirecting you to your personal progress page</p>
      </div>
    </div>
  );
}