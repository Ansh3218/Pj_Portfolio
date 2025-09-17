import React from "react";

const MobileSizeText = ({ text = "HELLO WORLD", className = "" }) => {
  // split lines by \n
  const lines = text.split("\n");

  return (
    <div className={`w-screen h-auto ${className}`}>
      <div className="heading-1 w-full h-full flex flex-col text-[#ABAB99]">
        {lines.map((line, i) => (
          <span
            key={i}
            className={`text-[18rem] font-[arial] font-black leading-none
              ${i === 0 ? "text-left" : ""} 
              ${i === 1 ? "text-right" : ""} 
              ${i > 1 ? "text-center" : ""} 
              ${className}`}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MobileSizeText;
