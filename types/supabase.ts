export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      aisle: {
        Row: {
          department: number
          id: number
          name: string
          slug: string | null
          value: number
        }
        Insert: {
          department: number
          id?: number
          name: string
          slug?: string | null
          value: number
        }
        Update: {
          department?: number
          id?: number
          name?: string
          slug?: string | null
          value?: number
        }
      }
      department: {
        Row: {
          id: number
          name: string
          slug: string
          value: number
        }
        Insert: {
          id?: number
          name: string
          slug: string
          value: number
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          value?: number
        }
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          order_id: number | null
          price: number | null
          quantity: number | null
          sku: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_id?: number | null
          price?: number | null
          quantity?: number | null
          sku?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          order_id?: number | null
          price?: number | null
          quantity?: number | null
          sku?: number | null
        }
      }
      orders: {
        Row: {
          address: string | null
          created_at: string | null
          id: number
          payment_id: string | null
          price: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: number
          payment_id?: string | null
          price?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: number
          payment_id?: string | null
          price?: number | null
          status?: string | null
          user_id?: string | null
        }
      }
      products: {
        Row: {
          aisle: number | null
          alcohol: number | null
          allergens: string[] | null
          availability_status: string | null
          average_weight_per_unit: number | null
          brand: string | null
          breadcrumb: Json | null
          claims: string[] | null
          contents: string[] | null
          created_at: string | null
          department: number | null
          description: string | null
          endorsements: string[] | null
          generic_name: string | null
          health_star_rating: number | null
          id: number
          images: Json[] | null
          ingredients: Json | null
          name: string | null
          nutrition: Json[] | null
          original_images: Json[] | null
          origins: string[] | null
          price: Json | null
          product_stores_stock_level: string | null
          product_tags: string[] | null
          quantity: Json | null
          selected_purchasing_unit: string | null
          shelf: number | null
          size: Json | null
          sku: number
          supports_both_each_and_kg_pricing: boolean | null
          unit: string | null
          variety: string | null
          warnings: string[] | null
        }
        Insert: {
          aisle?: number | null
          alcohol?: number | null
          allergens?: string[] | null
          availability_status?: string | null
          average_weight_per_unit?: number | null
          brand?: string | null
          breadcrumb?: Json | null
          claims?: string[] | null
          contents?: string[] | null
          created_at?: string | null
          department?: number | null
          description?: string | null
          endorsements?: string[] | null
          generic_name?: string | null
          health_star_rating?: number | null
          id?: number
          images?: Json[] | null
          ingredients?: Json | null
          name?: string | null
          nutrition?: Json[] | null
          original_images?: Json[] | null
          origins?: string[] | null
          price?: Json | null
          product_stores_stock_level?: string | null
          product_tags?: string[] | null
          quantity?: Json | null
          selected_purchasing_unit?: string | null
          shelf?: number | null
          size?: Json | null
          sku: number
          supports_both_each_and_kg_pricing?: boolean | null
          unit?: string | null
          variety?: string | null
          warnings?: string[] | null
        }
        Update: {
          aisle?: number | null
          alcohol?: number | null
          allergens?: string[] | null
          availability_status?: string | null
          average_weight_per_unit?: number | null
          brand?: string | null
          breadcrumb?: Json | null
          claims?: string[] | null
          contents?: string[] | null
          created_at?: string | null
          department?: number | null
          description?: string | null
          endorsements?: string[] | null
          generic_name?: string | null
          health_star_rating?: number | null
          id?: number
          images?: Json[] | null
          ingredients?: Json | null
          name?: string | null
          nutrition?: Json[] | null
          original_images?: Json[] | null
          origins?: string[] | null
          price?: Json | null
          product_stores_stock_level?: string | null
          product_tags?: string[] | null
          quantity?: Json | null
          selected_purchasing_unit?: string | null
          shelf?: number | null
          size?: Json | null
          sku?: number
          supports_both_each_and_kg_pricing?: boolean | null
          unit?: string | null
          variety?: string | null
          warnings?: string[] | null
        }
      }
      shelf: {
        Row: {
          aisle: number
          id: number
          name: string
          slug: string | null
          value: number
        }
        Insert: {
          aisle: number
          id?: number
          name: string
          slug?: string | null
          value: number
        }
        Update: {
          aisle?: number
          id?: number
          name?: string
          slug?: string | null
          value?: number
        }
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: number
          user_id?: string | null
        }
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string
          city: string
          created_at: string | null
          id: number
          post_code: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2: string
          city: string
          created_at?: string | null
          id?: number
          post_code: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string
          city?: string
          created_at?: string | null
          id?: number
          post_code?: string
          user_id?: string
        }
      }
      users: {
        Row: {
          address: string | null
          cart_session: Json[] | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          newsletter: boolean | null
          phone_number: string | null
          selected_user_address: number | null
        }
        Insert: {
          address?: string | null
          cart_session?: Json[] | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          newsletter?: boolean | null
          phone_number?: string | null
          selected_user_address?: number | null
        }
        Update: {
          address?: string | null
          cart_session?: Json[] | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          newsletter?: boolean | null
          phone_number?: string | null
          selected_user_address?: number | null
        }
      }
    }
    Views: {
      get_random_picks: {
        Row: {
          aisle: number | null
          alcohol: number | null
          allergens: string[] | null
          availability_status: string | null
          average_weight_per_unit: number | null
          brand: string | null
          breadcrumb: Json | null
          claims: string[] | null
          contents: string[] | null
          created_at: string | null
          department: number | null
          description: string | null
          endorsements: string[] | null
          generic_name: string | null
          health_star_rating: number | null
          id: number | null
          images: Json[] | null
          ingredients: Json | null
          name: string | null
          nutrition: Json[] | null
          original_images: Json[] | null
          origins: string[] | null
          price: Json | null
          product_stores_stock_level: string | null
          product_tags: string[] | null
          quantity: Json | null
          selected_purchasing_unit: string | null
          shelf: number | null
          size: Json | null
          sku: number | null
          supports_both_each_and_kg_pricing: boolean | null
          unit: string | null
          variety: string | null
          warnings: string[] | null
        }
      }
      get_specials: {
        Row: {
          aisle: number | null
          alcohol: number | null
          allergens: string[] | null
          availability_status: string | null
          average_weight_per_unit: number | null
          brand: string | null
          breadcrumb: Json | null
          claims: string[] | null
          contents: string[] | null
          created_at: string | null
          department: number | null
          description: string | null
          endorsements: string[] | null
          generic_name: string | null
          health_star_rating: number | null
          id: number | null
          images: Json[] | null
          ingredients: Json | null
          name: string | null
          nutrition: Json[] | null
          original_images: Json[] | null
          origins: string[] | null
          price: Json | null
          product_stores_stock_level: string | null
          product_tags: string[] | null
          quantity: Json | null
          selected_purchasing_unit: string | null
          shelf: number | null
          size: Json | null
          sku: number | null
          supports_both_each_and_kg_pricing: boolean | null
          unit: string | null
          variety: string | null
          warnings: string[] | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
