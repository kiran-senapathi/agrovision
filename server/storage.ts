import { 
  type User, 
  type InsertUser,
  type Farmer,
  type InsertFarmer,
  type CropDiagnosis,
  type InsertCropDiagnosis,
  type WeatherData,
  type InsertWeatherData,
  type DiseaseAlert,
  type InsertDiseaseAlert,
  type AgriStore,
  type InsertAgriStore
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getFarmer(id: string): Promise<Farmer | undefined>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  updateFarmer(id: string, updates: Partial<Farmer>): Promise<Farmer | undefined>;
  
  getCropDiagnosis(id: string): Promise<CropDiagnosis | undefined>;
  getCropDiagnosesByFarmer(farmerId: string): Promise<CropDiagnosis[]>;
  createCropDiagnosis(diagnosis: InsertCropDiagnosis): Promise<CropDiagnosis>;
  
  getWeatherData(location: string): Promise<WeatherData | undefined>;
  createOrUpdateWeatherData(weather: InsertWeatherData): Promise<WeatherData>;
  
  getDiseaseAlerts(location?: string): Promise<DiseaseAlert[]>;
  createDiseaseAlert(alert: InsertDiseaseAlert): Promise<DiseaseAlert>;
  
  getAgriStores(location?: string): Promise<AgriStore[]>;
  createAgriStore(store: InsertAgriStore): Promise<AgriStore>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private farmers: Map<string, Farmer>;
  private cropDiagnoses: Map<string, CropDiagnosis>;
  private weatherData: Map<string, WeatherData>;
  private diseaseAlerts: Map<string, DiseaseAlert>;
  private agriStores: Map<string, AgriStore>;

  constructor() {
    this.users = new Map();
    this.farmers = new Map();
    this.cropDiagnoses = new Map();
    this.weatherData = new Map();
    this.diseaseAlerts = new Map();
    this.agriStores = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample farmer
    const farmer = await this.createFarmer({
      name: "Ravi Kumar",
      location: "Cuttack, Odisha",
      phone: "+91 9876543210",
      language: "en",
      healthScore: 85,
      achievements: ["early_adopter", "crop_protector", "pest_defender"]
    });

    // Create sample weather data
    await this.createOrUpdateWeatherData({
      location: "Bhubaneswar, Odisha",
      temperature: 28,
      humidity: 65,
      rainfall: 12,
      uvIndex: 6,
      alerts: ["High humidity detected"]
    });

    // Create sample disease alerts
    await this.createDiseaseAlert({
      disease: "Tomato Blight",
      location: "Odisha",
      riskLevel: "high",
      description: "Reported in 3 nearby farms",
      reportCount: 3
    });

    await this.createDiseaseAlert({
      disease: "Aphid Infestation",
      location: "Odisha",
      riskLevel: "medium",
      description: "Monitor crops closely",
      reportCount: 1
    });

    // Create sample agri stores
    await this.createAgriStore({
      name: "Krishna Agri Store",
      description: "Seeds, Fertilizers, Pesticides",
      location: "Bhubaneswar, Odisha",
      distance: 2.3,
      rating: 4.5,
      services: ["Seeds", "Fertilizers", "Pesticides"],
      contact: "+91 9876543211"
    });

    await this.createAgriStore({
      name: "Village Cooperative",
      description: "Organic Solutions, Training",
      location: "Cuttack, Odisha",
      distance: 1.8,
      rating: 5.0,
      services: ["Organic Solutions", "Training"],
      contact: "+91 9876543212"
    });

    await this.createAgriStore({
      name: "AgriTech Solutions",
      description: "Modern Equipment, Consultation",
      location: "Bhubaneswar, Odisha",
      distance: 4.1,
      rating: 4.0,
      services: ["Modern Equipment", "Consultation"],
      contact: "+91 9876543213"
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFarmer(id: string): Promise<Farmer | undefined> {
    return this.farmers.get(id);
  }

  async createFarmer(insertFarmer: InsertFarmer): Promise<Farmer> {
    const id = randomUUID();
    const farmer: Farmer = { 
      ...insertFarmer, 
      id, 
      createdAt: new Date(),
      healthScore: insertFarmer.healthScore || 0,
      achievements: insertFarmer.achievements || []
    };
    this.farmers.set(id, farmer);
    return farmer;
  }

  async updateFarmer(id: string, updates: Partial<Farmer>): Promise<Farmer | undefined> {
    const farmer = this.farmers.get(id);
    if (!farmer) return undefined;
    
    const updatedFarmer = { ...farmer, ...updates };
    this.farmers.set(id, updatedFarmer);
    return updatedFarmer;
  }

  async getCropDiagnosis(id: string): Promise<CropDiagnosis | undefined> {
    return this.cropDiagnoses.get(id);
  }

  async getCropDiagnosesByFarmer(farmerId: string): Promise<CropDiagnosis[]> {
    return Array.from(this.cropDiagnoses.values()).filter(
      (diagnosis) => diagnosis.farmerId === farmerId
    );
  }

  async createCropDiagnosis(insertDiagnosis: InsertCropDiagnosis): Promise<CropDiagnosis> {
    const id = randomUUID();
    const diagnosis: CropDiagnosis = { 
      ...insertDiagnosis, 
      id, 
      createdAt: new Date(),
      treatments: insertDiagnosis.treatments || []
    };
    this.cropDiagnoses.set(id, diagnosis);
    return diagnosis;
  }

  async getWeatherData(location: string): Promise<WeatherData | undefined> {
    return Array.from(this.weatherData.values()).find(
      (weather) => weather.location === location
    );
  }

  async createOrUpdateWeatherData(insertWeather: InsertWeatherData): Promise<WeatherData> {
    const existing = await this.getWeatherData(insertWeather.location);
    if (existing) {
      const updated: WeatherData = { 
        ...existing, 
        ...insertWeather, 
        updatedAt: new Date(),
        alerts: insertWeather.alerts || []
      };
      this.weatherData.set(existing.id, updated);
      return updated;
    }
    
    const id = randomUUID();
    const weather: WeatherData = { 
      ...insertWeather, 
      id, 
      updatedAt: new Date(),
      alerts: insertWeather.alerts || []
    };
    this.weatherData.set(id, weather);
    return weather;
  }

  async getDiseaseAlerts(location?: string): Promise<DiseaseAlert[]> {
    const alerts = Array.from(this.diseaseAlerts.values()).filter(
      (alert) => alert.isActive
    );
    
    if (location) {
      return alerts.filter((alert) => alert.location === location);
    }
    
    return alerts;
  }

  async createDiseaseAlert(insertAlert: InsertDiseaseAlert): Promise<DiseaseAlert> {
    const id = randomUUID();
    const alert: DiseaseAlert = { 
      ...insertAlert, 
      id, 
      createdAt: new Date(),
      isActive: true,
      reportCount: insertAlert.reportCount || 0
    };
    this.diseaseAlerts.set(id, alert);
    return alert;
  }

  async getAgriStores(location?: string): Promise<AgriStore[]> {
    const stores = Array.from(this.agriStores.values());
    
    if (location) {
      return stores.filter((store) => store.location.includes(location));
    }
    
    return stores.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  async createAgriStore(insertStore: InsertAgriStore): Promise<AgriStore> {
    const id = randomUUID();
    const store: AgriStore = { 
      ...insertStore, 
      id,
      services: insertStore.services || []
    };
    this.agriStores.set(id, store);
    return store;
  }
}

export const storage = new MemStorage();
