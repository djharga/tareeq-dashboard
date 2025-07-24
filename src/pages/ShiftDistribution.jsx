import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SHIFTS = [
  {
    key: 'first',
    label: 'الشفت الأول (الثلاثاء 6م - السبت 12ظ)',
    manager: 'هشام القاضي',
  },
  {
    key: 'second',
    label: 'الشفت الثاني (السبت 12ظ - الثلاثاء 5م)',
    manager: 'سيف حماد',
  },
];

const EXCLUDED_RESIDENTS = ['شيحة', 'محمد عباس'];

function formatMessage(shiftLabel, manager, distribution) {
  let msg = `🗓️ ${shiftLabel}\n👤 مدير الشفت: ${manager}\n\n`;
  distribution.forEach(row => {
    msg += `👤 ${row.supervisor}\n`;
    if (row.tasks.length > 0) {
      msg += `المهام:\n`;
      row.tasks.forEach(t => { msg += `- ${t}\n`; });
    }
    if (row.sessions.length > 0) {
      msg += `الجلسات الفردية: ${row.sessions.join(', ')}\n`;
    }
    msg += `\n`;
  });
  return msg.trim();
}

export default function ShiftDistribution() {
  const [shift, setShift] = useState('first');
  const [supervisors, setSupervisors] = useState([]);
  const [residents, setResidents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: sup } = await supabase.from('supervisors').select('*');
      const { data: res } = await supabase.from('residents').select('*');
      const { data: tsk } = await supabase.from('tasks').select('*');
      setSupervisors(sup || []);
      setResidents(res || []);
      setTasks(tsk || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // توزيع الجلسات والمهام تلقائيًا
  const handleDistribute = () => {
    const filteredResidents = residents.filter(r => !EXCLUDED_RESIDENTS.includes(r.name));
    const shiftSupervisors = supervisors.filter(s => s.name !== getManagerName());
    let availableResidents = [...filteredResidents];
    let availableTasks = [...tasks];
    const dist = shiftSupervisors.map(sup => {
      // توزيع 3 جلسات عشوائية بدون تكرار
      let assignedSessions = [];
      for (let i = 0; i < 3 && availableResidents.length > 0; i++) {
        const idx = Math.floor(Math.random() * availableResidents.length);
        assignedSessions.push(availableResidents[idx].name);
        availableResidents.splice(idx, 1);
      }
      // توزيع 4-5 مهام عشوائية لكل مشرف
      let assignedTasks = [];
      let taskCount = Math.floor(Math.random() * 2) + 4; // 4 أو 5
      let tempTasks = [...availableTasks];
      for (let i = 0; i < taskCount && tempTasks.length > 0; i++) {
        const idx = Math.floor(Math.random() * tempTasks.length);
        assignedTasks.push(tempTasks[idx].title);
        tempTasks.splice(idx, 1);
      }
      return {
        supervisor: sup.name,
        sessions: assignedSessions,
        tasks: assignedTasks,
      };
    });
    setDistribution(dist);
  };

  const getManagerName = () => {
    return SHIFTS.find(s => s.key === shift)?.manager || '';
  };
  const getShiftLabel = () => {
    return SHIFTS.find(s => s.key === shift)?.label || '';
  };

  // التحكم اليدوي في الجلسات والمهام
  const handleAddSession = (idx) => {
    const name = prompt('أدخل اسم النزيل للجلسة:');
    if (name && name.trim()) {
      setDistribution(d => d.map((row, i) => i === idx ? { ...row, sessions: [...row.sessions, name.trim()] } : row));
    }
  };
  const handleDeleteSession = (idx, sidx) => {
    setDistribution(d => d.map((row, i) => i === idx ? { ...row, sessions: row.sessions.filter((_, j) => j !== sidx) } : row));
  };
  const handleEditSession = (idx, sidx) => {
    const name = prompt('تعديل اسم النزيل:', distribution[idx].sessions[sidx]);
    if (name && name.trim()) {
      setDistribution(d => d.map((row, i) => i === idx ? { ...row, sessions: row.sessions.map((s, j) => j === sidx ? name.trim() : s) } : row));
    }
  };
  const handleAddTask = (idx) => {
    const title = prompt('أدخل نص المهمة:');
    if (title && title.trim()) {
      setDistribution(d => d.map((row, i) => i === idx ? { ...row, tasks: [...row.tasks, title.trim()] } : row));
    }
  };
  const handleDeleteTask = (idx, tidx) => {
    setDistribution(d => d.map((row, i) => i === idx ? { ...row, tasks: row.tasks.filter((_, j) => j !== tidx) } : row));
  };
  const handleEditTask = (idx, tidx) => {
    const title = prompt('تعديل نص المهمة:', distribution[idx].tasks[tidx]);
    if (title && title.trim()) {
      setDistribution(d => d.map((row, i) => i === idx ? { ...row, tasks: row.tasks.map((t, j) => j === tidx ? title.trim() : t) } : row));
    }
  };

  // معاينة الرسالة النهائية
  const previewMessage = formatMessage(getShiftLabel(), getManagerName(), distribution);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">توزيع الشفتات والجلسات</h2>
      <div className="flex gap-4 mb-4">
        {SHIFTS.map(s => (
          <button key={s.key} onClick={() => setShift(s.key)} className={`px-4 py-2 rounded-md border ${shift === s.key ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'}`}>{s.label}</button>
        ))}
      </div>
      <button onClick={handleDistribute} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition mb-4">توزيع تلقائي للجلسات والمهام</button>
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h3 className="text-lg font-bold mb-2 text-blue-700">مدير الشفت: {getManagerName()}</h3>
          <table className="w-full text-right border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-blue-50">
              <tr className="text-gray-700 text-sm">
                <th className="py-2 px-4">المشرف</th>
                <th className="py-2 px-4">الجلسات الفردية</th>
                <th className="py-2 px-4">المهام اليومية</th>
              </tr>
            </thead>
            <tbody>
              {distribution.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-6">اضغط توزيع تلقائي للجلسات والمهام</td></tr>
              )}
              {distribution.map((row, i) => (
                <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-2 px-4 font-bold text-blue-900 bg-blue-50 rounded-r-xl">{row.supervisor}</td>
                  <td className="py-2 px-4">
                    <ul className="space-y-1">
                      {row.sessions.map((s, sidx) => (
                        <li key={sidx} className="flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{s}</span>
                          <button onClick={() => handleEditSession(i, sidx)} className="text-yellow-600 hover:underline text-xs">تعديل</button>
                          <button onClick={() => handleDeleteSession(i, sidx)} className="text-red-600 hover:underline text-xs">حذف</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleAddSession(i)} className="mt-1 text-xs bg-blue-100 text-blue-700 rounded px-2">إضافة جلسة</button>
                  </td>
                  <td className="py-2 px-4">
                    <ul className="space-y-1">
                      {row.tasks.map((t, tidx) => (
                        <li key={tidx} className="flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{t}</span>
                          <button onClick={() => handleEditTask(i, tidx)} className="text-yellow-600 hover:underline text-xs">تعديل</button>
                          <button onClick={() => handleDeleteTask(i, tidx)} className="text-red-600 hover:underline text-xs">حذف</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleAddTask(i)} className="mt-1 text-xs bg-blue-100 text-blue-700 rounded px-2">إضافة مهمة</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* زر معاينة الرسالة النهائية */}
      <button onClick={() => setShowPreview(true)} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition mt-4">معاينة الرسالة النهائية</button>
      {/* نافذة معاينة الرسالة النهائية */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setShowPreview(false)} className="absolute left-4 top-4 text-gray-500 hover:text-red-600 text-xl">×</button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">معاينة الرسالة النهائية</h3>
            <pre className="bg-gray-50 p-4 rounded text-right whitespace-pre-wrap text-gray-800 max-h-96 overflow-auto">{previewMessage}</pre>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition mt-4 w-full">إرسال الجدول للواتساب</button>
          </div>
        </div>
      )}
    </div>
  );
} 