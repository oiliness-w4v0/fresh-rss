import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

export default function Subscription() {
  const url = useSignal("");
  // 添加订阅
  function addSubscription() {
    const feedUrl = prompt(
      "请输入你的名字",
      "https://www.ruanyifeng.com/blog/atom.xml",
    );
    if (feedUrl != null && feedUrl.trim() != "") {
      url.value = feedUrl;

      fetch(`/api/rss`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: feedUrl.trim() }),
      })
        .then((data) => {
          console.log(data);
        });
    }
  }

  return (
    <div class="flex gap-8 py-6">
      <Button id="increment" onClick={() => addSubscription()}>
        添加订阅
      </Button>
    </div>
  );
}
