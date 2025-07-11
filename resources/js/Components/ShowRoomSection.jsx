import React, {useContext} from 'react';
import {faPlugCirclePlus} from '@fortawesome/free-solid-svg-icons';
import ShopBlock from '@/Components/Shops/ShopBlock.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import {AppContext} from '@/AppContext.js';
import Loading from '@/Components/Loading.jsx';

function ShowRoomSection({showrooms, promotedShowrooms, loadingShowrooms}) {
    const {lang, auth} = useContext(AppContext);
    return (
        <div className={'container pt-20 px-10'}>
            {loadingShowrooms ?
                <Loading loadingText={'Loading Showrooms'} className={'py-44'} background={''}/>
                : <>
                    <div
                        className={'flex items-center justify-between'}>
                        <h2 className={'select-none'}>{lang('Showrooms')}</h2>
                        {auth?.user && <SecondaryButton icon={faPlugCirclePlus}>
                            Create Your Own Showroom
                        </SecondaryButton>}
                    </div>

                    {promotedShowrooms.map(promotedShowroom => <ShopBlock shop={promotedShowroom}/>)}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {showrooms.map(showroom => <ShopBlock shop={showroom} variant={'wide'}/>)}
                    </div>

                </>
            }
        </div>
    );
}

export default ShowRoomSection;
