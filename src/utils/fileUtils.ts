
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

// Extract text content from PDF file
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // In a real implementation, we would use a PDF parsing library
  // For now, we'll just return a placeholder text
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate extracting text from PDF
      setTimeout(() => {
        resolve("This is the extracted text from the PDF file. In a real implementation, we would use a PDF parsing library to extract the actual text content.");
      }, 1000);
    };
    reader.readAsArrayBuffer(file);
  });
};

// Extract text content from uploaded file
export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    return extractTextFromPDF(file);
  } else {
    // Assume it's a text file
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

// Download summary as TXT file
export const downloadAsTxt = (text: string, filename = 'summary.txt'): void => {
  try {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Summary downloaded as TXT');
  } catch (error) {
    console.error('Error downloading TXT:', error);
    toast.error('Failed to download summary');
  }
};

// Download summary as PDF
export const downloadAsPdf = (text: string, filename = 'summary.pdf'): void => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Research Paper Summary', 20, 20);
    
    // Add content with line breaks
    doc.setFontSize(12);
    
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 30);
    
    doc.save(filename);
    toast.success('Summary downloaded as PDF');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error('Failed to download summary');
  }
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    toast.error('Failed to copy text');
  }
};
