import React, {createContext, useContext, useState} from "react";
import LoginDialog from "../components/LoginDialog"; // adapt path as needed
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext";
import Modal from "../components/Modal";
import {ArrowRightBlack, EmailIcon, FlagIcon} from "../Icons";
import toast from "react-hot-toast";

const PresaleContext = createContext();

export function usePresaleContext() {
    return useContext(PresaleContext);
}

export function PresaleContextProvider({children}) {
    const [isOpen, setIsOpen] = useState(false);
    const [presaleModalOpen, setPresaleModalOpen] = useState(false);
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);

    const openLoginDialog = () => setPresaleModalOpen(true)
    const closeLoginDialog = () => setIsOpen(false);

    const handleOpenLoginDialog = () => {
        if (token) {
            navigate("/profile");
        } else {
            openLoginDialog();
        }
    };


    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [investmentInterest, setInvestmentInterest] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAgreed) {
            toast("Please agree to store contact details.", {icon: "ℹ️"});
            return;
        }

        if (!loading) {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({fullName, email, phone, joinWhitelist: 1, investmentInterest}),
                });

                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                setFullName("");
                setEmail("");
                setPhone("");
                setIsAgreed(false);
                setPresaleModalOpen(false)
                toast.success("Your application has been submitted, Thank you!");
            } catch (err) {
                console.error("Error:", err);
                toast.error("There was an error submitting the form.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <PresaleContext.Provider
            value={{
                isOpen,
                openLoginDialog: handleOpenLoginDialog,
                closeLoginDialog,
            }}
        >
            {children}
            <LoginDialog isOpen={isOpen} onClose={closeLoginDialog}/>
            <Modal open={presaleModalOpen} onOpenChange={setPresaleModalOpen}>
                <Modal.Content className="max-w-3xl">
                    <Modal.Close onClick={() => setPresaleModalOpen(false)}/>
                    <Modal.Header>
                        <Modal.Title className={"text-3xl"}>Founders Circle Application</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-8">

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[18px] gap-x-[28px]">
                                {/* Full name */}
                                <div className="flex flex-col gap-[9px]">
                  <span className="font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                    What is your full name?
                    <span className="text-[#f00]">*</span>
                  </span>
                                    <div
                                        className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px]">
                                        <div className="p-[13px] w-full h-full bg-[#ebeaff] rounded-[10px]">
                                            <input
                                                required
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full h-full bg-transparent border-none outline-none font-normal text-[18px] leading-[34px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-[9px]">
                  <span className="font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                    What is your email address?
                    <span className="text-[#f00]">*</span>
                  </span>
                                    <div
                                        className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px]">
                                        <div
                                            className="p-[13px] w-full h-full bg-[#ebeaff] rounded-[10px] flex items-center gap-2">
                      <span className="cursor-pointer">
                        <EmailIcon/>
                      </span>
                                            <input
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-full bg-transparent border-none outline-none font-normal text-[18px] leading-[34px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col gap-[9px] lg:col-span-2">
                  <span className="font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                    What is your phone number?
                    <span className="text-[#f00]">*</span>
                  </span>
                                    <div
                                        className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px]">
                                        <div
                                            className="p-[13px] w-full h-full bg-[#ebeaff] rounded-[10px] flex items-center gap-2">
                      <span className="cursor-pointer">
                        <FlagIcon/>
                      </span>
                                            <input
                                                required
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full h-full bg-transparent border-none outline-none font-normal text-[18px] leading-[34px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown */}
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px',}}>
                                <label className="mt-[18px] flex items-center gap-[11px]">
                                    <span
                                        className="font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                                        Investment interest:
                                    </span>
                                </label>
                                <select
                                    id="token-select"
                                    className="w-full bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px]"
                                    value={investmentInterest}
                                    onChange={(e) => setInvestmentInterest(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        backgroundColor: 'white',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        height: '60px'
                                    }}
                                >
                                    <option value="0">-- Select --</option>
                                    <option value="10000">Between $2,000 and $10,000</option>
                                    <option value="10000">Between $10,000 and $50,000</option>
                                    <option value="50000">Between $50,000 and $250,000</option>
                                    <option value="250000">More than $250,000</option>
                                </select>

                            </div>

                            {/* Checkbox */}
                            <label className="mt-[18px] flex items-center gap-[11px]">
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    className="appearance-none h-[22px] w-[22px] sm:h-[26px] sm:w-[26px] border-[0.5px] bg-purple-500 rounded-[4.59px] focus:outline-none transition duration-200 relative cursor-pointer"
                                    style={{
                                        boxShadow:
                                            "0px 18.38px 36.76px 0px rgba(255, 84, 62, 0.02)",
                                    }}
                                />
                                <p className="sm:text-[16px] text-[13px] sm:leading-[34px] font-normal flex-1">
                                    I agree to receive emails related to updates, offers, and information about
                                    SUPERBLOCK.
                                </p>
                            </label>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="bg-white shadow-md hover:shadow-lg transition-shadow sm:p-[18px] p-[15px] rounded-[13px] backdrop-blur-[2px] text-black sm:text-[20px] text-[17px] leading-[33px] font-[600] mt-[19px] flex items-center gap-[20px]"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Apply"} <ArrowRightBlack/>
                            </button>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="text-purple-700" onClick={() => {
                            setPresaleModalOpen(false)
                            setIsOpen(true)
                        }}>Already have a code?
                        </button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </PresaleContext.Provider>
    );
}
