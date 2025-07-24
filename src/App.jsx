import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Tasks from './pages/Tasks';
import Residents from './pages/Residents';
import Sessions from './pages/Sessions';
import Supervisors from './pages/Supervisors';
import ShiftDistribution from './pages/ShiftDistribution';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/supervisors" element={<Supervisors />} />
          <Route path="/shift-distribution" element={<ShiftDistribution />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="*" element={<Tasks />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
} 