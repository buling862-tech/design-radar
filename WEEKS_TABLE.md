# weeks 表完整字段文档

## 表结构

```sql
CREATE TABLE IF NOT EXISTS weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week INTEGER NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(week, year)
);
```

## 字段详解

### id
- **类型**: UUID
- **约束**: PRIMARY KEY, NOT NULL
- **说明**: 周的唯一标识符
- **自动生成**: 是（使用 `gen_random_uuid()`）
- **用途**: 内部记录标识
- **示例**: `550e8400-e29b-41d4-a716-446655440000`

### week ⭐
- **类型**: INTEGER
- **约束**: NOT NULL
- **说明**: 一年中的周数
- **范围**: 1-53
- **标准**: 遵循 ISO 8601 标准
- **用途**: 标识一年中的第几周
- **示例**: 
  - 周1：1月1日-1月7日
  - 周32：8月1日-8月7日（大约）
  - 周52：12月24日-12月30日

### year ⭐
- **类型**: INTEGER
- **约束**: NOT NULL
- **说明**: 年份
- **格式**: 4 位数字
- **范围**: 1900-2099（建议）
- **用途**: 标识周属于哪一年
- **示例**: 2026, 2025, 2024

### start_date ⭐
- **类型**: DATE
- **约束**: NOT NULL
- **说明**: 周的开始日期（通常是周一）
- **格式**: YYYY-MM-DD
- **用途**: 在 UI 中显示、范围查询
- **示例**: `2026-08-03` (周一)

### end_date ⭐
- **类型**: DATE
- **约束**: NOT NULL
- **说明**: 周的结束日期（通常是周日）
- **格式**: YYYY-MM-DD
- **用途**: 在 UI 中显示、范围查询
- **示例**: `2026-08-09` (周日)

### created_at
- **类型**: TIMESTAMP WITH TIME ZONE
- **约束**: NOT NULL
- **说明**: 周记录创建时间
- **默认值**: 当前系统时间（`now()`）
- **自动设置**: 是
- **用途**: 审计日志

### updated_at
- **类型**: TIMESTAMP WITH TIME ZONE
- **约束**: NOT NULL
- **说明**: 周记录最后更新时间
- **默认值**: 当前系统时间（`now()`）
- **自动设置**: 是
- **用途**: 审计日志、数据版本控制

---

## 约束

### UNIQUE 约束
```sql
UNIQUE(week, year)
```

- **说明**: 每个年份中的周数不能重复
- **用途**: 防止重复数据
- **效果**: 同一年的同一周只能有一条记录
- **示例**: (week=32, year=2026) 只能出现一次

---

## 索引

```sql
-- 自动创建的索引
- PRIMARY KEY: id
- UNIQUE: (week, year)
```

建议的额外索引：
```sql
CREATE INDEX idx_weeks_year ON weeks(year);
CREATE INDEX idx_weeks_year_week ON weeks(year, week);
CREATE INDEX idx_weeks_date_range ON weeks(start_date, end_date);
```

---

## 完整的 SQL 操作示例

### 插入单周

```sql
-- 插入 2026 年第 32 周（8月3日-8月9日）
INSERT INTO weeks (week, year, start_date, end_date)
VALUES (32, 2026, '2026-08-03', '2026-08-09');
```

### 批量插入全年周数

```sql
-- 为 2026 年插入所有 52 周
INSERT INTO weeks (week, year, start_date, end_date)
VALUES
  (1, 2026, '2026-01-05', '2026-01-11'),
  (2, 2026, '2026-01-12', '2026-01-18'),
  (3, 2026, '2026-01-19', '2026-01-25'),
  (4, 2026, '2026-01-26', '2026-02-01'),
  (5, 2026, '2026-02-02', '2026-02-08'),
  -- ... 继续到第 52 周
  (52, 2026, '2026-12-28', '2027-01-03');
```

### 查询特定周

```sql
-- 获取 2026 年第 32 周的信息
SELECT * FROM weeks
WHERE year = 2026 AND week = 32;

-- 返回：
-- id: uuid, week: 32, year: 2026, 
-- start_date: 2026-08-03, end_date: 2026-08-09
```

### 按日期查询周

```sql
-- 查找包含特定日期的周
SELECT * FROM weeks
WHERE start_date <= '2026-08-05'
AND end_date >= '2026-08-05';

-- 返回：第 32 周的信息
```

### 查询特定年份的所有周

```sql
-- 获取 2026 年的所有周
SELECT * FROM weeks
WHERE year = 2026
ORDER BY week ASC;
```

---

## 数据库操作（使用 TypeScript）

### 获取特定周的信息

```typescript
async function getWeekInfo(week: number, year: number) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('week', week)
    .eq('year', year)
    .single()

  return { data, error }
}

// 使用示例
const { data: week32 } = await getWeekInfo(32, 2026)
// 返回: { id: '...', week: 32, year: 2026, start_date: '2026-08-03', end_date: '2026-08-09', ... }
```

### 获取包含特定日期的周

```typescript
async function getWeekByDate(date: string) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .lte('start_date', date)
    .gte('end_date', date)
    .single()

  return { data, error }
}

// 使用示例
const { data: currentWeek } = await getWeekByDate('2026-08-05')
```

### 获取特定年份的所有周

```typescript
async function getYearWeeks(year: number) {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('year', year)
    .order('week', { ascending: true })

  return { data, error }
}

// 使用示例
const { data: allWeeks2026 } = await getYearWeeks(2026)
```

### 获取当前周

```typescript
async function getCurrentWeek() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .lte('start_date', today)
    .gte('end_date', today)
    .single()

  return { data, error }
}
```

### 创建周记录

```typescript
async function createWeek(
  week: number,
  year: number,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('weeks')
    .insert([{ week, year, start_date: startDate, end_date: endDate }])
    .select()
    .single()

  return { data, error }
}
```

### 批量创建年度周数

```typescript
async function createYearWeeks(year: number) {
  // 使用 ISO 8601 标准计算周的日期
  const weeks = calculateWeeksForYear(year)
  
  const { data, error } = await supabase
    .from('weeks')
    .insert(
      weeks.map(w => ({
        week: w.week,
        year: w.year,
        start_date: w.startDate,
        end_date: w.endDate
      }))
    )
    .select()

  return { data, error }
}

// 辅助函数：计算一年中所有周的日期
function calculateWeeksForYear(year: number) {
  const weeks = []
  
  for (let week = 1; week <= 52; week++) {
    // ISO 8601：周一是一周的第一天
    const jan4 = new Date(year, 0, 4)
    const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay()
    const firstMonday = new Date(year, 0, 4 - dayOfWeek + 1)
    
    const startDate = new Date(firstMonday)
    startDate.setDate(firstMonday.getDate() + (week - 1) * 7)
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    weeks.push({
      week,
      year,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    })
  }
  
  return weeks
}
```

---

## 与 articles 表的关系

### 添加周期关联到 articles 表

可以在 articles 表中添加一个 `week_id` 字段来关联周：

```sql
ALTER TABLE articles ADD COLUMN week_id UUID REFERENCES weeks(id) ON DELETE SET NULL;
CREATE INDEX idx_articles_week ON articles(week_id);
```

### 查询某周的所有文章

```sql
SELECT a.*
FROM articles a
JOIN weeks w ON a.week_id = w.id
WHERE w.year = 2026 AND w.week = 32
AND a.status = 'published'
ORDER BY a.publish_date DESC;
```

### 获取周刊及其文章

```typescript
async function getWeeklyNewsletter(week: number, year: number) {
  // 1. 获取周信息
  const { data: weekData } = await supabase
    .from('weeks')
    .select('*')
    .eq('week', week)
    .eq('year', year)
    .single()

  // 2. 获取该周的所有文章
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('week_id', weekData.id)
    .eq('status', 'published')
    .order('publish_date', { ascending: false })

  return { week: weekData, articles }
}
```

---

## 使用场景

### 场景 1：历史周刊浏览页面 `/archives`

```typescript
// 获取 2026 年的所有周
const { data: weeks2026 } = await getYearWeeks(2026)

// 显示列表
weeks2026.map(w => ({
  label: `第 ${w.week} 周 (${w.start_date} - ${w.end_date})`,
  url: `/archives/${w.year}/${w.week}`
}))
```

### 场景 2：周刊详情页 `/archives/[year]/[week]`

```typescript
export default async function WeeklyPage({
  params
}: {
  params: { year: string; week: string }
}) {
  const year = parseInt(params.year)
  const week = parseInt(params.week)

  // 获取周信息
  const { data: weekData } = await getWeekInfo(week, year)
  
  // 获取该周的文章
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('week_id', weekData.id)
    .eq('status', 'published')

  return (
    <div>
      <h1>第 {week} 周设计周刊</h1>
      <p>{weekData.start_date} - {weekData.end_date}</p>
      <ArticleList articles={articles} />
    </div>
  )
}
```

### 场景 3：当前周刊展示

```typescript
// 首页显示当前周的文章
const { data: currentWeek } = await getCurrentWeek()

const { data: articles } = await supabase
  .from('articles')
  .select('*')
  .eq('week_id', currentWeek.id)
  .eq('status', 'published')
```

### 场景 4：周刊发布时自动关联

```typescript
async function publishWeekly(weekId: string, articles: ArticleData[]) {
  // 1. 创建文章
  const createdArticles = await Promise.all(
    articles.map(article => 
      createArticle({ ...article, week_id: weekId })
    )
  )

  // 2. 更新周状态为已发布
  await supabase
    .from('weeks')
    .update({ published_at: new Date().toISOString() })
    .eq('id', weekId)

  return createdArticles
}
```

---

## SEO 优化

### 周刊页的 Meta 标签

```typescript
export const metadata: Metadata = {
  title: `第 ${week} 周设计周刊 | Design Radar`,
  description: `${startDate} - ${endDate} 的设计周刊，精选本周最佳设计内容`,
  openGraph: {
    title: `第 ${week} 周设计周刊`,
    description: `Design Radar 第 ${week} 周设计周刊`,
    type: 'website',
    url: `https://designradar.com/archives/${year}/${week}`,
  },
}
```

### Sitemap 包含周刊页面

```typescript
export default function sitemap() {
  const weeks = await getYearWeeks(2026)
  
  return [
    ...weeks.map(w => ({
      url: `https://designradar.com/archives/${w.year}/${w.week}`,
      lastModified: w.updated_at,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  ]
}
```

---

## 数据完整性检查

```sql
-- 检查周数据的合理性
SELECT *
FROM weeks
WHERE EXTRACT(DAY FROM (end_date - start_date)) != 6
-- 应该返回 0 行（每周应该是 7 天，差值应该是 6）

-- 检查周数据的连续性
SELECT w1.year, w1.week, w1.end_date, w2.start_date
FROM weeks w1
JOIN weeks w2 ON w1.year = w2.year AND w1.week + 1 = w2.week
WHERE (w2.start_date - w1.end_date)::int != 1
-- 应该返回 0 行（周与周之间应该连续）
```

---

## 常见问题

### Q: ISO 8601 标准中的周应该如何计算？

A: ISO 8601 标准定义：
- 周一是一周的第一天
- 第 1 周是包含该年第一个周四的周
- 一年通常有 52 周，但有些年份有 53 周

```typescript
function getISOWeek(date: Date) {
  const dateCopy = new Date(date)
  dateCopy.setHours(0, 0, 0, 0)
  // 周四在当前周内
  dateCopy.setDate(dateCopy.getDate() + 3 - (dateCopy.getDay() + 6) % 7)
  const week1 = new Date(dateCopy.getFullYear(), 0, 4)
  week1.setDate(week1.getDate() - (week1.getDay() + 6) % 7)
  return Math.round((dateCopy.getTime() - week1.getTime()) / 86400000 / 7) + 1
}
```

### Q: 如何处理跨年的周？

A: 某些年份第 53 周可能跨越到下一年的 1 月初。处理方式：
- 保持周数在 1-53 之间
- 起始日期和结束日期可以在不同年份

```typescript
// 第 53 周可能跨越年份
const week53_2026 = {
  week: 53,
  year: 2026,
  start_date: '2026-12-28',  // 2026年
  end_date: '2027-01-03'     // 2027年
}
```

### Q: 如何为新年自动创建周记录？

A: 在应用启动或定时任务中运行：

```typescript
async function initializeYearWeeks(year: number) {
  const weeks = calculateWeeksForYear(year)
  
  for (const week of weeks) {
    await createWeek(week.week, week.year, week.startDate, week.endDate)
  }
}

// 在应用启动时检查
const currentYear = new Date().getFullYear()
const { data: weeksExist } = await supabase
  .from('weeks')
  .select('id')
  .eq('year', currentYear)
  .limit(1)

if (!weeksExist || weeksExist.length === 0) {
  await initializeYearWeeks(currentYear)
}
```

---

## 数据库迁移脚本

```sql
-- 创建 weeks 表
CREATE TABLE IF NOT EXISTS weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week INTEGER NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(week, year)
);

-- 创建索引
CREATE INDEX idx_weeks_year ON weeks(year);
CREATE INDEX idx_weeks_year_week ON weeks(year, week);
CREATE INDEX idx_weeks_date_range ON weeks(start_date, end_date);

-- 如果需要在 articles 表中添加周关联
ALTER TABLE articles ADD COLUMN IF NOT EXISTS week_id UUID REFERENCES weeks(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_articles_week ON articles(week_id);

-- 启用 RLS
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人可读，需要认证才能修改
CREATE POLICY "Anyone can read weeks"
  ON weeks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage weeks"
  ON weeks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

## 推荐的示例数据

对于 2026 年，你可以预先生成全年 52 周的数据。使用上述的 `calculateWeeksForYear(2026)` 函数生成完整的周数据。

---

现在你拥有了完整的 weeks 表文档！ 🎉
