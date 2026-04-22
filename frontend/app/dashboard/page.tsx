"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, Send, CheckCircle2, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function VerificationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); 
  const [selectedRole, setSelectedRole] = useState<'USER' | 'ADMIN' | null>(null);
  const [otp, setOtp] = useState('');
  const [backendOtp, setBackendOtp] = useState(''); 
  const [username, setUsername] = useState('Utilisateur');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
  }, []);

  // --- LOGIQUE HANDRESENA EMAIL ---
  const handleSendCode = async () => {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      Swal.fire('Erreur', 'Email non trouvé. Veuillez vous reconnecter.', 'error');
      router.push('/login');
      return;
    }

    Swal.fire({
      title: 'Envoi du code...',
      text: `Un code de vérification est envoyé à l'adresse : ${email}`,
      icon: 'info',
      showConfirmButton: false,
      timer: 2000,
      background: '#003366',
      color: '#ffcc00',
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch("http://localhost:8081/api/auth/send-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (res.ok) {
        setBackendOtp(data.otp); 
        setStep(2);
      } else {
        Swal.fire('Erreur', data.error || "Erreur lors de l'envoi", 'error');
      }
    } catch (err) {
      Swal.fire('Erreur', "Impossible de contacter le serveur", 'error');
    }
  };

  // --- LOGIQUE HANAMARINANA CODE ---
 const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = localStorage.getItem('userEmail');

    try {
      const res = await fetch("http://localhost:8081/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email, 
          otp: otp,
          sentOtp: backendOtp 
        }),
      });

      const data = await res.json();

      if (res.ok) {
      
        localStorage.setItem('userRole', data.role); 
        localStorage.setItem('userName', data.username);

        Swal.fire({
          icon: 'success',
          title: 'Accès autorisé',
          text: `Bienvenue, ${data.username}`,
          confirmButtonColor: '#003366',
        }).then(() => {
        
          if (data.role.toUpperCase() === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
           
            router.push('/client/profile');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Code incorrect',
          text: data.error || 'Veuillez vérifier le code envoyé par email.',
          confirmButtonColor: '#003366',
        });
      }
    } catch (err) {
      Swal.fire('Erreur', "Erreur de connexion au serveur", 'error');
    }
  };

  return (
    <div className="h-screen w-full bg-[#003366] flex items-center justify-center font-sans p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ffcc00] rounded-full blur-[120px] opacity-10"></div>
      
      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-10">
          <h1 className="text-white text-3xl font-black uppercase tracking-tight">Vérification de Sécurité</h1>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD USER */}
            <div 
              onClick={() => setSelectedRole('USER')}
              className={`group cursor-pointer p-8 rounded-[40px] border-4 transition-all duration-500 ${selectedRole === 'USER' ? 'bg-[#ffcc00] border-white scale-105' : 'bg-white/10 border-transparent hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${selectedRole === 'USER' ? 'bg-[#003366]' : 'bg-[#ffcc00]'}`}>
                  <User size={28} className={selectedRole === 'USER' ? 'text-[#ffcc00]' : 'text-[#003366]'} />
                </div>
                <h3 className={`text-2xl font-black uppercase whitespace-nowrap ${selectedRole === 'USER' ? 'text-[#003366]' : 'text-white'}`}>
                  Espace Client
                </h3>
              </div>
              <p className={`mt-2 font-medium text-sm ${selectedRole === 'USER' ? 'text-[#003366]/70' : 'text-white/60'}`}>
                Accédez à vos services personnels et gérez votre profil YAS.
              </p>
              {selectedRole === 'USER' && (
                <button onClick={(e) => { e.stopPropagation(); handleSendCode(); }} className="mt-6 w-full bg-[#003366] text-[#ffcc00] py-4 rounded-2xl font-black flex items-center justify-center gap-2 animate-bounce">
                  CONTINUER <Send size={18} />
                </button>
              )}
            </div>

            {/* CARD ADMIN */}
            <div 
              onClick={() => setSelectedRole('ADMIN')}
              className={`group cursor-pointer p-8 rounded-[40px] border-4 transition-all duration-500 ${selectedRole === 'ADMIN' ? 'bg-[#ffcc00] border-white scale-105' : 'bg-white/10 border-transparent hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${selectedRole === 'ADMIN' ? 'bg-[#003366]' : 'bg-[#ffcc00]'}`}>
                  <ShieldCheck size={28} className={selectedRole === 'ADMIN' ? 'text-[#ffcc00]' : 'text-[#003366]'} />
                </div>
                <h3 className={`text-2xl font-black uppercase whitespace-nowrap ${selectedRole === 'ADMIN' ? 'text-[#003366]' : 'text-white'}`}>
                  Administration
                </h3>
              </div>
              <p className={`mt-2 font-medium text-sm ${selectedRole === 'ADMIN' ? 'text-[#003366]/70' : 'text-white/60'}`}>
                Gestion de la plateforme, des utilisateurs et des configurations.
              </p>
              {selectedRole === 'ADMIN' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSendCode(); }} 
                  className="mt-6 w-full bg-[#003366] text-[#ffcc00] py-4 rounded-2xl font-black flex items-center justify-center gap-2 animate-bounce"
                >
                  VALIDER L'ACCÈS <Lock size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* STEP 2: FORMULAIRE OTP */
          <div className="max-w-md mx-auto bg-[#ffcc00] rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <h3 className="text-[#003366] text-xl font-black uppercase">Code de sécurité</h3>
              <p className="text-[#003366]/60 text-xs font-bold italic mt-2">Saisissez le code envoyé par mail pour votre accès {selectedRole}</p>
            </div>
            <form onSubmit={handleVerify} className="space-y-6">
              <input 
                type="text" 
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="• • • •" 
                className="w-full bg-white/50 border-none rounded-2xl py-5 text-center text-3xl font-black tracking-[1em] text-[#003366] outline-none focus:ring-4 focus:ring-[#003366]/20 transition-all"
              />
              <button className="w-full bg-[#003366] text-[#ffcc00] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Vérifier maintenant <CheckCircle2 size={20} />
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-[#003366] font-bold text-sm underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity">
                Changer de rôle
              </button>
            </form>
          </div>
        )}

        <div className="mt-12 text-center">
            <button onClick={() => router.push('/login')} className="flex items-center gap-2 mx-auto text-white/40 hover:text-white font-bold transition-colors">
              <LogOut size={18} /> Quitter la session
            </button>
        </div>
      </div>
    </div>
  );
}