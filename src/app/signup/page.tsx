import React from 'react'
import { SignUp } from '@clerk/nextjs'

const page = () => {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-white relative z-[100]">
            <SignUp />
        </div>
    )
}

export default page