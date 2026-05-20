import type { Kamar } from "../../types";
import KamarCard from "./KamarCard";

interface KamarGridProps {
  kamarList: Kamar[];
  onEdit: (id: number) => void;
  onDelete: (kamar: { id_kamar: number; nomor_kamar: string }) => void;
}

const KamarGrid = ({ kamarList, onEdit, onDelete }: KamarGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {kamarList.map((kamar) => (
        <KamarCard key={kamar.id_kamar} kamar={kamar} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default KamarGrid;
