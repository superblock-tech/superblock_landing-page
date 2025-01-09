import React, { useState } from "react";
import { ArrowRightBlack, EmailIcon, FlagIcon } from "../Icons";
import toast from "react-hot-toast";

export default function Join() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAgreed) {
      toast("Please agree to store contact details.", { icon: "ℹ️" });
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
          body: JSON.stringify({ fullName, email, phone }),
        });

        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        console.log(response)
        setFullName("");
        setEmail("");
        setPhone("");
        setIsAgreed(false);
        toast.success("Thank you! Your information was submitted successfully.");
      } catch (err) {
        console.error("Error:", err);
        toast.error("There was an error submitting the form.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="mb-[100px]">
      <div className="container">
        <div
          className="max-w-[1596px] mx-auto lg:rounded-[60px] rounded-[20px] sm:py-[39px] py-[21px] pl-[12px] sm:pl-[69px] sm:pr-[57px] pr-[12px] overflow-hidden"
          style={{
            background: "linear-gradient(107deg, #7B36B6 0%, #1BA3FF 100%)",
          }}
        >
          <div className="grid 2xl:grid-cols-10 grid-cols-1 md:gap-[62px] gap-[18px] relative">
            <div
              className="absolute bg-[rgba(255, 255, 255, 0.04)] lg:w-[873px] lg:h-[873px] w-[514px] h-[619px] rounded-full lg:border-[111px] 2xl:-top-[174px] border-[78px] 2xl:-left-[35%] sm:-top-[30%] sm:-left-[30%] -top-[40%] -left-[70%]  "
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                borderColor: "rgba(255, 255, 255, 0.04)",
              }}
            ></div>
            <div
              className="absolute bg-[rgba(255, 255, 255, 0.04)] lg:w-[873px] lg:h-[873px] w-[514px] h-[619px] rounded-full lg:border-[111px] 2xl:-top-[80%] border-[78px] 2xl:-right-[30%] -bottom-[20%] md:-bottom-[50%] -right-[20%] rotate-90 xl:rotate-0 "
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                borderColor: "rgba(255, 255, 255, 0.04)",
              }}
            ></div>

            {/* Left section */}
            <div className="w-full 2xl:col-span-4 gri bg-white/40 min-h-[282px] sm:min-h-[462px] lg:rounded-[50px] rounded-[20px] flex justify-center items-center flex-col">
              <h1 className="text-center text-[#faf4ff] text-[42px] lg:text-[70px] font-bold lg:leading-[59px] leading-[36px] font-sans relative">
                Join Presale
              </h1>
              <h2 className="text-center text-[#faf4ff] text-[28px] lg:text-[47px] font-bold lg:leading-[59px] leading-[36px] font-sans relative">
                link to presale website
              </h2>
              <button
                className="text-[#7B36B6] text-[19px] sm:text-[31px] capitalize font-normal sm:leading-[51px] leading-[31px] sm:py-[15px] py-[10px] sm:px-[40px] px-[24px] rounded-[92px] border-[1.5px] border-[#C3C0C0] font-futura-500 mt-[18px] relative"
                style={{
                  background:
                    "linear-gradient(136deg, rgba(249, 250, 251, 0.87) 66.43%, rgba(227, 231, 249, 0.87) 97.11%)",
                }}
                disabled={loading}
              >
                click here
              </button>
            </div>

            {/* Right section (form) */}
            <div
              className="2xl:col-span-6 w-full lg:rounded-[50px] rounded-[20px] py-[42px] px-[23px] relative"
              style={{
                background:
                  "linear-gradient(113deg, rgba(123, 54, 182, 0.50) -35.74%, rgba(255, 255, 255, 0.50) 145.61%)",
              }}
            >
              <h1 className="text-center 2xl:text-left text-[#faf4ff] text-[36px] sm:text-[40px] font-bold lg:leading-[59px] leading-[36px] font-sans mb-[22px] sm:mb-[36px]">
                Join Our Dev Waitlist!
              </h1>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[18px] gap-x-[28px]">
                  {/* Full name */}
                  <div className="flex flex-col gap-[9px]">
                    <span className="text-white font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                      What is your full name?
                      <span className="text-[#f00]">*</span>
                    </span>
                    <div className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px]">
                      <div className="p-[13px] w-full h-full bg-[#b4b1e2] rounded-[10px]">
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-full bg-transparent border-none outline-none text-white font-normal text-[18px] leading-[34px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-[9px]">
                    <span className="text-white font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                      What is your email address?
                      <span className="text-[#f00]">*</span>
                    </span>
                    <div className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px]">
                      <div className="p-[13px] w-full h-full bg-[#b4b1e2] rounded-[10px] flex items-center gap-2">
                        <span className="cursor-pointer">
                          <EmailIcon />
                        </span>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-full bg-transparent border-none outline-none text-white font-normal text-[18px] leading-[34px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-[9px] lg:col-span-2">
                    <span className="text-white font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
                      What is your phone number?
                      <span className="text-[#f00]">*</span>
                    </span>
                    <div className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px]">
                      <div className="p-[13px] w-full h-full bg-[#b4b1e2] rounded-[10px] flex items-center gap-2">
                        <span className="cursor-pointer">
                          <FlagIcon />
                        </span>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-full bg-transparent border-none outline-none text-white font-normal text-[18px] leading-[34px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkbox */}
                <label className="mt-[18px] flex items-center gap-[11px]">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="appearance-none h-[22px] w-[22px] sm:h-[26px] sm:w-[26px] border-[0.5px] border-white rounded-[4.59px] focus:outline-none transition duration-200 relative cursor-pointer"
                    style={{
                      boxShadow:
                        "0px 18.38px 36.76px 0px rgba(255, 84, 62, 0.02)",
                    }}
                  />
                  <p className="text-[#e3e3e3] sm:text-[16px] text-[13px] sm:leading-[34px] font-normal flex-1">
                    I agree that my contact details will be stored.
                  </p>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-white sm:p-[18px] p-[15px] rounded-[13px] backdrop-blur-[2px] text-black sm:text-[20px] text-[17px] leading-[33px] font-[600] mt-[19px] flex items-center gap-[20px]"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"} <ArrowRightBlack />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}