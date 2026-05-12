import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoginPage from '@/pages/Auth/LoginPage';
import Dashboard from '@/pages/Dashboard/Dashboard';
import CreateProposal from '@/pages/Proposal/CreateProposal';
import EditProposal from '@/pages/Proposal/EditProposal';
import SavedProposals from '@/pages/Proposal/SavedProposals';
import ProposalPreview from '@/pages/Proposal/ProposalPreview';
import GlobalHomeButton from '@/components/Navigation/GlobalHomeButton';
import LoadingScreen from '@/components/ui/LoadingScreen';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <GlobalHomeButton />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        
        <Route 
          path="/" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/create" 
          element={user ? <CreateProposal /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/edit/:id" 
          element={user ? <EditProposal /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/saved" 
          element={user ? <SavedProposals /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/preview/:id" 
          element={user ? <ProposalPreview /> : <Navigate to="/login" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
