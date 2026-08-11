import { supabase } from './supabase'

export interface Week {
  id?: string
  week: number
  year: number
  start_date: string
  end_date: string
  created_at?: string
  updated_at?: string
}

// ==================== Weeks 操作函数 ====================

/**
 * 获取特定周的信息
 */
export async function getWeekInfo(week: number, year: number) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('week', week)
    .eq('year', year)
    .single()

  return { data, error }
}

/**
 * 获取包含特定日期的周
 */
export async function getWeekByDate(date: string) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .lte('start_date', date)
    .gte('end_date', date)
    .single()

  return { data, error }
}

/**
 * 获取特定年份的所有周
 */
export async function getYearWeeks(year: number) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('year', year)
    .order('week', { ascending: true })

  return { data, error }
}

/**
 * 获取当前周
 */
export async function getCurrentWeek() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .lte('start_date', today)
    .gte('end_date', today)
    .single()

  return { data, error }
}

/**
 * 创建单个周记录
 */
export async function createWeek(
  week: number,
  year: number,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('weeks')
    .insert([{ week, year, start_date: startDate, end_date: endDate }])
    .select()
    .single()

  return { data, error }
}

/**
 * 批量创建年度周数据
 */
export async function createYearWeeks(year: number) {
  const weeks = calculateWeeksForYear(year)

  const { data, error } = await supabase
    .from('weeks')
    .insert(
      weeks.map(w => ({
        week: w.week,
        year: w.year,
        start_date: w.startDate,
        end_date: w.endDate
      }))
    )
    .select()

  return { data, error }
}

/**
 * 计算一年中所有周的日期（ISO 8601 标准）
 */
export function calculateWeeksForYear(year: number) {
  const weeks = []

  // ISO 8601：第 1 周是包含该年第一个周四的周
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay()
  const firstMonday = new Date(year, 0, 4 - dayOfWeek + 1)

  for (let week = 1; week <= 52; week++) {
    const startDate = new Date(firstMonday)
    startDate.setDate(firstMonday.getDate() + (week - 1) * 7)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    weeks.push({
      week,
      year,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    })
  }

  return weeks
}

/**
 * 获取 ISO 周数
 */
export function getISOWeek(date: Date = new Date()): number {
  const dateCopy = new Date(date)
  dateCopy.setHours(0, 0, 0, 0)
  dateCopy.setDate(dateCopy.getDate() + 3 - (dateCopy.getDay() + 6) % 7)
  const week1 = new Date(dateCopy.getFullYear(), 0, 4)
  week1.setDate(week1.getDate() - (week1.getDay() + 6) % 7)
  return Math.round((dateCopy.getTime() - week1.getTime()) / 86400000 / 7) + 1
}

/**
 * 获取某周的所有文章
 */
export async function getWeekArticles(weekId: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('week_id', weekId)
    .eq('status', 'published')
    .order('publish_date', { ascending: false })

  return { data, error }
}

/**
 * 获取周刊及其文章
 */
export async function getWeeklyNewsletter(week: number, year: number) {
  // 获取周信息
  const { data: weekData, error: weekError } = await getWeekInfo(week, year)
  if (weekError) return { error: weekError }

  // 获取该周的文章
  const { data: articles } = await getWeekArticles(weekData.id)

  return { week: weekData, articles }
}

/**
 * 初始化年份周数据
 */
export async function initializeYearWeeks(year: number) {
  // 检查该年是否已有周数据
  const { data: existing } = await supabase
    .from('weeks')
    .select('id')
    .eq('year', year)
    .limit(1)

  if (existing && existing.length > 0) {
    return { message: `Year ${year} weeks already initialized` }
  }

  // 创建年度周数据
  return await createYearWeeks(year)
}
