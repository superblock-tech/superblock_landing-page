import { useState } from "react";

export default function InvestmentDropdown({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { value: "0", label: "-- Select --" },
        { value: "2000-10000", label: "Between $2,000 and $10,000" },
        { value: "10000-50000", label: "Between $10,000 and $50,000" },
        { value: "50000-250000", label: "Between $50,000 and $250,000" },
        { value: "250000+", label: "More than $250,000" },
    ];

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div className="flex flex-col gap-[9px]">
            <label className="mt-[18px] flex items-center gap-[11px]">
        <span className="font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
          Investment interest: <span className="text-[#f00]">*</span>
        </span>
            </label>

            <div className="relative">
                {/* Градиентная рамка */}
                <div className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px]">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between px-[13px] w-full h-full bg-[#ebeaff] rounded-[10px] cursor-pointer"
                    >
            <span className="font-normal text-[16px] leading-[34px] text-black truncate">
              {selectedOption?.label || "-- Select --"}
            </span>
                        <span className="text-lg">▼</span>
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white shadow-lg rounded-[10px] border border-[#ccc]">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-[#f0f0ff] cursor-pointer text-[16px]"
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
