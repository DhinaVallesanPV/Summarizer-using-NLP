import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import { useAuthStore } from '@/store/authStore';
import FileUploader from '@/components/FileUploader';
import SummaryResult from '@/components/SummaryResult';
import SummaryPreferencesPanel, { SummaryPreferences } from '@/components/SummaryPreferences';
import { summarizeText } from '@/api/llmClient';
import { CustomProgress } from '@/components/ui/custom-progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Sparkles, Loader2 } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [paperText, setPaperText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [preferences, setPreferences] = useState<SummaryPreferences>({
    length: "400",
    fluency: "professional"
  });
  
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => prev >= 95 ? prev : prev + 5);
      }, 500);
      return () => { clearInterval(interval); setProgress(0); };
    }
  }, [isLoading]);
  
  const handleTextExtracted = (text: string) => {
    setPaperText(text);
    toast.success('Paper uploaded — configure preferences and generate summary');
  };
  
  const handleGenerateSummary = async () => {
    if (!paperText) {
      toast.error('Please upload a research paper first');
      return;
    }
    setIsLoading(true);
    setSummary("");
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
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="gradient-bg-subtle border-b border-border">
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
            Research Paper Summarizer
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Upload your research paper, customize preferences, and get an AI-powered summary in seconds.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 flex-grow max-w-5xl">
        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 animate-fade-in">
            <Alert className="bg-accent/50 border-primary/20 backdrop-blur-sm">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <AlertTitle className="text-foreground font-display">Processing your document</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Analyzing and summarizing your research paper…
              </AlertDescription>
            </Alert>
            <CustomProgress value={progress} className="mt-4" />
          </div>
        )}
        
        {/* Main Controls — Upload + Preferences side by side */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {/* Upload Section — takes 3 cols */}
          <div className="md:col-span-3">
            <FileUploader 
              onTextExtracted={handleTextExtracted} 
              setIsLoading={setIsLoading}
            />
          </div>
          
          {/* Preferences Section — takes 2 cols */}
          <div className="md:col-span-2">
            <div className="glass-card rounded-xl p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-display font-semibold text-foreground">Preferences</h2>
              </div>
              <SummaryPreferencesPanel
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
            </div>
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={handleGenerateSummary}
            disabled={!paperText || isLoading}
            className="gradient-bg text-primary-foreground px-8 py-3 h-12 text-base font-display font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            size="lg"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> Generate Summary</>
            )}
          </Button>
        </div>
        
        {/* Summary Result */}
        {summary && (
          <div className="animate-fade-in">
            <SummaryResult summary={summary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
