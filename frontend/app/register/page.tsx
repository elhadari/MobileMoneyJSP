"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2'; // Import Swal

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: 'Création du compte...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "USER"
        })
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS SWAL
        Swal.fire({
          icon: 'success',
          title: 'Félicitations !',
          text: 'Votre compte a été créé avec succès.',
          confirmButtonColor: '#003366',
          background: '#ffcc00',
          color: '#003366'
        }).then(() => {
          router.push('/login');
        });
        
        setFormData({ username: '', email: '', password: '' }); 
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oups...',
          text: data.error || 'Une erreur est survenue.',
          confirmButtonColor: '#003366'
        });
      }
    } catch (error) {
      // ERROR SERVEUR
      Swal.fire({
        icon: 'error',
        title: 'Erreur Serveur',
        text: 'Impossible de contacter le backend. Vérifiez votre connexion.',
        confirmButtonColor: '#003366'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#003366] overflow-hidden flex font-sans">
      <div className="hidden lg:block w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ffcc00] opacity-10 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop" 
          className="h-full object-cover grayscale opacity-50"
          alt="Style"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#003366] z-20"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative">
        <div className="absolute right-[-5%] bottom-[-5%] w-[40%] h-[40%] bg-[#ffcc00] rounded-full blur-[120px] opacity-20"></div>

        <div className="w-full max-w-lg bg-[#ffcc00] rounded-[50px] p-10 shadow-2xl z-10 border-l-8 border-white/20">
          <div className="mb-8">
            <h2 className="text-[#003366] text-4xl font-black uppercase tracking-tighter leading-none mb-2">Rejoignez <br/> <span className="italic">l'aventure.</span></h2>
            <p className="text-[#003366]/60 font-bold italic">Créez votre compte YAS en quelques secondes.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="md:col-span-2 relative">
              <User className="absolute left-4 top-3.5 text-[#003366]/40" size={18} />
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nom" 
                required
                className="w-full bg-white/50 border-none rounded-2xl py-3 pl-10 text-[#003366] font-bold outline-none focus:ring-2 focus:ring-[#003366]" 
              />
            </div>
            <div className="md:col-span-2 relative">
              <Mail className="absolute left-4 top-3.5 text-[#003366]/40" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
                required
                className="w-full bg-white/50 border-none rounded-2xl py-3 pl-10 text-[#003366] font-bold outline-none focus:ring-2 focus:ring-[#003366]" 
              />
            </div>
            <div className="md:col-span-2 relative">
              <Lock className="absolute left-4 top-3.5 text-[#003366]/40" size={18} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe" 
                required
                className="w-full bg-white/50 border-none rounded-2xl py-3 pl-10 text-[#003366] font-bold outline-none focus:ring-2 focus:ring-[#003366]" 
              />
            </div>

            <button 
              disabled={loading}
              className="md:col-span-2 bg-[#003366] text-[#ffcc00] font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Chargement..." : "S'inscrire maintenant"}
            </button>
          </form>

          <p className="mt-6 text-center text-[#003366]/60 text-sm font-bold">
            Déjà inscrit ?{' '}
            <Link href="/login" className="text-[#003366] underline decoration-2 underline-offset-4">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}