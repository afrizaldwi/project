import type { ChangeEvent } from "react";
import type { KamarTersedia } from "../../types";

interface RoomType {
  id: string;
  name: string;
  rooms: KamarTersedia[];
  priceLabel: string;
  description: string;
}

interface FormState {
  nama_lengkap: string;
  email: string;
  password: string;
  no_hp: string;
  alamat_asal: string;
  id_kamar: string;
  tanggal_masuk: string;
  durasi_sewa_bulan: string;
}

interface FormDataSewaProps {
  form: FormState;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isLoadingRooms: boolean;
  roomTypes: RoomType[];
  selectedType: string;
  selectedTypeRooms: KamarTersedia[];
  selectedRoom: KamarTersedia | undefined;
  totalTagihan: number;
  estimasiCheckOut: string;
  formatRupiah: (value: string | number) => string;
  onTypeSelect: (type: string) => void;
  onRoomSelect: (roomId: number) => void;
}

const FormDataSewa = ({
  form,
  onChange,
  isLoadingRooms,
  roomTypes,
  selectedType,
  selectedTypeRooms,
  selectedRoom,
  totalTagihan,
  estimasiCheckOut,
  formatRupiah,
  onTypeSelect,
  onRoomSelect,
}: FormDataSewaProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-black text-dark">Data Sewa</h2>

      <div className="mb-6">
        <p className="mb-3 text-sm font-black text-dark">Pilih Tipe Kamar</p>

        {isLoadingRooms ? (
          <div className="rounded-xl bg-light p-4 text-sm font-semibold text-dark/50">
            Memuat kamar tersedia...
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="rounded-xl bg-light p-4 text-sm font-semibold text-dark/50">
            Tidak ada kamar tersedia.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {roomTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => onTypeSelect(type.id)}
                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                  selectedType === type.id
                    ? "border-primary bg-secondary shadow-sm"
                    : "border-gray-100 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-black text-dark">{type.name}</p>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-black uppercase text-success">
                    Tersedia
                  </span>
                </div>

                <p className="mt-3 text-sm font-black text-primary">
                  {type.priceLabel} / bln
                </p>
                <p className="mt-1 line-clamp-2 text-xs font-medium text-dark/50">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-black text-dark">Pilih Kamar *</p>

        {selectedType ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
            {selectedTypeRooms.map((room) => (
              <button
                key={room.id_kamar}
                type="button"
                onClick={() => onRoomSelect(room.id_kamar)}
                className={`rounded-xl border-2 p-3 text-xs font-black transition-all ${
                  form.id_kamar === String(room.id_kamar)
                    ? "border-primary bg-primary text-white"
                    : "border-gray-100 text-dark/40 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {room.nomor_kamar}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-light p-4 text-sm font-semibold text-dark/40">
            Pilih tipe kamar terlebih dahulu
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Tanggal Masuk *
          </label>
          <input
            name="tanggal_masuk"
            type="date"
            value={form.tanggal_masuk}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Durasi (Bulan) *
          </label>
          <input
            name="durasi_sewa_bulan"
            type="number"
            min={1}
            value={form.durasi_sewa_bulan}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-secondary p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-primary">Total Tagihan Awal</p>
            <p className="mt-1 text-2xl font-black text-dark">
              {formatRupiah(totalTagihan)}
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-sm font-bold text-primary">Estimasi Check-Out:</p>
            <p className="mt-1 text-lg font-black text-dark">{estimasiCheckOut}</p>
          </div>
        </div>

        {selectedRoom && (
          <div className="mt-4 rounded-xl bg-white p-4 text-sm font-medium text-dark/70">
            <p className="font-black text-dark">Detail kamar terpilih</p>
            <p>Nomor: {selectedRoom.nomor_kamar}</p>
            <p>Luas: {selectedRoom.luas_kamar}</p>
            <p>Fasilitas: {selectedRoom.fasilitas}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FormDataSewa;
