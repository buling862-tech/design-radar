# Design Radar 内容采集分析完整流程

## 🔄 系统完整工作流

```
┌─────────────────────────────────────────────┐
│      1. 原始内容采集                        │
│  (来自 14 个设计资讯源)                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      2. API 接收原始内容                     │
│      /api/collect (POST)                    │
│  - source: "Figma Blog"                    │
│  - title: "..."                            │
│  - url: "https://..."                      │
│  - content: "完整文本..."                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      3. Anthropic Claude 分析                │
│  输入: 完整内容文本                         │
│  处理:                                      │
│  - 一句话概括                               │
│  - 核心更新提取 (3 条)                     │
│  - 设计关注点 (3 条)                       │
│  - 智能硬件启发 (3 条)                     │
│  - 自动标签提取 (3-5 个)                   │
│  - 分类判断                                 │
│  输出: JSON 结构化数据                      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      4. 数据验证与处理                      │
│  - JSON 格式检查                            │
│  - 必填字段验证                             │
│  - 标签规范化                               │
│  - 去重检查（通过 URL 唯一约束）            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      5. 数据库写入                          │
│  表: articles                               │
│  - 标题、摘要、内容                        │
│  - focus_points (设计关注点数组)           │
│  - inspiration_points (启发数组)           │
│  - is_design_trend (布尔值)               │
│  - is_competitor_tracking (布尔值)        │
│  - source, source_url                      │
│  - status = 'draft' (需人工审核)           │
│                                            │
│  表: tags (自动创建新标签)                 │
│  表: article_tags (关联标签)               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      6. 返回结果                            │
│  API 响应:                                  │
│  {                                         │
│    "success": true,                        │
│    "article": { id, title, ... },         │
│    "analyzedContent": { summary, ... }    │
│  }                                         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      7. 编辑审核 (可选)                     │
│  /admin 页面中:                            │
│  - 查看 AI 分析结果                        │
│  - 修改标题、摘要、标签                    │
│  - 设置分类标签                            │
│  - 批准发布或拒绝                          │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
    发布 (✅)            拒绝 (❌)
         │                    │
         ▼                    ▼
    status=published   status=rejected
    显示在网站         存档或删除
```

---

## 📝 API 请求示例

### 单条采集请求

```bash
curl -X POST http://localhost:3000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Figma Blog",
    "title": "Introducing FigJam",
    "url": "https://www.figma.com/blog/...",
    "content": "We're excited to announce FigJam, a powerful new whiteboarding tool that brings diagramming, sketching, and brainstorming into the Figma workspace...",
    "image": "https://example.com/figma-figjam.jpg",
    "publishedAt": "2026-08-11T10:00:00Z"
  }'
```

### 响应示例

```json
{
  "success": true,
  "message": "内容已成功采集并分析",
  "data": {
    "article": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Introducing FigJam",
      "description": "FigJam 白板工具助力设计团队高效协作",
      "content": "We're excited to announce...",
      "image_url": "https://example.com/figma-figjam.jpg",
      "source": "Figma Blog",
      "source_url": "https://www.figma.com/blog/...",
      "focus_points": [
        "白板协作工具新增",
        "实时多人交互增强",
        "设计工作流程完整化"
      ],
      "inspiration_points": [
        "智能屏可集成白板协作功能",
        "AI 辅助头脑风暴记录",
        "团队协作流程优化"
      ],
      "is_design_trend": true,
      "is_competitor_tracking": true,
      "tags": ["Figma", "协作工具", "白板", "设计"],
      "status": "draft",
      "published_date": "2026-08-11T10:00:00Z",
      "created_at": "2026-08-11T14:30:00Z"
    },
    "analyzedContent": {
      "title": "Introducing FigJam",
      "summary": "FigJam 白板工具助力设计团队高效协作",
      "focus": [...],
      "inspiration": [...],
      "tags": [...],
      "category": "design_trends",
      "isDesignTrend": true,
      "isCompetitorTracking": true
    }
  }
}
```

---

## 🔗 数据库关系

```sql
-- 获取完整文章信息（包括标签）
SELECT 
  a.id,
  a.title,
  a.description,
  a.content,
  a.image_url,
  a.focus_points,
  a.inspiration_points,
  a.source,
  a.source_url,
  a.is_design_trend,
  a.is_competitor_tracking,
  ARRAY_AGG(t.name) as tags,
  a.status,
  a.published_date,
  a.created_at
FROM articles a
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id, a.title, a.description, a.content, 
         a.image_url, a.focus_points, a.inspiration_points,
         a.source, a.source_url, a.is_design_trend, 
         a.is_competitor_tracking, a.status, a.published_date, 
         a.created_at
ORDER BY a.published_date DESC;
```

---

## 🎯 前端集成示例

### 显示采集的文章

```tsx
// pages/admin/content-review.tsx
import { supabase } from '@/app/lib/supabase'

export default function ContentReview() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          description,
          image_url,
          focus_points,
          inspiration_points,
          source,
          is_design_trend,
          is_competitor_tracking,
          article_tags (
            tags (name)
          )
        `)
        .eq('status', 'draft')
        .order('created_at', { ascending: false })

      setArticles(data || [])
    }

    fetchArticles()
  }, [])

  const handlePublish = async (articleId) => {
    await supabase
      .from('articles')
      .update({ status: 'published' })
      .eq('id', articleId)
  }

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id} className="border-b p-4">
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          
          {/* 设计关注点 */}
          <div>
            <strong>设计关注点:</strong>
            <ul>
              {article.focus_points?.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          {/* 设计启发 */}
          <div>
            <strong>设计启发:</strong>
            <ul>
              {article.inspiration_points?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 标签 */}
          <div>
            {article.article_tags?.map((at) => (
              <span
                key={at.tags.id}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2"
              >
                {at.tags.name}
              </span>
            ))}
          </div>

          {/* 分类 */}
          <div>
            {article.is_design_trend && (
              <span className="bg-purple-100">📈 设计趋势</span>
            )}
            {article.is_competitor_tracking && (
              <span className="bg-orange-100">🎯 竞品追踪</span>
            )}
          </div>

          {/* 操作 */}
          <div>
            <button onClick={() => handlePublish(article.id)}>
              发布
            </button>
            <button>编辑</button>
            <button>拒绝</button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 💡 工作流场景

### 场景 1: 日常采集流程

```
08:00 - 定时任务触发
  ↓
从 14 个源抓取最新内容（约 50-100 条）
  ↓
逐条通过 AI 分析（总耗时 2-5 分钟）
  ↓
所有内容入库为 draft 状态
  ↓
编辑收到通知，前往审核
  ↓
编辑筛选、编辑、批准
  ↓
发布文章（status = published）
  ↓
文章出现在网站
```

### 场景 2: 人工提交新闻

```
编辑复制粘贴设计资讯
  ↓
粘贴到编辑框中
  ↓
点击"分析"
  ↓
AI 瞬间生成分析结果
  ↓
编辑预览并修改
  ↓
点击"入库"
  ↓
文章入库为 draft
  ↓
后续可直接发布
```

### 场景 3: 竞品追踪更新

```
用户访问 Figma 官网
  ↓
发现新功能介绍
  ↓
复制链接和描述
  ↓
通过浏览器插件"快速提交"
  ↓
后台自动采集和分析
  ↓
自动标记为"竞品追踪"
  ↓
编辑审核后发布
```

---

## 📊 监控指标

### 采集效率

```sql
-- 按天统计采集量
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_collected,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as pending_review,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM articles
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;
```

### 内容质量

```sql
-- 统计分类分布
SELECT 
  'Design Trends' as category,
  COUNT(*) as count
FROM articles
WHERE is_design_trend = true AND status = 'published'
UNION ALL
SELECT 
  'Competitor Tracking' as category,
  COUNT(*) as count
FROM articles
WHERE is_competitor_tracking = true AND status = 'published'
UNION ALL
SELECT 
  'Other' as category,
  COUNT(*) as count
FROM articles
WHERE NOT is_design_trend AND NOT is_competitor_tracking AND status = 'published';
```

### 热门来源

```sql
-- 统计各源的贡献度
SELECT 
  source,
  COUNT(*) as total_articles,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
  ROUND(100.0 * COUNT(CASE WHEN status = 'published' THEN 1 END) / 
        COUNT(*), 2) as publish_rate
FROM articles
GROUP BY source
ORDER BY total_articles DESC;
```

---

## 🚀 扩展方向

1. **自动标签识别** - 使用 NLP 自动提取更多标签
2. **质量评分** - 基于内容长度、来源权重等自动评分
3. **推荐排序** - 基于用户偏好和热度排序
4. **多语言支持** - 支持内容自动翻译
5. **图片优化** - 自动选择最优缩略图
6. **SEO 优化** - 自动生成 meta 描述和关键词

---

**系统已完全就绪，可以开始采集和分析设计资讯了！** 🎉
