
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('tasks').select('*');
    setTasks(data || []);
    setLoading(false);
  };

  const addTask = async () => {
    if (!title.trim()) {
      setMessage('يرجى إدخال عنوان المهمة');
      return;
    }
    setLoading(true);
    await supabase.from('tasks').insert({ title });
    setTitle('');
    setMessage('تمت إضافة المهمة بنجاح');
    load();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المهمة؟')) return;
    setDeletingId(id);
    await supabase.from('tasks').delete().eq('id', id);
    setMessage('تم حذف المهمة');
    setDeletingId(null);
    load();
  };

  const startEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      setMessage('يرجى إدخال عنوان صحيح');
      return;
    }
    setLoading(true);
    await supabase.from('tasks').update({ title: editTitle }).eq('id', id);
    setMessage('تم تعديل المهمة');
    setEditingId(null);
    setEditTitle('');
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">المهام اليومية</h2>
      <div className="flex gap-2 mb-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان المهمة" className="border p-2 flex-1 rounded-md focus:border-blue-500 outline-none" />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition">➕</button>
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
                <th className="py-2">عنوان المهمة</th>
                <th className="py-2">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-6">لا توجد مهام حالياً</td></tr>
              )}
              {tasks.map((t, i) => (
                <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-2 w-8">{i + 1}</td>
                  <td className="py-2">
                    {editingId === t.id ? (
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="border p-1 rounded-md w-32" />
                    ) : (
                      t.title
                    )}
                  </td>
                  <td className="py-2 w-32 flex gap-2">
                    {editingId === t.id ? (
                      <>
                        <button onClick={() => saveEdit(t.id)} className="bg-green-500 text-white px-2 rounded hover:bg-green-600">حفظ</button>
                        <button onClick={cancelEdit} className="bg-gray-200 text-gray-700 px-2 rounded hover:bg-gray-300">إلغاء</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(t.id, t.title)} className="bg-yellow-100 text-yellow-700 rounded-full p-2 hover:bg-yellow-200 transition">✏️</button>
                        <button onClick={() => deleteTask(t.id)} disabled={deletingId === t.id} className="bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition">{deletingId === t.id ? '...' : '🗑️'}</button>
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
