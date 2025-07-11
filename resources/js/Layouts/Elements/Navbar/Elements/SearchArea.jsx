import TextInput from '@/Components/Form/TextInput';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

export default function SearchArea({className, children, searchFocused, setSearchFocused, placeholder = 'Search...'}) {
    return <>
        <div className={' flex items-center justify-center duration-300 '
            + (searchFocused ? ' w-full lg:w-3/6 px-3 lg:px-0' : 'w-1/6 sm:w-3/6 opacity-50')}>
            <TextInput className={'w-full'} inputClassName={'rounded-3xl'} name={'nav_search'} icon={faSearch} placeholder={placeholder}
                       onFocus={e => setSearchFocused(1)}
                       onBlur={e => setSearchFocused(0)}
            />
        </div>
    </>;
}
