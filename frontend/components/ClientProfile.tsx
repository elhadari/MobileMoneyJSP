"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Calendar, ArrowDownLeft, 
  Wallet, Plus, History, Home, Send, 
  Settings, LogOut, X, Landmark, TrendingUp, TrendingDown
} from 'lucide-react';
import Swal from 'sweetalert2';
import ViewTransfert from './ViewTransfert';
import ViewFrais from './ViewFrais';
import HistoriquePage from '@/app/client/historique/page';

const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  
  // Ampiasaina ho an'ny DepositRequest DTO
  const [formData, setFormData] = useState({
    numtel: '', nom: '', age: '', sexe: 'masculin', mail: '', solde: 0.0
  });

  const API_BASE_URL = "http://localhost:8080/api/clients";

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      fetchClientData(storedEmail);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchClientData = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/me/${email}`);
      if (res.ok) {
        const data = await res.json();
        setClientInfo(data);
        setFormData(data);
      } else if (res.status === 404) {
        setFormData(prev => ({ ...prev, mail: email }));
        setActiveModal('info');
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Raha mbola tsy misy Client, dia any amin'ny add no mandeha (na create arakaraka ny controller-nao)
    const isCreation = !clientInfo;
    const url = isCreation ? `${API_BASE_URL}/add` : `${API_BASE_URL}/update/${formData.numtel}`;
    
    try {
      const res = await fetch(url, {
        method: isCreation ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setClientInfo(data);
        Swal.fire('Succès !', isCreation ? 'Compte créé avec succès.' : 'Profil mis à jour.', 'success');
        setActiveModal(null);
      } else {
        Swal.fire('Erreur', data.error || 'Une erreur est survenue.', 'error');
      }
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de contacter le serveur.', 'error');
    } finally { setLoading(false); }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionAmount <= 0) return;

    setLoading(true);
    try {
      // Mifidy ny URL arakaraka ny modal (deposit na withdraw)
      const endpoint = activeModal === 'ajout' ? 'deposit' : 'withdraw';
      
      // Manomana ny DepositRequest DTO
      const payload = {
        numtel: clientInfo.numtel,
        amount: transactionAmount
      };

      const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        if (activeModal === 'ajout') {
          setClientInfo(data); // Ny deposit dia mamerina Client updated
          Swal.fire('Réussi !', `Dépôt de ${transactionAmount} Ar effectué.`, 'success');
        } else {
          // Ny withdrawal dia mamerina message (PENDING)
          Swal.fire('Demande envoyée', data.message, 'info');
        }
        setActiveModal(null);
        setTransactionAmount(0);
      } else {
        Swal.fire('Erreur', data.error || 'Erreur lors de la transaction', 'error');
      }
    } catch (err) {
      Swal.fire('Erreur', 'Erreur serveur.', 'error');
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#003366',
      confirmButtonText: 'Oui, me déconnecter'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
      }
    });
  };

  // --- Views ---
  const ViewAccueil = () => (
    <div className="animate-in fade-in duration-500 flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#003366] uppercase tracking-tighter">
            Tableau de <span className="text-[#FFCC00]">bord.</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Gestion de compte en temps réel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Solde */}
        <div className="lg:col-span-1 bg-[#FFCC00] rounded-[2.5rem] p-8 shadow-xl border-4 border-[#003366] relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-[#003366]/5 -rotate-12" />
          <div className="relative z-10">
            <p className="text-[#003366]/70 text-xs font-black uppercase tracking-widest">Solde disponible</p>
            <h2 className="text-5xl font-black text-[#003366] mt-3">
              {clientInfo?.solde?.toLocaleString() || "0"} <span className="text-2xl">Ar</span>
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 relative z-10">
            <button onClick={() => setActiveModal('ajout')} className="bg-[#003366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition shadow-lg text-sm uppercase">
              <Plus size={18}/> Dépôt
            </button>
            <button onClick={() => setActiveModal('retrait')} className="bg-white text-[#003366] border-2 border-[#003366] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition text-sm uppercase">
              <ArrowDownLeft size={18}/> Retrait
            </button>
          </div>
        </div>

        {/* Info Client */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1.5 bg-[#FFCC00] rounded-full"></div>
              <h3 className="text-xl font-black text-[#003366] uppercase tracking-tighter">Informations Client</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 mt-2">
              <InfoItem label="Titulaire" value={clientInfo?.nom || "---"} subValue="Profil vérifié" />
              <InfoItem label="Numéro" value={clientInfo?.numtel || "---"} subValue="Ligne active" />
              <InfoItem label="Âge" value={clientInfo?.age ? `${clientInfo.age} ans` : "---"} subValue="Info" />
              <InfoItem label="Email" value={clientInfo?.mail || "---"} subValue="Compte lié" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InfoItem = ({ label, value, subValue }: any) => (
    <div className="group">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FFCC00] transition-colors">{label}</p>
      <p className="text-[#003366] font-bold text-lg truncate leading-none">{value}</p>
      {subValue && <p className="text-[9px] text-gray-300 font-bold mt-1 uppercase tracking-tighter">{subValue}</p>}
      <div className="h-1 w-8 bg-[#FFCC00]/20 mt-2 rounded-full group-hover:w-12 transition-all"></div>
    </div>
  );

  const NavItem = ({ icon, label, active = false, onClick }: any) => (
    <div onClick={onClick} className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#FFCC00] text-[#003366] font-black shadow-md' : 'text-blue-100/60 hover:bg-white/5 hover:text-white'}`}>
      {icon} <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans text-[#003366]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#003366] text-white flex flex-col hidden lg:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-lg"><Wallet className="text-[#003366]" size={24} /></div>
          <span className="text-3xl font-black tracking-tighter">YAS<span className="text-[#FFCC00]">.</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<Home size={20}/>} label="Accueil" active={activeTab === 'accueil'} onClick={() => setActiveTab('accueil')} />
          <NavItem icon={<Send size={20}/>} label="Transfert" active={activeTab === 'transfert'} onClick={() => setActiveTab('transfert')} />
          <NavItem icon={<Landmark size={20}/>} label="Frais" active={activeTab === 'frais'} onClick={() => setActiveTab('frais')} />
          <NavItem icon={<History size={20}/>} label="Historique" active={activeTab === 'historique'} onClick={() => setActiveTab('historique')} />
          <div className="pt-10 pb-4 px-4 text-[10px] font-black text-blue-200/30 uppercase tracking-[0.2em]">Configuration</div>
          <NavItem icon={<Settings size={20}/>} label="Profil" active={activeModal === 'info'} onClick={() => setActiveModal('info')} />
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 font-bold w-full px-4 py-3 hover:bg-red-500/10 rounded-2xl transition text-sm uppercase tracking-widest">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">{activeTab}</h2>
          <div className="w-10 h-10 bg-[#FFCC00] rounded-full border-2 border-[#003366] flex items-center justify-center font-black shadow-sm uppercase">
            {clientInfo?.nom?.charAt(0) || 'U'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'accueil' && <ViewAccueil />}
          {activeTab === 'transfert' && <ViewTransfert clientInfo={clientInfo} setClientInfo={setClientInfo} />}
          {activeTab === 'frais' && <ViewFrais />}
          {activeTab === 'historique' && <HistoriquePage />}
        </main>
      </div>

      {/* Modals Profil */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#003366]/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-10 border-t-8 border-[#FFCC00] animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-[#003366]">{!clientInfo ? "Créer un compte" : "Modifier Profil"}</h2>
              {clientInfo && <button onClick={() => setActiveModal(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"><X size={20}/></button>}
            </div>
            <form className="space-y-6" onSubmit={handleSubmitProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Numéro</label>
                  <input type="text" required disabled={!!clientInfo} value={formData.numtel} onChange={(e) => setFormData({...formData, numtel: e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Nom Complet</label>
                  <input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Âge</label>
                  <input type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Sexe</label>
                  <select value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value})} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-2xl outline-none font-bold">
                    <option value="masculin">Masculin</option>
                    <option value="féminin">Féminin</option>
                  </select>
                </div>
              </div>
              <button disabled={loading} className="w-full py-5 bg-[#003366] text-[#FFCC00] font-black rounded-[1.5rem] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl active:scale-95">
                {loading ? 'Traitement...' : 'Enregistrer le Profil'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dépôt / Retrait */}
      {(activeModal === 'ajout' || activeModal === 'retrait') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#003366]/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border-t-8 border-[#FFCC00] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase text-[#003366] flex items-center gap-2">
                {activeModal === 'ajout' ? <TrendingUp className="text-green-500"/> : <TrendingDown className="text-red-500"/>}
                {activeModal === 'ajout' ? 'Dépôt' : 'Retrait'}
              </h2>
              <button onClick={() => {setActiveModal(null); setTransactionAmount(0);}} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <form className="space-y-6" onSubmit={handleTransaction}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant (Ar)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFCC00]" size={20} />
                  <input type="number" autoFocus value={transactionAmount || ''} onChange={(e) => setTransactionAmount(parseFloat(e.target.value) || 0)} className="w-full p-5 pl-14 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-2xl outline-none font-black text-[#003366] text-xl" placeholder="0 Ar" />
                </div>
              </div>
              <button disabled={loading || transactionAmount <= 0} className={`w-full py-5 font-black rounded-2xl uppercase transition-all shadow-xl ${activeModal === 'ajout' ? 'bg-[#003366] text-[#FFCC00]' : 'bg-[#FFCC00] text-[#003366]'}`}>
                {loading ? 'Traitement...' : 'Confirmer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;