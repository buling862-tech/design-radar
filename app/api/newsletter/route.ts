import { NextRequest, NextResponse } from 'next/server'
import { getWeeklyNewsletter, getCurrentWeekNewsletter, getRecentNewsletters } from '@/app/lib/newsletter-generator'

/**
 * GET /api/newsletter
 * - ?week=31&year=2026 - 获取指定周的周刊
 * - ?current=true - 获取当前周的周刊
 * - ?recent=5 - 获取最近5个周刊
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const week = searchParams.get('week')
    const year = searchParams.get('year')
    const current = searchParams.get('current')
    const recent = searchParams.get('recent')

    // 情况 1: 获取当前周
    if (current === 'true') {
      const newsletter = await getCurrentWeekNewsletter()
      if (!newsletter) {
        return NextResponse.json(
          { error: '无法生成当前周的周刊' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: newsletter,
      })
    }

    // 情况 2: 获取最近N个周刊
    if (recent) {
      const count = parseInt(recent) || 5
      const newsletters = await getRecentNewsletters(count)

      return NextResponse.json({
        success: true,
        data: newsletters,
      })
    }

    // 情况 3: 获取指定周的周刊
    if (week && year) {
      const weekNum = parseInt(week)
      const yearNum = parseInt(year)

      if (isNaN(weekNum) || isNaN(yearNum)) {
        return NextResponse.json(
          { error: 'week 和 year 必须是数字' },
          { status: 400 }
        )
      }

      const newsletter = await getWeeklyNewsletter(yearNum, weekNum)
      if (!newsletter) {
        return NextResponse.json(
          { error: `周 ${yearNum}-${weekNum} 的数据不存在` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: newsletter,
      })
    }

    return NextResponse.json(
      { error: '缺少必需参数 (week&year 或 current=true 或 recent=N)' },
      { status: 400 }
    )
  } catch (error) {
    console.error('周刊 API 错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
