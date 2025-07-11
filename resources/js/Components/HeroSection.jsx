import React, {useContext} from 'react';
import {AppContext} from '@/AppContext.js';
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton.jsx';
import {faList, faUpload} from '@fortawesome/free-solid-svg-icons';
import {AnimatePresence, motion} from 'framer-motion';
import {Link} from '@inertiajs/react';
import Hr from '@/Components/Hr.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FlipWords from '@/Components/UI/flipwords.jsx';

function HeroSection({latestItems}) {
    const {lang} = useContext(AppContext);

    return <AnimatePresence>
        <div className={'bg-foreground/5'}>
            <div
                className={'container px-5 min-h-[85vh] py-52 flex flex-wrap items-stretch'}>
                <div className={'w-1/2 sticky top-32 h-full'}>
                    <div>
                        <div
                            className={'px-2 inline-block txt-xs'}>
                            Mecarshop is a new way to <strong>love your car</strong>.
                        </div>
                    </div>
                    <h1 className={'leading-10 my-5'}>
                        Discover Your
                        <div
                            className={'drop-shadow-lg text-7xl refined-gradient h-20 mt-1'}>
                            <FlipWords words={['Dream Car', 'Perfect Store', 'Best Shop']}/>
                        </div>
                        Experience
                    </h1>
                    <p className={'text-xl font-light'}>
                        Experience automotive commerce reimagined. Where
                        sophisticated design meets intuitive
                        functionality
                        to create the most refined car marketplace.
                    </p>

                    <Hr className={'mt-10'}/>

                    <PrimaryButton
                        onClick={() => document.getElementById('listingBlock')?.
                            scrollIntoView({behavior: 'smooth'})}
                        size={'xl'} icon={faList}
                        className={'mx-auto mt-10 mb-20'}>
                        {lang('Browse Cars')}
                    </PrimaryButton>
                    <Link
                        href={route('shops.index')}
                        size={'xl'} icon={faList}
                        className={'mx-auto mt-10 mb-20'}>
                        {lang('Browse Shops')}
                    </Link>


                    <div
                        className={'my-10 flex justify-center gap-10 items-center select-none'}>

                        <Link className={'text-2xl py-2'}
                              href={route('listing.car.submit')}>
                            <FontAwesomeIcon icon={faUpload}
                                             className={'mr-2'}/>
                            {lang('List Your Car')}
                        </Link>
                        |
                        <Link className={'text-2xl py-2'}
                              href={route('shop.create')}>
                            <FontAwesomeIcon icon={faUpload}
                                             className={'mr-2'}/>
                            {lang('Create a Shop')}
                        </Link>
                    </div>
                    <div>
                        <div className={'flex'}>

                        </div>
                    </div>
                </div>

                <div className={'w-1/2 rounded px-10'}>
                    <div
                        className={'rounded-2xl h-full bg-white shadow-2xl shadow-black/20 relative overflow-hidden'}>
                    </div>
                </div>
            </div>
        </div>
    </AnimatePresence>;
}

export default HeroSection;
