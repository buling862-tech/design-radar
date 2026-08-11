import { supabase } from './supabase'

// ==================== Articles ====================

export interface Article {
  id?: string
  title: string
  summary?: string
  content?: string
  type?: string
  brand?: string
  category?: string
  publish_date?: string
  source?: string
  source_url?: string
  image?: string
  created_at?: string
  updated_at?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  views_count?: number
  likes_count?: number
  author_id?: string
}

export async function getArticles(
  filters: {
    status?: string
    category?: string
    type?: string
    limit?: number
    offset?: number
    sort?: 'newest' | 'trending' | 'popular'
  } = {}
) {
  let query = supabase
    .from('articles')
    .select('*, article_tags(tag_id)')

  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'published')
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  // 排序
  if (filters.sort === 'trending') {
    query = query.order('likes_count', { ascending: false })
  } else if (filters.sort === 'popular') {
    query = query.order('views_count', { ascending: false })
  } else {
    query = query.order('publish_date', { ascending: false })
  }

  // 分页
  const limit = filters.limit || 10
  const offset = filters.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  return { data, error, count }
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, article_tags(tag_id)')
    .eq('id', id)
    .single()

  if (data) {
    // 增加浏览次数
    await incrementArticleViews(id)
  }

  return { data, error }
}

export async function createArticle(article: Article) {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single()

  return { data, error }
}

export async function updateArticle(id: string, updates: Partial<Article>) {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  return { error }
}

export async function incrementArticleViews(id: string) {
  const { error } = await supabase.rpc('increment_views', {
    article_id: id,
  })
  return { error }
}

// ==================== Tags ====================

export interface Tag {
  id?: string
  name: string
  slug?: string
  description?: string
  created_at?: string
}

export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  return { data, error }
}

export async function getArticlesByTag(slug: string) {
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', slug)
    .single()

  if (tagError) return { data: null, error: tagError }

  const { data, error } = await supabase
    .from('article_tags')
    .select('articles(*)')
    .eq('tag_id', tag.id)

  return { data, error }
}

export async function createTag(tag: Tag) {
  const { data, error } = await supabase
    .from('tags')
    .insert([tag])
    .select()
    .single()

  return { data, error }
}

// ==================== Categories ====================

export interface Category {
  id?: string
  name: string
  slug?: string
  description?: string
  color?: string
  icon?: string
  order_index?: number
  created_at?: string
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true })

  return { data, error }
}

export async function createCategory(category: Category) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()

  return { data, error }
}

// ==================== Brands ====================

export interface Brand {
  id?: string
  name: string
  description?: string
  logo_url?: string
  website_url?: string
  created_at?: string
}

export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true })

  return { data, error }
}

// ==================== Comments ====================

export interface Comment {
  id?: string
  article_id: string
  user_id?: string
  content: string
  status?: 'pending' | 'approved' | 'rejected'
  created_at?: string
  updated_at?: string
}

export async function getArticleComments(
  articleId: string,
  approved = true
) {
  let query = supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)

  if (approved) {
    query = query.eq('status', 'approved')
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  return { data, error }
}

export async function createComment(comment: Comment) {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single()

  return { data, error }
}

// ==================== Likes ====================

export async function likeArticle(articleId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .insert([{ article_id: articleId, user_id: userId }])
    .select()
    .single()

  if (!error) {
    await supabase.rpc('increment_likes', { article_id: articleId })
  }

  return { data, error }
}

export async function unlikeArticle(articleId: string, userId: string) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('article_id', articleId)
    .eq('user_id', userId)

  if (!error) {
    await supabase.rpc('decrement_likes', { article_id: articleId })
  }

  return { error }
}

export async function getArticleLikeCount(articleId: string) {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  return { count, error }
}

// ==================== Bookmarks ====================

export async function bookmarkArticle(articleId: string, userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([{ article_id: articleId, user_id: userId }])
    .select()
    .single()

  return { data, error }
}

export async function removeBookmark(articleId: string, userId: string) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('article_id', articleId)
    .eq('user_id', userId)

  return { error }
}

export async function getUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('articles(*)')
    .eq('user_id', userId)

  return { data, error }
}

// ==================== Search ====================

export async function searchArticles(query: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .textSearch('title', query, {
      config: 'english',
    })
    .eq('status', 'published')
    .limit(20)

  return { data, error }
}
