'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from 'lucide-react'

interface AvatarUploadProps {
  initialImage?: string
  onImageUpload: (file: File) => void
}

export function AvatarUpload({ initialImage, onImageUpload }: AvatarUploadProps) {
  const [avatarSrc, setAvatarSrc] = useState(initialImage)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>
      <div className="relative">
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Camera className="mr-2 h-4 w-4" />
          Change Photo
        </Button>
      </div>
    </div>
  )
}

