'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
}

export function FileUploadZone({ onFilesSelected }: FileUploadZoneProps) {
  const [files, setFiles] = useState<Array<{ file: File; progress: number }>>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({ file, progress: 0 }))
    setFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload progress
    newFiles.forEach(fileObj => {
      const timer = setInterval(() => {
        setFiles(prev => 
          prev.map(f => 
            f.file === fileObj.file
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        )
      }, 200)

      setTimeout(() => {
        clearInterval(timer)
        onFilesSelected([fileObj.file])
      }, 2000)
    })
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  })

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(f => f.file !== fileToRemove))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#1C4532] bg-[#1C4532]/10' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports: JPG, JPEG, PNG
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map(({ file, progress }) => (
            <div key={file.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({Math.round(file.size / 1024)}KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Progress value={progress} className="h-2" />
              Working on it {progress} %
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

