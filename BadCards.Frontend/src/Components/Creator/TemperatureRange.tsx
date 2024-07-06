import { useState } from "react";

export const TemperatureRange = ({
  valueChanged,
  value,
}: {
  valueChanged: (value: number) => void;
  value: number;
}) => {
  return (
    <>
      <div className="relative pt-2 text-black mb-6">
        <label className="text-sm font-medium">
          Additonal Prompt Temperature:
        </label>
        <input
          onChange={(e) => valueChanged(Number(e.target.value))}
          type="range"
          value={value}
          min="0"
          max="10"
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none 
    cursor-pointer"
        />
        <span className="text-sm absolute start-0 -bottom-6">0</span>
        <span className="text-sm absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
          0.5
        </span>
        <span className="text-sm absolute end-0 -bottom-6">1</span>
      </div>
    </>
  );
};
