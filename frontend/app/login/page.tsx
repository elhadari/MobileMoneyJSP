"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ login: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  
    const { type, value } = e.target;
    setFormData({ ...formData, [type === 'email' ? 'login' : 'password']: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: 'Connexion...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);   

        Swal.fire({
          icon: 'success',
          title: 'Bienvenue !',
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
          background: '#ffcc00',
          color: '#003366'
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: data.error || 'Identifiants incorrects',
          background: '#fff',
          confirmButtonColor: '#003366'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur Serveur',
        text: 'Impossible de contacter le backend.',
        confirmButtonColor: '#003366'
      });
    }
  };

  return (
    <div className="h-screen w-full bg-[#003366] overflow-hidden flex items-center justify-center font-sans relative">
      {/* Background Decor */}
      <div className="absolute left-[-10%] top-[-10%] w-[40%] h-[60%] bg-[#ffcc00] rounded-[60px] rotate-[15deg] opacity-20 blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#ffcc00] rounded-[40px] p-10 shadow-2xl border-t-8 border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#003366] p-3 rounded-2xl rotate-3 mb-4">
              <span className="text-[#ffcc00] font-black text-3xl italic tracking-tighter">yas</span>
            </div>
            <h2 className="text-[#003366] text-2xl font-black uppercase tracking-tight">Connexion</h2>
            <p className="text-[#003366]/60 text-sm font-bold italic">Ravi de vous revoir !</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-[#003366]/40" size={20} />
              <input 
                type="email" 
                required
                value={formData.login}
                onChange={handleChange}
                placeholder="Email" 
                className="w-full bg-white/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-[#003366] font-bold placeholder:text-[#003366]/30 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-[#003366]/40" size={20} />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe" 
                className="w-full bg-white/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-[#003366] font-bold placeholder:text-[#003366]/30 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
              />
            </div>

            <button type="submit" className="w-full bg-[#003366] text-[#ffcc00] font-black py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mt-6">
              SE CONNECTER <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#003366]/60 text-sm font-bold">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#003366] underline decoration-2 underline-offset-4">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}