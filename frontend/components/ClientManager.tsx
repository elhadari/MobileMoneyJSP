"use client";
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Loader2, X } from 'lucide-react';
import Swal from 'sweetalert2';

const ClientManager = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    numtel: '', nom: '', sexe: 'M', age: '', solde: 0, mail: ''
  });

  const fetchClients = async (query = "") => {
    setLoading(true);
    try {
      const url = query 
        ? `http://localhost:8081/api/clients/search?nom=${query}`
        : `http://localhost:8081/api/clients/all`;
      const res = await fetch(url);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients(searchTerm);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditMode 
      ? `http://localhost:8081/api/clients/update/${formData.numtel}`
      : `http://localhost:8081/api/clients/add`;
    
    try {
      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        Swal.fire({ title: 'Succès!', text: 'Opération réussie', icon: 'success', confirmButtonColor: '#003366', timer: 1500 });
        setIsModalOpen(false);
        fetchClients();
      }
    } catch (err) {
      Swal.fire('Erreur', 'Serveur inaccessible', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* HEADER SECTION - NOREBAHINA KELY */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-[#003366] uppercase tracking-tighter italic">Gestion des Clients</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Base de données: mvola</p>
        </div>

        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Rechercher un client..." 
              className="pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm w-72 focus:ring-2 focus:ring-[#FFCC00] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <button 
            onClick={() => { setIsEditMode(false); setFormData({numtel:'', nom:'', sexe:'M', age:'', solde:0, mail:''}); setIsModalOpen(true); }}
            className="bg-[#003366] text-[#FFCC00] px-8 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-[#002244] transition shadow-lg shadow-blue-900/10"
          >
            <Plus size={20} /> Nouveau Client
          </button>
        </div>
      </div>

      {/* TABLE SECTION - NAMPITOMBOINA NY HAAVONY (approx +1.5cm) */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-4 border-b border-gray-50 bg-gray-50/30">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#003366]">Liste des abonnés actifs</h3>
        </div>
        
        {/* Natao h-[220px] mba hahitana andalana maromaro kokoa */}
        <div className="h-[220px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-10 py-4">Téléphone</th>
                <th className="px-10 py-4">Nom & Email</th>
                <th className="px-10 py-4 text-center">Solde du compte</th>
                <th className="px-10 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-16"><Loader2 className="animate-spin mx-auto text-[#003366]" size={32}/></td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-16 text-xs font-bold text-gray-300 uppercase tracking-widest">Aucun mpanjifa hita</td></tr>
              ) : clients.map((client) => (
                <tr key={client.numtel} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-10 py-4 text-sm font-black text-[#003366]">{client.numtel}</td>
                  <td className="px-10 py-4">
                    <div className="text-sm font-bold text-gray-700">{client.nom}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{client.mail}</div>
                  </td>
                  <td className="px-10 py-4 text-center">
                    <span className="bg-[#FFCC00] text-[#003366] px-4 py-1 rounded-full font-black text-xs shadow-sm italic ring-2 ring-white">
                      {client.solde?.toLocaleString()} Ar
                    </span>
                  </td>
                  <td className="px-10 py-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setFormData(client); setIsEditMode(true); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-[#003366] hover:text-white transition shadow-sm"><Edit size={16}/></button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL - LARGEUR AJUSTÉE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-6 bg-[#003366] text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter">
                  {isEditMode ? 'Modifier le Dossier' : 'Nouveau Compte Client'}
                </h2>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Saisie des informations</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Numéro Téléphone</label>
                  <input required disabled={isEditMode} type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#FFCC00] disabled:opacity-50 shadow-inner" 
                    value={formData.numtel} onChange={(e) => setFormData({...formData, numtel: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nom Complet</label>
                  <input required type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#FFCC00] shadow-inner" 
                    value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Genre</label>
                  <select className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#FFCC00]"
                    value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value})}>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Âge</label>
                  <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#FFCC00]" 
                    value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Adresse Email</label>
                  <input required type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#FFCC00]" 
                    value={formData.mail} onChange={(e) => setFormData({...formData, mail: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#FFCC00] text-[#003366] py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-yellow-500/40">
                Confirmer l'enregistrement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManager;