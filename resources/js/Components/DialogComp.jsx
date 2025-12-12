import React from 'react'
import Loading from './LoadingDiv'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const DialogComp = ({
    open = false,
    onClose = () => { },
    title = null,
    loadingContent = false,
    loadingAction = false,
    children,
    maxWidth = '2xl',
}) => {

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={open}>
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 " aria-hidden="true" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-150"
                    enterFrom="opacity-0 scale-95 translate-y-2"
                    enterTo="opacity-100 scale-100 translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100 translate-y-0"
                    leaveTo="opacity-0 scale-95 translate-y-2"
                >
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className={`w-full rounded-xl bg-white p-6 shadow-2xl relative ${maxWidthClass}`}>
                            {loadingContent && <Loading />}
                            {title &&
                                <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                                    {title}
                                </DialogTitle>
                            }
                            {children}
                        </DialogPanel>
                    </div>
                </TransitionChild>
            </Dialog>
        </Transition>
    )
}

export default DialogComp