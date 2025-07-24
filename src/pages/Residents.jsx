
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('residents').select('*');
    setResidents(data || []);
    setLoading(false);
  };

  const addResident = async () => {
    if (!name.trim()) {
      setMessage('يرجى إدخال اسم المقيم');
      return;
    }
    setLoading(true);
    await supabase.from('residents').insert({ name });
    setName('');
    setMessage('تمت إضافة المقيم بنجاح');
    load();
  };

  const deleteResident = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المقيم؟')) return;
    setDeletingId(id);
    await supabase.from('residents').delete().eq('id', id);
    setMessage('تم حذف المقيم');
    setDeletingId(null);
    load();
  };

  const startEdit = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      setMessage('يرجى إدخال اسم صحيح');
      return;
    }
    setLoading(true);
    await supabase.from('residents').update({ name: editName }).eq('id', id);
    setMessage('تم تعديل اسم المقيم');
    setEditingId(null);
    setEditName('');
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">المقيمين</h2>
      <div className="flex gap-2 mb-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المقيم" className="border p-2 flex-1 rounded-md focus:border-blue-500 outline-none" />
        <button onClick={addResident} className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition">➕</button>
      </div>
      {message && <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded mb-2 text-sm">{message}</div>}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-right">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-2">#</th>
                <th className="py-2">اسم المقيم</th>
                <th className="py-2">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {residents.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-6">لا يوجد مقيمين حالياً</td></tr>
              )}
              {residents.map((r, i) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-2 w-8">{i + 1}</td>
                  <td className="py-2">
                    {editingId === r.id ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="border p-1 rounded-md w-32" />
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className="py-2 w-32 flex gap-2">
                    {editingId === r.id ? (
                      <>
                        <button onClick={() => saveEdit(r.id)} className="bg-green-500 text-white px-2 rounded hover:bg-green-600">حفظ</button>
                        <button onClick={cancelEdit} className="bg-gray-200 text-gray-700 px-2 rounded hover:bg-gray-300">إلغاء</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(r.id, r.name)} className="bg-yellow-100 text-yellow-700 rounded-full p-2 hover:bg-yellow-200 transition">✏️</button>
                        <button onClick={() => deleteResident(r.id)} disabled={deletingId === r.id} className="bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition">{deletingId === r.id ? '...' : '🗑️'}</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
