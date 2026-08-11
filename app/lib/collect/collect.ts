/**
 * Design Radar Content Collector
 * 主收集脚本 - 从多个源自动采集设计资讯
 */

import { supabase } from '../supabase'
import * as Figma from './parsers/figma'
import * as Google from './parsers/google'
import * as Apple from './parsers/apple'
import * as Dezeen from './parsers/dezeen'

interface Source {
  id: number
  name: string
  parser: any
  priority: number
  enabled: boolean
}

const SOURCES: Source[] = [
  { id: 1, name: 'Figma Blog', parser: Figma, priority: 5, enabled: true },
  { id: 2, name: 'Google Design', parser: Google, priority: 5, enabled: true },
  { id: 3, name: 'Apple Developer', parser: Apple, priority: 5, enabled: true },
  { id: 6, name: 'Dezeen', parser: Dezeen, priority: 4, enabled: true }
]

// 主收集流程
async function collectFromAllSources() {
  console.log('🚀 开始收集设计资讯...')
  console.log(`⏰ 时间: ${new Date().toISOString()}`)

  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    duplicates: 0,
    saved: 0
  }

  const sortedSources = SOURCES.filter(s => s.enabled).sort((a, b) => b.priority - a.priority)

  for (const source of sortedSources) {
    try {
      console.log(`\n📰 采集: ${source.name}`)
      const articles = await source.parser.fetch()
      stats.total += articles.length
      console.log(`   ✅ 获取 ${articles.length} 篇文章`)

      for (const article of articles) {
        try {
          const isDuplicate = await checkDuplicate(article.url)
          if (isDuplicate) {
            stats.duplicates++
            continue
          }

          const markdown = generateMarkdown(article)
          const quality_score = calculateQualityScore(article)
          const tag_predictions = await predictTags(article.title, article.content)

          const result = await saveToDatabase({
            source_id: source.id,
            source_name: source.name,
            ...article,
            markdown,
            quality_score,
            tag_predictions
          })

          if (result) {
            stats.saved++
            stats.success++
          }
        } catch (error) {
          stats.failed++
        }
      }

      await updateSourceLastFetch(source.id)
    } catch (error) {
      console.error(`❌ ${source.name} 采集失败`)
      stats.failed++
    }
  }

  console.log('\n📊 采集统计:')
  console.log(`   总计: ${stats.total}`)
  console.log(`   成功: ${stats.success}`)
  console.log(`   重复: ${stats.duplicates}`)
  console.log(`   保存: ${stats.saved}`)
}

async function checkDuplicate(url: string): Promise<boolean> {
  const { data } = await supabase
    .from('raw_articles')
    .select('id')
    .eq('url', url)
    .limit(1)
  return data && data.length > 0
}

function generateMarkdown(article: any): string {
  const lines = [
    `# ${article.title}`,
    '',
    `> 来源: [${article.source_name}](${article.url})`,
    ''
  ]

  if (article.image) {
    lines.push(`![${article.title}](${article.image})`)
    lines.push('')
  }

  lines.push(article.content)
  lines.push('')
  lines.push(`[阅读原文](${article.url})`)

  return lines.join('\n')
}

function calculateQualityScore(article: any): number {
  let score = 0.3

  if (article.title.length > 30) score += 0.15
  else if (article.title.length > 20) score += 0.1

  const contentLength = article.content.length
  if (contentLength > 2000) score += 0.3
  else if (contentLength > 1000) score += 0.2
  else if (contentLength > 500) score += 0.1

  if (article.image) score += 0.2

  return Math.min(score, 1)
}

async function predictTags(title: string, content: string): Promise<string[]> {
  const tags: string[] = []
  const keywordMap: Record<string, string[]> = {
    'AI': ['AI', 'artificial intelligence', 'machine learning'],
    'UI': ['UI', 'interface', 'component'],
    'UX': ['UX', 'user experience', 'research'],
    '动效': ['animation', 'motion', 'transition'],
    '深色模式': ['dark mode', 'dark', 'theme']
  }

  const fullText = (title + ' ' + content).toLowerCase()
  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => fullText.includes(kw.toLowerCase()))) {
      tags.push(tag)
    }
  }

  return tags.slice(0, 5)
}

async function saveToDatabase(article: any): Promise<boolean> {
  const { error } = await supabase.from('raw_articles').insert([
    {
      source_id: article.source_id,
      source_name: article.source_name,
      title: article.title,
      url: article.url,
      content: article.content,
      image: article.image,
      description: article.markdown,
      quality_score: article.quality_score,
      tag_predictions: article.tag_predictions,
      status: 'pending',
      fetched_date: new Date().toISOString()
    }
  ])

  return !error
}

async function updateSourceLastFetch(sourceId: number): Promise<void> {
  await supabase
    .from('content_sources')
    .update({ last_fetched: new Date().toISOString() })
    .eq('id', sourceId)
}

if (require.main === module) {
  collectFromAllSources()
    .then(() => { console.log('\n✅ 收集完成'); process.exit(0) })
    .catch(error => { console.error('\n❌ 失败:', error); process.exit(1) })
}

export { collectFromAllSources }
