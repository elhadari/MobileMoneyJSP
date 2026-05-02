"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, Send, Download, Trash2, Edit, Search, 
  FileText, Wallet, LayoutDashboard, LogOut, Plus, BarChart3, Loader2 
} from 'lucide-react';
import Swal from 'sweetalert2';

// Importation des sous-composants
import ClientManager from './ClientManager'; 
import FraisEnvoi from './FraisEnvoi';
import FraisRecep from './FraisRecep';
import EnvoiManager from './EnvoiManager';
import RetraitManager from './RetraitManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({ clients: 0, recette: 0 });

  const fetchStats = async () => {
    try {
      const [resClients, resRecette] = await Promise.all([
        fetch('http://localhost:8081/api/clients/all'),
        fetch('http://localhost:8081/api/clients/recette-totale')
      ]);
      const clients = await resClients.json();
      const recette = await resRecette.json();
      setStats({ 
        clients: clients.length, 
        recette: recette.recette_totale || 0 
      });
    } catch (e) { 
      console.error("Erreur stats:", e); 
    }
  };

  useEffect(() => { 
    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard label="Recette Totale" value={`${stats.recette.toLocaleString()} Ar`} icon={<Wallet/>} color="bg-[#FFCC00]" isDark />
            <StatCard label="Clients Inscrits" value={stats.clients.toString()} icon={<Users/>} color="bg-white" />
            <StatCard label="Statut Système" value="En Ligne" icon={<BarChart3/>} color="bg-white" />
          </div>
        );
      case "Clients": return <ClientManager />;
      case "Frais Envoi": return <FraisEnvoi />;
      case "Frais Récep": return <FraisRecep />;
      case "Envoi": return <EnvoiManager />;
      case "Retrait": return <RetraitManager />;
      default: return <div className="p-10 text-center font-bold text-gray-400">Section en cours de développement...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F2F2F2] overflow-hidden font-sans text-[#003366]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#003366] text-white flex flex-col hidden lg:flex shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 ring-4 ring-white/10">
               <BarChart3 className="text-[#003366]" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">Yas.</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="tableau de bord" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={<Users size={20}/>} label="clients" active={activeTab === "Clients"} onClick={() => setActiveTab("Clients")} />
          <NavItem icon={<Send size={20}/>} label="frais envoi" active={activeTab === "Frais Envoi"} onClick={() => setActiveTab("Frais Envoi")} />
          <NavItem icon={<Download size={20}/>} label="frais réception" active={activeTab === "Frais Récep"} onClick={() => setActiveTab("Frais Récep")} />
          <NavItem icon={<FileText size={20}/>} label="envois" active={activeTab === "Envoi"} onClick={() => setActiveTab("Envoi")} />
          <NavItem icon={<Wallet size={20}/>} label="retraits" active={activeTab === "Retrait"} onClick={() => setActiveTab("Retrait")} />
        </nav>

        <div className="p-6 border-t border-white/10 mt-auto bg-[#002244]">
          <button 
            onClick={() => Swal.fire('Déconnexion', 'À bientôt !', 'info')}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full px-4 py-3 font-bold group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="capitalize">déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-black text-[#003366] tracking-widest capitalize">{activeTab}</h2>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase text-gray-400 leading-none">Administrateur</p>
              <p className="text-sm font-bold uppercase">Santana Velice</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-[#FFCC00]"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F8FAFC]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// COMPONENT HELPERS
const NavItem = ({ icon, label, active, onClick }: any) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${
    active 
      ? 'bg-[#FFCC00] text-[#003366] font-black shadow-lg shadow-yellow-500/20 translate-x-2' 
      : 'text-blue-100 hover:bg-white/5 hover:translate-x-1'
  }`}>
    <span className={active ? 'scale-110 transition-transform' : ''}>{icon}</span>
    {/* Ny 'capitalize' no manao ny litera voalohany ho Majuscule */}
    <span className="text-sm font-bold tracking-tight capitalize">{label}</span>
  </div>
);

const StatCard = ({ label, value, icon, color, isDark = false }: any) => (
  <div className={`${color} p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between shadow-xl hover:scale-[1.02] transition-transform duration-300`}>
    <div>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-[#003366]/60' : 'text-gray-400'}`}>
        {label}
      </p>
      <h3 className={`text-4xl font-black tracking-tighter text-[#003366]`}>
        {value}
      </h3>
    </div>
    <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#003366]/10 text-[#003366]' : 'bg-gray-50 text-[#003366]'}`}>
      {icon}
    </div>
  </div>
);

export default AdminDashboard;