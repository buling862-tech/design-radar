/**
 * Figma Blog Parser
 * 从 Figma 官方博客采集文章
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
    const feed = await parser.parseURL('https://www.figma.com/blog/rss')
    
    const articles: Article[] = []

    for (const item of feed.items.slice(0, 10)) {
      const article = await parseArticle(item)
      if (article) articles.push(article)
    }

    return articles
  } catch (error) {
    console.error('Figma 解析失败:', error)
    return []
  }
}

async function parseArticle(item: any): Promise<Article | null> {
  try {
    // 获取文章内容
    const response = await fetch(item.link)
    const html = await response.text()
    const $ = cheerio.load(html)

    // 提取标题
    const title = item.title || $('h1').first().text()

    // 提取图片
    const image = item.image?.url || $('img').first().attr('src')

    // 提取正文
    let content = ''
    $('article').find('p').each((_, elem) => {
      content += $(elem).text() + '\n'
    })

    if (!content) {
      content = item.content || item.description || ''
    }

    return {
      title: title.trim(),
      url: item.link,
      content: content.trim().slice(0, 2000),
      image: image || undefined,
      published_date: new Date(item.pubDate || item.published_date || new Date())
    }
  } catch (error) {
    console.error('解析单篇文章失败:', error)
    return null
  }
}
