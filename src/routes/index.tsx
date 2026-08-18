import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { TransactionList } from "@/components/TransactionList";
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

function Home() {
  const { user, transactions, balance, totalIncome, totalExpense, setAddTxOpen } = useApp();
  const recent = transactions.slice(0, 5);

  return (
    <AppShell topBar={<TopBar eyebrow="Selamat datang" title={user?.name ?? "Pengguna"} />}>
      <div className="gradient-hero relative overflow-hidden rounded-[24px] p-6">
        <span className="text-label uppercase text-primary/80">Total Saldo</span>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-display text-on-surface">{formatIDR(balance)}</span>
          <Icon name="chevron_right" className="mb-1 text-[22px] text-primary" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-[16px] border border-white/8 bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
              <Icon name="south_west" className="text-[18px]" fill={1} />
            </div>
            <div className="flex flex-col">
              <span className="text-label uppercase text-on-surface-variant/80">Pemasukan</span>
              <span className="text-body font-semibold text-success">{formatIDR(totalIncome)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] border border-white/8 bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-error/15 text-error">
              <Icon name="north_east" className="text-[18px]" fill={1} />
            </div>
            <div className="flex flex-col">
              <span className="text-label uppercase text-on-surface-variant/80">Pengeluaran</span>
              <span className="text-body font-semibold text-error">{formatIDR(totalExpense)}</span>
            </div>
          </div>
        </div>
      </div>

      <Section title="Kantong Dana">
        <div className="flex gap-3 overflow-x-auto no-scrollbar" aria-label="Daftar kantong dana">
          {[
            { name: "Tunai", icon: "payments", share: 0.25 },
            { name: "Bank", icon: "account_balance", share: 0.6 },
            { name: "E-Wallet", icon: "wallet", share: 0.15 },
          ].map((p) => (
            <div key={p.name} className="glass-card min-w-[150px] shrink-0 rounded-[18px] p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-primary">
                <Icon name={p.icon} className="text-[18px]" />
              </span>
              <p className="mt-3 text-meta text-on-surface-variant">{p.name}</p>
              <p className="text-body font-semibold text-on-surface">
                {formatIDR(balance * p.share)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tagihan Bulanan">
        <div className="glass-card rounded-[18px] px-4">
          {[
            { name: "Listrik", due: "Jatuh tempo 25 Agu", amount: 320000 },
            { name: "Internet", due: "Jatuh tempo 28 Agu", amount: 350000 },
          ].map((b) => (
            <div
              key={b.name}
              className="flex items-center justify-between border-b border-outline-variant/20 py-3 last:border-0"
            >
              <div className="flex flex-col">
                <span className="text-body font-medium text-on-surface">{b.name}</span>
                <span className="text-meta text-on-surface-variant/80">{b.due}</span>
              </div>
              <span className="text-body font-semibold text-on-surface">{formatIDR(b.amount)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Transaksi Terbaru"
        action={
          <button
            onClick={() => setAddTxOpen(true)}
            className="rounded-full border border-outline-variant/30 px-3 py-1 text-meta text-on-surface-variant/80"
          >
            {transactions.length} entri
          </button>
        }
      >
        {recent.length ? (
          <TransactionList items={recent} />
        ) : (
          <EmptyState
            icon="receipt"
            title="Belum ada transaksi"
            description="Tekan tombol + untuk menambah catatan pertama."
          />
        )}
      </Section>
    </AppShell>
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
