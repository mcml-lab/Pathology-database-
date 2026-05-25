import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  datetime,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for lab operations.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "technician", "receptionist", "doctor", "user"]).default("user").notNull(),
  department: varchar("department", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patient table with comprehensive demographic and medical information
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  patientId: varchar("patientId", { length: 50 }).notNull().unique(), // Custom patient ID
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  dateOfBirth: datetime("dateOfBirth").notNull(),
  gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(),
  bloodGroup: varchar("bloodGroup", { length: 10 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  country: varchar("country", { length: 100 }),
  emergencyContact: varchar("emergencyContact", { length: 100 }),
  emergencyPhone: varchar("emergencyPhone", { length: 20 }),
  medicalHistory: text("medicalHistory"), // JSON stored as text
  allergies: text("allergies"), // JSON stored as text
  currentMedications: text("currentMedications"), // JSON stored as text
  referringDoctor: varchar("referringDoctor", { length: 100 }),
  insurance: varchar("insurance", { length: 100 }),
  insuranceId: varchar("insuranceId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Test catalog with test types, prices, and reference ranges
 */
export const testCatalog = mysqlTable("testCatalog", {
  id: int("id").autoincrement().primaryKey(),
  testCode: varchar("testCode", { length: 50 }).notNull().unique(),
  testName: varchar("testName", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., Blood, Urine, Imaging
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  sampleType: varchar("sampleType", { length: 100 }).notNull(), // e.g., Blood, Serum, Plasma
  sampleVolume: varchar("sampleVolume", { length: 50 }), // e.g., 5ml
  sampleRequirements: text("sampleRequirements"), // Special handling instructions
  turnaroundTime: varchar("turnaroundTime", { length: 50 }), // e.g., 24 hours
  referenceRange: text("referenceRange"), // JSON with min, max, unit
  method: varchar("method", { length: 200 }), // Testing method/equipment
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestCatalog = typeof testCatalog.$inferSelect;
export type InsertTestCatalog = typeof testCatalog.$inferInsert;

/**
 * Test bookings with sample tracking
 */
export const testBookings = mysqlTable("testBookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: varchar("bookingId", { length: 50 }).notNull().unique(), // Unique booking reference
  patientId: int("patientId").notNull(),
  testId: int("testId").notNull(),
  bookingDate: datetime("bookingDate").notNull(),
  sampleCollectionDate: datetime("sampleCollectionDate"),
  sampleId: varchar("sampleId", { length: 50 }), // Barcode/ID for specimen
  sampleStatus: mysqlEnum("sampleStatus", ["pending", "collected", "processing", "completed", "rejected"]).default("pending").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  bookedBy: int("bookedBy"), // User ID of receptionist
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestBooking = typeof testBookings.$inferSelect;
export type InsertTestBooking = typeof testBookings.$inferInsert;

/**
 * Test results with validation against reference ranges
 */
export const testResults = mysqlTable("testResults", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  testId: int("testId").notNull(),
  patientId: int("patientId").notNull(),
  resultValue: varchar("resultValue", { length: 500 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  referenceMin: varchar("referenceMin", { length: 50 }),
  referenceMax: varchar("referenceMax", { length: 50 }),
  status: mysqlEnum("status", ["normal", "abnormal", "critical"]).notNull(),
  notes: text("notes"),
  enteredBy: int("enteredBy").notNull(), // Technician user ID
  enteredAt: timestamp("enteredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = typeof testResults.$inferInsert;

/**
 * Lab reports with customizable templates
 */
export const labReports = mysqlTable("labReports", {
  id: int("id").autoincrement().primaryKey(),
  reportId: varchar("reportId", { length: 50 }).notNull().unique(),
  bookingId: int("bookingId").notNull(),
  patientId: int("patientId").notNull(),
  reportDate: datetime("reportDate").notNull(),
  status: mysqlEnum("status", ["draft", "pending_review", "approved", "delivered"]).default("draft").notNull(),
  template: varchar("template", { length: 100 }).default("standard"), // Template type
  pdfUrl: varchar("pdfUrl", { length: 500 }), // S3 storage URL
  pdfStoragePath: varchar("pdfStoragePath", { length: 500 }), // Organized path in S3
  reportContent: text("reportContent"), // JSON with structured report data
  approvedBy: int("approvedBy"), // Doctor/admin user ID
  approvedAt: timestamp("approvedAt"),
  deliveredAt: timestamp("deliveredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LabReport = typeof labReports.$inferSelect;
export type InsertLabReport = typeof labReports.$inferInsert;

/**
 * Billing and invoicing
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: varchar("invoiceId", { length: 50 }).notNull().unique(),
  patientId: int("patientId").notNull(),
  bookingIds: text("bookingIds"), // JSON array of booking IDs
  invoiceDate: datetime("invoiceDate").notNull(),
  dueDate: datetime("dueDate"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["draft", "issued", "paid", "overdue", "cancelled"]).default("draft").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentDate: datetime("paymentDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Email notifications log
 */
export const emailNotifications = mysqlTable("emailNotifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 200 }),
  notificationType: mysqlEnum("notificationType", ["report_ready", "urgent_test", "pending_sample", "payment_reminder", "appointment_reminder"]).notNull(),
  relatedId: int("relatedId"), // Patient ID, booking ID, or invoice ID
  subject: varchar("subject", { length: 300 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

/**
 * Document storage metadata
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  documentId: varchar("documentId", { length: 50 }).notNull().unique(),
  patientId: int("patientId").notNull(),
  documentType: mysqlEnum("documentType", ["report", "prescription", "medical_history", "insurance", "other"]).notNull(),
  fileName: varchar("fileName", { length: 300 }).notNull(),
  fileSize: varchar("fileSize", { length: 50 }),
  mimeType: varchar("mimeType", { length: 100 }),
  s3Key: varchar("s3Key", { length: 500 }).notNull(), // S3 storage key
  s3Url: varchar("s3Url", { length: 500 }).notNull(), // S3 access URL
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Report templates for customization
 */
export const reportTemplates = mysqlTable("reportTemplates", {
  id: int("id").autoincrement().primaryKey(),
  templateName: varchar("templateName", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., Blood, Imaging
  htmlContent: text("htmlContent").notNull(), // HTML template
  cssContent: text("cssContent"), // CSS styling
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReportTemplate = typeof reportTemplates.$inferSelect;
export type InsertReportTemplate = typeof reportTemplates.$inferInsert;
