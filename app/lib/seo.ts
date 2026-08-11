export const SEO_CONFIG = {
  site: {
    name: 'Design Radar',
    description: '精选全球顶尖的设计作品、创新案例和设计灵感。每周更新，助力设计师保持创意前沿。',
    url: 'https://designradar.com',
    image: '/og-image.png',
    twitterHandle: '@designradar',
  },
  keywords: ['设计', '趋势', '灵感', '作品集', '设计周刊', 'UI', 'UX', '品牌设计'],
}

export function generateMetadata(
  title: string,
  description?: string,
  image?: string,
  url?: string
) {
  return {
    title: `${title} | ${SEO_CONFIG.site.name}`,
    description: description || SEO_CONFIG.site.description,
    keywords: SEO_CONFIG.keywords,
    openGraph: {
      title,
      description: description || SEO_CONFIG.site.description,
      url: url || SEO_CONFIG.site.url,
      siteName: SEO_CONFIG.site.name,
      images: [
        {
          url: image || SEO_CONFIG.site.image,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || SEO_CONFIG.site.description,
      images: [image || SEO_CONFIG.site.image],
    },
  }
}

export function generateStructuredData(
  type: 'Article' | 'Organization' | 'WebSite',
  data: Record<string, any>
) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  if (type === 'Article') {
    return {
      ...baseStructure,
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.date,
      author: {
        '@type': 'Person',
        name: data.author,
      },
    }
  }

  if (type === 'Organization') {
    return {
      ...baseStructure,
      name: SEO_CONFIG.site.name,
      url: SEO_CONFIG.site.url,
      logo: '/logo.png',
      description: SEO_CONFIG.site.description,
    }
  }

  return {
    ...baseStructure,
    name: SEO_CONFIG.site.name,
    description: SEO_CONFIG.site.description,
    url: SEO_CONFIG.site.url,
  }
}
