import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlugCirclePlus, faSpinner} from "@fortawesome/free-solid-svg-icons";
import ShopBlock from "@/Components/Shops/ShopBlock.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import {AppContext} from "@/AppContext.js";

function ShowRoomSection({showrooms, promotedShowrooms, loadingShowrooms}) {
    const {lang, auth} = useContext(AppContext);
    return (
        <div>
            <div className={'my-5'}>
                <div className={'relative z-[20] container mx-auto px-5 my-20 drop-shadow-xl'}>
                    {loadingShowrooms ?
                        <div className={'flex items-center min-h-52 justify-center select-none'}>
                            <FontAwesomeIcon size={'2xl'} icon={faSpinner} className={'mx-5'} spin={true}/> Getting
                            Showrooms...
                        </div>
                        : <>
                            <div className={'flex items-center justify-between'}>
                                <h2 className={'select-none -mt-2'}>{lang('Showrooms')}</h2>
                                {auth?.user && <SecondaryButton icon={faPlugCirclePlus}>Create Your Own
                                    Showroom</SecondaryButton>}
                            </div>

                            {
                                promotedShowrooms.map(promotedShowroom => <ShopBlock shop={promotedShowroom}/>)
                            }

                            {
                                showrooms.map(showroom => <div
                                    className={'w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 aspect-square'}>
                                    <ShopBlock shop={showroom}/>
                                </div>)
                            }

                        </>}
                </div>
            </div>
        </div>
    );
}

export default ShowRoomSection;
