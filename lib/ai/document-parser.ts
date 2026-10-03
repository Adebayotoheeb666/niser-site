import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

function normalizeText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim();
}

export async function extractTextFromDocument(filename: string, buffer: Buffer): Promise<string> {
  const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  if (extension === '.pdf') {
    const result = await pdfParse(buffer);
    return normalizeText(result.text || '');
  }

  if (extension === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return normalizeText(result.value || '');
  }

  throw new Error('Unsupported document format');
}
