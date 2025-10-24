// Tipos compartidos entre todos los microservicios

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== TENANT TYPES =====
export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

export enum TenantPlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  whatsappSession: string;
  status: TenantStatus;
  plan: TenantPlan;
  settings: TenantSettings;
  apiKey: string;
}

export interface TenantSettings {
  workingHoursStart: number;
  workingHoursEnd: number;
  slotDuration: number;
  advanceBookingDays: number;
  reminderHours: number;
  maxTurnsPerDay: number;
  notificationEnabled: boolean;
  autoConfirm: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  advancedAnalytics: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
}

// ===== USER TYPES =====
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  TENANT_USER = 'tenant_user',
  END_USER = 'end_user'
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

// ===== TURN TYPES =====
export enum TurnStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ServiceType {
  CONSULTATION = 'consultation',
  APPOINTMENT = 'appointment',
  EMERGENCY = 'emergency',
  FOLLOW_UP = 'follow_up'
}

export interface Turn extends BaseEntity {
  tenantId: string;
  userPhone: string;
  userName: string;
  serviceType: ServiceType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: TurnStatus;
  notes?: string;
  confirmedAt?: Date;
}

// ===== WHATSAPP TYPES =====
export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  chatId: string;
  body: string;
  from: string;
  to: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'file' | 'audio' | 'video';
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface WhatsAppSession {
  tenantId: string;
  sessionName: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'failed';
  qrCode?: string;
  lastActivity?: Date;
}

// ===== NOTIFICATION TYPES =====
export enum NotificationType {
  TURN_REMINDER = 'turn_reminder',
  TURN_CONFIRMATION = 'turn_confirmation',
  TURN_CANCELLATION = 'turn_cancellation',
  ADMIN_NOTIFICATION = 'admin_notification',
  SYSTEM_ALERT = 'system_alert'
}

export enum NotificationChannel {
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push'
}

export interface Notification extends BaseEntity {
  tenantId: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  message: string;
  scheduledFor?: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  metadata?: Record<string, any>;
}

// ===== API TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ===== AUTH TYPES =====
export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface LoginResponse {
  user: User;
  tenant?: Tenant;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  tenantName: string;
  tenantSlug?: string;
  plan?: TenantPlan;
}

// ===== ANALYTICS TYPES =====
export interface TurnAnalytics {
  tenantId: string;
  date: string;
  totalTurns: number;
  bookedTurns: number;
  confirmedTurns: number;
  completedTurns: number;
  cancelledTurns: number;
  confirmationRate: number;
  averageBookingTime: number;
  popularServices: Array<{
    service: ServiceType;
    count: number;
  }>;
}

export interface TenantMetrics {
  tenantId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalUsers: number;
  totalTurns: number;
  activeUsers: number;
  revenue?: number;
  growthRate: number;
}

// ===== CONFIGURATION TYPES =====
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface WhatsAppConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
}

export interface ServiceConfig {
  port: number;
  host: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

// ===== EVENT TYPES =====
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  tenantId: string;
  data: Record<string, any>;
  timestamp: Date;
  version: number;
}

export interface TurnCreatedEvent extends DomainEvent {
  type: 'TurnCreated';
  data: {
    turnId: string;
    tenantId: string;
    userPhone: string;
    serviceType: ServiceType;
    date: string;
    time: string;
  };
}

export interface TurnConfirmedEvent extends DomainEvent {
  type: 'TurnConfirmed';
  data: {
    turnId: string;
    tenantId: string;
    userPhone: string;
    confirmedAt: Date;
  };
}

// ===== UTILITY TYPES =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ===== VALIDATION TYPES =====
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ===== SEARCH TYPES =====
export interface SearchFilters {
  tenantId?: string;
  status?: TurnStatus;
  serviceType?: ServiceType;
  dateFrom?: string;
  dateTo?: string;
  userPhone?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchOptions {
  filters?: SearchFilters;
  sort?: SortOptions[];
  pagination?: {
    page: number;
    limit: number;
  };
}
