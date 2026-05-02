"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Smartphone, Wallet, Bell, Clock, X, Info, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Configuration API
const API_BASE_URL = "http://localhost:8081/api/envoi";
const WS_URL = "http://localhost:8081/ws-notification";

interface Envoi {
  idenv: string;
  numEnvoyeur: string;
  numRecepteur: string;
  montant: number;
  date: string;
  payerFraisRetrait: boolean;
  raison: string;
}

const EnvoiManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: '', amount: '' });
  const [envois, setEnvois] = useState<Envoi[]>([]);
  const stompClientRef = useRef<Client | null>(null);

  // 1. CONNECT WEBSOCKET (@stomp/stompjs version)
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (msg) => {
        // Azonao jerena eto ny log raha misy olana ny fifandraisana
        // console.log(msg);
      },
      reconnectDelay: 5000, // Reconnection automatique isaky ny 5s raha tapaka
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe('/topic/admin-notifications', (message) => {
        Swal.fire({
          title: 'Notification',
          text: message.body,
          icon: 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
        fetchEnvois(); // Refresh ny lisitra
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  // 2. FETCH DATA FROM BACKEND
  const fetchEnvois = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      setEnvois(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des envois", error);
    }
  };

  useEffect(() => {
    fetchEnvois();
  }, []);

  // 3. DELETE ENVOI
  const supprimerNotification = (id: string) => {
    Swal.fire({
      title: 'Supprimer ?',
      text: "Retirer cet envoi de la base de données.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#003366',
      cancelButtonColor: '#ffcc00',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/delete/${id}`);
          setEnvois(prev => prev.filter(e => e.idenv !== id));
          Swal.fire('Supprimé', 'L\'envoi a été retiré.', 'success');
        } catch (error) {
          Swal.fire('Erreur', 'Impossible de supprimer l\'envoi.', 'error');
        }
      }
    });
  };

  // 4. CREATE NEW TRANSFERT
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = "ENV" + Math.floor(Math.random() * 9999);

    const payload = {
      idenv: newId,
      numEnvoyeur: "ADMIN",
      numRecepteur: formData.phone,
      montant: parseInt(formData.amount),
      date: new Date().toISOString().split('T')[0],
      payerFraisRetrait: false,
      raison: "Transfert via Admin"
    };

    setIsModalOpen(false);

    try {
      Swal.showLoading();
      await axios.post(`${API_BASE_URL}/add`, payload);
      
      Swal.fire({
        title: 'Succès',
        text: 'Le transfert a été validé.',
        icon: 'success',
        confirmButtonColor: '#003366',
      });

      setFormData({ phone: '', amount: '' });
      fetchEnvois();
    } catch (error) {
      Swal.fire('Erreur', 'Échec du transfert. Vérifiez le serveur.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 min-h-screen bg-gray-50/30">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#003366] p-6 rounded-2xl shadow-lg border border-blue-900">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl text-[#FFCC00]">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Envois Real-time</h1>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Suivi des transferts sortants</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-3 md:mt-0 bg-[#FFCC00] text-[#003366] px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          Nouveau Transfert
        </button>
      </div>

      {/* LISTE DES ENVOIS */}
      <div className="space-y-3">
        {envois.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucun envoi récent</p>
          </div>
        ) : (
          envois.slice().reverse().map((n) => (
            <div key={n.idenv} className="group bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between hover:border-[#FFCC00] transition-all shadow-sm">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-blue-50 text-[#003366] rounded-xl group-hover:bg-[#003366] group-hover:text-[#FFCC00] transition-colors">
                  <Send size={20} />
                </div>
                <div>
                  <p className="text-md font-black text-[#003366]">{n.numRecepteur}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-[9px] font-bold uppercase">
                    <Clock size={10} /> {n.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <p className="text-lg font-black text-[#003366]">{n.montant.toLocaleString()} Ar</p>
                  <span className="text-[8px] font-black bg-blue-100 text-[#003366] px-2 py-0.5 rounded-md uppercase">Terminé</span>
                </div>
                
                <button 
                  onClick={() => supprimerNotification(n.idenv)}
                  className="p-3 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL ENVOI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#003366] text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">Nouveau Transfert</h2>
                <p className="text-[8px] font-bold text-[#FFCC00] uppercase tracking-widest">Saisie des informations</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAction} className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" placeholder="Numéro Destinataire" required
                    className="w-full pl-10 p-3 bg-gray-50 border-none rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#003366] transition-all text-sm"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="number" placeholder="Montant (Ar)" required
                    className="w-full pl-10 p-3 bg-gray-50 border-none rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#003366] text-sm"
                    value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Info className="shrink-0 text-[#003366]" size={16} />
                <p className="text-[9px] font-bold text-[#003366] uppercase leading-tight">
                  Vérifiez bien le numéro avant de valider l'envoi.
                </p>
              </div>

              <button className="w-full bg-[#003366] text-[#FFCC00] py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 text-[10px]">
                Confirmer le transfert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvoiManager;