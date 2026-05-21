import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

function Layout({ title, children }: LayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
}

export default Layout;
