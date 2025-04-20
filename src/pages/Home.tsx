
import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import { useAuthStore } from '@/store/authStore';
import FileUploader from '@/components/FileUploader';
import SummaryResult from '@/components/SummaryResult';
import SummaryPreferences, { SummaryPreferences as SummaryPreferencesType } from '@/components/SummaryPreferences';
import { summarizeText } from '@/api/llmClient';
import { Progress } from '@/components/ui/progress';
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
    <div className="min-h-screen flex flex-col gradient-bg">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Research Paper Summarizer</h1>
        
        {isLoading && (
          <div className="mb-8">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Processing your document</AlertTitle>
              <AlertDescription>
                Please wait while we analyze and summarize your research paper.
              </AlertDescription>
            </Alert>
            <Progress value={progress} className="mt-4" />
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileUploader 
              onTextExtracted={handleTextExtracted} 
              setIsLoading={setIsLoading}
            />
            <SummaryPreferences
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
          </div>
          
          {summary && (
            <div>
              <SummaryResult summary={summary} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
