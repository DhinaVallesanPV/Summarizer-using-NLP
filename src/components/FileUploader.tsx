
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileText, X, File } from 'lucide-react';
import { extractTextFromFile } from '@/utils/fileUtils';

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onTextExtracted, setIsLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) handleFileSelect(files[0]);
  }, []);
  
  const handleFileSelect = (selectedFile: globalThis.File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error('File too large — maximum 20 MB');
      return;
    }
    setFile(selectedFile);
    toast.success(`"${selectedFile.name}" selected`);
    
    // Auto-extract text
    setIsLoading(true);
    extractTextFromFile(selectedFile)
      .then((text) => {
        onTextExtracted(text);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error extracting text:', err);
        toast.error('Failed to process file');
        setIsLoading(false);
      });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };
  
  const clearFile = () => setFile(null);
  
  return (
    <div className="glass-card rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <Upload className="h-4 w-4 text-primary-foreground" />
        </div>
        <h2 className="font-display font-semibold text-foreground">Upload Paper</h2>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group ${
          isDragging 
            ? 'border-primary bg-accent/50 scale-[1.01]' 
            : file 
              ? 'border-primary/30 bg-accent/20' 
              : 'border-border hover:border-primary/40 hover:bg-accent/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && document.getElementById('file-input')?.click()}
      >
        {!file ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl gradient-bg-subtle mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display font-medium text-foreground mb-1">
              Drop your PDF here
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              or click to browse • PDF only • Max 20 MB
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              className="border-primary/30 text-primary hover:bg-accent"
              onClick={(e) => { e.stopPropagation(); document.getElementById('file-input')?.click(); }}
            >
              Browse Files
            </Button>
            <input 
              id="file-input"
              type="file" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
