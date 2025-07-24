
import { useState } from 'react';
import axios from 'axios';

export default function Sessions() {
  const [summary, setSummary] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const analyzeSession = async () => {
    if (!summary.trim()) {
      setMessage('يرجى كتابة ملخص الجلسة');
      return;
    }
    setLoading(true);
    setMessage('');
    setResult('');
    try {
    const res = await axios.post('https://openrouter.ai/api/analyze', {
      model: 'mistral',
      prompt: `حلل باللهجة المصرية:\n${summary}`
    });
    setResult(res.data.output || 'نتيجة التحليل غير متوفرة');
    } catch (e) {
      setResult('حدث خطأ أثناء التحليل');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">تحليل الجلسة</h2>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <textarea rows="6" className="w-full border p-2 rounded-md focus:border-blue-500 outline-none" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="اكتب ملخص الجلسة هنا..." />
        <button onClick={analyzeSession} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">🔍 تحليل</button>
        {message && <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-sm">{message}</div>}
        {loading && <div className="flex justify-center py-4"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>}
        {result && <pre className="bg-gray-50 p-3 rounded text-right whitespace-pre-wrap text-gray-800">{result}</pre>}
      </div>
    </div>
  );
}
