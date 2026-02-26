import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const words = [
  { text: 'Expert Surgeons', color: 'text-yellow-400' },
  { text: 'Heart Specialists', color: 'text-yellow-400' },
  { text: 'Neurologists', color: 'text-yellow-400' },
  { text: 'Pediatricians', color: 'text-yellow-400' },
]

const Header = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [letterIndex, setLetterIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [displayed, setDisplayed] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const currentWord = words[wordIndex].text
    const isEnd = letterIndex === currentWord.length
    const isStart = letterIndex === 0

    const typingSpeed = deleting ? 50 : 100

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(currentWord.substring(0, letterIndex + 1))
        setLetterIndex(letterIndex + 1)
        if (letterIndex + 1 === currentWord.length) {
          setTimeout(() => setDeleting(true), 1200)
        }
      } else {
        setDisplayed(currentWord.substring(0, letterIndex - 1))
        setLetterIndex(letterIndex - 1)
        if (letterIndex - 1 === 0) {
          setDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [letterIndex, deleting, wordIndex])

  // Cursor blink
  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorBlink)
  }, [])

  return (
    <div className='flex flex-col md:flex-row bg-primary rounded-lg px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-4 overflow-hidden'>
      {/* Left side */}
      <div className='w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-3 md:gap-4 text-center md:text-left'>
        <p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-semibold leading-snug md:leading-tight px-2'>
          <span className='block sm:inline'>Schedule Your Appointments</span>{' '}
          <span className='block sm:inline'>With our</span>{' '}
          <span className={`${words[wordIndex].color} inline-block min-w-[140px] sm:min-w-[160px] md:min-w-[180px]`}>
            {displayed}
            <span className='inline-block w-[2px] ml-0.5'>
              {cursorVisible ? '|' : ' '}
            </span>
          </span>
        </p>
        
        <div className='flex flex-col items-center md:items-start gap-2 text-white text-xs sm:text-sm font-light max-w-[90%] md:max-w-full px-2'>
          <p>
            Experience seamless access to qualified and experienced doctors at Alfazal Hospital.
          </p>
          <p className='hidden sm:block'>
            Book your consultations effortlessly—quick, secure, and hassle-free healthcare at your convenience.
          </p>
          {/* Mobile-only shorter text */}
          <p className='block sm:hidden'>
            Quick, secure, and hassle-free healthcare at your convenience.
          </p>
        </div>
        
        <a 
          className='flex items-center gap-2 bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300 shadow-md mt-2 md:mt-4' 
          href="#speciality"
        >
          Get Started 
          <img className='w-2.5 sm:w-3' src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* Right side - Image */}
      <div className='w-full md:w-1/2 mt-6 md:mt-0 flex justify-center md:justify-end'>
        <img 
          className='w-3/4 sm:w-2/3 md:w-full max-w-md md:max-w-none h-auto object-contain rounded-lg' 
          src={assets.grp} 
          alt="Medical professionals" 
        />
      </div>
    </div>
  )
}

export default Header