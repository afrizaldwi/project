import StatCard from "../ui/StatCard";

interface KeluhanStatsProps {
  total: number;
  pending: number;
  proses: number;
  selesai: number;
}

export const KeluhanStats = ({ total, pending, proses, selesai }: KeluhanStatsProps) => {
  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-6">
      <StatCard label="Total" value={total.toString()} />
      <StatCard label="Menunggu" value={pending.toString()} />
      <StatCard label="Diproses" value={proses.toString()} />
      <StatCard label="Selesai" value={selesai.toString()} />
    </section>
  );
};

export default KeluhanStats;
