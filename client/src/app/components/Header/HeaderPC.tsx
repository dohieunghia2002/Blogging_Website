"use client"
import React from 'react'
import logo from '@/app/assets/logo.png'

export default function HeaderPC() {
    return (
        <div className="container mx-auto mb-8 h-18 flex items-center justify-between bg-amber-400">
            <div className="logo-wrapper h-[80%]">
                <img src={logo.src} alt="logo" className='h-full' />
            </div>
        </div>
    )
}
