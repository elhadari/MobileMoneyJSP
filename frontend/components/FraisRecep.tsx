"use client";
import React, { useState, useEffect } from 'react';
import { Download, Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import Swal from 'sweetalert2';

// Backend Endpoint
const API_URL = "http://localhost:8081/api/frais-recep"; 

const FraisRecep = () => {
  const [frais, setFrais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    idrec: '', 
    montant1: '', 
    montant2: '', 
    frais_rec: ''
  });

  // 1. FETCH DATA
  const fetchFraisRecep = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/all`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setFrais(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
      setFrais([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFraisRecep(); }, []);

  // 2. SAVE (POST / PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = isEditing 
      ? `${API_URL}/update/${formData.idrec}` 
      : `${API_URL}/add`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idrec: isEditing ? formData.idrec : undefined,
          montant1: Number(formData.montant1),
          montant2: Number(formData.montant2),
          frais_rec: Number(formData.frais_rec)
        }),
      });

      if (response.ok) {
        Swal.fire({ 
          title: 'Succès !', 
          text: isEditing ? 'Mise à jour effectuée' : 'Ajout réussi', 
          icon: 'success', 
          confirmButtonColor: '#003366' 
        });
        setIsModalOpen(false);
        fetchFraisRecep();
      } else {
        const errorData = await response.json();
        Swal.fire('Erreur', errorData.erreur || 'Une erreur est survenue', 'error');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de contacter le serveur', 'error');
    }
  };

  // 3. DELETE
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
            Swal.fire('Supprimé !', 'La règle a été supprimée.', 'success');
            fetchFraisRecep();
          } else {
            Swal.fire('Erreur', 'Suppression impossible', 'error');
          }
        } catch (error) {
          Swal.fire('Erreur', 'Problème de connexion', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto p-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[1.8rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-green-50 rounded-2xl">
            <Download size={28} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#003366] uppercase tracking-tighter">Frais de Réception</h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Configuration des commissions sur encaissement</p>
          </div>
        </div>

        <button 
          onClick={() => { 
            setFormData({idrec:'', montant1:'', montant2:'', frais_rec:''}); 
            setIsEditing(false); 
            setIsModalOpen(true); 
          }}
          className="bg-[#003366] text-[#FFCC00] px-8 py-4 rounded-xl text-xs font-black uppercase flex items-center gap-3 hover:bg-[#002244] transition-all active:scale-95 shadow-lg shadow-blue-900/10"
        >
          <Plus size={18} /> Nouvelle Règle
        </button>
      </div>

      {/* TABLE SECTION - 220px for 3 rows */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#003366]">Grille de retrait active</h3>
          <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold uppercase tracking-tighter">Retrait Cash</span>
        </div>
        
        <div className="h-[220px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="text-gray-400 text-[10px] font-black tracking-widest border-b border-gray-100">
                <th className="px-10 py-4 lowercase">tranches de montant (ar)</th>
                <th className="px-10 py-4 text-center lowercase">frais appliqués</th>
                <th className="px-10 py-4 text-center lowercase">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={3} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-[#003366]" size={35}/></td></tr>
              ) : (frais.length > 0) ? (
                frais.map((item) => (
                  <tr key={item.idrec} className="hover:bg-green-50/20 transition-colors group">
                    <td className="px-10 py-4 font-bold text-[#003366]">
                      {Number(item.montant1).toLocaleString()} - {Number(item.montant2).toLocaleString()} Ar
                    </td>
                    <td className="px-10 py-4 text-center">
                      <span className="bg-[#FFCC00] text-[#003366] px-5 py-1.5 rounded-xl font-black text-xs shadow-sm ring-2 ring-white">
                        {Number(item.frais_rec).toLocaleString()} Ar
                      </span>
                    </td>
                    <td className="px-10 py-4">
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={() => { setIsEditing(true); setFormData(item); setIsModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.idrec)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="text-center py-12 text-gray-400 font-bold text-[11px] uppercase">Aucune donnée disponible</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-10 py-6 bg-[#003366] text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {isEditing ? 'Modification' : 'Configuration Réception'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-transform hover:rotate-90"><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Montant Min (Ar)</label>
                  <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FFCC00] shadow-inner font-bold" 
                    value={formData.montant1} onChange={(e) => setFormData({...formData, montant1: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Montant Max (Ar)</label>
                  <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FFCC00] shadow-inner font-bold" 
                    value={formData.montant2} onChange={(e) => setFormData({...formData, montant2: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Frais de Réception (Ar)</label>
                <input required type="number" className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FFCC00] shadow-inner font-bold" 
                  value={formData.frais_rec} onChange={(e) => setFormData({...formData, frais_rec: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#FFCC00] text-[#003366] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
                Enregistrer les paramètres
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraisRecep;