import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export default function AdminCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Create Category
  const [newCatName, setNewCatName] = useState('');
  // Create Subcategory hook reference
  const [newSubName, setNewSubName] = useState('');
  const [activeParentId, setActiveParentId] = useState(null);
  
  // Bulk Assign target
  const [bulkTagSlug, setBulkTagSlug] = useState('');

  const { user } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/products`)
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error(error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Category Handlers
  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categories`, { name: newCatName }, { headers: { Authorization: `Bearer ${user.token}` } });
      setNewCatName('');
      fetchData();
    } catch (err) { alert('Failed to add category'); }
  };

  const deleteCategory = async (id) => {
    if(!window.confirm('Delete category? This will pull its tag globally out of all products!')) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchData();
    } catch (err) { alert('Delete failed'); }
  };

  // Subcategory Handlers
  const addSubcategory = async (e, parentId) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categories/${parentId}/subcategories`, { name: newSubName }, { headers: { Authorization: `Bearer ${user.token}` } });
      setNewSubName('');
      setActiveParentId(null);
      fetchData();
    } catch (err) { alert('Failed to add subcategory'); }
  };

  const deleteSubcategory = async (parentId, subId) => {
    if(!window.confirm('Delete subcategory?')) return;
    try {
      await axios.delete(`${API_URL}/categories/${parentId}/subcategories/${subId}`, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchData();
    } catch (err) { alert('Delete failed'); }
  };

  // Bulk Assignment Handler
  const submitBulkAssign = async (e) => {
    e.preventDefault();
    if (!bulkTagSlug) return alert('Select a tag from the dropdown!');
    if (selectedIds.length === 0) return alert('Select checkboxes of products first.');

    try {
      await axios.put(`${API_URL}/products/bulk`, 
        { categoryName: bulkTagSlug, productIds: selectedIds },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Products successfully tagged!');
      setSelectedIds([]);
      fetchData(); // Refresh product UI
    } catch (error) {
      alert('Bulk assignment failed.');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const removeTag = async (productId, currentCategories, tagToRemove) => {
    if(!window.confirm(`Unlink product from /${tagToRemove}?`)) return;
    const newCategories = currentCategories.filter(c => c !== tagToRemove);
    try {
      await axios.put(`${API_URL}/products/${productId}`, 
        { categories: newCategories },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchData(); 
    } catch (err) {
      alert('Failed to remove tag');
    }
  };

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold font-sans tracking-widest text-white">TAXONOMY ENGINE</h1>
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Manage strict category hierarchies and assign products into them.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* LEFT COLUMN: RIGID TAXONOMY TREE */}
        <div>
          <h2 className="text-xl font-bold tracking-[0.2em] mb-6 text-white border-l-4 border-white pl-3">STRUCTURE EDITOR</h2>
          
          <form onSubmit={addCategory} className="flex gap-2 mb-6">
             <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} required placeholder="New Category (e.g. Audio)" className="flex-1 bg-black border border-gray-700 p-3 rounded font-mono text-sm uppercase tracking-widest text-white focus:outline-none focus:border-gray-500" />
             <button type="submit" className="bg-white text-black px-6 font-bold text-xs uppercase tracking-widest rounded hover:bg-gray-300">+</button>
          </form>

          <div className="space-y-4">
             {categories.map(cat => (
                <div key={cat._id} className="bg-gray-900 border border-gray-800 rounded p-4">
                   <div className="flex justify-between items-center bg-black p-3 rounded border border-gray-800">
                      <span className="font-bold tracking-widest text-white text-sm">{cat.name} <span className="text-gray-600 ml-2 font-mono text-[10px]">/{cat.slug}</span></span>
                      <div className="space-x-4">
                         <button onClick={() => setActiveParentId(cat._id)} className="text-blue-400 text-[10px] font-mono font-bold uppercase hover:text-blue-300">+ Sub</button>
                         <button onClick={() => deleteCategory(cat._id)} className="text-red-500 text-[10px] font-mono font-bold uppercase hover:text-red-400">Delete</button>
                      </div>
                   </div>

                   {/* Subcategory Inline Form */}
                   {activeParentId === cat._id && (
                     <form onSubmit={(e) => addSubcategory(e, cat._id)} className="flex gap-2 mt-4 ml-8">
                       <input type="text" autoFocus value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Subcategory name..." className="flex-1 bg-black border border-gray-700 p-2 text-xs rounded font-mono text-white" required />
                       <button type="button" onClick={() => setActiveParentId(null)} className="text-gray-500 text-xs px-2">X</button>
                       <button type="submit" className="bg-gray-700 text-white px-4 text-xs font-bold rounded">Add</button>
                     </form>
                   )}

                   {/* Listed Subcategories */}
                   {cat.subcategories && cat.subcategories.length > 0 && (
                     <ul className="mt-2 ml-8 space-y-2 border-l border-gray-700 pl-4 py-2">
                        {cat.subcategories.map(sub => (
                           <li key={sub._id} className="flex justify-between items-center text-xs font-mono text-gray-400">
                             <span>&mdash; {sub.name} <span className="text-gray-600 opacity-50">/{sub.slug}</span></span>
                             <button onClick={() => deleteSubcategory(cat._id, sub._id)} className="text-red-500/50 hover:text-red-500 uppercase font-bold text-[10px]">Del</button>
                           </li>
                        ))}
                     </ul>
                   )}
                </div>
             ))}
             {categories.length === 0 && <p className="text-gray-500 font-mono text-xs uppercase">No hierarchy exists yet.</p>}
          </div>
        </div>

        {/* RIGHT COLUMN: BULK TAGGER */}
        <div>
          <h2 className="text-xl font-bold tracking-[0.2em] mb-6 text-white border-l-4 border-blue-500 pl-3">BULK ASSIGNMENT</h2>
          
          <form onSubmit={submitBulkAssign} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl mb-6">
             <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Assign Selected ({selectedIds.length}) to Node:</label>
             <div className="flex gap-4">
                <select value={bulkTagSlug} onChange={(e) => setBulkTagSlug(e.target.value)} className="flex-1 bg-black border border-gray-700 text-white p-3 rounded font-mono text-sm tracking-widest focus:outline-none" required>
                   <option value="">-- Set Target Node --</option>
                   {categories.map(cat => (
                      <React.Fragment key={`opt-${cat._id}`}>
                        <option value={cat.slug} className="font-sans font-bold">{cat.name} (Parent)</option>
                        {cat.subcategories.map(sub => (
                           <option key={`opt-${sub._id}`} value={sub.slug} className="font-mono text-gray-400">&nbsp;&nbsp;&nbsp;&mdash; {sub.name}</option>
                        ))}
                      </React.Fragment>
                   ))}
                </select>
                <button type="submit" className="px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-xs rounded transition-colors">Apply</button>
             </div>
          </form>

          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-black/80 sticky top-0 backdrop-blur z-10 text-gray-400 uppercase font-mono tracking-widest text-[10px] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-4 w-12"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? products.map(p => p._id) : [])} checked={selectedIds.length === products.length && products.length > 0} className="rounded border-gray-700 bg-black cursor-pointer" /></th>
                  <th className="px-4 py-4 font-bold">Product Directory</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                   <tr key={p._id} onClick={() => toggleSelection(p._id)} className={`border-b border-gray-800 cursor-pointer transition-colors ${selectedIds.includes(p._id) ? 'bg-gray-800/80' : 'hover:bg-gray-800/30'}`}>
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(p._id)} readOnly className="rounded border-gray-700 bg-black pointer-events-none" /></td>
                      <td className="px-4 py-3">
                        <span className="block font-bold mb-1 text-white">{p.title}</span>
                        <div className="flex gap-1 flex-wrap pt-1">
                           {p.categories?.length > 0 ? p.categories.map(c => (
                             <span key={c} className="group relative inline-flex items-center text-[9px] pl-1.5 pr-0.5 py-0.5 border border-gray-700 bg-black text-gray-400 font-mono uppercase tracking-widest rounded hover:border-gray-500 transition-colors">
                               {c}
                               <button 
                                 type="button" 
                                 onClick={(e) => { e.stopPropagation(); removeTag(p._id, p.categories, c); }} 
                                 className="ml-1 text-gray-600 hover:text-red-500 font-bold px-1 rounded hover:bg-red-900/30 transition-all font-sans text-xs flex items-center justify-center leading-none"
                                 title="Remove tag"
                               >
                                 ×
                               </button>
                             </span>
                           )) : <span className="text-[9px] text-gray-600 font-mono uppercase pt-1">Untagged</span>}
                        </div>
                      </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
