
// These are the types for our app's state
export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD format
  amount: number;
  merchant: string;
  item: string;
  note?: string;
  category_id: string;
  created_at: string;
}

export interface JoinedExpense extends Expense {
  category: Category;
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
      categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          date: string
          id: string
          item: string
          merchant: string
          note: string | null
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          date: string
          id?: string
          item: string
          merchant: string
          note?: string | null
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          date?: string
          id?: string
          item?: string
          merchant?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
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
