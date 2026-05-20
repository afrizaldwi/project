import StatCard from "../ui/StatCard";

interface TamuStatsProps {
  totalTamu: number;
  totalPenghuniVisited: number;
  tamuToday: number;
}

export const TamuStats = ({
  totalTamu,
  totalPenghuniVisited,
  tamuToday,
}: TamuStatsProps) => {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard label="Total Tamu" value={totalTamu.toString()} />
      <StatCard label="Penghuni Dikunjungi" value={totalPenghuniVisited.toString()} />
      <StatCard label="Tamu Hari Ini" value={tamuToday.toString()} />
    </section>
  );
};

export default TamuStats;
