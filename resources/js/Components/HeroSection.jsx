import React, {useContext} from 'react';
import FlipWords from "@/Components/UI/flipwords.jsx";
import SimpleListingItemBlock from "@/Components/Listing/Blocks/SimpleListingItemBlock.jsx";
import {Link} from "@inertiajs/react";
import SecondaryButton from "@/Components/Form/Buttons/SecondaryButton.jsx";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "@/AppContext.js";

function HeroSection({latestItems}) {
    const {lang} = useContext(AppContext)

    return (
        <div>
            <div className={'bg-slate-500/10 px-5'}>
                <div className={'container flex flex-wrap mx-auto justify-end items-center min-h-[70vh]'}>

                    <h1 className={'z-10 select-none text-center px-3 md:text-8xl rtl:text-7xl md:rtl:text-8xl lg:rtl:text-9xl text-5xl w-full mix-blend-overlay mt-36 max-w-screen drop-shadow-xl overflow-hidden'}>
                        <FlipWords beforeText={lang('Mecarshop')}
                                   className={'text-white absolute flex justify-center w-full'} words={[
                            lang('Marketplace'),
                            lang('Showrooms'),
                            lang('Rental'),
                            lang('Tuning'),
                            lang('Accessories'),
                            lang('Detailing'),
                            lang('Parts'),
                            lang('Paint'),
                            lang('Service'),
                            lang('Information'),
                        ]}/>
                        <small
                            className={'-mt-24 md:-mt-3 text-sm rtl:text-center mb-5 md:rtl:-mt-24 lg:rtl:-mt-1 rtl:-mt-32 px-1 w-full block font-thin'}>
                            {lang('SLOGAN_SUB_SUB')}
                        </small>
                    </h1>
                    <div className={'z-10 flex flex-wrap items-center mx-auto mt-5 justify-center w-full'}>
                        {latestItems?.map(latest_item =>
                            <div className={'w-1/2 md:w-1/5 p-2'}
                                 key={'_latest' + latest_item.title}>
                                <SimpleListingItemBlock item={latest_item}/>
                            </div>,
                        )}
                    </div>
                    <div className={'w-full flex justify-center my-16 py-10 z-10'}>
                        <Link className={'w-full md:w-1/3 max-w-screen'}
                              href={route('listing.car.submit')}>
                            <SecondaryButton
                                className={'animate-pop-in py-5 !text-xl transition-all rounded-md hover:rounded-xl shadow-lg hover:shadow-xl !px-10 w-full !bg-yellow-600 hover:!bg-orange-500 text-white dark:hover:text-slate-600 !text-center'}
                                icon={faUpload}>
                                {lang('List your Car')}
                            </SecondaryButton>
                        </Link></div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
