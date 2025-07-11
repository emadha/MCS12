'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppContext } from '@/AppContext'

export default function FlipWords ({ beforeText, words, duration = 3000, className }) {
    const { rtl } = useContext(AppContext)
    const [currentWord, setCurrentWord] = useState(words[0])
    const [isAnimating, setIsAnimating] = useState(false)

    const startAnimation = useCallback(() => {
        const word = words[words.indexOf(currentWord) + 1] || words[0]
        setCurrentWord(word)
        setIsAnimating(true)
    }, [currentWord, words])

    useEffect(() => {
        if (!isAnimating) {
            setTimeout(() => {
                startAnimation()
            }, duration)
        }
    }, [isAnimating, duration, startAnimation])

    return <div className={'relative min-h-56'}>
        {beforeText && <span className={'font-black text-6xl rtl:hidden dark:text-yellow-500'}>{beforeText}</span>}
        <AnimatePresence
            onExitComplete={() => {
                setIsAnimating(false)
            }}
        >
            <motion.div
                className={className}
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 10,
                }}
                exit={{
                    opacity: 0,
                    y: -40,
                    x: 40,
                    filter: 'blur(8px)',
                    scale: 2,
                    position: 'absolute',
                }}
                key={currentWord}
            >
                {!rtl ? currentWord.split(' ').map((word, wordIndex) => (
                    <motion.span
                        key={word + wordIndex}
                        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            delay: wordIndex * 0.3,
                            duration: 0.3,
                        }}
                        className="inline-block whitespace-nowrap"
                    >
                        {word.split('').map((letter, letterIndex) => (
                            <motion.span
                                key={word + letterIndex}
                                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{
                                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                                    duration: 0.2,
                                }}
                                className="inline-block"
                            >
                                {letter}
                            </motion.span>
                        ))}
                        <span className="inline-block">&nbsp;</span>
                    </motion.span>
                )) : <motion.span
                    key={currentWord}
                    initial={{ opacity: 0, y: -10, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                        delay: (Math.random() / 3) * 0.06,
                    }}
                    className="inline-block"
                >
                    <span dangerouslySetInnerHTML={{ __html: currentWord.replace(' ', '&nbsp;') }}/>
                </motion.span>
                }
            </motion.div>
        </AnimatePresence></div>
};
