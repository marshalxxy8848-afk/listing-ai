export type Platform = "amazon" | "shopify" | "ebay" | "aliexpress" | "temu" | "tiktok";

export interface GenerationInput {
  productName: string;
  features: string;
  platform: Platform;
}

export interface KeywordSuggestions {
  high_volume: string[];
  long_tail: string[];
  related: string[];
}

export interface QualityScore {
  overall: number;
  title: number;
  bullets: number;
  description: number;
  keywords: number;
}

export interface GenerationResult {
  title: string;
  bullet_points: string[];
  description: string;
  keywords: string[];
  keyword_suggestions?: KeywordSuggestions;
  quality_score?: QualityScore;
}

export interface GenerationRecord extends GenerationResult {
  id: string; user_id: string; project_id: string | null;
  product_name: string; features: string; target_platform: string;
  model_used: string; tokens_used: number; latency_ms: number;
  is_favorite: boolean; created_at: string;
}

export interface ProjectRecord {
  id: string; user_id: string; name: string;
  platform: string; category: string | null; created_at: string;
}

export interface ProfileRecord {
  id: string; email: string | null; display_name: string | null;
  credits: number; plan: string; created_at: string;
}
