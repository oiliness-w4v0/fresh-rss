import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Subscription from "../islands/Subscription.tsx";

export default define.page(function Home() {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Fresh counter</title>
      </Head>
      <div class="max-w-3xl mx-auto pt-12">
        <table>
          <caption>
            December 2025 / 2025 年 12 月
          </caption>
          <thead>
            <tr>
              <th scope="col" className="break-keep">作者</th>
              <th scope="col">标题</th>
              <th scope="col">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">阮一峰</th>
              <td className="jc">
                具有 TypeScript
                端到端的类型安全，统一的类型系统和出色的开发人员体验。由 Bun
                提供加速支持。
              </td>
              <td>22</td>
            </tr>
            <tr>
              <th scope="row">-</th>
              <td>Web accessibility</td>
              <td>25</td>
            </tr>
            <tr>
              <th scope="row">土木坛子</th>
              <td>JavaScript frameworks</td>
              <td>18</td>
            </tr>
            <tr>
              <th scope="row">Karen</th>
              <td>具有 TypeScript 验。由 Bun 提供加速支持。</td>
              <td>15</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colspan={2}>本月总发布数量</th>
              <td>8 篇</td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-end">
          <Subscription />
        </div>
      </div>
    </div>
  );
});
