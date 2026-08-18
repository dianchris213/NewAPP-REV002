import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, TopBar } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { TransactionList } from "@/components/TransactionList";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { formatIDR, useApp } from "@/lib/app-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beranda - Catatan Keuangan Mini App" },
      {
        name: "description",
        content:
          "Pantau saldo, pemasukan, pengeluaran, dan tagihan bulanan langsung dari Telegram Mini App.",
      },
      { property: "og:title", content: "Beranda - Catatan Keuangan Mini App" },
      {
        property: "og:description",
        content: "Pantau saldo dan transaksi harian dari Telegram Mini App.",
      },
    ],
  }),
  component: Home,
});

const RECENT_LIMIT = 3;

const pockets = [
  { name: "Tunai", icon: "payments", share: 0.25 },
  { name: "Bank", icon: "account_balance", share: 0.6 },
  { name: "E-Wallet", icon: "wallet", share: 0.15 },
];

const bills = [
  { name: "Listrik", due: "Jatuh tempo 25 Agu", dueDay: 25, amount: 320000, paid: 120000 },
  { name: "Internet", due: "Jatuh tempo 28 Agu", dueDay: 28, amount: 350000, paid: 350000 },
];

function daysUntil(dueDay: number) {
  const now = new Date();
  const due = new Date(now.getFullYear(), now.getMonth(), dueDay);
  if (due.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    due.setMonth(due.getMonth() + 1);
  }
  return Math.round(
    (due.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86400000,
  );
}

function Home() {
  const { user, transactions, balance, totalIncome, totalExpense, setAddTxOpen } = useApp();
  const [expanded, setExpanded] = useState(false);
  const pocketStrip = useDragScroll<HTMLDivElement>();
  const visible = useMemo(
    () => (expanded ? transactions : transactions.slice(0, RECENT_LIMIT)),
    [transactions, expanded],
  );
  const hidden = Math.max(transactions.length - RECENT_LIMIT, 0);

  return (
    <AppShell topBar={<TopBar eyebrow="Selamat datang" title={user?.name ?? "Pengguna"} />}>
      <div className="gradient-hero relative overflow-hidden rounded-[24px] p-6">
        <span className="text-label uppercase text-primary/80">Total Saldo</span>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-display text-on-surface">{formatIDR(balance)}</span>
          <Icon name="chevron_right" className="mb-1 text-[22px] text-primary" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">
          <SummaryPill
            label="Pemasukan"
            value={formatIDR(totalIncome)}
            icon="south_west"
            tone="success"
          />
          <SummaryPill
            label="Pengeluaran"
            value={formatIDR(totalExpense)}
            icon="north_east"
            tone="error"
          />
        </div>
      </div>

      <Section title="Kantong Dana">
        <div
          ref={pocketStrip.ref}
          onKeyDown={pocketStrip.onKeyDown}
          tabIndex={0}
          role="list"
          aria-label="Daftar kantong dana, geser ke samping untuk melihat lainnya"
          className="swipe-x flex cursor-grab gap-3 pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {pockets.map((p) => (
            <button
              key={p.name}
              type="button"
              role="listitem"
              onClick={() => setAddTxOpen(true)}
              aria-label={`Kantong ${p.name}, saldo ${formatIDR(balance * p.share)}`}
              className="glass-card min-w-[150px] shrink-0 rounded-[18px] p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-primary">
                <Icon name={p.icon} className="text-[18px]" />
              </span>
              <p className="mt-3 text-meta text-on-surface-variant">{p.name}</p>
              <p className="text-body font-semibold text-on-surface">
                {formatIDR(balance * p.share)}
              </p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Tagihan Bulanan">
        <ul className="glass-card rounded-[18px] px-4">
          {bills.map((b) => {
            const days = daysUntil(b.dueDay);
            const remaining = Math.max(b.amount - b.paid, 0);
            const urgent = days <= 3;
            return (
              <li
                key={b.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-outline-variant/20 py-3 last:border-0"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-body font-medium text-on-surface">{b.name}</span>
                  <span className="text-meta text-on-surface-variant/80">{b.due}</span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        urgent ? "bg-error/15 text-error" : "bg-primary-container/25 text-primary"
                      }`}
                    >
                      <Icon name="schedule" className="text-[13px]" fill={1} />
                      {days === 0 ? "Jatuh tempo hari ini" : `Jatuh tempo dalam ${days} hari`}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        remaining > 0 ? "text-on-surface-variant" : "text-success"
                      }`}
                    >
                      <Icon
                        name={remaining > 0 ? "savings" : "check_circle"}
                        className="text-[13px]"
                        fill={1}
                      />
                      {remaining > 0 ? `Kurang ${formatIDR(remaining)}` : "Target tercapai"}
                    </span>
                  </span>
                </div>
                <span className="shrink-0 text-body font-semibold text-on-surface">
                  {formatIDR(b.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        title="Transaksi Terbaru"
        action={
          hidden > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="recent-transactions"
              className="flex items-center gap-1 rounded-full border border-outline-variant/30 px-3 py-1 text-meta text-on-surface-variant/80"
            >
              {expanded ? "Tampilkan Lebih Sedikit" : `Lihat Semua (${hidden})`}
              <Icon
                name={expanded ? "expand_less" : "expand_more"}
                className="text-[16px]"
              />
            </button>
          ) : (
            <span className="rounded-full border border-outline-variant/30 px-3 py-1 text-meta text-on-surface-variant/80">
              {transactions.length} entri
            </span>
          )
        }
      >
        <div id="recent-transactions">
          {visible.length ? (
            <TransactionList items={visible} />
          ) : (
            <EmptyState
              icon="receipt"
              title="Belum ada transaksi"
              description="Tekan tombol + untuk menambah catatan pertama."
            />
          )}
        </div>
      </Section>
    </AppShell>
  );
}

function SummaryPill({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone: "success" | "error";
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-[16px] border border-white/8 bg-white/5 p-2.5 sm:gap-3 sm:p-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
          tone === "success" ? "bg-success/15 text-success" : "bg-error/15 text-error"
        }`}
      >
        <Icon name={icon} className="text-[16px] sm:text-[18px]" fill={1} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-label uppercase text-on-surface-variant/80">{label}</span>
        <span
          className={`truncate text-[13px] font-semibold leading-tight sm:text-body ${
            tone === "success" ? "text-success" : "text-error"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-stack-lg">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-section text-on-surface">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
