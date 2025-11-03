import React from 'react'

const Container = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='w-2/3 p-10'>
        {children}
    </div>
  )
}

export default Container