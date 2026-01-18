import { Routes, Route, Navigate } from 'react-router-dom';
import DeFiActionsDemo from './pages/DeFiActionsDemo';
import Refinements from './pages/Refinements';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DeFiActionsDemo />} />
      <Route path="/refinements" element={<Refinements />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
