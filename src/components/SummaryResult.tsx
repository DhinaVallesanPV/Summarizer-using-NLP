
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { downloadAsPdf, downloadAsTxt, copyToClipboard } from '@/utils/fileUtils';
import { Book, Copy, Download, FileDown, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
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

  const handleDownloadPdf = () => downloadAsPdf(summary, `${paperTitle.replace(/\s+/g, '-')}-summary.pdf`);
  const handleDownloadTxt = () => downloadAsTxt(summary, `${paperTitle.replace(/\s+/g, '-')}-summary.txt`);
  
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="gradient-bg px-5 py-4 flex items-center gap-2">
        <Book className="w-5 h-5 text-primary-foreground" />
        <h2 className="font-display font-semibold text-primary-foreground">Summary Result</h2>
      </div>
      
      <div className="p-5">
        <div className="bg-muted/50 rounded-xl p-5 border border-border/50 relative">
          <ScrollArea className="h-[280px] w-full pr-4">
            <p className="text-foreground leading-relaxed text-sm">{summary}</p>
          </ScrollArea>
          <div className="absolute top-3 right-3">
            <Button
              variant={copied ? "outline" : "ghost"}
              size="icon"
              onClick={handleCopyClick}
              className="h-8 w-8 rounded-lg"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 rounded-lg border-border hover:bg-accent">
                View Full Summary
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{paperTitle} — Summary</DialogTitle>
                <DialogDescription>Generated with your selected preferences</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] mt-4">
                <p className="leading-relaxed pr-4">{summary}</p>
              </ScrollArea>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyClick}>
                  {copied ? <CheckCircle className="h-4 w-4 mr-1 text-primary" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTxt}>
                  <FileDown className="h-4 w-4 mr-1" /> TXT
                </Button>
                <Button size="sm" className="gradient-bg text-primary-foreground" onClick={handleDownloadPdf}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-1 gradient-bg text-primary-foreground rounded-lg">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadPdf}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadTxt}>
                <FileDown className="h-4 w-4 mr-2" /> Download TXT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
