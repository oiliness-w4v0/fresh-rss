import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Subscription from "../islands/Subscription.tsx";
import Td from "../islands/Td.tsx";
import { db } from "../db/index.ts";
import { articles } from "../db/schema/index.ts";
import { desc } from "drizzle-orm";
import { dayjs } from "@xtool/dayjs";

export const handler = define.handlers({
  async GET() {
    const arts = await db
      .select({
        id: articles.id,
        title: articles.title,
        authorName: articles.authorName,
        published: articles.published,
        link: articles.link,
      })
      .from(articles)
      .orderBy(desc(articles.published))
      .all();

    // 按年月分组
    const groupedByMonth = arts.reduce(
      (acc, article) => {
        if (!article.published) return acc;

        const date = dayjs(article.published);
        const yearMonth = date.format("YYYY-MM");

        if (!acc[yearMonth]) {
          acc[yearMonth] = {
            yearMonth,
            displayName: date.format("YYYY 年 M 月"),
            articles: [],
          };
        }

        acc[yearMonth].articles.push(article);
        return acc;
      },
      {} as Record<
        string,
        { yearMonth: string; displayName: string; articles: typeof arts }
      >,
    );

    // 转换为数组并排序
    const groupedData = Object.values(groupedByMonth).sort((a, b) =>
      b.yearMonth.localeCompare(a.yearMonth)
    );

    return { data: groupedData };
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Fresh RSS</title>
      </Head>
      <div class="max-w-3xl mx-auto pt-12">
        <div className="flex justify-end">
          <Subscription />
        </div>

        {data.map((group) => (
          <div key={group.yearMonth} className="mb-12">
            <table>
              <caption>
                {group.displayName}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="break-keep">作者</th>
                  <th scope="col">标题</th>
                  <th scope="col">日期</th>
                </tr>
              </thead>
              <tbody>
                {group.articles.map((article) => (
                  <tr key={article.id}>
                    <th scope="row">{article.authorName}</th>
                    <Td link={article.link} title={article.title} />
                    {
                      /* <td
                      className="cursor-pointer hover:bg-zinc-900/10"
                      onClick={() => {}}
                    >
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                    </td> */
                    }
                    <td>{dayjs(article.published).format("DD")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colspan={2}>本月总发布数量</th>
                  <td>{group.articles.length} 篇</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
});
