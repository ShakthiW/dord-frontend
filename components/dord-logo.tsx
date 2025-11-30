import React from "react";
import Image from "next/image";

const DordLogo = ({
  width = 120,
  height = 40,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Image
        src="/dord-logo.png"
        alt="Dord"
        width={width}
        height={height}
        priority
      />
    </div>
  );
};

export default DordLogo;
