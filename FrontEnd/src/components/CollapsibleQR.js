import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const CollapsibleQR = ({ value }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-black"   onClick={() => setIsExpanded(!isExpanded)}>
      <span
        className="text-sm mb-2"
      >
        {isExpanded ? 'Hide QR Code' : 'Show QR Code'}
      </span>
      <div
        className={`
          transform transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-full scale-100' : 'w-8 scale-90'}
        `}
      >
        <QRCode
          value={value}
          className={`
            w-full h-full transition-all duration-300
            ${isExpanded ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
          `}
        />
      </div>
    </div>
  );
};

export default CollapsibleQR;
