"use client";
import React from 'react';
import { 
  Users, Send, Download, Trash2, Edit, Search, 
  FileText, Wallet, LayoutDashboard, Settings, 
  LogOut, Plus, ChevronRight, BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-[#F2F2F2] overflow-hidden font-sans text-[#003366]">
      
      {/* --- SIDEBAR FIXE (Admin Style) --- */}
      <aside className="w-72 bg-[#003366] text-white flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
               <BarChart3 className="text-[#003366]" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tighter">yas<span className="text-[#FFCC00]">.</span></span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold mt-2 text-blue-200/50">Administration</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Users size={20}/>} label="Gestion Clients" />
          <NavItem icon={<Send size={20}/>} label="Frais & Tarifs" />
          <NavItem icon={<FileText size={20}/>} label="Rapports / PDF" />
          <div className="pt-10 pb-4 px-4 text-xs font-bold text-blue-200/50 uppercase tracking-widest">Système</div>
          <NavItem icon={<Settings size={20}/>} label="Configuration" />
        </nav>

        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full px-4 py-3">
            <LogOut size={20} />
            <span className="font-bold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- NAVBAR FIXE --- */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-[#003366]">Panneau de Contrôle</h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-[#FFCC00]"
                />
             </div>
             <div className="w-10 h-10 bg-[#003366] rounded-full border-2 border-[#FFCC00] flex items-center justify-center font-black text-[#FFCC00]">
                A
             </div>
          </div>
        </header>

        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          
          {/* 1. Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Recette Totale" value="450.000 Ar" icon={<Wallet size={24}/>} color="bg-[#FFCC00]" />
            <StatCard label="Total Clients" value="1.250" icon={<Users size={24}/>} color="bg-white" />
            <StatCard label="Transactions/J" value="85" icon={<Send size={24}/>} color="bg-white" />
          </div>

          {/* 2. Main CRUD Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
               <div>
                  <h3 className="text-xl font-black text-[#003366] uppercase tracking-tighter">Liste des Clients</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">Mise à jour en temps réel</p>
               </div>
               <button className="bg-[#003366] text-[#FFCC00] px-5 py-2.5 rounded-xl text-xs font-black uppercase shadow-lg flex items-center gap-2 hover:scale-105 transition">
                  <Plus size={16} /> Nouveau Client
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                    <th className="px-8 py-5">Numéro / Tel</th>
                    <th className="px-8 py-5">Nom Complet</th>
                    <th className="px-8 py-5">Solde</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* Row Example */}
                  <tr className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-[#003366]">034 00 123 45</td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-[#003366] font-bold text-xs">RB</div>
                          <span className="font-semibold text-gray-700">RAKOTO Bernard</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black">340.000 Ar</span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-blue-50 text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition"><Edit size={16}/></button>
                          <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16}/></button>
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-black hover:text-white transition"><ChevronRight size={16}/></button>
                       </div>
                    </td>
                  </tr>
                  {/* Rehetra sisa... */}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Action Buttons Section */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-white border-2 border-[#003366] text-[#003366] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#003366] hover:text-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <Settings size={20} />
                Configurer les Frais
              </div>
            </button>
            <button className="bg-[#FFCC00] border-2 border-[#003366] text-[#003366] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
              <div className="flex items-center gap-3">
                <Download size={20} />
                Exporter Recette (PDF)
              </div>
            </button>
          </div>

          <footer className="pt-10 pb-6 text-center text-gray-400 text-sm border-t border-gray-100">
            <p>© 2026 YAS Service Admin - Système de Gestion Transactionnelle.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

// --- Sub-components ---
const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${
    active ? 'bg-[#FFCC00] text-[#003366] font-black shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'
  }`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const StatCard = ({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <div className={`${color} p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between`}>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-[#003366] tracking-tighter italic">{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl ${color === 'bg-[#FFCC00]' ? 'bg-black/10' : 'bg-gray-50'} text-[#003366]`}>
      {icon}
    </div>
  </div>
);

export default AdminDashboard;