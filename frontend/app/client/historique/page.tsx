"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Clock, 
  Loader2
} from 'lucide-react';

const getActionStyle = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'DEPOT':
      return {
        icon: <ArrowDownLeft size={16} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        label: "Dépôt",
        prefix: "+"
      };
    case 'RETRAIT':
      return {
        icon: <ArrowUpRight size={16} />,
        color: "text-red-600",
        bg: "bg-red-50",
        label: "Retrait",
        prefix: "-"
      };
    case 'TRANSFERT':
      return {
        icon: <RefreshCcw size={16} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
        label: "Transfert",
        prefix: ""
      };
    default:
      return {
        icon: <Clock size={16} />,
        color: "text-gray-600",
        bg: "bg-gray-50",
        label: type,
        prefix: ""
      };
  }
};

export default function HistoriquePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // FAKANA NY DATA AVY ANY AMIN'NY BACKEND
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Alaina aloha ny mail an'ilay olona mifandray (ohatra avy amin'ny localStorage)
      const userEmail = localStorage.getItem('userEmail') || "santana@example.com";
      
      // 2. Alaina ny mombamomba ilay client mba hahazoana ny numtel-ny
      const clientRes = await fetch(`http://localhost:8081/api/clients/me/${userEmail}`);
      if (!clientRes.ok) throw new Error("Client non trouvé");
      const clientData = await clientRes.json();

      // 3. Alaina ny transactions mifanaraka amin'io numtel io ihany
      // Fanamarihana: Mila amboarina ity endpoint ity any amin'ny Java raha mbola tsy misy
      const res = await fetch(`http://localhost:8081/api/clients/transactions`); 
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      
      // Sivana (Filter) ho an'ilay client connecté fotsiny raha toa ka findAll no mbola ampiasaina any amin'ny Java
      const myTransactions = data.filter((tx: any) => tx.client?.numtel === clientData.numtel);
      setTransactions(myTransactions);
    } catch (err) {
      console.error("Erreur de récupération :", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((tx: any) => 
    tx.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#003366] tracking-tighter uppercase">
            Historique <span className="text-[#FFCC00]">Mvola.</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vos dernières opérations</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs outline-none focus:border-[#FFCC00] shadow-sm transition-all"
            placeholder="Rechercher une opération..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-50 shadow-xl shadow-gray-100/50 overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10">
              <tr className="border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant (Ar)</th>
              </tr>
            </thead>
          </table>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-3">
              <Loader2 className="animate-spin text-[#FFCC00]" size={32} />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chargement des données...</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx: any) => {
                    const style = getActionStyle(tx.type);
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-5 w-1/3">
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${style.bg} ${style.color}`}>
                              {style.icon}
                            </div>
                            <div>
                              <p className={`text-sm font-black uppercase ${style.color}`}>
                                {style.label}
                              </p>
                              <p className="text-[10px] text-gray-400 italic leading-tight">
                                {tx.description || 'Aucune description'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 w-1/3 text-left">
                          <p className="text-xs font-bold text-gray-600">
                            {new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">
                            {new Date(tx.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-right w-1/3">
                          <span className={`text-sm font-black ${style.color}`}>
                            {style.prefix} {tx.montant?.toLocaleString('fr-FR')} Ar
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="p-20 text-center text-gray-300 text-xs font-bold italic uppercase">
                      Aucune opération trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FFCC00; }
      `}</style>
    </div>
  );
}