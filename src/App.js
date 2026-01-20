import Home from "./components/Home";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./views/Layout";
import { URLS } from "./urls";
import UserLayout from "./views/UserLayout";
import AdminDashboard from "./views/AdminDashboard";
import Members from "./views/Members";
import Trainers from "./views/Trainers";
import UserDashboard from "./views/UserDashboard";
import TrainerDashboard from "./views/TrainerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginProtectedRoute from "./components/LoginProtectedRoute";
import { ToastProvider } from "./hooks/useToast";

function App() {
  return (
    <>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Navigate to={URLS.HOME} replace />} />
              <Route
                path={URLS.HOME}
                element={
                  <LoginProtectedRoute>
                    <Home />
                  </LoginProtectedRoute>
                }
              />
            </Route>
            <Route path="/" element={<UserLayout />}>
              <Route
                path={URLS.ADMIN}
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={URLS.MEMBERS}
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path={URLS.TRAINERS}
                element={
                  <ProtectedRoute>
                    <Trainers />
                  </ProtectedRoute>
                }
              />
              <Route
                path={URLS.USERS}
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={URLS.TRAINERS_DASHBOARD}
                element={
                  <ProtectedRoute><TrainerDashboard /></ProtectedRoute>

                }
              />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </>
  );
}

export default App;
