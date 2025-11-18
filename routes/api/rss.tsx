import { db } from "../../db/index.ts";
import { articles, feeds } from "../../db/schema/index.ts";
import { define } from "../../utils.ts";
import { parseFeed } from "@mikaelporttila/rss";

export const handler = define.handlers({
  async POST(ctx) {
    const { url } = await ctx.req.json();

    const response = await fetch(url);
    const xml = await response.text();
    const feed = await parseFeed(xml);

    const [newFeed] = await db.insert(feeds).values({
      title: feed.title?.value || "Untitled Feed",
      description: feed.description || null,
      link: feed.links?.[0] || feed.id || url,
      feedUrl: url,
      type: feed.type || null,
      generator: feed.generator || null,
      language: feed.language || null,
      copyright: feed.copyright || null,
      docs: feed.docs || null,
      ttl: feed.ttl || null,
      skipDays: feed.skipDays ? JSON.stringify(feed.skipDays) : null,
      skipHours: feed.skipHours ? JSON.stringify(feed.skipHours) : null,
      authorName: feed.author?.name || null,
      authorEmail: feed.author?.email || null,
      authorUri: feed.author?.uri || null,
      categories: feed.categories ? JSON.stringify(feed.categories) : null,
      published: feed.published || null,
      created: feed.created || null,
      updateDate: feed.updateDate || null,
      lastBuildDate: feed.updateDate || null,
    }).onConflictDoUpdate({
      target: feeds.feedUrl,
      set: {
        // 重新设置可以让返回永远存在数据
        feedUrl: url,
      },
    }).returning();

    if (newFeed) {
      for (const entry of feed.entries || []) {
        await db.insert(articles).values({
          feedId: newFeed.id,
          originalId: entry.id,
          title: entry.title?.value || "Untitled",
          titleType: entry.title?.type || null,
          description: entry.description?.value || null,
          descriptionType: entry.description?.type || null,
          content: entry.content?.value || null,
          link: entry.links?.[0]?.href || entry.id || "Untitled",
          links: entry.links ? JSON.stringify(entry.links) : null,
          comments: entry?.comments || null,
          authorName: entry?.author?.name || null,
          authorEmail: entry?.contributors?.[0]?.email || null,
          authorUri: entry?.contributors?.[0]?.uri || null,
          contributors: entry?.contributors
            ? JSON.stringify(entry.contributors)
            : null,
          categories: entry.categories
            ? JSON.stringify(entry.categories)
            : null,
          published: entry.published || null,
          publishedRaw: entry.publishedRaw || null,
          updated: entry.updated || null,
          updatedRaw: entry.updatedRaw || null,
          pubDate: entry.published || entry.updated || null,
        }).onConflictDoNothing({
          target: articles.originalId,
        });
      }
    }

    return new Response(JSON.stringify(feed));
  },
});
