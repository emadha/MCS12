'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppContext } from '@/AppContext'

export default function FlipWords ({ beforeText, words, duration = 5000, className }) {
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
        <span className={'font-black text-6xl rtl:hidden dark:text-yellow-500'}>{beforeText}</span>
        <AnimatePresence
            onExitComplete={() => {
                setIsAnimating(false)
            }}
        >
            <motion.div
                className={className}
                initial={{
                    opacity: 0,
                    y: -100,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 130,
                    damping: 10,
                }}
                exit={{
                    opacity: 0,
                    y: 100,
                    x: 0,
                    filter: 'blur(10px)',
                    scale: 2,
                    position: 'absolute',
                    top: 0,
                }}
                key={currentWord}
            >
                {!rtl ? currentWord.split('').map((letter, index) => (
                    <motion.span
                        key={currentWord + index}
                        initial={{ opacity: 0, y: -10, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            delay: (index * Math.random() / 3) * 0.06,
                        }}
                        className="inline-block"
                    >
                        <span dangerouslySetInnerHTML={{ __html: letter.replace(' ', '&nbsp;') }}/>
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
