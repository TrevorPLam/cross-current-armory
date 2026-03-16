import React, { useState, useEffect, useRef } from 'react'

interface AnimatedTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  /** When true the full text is rendered immediately (e.g. for reduced-motion) */
  instant?: boolean
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  speed = 40,
  className = '',
  onComplete,
  instant = false,
}) => {
  const [displayText, setDisplayText] = useState(instant ? text : '')
  const indexRef = useRef(instant ? text.length : 0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (instant) {
      setDisplayText(text)
      indexRef.current = text.length
      onCompleteRef.current?.()
      return
    }

    setDisplayText('')
    indexRef.current = 0

    let id: ReturnType<typeof setTimeout>

    const tick = () => {
      if (indexRef.current < text.length) {
        indexRef.current += 1
        setDisplayText(text.slice(0, indexRef.current))
        id = window.setTimeout(tick, speed)
      } else {
        onCompleteRef.current?.()
      }
    }

    id = window.setTimeout(tick, speed)
    return () => window.clearTimeout(id)
  }, [text, speed, instant])

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">
        {displayText}
        {displayText.length < text.length && (
          <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle animate-pulse" />
        )}
      </span>
    </span>
  )
}

export default AnimatedText
