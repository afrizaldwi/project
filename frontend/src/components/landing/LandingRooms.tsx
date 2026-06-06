import { getKamarStatusDisplay } from "../kamar/kamarStatusDisplay";
import { getStorageUrl } from "../../utils/storageUrl";
import type { LandingKamar } from "../../types";

type LandingRoomsProps = {
  rooms: LandingKamar[];
  facilities: string[];
  formatRupiah: (value: number | string) => string;
};

const LandingRooms = ({ rooms, facilities, formatRupiah }: LandingRoomsProps) => {
  return (
    <section id="kamar" className="bg-light px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h3 className="mb-2 text-center text-2xl font-bold text-dark">
          Daftar Kamar
        </h3>
        <p className="mb-10 text-center text-gray-500">
          Calon penyewa dapat melihat informasi kamar dan status ketersediaan sebelum menghubungi admin.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {rooms.map((room) => {
            const status = getKamarStatusDisplay(room.status_kamar);

            return (
              <div
                key={room.id_kamar}
                className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-light">
                  <span className="text-sm font-medium text-gray-400">
                    Foto kamar belum tersedia
                  </span>
                  {room.foto_url && (
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={getStorageUrl(room.foto_url)}
                      alt={`Kamar ${room.nomor_kamar}`}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h4 className="font-bold text-dark">Kamar {room.nomor_kamar}</h4>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mb-1 text-lg font-bold text-primary">
                    {formatRupiah(room.harga_bulanan)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {facilities.slice(0, 5).map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full bg-secondary px-2 py-1 text-xs text-primary"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {rooms.length === 0 && (
            <div className="rounded-xl border border-primary/10 bg-white p-6 text-center text-sm text-gray-500 sm:col-span-3">
              Data kamar belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingRooms;
