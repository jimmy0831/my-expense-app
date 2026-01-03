
// These are the types for our app's state
export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  user_id: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD format
  amount: number;
  merchant: string | null;
  item: string | null;
  note?: string;
  category_id: string | null;
  created_at: string;
  user_id: string;
}

export interface JoinedExpense extends Expense {
  category: Category;
}

export interface PublicUser {
  id: string;
  created_at: string;
  email: string;
}

// This is the auto-generated type from Supabase, useful for client type safety
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      custom_users: {
        Row: {
          id: string
          email: string
          password?: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          updated_at: string
          app_name: string | null
        }
        Insert: {
          id: string
          user_id: string
          updated_at?: string
          app_name?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          updated_at?: string
          app_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          color: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          color: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          color?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          amount: number
          merchant: string | null
          item: string | null
          note: string | null
          category_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          amount: number
          merchant?: string | null
          item?: string | null
          note?: string | null
          category_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          amount?: number
          merchant?: string | null
          item?: string | null
          note?: string | null
          category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
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
