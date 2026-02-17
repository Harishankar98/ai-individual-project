
declare const pdfjsLib: any;

export const extractTextFromPdf = async (file: File): Promise<{ text: string, pages: number }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `[Page ${i}]\n${pageText}\n\n`;
  }
  
  return {
    text: fullText,
    pages: pdf.numPages
  };
};

export const chunkText = (text: string, chunkSize: number = 1000): string[] => {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
};
