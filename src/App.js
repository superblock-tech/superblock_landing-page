import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/profile";
import Header from "./components/Header";
import { LoginDialogProvider } from "./contexts/LoginDialogContext";

function App() {
  return (
    <AuthProvider>
      <LoginDialogProvider>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </LoginDialogProvider>
    </AuthProvider>
  );
}

export default App;
