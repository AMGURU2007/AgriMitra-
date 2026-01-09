
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CropRecommendation, GovtScheme, FarmerProfile } from "../types";

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Convert these GPS coordinates into a simple, human-readable location name for a farmer in India (e.g., "District, State").
    Coordinates: Latitude ${lat}, Longitude ${lng}.
    Respond ONLY with the name string, nothing else.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text?.trim() || "Unknown Location";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "Location detected";
  }
};

export const getCropRecommendations = async (profile: FarmerProfile): Promise<CropRecommendation[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Act as an expert agricultural scientist for rural India. 
    A farmer from ${profile.location} has ${profile.landSize} acres of land with ${profile.soilType} soil and ${profile.waterSource} as the primary water source.
    Provide top 3 crop recommendations suitable for this context. 
    Include suitability score (0-100), estimated yield per acre, expected market price, and reasoning.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING },
              suitability: { type: Type.NUMBER },
              estimatedYield: { type: Type.STRING },
              expectedPrice: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["cropName", "suitability", "estimatedYield", "expectedPrice", "reasoning"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching crop recommendations:", error);
    return [
      {
        cropName: "Wheat (Sonalika)",
        suitability: 95,
        estimatedYield: "20-25 Quintals/Acre",
        expectedPrice: "₹2,275/Quintal (MSP)",
        reasoning: "Excellent soil compatibility and seasonal timing."
      },
      {
        cropName: "Mustard",
        suitability: 88,
        estimatedYield: "8-10 Quintals/Acre",
        expectedPrice: "₹5,650/Quintal",
        reasoning: "Low water requirement fits your irrigation profile."
      }
    ];
  }
};

export const checkSchemeEligibility = async (profile: FarmerProfile): Promise<GovtScheme[]> => {
  return [
    {
      id: '1',
      name: 'PM-KISAN Samman Nidhi',
      category: 'Credit',
      description: 'Income support of ₹6,000 per year to all landholding farmer families.',
      benefit: '₹2,000 every 4 months',
      eligibility: ['Small/Marginal landholding', 'Aadhar linked account']
    },
    {
      id: '2',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      category: 'Insurance',
      description: 'Crop insurance for yield losses due to natural calamities.',
      benefit: 'Financial support against crop failure',
      eligibility: ['Available for all crops', 'Notification by state']
    }
  ];
};
