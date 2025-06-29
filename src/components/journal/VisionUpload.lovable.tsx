import React, { useState, useEffect } from 'react';

type Props = {
  onUpload?: (file: File) => void;
  defaultImage?: string;
};

const VisionUpload = ({ onUpload, defaultImage }: Props) => {
  const [imageFile, setImageFile] = useState<span style={{fontSize: '16px'}}>📄</span>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label style={{ color: "white", display: "flex", alignItems: "center" }}>
          <span>📷</span>
          <span>{previewUrl ? 'Change Screenshot' : 'Upload Screenshot'}</span>
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .webp"
            
            onChange={handleFileChange}
          />
        </label>
        
        {previewUrl && (
          <div style={{ width: "100%" }}>
            <p >Chart Preview</p>
            <img 
              src={previewUrl} 
              alt="Chart preview" 
              style={{ border: "1px solid #374151", width: "100%" }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionUpload; 