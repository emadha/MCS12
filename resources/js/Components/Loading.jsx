import React from 'react';
import {LoaderIcon} from 'react-hot-toast';
import {clsx} from 'clsx';

function Loading({loadingText = 'Loading... ', className, background = 'bg-white/5'}) {
    return <div className={clsx('text-xs select-none py-10 rounded', className, background)}>
        <div className={'animate-pulse flex items-center gap-x-2 justify-center'}>
            <LoaderIcon/>
            <span>{loadingText}</span>
        </div>
    </div>;
}

export default Loading;
