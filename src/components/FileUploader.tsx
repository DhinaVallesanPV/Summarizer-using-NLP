
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
    }
  };
  
  const clearFile = () => {
    setFile(null);
  };
  
  return (
    <Card className="w-full shadow-md animate-fade-in bg-white border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileUp className="w-5 h-5" />
          <span>Upload Research Paper</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className={`file-drop-area border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          } ${file ? 'bg-blue-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-indigo-400 mb-2" />
              <h3 className="font-medium mb-1 text-indigo-800">Drag & drop your research paper here</h3>
              <p className="text-sm text-indigo-600 mb-4">Support for PDF and TXT files</p>
              <div className="inline-flex justify-center">
                <label className="cursor-pointer">
                  <Button variant="outline" type="button" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
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
                  <Book className="h-8 w-8 text-indigo-600" />
                ) : (
                  <FileText className="h-8 w-8 text-indigo-600" />
                )}
                <div>
                  <p className="font-medium truncate text-indigo-800">{file.name}</p>
                  <p className="text-sm text-indigo-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFile}
                className="hover:bg-red-50 hover:text-red-500"
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
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={!file}
        >
          <FileText className="mr-2 h-4 w-4" /> Summarize Paper
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
