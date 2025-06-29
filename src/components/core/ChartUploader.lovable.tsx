import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage } from 'lucide-react';
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
      <div className="chart-uploader-content flex flex-col items-center justify-center space-y-4">
        {isDragActive ? (
          <>
            <fileimage  >
            <p className="text-lg font-semibold text-white">Drop the chart here...</p>
          </>
        ) : (
          <>
            <uploadcloud  >
            <p className="text-lg font-semibold text-white">Drag & drop a chart image, or click to select</p>
            <p className="text-sm text-gray-400">PNG or JPG supported</p>
          </>
        )}
      </div>
      {isLoading && <div className="shimmer-overlay" />}
    </div>
  );
};

export default ChartUploader; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
