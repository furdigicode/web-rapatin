import { Voting, VotingResults, VotingOptionWithStats } from '@/types/VotingTypes';

/**
 * Generate unique user identifier using browser fingerprint
 */
export const generateUserIdentifier = (): string => {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const platform = navigator.platform;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  
  const fingerprint = `${userAgent}-${language}-${platform}-${screenResolution}`;
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `user_${Math.abs(hash)}`;
};

/**
 * Check if voting is currently active
 */
export const isVotingActive = (voting: Voting): boolean => {
  if (voting.status !== 'active') return false;
  
  const now = new Date();
  
  if (voting.start_date && new Date(voting.start_date) > now) {
    return false;
  }
  
  if (voting.end_date && new Date(voting.end_date) < now) {
    return false;
  }
  
  return true;
};

/**
 * Calculate time remaining until voting ends
 */
export const getTimeRemaining = (endDate: string): string => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Selesai';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} hari lagi`;
  if (hours > 0) return `${hours} jam lagi`;
  return `${minutes} menit lagi`;
};

/**
 * Format voting results with percentages
 */
export const formatVotingResults = (results: VotingResults): VotingOptionWithStats[] => {
  const totalVotes = results.total_votes;
  
  return results.options.map(option => {
    const percentage = totalVotes > 0 
      ? Math.round((option.vote_count / totalVotes) * 100) 
      : 0;
    
    return {
      ...option,
      percentage,
    };
  });
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Check if voting has ended
 */
export const hasVotingEnded = (voting: Voting): boolean => {
  if (voting.status === 'closed') return true;
  if (!voting.end_date) return false;
  
  return new Date(voting.end_date) < new Date();
};

/**
 * Check if voting has started
 */
export const hasVotingStarted = (voting: Voting): boolean => {
  if (!voting.start_date) return true;
  return new Date(voting.start_date) <= new Date();
};
