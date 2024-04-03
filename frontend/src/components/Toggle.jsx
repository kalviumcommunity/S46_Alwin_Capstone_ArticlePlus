import React, { useState } from "react"

const Toggle = ({ state, setState }) => {
    const handleCheckboxChange = () => {
        setState(!state)
    }

    return (
        <>
            <label className="relative inline-flex cursor-pointer select-none items-center">
                <input
                    type="checkbox"
                    checked={state}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                />
                <span
                    className={`flex h-7 w-12 items-center rounded-full p-1 duration-200 ${
                        state ? "bg-[#212b36]" : "bg-[#CCCCCE]"
                    }`}>
                    <span
                        className={`h-5 w-5 rounded-full bg-white duration-200 ${
                            state ? "translate-x-5" : ""
                        }`}></span>
                </span>
            </label>
        </>
    )
}

export default Toggle
