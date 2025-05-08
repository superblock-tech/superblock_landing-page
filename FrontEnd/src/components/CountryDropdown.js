import {useState} from "react";
import {countries} from "../utils/countries";

export default function CountryDropdown({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-[9px]">
      <span className="font-normal text-[15px] sm:text-[18px] leading-[29px] sm:leading-[34px]">
        What country do you live in? <span className="text-[#f00]">*</span>
      </span>

            <div className="relative">
                <div className="bg-gradient-to-b from-[#F2F2F2] to-[#c0c0e6] p-[1px] rounded-[10px] sm:h-[57px] h-[48px]">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between px-[13px] w-full h-full bg-[#ebeaff] rounded-[10px] cursor-pointer"
                    >
            <span className="font-normal text-[18px] leading-[34px] text-[#000] truncate">
              {value ? `${value.flag} ${value.name}` : "Select a country"}
            </span>
                        <span className="text-lg">▼</span>
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white shadow-lg rounded-[10px] border border-[#ccc]">
                        {countries.map((country) => (
                            <div
                                key={country.code}
                                onClick={() => {
                                    onChange(country); // передаём выбранную страну в родителя
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-[#f0f0ff] cursor-pointer flex items-center gap-2 text-[16px]"
                            >
                                <span>{country.flag}</span>
                                <span>{country.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
