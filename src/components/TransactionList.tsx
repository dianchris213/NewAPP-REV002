import { Icon } from "./Icon";
import { formatIDR, type Transaction } from "@/lib/app-store";

export function TransactionList({ items }: { items: Transaction[] }) {
  return (
    <ul className="glass-card rounded-[18px] px-4">
      {items.map((t) => (
        <li
          key={t.id}
          className={`flex items-center gap-3 border-b border-outline-variant/20 py-3 last:border-0 transition-opacity ${
            t.pending ? "opacity-60" : "opacity-100"
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              t.type === "income" ? "bg-success/15 text-success" : "bg-error/15 text-error"
            }`}
          >
            <Icon name={t.type === "income" ? "south_west" : "north_east"} className="text-[18px]" fill={1} />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-body font-medium text-on-surface">{t.category}</span>
            <span className="text-meta text-on-surface-variant/80">
              {t.note || new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              {t.pending ? " · menyimpan..." : ""}
            </span>
          </div>
          <span
            className={`text-body font-semibold ${t.type === "income" ? "text-success" : "text-error"}`}
          >
            {t.type === "income" ? "+" : "-"}
            {formatIDR(t.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
