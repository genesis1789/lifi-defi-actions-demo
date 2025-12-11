import { Routes, Route } from 'react-router-dom';
import DeFiActionsDemo from './pages/DeFiActionsDemo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DeFiActionsDemo />} />
      <Route path="/demo" element={<DeFiActionsDemo />} />
    </Routes>
  );
}

export default App;
