/**
 * Google Design Parser
 * 从 Google Design 采集文章
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
    const feed = await parser.parseURL('https://design.google/feed/')
    
    const articles: Article[] = []

    for (const item of feed.items.slice(0, 10)) {
      const article = await parseArticle(item)
      if (article) articles.push(article)
    }

    return articles
  } catch (error) {
    console.error('Google Design 解析失败:', error)
    return []
  }
}

async function parseArticle(item: any): Promise<Article | null> {
  try {
    const response = await fetch(item.link)
    const html = await response.text()
    const $ = cheerio.load(html)

    const title = item.title || $('h1').first().text()
    const image = item.image?.url || extractImageFromContent($, item.content)
    
    let content = item.content || item.description || ''
    content = stripHtmlTags(content).slice(0, 2000)

    return {
      title: title.trim(),
      url: item.link,
      content: content.trim(),
      image: image || undefined,
      published_date: new Date(item.pubDate || new Date())
    }
  } catch (error) {
    console.error('Google Design 文章解析失败:', error)
    return null
  }
}

function extractImageFromContent(
  $: ReturnType<typeof cheerio.load>,
  content: string
): string | undefined {
  const imgMatch = /<img[^>]+src="([^">]+)"/.exec(content)
  if (imgMatch) return imgMatch[1]
  
  return $('img').first().attr('src')
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
