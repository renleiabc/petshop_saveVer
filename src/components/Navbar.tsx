/**
 * Navbar Component
 * Top navigation bar for the PetShop application
 * Features responsive design with logo and authentication buttons
 */

import { useState } from 'react'
import { Logo } from '../assets/images/images'
import Button from './Button'
import AuthModal, { AuthMode } from './AuthModal'

const Navbar = () => {
    const [authOpen, setAuthOpen] = useState(false)
    const [authMode, setAuthMode] = useState<AuthMode>('login')

    const openAuth = (mode: AuthMode) => {
        setAuthMode(mode)
        setAuthOpen(true)
    }

    return (
        <nav className='w-screen p-8 bg-whiteColor flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:px-24 lg:py-8'>
            <div className='shrink-0 w-40 cursor-pointer'>
                <img
                    className='w-full h-full'
                    src={Logo}
                    alt="Logo"
                />
            </div>
            
            <div className='flex flex-wrap items-center gap-4 lg:justify-end'>
                <Button
                    title='Sign up'
                    titleClassName='hover:text-yellowColor'
                    onClick={() => openAuth('signup')}
                />
                
                <Button
                    title='Log in'
                    mainClassName='bg-blueColor hover:bg-yellowColor'
                    titleClassName='text-whiteColor'
                    onClick={() => openAuth('login')}
                />
            </div>

            <AuthModal
                open={authOpen}
                initialMode={authMode}
                onClose={() => setAuthOpen(false)}
            />
        </nav>
    )
}

export default Navbar