import React, {useContext} from 'react';
import {AppContext} from "@/AppContext.js";
import PrimaryButton from "@/Components/Form/Buttons/PrimaryButton.jsx";
import {faList, faUpload} from "@fortawesome/free-solid-svg-icons";
import {AnimatePresence, motion} from "framer-motion";
import {Link} from "@inertiajs/react";
import Hr from "@/Components/Hr.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function HeroSection({latestItems}) {
    const {lang} = useContext(AppContext)

    return <AnimatePresence>
        <motion.div
            initial={{opacity: 0, y: -80}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: .4, ease: "circInOut"}}
            className={'bg-foreground/5'}>
            <div className={"container px-5 min-h-[85vh] py-52 flex flex-wrap items-stretch"}>
                <div className={'w-1/2 sticky top-32 h-full'}>
                    <div>
                        <div className={'font-light'}>
                            Mecarshop is a new way to buy and sell your dream car.
                        </div>
                    </div>
                    <h1>
                        Discover Your
                        <motion.p
                            initial={{opacity: 0, scale: .8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{
                                duration: 0.2,
                                bounce: 0.8,
                                type: "tween",
                                damping: 20,
                                stiffness: 100
                            }}
                            className={'text-7xl'}>
                            Dream Car
                        </motion.p>
                        Experience
                    </h1>
                    <p className={'text-xl font-light'}>
                        Experience automotive commerce reimagined. Where sophisticated design meets intuitive
                        functionality
                        to create the most refined car marketplace.
                    </p>

                    <Hr className={'mt-10'}/>

                    <PrimaryButton
                        onClick={() => document.getElementById('listingBlock')?.scrollIntoView({behavior: 'smooth'})}
                        size={'xl'} icon={faList} className={'mx-auto mt-10 mb-20'}>
                        {lang('Browse Cars')}
                    </PrimaryButton>
                    <Link
                        href={route('shops.index')}
                        size={'xl'} icon={faList} className={'mx-auto mt-10 mb-20'}>
                        {lang('Browse Shops')}
                    </Link>


                    <div className={'my-10 flex justify-center gap-10 items-center select-none'}>

                        <Link className={'text-2xl py-2'}
                              href={route('listing.car.submit')}>
                            <FontAwesomeIcon icon={faUpload} className={'mr-2'}/>
                            {lang('List Your Car')}
                        </Link>
                        |
                        <Link className={'text-2xl py-2'}
                              href={route('shop.create')}>
                            <FontAwesomeIcon icon={faUpload} className={'mr-2'}/>
                            {lang('Create a Shop')}
                        </Link>
                    </div>
                    <div>
                        <div className={'flex'}>

                        </div>
                    </div>
                </div>

                <div className={'w-1/2 rounded px-10'}>
                    <div className={'rounded-2xl h-full bg-white shadow-2xl shadow-black/20 relative overflow-hidden'}>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
}

export default HeroSection;
