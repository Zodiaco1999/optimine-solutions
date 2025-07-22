import { Replacement } from './replacement';

export interface PredictResponse {
  confidence_score: number;
  replacement?: Replacement;
  is_success: boolean;
}
