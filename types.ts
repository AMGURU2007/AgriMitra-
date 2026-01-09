
export interface CropRecommendation {
  cropName: string;
  suitability: number; // 0-100
  estimatedYield: string;
  expectedPrice: string;
  reasoning: string;
}

export interface MarketTrend {
  month: string;
  price: number;
  forecast: number;
}

export interface GovtScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefit: string;
  category: 'Subsidy' | 'Insurance' | 'Credit' | 'Education';
}

export interface FarmerProfile {
  location: string;
  landSize: number;
  soilType: string;
  waterSource: string;
}

export enum UserRole {
  FARMER = 'FARMER',
  NGO_ADMIN = 'NGO_ADMIN',
  GOVT_OFFICIAL = 'GOVT_OFFICIAL'
}
