import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const SearchBar = () => {
  return (
    <div className='w-full flex items-center justify-between border rounded-md px-3 gap-2'>
        <Input type="text" placeholder="Search here" className="w-10 md:w-32 lg:w-48 border-0 shadow-none focus-visible:ring-[0px] ps-0" />
        <span><Search size={20} color='gray' /></span>
    </div>
  )
}

export default SearchBar