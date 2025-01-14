'use client'

import { useState } from 'react'

export default function ProfilePage() {
  const [profile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567'
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#070707]">
      <header className="header-height safe-top flex items-center px-4 bg-[#070707]/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      <main className="flex-1 px-4 pt-[calc(env(safe-area-inset-top)+4rem)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Name</label>
            <p className="text-lg">{profile.name}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email</label>
            <p className="text-lg">{profile.email}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Phone</label>
            <p className="text-lg">{profile.phone}</p>
          </div>
        </div>
      </main>
    </div>
  )
} 