
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileUp, Book, FileText, X } from 'lucide-react';
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
    if (files.length) {
      handleFileSelect(files[0]);
    }
  }, []);
  
  const handleFileSelect = (selectedFile: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or TXT file');
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File too large, please upload a file smaller than 10MB');
      return;
    }
    
    setFile(selectedFile);
    toast.success(`File "${selectedFile.name}" selected`);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    setIsLoading(true);
    try {
      const text = await extractTextFromFile(file);
      onTextExtracted(text);
      toast.success('File processed successfully');
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error('Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearFile = () => {
    setFile(null);
  };
  
  return (
    <Card className="w-full shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="w-5 h-5" />
          <span>Upload Research Paper</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`file-drop-area ${isDragging ? 'active' : ''} ${file ? 'bg-blue-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">Drag & drop your research paper here</h3>
              <p className="text-sm text-muted-foreground mb-4">Support for PDF and TXT files</p>
              <div className="inline-flex justify-center">
                <label className="cursor-pointer">
                  <Button variant="outline" type="button">
                    Browse Files
                  </Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.txt" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {file.type === 'application/pdf' ? (
                  <Book className="h-8 w-8 text-brand-500" />
                ) : (
                  <FileText className="h-8 w-8 text-brand-500" />
                )}
                <div>
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          className="w-full"
          disabled={!file}
        >
          Summarize Paper
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
