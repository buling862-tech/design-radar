import { supabase } from './supabase'

export interface WeeklyNewsletter {
  weekId: string
  week: number
  year: number
  startDate: string
  endDate: string
  designTrendArticles: Array<{
    id: string
    title: string
    description: string
    image_url: string
    focus_points: string[]
    tags: string[]
  }>
  competitorArticles: Array<{
    id: string
    title: string
    description: string
    image_url: string
    inspiration_points: string[]
    source: string
    tags: string[]
  }>
  generatedAt: string
}

/**
 * 获取指定周的周刊信息
 */
export async function getWeeklyNewsletter(
  year: number,
  week: number
): Promise<WeeklyNewsletter | null> {
  try {
    // 1. 获取周信息
    const { data: weekData, error: weekError } = await supabase
      .from('weeks')
      .select('id, week, year, start_date, end_date')
      .eq('year', year)
      .eq('week', week)
      .single()

    if (weekError || !weekData) {
      console.error(`周 ${year}-${week} 不存在`)
      return null
    }

    // 2. 获取该周的设计趋势文章（6篇）
    const { data: designTrends, error: trendsError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        description,
        image_url,
        focus_points,
        article_tags (
          tags (name)
        )
      `)
      .eq('is_design_trend', true)
      .eq('status', 'published')
      .gte('published_date', weekData.start_date)
      .lte('published_date', weekData.end_date)
      .order('published_date', { ascending: false })
      .limit(6)

    // 3. 获取该周的竞品追踪文章（6篇）
    const { data: competitors, error: competitorError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        description,
        image_url,
        inspiration_points,
        source,
        article_tags (
          tags (name)
        )
      `)
      .eq('is_competitor_tracking', true)
      .eq('status', 'published')
      .gte('published_date', weekData.start_date)
      .lte('published_date', weekData.end_date)
      .order('published_date', { ascending: false })
      .limit(6)

    if (trendsError || competitorError) {
      console.error('获取文章失败:', trendsError || competitorError)
    }

    // 4. 格式化数据
    const designTrendArticles = (designTrends || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      image_url: article.image_url,
      focus_points: article.focus_points || [],
      tags: article.article_tags?.map((at: any) => at.tags.name) || [],
    }))

    const competitorArticles = (competitors || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      image_url: article.image_url,
      inspiration_points: article.inspiration_points || [],
      source: article.source,
      tags: article.article_tags?.map((at: any) => at.tags.name) || [],
    }))

    return {
      weekId: weekData.id,
      week: weekData.week,
      year: weekData.year,
      startDate: weekData.start_date,
      endDate: weekData.end_date,
      designTrendArticles,
      competitorArticles,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('生成周刊失败:', error)
    return null
  }
}

/**
 * 获取当前周的周刊
 */
export async function getCurrentWeekNewsletter(): Promise<WeeklyNewsletter | null> {
  const now = new Date()
  const year = now.getFullYear()

  // ISO 8601 周计算
  const firstDay = new Date(year, 0, 1)
  const dayOffset = firstDay.getDay()
  const adjustedStart = new Date(firstDay)

  if (dayOffset > 1) {
    adjustedStart.setDate(firstDay.getDate() + (8 - dayOffset))
  }

  const weekStart = new Date(adjustedStart)
  const diffTime = Math.abs(now.getTime() - weekStart.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const week = Math.floor(diffDays / 7) + 1

  return getWeeklyNewsletter(year, Math.min(week, 52))
}

/**
 * 获取最近的N个周刊（用于存档页面）
 */
export async function getRecentNewsletters(count: number = 5) {
  try {
    const { data: weeks, error } = await supabase
      .from('weeks')
      .select('id, week, year, start_date, end_date')
      .order('year', { ascending: false })
      .order('week', { ascending: false })
      .limit(count)

    if (error || !weeks) {
      return []
    }

    const newsletters = []

    for (const week of weeks) {
      const newsletter = await getWeeklyNewsletter(week.year, week.week)
      if (newsletter) {
        newsletters.push(newsletter)
      }
    }

    return newsletters
  } catch (error) {
    console.error('获取最近周刊失败:', error)
    return []
  }
}

/**
 * 获取周刊统计信息
 */
export async function getNewsletterStats(year: number, week: number) {
  try {
    const { data: weekData } = await supabase
      .from('weeks')
      .select('id, start_date, end_date')
      .eq('year', year)
      .eq('week', week)
      .single()

    if (!weekData) return null

    // 统计该周所有文章
    const { count: totalArticles } = await supabase
      .from('articles')
      .select('id', { count: 'exact' })
      .eq('status', 'published')
      .gte('published_date', weekData.start_date)
      .lte('published_date', weekData.end_date)

    // 统计设计趋势
    const { count: trendCount } = await supabase
      .from('articles')
      .select('id', { count: 'exact' })
      .eq('is_design_trend', true)
      .eq('status', 'published')
      .gte('published_date', weekData.start_date)
      .lte('published_date', weekData.end_date)

    // 统计竞品追踪
    const { count: competitorCount } = await supabase
      .from('articles')
      .select('id', { count: 'exact' })
      .eq('is_competitor_tracking', true)
      .eq('status', 'published')
      .gte('published_date', weekData.start_date)
      .lte('published_date', weekData.end_date)

    // 统计总点赞
    const { data: likes } = await supabase
      .from('likes')
      .select('id')
      .in(
        'article_id',
        (
          await supabase
            .from('articles')
            .select('id')
            .eq('status', 'published')
            .gte('published_date', weekData.start_date)
            .lte('published_date', weekData.end_date)
        ).data?.map((a) => a.id) || []
      )

    return {
      totalArticles,
      trendCount,
      competitorCount,
      totalLikes: likes?.length || 0,
    }
  } catch (error) {
    console.error('获取周刊统计失败:', error)
    return null
  }
}

/**
 * 检查该周是否有足够的内容生成周刊
 */
export async function canGenerateNewsletter(
  year: number,
  week: number,
  minArticles: number = 3
): Promise<boolean> {
  try {
    const newsletter = await getWeeklyNewsletter(year, week)
    if (!newsletter) return false

    const totalArticles =
      newsletter.designTrendArticles.length +
      newsletter.competitorArticles.length

    return totalArticles >= minArticles
  } catch (error) {
    console.error('检查周刊条件失败:', error)
    return false
  }
}

/**
 * 创建周刊记录（未来用于跟踪已发布周刊）
 */
export async function createNewsletterRecord(
  year: number,
  week: number,
  status: 'draft' | 'published' = 'published'
) {
  try {
    // 如果需要跟踪已发布周刊，可以在这里创建记录
    // 例如在 newsletters 表中
    const newsletter = await getWeeklyNewsletter(year, week)
    if (!newsletter) return null

    return {
      year,
      week,
      totalArticles:
        newsletter.designTrendArticles.length +
        newsletter.competitorArticles.length,
      trendArticles: newsletter.designTrendArticles.length,
      competitorArticles: newsletter.competitorArticles.length,
      status,
      publishedAt: new Date(),
    }
  } catch (error) {
    console.error('创建周刊记录失败:', error)
    return null
  }
}
