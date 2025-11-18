export default function Td(article: { link: string; title: string }) {
  return (
    <td
      className="cursor-pointer hover:bg-zinc-900/10"
      onClick={() => {
        globalThis.open(article.link, "_blank", "noopener,noreferrer");
      }}
    >
      {article.title}
    </td>
  );
}
