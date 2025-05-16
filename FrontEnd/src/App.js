import {Toaster} from "react-hot-toast";
import {AuthProvider} from "./contexts/AuthContext";
import {Route, Routes, useLocation} from "react-router-dom";
import HomePage from "./pages";
import ProfilePage from "./pages/profile";
import Header from "./components/Header";
import {PresaleContextProvider} from "./contexts/PresaleContext";
import {Web3Provider} from "./components/Web3Provider";
import {useEffect} from "react";
import {pageview} from "./utils/gtag";

function App() {
    const location = useLocation();

    useEffect(() => {
        pageview(location.pathname + location.search);
    }, [location]);


    return (
        <AuthProvider>
            <Web3Provider>
                <PresaleContextProvider>
                    <Toaster/>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route
                            path="/profile"
                            element={
                                <ProfilePage/>
                            }
                        />
                        <Route
                            path="/presale"
                            element={
                                <ProfilePage/>
                            }
                        />

                    </Routes>
                </PresaleContextProvider>
            </Web3Provider>
        </AuthProvider>
    );
}

export default App;
