"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Image {
  url: string;
  publicId: string;
  isNew?: boolean;
  file?: File;
}

interface ImageUploadProps {
  images: Image[];
  setImages: (images: Image[]) => void;
  onDelete: (image: Image) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages, onDelete }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        publicId: '',
        isNew: true,
        file,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleImageDelete = (index: number) => {
    const imageToDelete = images[index];
    if (imageToDelete.isNew) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    } else {
      onDelete(imageToDelete);
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button >Upload Images</Button>
      </label>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.url}
              alt={`Property ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
            <Button
              onClick={() => handleImageDelete(index)}
              className="absolute top-0 right-0 m-1"
              variant="destructive"
              size="sm"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

