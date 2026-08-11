import { supabase } from './supabase'
import { analyzeContent } from './ai-analyzer'

export interface RawContent {
  source: string
  title: string
  url: string
  content: string
  image?: string
  publishedAt?: Date
}

/**
 * 从外部源采集原始内容（不经过分析）
 * 这里是占位符 - 实际需要集成各个内容源的爬虫
 */
export async function collectFromSources(): Promise<RawContent[]> {
  const contents: RawContent[] = []

  // TODO: 实现各个内容源的采集逻辑
  // 1. Figma Blog RSS
  // 2. Google Design RSS
  // 3. Apple Developer
  // 4. Material Design
  // 5. Dezeen Web Scraper
  // ...等等

  return contents
}

/**
 * 采集内容并通过 AI 分析，直接写入数据库
 */
export async function collectAndAnalyze(rawContent: RawContent) {
  try {
    console.log(`🔄 正在分析: ${rawContent.title}`)

    // Step 1: AI 分析内容
    const analyzed = await analyzeContent(rawContent.content)

    if (!analyzed) {
      console.warn(`⚠️ 无法分析内容: ${rawContent.title}`)
      return null
    }

    // Step 2: 获取或创建标签
    const tagIds: string[] = []
    for (const tagName of analyzed.tags) {
      let tag = await getOrCreateTag(tagName)
      if (tag) {
        tagIds.push(tag.id)
      }
    }

    // Step 3: 获取分类
    const categoryId = await getCategoryIdByName(
      analyzed.category === 'design_trends'
        ? '设计趋势'
        : analyzed.category === 'competitor_tracking'
          ? '竞品追踪'
          : '通用'
    )

    // Step 4: 创建文章
    const { data: article, error } = await supabase
      .from('articles')
      .insert([
        {
          title: analyzed.title,
          description: analyzed.summary,
          content: rawContent.content,
          image_url: rawContent.image,
          source_url: rawContent.url,
          source: rawContent.source,
          category_id: categoryId,
          status: 'draft', // 默认草稿状态，需要人工审核
          published_date: rawContent.publishedAt || new Date(),
          focus_points: analyzed.focus,
          inspiration_points: analyzed.inspiration,
          is_design_trend: analyzed.isDesignTrend,
          is_competitor_tracking: analyzed.isCompetitorTracking,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error(`❌ 创建文章失败: ${error.message}`)
      return null
    }

    // Step 5: 关联标签
    if (article && tagIds.length > 0) {
      const articleTags = tagIds.map((tagId) => ({
        article_id: article.id,
        tag_id: tagId,
      }))

      const { error: tagError } = await supabase
        .from('article_tags')
        .insert(articleTags)

      if (tagError) {
        console.error(`⚠️ 标签关联失败: ${tagError.message}`)
      }
    }

    console.log(`✅ 成功: ${analyzed.title}`)
    return {
      article,
      analyzedContent: analyzed,
    }
  } catch (error) {
    console.error(`❌ 处理内容失败:`, error)
    return null
  }
}

/**
 * 获取或创建标签
 */
async function getOrCreateTag(name: string) {
  try {
    // 查找现有标签
    let { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', name)
      .single()

    if (!tag) {
      // 创建新标签
      const { data: newTag, error } = await supabase
        .from('tags')
        .insert([
          {
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
          },
        ])
        .select()
        .single()

      if (error) {
        console.warn(`无法创建标签: ${name}`)
        return null
      }
      tag = newTag
    }

    return tag
  } catch (error) {
    console.error(`标签操作错误:`, error)
    return null
  }
}

/**
 * 获取分类 ID
 */
async function getCategoryIdByName(name: string) {
  try {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .single()

    return category?.id || null
  } catch (error) {
    console.error(`获取分类失败:`, error)
    return null
  }
}

/**
 * 批量处理采集的内容
 */
export async function processBatch(contents: RawContent[]) {
  const results = []

  for (const content of contents) {
    const result = await collectAndAnalyze(content)
    if (result) {
      results.push(result)
    }

    // 避免 API 调用过于频繁
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return results
}
