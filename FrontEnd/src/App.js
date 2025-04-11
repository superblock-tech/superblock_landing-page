import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/profile";
import Header from "./components/Header";
import { PresaleContextProvider } from "./contexts/PresaleContext";
import { Web3Provider } from "./components/Web3Provider";

function App() {
  return (
    <AuthProvider>
        <Web3Provider>
          <PresaleContextProvider>
            <Toaster />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/profile"
                element={
                    <ProfilePage />
                }
              />
                <Route
                    path="/dashboard"
                    element={
                        <ProfilePage />
                    }
                />

            </Routes>
          </PresaleContextProvider>
          </Web3Provider>
    </AuthProvider>
  );
}

export default App;
