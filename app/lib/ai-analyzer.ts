import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalyzedContent {
  title: string;
  summary: string;
  focus: string[];
  inspiration: string[];
  tags: string[];
  category: "design_trends" | "competitor_tracking" | "general";
  isDesignTrend: boolean;
  isCompetitorTracking: boolean;
}

const ANALYSIS_PROMPT = `你是一个资深的设计研究员。下面是一条设计类资讯，请进行以下分析：

1. **一句话概括** - 结深揭示要点（最多 20 个字）
2. **核心更新** - 主要内容下标 (3 条)
3. **设计关注点** - 对设计师的启示 (3 条)
4. **对智能硬件设计启发** - 其俞价值 (3 条)
5. **标签** - 相关 keyword (3-5 个)
6. **分类** - 是「设计趋势」还是「竞品追踪」还是「通用」？

一定要会输出一个 JSON 对象，不要任何额外的文字！

JSON 格式（必须无步）：
{
  "title": "文章标题",
  "summary": "一句话概括",
  "focus": ["...", "...", "..."],
  "inspiration": ["...", "...", "..."],
  "tags": ["AI", "Figma", "..."],
  "category": "design_trends"
}

下面是要分析的设计资讯：
`;

export async function analyzeContent(
  content: string
): Promise<AnalyzedContent | null> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${ANALYSIS_PROMPT}\n\n${content}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("无效的 JSON 响应:", responseText);
      return null;
    }

    const analysisResult = JSON.parse(jsonMatch[0]);

    return {
      title: analysisResult.title || "",
      summary: analysisResult.summary || "",
      focus: analysisResult.focus || [],
      inspiration: analysisResult.inspiration || [],
      tags: analysisResult.tags || [],
      category:
        analysisResult.category === "design_trends"
          ? "design_trends"
          : analysisResult.category === "competitor_tracking"
            ? "competitor_tracking"
            : "general",
      isDesignTrend:
        analysisResult.category === "design_trends" ||
        (analysisResult.tags || []).some((tag: string) =>
          ["AI", "趋势", "创新", "赋能"].includes(tag)
        ),
      isCompetitorTracking:
        analysisResult.category === "competitor_tracking" ||
        (analysisResult.tags || []).some((tag: string) =>
          ["Figma", "Adobe", "Sketch", "竞品"].includes(tag)
        ),
    };
  } catch (error) {
    console.error("分析内容错误:", error);
    return null;
  }
}

function determinateCategory(
  tags: string[]
): "design_trends" | "competitor_tracking" | "general" {
  const tagStr = tags.join(" ").toLowerCase();
  if (
    tagStr.includes("trend") ||
    tagStr.includes("ai") ||
    tagStr.includes("趋势")
  ) {
    return "design_trends";
  }
  if (
    tagStr.includes("competitor") ||
    tagStr.includes("figma") ||
    tagStr.includes("adobe")
  ) {
    return "competitor_tracking";
  }
  return "general";
}
