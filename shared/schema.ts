import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  githubId: varchar("github_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const farmers = pgTable("farmers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  phone: text("phone"),
  language: text("language").default("en"),
  healthScore: integer("health_score").default(0),
  achievements: text("achievements").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cropDiagnoses = pgTable("crop_diagnoses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  imagePath: text("image_path"),
  disease: text("disease"),
  severity: text("severity"), // low, medium, high
  confidence: real("confidence"),
  treatments: text("treatments").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull().unique(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  rainfall: real("rainfall"),
  uvIndex: integer("uv_index"),
  alerts: text("alerts").array().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const diseaseAlerts = pgTable("disease_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disease: text("disease").notNull(),
  location: text("location").notNull(),
  riskLevel: text("risk_level"), // low, medium, high
  description: text("description"),
  reportCount: integer("report_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agriStores = pgTable("agri_stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  distance: real("distance"), // in km
  rating: real("rating").default(0),
  services: text("services").array().default([]),
  contact: text("contact"),
  imagePath: text("image_path"),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
});

export const insertCropDiagnosisSchema = createInsertSchema(cropDiagnoses).omit({
  id: true,
  createdAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  updatedAt: true,
});

export const insertDiseaseAlertSchema = createInsertSchema(diseaseAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertAgriStoreSchema = createInsertSchema(agriStores).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type Farmer = typeof farmers.$inferSelect;
export type InsertCropDiagnosis = z.infer<typeof insertCropDiagnosisSchema>;
export type CropDiagnosis = typeof cropDiagnoses.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertDiseaseAlert = z.infer<typeof insertDiseaseAlertSchema>;
export type DiseaseAlert = typeof diseaseAlerts.$inferSelect;
export type InsertAgriStore = z.infer<typeof insertAgriStoreSchema>;
export type AgriStore = typeof agriStores.$inferSelect;

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
