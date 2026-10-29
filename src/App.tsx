import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";

import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatcher from "./pages/JobMatcher";
import CoverLetter from "./pages/CoverLetter";
import SavedJobs from "./pages/SavedJobs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background md:flex">
        <Sidebar />

        <main className="min-w-0 flex-1 pt-16 md:pt-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/job-matcher" element={<JobMatcher />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
