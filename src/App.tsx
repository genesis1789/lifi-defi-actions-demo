import { Routes, Route, Navigate } from 'react-router-dom';
import DeFiActionsDemo from './pages/DeFiActionsDemo';
import Refinements from './pages/Refinements';

function App() {
  return (
    <Routes>
      {/* Original Actions Mode presentation */}
      <Route path="/" element={<DeFiActionsDemo />} />
      
      {/* Quick add-on: What I'd refine */}
      <Route path="/refinements" element={<Refinements />} />
      
      {/* Redirect all other routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
