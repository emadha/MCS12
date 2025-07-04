import { createContext } from 'react'

export let ListingContext = createContext({
  removeListingItem: () => {
    console.log('No Context Found.')
  },
  updateListingItem: () => {
    console.log('No Context Found.')
  },

  setItems: () => {},
  items: [],
  isLoaded: null,
  setIsLoaded: () => {},
  setCriteria: () => {},
  criteria: {},
  searchDefaultFields: () => {},
  setSearchDefaultFields: () => {},
  setIsSidebarOpen: () => {},
  isSidebarOpen: null,
  automaticSize: null,
  setAutomaticSize: () => {},
})
