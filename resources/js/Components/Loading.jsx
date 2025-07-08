import React from 'react';
import {LoaderIcon} from "react-hot-toast";

function Loading(props) {
    return <div className={'text-xs select-none py-10 rounded bg-white/5'}>
        <div className={'animate-pulse flex items-center gap-x-2 justify-center'}>
            <LoaderIcon/>
            <span>Loading map...</span>
        </div>
    </div>
}

export default Loading;
