import React, { useState } from 'react'
// @ts-ignore
import { UilSearch } from '@iconscout/react-unicons'
import { UilLocationPoint } from '@iconscout/react-unicons'
function Inputs(setQuery,units,setUnits) {

    const[city,setCity]=useState("");

    const handleSearch=()=>{
        if(city !=="")
            setQuery({q:city});
    }
  return (
    <div className='flex justify-center my-6'>
      <div  className='flex w-3/4 items-center justify-center space-x-4'>
        <input
        value={city}
        onChange={(e)=>setCity(e.currentTarget.value)}
        placeholder='Search for city...' type='text' className='text-xl font-light p-2 w-full shadow-xl outline-none capitalize placeholder:lowercase'></input>
        <UilSearch size={25}
        onClick={handleSearch}
        className="text-white cursor-pointer transition ease-out hover:scale-125 "/>
        <UilLocationPoint  size={25} className="text-white cursor-pointer transition ease-out hover:scale-125"/>
      </div>
      <div className='flex flex-row w-1/4 items-center justify-center'>
      <button name='metric' className='text-white font-light'>
      °C

      </button> 
      <p className='text-xl text-white mx-1'>|</p>
      <button name='imperial ' className='text-white font-light'>°F</button>
 
      </div>
            </div>
  )
}

export default Inputs
