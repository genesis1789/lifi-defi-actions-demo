import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Dashboard from './pages/Dashboard';
import DeFiActionsDemo from './pages/DeFiActionsDemo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/demo" element={<DeFiActionsDemo />} />
    </Routes>
  );
}

export default App;
