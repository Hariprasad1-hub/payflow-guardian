import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { AIAssistant } from './pages/AIAssistant';
import { PaymentActivity } from './pages/PaymentActivity';
import { Settings } from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Persistent layout components */}
      <Sidebar />
      <Header />
      {/* Main content area – offset for fixed sidebar/header */}
      <div className="ml-64 mt-16 p-4 min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/payments" element={<PaymentActivity />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;