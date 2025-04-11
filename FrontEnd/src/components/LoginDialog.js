import React, { useState } from "react";
import { CloseIcon, RightArrow } from "../Icons";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {usePresaleContext} from "../contexts/PresaleContext";

export default function LoginDialog({ isOpen, onClose }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { openLoginDialog } = usePresaleContext();

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        const bearerToken = data.token;

        login(bearerToken);

        navigate("/profile");
      } catch (error) {
        console.error(error);
        toast.error("Invalid credentials!");
      } finally{
        setLoading(false)
      }

    setCode("");

    // onClose();
  };

  return (
    <div className="">
      {/* Dialog Panel */}
      <div className="bg-[#7765CE] p-8 rounded-lg relative max-w-md w-full mx-2">
        <h2 className="text-[24px] text-white mb-4 font-bold">
          Log In With Code
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Reusing input styles from previous code */}
          <div
              className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px] mb-4">
            <div className="p-[13px] w-full h-full bg-[#b4b1e2] rounded-[10px]">
              <input
                  required
                  type="text"
                  placeholder="Enter your code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-white font-normal text-[18px] leading-[34px] placeholder:text-gray-200"
              />
            </div>
          </div>

          {/* Button with the provided styles */}
          <button
              type="submit"
              className="w-full text-center rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]
                       bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]
                       hover:from-[#7B36B6] hover:to-[#1BA3FF]
                       transition-all duration-300"
              disabled={loading}
          >
            <span className="text-white text-[16px] leading-[29.87px] font-[450]">
              {loading ? "Logging in..." : "Log in"}
            </span>
            <RightArrow/>
          </button>

          <button onClick={openLoginDialog}
             className=" w-full mt-5 hidden rounded-[12px] xl:flex items-center py-[6.58px] px-[20px] gap-[24px] bg-gradient-to-r from-[#FFFFFF] to-[#AAA] hover:from-[#AAA] hover:to-[#FFFFFF] transition-all duration-300">
              <span className="text-black text-[16px] leading-[29.87px] font-[450]">
                Apply For Presale
              </span>
          </button>
        </form>

        {/*<button*/}
        {/*  onClick={onClose}*/}
        {/*  className="absolute top-2 right-2 text-white fill-white w-7"*/}
        {/*>*/}
        {/*  <CloseIcon />*/}
        {/*</button>*/}
      </div>
    </div>
  );
}
