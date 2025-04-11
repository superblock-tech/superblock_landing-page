import React, { useState, useEffect } from "react";

export default function Phace1() {
    return (
        <div className="text-center w-full md:w-1/3">
            <h1
                className="
                  bg-multi-color-gradient
                  bg-size-800           /* ensures the gradient is 200% wide */
                  animate-colorCycle     /* smoothly slides the gradient */
                  text-transparent
                  bg-clip-text
                  w-fit
                  text-[30.219px]
                  sm:text-[40.974px]
                  font-futura-bold
                  font-bold
                  sm:leading-[79.974px]
                  leading-[42.219px]
                "
            >
                Phase 1:
                <br/>
                Founders Circle Presale.
                <br/>
                Invite only.
            </h1>
        </div>
    );
}
