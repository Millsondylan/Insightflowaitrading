import React, { useState, useEffect } from 'react';

type Props = {
  onUpload?: (file: File) => void;
  defaultImage?: string;
};

const VisionUpload = ({ onUpload, defaultImage }: Props) => {
  const [imageFile, setImageFile] = useState<File >(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement >) => {
    const file = event.target.files?.[0];
    if (file) {
      if (previewUrl) {
        // Revoke the old URL to prevent memory leaks
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      if (onUpload) {
        onUpload(file);
      }
    }
  };
  
  // Set default image on mount if provided
  useEffect(() => {
    if (defaultImage) {
      setPreviewUrl(defaultImage);
    }
  }, [defaultImage]);

  // Cleanup effect to revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && !defaultImage) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, defaultImage]);

  return (
    <Div className="rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md shadow-lg space-y-4">
      <Div className="flex flex-col items-center gap-4">
        <Label className="cursor-pointer bg-white/10 hover:bg-cyan-600/80 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300 flex items-center gap-2">
          <Span>📷</File>
          <Span>{previewUrl ? 'Change Screenshot' : 'Upload Screenshot'}</Span>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg, .webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </Input>
        
        {previewUrl && (
          <Div className="w-full mt-4">
            <P className="text-sm text-white/60 text-center mb-2">Chart Preview</Div>
            <Img 
              src={previewUrl} 
              alt="Chart preview" 
              className="rounded-lg border border-white/10 max-h-96 w-full object-contain" 
            />
          </Img>
        )}
      </Div>
    </Div>
  );
};

export default VisionUpload; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
