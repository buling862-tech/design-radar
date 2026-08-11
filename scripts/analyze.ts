/**
 * 分析脚本 - 通过 Claude AI 分析采集的内容
 * 执行: pnpm run analyze
 */

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AnalyzedArticle {
  title: string
  summary: string
  focus: string[]
  inspiration: string[]
  tags: string[]
  category: 'design_trends' | 'competitor_tracking' | 'general'
  isDesignTrend: boolean
  isCompetitorTracking: boolean
}

async function analyzeContent(content: string): Promise<AnalyzedArticle | null> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `你是资深设计研究员。分析下面资讯并输出 JSON:

{
  "title": "标题",
  "summary": "一句话概括",
  "focus": ["关注点1", "关注点2", "关注点3"],
  "inspiration": ["启发1", "启发2", "启发3"],
  "tags": ["标签1", "标签2", "标签3"],
  "category": "design_trends"
}

资讯内容:
${content}`,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      console.warn('⚠️ 无法解析 JSON')
      return null
    }

    const analyzed = JSON.parse(jsonMatch[0])

    return {
      title: analyzed.title || '',
      summary: analyzed.summary || '',
      focus: analyzed.focus || [],
      inspiration: analyzed.inspiration || [],
      tags: analyzed.tags || [],
      category: analyzed.category || 'general',
      isDesignTrend:
        analyzed.category === 'design_trends' ||
        (analyzed.tags || []).some((tag: string) =>
          ['AI', '趋势', '创新'].includes(tag)
        ),
      isCompetitorTracking:
        analyzed.category === 'competitor_tracking' ||
        (analyzed.tags || []).some((tag: string) =>
          ['Figma', 'Adobe', '竞品'].includes(tag)
        ),
    }
  } catch (error) {
    console.error('❌ 分析错误:', error)
    return null
  }
}

async function main() {
  console.log('🔍 开始 AI 分析内容...\n')

  const logsDir = path.join(process.cwd(), 'logs')
  const inputFile = path.join(logsDir, 'collected-content.json')

  if (!fs.existsSync(inputFile)) {
    console.error('❌ 找不到采集文件，请先运行 collect 脚本')
    process.exit(1)
  }

  const collectedContent = JSON.parse(fs.readFileSync(inputFile, 'utf-8'))

  console.log(`📄 待分析: ${collectedContent.length} 篇\n`)

  const analyzedContent = []

  for (const [idx, article] of collectedContent.entries()) {
    console.log(`[${idx + 1}/${collectedContent.length}] 分析: ${article.title}`)

    const analyzed = await analyzeContent(
      `标题: ${article.title}\n内容: ${article.content}`
    )

    if (analyzed) {
      analyzedContent.push({
        source: article.source,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        ...analyzed,
      })
      console.log(`  ✅ 完成`)
    } else {
      console.log(`  ⚠️ 跳过`)
    }

    // 避免 API 调用过于频繁
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const outputFile = path.join(logsDir, 'analyzed-content.json')
  fs.writeFileSync(outputFile, JSON.stringify(analyzedContent, null, 2))

  console.log(`\n✅ 分析完成: ${analyzedContent.length} 篇`)
  console.log(`💾 已保存到: ${outputFile}`)

  return analyzedContent
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  })
}

export { main as analyzeContent }
