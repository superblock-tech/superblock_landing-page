import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { RightArrow } from "../Icons";
import { ConnectKitButton } from "connectkit";
import TokenPurchase from "../components/TokenPurchase";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);


  const handleLogout = () => {
    logout();
    navigate("/");
  };


  return (
    <div
      className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center mt-10"
      style={{ backgroundImage: "url('assets/images/bg.png')" }}
    >
      {/* Wallets List */}
      <TokenPurchase/>

      <br/>

      {/* Connect Wallet Button */}
      <ConnectKitButton />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]
                   bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]
                   hover:from-[#7B36B6] hover:to-[#1BA3FF]
                   transition-all duration-300 mt-8"
      >
        <span className="text-white text-[16px] leading-[29.87px] font-[450]">
          Logout
        </span>
        <RightArrow />
      </button>
    </div>
  );
}