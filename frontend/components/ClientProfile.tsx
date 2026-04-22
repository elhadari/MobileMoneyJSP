"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, Calendar, ArrowUpRight, ArrowDownLeft, 
  FileDown, Clock, Wallet, Plus, History, MoreHorizontal,
  Home, Send, LayoutDashboard, Settings, LogOut, Landmark, RefreshCcw, X
} from 'lucide-react';
import Swal from 'sweetalert2';

const ClientProfile = () => {
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    numtel: '',
    nom: '',
    age: '',
    sexe: 'Masculin',
    mail: ''
  });

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'elyserandria29@gmail.com'; 
    fetchClientData(userEmail);
  }, []);

  const fetchClientData = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/clients/me/${email}`);
      if (res.ok) {
        const data = await res.json();
        setClientInfo(data);
        setFormData(data);
      }
    } catch (err) {
      console.error("Erreur de récupération des données", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/clients/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setClientInfo(formData);
        Swal.fire({
          title: 'Succès !',
          text: 'Votre profil a été mis à jour avec succès.',
          icon: 'success',
          confirmButtonColor: '#003366',
          timer: 2000
        });
        closeModal();
      }
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de contacter le serveur.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#003366',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed && clientInfo) {
      try {
        const res = await fetch(`http://localhost:8081/api/clients/delete/${clientInfo.numtel}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          Swal.fire('Supprimé !', 'Votre compte a été supprimé.', 'success').then(() => {
            window.location.href = "/login";
          });
        } else {
          Swal.fire('Erreur', 'Impossible de supprimer un compte ayant des transactions actives.', 'error');
        }
      } catch (err) {
        Swal.fire('Erreur', 'Un problème technique est survenu.', 'error');
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#F2F2F2] overflow-hidden font-sans text-[#003366]">
      
      <aside className="w-72 bg-[#003366] text-white flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
               <Wallet className="text-[#003366]" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tighter">yas<span className="text-[#FFCC00]">.</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<Home size={20}/>} label="Accueil" active />
          <NavItem icon={<Send size={20}/>} label="Transfert d'argent" onClick={() => setActiveModal('transfert')} />
          <NavItem icon={<History size={20}/>} label="Historique" />
          <NavItem icon={<LayoutDashboard size={20}/>} label="Statistiques" />
          <div className="pt-10 pb-4 px-4 text-xs font-bold text-blue-200/50 uppercase tracking-widest">Réglages</div>
          <NavItem icon={<Settings size={20}/>} label="Paramètres" />
        </nav>

        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full px-4 py-3">
            <LogOut size={20} />
            <span className="font-bold">Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-[#003366]">Tableau de bord</h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-[#003366]">{clientInfo?.nom || 'Utilisateur YAS'}</p>
                <p className="text-xs text-gray-500">Compte Standard</p>
             </div>
             <div className="w-10 h-10 bg-[#FFCC00] rounded-full border-2 border-[#003366] flex items-center justify-center font-black text-[#003366]">
                {clientInfo?.nom?.charAt(0) || 'U'}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 bg-[#FFCC00] rounded-[2.5rem] p-8 shadow-xl shadow-yellow-500/30 border-4 border-[#003366] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <Wallet size={80} className="text-[#003366]" />
               </div>
               <p className="text-[#003366]/70 text-sm font-bold uppercase tracking-widest">Solde Actuel</p>
               <h2 className="text-5xl font-black text-[#003366] mt-2 italic">
                  {clientInfo?.solde?.toLocaleString() || "0"} Ar
               </h2>
               <div className="mt-8 flex gap-2">
                  <button onClick={() => setActiveModal('ajout')} className="bg-[#003366] text-white px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition shadow-lg flex-1 justify-center">
                    <Plus size={18} /> Dépôt
                  </button>
                  <button onClick={() => setActiveModal('retrait')} className="bg-white text-[#003366] border-2 border-[#003366] px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition flex-1 justify-center">
                    <ArrowDownLeft size={18} /> Retrait
                  </button>
               </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 relative group hover:shadow-md transition-all duration-300">
               <button 
                  onClick={() => setActiveModal('info')}
                  className="absolute top-6 right-6 p-3 bg-gray-50 text-[#003366] rounded-xl hover:bg-[#FFCC00] hover:scale-110 transition active:scale-90"
                  title="Modifier les informations"
               >
                  <Settings size={20} />
               </button>
               <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-black text-[#003366] border-l-4 border-[#FFCC00] pl-4 uppercase tracking-tighter">Informations Personnelles</h3>
                  <div className="grid grid-cols-2 gap-6 pt-4">
                     <InfoItem label="Nom" value={clientInfo?.nom || "Non renseigné"} />
                     <InfoItem label="Téléphone" value={clientInfo?.numtel || "Non renseigné"} />
                     <InfoItem label="Âge" value={clientInfo?.age ? `${clientInfo.age} ans` : "Non renseigné"} />
                     <InfoItem label="Sexe" value={clientInfo?.sexe || "Non renseigné"} />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
               <h3 className="text-xl font-black text-[#003366] uppercase tracking-tighter">Dernières Activités</h3>
               <button className="text-[#FFCC00] bg-[#003366] px-4 py-2 rounded-xl text-xs font-black uppercase shadow-md flex items-center gap-2 hover:bg-blue-900 transition">
                 <RefreshCcw size={14} /> Voir tout
               </button>
            </div>
            <div className="p-4 overflow-x-auto text-center py-20">
               <Clock className="mx-auto text-gray-200 mb-4 animate-pulse" size={48} />
               <p className="text-gray-400 font-medium italic">Aucune transaction récente.</p>
            </div>
          </div>

          <footer className="pt-10 pb-6 text-center text-gray-400 text-sm border-t border-gray-100">
            <p>© 2026 YAS Service - Tous droits réservés.</p>
          </footer>
        </main>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#003366]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border-4 border-[#FFCC00] animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#003366]">
                {activeModal === 'ajout' && 'Effectuer un Dépôt'}
                {activeModal === 'retrait' && 'Effectuer un Retrait'}
                {activeModal === 'transfert' && 'Transférer des fonds'}
                {activeModal === 'info' && 'Mise à jour du Profil'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 font-black transition">
                 <X size={24} />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={activeModal === 'info' ? handleUpdateProfile : (e) => { e.preventDefault(); closeModal(); }}>
              {activeModal !== 'info' ? (
                <>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Montant (Ar)</label>
                    <input type="number" className="w-full p-4 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-[#FFCC00] text-lg font-bold" placeholder="0.00" required />
                  </div>
                  {activeModal === 'transfert' && (
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Numéro du destinataire</label>
                      <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-[#FFCC00]" placeholder="03x xx xxx xx" required />
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Numéro de Téléphone (Fixe)</label>
                     <input 
                        type="text" 
                        value={formData.numtel}
                        disabled
                        className="w-full p-4 bg-gray-100 border-none rounded-xl cursor-not-allowed opacity-70" 
                     />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nom complet" 
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FFCC00]" 
                  />
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Âge" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="p-4 bg-gray-50 border-none rounded-xl flex-1 focus:ring-2 focus:ring-[#FFCC00]" 
                    />
                    <select 
                      className="p-4 bg-gray-50 border-none rounded-xl flex-1 focus:ring-2 focus:ring-[#FFCC00]"
                      value={formData.sexe}
                      onChange={(e) => setFormData({...formData, sexe: e.target.value})}
                    >
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Adresse Email" 
                    value={formData.mail}
                    onChange={(e) => setFormData({...formData, mail: e.target.value})}
                    className="p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FFCC00]" 
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-[#003366] text-[#FFCC00] font-black rounded-xl uppercase tracking-widest hover:bg-[#002244] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Traitement en cours...' : 'Confirmer l\'opération'}
                </button>
                
                {activeModal === 'info' && (
                   <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    className="text-red-500 font-bold text-xs uppercase hover:underline p-2"
                   >
                     Supprimer mon compte
                   </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all active:scale-95 ${
      active ? 'bg-[#FFCC00] text-[#003366] font-black shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-[#003366] font-bold truncate">{value}</p>
    <div className="h-1 w-8 bg-[#FFCC00] mt-1 rounded-full"></div>
  </div>
);

export default ClientProfile;