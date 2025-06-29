import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '@/styles/vision.css';

interface ChartUploaderProps {
  onFileUpload: (file: File, previewUrl: string) => void;
  isLoading: boolean;
}

const ChartUploader = ({ onFileUpload, isLoading }: ChartUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      onFileUpload(file, previewUrl);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`chart-uploader ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {isDragActive ? (
          <>
            <span style={{fontSize: '16px'}}>📄</span>
            <p style={{ color: "white" }}>Drop the chart here...</p>
          </>
        ) : (
          <>
            <span style={{fontSize: '16px'}}>⬆️</span>
            <p style={{ color: "white" }}>Drag & drop a chart image, or click to select</p>
            <p style={{ color: "#9CA3AF" }}>PNG or JPG supported</p>
          </>
        )}
      </div>
      {isLoading && <div  />}
    </div>
  );
};

export default ChartUploader; 