import { useSignal } from "@preact/signals";  
import { Button } from "../components/Button.tsx";  

export default function Subscription() {
  const url = useSignal("");
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  // 使用 async/await 简化异步代码
  async function addSubscription() {
    const feedUrl = prompt(
      "请输入订阅的 RSS 地址",
      "https://www.ruanyifeng.com/blog/atom.xml",
    );
    
    if (feedUrl != null && feedUrl.trim() !== "") {
      url.value = feedUrl;
      isLoading.value = true;
      error.value = null;
      success.value = null;

      try {
        // 使用 async/await 替代 Promise 链
        const response = await fetch(`/api/rss`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: feedUrl.trim() }),
        });

        // 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析响应体
        const data = await response.json();
        success.value = `成功添加订阅: ${data.title?.value || 'RSS 源'}`;
        console.log("订阅成功:", data);
      } catch (err) {
        // 错误处理
        error.value = err instanceof Error ? err.message : "添加订阅失败";
        console.error("订阅失败:", err);
      } finally {
        // 无论成功失败，都要重置加载状态
        isLoading.value = false;
      }
    }
  }

  return (
    <div class="flex flex-col gap-4 py-6">
      <Button 
        id="increment" 
        onClick={() => addSubscription()}
        disabled={isLoading.value}
      >
        {isLoading.value ? "添加中..." : "添加订阅"}
      </Button>
      
      {/* 显示错误或成功信息 */}
      {error.value && (
        <div class="text-red-500">{error.value}</div>
      )}
      {success.value && (
        <div class="text-green-500">{success.value}</div>
      )}
    </div>
  );
}
