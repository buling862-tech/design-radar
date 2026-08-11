import { NextRequest, NextResponse } from 'next/server'
import { collectAndAnalyze, RawContent } from '@/app/lib/content-collector'

/**
 * 采集和分析单条内容
 * POST /api/collect
 * body: { source, title, url, content, image?, publishedAt? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, title, url, content, image, publishedAt } = body

    // 验证必填字段
    if (!source || !title || !url || !content) {
      return NextResponse.json(
        { error: '缺少必填字段: source, title, url, content' },
        { status: 400 }
      )
    }

    const rawContent: RawContent = {
      source,
      title,
      url,
      content,
      image,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    }

    // 采集和分析
    const result = await collectAndAnalyze(rawContent)

    if (!result) {
      return NextResponse.json(
        { error: '处理失败，请检查内容格式' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '内容已成功采集并分析',
      data: result,
    })
  } catch (error) {
    console.error('采集 API 错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

/**
 * 采集和分析多条内容
 * POST /api/collect?batch=true
 * body: { contents: RawContent[] }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contents } = body

    if (!Array.isArray(contents)) {
      return NextResponse.json(
        { error: 'contents 必须是数组' },
        { status: 400 }
      )
    }

    const results = []
    for (const rawContent of contents) {
      if (!rawContent.source || !rawContent.title || !rawContent.url || !rawContent.content) {
        console.warn('跳过无效内容:', rawContent)
        continue
      }

      const result = await collectAndAnalyze(rawContent)
      if (result) {
        results.push(result)
      }
    }

    return NextResponse.json({
      success: true,
      message: `成功处理 ${results.length} 条内容`,
      data: results,
    })
  } catch (error) {
    console.error('批量采集 API 错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
