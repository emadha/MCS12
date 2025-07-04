import { Menu, Transition } from '@headlessui/react'
import { Fragment, useContext } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ListingContext } from '@/Context/ListingContext'
import { AppContext } from '@/AppContext'

export default function SortMenu () {
  const {
    setCriteria,
    criteria,
    searchDefaultFields, setSearchDefaultFields,
    isLoaded,
    setIsSidebarOpen,
    setSorting,
    updateResults,
    sorting,
  } = useContext(ListingContext)

  const {
    lang,
  } = useContext(AppContext)
  const sortByListItems = [

    { label: 'Date', content: 'Latest', value: 'latest' },
    { label: 'Date', content: 'Oldest', value: 'oldest' },
    { label: 'Price', content: 'Low to High', value: 'plh' },
    { label: 'Price', content: 'High to Low', value: 'phl' },
    { label: 'Year', content: 'New to Old', value: 'yno' },
    { label: 'Year', content: 'Old to New', value: 'yon' },
    { label: 'Condition', content: 'Best to Worst', value: 'cbw' },
    { label: 'Condition', content: 'Worst to Best', value: 'cwb' },
  ]
  return <Menu as="div" className="relative inline-block">
    <div>
      <Menu.Button
        className="flex-row-reverse flex  gap-x-2 w-full justify-center rounded-md bg-violet-900 px-4 py-2 font-medium text-white hover:bg-violet-900/50 focus:outline-none transition-all focus-visible:ring-2 focus-visible:ring-white/75">
        <strong>
          {lang(sortByListItems.filter(e =>
            e.value == sorting)[0]?.label ?? sortByListItems[0].label)} : {lang(sortByListItems.filter(e => e.value == sorting)[0]?.content ?? sortByListItems[0].content)}
        </strong>
        <span>{lang('Sort By')}</span>
      </Menu.Button>
    </div>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className="absolute rtl:left-0 rtl:right-auto right-0 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-grad-secondary text-neutral-100 shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="px-1 py-1 ">
          {sortByListItems.map(sortItem => <Menu.Item key={sortItem.value} onClick={() => {
            criteria.o = sortItem.value
            setSorting(sortItem.value)
            setCriteria({ ...criteria })
          }}>
            {({ active }) => (
              <button
                className={`${
                  active || criteria.o === sortItem.value ? 'bg-violet-500 text-white' : 'dark:text-neutral-500 text-neutral-600'
                } group flex w-full flex-row-reverse gap-x-2 items-center transition-all px-2 py-2 text-sm`}
              >
                <span className={'text-right dark:text-white text-neutral-400 font-bold underline underline-offset-2 mr-2 rounded py-0.5 px-2 text-xs'}>
                  {lang(sortItem.label)}
                </span>
                <span>{lang(sortItem.content)}</span>
              </button>
            )}
          </Menu.Item>)}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
}
