// src/App.jsx

import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import VoterLayout from './components/VoterLayout'; // Layout for Voter Pages
import CandidatesPage from './components/CandidatesPage';
import ApplicationPage from './components/ApplicationPage'; // <--- ADDED IMPORT HERE
import AdminLayout from './components/AdminLayout'; // Import the new layout
import ManageVoters from './components/ManageVoters';
import ManageCandidates from './components/ManageCandidates';
import ManageElections from './components/ManageElections';
import ViewResults from './components/ViewResults';

// --- Placeholder Components ---
const HomePage = () => (
  // 1. Full screen height, center contents (flex flex-col items-center justify-center)
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">

    {/* 2. Styled Card for content (max-w-xl limits width, mx-auto centers horizontally) */}
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl w-full text-center">

      {/* 3. Title styling */}
      <h1 className="text-4xl font-extrabold text-teal-800 mb-4">
        WELCOME TO THE ONLINE VOTING PLATFORM!
      </h1>

      {/* 4. Description styling */}
      <p className="text-xl text-gray-600 mb-8">
        Your secure platform for managing and casting votes.
      </p>

      {/* 5. Styled Button (using your existing btn-primary/btn-secondary styles) */}
      <Link to="/login" className="btn-primary inline-block mt-4">
        Click Here to Login
      </Link>

    </div>
  </div>
);

const VoterDashboard = () => (
  <div className="card max-w-md mx-auto mt-10">
    <h1 className="text-3xl font-bold text-center text-teal-800 mb-4">Voter Dashboard</h1>
    <p className="text-center">Ready to vote.</p>
  </div>
);

const AdminDashboard = () => (
  <div className="card max-w-md mx-auto mt-10">
    <h1 className="text-3xl font-bold text-center text-teal-800 mb-4">Admin Dashboard</h1>
    <p className="text-center">Manage Elections.</p>
  </div>
);
// ------------------------------

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ------------------------------------------------------------------- */}
        {/* PARENT VOTER ROUTE: Applies ProtectedRoute and VoterLayout to ALL children */}
        <Route
          path="/voter" // <--- PARENT PATH is /voter
          element={<ProtectedRoute requiredRole="voter"><VoterLayout /></ProtectedRoute>}
        >
          {/* These routes will render INSIDE VoterLayout's <Outlet /> */}

          {/* 1. Default route for /voter (usually the dashboard) */}
          <Route index element={<VoterDashboard />} />

          {/* 2. Specific Dashboard route: /voter/dashboard */}
          <Route path="dashboard" element={<VoterDashboard />} />

          {/* 3. Candidates/Elections route: /voter/candidates */}
          <Route path="candidates" element={<CandidatesPage />} />

          {/* 4. Application route: /voter/apply */}
          <Route path="apply" element={<ApplicationPage />} />
        </Route>
        {/* ------------------------------------------------------------------- */}

        {/* ------------------------------------------------------------------- */}
        {/* PARENT ADMIN ROUTE: Applies ProtectedRoute and AdminLayout to ALL children */}
        <Route
          path="/admin" // <--- PARENT PATH is /admin
          element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}
        >
          {/* These routes will render INSIDE AdminLayout's <Outlet /> */}

          {/* 1. Default route for /admin (usually the dashboard) */}
          <Route index element={<AdminDashboard />} />

          {/* 2. Specific Dashboard route: /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* 3. Management Pages */}
          <Route path="voters" element={<ManageVoters />} />
          <Route path="candidates" element={<ManageCandidates />} />
          <Route path="elections" element={<ManageElections />} />
          <Route path="results" element={<ViewResults />} />
        </Route>
        {/* ------------------------------------------------------------------- */}

        {/* Fallback for 404 */}
        <Route path="*" element={
          <div className="card text-center">
            <h1 className="text-error">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;