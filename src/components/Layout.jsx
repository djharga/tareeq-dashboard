import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUsers, FaChartBar, FaUserTie, FaTable } from 'react-icons/fa';

const navLinks = [
  { to: '/tasks', label: 'المهام اليومية', icon: <FaTasks /> },
  { to: '/residents', label: 'المقيمين', icon: <FaUsers /> },
  { to: '/supervisors', label: 'المشرفين', icon: <FaUserTie /> },
  { to: '/shift-distribution', label: 'توزيع الشفتات', icon: <FaTable /> },
  { to: '/sessions', label: 'تحليل الجلسة', icon: <FaChartBar /> },
];

export default function Layout({ children }) {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block fixed right-0 top-0 h-full z-40">
        <div className="flex items-center pb-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-blue-700">طريق <span className="bg-blue-600 text-white px-2 rounded-md">DASH</span></span>
        </div>
        <nav className="mt-8 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-blue-50 transition ${location.pathname === link.to ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {/* Overlay for mobile */}
      {/* Main Content */}
      <div className="flex-1 md:mr-64">
        {/* Navbar */}
        <header className="bg-white shadow sticky top-0 z-30 flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-700">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">مرحباً 👋</span>
            <img src="https://placehold.co/40x40" alt="user" className="w-10 h-10 rounded-full border-2 border-blue-100" />
          </div>
        </header>
        <main className="p-6 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
} 