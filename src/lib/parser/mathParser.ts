/**
 * MATH PARSER
 * Extracts and processes LaTeX math expressions from text
 */

export interface MathToken {
  id: string;
  tex: string;
}

/**
 * Regex pattern for math expressions:
 * - $...$: Explicit inline math
 * - \command: LaTeX commands
 * - Subscripts/superscripts: x_i, x_{ij}, x^2, x^{2n}
 */
const MATH_REGEX =
  /(\$[^$]+\$)|(\\\[a-zA-Z]+|\\(?:sum|frac|sqrt|cdot|rightarrow|Delta|xi|eta|nu|alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|tau|phi|psi|omega)|[a-zA-Z](?:_[a-zA-Z0-9]+|_\{[^}]+\})+(?:[\^][a-zA-Z0-9]+|[\^]\{[^}]+\})?|\\[a-zA-Z]+)/g;

/**
 * Extracts math expressions from text and replaces them with placeholders
 */
export function extractMathTokens(text: string): {
  textWithPlaceholders: string;
  tokens: MathToken[];
} {
  const tokens: MathToken[] = [];

  const textWithPlaceholders = text.replace(MATH_REGEX, (match) => {
    const tokenId = `__MATH_TOKEN_${tokens.length}__`;

    // Remove $ delimiters if present
    const cleanTex = match.startsWith('$') && match.endsWith('$') 
      ? match.slice(1, -1) 
      : match;

    tokens.push({ id: tokenId, tex: cleanTex });
    return tokenId;
  });

  return { textWithPlaceholders, tokens };
}

/**
 * Pattern to match math token placeholders
 */
export const TOKEN_PLACEHOLDER_REGEX = /(__MATH_TOKEN_\d+__)/g;

/**
 * Extracts the token index from a placeholder
 */
export function getTokenIndex(placeholder: string): number | null {
  const match = placeholder.match(/^__MATH_TOKEN_(\d+)__$/);
  return match ? parseInt(match[1], 10) : null;
}
