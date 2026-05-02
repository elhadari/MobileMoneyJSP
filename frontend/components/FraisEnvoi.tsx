"use client";
import React, { useState, useEffect } from 'react';
import { Percent, Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import Swal from 'sweetalert2';

// Endpoint Backend
const API_URL = "http://localhost:8081/api/frais"; 

const FraisManager = () => {
  const [frais, setFrais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    idenv: '', 
    montant1: '', 
    montant2: '', 
    frais_env: ''
  });

  // 1. RÉCUPÉRATION DES DONNÉES
  const fetchFrais = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/all`);
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setFrais(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur:", error);
      setFrais([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFrais(); }, []);

  // 2. ENREGISTREMENT (AJOUT / MODIFICATION)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = isEditing 
      ? `${API_URL}/update/${formData.idenv}` 
      : `${API_URL}/add`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idenv: isEditing ? formData.idenv : undefined,
          montant1: Number(formData.montant1),
          montant2: Number(formData.montant2),
          frais_env: Number(formData.frais_env)
        }),
      });

      if (response.ok) {
        Swal.fire({ 
          title: 'Succès !', 
          text: isEditing ? 'Mise à jour effectuée avec succès' : 'Nouvelle tranche ajoutée avec succès', 
          icon: 'success', 
          confirmButtonColor: '#003366' 
        });
        setIsModalOpen(false);
        fetchFrais();
      } else {
        const errorData = await response.json();
        Swal.fire('Erreur', errorData.erreur || 'Une erreur est survenue lors de l\'opération', 'error');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de contacter le serveur backend', 'error');
    }
  };

  // 3. SUPPRESSION
  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#003366',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
          if (response.ok) {
            Swal.fire('Supprimé !', 'La règle de frais a été supprimée.', 'success');
            fetchFrais();
          } else {
            const errorData = await response.json();
            Swal.fire('Erreur', errorData.erreur || 'Suppression impossible', 'error');
          }
        } catch (error) {
          Swal.fire('Erreur', 'Problème de connexion avec le serveur', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[1.8rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#FFCC00]/10 rounded-2xl">
            <Percent size={28} className="text-[#003366]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#003366] uppercase tracking-tighter">Paramétrage Frais</h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Gestion des commissions d'envoi</p>
          </div>
        </div>
        <button 
          onClick={() => { 
            setFormData({idenv:'', montant1:'', montant2:'', frais_env:''}); 
            setIsEditing(false); 
            setIsModalOpen(true); 
          }}
          className="bg-[#003366] text-[#FFCC00] px-8 py-4 rounded-xl text-xs font-black uppercase flex items-center gap-3 hover:bg-[#002244] transition-all active:scale-95 shadow-lg shadow-blue-900/10"
        >
          <Plus size={18} /> Nouvelle Tranche
        </button>
      </div>

      {/* Tableau avec Scroll limité à 3 lignes (env. 220px) */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#003366]">Grille tarifaire active</h3>
        </div>
        
        <div className="h-[220px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="text-gray-400 text-[10px] font-black tracking-widest border-b border-gray-100">
                <th className="px-10 py-4 lowercase">tranche de montant (ar)</th>
                <th className="px-10 py-4 text-center lowercase">tarif appliqué</th>
                <th className="px-10 py-4 text-center lowercase">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={3} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-[#003366]" size={35}/></td></tr>
              ) : (frais && frais.length > 0) ? (
                frais.map((item: any) => (
                  <tr key={item.idenv} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-10 py-4 font-bold text-[#003366]">
                      {Number(item.montant1).toLocaleString()} - {Number(item.montant2).toLocaleString()} Ar
                    </td>
                    <td className="px-10 py-4 text-center">
                      <span className="bg-[#FFCC00] text-[#003366] px-5 py-1.5 rounded-xl font-black text-xs">
                        {Number(item.frais_env).toLocaleString()} Ar
                      </span>
                    </td>
                    <td className="px-10 py-4">
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={() => { setIsEditing(true); setFormData(item); setIsModalOpen(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.idenv)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="text-center py-12 text-gray-400 font-bold uppercase text-[11px]">Aucune donnée disponible</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Saisie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-10 py-6 bg-[#003366] text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {isEditing ? 'Modification de Tranche' : 'Nouvelle Tranche'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-transform hover:rotate-90">
                <X size={24}/>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Montant Minimum (Ar)</label>
                  <input required type="number" placeholder="0" className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#FFCC00] outline-none transition-all" 
                    value={formData.montant1} onChange={(e) => setFormData({...formData, montant1: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Montant Maximum (Ar)</label>
                  <input required type="number" placeholder="100000" className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#FFCC00] outline-none transition-all" 
                    value={formData.montant2} onChange={(e) => setFormData({...formData, montant2: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Frais de prestation (Ar)</label>
                <input required type="number" placeholder="500" className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#FFCC00] outline-none transition-all" 
                  value={formData.frais_env} onChange={(e) => setFormData({...formData, frais_env: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#FFCC00] text-[#003366] py-5 rounded-2xl font-black uppercase text-xs shadow-xl hover:shadow-[#FFCC00]/20 transition-all active:scale-[0.98]">
                {isEditing ? 'Enregistrer les modifications' : 'Confirmer l\'ajout'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraisManager;