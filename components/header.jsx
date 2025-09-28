'use client'

import useStoreUser from '@/hooks/use-store-user'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react'
import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { BarLoader} from 'react-spinners'
import { Button } from './ui/button'

const Header = () => {
    const path = usePathname()
    const { isLoading } = useStoreUser()

    if (path.includes('/editor')) {
        return null
    }

    return (
        <header className='fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-no-wrap w-2/5'>
            <div className='bg-slate-900 border-1 backdrop-blur-md px-12 py-4 flex justify-between items-center'>
                <Link href='/' className=''>Logo</Link>
                {path === '/' && (
                    <div className='flex gap-8'>
                         <Link href='#features' className='hover:text-cyan-300 cursor-pointer'>Features</Link>
                          <Link href='#contact' className='hover:text-cyan-300 cursor-pointer'>Contact</Link>
                    </div>
                )}
                <div className='flex gap-3'>
                    <Unauthenticated>
                        <SignInButton />
                        <SignUpButton>
                            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                            </button>
                        </SignUpButton>
                    </Unauthenticated>
                    <Authenticated>
                        <Link href='/dashboard'>
                            <Button><LayoutDashboard/>Dashboard</Button>
                        </Link>
                        <UserButton />
                    </Authenticated>
                </div>
                {isLoading && <BarLoader />}
            </div>
        </header>
    )
}

export default Header