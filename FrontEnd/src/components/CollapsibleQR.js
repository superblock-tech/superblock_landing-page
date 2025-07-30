import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'

const CollapsibleQR = ({
  value,
  address,
  logo = '/assets/images/logo.svg',
  size = 200,
  bgColor = '#ffffff', // white
  dotsColor = '#000000', // black
  cornersSquareColor = "#a855f7", // purple-500
  cornersDotColor = "#3b82f6", // blue-500
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isBinance, setIsBinance] = useState(false)

  const qrRef = useRef(null)
  const qrInstance = useRef(null)

  // generate variant for Binance
  const binanceValue = address
  // console.log("value", value)
  // console.log("binanceValue", binanceValue)

  const qrValue = isBinance ? binanceValue : value

  // initialize/append ONLY when block is expanded and ref exists
  useEffect(() => {
    // console.log('[expand] isExpanded =', isExpanded)

    if (!isExpanded) return // closed — do nothing
    if (!qrRef.current) {
      // console.warn('[expand] qrRef.current = null')
      return
    }

    if (!qrInstance.current) {
      // console.log('[expand] create instance')
      qrInstance.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: qrValue,
        dotsOptions: {
          color: dotsColor,
          type: 'rounded',
        },

        backgroundOptions: {
          color: bgColor,
        },

        cornersSquareOptions: {
          color: cornersSquareColor, 
          type: 'dot', 
        },
        cornersDotOptions: {
          color: cornersDotColor, 
          type: 'dot', 
        },

        image: logo,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 5,
          imageSize: 0.4, // the logo occupies 40% of the QR code size
        },
      })
    }

    // Insert into DOM (and clear container each time)
    // console.log('[expand] append into DOM')
    qrRef.current.innerHTML = ''
    qrInstance.current.append(qrRef.current)
  }, [isExpanded, qrValue]) //size, asset, bgColor, dotsColor, cornersSquareColor, cornersDotColor, logo

  // Update only data when mode/amount/address changes
  useEffect(() => {
    // console.log('[update] qrValue =', qrValue)
    if (qrInstance.current) {
      qrInstance.current.update({ data: qrValue })
    }
  }, [qrValue])

  return (
    <div className="flex flex-col items-center text-gray-800">
      <span
        role="button"
        tabIndex={0}
        className={`text-sm cursor-pointer items-center hover:text-black ${
          !isExpanded ? '' : 'mb-2'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
        aria-expanded={isExpanded}
        aria-controls="qr-box"
        aria-label="Toggle QR code"
      >
        {isExpanded ? 'Hide QR Code' : 'Show QR Code'}
      </span>

      {isExpanded && (
        <div
          id="qr-box"
          className="p-4 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center transition-all duration-300"
        >
          <div
            ref={qrRef}
            key={isBinance ? 'binance' : 'wallets'}
            className={`mb-4 w-[${size}px] h-[${size}px]`}
          />

          <div className="flex justify-between gap-2 w-full">
            <button
              onClick={() => setIsBinance(false)}
              aria-pressed={!isBinance}
              className={`w-full py-2 px-3 rounded-xl text-sm ${
                !isBinance
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-default'
                  : 'text-gray-500 bg-gray-300 hover:bg-gray-400 hover:text-black cursor-pointer'
              }`}
            >
              Wallets
            </button>
            <button
              onClick={() => setIsBinance(true)}
              aria-pressed={isBinance}
              className={`w-full py-2 px-3 rounded-xl text-sm ${
                isBinance
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-default'
                  : 'text-gray-500 bg-gray-300 hover:bg-gray-400 hover:text-black cursor-pointer'
              }`}
            >
              Binance
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollapsibleQR
