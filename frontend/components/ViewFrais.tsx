"use client";
import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft, Info } from 'lucide-react';

const ViewFrais = () => {
  const tarification = [
    { min: 100, max: 5000, transfert: 100, retrait: 150 },
    { min: 5001, max: 10000, transfert: 200, retrait: 300 },
    { min: 10001, max: 50000, transfert: 500, retrait: 800 },
    { min: 50001, max: 100000, transfert: 1000, retrait: 1500 },
    { min: 100001, max: 500000, transfert: 2000, retrait: 3500 },
    { min: 500001, max: 2000000, transfert: 5000, retrait: 10000 },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-transparent">
      
      {/* 1. Nampiana -mt-12 (negative margin) mba hampiakatra azy 1cm mahery.
          2. Nesorina ny rounded-t raha tianao hiraikitra tanteraka any ambony.
      */}
      <div className="bg-white rounded-t-[3rem] shadow-xl border border-gray-100 w-full max-w-5xl h-fit flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-8 duration-700 -mt-12">
        
        {/* HEADER: Natao kely kokoa ny padding (p-5) */}
        <div className="bg-[#003366] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FFCC00] rounded-2xl flex items-center justify-center shadow-lg">
              <Landmark className="text-[#003366]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white leading-none">Tarification</h2>
              <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest mt-1">Grille des frais Yas Mobile Money</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <Info size={14} className="text-[#FFCC00]" />
            <span className="text-[9px] font-bold uppercase text-white">Avril 2026</span>
          </div>
        </div>

        {/* CONTENT: Natao p-4 (fa tsy p-6) mba hampihenana ny elanelana anatiny */}
        <div className="h-[200px] overflow-y-auto p-4 scrollbar-none">
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[#003366] text-[10px] font-black uppercase tracking-widest">
                <th className="text-left px-4 py-2 bg-white">Tranche (Ar)</th>
                <th className="text-center px-4 py-2 bg-blue-50/80 rounded-t-xl text-blue-600">
                  <div className="flex items-center justify-center gap-1">
                    <ArrowUpRight size={12} /> Transfert
                  </div>
                </th>
                <th className="text-center px-4 py-2 bg-orange-50/80 rounded-t-xl text-orange-600">
                  <div className="flex items-center justify-center gap-1">
                    <ArrowDownLeft size={12} /> Retrait
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tarification.map((item, index) => (
                <tr key={index} className="group">
                  <td className="px-6 py-3 bg-gray-50 rounded-l-2xl font-bold text-[#003366] border-y border-l border-gray-100">
                    {item.min.toLocaleString()} - {item.max.toLocaleString()} <span className="text-[10px] font-medium opacity-40">Ar</span>
                  </td>
                  <td className="px-6 py-3 text-center font-black text-blue-600 bg-blue-50/30 border-y border-gray-100">
                    {item.transfert.toLocaleString()} <span className="text-[10px]">Ar</span>
                  </td>
                  <td className="px-6 py-3 text-center font-black text-orange-600 bg-orange-50/30 border-y border-r border-gray-100 rounded-r-2xl">
                    {item.retrait.toLocaleString()} <span className="text-[10px]">Ar</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <p className="text-[9px] text-gray-400 font-bold uppercase italic">
            * Frais déduits automatiquement.
          </p>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-[#003366] text-[#FFCC00] rounded-lg text-[9px] font-black uppercase">
              Sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFrais;