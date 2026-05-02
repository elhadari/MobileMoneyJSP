"use client";
import React, { useState } from 'react';
import { Phone, Wallet, Send, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

interface ViewTransfertProps {
  clientInfo: any;
  setClientInfo: (data: any) => void;
}

const ViewTransfert = ({ clientInfo, setClientInfo }: ViewTransfertProps) => {
  const [receiverNum, setReceiverNum] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !receiverNum) return;
    if (amount > clientInfo.solde) {
      Swal.fire('Erreur', 'Votre solde est insuffisant', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/clients/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: clientInfo.numtel, to: receiverNum, amount: amount })
      });
      if (res.ok) {
        const data = await res.json();
        setClientInfo(data.sender);
        Swal.fire('Succès !', `Transfert effectué`, 'success');
        setAmount(0);
        setReceiverNum('');
      } else {
        const error = await res.text();
        Swal.fire('Erreur', error, 'error');
      }
    } catch (err) {
      Swal.fire('Erreur', 'Échec de la connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* h-full sy overflow-hidden no miantoka ny tsy hisian'ny scroll bar */
    <div className="h-full w-full flex items-start justify-center pt-2 px-4 overflow-hidden bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        
        {/* Card Ankavia - Natao Compact */}
        <div className="bg-[#003366] rounded-[2.5rem] p-7 text-white shadow-xl flex flex-col justify-between animate-in fade-in duration-500 max-h-[420px]">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-white/10 rounded-xl"><Info className="text-[#FFCC00]" size={22} /></div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Consignes</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 border-l-2 border-[#FFCC00]/20 pl-3">
                <CheckCircle2 className="text-[#FFCC00] shrink-0" size={18} />
                <p className="text-[11px] opacity-80 leading-tight">Vérifiez le numéro. Une erreur est irréversible.</p>
              </div>
              <div className="flex gap-4 border-l-2 border-[#FFCC00]/20 pl-3">
                <ShieldCheck className="text-[#FFCC00] shrink-0" size={18} />
                <p className="text-[11px] opacity-80 leading-tight">Transactions sécurisées et cryptées.</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-[#FFCC00] mb-1">Disponible</p>
            <p className="text-2xl font-black">{clientInfo.solde?.toLocaleString()} <span className="text-xs font-light opacity-50">Ar</span></p>
          </div>
        </div>

        {/* Card Ankavanana - Natao Compact */}
        <div className="bg-white rounded-[2.5rem] p-7 shadow-xl border border-gray-100 flex flex-col justify-center animate-in fade-in duration-500 max-h-[420px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-md"><Send className="text-[#003366]" size={20} /></div>
            <h2 className="text-xl font-black text-[#003366] uppercase">Transfert</h2>
          </div>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Destinataire</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFCC00]" size={16} />
                <input type="text" value={receiverNum} onChange={(e) => setReceiverNum(e.target.value)} className="w-full p-3 pl-12 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-xl outline-none font-bold text-sm text-[#003366]" placeholder="03x xx xxx xx" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Montant (Ar)</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFCC00]" size={16} />
                <input type="number" value={amount || ''} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="w-full p-3 pl-12 bg-gray-50 border-2 border-transparent focus:border-[#FFCC00] rounded-xl outline-none font-black text-lg text-[#003366]" placeholder="0" />
              </div>
            </div>
            <button disabled={loading || amount <= 0 || !receiverNum} className="w-full mt-2 py-4 bg-[#003366] text-[#FFCC00] font-black rounded-xl uppercase tracking-widest text-xs active:scale-[0.98] disabled:opacity-30">
              {loading ? '...' : 'Confirmer'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ViewTransfert;