import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent, AnalyzedContent } from '@/app/lib/ai-analyzer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, title, url, source, image } = body

    if (!content) {
      return NextResponse.json(
        { error: '缺少 content 字段' },
        { status: 400 }
      )
    }

    // AI 分析
    const analyzed = await analyzeContent(content)

    if (!analyzed) {
      return NextResponse.json(
        { error: '分析失败' },
        { status: 500 }
      )
    }

    // 返回分析结果
    return NextResponse.json({
      success: true,
      data: {
        title: title || analyzed.title,
        summary: analyzed.summary,
        focus: analyzed.focus,
        inspiration: analyzed.inspiration,
        tags: analyzed.tags,
        category: analyzed.category,
        isDesignTrend: analyzed.isDesignTrend,
        isCompetitorTracking: analyzed.isCompetitorTracking,
      },
    })
  } catch (error) {
    console.error('分析 API 错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
