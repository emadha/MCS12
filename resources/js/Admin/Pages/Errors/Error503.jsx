import React, { useContext, useEffect, useRef, useState } from 'react'
import Wrapper from '@/Layouts/Wrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCubes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Gradient } from '@/Components/AnimatedGradient'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { AppContext } from '@/AppContext'
import { Head, usePage } from '@inertiajs/react'

export default function Error503 ({ title, refresh = 3 }) {
    const canvasRef = useRef()
    const [refreshAfter, setRefreshAfter] = useState(refresh)
    const [refreshInterval, setRefreshInterval] = useState(setInterval(() => {}, 0))

    const { setPageLang, lang } = useContext(AppContext)
    const pageLang = usePage().props.lang ?? {}
    useEffect(() => {
        setPageLang(pageLang)
        if (canvasRef?.current) {
            (new Gradient).initGradient('canvas')
        }
        setRefreshInterval(() => setInterval(() => {
            setRefreshAfter(prevState => prevState - 1)
        }, 1000))

    }, [])

    useEffect(() => {
        if (refreshAfter > 0) {

        } else if (refreshAfter <= 0) {
            clearInterval(refreshInterval)
            // window.location.reload()
        }
    }, [refreshAfter])
    return <div className={''}>
        <Head title={lang(title)}/>
        <canvas ref={canvasRef} id={'gradient-canvas'} className={'fixed z-0'}/>
        <div className={'bg-black/80 backdrop-blur-2xl fixed text-white h-screen w-screen flex items-center justify-center gap-x-5 '}>
            <div className={'flex flex-wrap items-center justify-center'}>
                <h2 className={' font-bold flex w-full items-center justify-center gap-x-2'}>
                    <FontAwesomeIcon icon={faCubes} className={'opacity-50'}/>
                    {lang(title)}
                </h2>
                <small className={'opacity-50'}>{refreshAfter > 0 ? <>Refresh after {refreshAfter} seconds</> : <PrimaryButton
                    onClick={() => window.location.reload()}>{lang('Retry')}</PrimaryButton>}</small>
            </div>
        </div>
    </div>
}
Error503.layout = (page => {
    return page
})
