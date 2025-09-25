/**
 * Calculate word count from text content, excluding HTML tags
 * @param content - The content to count words from
 * @returns Number of words
 */
export const calculateWordCount = (content: string): number => {
  if (!content || typeof content !== 'string') {
    return 0;
  }

  // Remove HTML tags
  const textWithoutHtml = content.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace and split by whitespace
  const words = textWithoutHtml
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(word => word.length > 0);

  return words.length;
};