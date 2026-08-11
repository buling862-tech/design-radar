/**
 * Apple Developer Parser
 * 从 Apple Developer 采集文章
 */

import * as cheerio from 'cheerio'

interface Article {
  title: string
  url: string
  content: string
  image?: string
  published_date: Date
}

export async function fetch(): Promise<Article[]> {
  try {
    // Apple Developer 主要使用网页爬虫
    const response = await fetch('https://developer.apple.com/news/')
    const html = await response.text()
    const $ = cheerio.load(html)

    const articles: Article[] = []

    $('article, .news-item').each(async (_, elem) => {
      const article = await parseArticle($, elem)
      if (article) articles.push(article)
    })

    return articles.slice(0, 10)
  } catch (error) {
    console.error('Apple Developer 解析失败:', error)
    return []
  }
}

async function parseArticle(
  $: ReturnType<typeof cheerio.load>,
  elem: any
): Promise<Article | null> {
  try {
    const $elem = $(elem)

    // 提取标题
    const titleElem = $elem.find('h2, h3, .title').first()
    const title = titleElem.text().trim()

    // 提取链接
    const linkElem = $elem.find('a').first()
    const url = linkElem.attr('href') || ''

    // 提取图片
    const image = $elem.find('img').first().attr('src')

    // 提取描述
    let content = $elem.find('p, .description').first().text()
    if (!content) {
      content = $elem.find('.excerpt').text() || titleElem.text()
    }

    if (!title || !url) return null

    return {
      title: title.slice(0, 200),
      url: `https://developer.apple.com${url.startsWith('/') ? url : '/' + url}`,
      content: content.slice(0, 2000),
      image: image ? `https://developer.apple.com${image.startsWith('/') ? image : '/' + image}` : undefined,
      published_date: new Date()
    }
  } catch (error) {
    console.error('Apple 单篇文章解析失败:', error)
    return null
  }
}
