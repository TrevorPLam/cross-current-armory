import React, { useId } from 'react'

interface NoiseTextureProps {
  opacity?: number
  className?: string
}

export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  opacity = 0.04,
  className = '',
}) => {
  const filterId = useId()

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    </div>
  )
}

export default NoiseTexture
