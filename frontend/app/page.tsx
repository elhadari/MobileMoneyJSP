"use client";

import React from 'react';
import { Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#003366] overflow-hidden flex flex-col font-sans relative">
      <nav className="relative z-30 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#ffcc00] p-2 rounded-xl rotate-3 shadow-lg border border-white/20">
            <span className="text-[#003366] font-black text-2xl italic tracking-tighter">yas</span>
          </div>
        </div>
       <div className="flex gap-4">
        {/* Link mankany amin'ny Login */}
        <Link href="/login">
          <button className="px-6 py-2 font-bold text-white border-2 border-white/20 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-90">
            Connexion
          </button>
        </Link>
        
        {/* Link mankany amin'ny Register */}
        <Link href="/register">
          <button className="relative px-6 py-2 font-bold text-[#003366] bg-[#ffcc00] rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 overflow-hidden group">
            <span className="relative z-10">S'inscrire</span>
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:left-[100%] transition-all duration-500"></span>
          </button>
        </Link>
      </div>
      </nav>

      <main className="flex-1 relative flex items-center">
        <div className="absolute left-0 bottom-0 w-1/2 h-full z-0">
          <div className="w-full h-full bg-gradient-to-r from-[#003366] via-transparent to-transparent absolute z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
            alt="Workspace" 
            className="h-full w-full object-cover grayscale opacity-20"
          />
        </div>

        <div className="absolute right-10 top-[10%] bottom-[10%] w-[50%] bg-[#ffcc00] rounded-[60px] rotate-[-5deg] z-10 shadow-2xl border-l-8 border-white/10"></div>

        <div className="container mx-auto px-8 relative z-20 flex justify-end items-center h-full pb-10">
          <div className="max-w-xl text-right md:text-left md:ml-auto pr-10">
            <h1 className="text-white text-3xl md:text-5xl font-black leading-[0.9] mb-3 tracking-tighter">
              BIENVENUE SUR <br />
              <span className="text-[#003366]">YAS SERVICE.</span>
            </h1>
            
            <p className="text-[#003366]/80 text-sm md:text-base mb-10 max-w-sm ml-auto md:ml-0 font-medium italic leading-tight">
              Ravi de vous revoir. Prêt à propulser vos projets vers de nouveaux sommets technologiques ?
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-end md:justify-start items-center">
              <button className="group relative px-6 py-3 bg-[#003366] text-[#ffcc00] font-black rounded-xl text-xl 
                hover:bg-[#001a33] transition-all duration-300 shadow-2xl
                hover:-translate-y-2 active:scale-95 flex items-center gap-4 overflow-hidden">
                <span className="relative z-10 uppercase">Découvrir YAS</span>
                <Zap className="relative z-10 fill-[#ffcc00]" size={20} />
              </button>

              <button className="group px-6 py-3 border-4 border-[#003366] text-[#003366] font-extrabold rounded-xl text-lg
                hover:bg-[#003366] hover:text-[#ffcc00] transition-all duration-500
                flex items-center gap-3 active:scale-90 bg-white/10 backdrop-blur-sm">
                <Globe size={18} />
                <span>NOS SERVICES</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}