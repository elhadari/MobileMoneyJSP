"use client";
import React, { useState } from 'react';
import { Download, Smartphone, Key, Bell, CheckCircle, X, ShieldCheck, Trash2, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const RetraitManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [retraitData, setRetraitData] = useState({ phone: '', code: '' });

  const [notifications, setNotifications] = useState([
    { id: 1, client: "033 44 555 11", montant: "50 000", heure: "Il y a 5 min" },
    { id: 2, client: "034 00 111 22", montant: "15 000", heure: "Il y a 20 min" },
    { id: 3, client: "032 99 888 77", montant: "100 000", heure: "Il y a 45 min" },
  ]);

  const supprimerNotification = (id: number) => {
    Swal.fire({
      title: 'Supprimer ?',
      text: "Retirer cette notification de la liste.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#003366',
      cancelButtonColor: '#ffcc00',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    });
  };

  const handleRetrait = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Validé',
      text: `Paiement pour ${retraitData.phone} effectué.`,
      confirmButtonColor: '#003366',
    });
    setRetraitData({ phone: '', code: '' });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 min-h-screen bg-gray-50/30">
      
      {/* HEADER SECTION - COMPACT */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#003366] p-6 rounded-2xl shadow-lg border border-blue-900">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl text-[#FFCC00]">
            <Bell size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Retraits</h1>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Notifications de décaissement</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-3 md:mt-0 bg-[#FFCC00] text-[#003366] px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          Retrait Manuel
        </button>
      </div>

      {/* NOTIFICATIONS LIST - SMALLER CARDS */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucune attente</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="group bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:border-[#FFCC00] transition-all shadow-sm">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-blue-50 text-[#003366] rounded-xl group-hover:bg-[#003366] group-hover:text-[#FFCC00] transition-colors">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-md font-black text-[#003366]">{n.client}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-[9px] font-bold uppercase">
                    <Clock size={10} /> {n.heure}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <p className="text-lg font-black text-[#003366]">{n.montant} Ar</p>
                  <span className="text-[8px] font-black bg-[#FFCC00]/20 text-[#003366] px-2 py-0.5 rounded-md uppercase">Attente</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setRetraitData({...retraitData, phone: n.client}); setIsModalOpen(true); }}
                    className="p-3 bg-[#003366] text-[#FFCC00] rounded-lg hover:brightness-125 transition-all shadow-sm"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => supprimerNotification(n.id)}
                    className="p-3 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL - CLEAN & SOLID */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#003366] text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">Cash-Out</h2>
                <p className="text-[8px] font-bold text-[#FFCC00] uppercase tracking-widest">Validation de sécurité</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRetrait} className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" placeholder="Numéro Client" required
                    className="w-full pl-10 p-3 bg-gray-50 border-none rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#003366] transition-all text-sm"
                    value={retraitData.phone} onChange={(e) => setRetraitData({...retraitData, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" placeholder="Code de retrait" required
                    className="w-full pl-10 p-3 bg-gray-50 border-none rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#003366] font-mono text-sm"
                    value={retraitData.code} onChange={(e) => setRetraitData({...retraitData, code: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <ShieldCheck className="shrink-0 text-[#003366]" size={16} />
                <p className="text-[9px] font-bold text-[#003366] uppercase leading-tight">
                  Vérifiez l'identité du client.
                </p>
              </div>

              <button className="w-full bg-[#003366] text-[#FFCC00] py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 text-[10px]">
                Valider le décaissement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetraitManager;