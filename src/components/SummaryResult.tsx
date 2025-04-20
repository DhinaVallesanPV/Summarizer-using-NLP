
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadAsPdf, downloadAsTxt, copyToClipboard } from '@/utils/fileUtils';
import { Book, Copy, Download, FileDown, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryResultProps {
  summary: string;
  paperTitle?: string;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ summary, paperTitle = 'Research Paper' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopyClick = async () => {
    await copyToClipboard(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownloadPdf = () => {
    downloadAsPdf(summary, `${paperTitle.replace(/\s+/g, '-')}-summary.pdf`);
  };
  
  const handleDownloadTxt = () => {
    downloadAsTxt(summary, `${paperTitle.replace(/\s+/g, '-')}-summary.txt`);
  };
  
  return (
    <Card className="w-full shadow-md animate-fade-in bg-white border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          <span>Summary Result</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="bg-gray-50 rounded-md p-4 border border-indigo-100">
          <div className="relative">
            <ScrollArea className="h-[280px] w-full pr-4">
              <div className="whitespace-pre-line text-gray-700">{summary}</div>
            </ScrollArea>
            <div className="absolute top-0 right-0">
              <Button
                variant={copied ? "outline" : "ghost"}
                size="icon"
                onClick={handleCopyClick}
                className="h-8 w-8"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mr-2 border-indigo-200 hover:bg-indigo-50">
              View Full Summary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{paperTitle} - Summary</DialogTitle>
              <DialogDescription>Generated summary with your selected preferences</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ScrollArea className="h-[60vh]">
                <div className="whitespace-pre-line pr-4">{summary}</div>
              </ScrollArea>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyClick}>
                  {copied ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="border-indigo-200">
                  <FileDown className="h-4 w-4 mr-2" /> Download TXT
                </Button>
                <Button size="sm" onClick={handleDownloadPdf} className="bg-indigo-600 hover:bg-indigo-700">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full ml-2 bg-indigo-600 hover:bg-indigo-700">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-2" /> Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadTxt}>
              <FileDown className="h-4 w-4 mr-2" /> Download as TXT
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default SummaryResult;
