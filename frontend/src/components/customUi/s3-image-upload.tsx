import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '@/libs/axios';

interface S3ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const S3ImageUpload: React.FC<S3ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const base64Data = await convertToBase64(file);
      
      const response = await apiClient.post('/api/upload/s3', {
        base64Data,
        fileName: file.name,
        contentType: file.type,
      });

      const data = response.data;
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleRemove = async () => {
    if (value) {
      try {
        const response = await apiClient.delete('/api/upload/s3', {
          data: {
            fileUrl: value,
          },
        });

        if (response.status === 200) {
          toast.success('Image removed successfully');
        }
      } catch (error) {
        console.error('Delete error:', error);
        // Still remove from form even if S3 delete fails
      }
    }
    
    onRemove();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
          id="s3-image-upload"
          aria-label="Upload image file"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('s3-image-upload')?.click()}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading to S3...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload to S3
            </>
          )}
        </Button>

        {value && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {value && (
        <div className="relative">
          <img
            src={value}
            alt="User profile preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      <p className="text-sm text-gray-500">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB. Stored in AWS S3.
      </p>
    </div>
  );
};

export default S3ImageUpload;