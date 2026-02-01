/**
 * MARKDOWN PARSER
 * Parses basic markdown (bold/italic) from text
 */

export interface ParsedSegment {
  type: 'text' | 'bold' | 'italic';
  content: string;
}

/**
 * Parses bold (**text**) and italic (*text*) from text
 * Returns nested structure for rendering
 */
export function parseMarkdown(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  
  // Split by bold markers first
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);

  for (const boldPart of boldSplit) {
    if (boldPart.startsWith('**') && boldPart.endsWith('**') && boldPart.length > 4) {
      // Bold text - check for nested italic
      const content = boldPart.slice(2, -2);
      segments.push({ type: 'bold', content });
    } else if (boldPart) {
      // Check for italic in non-bold text
      const italicSplit = boldPart.split(/(\*[^*]+\*)/g);
      
      for (const italicPart of italicSplit) {
        if (italicPart.startsWith('*') && italicPart.endsWith('*') && italicPart.length > 2) {
          segments.push({ type: 'italic', content: italicPart.slice(1, -1) });
        } else if (italicPart) {
          segments.push({ type: 'text', content: italicPart });
        }
      }
    }
  }

  return segments;
}
