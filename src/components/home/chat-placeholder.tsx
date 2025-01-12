'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Users, Video, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"

const ChatPlaceHolder = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full h-screen flex items-center justify-center p-6 sm:p-10 bg-gray-to-br from-blue-50 to-blue-100 backdrop-blur-sm">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
        <div className="relative w-32 sm:w-48 h-32 sm:h-48 animate-float">
          <div className="absolute inset-0 flex items-center justify-center">
            <MessageSquare size={64} className="text-blue-500" />
          </div>
          <Users size={48} className="absolute top-0 left-0 text-blue-400" />
          <Video size={48} className="absolute bottom-0 right-0 text-blue-300" />
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-center bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          Welcome to BaatCheet
        </h1>

        <p className="text-center text-gray-600 sm:max-w-lg max-w-md">
          Experience seamless conversations, crystal-clear calls, and effortless connections—all in one place.
        </p>

        <Button size="lg" className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
          Add Contact
        </Button>

        <div className="mt-12 text-center text-sm text-gray-500 flex items-center justify-center space-x-2">
          <Lock size={14} />
          <span>Your personal messages are end-to-end encrypted, ensuring your privacy.</span>
        </div>
      </div>
    </div>
  )
}

export default ChatPlaceHolder
