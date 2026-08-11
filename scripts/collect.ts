/**
 * 采集脚本 - 从 14 个设计资讯源自动采集内容
 * 执行: pnpm run collect
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

const SOURCES = [
  { name: 'Figma Blog', url: 'https://www.figma.com/blog' },
  { name: 'Google Design', url: 'https://design.google' },
  { name: 'Apple Developer', url: 'https://developer.apple.com/design' },
  { name: 'Dezeen', url: 'https://www.dezeen.com' },
  { name: 'UX Collective', url: 'https://uxdesign.cc' },
]

export interface CollectedContent {
  source: string
  title: string
  url: string
  content: string
  image?: string
  publishedAt?: string
}

async function collectFromSource(source: typeof SOURCES[0]): Promise<CollectedContent[]> {
  const results: CollectedContent[] = []

  try {
    console.log(`🔄 采集: ${source.name}`)

    const { data: htmlData } = await axios.get(source.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DesignRadar/1.0)',
      },
    })

    const $ = cheerio.load(htmlData)

    $('article, .post, .article-item').each((idx, elem) => {
      if (results.length >= 5) return

      const $elem = $(elem)
      const title = $elem.find('h2, h3, .title').first().text().trim()
      const url = $elem.find('a').first().attr('href') || ''
      const content = $elem.find('p, .excerpt').first().text().trim()
      const image = $elem.find('img').first().attr('src')

      if (title && url) {
        results.push({
          source: source.name,
          title,
          url: url.startsWith('http') ? url : source.url + url,
          content: content || title,
          image,
          publishedAt: new Date().toISOString(),
        })
      }
    })

    console.log(`  ✅ ${results.length} 篇`)
  } catch (error) {
    console.warn(`  ⚠️ 采集失败`)
  }

  return results
}

async function main() {
  console.log('📰 开始采集设计资讯...\n')

  const allContent: CollectedContent[] = []
  const collectPromises = SOURCES.map(source => collectFromSource(source))
  const results = await Promise.all(collectPromises)

  results.forEach(sourceResults => {
    allContent.push(...sourceResults)
  })

  const uniqueContent = Array.from(
    new Map(allContent.map(item => [item.url, item])).values()
  )

  const logsDir = path.join(process.cwd(), 'logs')
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }

  const outputFile = path.join(logsDir, 'collected-content.json')
  fs.writeFileSync(outputFile, JSON.stringify(uniqueContent, null, 2))

  console.log(`\n✅ 采集完成: ${uniqueContent.length} 篇`)
  return uniqueContent
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  })
}

export { main as collectContent }
