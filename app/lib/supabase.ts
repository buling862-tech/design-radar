import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          type: string | null
          brand: string | null
          category: string | null
          publish_date: string | null
          source: string | null
          source_url: string | null
          image: string | null
          created_at: string
          updated_at: string
          featured: boolean
          status: 'draft' | 'published' | 'archived'
          views_count: number
          likes_count: number
          author_id: string | null
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          content?: string | null
          type?: string | null
          brand?: string | null
          category?: string | null
          publish_date?: string | null
          source?: string | null
          source_url?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          status?: 'draft' | 'published' | 'archived'
          views_count?: number
          likes_count?: number
          author_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          content?: string | null
          type?: string | null
          brand?: string | null
          category?: string | null
          publish_date?: string | null
          source?: string | null
          source_url?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          status?: 'draft' | 'published' | 'archived'
          views_count?: number
          likes_count?: number
          author_id?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string | null
          icon: string | null
          order_index: number
          created_at: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          created_at: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
      }
      comments: {
        Row: {
          id: string
          article_id: string
          user_id: string | null
          content: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
      }
      likes: {
        Row: {
          id: string
          article_id: string
          user_id: string | null
          created_at: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          article_id: string
          user_id: string | null
          created_at: string
        }
      }
    }
  }
}
