import React, { useState, useEffect } from "react";

export default function Phace1() {
    const calculateTimeLeft = () => {
        const difference = +new Date("2025-05-05T12:00:00") - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center w-full md:w-1/2">
            <h1
                className="
                  bg-multi-color-gradient
                  bg-size-800           /* ensures the gradient is 200% wide */
                  animate-colorCycle     /* smoothly slides the gradient */
                  text-transparent
                  bg-clip-text
                  w-fit
                  text-[42.219px]
                  sm:text-[73.974px]
                  font-futura-bold
                  font-bold
                  sm:leading-[79.974px]
                  leading-[42.219px]
                "
            >
                Phase <span
                className="bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">01</span>
            </h1>
            <p className="text-lg text-gray-800 font-bold mt-2 text-left">
                Next phase begins in:
            </p>
            <div
                className="flex text-white rounded-lg my-8">
                <div
                    className="flex justify-center bg-gradient-to-r from-purple-500  to-blue-400 text-white rounded-lg p-4 py-6  mt-4">
                    {Object.entries(timeLeft).map(([unit, value], index) => (
                        <div key={unit} className="text-center px-8">
            <span className="text-5xl font-bold text-white">
              {String(value).padStart(2, "0")}
            </span>
                            <p className="text-sm uppercase text-white">{unit}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
