
import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import { useAuthStore } from '@/store/authStore';
import FileUploader from '@/components/FileUploader';
import SummaryResult from '@/components/SummaryResult';
import SummaryPreferences, { SummaryPreferences as SummaryPreferencesType } from '@/components/SummaryPreferences';
import { summarizeText } from '@/api/llmClient';
import { CustomProgress } from '@/components/ui/custom-progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [paperText, setPaperText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [preferences, setPreferences] = useState<SummaryPreferencesType>({
    length: "500",
    fluency: "standard"
  });
  
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            return prevProgress;
          }
          return prevProgress + 5;
        });
      }, 500);
      
      return () => {
        clearInterval(interval);
        setProgress(0);
      };
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (paperText) {
      handleGenerateSummary();
    }
  }, [paperText]);
  
  const handleTextExtracted = (text: string) => {
    setPaperText(text);
  };
  
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const generatedSummary = await summarizeText(paperText, preferences);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-800">Research Paper Summarizer</h1>
        
        {isLoading && (
          <div className="mb-8">
            <Alert className="bg-blue-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Processing your document</AlertTitle>
              <AlertDescription className="text-blue-600">
                Please wait while we analyze and summarize your research paper.
              </AlertDescription>
            </Alert>
            <CustomProgress value={progress} className="mt-4" />
          </div>
        )}
        
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <FileUploader 
              onTextExtracted={handleTextExtracted} 
              setIsLoading={setIsLoading}
            />
          </div>
          
          <div className="md:col-span-5 space-y-6">
            <SummaryPreferences
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
            
            {summary && (
              <SummaryResult summary={summary} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
