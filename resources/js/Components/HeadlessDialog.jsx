import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react'
import {useState} from 'react'
import PrimaryButton from "@/Components/Form/Buttons/PrimaryButton.jsx";
import {AnimatePresence} from "framer-motion";

export default function HeadlessDialog({
                                           open, onClose = () => {
    }, title, children
                                       }) {
    let [isOpen, setIsOpen] = useState(open)

    function actionOpen() {
        setIsOpen(true)
    }

    function actionClose() {
        setIsOpen(false)
    }

    return (
        <>
            <AnimatePresence>
                <Dialog open={open} as="div" className="relative z-10 focus:outline-none"
                        onClose={() => onClose() || actionClose()}>
                    <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm"/>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <DialogPanel
                                transition
                                className="w-full max-w-md shadow-xl rounded-xl bg-grad-primary outline outline-1 outline-offset-8 outline-ring p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                            >
                                {title && <DialogTitle as="h1" className="text-base/7 font-medium text-black">
                                    {title}
                                </DialogTitle>}

                                <div className="mt-2 text-sm/6 text-white/50">
                                    {children}
                                </div>

                                <div className="mt-4">
                                    <PrimaryButton
                                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                        onClick={() => actionClose() || onClose()}
                                    >
                                        Got it, thanks!
                                    </PrimaryButton>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </AnimatePresence>
        </>
    )
}
