/**
 * Home Page - Landing
 * Modern bright landing page with feature showcase
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, TrendingUp, Settings, ArrowRight } from 'lucide-react';

export default function Home() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return (
    <>
      <Head>
        <title>Aap-FT</title>
      </Head>
      <div className="min-h-screen bg-white">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 15%, rgba(255, 255, 255, 0) 40%)',
          }}
        />

        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="max-w-2xl text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image src="/icon-512.png" alt="Aap-FT Logo" width={120} height={120} className="rounded-3xl shadow-lg" />
            </div>
            <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
              Aap-FT
            </h1>
            <p className="mt-4 text-2xl font-semibold text-gray-900">Financial Tools</p>
            <p className="mt-3 text-lg text-gray-600">
              Advanced financial analysis and retirement planning
            </p>

            {/* Features Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="card p-6">
                <BarChart3 className="mx-auto mb-3 text-brand-primary" size={32} />
                <h3 className="font-semibold text-gray-900">Household Budget</h3>
                <p className="mt-2 text-sm text-gray-600">Track income, expenses & savings</p>
              </div>

              <div className="card p-6">
                <TrendingUp className="mx-auto mb-3 text-brand-secondary" size={32} />
                <h3 className="font-semibold text-gray-900">Retirement</h3>
                <p className="mt-2 text-sm text-gray-600">Project your financial future</p>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <button className="mt-12 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-4 font-semibold text-white shadow-lg shadow-brand-primary/30 transition-all hover:shadow-lg hover:shadow-brand-primary/50 active:scale-95">
                <span>Get Started</span>
                <ArrowRight size={20} />
              </button>
            </Link>

            {/* Time Display */}
            {time && <p className="mt-12 text-sm text-gray-500">{time}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

