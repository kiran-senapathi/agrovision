import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertCropDiagnosisSchema, insertFarmerSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Farmers endpoints
  app.get("/api/farmers", async (req, res) => {
    try {
      // For demo, return the first farmer
      const farmers = Array.from((storage as any).farmers.values());
      res.json(farmers[0] || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get farmer data" });
    }
  });

  app.post("/api/farmers", async (req, res) => {
    try {
      const farmerData = insertFarmerSchema.parse(req.body);
      const farmer = await storage.createFarmer(farmerData);
      res.status(201).json(farmer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid farmer data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create farmer" });
      }
    }
  });

  // Crop diagnosis endpoints
  app.post("/api/diagnose", upload.single('image'), async (req, res) => {
    try {
      const farmerId = req.body.farmerId;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Mock AI diagnosis - in real implementation, this would call an AI service
      const mockDiseases = [
        { name: "Early Blight", severity: "moderate", confidence: 0.85 },
        { name: "Leaf Spot", severity: "mild", confidence: 0.72 },
        { name: "Bacterial Wilt", severity: "severe", confidence: 0.91 },
        { name: "Powdery Mildew", severity: "mild", confidence: 0.68 }
      ];
      
      const mockTreatments = {
        "Early Blight": [
          "Apply neem oil spray every 7 days",
          "Remove affected leaves immediately", 
          "Improve air circulation around plants",
          "Copper-based fungicide application"
        ],
        "Leaf Spot": [
          "Remove infected leaves",
          "Apply copper fungicide",
          "Ensure proper drainage",
          "Avoid overhead watering"
        ],
        "Bacterial Wilt": [
          "Remove and destroy infected plants",
          "Disinfect tools after use",
          "Apply bactericide if available",
          "Improve soil drainage"
        ],
        "Powdery Mildew": [
          "Apply sulfur-based fungicide",
          "Increase air circulation",
          "Avoid overhead watering",
          "Remove affected plant parts"
        ]
      };

      const selectedDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      
      const diagnosis = await storage.createCropDiagnosis({
        farmerId,
        imagePath: file.path,
        disease: selectedDisease.name,
        severity: selectedDisease.severity,
        confidence: selectedDisease.confidence,
        treatments: mockTreatments[selectedDisease.name as keyof typeof mockTreatments] || []
      });

      res.json(diagnosis);
    } catch (error) {
      res.status(500).json({ message: "Failed to process crop diagnosis" });
    }
  });

  app.get("/api/diagnoses/:farmerId", async (req, res) => {
    try {
      const { farmerId } = req.params;
      const diagnoses = await storage.getCropDiagnosesByFarmer(farmerId);
      res.json(diagnoses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get crop diagnoses" });
    }
  });

  // Weather endpoints
  app.get("/api/weather/:location", async (req, res) => {
    try {
      const { location } = req.params;
      let weather = await storage.getWeatherData(location);
      
      if (!weather) {
        // Create mock weather data if none exists
        weather = await storage.createOrUpdateWeatherData({
          location,
          temperature: 25 + Math.random() * 10, // 25-35°C
          humidity: 50 + Math.random() * 30, // 50-80%
          rainfall: Math.random() * 20, // 0-20mm
          uvIndex: Math.floor(Math.random() * 11), // 0-10
          alerts: Math.random() > 0.7 ? ["High humidity detected"] : []
        });
      }
      
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weather data" });
    }
  });

  // Disease alerts endpoints
  app.get("/api/alerts/:location?", async (req, res) => {
    try {
      const { location } = req.params;
      const alerts = await storage.getDiseaseAlerts(location);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get disease alerts" });
    }
  });

  // Agricultural stores endpoints
  app.get("/api/stores/:location?", async (req, res) => {
    try {
      const { location } = req.params;
      const stores = await storage.getAgriStores(location);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get agricultural stores" });
    }
  });

  // Voice assistant endpoint using Gemini AI
  app.post("/api/voice/process", async (req, res) => {
    try {
      const { text, language } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "No text provided for processing" });
      }

      // Import the Gemini service
      const { processVoiceQuery } = await import("./gemini");
      
      const aiResponse = await processVoiceQuery(text, language);
      res.json(aiResponse);
      
    } catch (error) {
      console.error("Voice processing error:", error);
      res.status(500).json({ message: "Failed to process voice input" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
