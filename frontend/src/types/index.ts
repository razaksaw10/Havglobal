export interface SpecItem {
  label: string;
  value: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon?: string;
  description?: string;
  orderIndex?: number;
  productsCount?: number;
  _count?: { products: number };
  createdAt?: string;
}

export interface Product {
  id: number;
  name: string;
  categorySlug: string;
  category_slug?: string;
  description?: string;
  price: number;
  currency: string;
  minOrderQty: number;
  min_order_qty?: number;
  specs?: SpecItem[];
  specsJson?: string;
  specs_json?: string;
  imageUrl: string;
  image_url?: string;
  stock: number;
  isFeatured: boolean;
  is_featured?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  category?: {
    id?: number;
    name: string;
    slug?: string;
    icon?: string;
  };
  category_name?: string;
  category_icon?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject: string;
  categorySlug?: string;
  category_slug?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  notes?: string;
  createdAt: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  category?: {
    name: string;
    icon: string;
  };
}

export interface DashboardStats {
  kpis: {
    totalProducts: number;
    totalCategories: number;
    totalInquiries: number;
    newInquiries: number;
    inProgressInquiries: number;
    resolvedInquiries: number;
  };
  categoryDistribution: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    count: number;
  }[];
  recentInquiries: Inquiry[];
  recentProducts: Product[];
  recentActivities: {
    id: number;
    action: string;
    details?: string;
    ipAddress?: string;
    createdAt: string;
    admin?: {
      name: string;
      email: string;
    };
  }[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
  error?: string;
}
