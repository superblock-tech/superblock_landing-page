import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/profile";
import Header from "./components/Header";
import { PresaleContextProvider } from "./contexts/PresaleContext";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

function App() {
  const client = createClient(
    getDefaultClient({
      appName: "ConnectKit Superblock",
      alchemyId: process.env.REACT_APP_ALCHEMY_ID,
      //infuraId: process.env.INFURA_ID,
      chains: [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]
    })
  );

  return (
    <AuthProvider>
      <WagmiConfig client={client}>
        <ConnectKitProvider theme="auto">
          <PresaleContextProvider>
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
          </PresaleContextProvider>
          </ConnectKitProvider>
      </WagmiConfig>
    </AuthProvider>
  );
}

export default App;
