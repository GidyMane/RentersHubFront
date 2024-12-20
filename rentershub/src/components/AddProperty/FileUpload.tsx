import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  files: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, files }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload([...files, ...acceptedFiles]);
    },
    [files, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 
      'image/*': [] // Accept all image types 
    } 
  });
  

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFileUpload(newFiles);
  };

  return (
    <div className="mb-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">Drag & drop images here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

