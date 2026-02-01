/**
 * PARSED TEXT COMPONENT
 * Renders text with embedded math and markdown formatting
 */

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { MathDisplay } from './MathDisplay';
import {
  extractMathTokens,
  TOKEN_PLACEHOLDER_REGEX,
  getTokenIndex,
  type MathToken,
} from '@/lib/parser/mathParser';

export interface ParsedTextProps {
  /** Text to parse and render */
  text: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Restores math tokens by replacing placeholders with MathDisplay components
 */
function restoreMath(
  text: string,
  tokens: MathToken[],
  keyPrefix: string
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const split = text.split(TOKEN_PLACEHOLDER_REGEX);

  split.forEach((part, idx) => {
    const tokenIndex = getTokenIndex(part);
    if (tokenIndex !== null && tokens[tokenIndex]) {
      parts.push(
        <MathDisplay key={`${keyPrefix}-m-${idx}`} tex={tokens[tokenIndex].tex} block={false} />
      );
    } else if (part) {
      parts.push(<span key={`${keyPrefix}-s-${idx}`}>{part}</span>);
    }
  });

  return parts;
}

/**
 * Parses italic markup and restores math within
 */
function parseItalic(
  text: string,
  tokens: MathToken[],
  keyPrefix: string
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const italicSplit = text.split(/(\*[^*]+\*)/g);

  italicSplit.forEach((part, idx) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const content = part.slice(1, -1);
      parts.push(
        <em key={`${keyPrefix}-i-${idx}`} className="italic">
          {restoreMath(content, tokens, `${keyPrefix}-i-${idx}`)}
        </em>
      );
    } else if (part) {
      parts.push(
        <span key={`${keyPrefix}-txt-${idx}`}>
          {restoreMath(part, tokens, `${keyPrefix}-txt-${idx}`)}
        </span>
      );
    }
  });

  return parts;
}

/**
 * Parses bold and italic markdown, restoring math at the leaf level
 */
function parseMarkdownWithMath(
  textWithPlaceholders: string,
  tokens: MathToken[]
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const boldSplit = textWithPlaceholders.split(/(\*\*[^*]+\*\*)/g);

  boldSplit.forEach((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const content = part.slice(2, -2);
      parts.push(
        <strong key={`b-${idx}`} className="font-bold">
          {parseItalic(content, tokens, `b-${idx}`)}
        </strong>
      );
    } else if (part) {
      parts.push(
        <span key={`t-${idx}`}>{parseItalic(part, tokens, `t-${idx}`)}</span>
      );
    }
  });

  return parts;
}

export const ParsedText: React.FC<ParsedTextProps> = ({ text, className }) => {
  const processedContent = useMemo(() => {
    if (!text) return null;

    // Step 1: Extract math tokens
    const { textWithPlaceholders, tokens } = extractMathTokens(text);

    // Step 2: Parse markdown with math placeholders
    return parseMarkdownWithMath(textWithPlaceholders, tokens);
  }, [text]);

  return <span className={cn(className)}>{processedContent}</span>;
};

ParsedText.displayName = 'ParsedText';
