import React, {useContext} from 'react'
import {AppContext} from '@/AppContext'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import {CarFormContext} from '@/Context/CarFormContext'
import MainButton from '@/Components/Form/Buttons/MainButton'
import {faChevronLeft, faChevronRight, faUpload,} from '@fortawesome/free-solid-svg-icons'
import Hr from '@/Components/Hr'

export default function StepContent ({
    className,
    showHeading = true,
    children,
    step,
    prevLabel = 'Previous',
    nextLabel = 'Next',
    onSubmit = () => {},
    isFinal = false,
    withButtons = React.Component,
}) {

    const { nextStep, previousStep, currentStep, maxSteps, processing, stepsObject, setStepError, isLoaded } =
        useContext(CarFormContext)

    const { lang, rtl } = useContext(AppContext)

    return <div className={'transition-all max-w-3xl mx-auto ' + (className ? ' ' + className : '')}>
        {currentStep === step ? <div>
            <div className={'p-5 relative mx-auto'}>
                {stepsObject[currentStep]?.description && showHeading &&
                    <div
                        className={'max-w-lg mb-10 mt-5 mx-auto'}>{lang(stepsObject[currentStep]?.description)}<Hr/>
                    </div>}
                {children}
            </div>
            {!isFinal ? <div className={'flex flex-wrap-reverse gap-y-5 items-center justify-center gap-x-10'}>
                    {(currentStep > 0 && currentStep <= maxSteps) &&
                        <MainButton onClick={previousStep}
                                    className={'hover:text-xl hover:text-black transition-all'}
                                    icon={rtl ? faChevronRight : faChevronLeft}
                                    disabled={!isLoaded}
                                    iconClassName={'text-xs'} size={'lg'}>{lang(
                            prevLabel)}</MainButton>}

                    {withButtons}

                    {(currentStep >= 0 && currentStep !== maxSteps) &&
                        <PrimaryButton onClick={nextStep}
                                       className={''}
                                       icon={rtl ? faChevronLeft : faChevronRight}
                                       iconPosition={'end'}
                                       disabled={!isLoaded}
                                       iconClassName={'text-xs '} size={'lg'}>{lang(
                            nextLabel)}</PrimaryButton>
                    }
                    {/** Final Step **/ currentStep == maxSteps &&
                        <MainButton type={'submit'}
                                    size={'lg'}
                                    processing={processing || !isLoaded}
                                    iconPosition={'end'}
                                    onClick={onSubmit}
                                    className={'!font-black bg-green-900 text-white dark:bg-green-700 rounded hover:scale-125'}
                                    icon={faUpload}>
                            {lang('Post')}
                        </MainButton>}
                </div>
                : <></>}
        </div> : <></>
        }
    </div>
}

