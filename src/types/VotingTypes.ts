export interface Voting {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: 'draft' | 'active' | 'closed';
  voting_type: 'single' | 'multiple';
  max_selections: number | null;
  start_date: string | null;
  end_date: string | null;
  show_results: boolean;
  require_login: boolean;
  allow_anonymous: boolean;
  cover_image: string | null;
  category: string | null;
  total_votes: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface VotingOption {
  id: string;
  voting_id: string;
  option_text: string;
  option_order: number;
  option_image: string | null;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

export interface VotingResponse {
  id: string;
  voting_id: string;
  option_id: string;
  user_id: string | null;
  user_identifier: string;
  user_email: string | null;
  user_name: string | null;
  voted_at: string;
  metadata: any;
}

export interface VotingCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface VotingFormData {
  title: string;
  description: string;
  slug: string;
  status: 'draft' | 'active' | 'closed';
  voting_type: 'single' | 'multiple';
  max_selections: number | null;
  start_date: string | null;
  end_date: string | null;
  show_results: boolean;
  require_login: boolean;
  allow_anonymous: boolean;
  cover_image: string | null;
  category: string | null;
}

export interface VotingOptionFormData {
  option_text: string;
  option_order: number;
  option_image: string | null;
}

export interface VotingOptionWithStats extends VotingOption {
  percentage: number;
  is_winner?: boolean;
}

export interface VotingResults {
  voting: Voting;
  options: VotingOptionWithStats[];
  total_votes: number;
  user_voted: boolean;
  user_choices: string[];
}

export const defaultVotingFormData: VotingFormData = {
  title: '',
  description: '',
  slug: '',
  status: 'draft',
  voting_type: 'single',
  max_selections: null,
  start_date: null,
  end_date: null,
  show_results: false,
  require_login: false,
  allow_anonymous: true,
  cover_image: null,
  category: null,
};
