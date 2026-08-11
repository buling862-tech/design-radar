/**
 * Dezeen Parser
 * 从 Dezeen 采集设计资讯
 */

import Parser from 'rss-parser'
import * as cheerio from 'cheerio'

interface Article {
  title: string
  url: string
  content: string
  image?: string
  published_date: Date
}

const parser = new Parser()

export async function fetch(): Promise<Article[]> {
  try {
    const feed = await parser.parseURL('https://www.dezeen.com/feed/')
    
    const articles: Article[] = []

    for (const item of feed.items.slice(0, 15)) {
      const article = await parseArticle(item)
      if (article) articles.push(article)
    }

    return articles
  } catch (error) {
    console.error('Dezeen 解析失败:', error)
    return []
  }
}

async function parseArticle(item: any): Promise<Article | null> {
  try {
    const response = await fetch(item.link, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    if (!response.ok) {
      return {
        title: item.title || 'Untitled',
        url: item.link,
        content: item.content || item.description || 'No content',
        image: item.image?.url || item.image || undefined,
        published_date: new Date(item.pubDate || new Date())
      }
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // 提取标题
    const title = item.title || $('h1').first().text()

    // 提取图片
    const image = item.image?.url || $('img[src*="dezeen"]').first().attr('src')

    // 提取正文
    let content = ''
    $('article').find('p').each((_, elem) => {
      content += $(elem).text() + '\n'
    })

    if (!content) {
      content = item.content || item.description || ''
    }

    return {
      title: title.trim().slice(0, 200),
      url: item.link,
      content: stripHtml(content).slice(0, 2000),
      image: image || undefined,
      published_date: new Date(item.pubDate || new Date())
    }
  } catch (error) {
    console.error('Dezeen 单篇解析失败:', error)
    return null
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
