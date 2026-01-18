import { Routes, Route } from 'react-router-dom';
import DeFiActionsDemo from './pages/DeFiActionsDemo';
import Refinements from './pages/Refinements';
import WidgetRecipesProposal from './pages/WidgetRecipesProposal';
import WidgetIterationDemo from './pages/WidgetIterationDemo';

function App() {
  return (
    <Routes>
      {/* Original Actions Mode presentation */}
      <Route path="/" element={<DeFiActionsDemo />} />
      
      {/* Quick add-on: What I'd refine */}
      <Route path="/refinements" element={<Refinements />} />
      
      {/* Full detailed proposal (if needed) */}
      <Route path="/proposal" element={<WidgetRecipesProposal />} />
      
      {/* Other pages */}
      <Route path="/widget-comparison" element={<WidgetIterationDemo />} />
    </Routes>
  );
}

export default App;
