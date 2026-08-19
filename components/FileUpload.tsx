'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Image, Video } from 'lucide-react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  selectedFiles: File[];
  error?: string;
  maxFiles?: number;
}

export default function FileUpload({ onFilesSelect, selectedFiles, error, maxFiles = 10 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = (newFiles: File[]) => {
    // Validar número máximo de arquivos
    if (selectedFiles.length + newFiles.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Validar tamanho dos arquivos (50MB por arquivo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert(`Arquivos muito grandes: ${oversizedFiles.map(f => f.name).join(', ')}. Tamanho máximo: 50MB`);
      return;
    }

    const validFiles = newFiles.filter(file => file.size <= maxSize);
    const updatedFiles = [...selectedFiles, ...validFiles];
    onFilesSelect(updatedFiles);
    
    // Criar previews para imagens
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [file.name]: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(Array.from(files));
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
    onFilesSelect(updatedFiles);
    
    // Remover preview
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  };

  const clearAllFiles = () => {
    onFilesSelect([]);
    setPreviews({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-8 h-8 text-purple-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <label className="label-field">
        Anexos (Fotos, Documentos ou Vídeos)
        {selectedFiles.length > 0 && (
          <span className="text-sm text-gray-500 ml-2">
            ({selectedFiles.length}/{maxFiles} arquivos)
          </span>
        )}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${error ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Clique para selecionar ou arraste arquivos aqui
        </p>
        <p className="text-sm text-gray-500">
          Suporta: JPG, PNG, GIF, PDF, DOC, MP4, AVI (máx. 50MB por arquivo)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,video/*"
          onChange={handleInputChange}
          multiple
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">
              Arquivos Selecionados ({selectedFiles.length})
            </h4>
            <button
              type="button"
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Limpar Todos
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {previews[file.name] ? (
                      <img
                        src={previews[file.name]}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
