import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Supervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('supervisors').select('*');
    setSupervisors(data || []);
    setLoading(false);
  };

  const addSupervisor = async () => {
    if (!name.trim()) {
      setMessage('يرجى إدخال اسم المشرف');
      return;
    }
    setLoading(true);
    await supabase.from('supervisors').insert({ name });
    setName('');
    setMessage('تمت إضافة المشرف بنجاح');
    load();
  };

  const deleteSupervisor = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المشرف؟')) return;
    setDeletingId(id);
    await supabase.from('supervisors').delete().eq('id', id);
    setMessage('تم حذف المشرف');
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
    await supabase.from('supervisors').update({ name: editName }).eq('id', id);
    setMessage('تم تعديل اسم المشرف');
    setEditingId(null);
    setEditName('');
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Supervisors</h2>
      <div className="flex gap-2 mb-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المشرف" className="border p-2 flex-1 rounded-md focus:border-blue-500 outline-none" />
        <button onClick={addSupervisor} className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition">➕</button>
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
                <th className="py-2">اسم المشرف</th>
                <th className="py-2">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-6">لا يوجد مشرفين حالياً</td></tr>
              )}
              {supervisors.map((s, i) => (
                <tr key={s.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-2 w-8">{i + 1}</td>
                  <td className="py-2">
                    {editingId === s.id ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="border p-1 rounded-md w-32" />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td className="py-2 w-32 flex gap-2">
                    {editingId === s.id ? (
                      <>
                        <button onClick={() => saveEdit(s.id)} className="bg-green-500 text-white px-2 rounded hover:bg-green-600">حفظ</button>
                        <button onClick={cancelEdit} className="bg-gray-200 text-gray-700 px-2 rounded hover:bg-gray-300">إلغاء</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(s.id, s.name)} className="bg-yellow-100 text-yellow-700 rounded-full p-2 hover:bg-yellow-200 transition">✏️</button>
                        <button onClick={() => deleteSupervisor(s.id)} disabled={deletingId === s.id} className="bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition">{deletingId === s.id ? '...' : '🗑️'}</button>
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