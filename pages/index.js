import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
      <div style={styles.container}>
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Aap-FT
            </span>
          </h1>
          <p className="text-2xl text-white/70 mb-2">Financial Tools</p>
          <p className="text-white/50 mb-8">Advanced financial analysis and retirement planning</p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass p-6 rounded-lg">
              <BarChart3 className="mx-auto mb-3 text-blue-400" size={32} />
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-white/60">Track income, expenses & savings</p>
            </div>

            <div className="glass p-6 rounded-lg">
              <TrendingUp className="mx-auto mb-3 text-cyan-400" size={32} />
              <h3 className="font-semibold mb-2">Retirement</h3>
              <p className="text-sm text-white/60">Project your financial future</p>
            </div>

            <div className="glass p-6 rounded-lg">
              <Settings className="mx-auto mb-3 text-green-400" size={32} />
              <h3 className="font-semibold mb-2">Settings</h3>
              <p className="text-sm text-white/60">Customize benchmark data</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/dashboard">
            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
          </Link>

          {/* Time */}
          {time && (
            <p style={styles.time} className="mt-12">
              {time}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#09090b',
    padding: '2rem',
  },
  time: {
    fontSize: '0.9rem',
    color: '#a1a1a1',
