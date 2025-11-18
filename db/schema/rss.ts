import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const feeds = sqliteTable("feeds", {
  id: text("id").primaryKey().$default(() => nanoid()),

  // 基本信息
  title: text("title").notNull(),
  description: text("description"),
  link: text("link").notNull(),
  feedUrl: text("feed_url").notNull().unique(),

  // RSS 元数据
  type: text("type"), // RSS 2.0, Atom, etc.
  generator: text("generator"),
  language: text("language"),
  copyright: text("copyright"),
  docs: text("docs"),

  // 更新控制
  ttl: integer("ttl"), // Time to live in minutes
  skipDays: text("skip_days"), // JSON array
  skipHours: text("skip_hours"), // JSON array

  // 作者/编辑信息
  // managingEditor: text("managing_editor"), // email
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  authorUri: text("author_uri"),

  // 分类和自定义频道
  categories: text("categories"), // JSON array
  // customChannels: text("custom_channels"), // JSON object for blogchannel:* fields

  // 时间戳
  published: integer("published", { mode: "timestamp" }),
  created: integer("created", { mode: "timestamp" }),
  updateDate: integer("update_date", { mode: "timestamp" }),
  lastBuildDate: integer("last_build_date", { mode: "timestamp" }),

  createdAt: integer("created_at", { mode: "timestamp" }).$default(() =>
    new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() =>
    new Date()
  ),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey().$default(() => nanoid()),
  feedId: text("feed_id").notNull().references(() => feeds.id, {
    onDelete: "cascade",
  }),

  // 原始 ID (from RSS feed)
  originalId: text("original_id").unique(),

  // 文章基本信息
  title: text("title").notNull(),
  titleType: text("title_type"), // html, text, etc.
  description: text("description"),
  descriptionType: text("description_type"),
  content: text("content"),
  link: text("link").notNull(),

  // 额外链接
  links: text("links"), // JSON array of Link objects

  // 评论
  comments: text("comments"),

  // 作者信息
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  authorUri: text("author_uri"),

  // 贡献者
  contributors: text("contributors"), // JSON array

  // 分类
  categories: text("categories"), // JSON array

  // 时间
  published: integer("published", { mode: "timestamp" }),
  publishedRaw: text("published_raw"),
  updated: integer("updated", { mode: "timestamp" }),
  updatedRaw: text("updated_raw"),
  pubDate: integer("pub_date", { mode: "timestamp" }),

  // 阅读状态
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),

  // 收藏/星标
  isStarred: integer("is_starred", { mode: "boolean" }).notNull().default(
    false,
  ),

  createdAt: integer("created_at", { mode: "timestamp" }).$default(() =>
    new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() =>
    new Date()
  ),
});

export type FeedSelect = typeof feeds.$inferSelect;
export type ArticleSelect = typeof articles.$inferSelect;
export type FeedInsert = typeof feeds.$inferInsert;
export type ArticleInsert = typeof articles.$inferInsert;
