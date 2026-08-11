/**
 * 保存脚本 - 将分析后的内容保存到 Supabase 数据库
 * 执行: pnpm run save
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface AnalyzedArticle {
  source: string
  title: string
  summary: string
  url: string
  image?: string
  focus: string[]
  inspiration: string[]
  tags: string[]
  category: string
  isDesignTrend: boolean
  isCompetitorTracking: boolean
  publishedAt?: string
}

async function getOrCreateTag(name: string) {
  const { data: existing } = await supabase
    .from('tags')
    .select('id')
    .eq('name', name)
    .single()

  if (existing) return existing.id

  const { data: newTag } = await supabase
    .from('tags')
    .insert([{ name, slug: name.toLowerCase().replace(/\s+/g, '-') }])
    .select()
    .single()

  return newTag?.id
}

async function getCategoryId(categoryName: string) {
  const categoryMap: Record<string, string> = {
    design_trends: '设计趋势',
    competitor_tracking: '竞品追踪',
    general: '通用',
  }

  const name = categoryMap[categoryName] || '通用'

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .single()

  return category?.id
}

async function saveArticle(article: AnalyzedArticle) {
  try {
    const categoryId = await getCategoryId(article.category)

    // 创建文章
    const { data: newArticle, error: articleError } = await supabase
      .from('articles')
      .insert([
        {
          title: article.title,
          description: article.summary,
          content: article.summary,
          image_url: article.image,
          source_url: article.url,
          source: article.source,
          category_id: categoryId,
          status: 'published',
          published_date: article.publishedAt || new Date().toISOString(),
          focus_points: article.focus,
          inspiration_points: article.inspiration,
          is_design_trend: article.isDesignTrend,
          is_competitor_tracking: article.isCompetitorTracking,
        },
      ])
      .select()
      .single()

    if (articleError) {
      console.warn(`  ⚠️ 文章保存失败: ${articleError.message}`)
      return null
    }

    // 关联标签
    for (const tagName of article.tags) {
      const tagId = await getOrCreateTag(tagName)
      if (tagId && newArticle?.id) {
        await supabase.from('article_tags').insert([
          {
            article_id: newArticle.id,
            tag_id: tagId,
          },
        ])
      }
    }

    return newArticle
  } catch (error) {
    console.error(`  ❌ 保存错误:`, error)
    return null
  }
}

async function main() {
  console.log('💾 开始保存到数据库...\n')

  const logsDir = path.join(process.cwd(), 'logs')
  const inputFile = path.join(logsDir, 'analyzed-content.json')

  if (!fs.existsSync(inputFile)) {
    console.error('❌ 找不到分析文件，请先运行 analyze 脚本')
    process.exit(1)
  }

  const analyzedContent: AnalyzedArticle[] = JSON.parse(
    fs.readFileSync(inputFile, 'utf-8')
  )

  console.log(`📝 待保存: ${analyzedContent.length} 篇\n`)

  let savedCount = 0
  const results = []

  for (const [idx, article] of analyzedContent.entries()) {
    console.log(`[${idx + 1}/${analyzedContent.length}] 保存: ${article.title}`)

    const saved = await saveArticle(article)
    if (saved) {
      savedCount++
      results.push({
        id: saved.id,
        title: article.title,
        status: 'saved',
      })
      console.log(`  ✅ 成功`)
    } else {
      results.push({
        title: article.title,
        status: 'failed',
      })
    }
  }

  const outputFile = path.join(logsDir, 'save-results.json')
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))

  console.log(`\n✅ 保存完成: ${savedCount}/${analyzedContent.length}`)
  console.log(`💾 已保存到: ${outputFile}`)

  return results
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  })
}

export { main as saveContent }
