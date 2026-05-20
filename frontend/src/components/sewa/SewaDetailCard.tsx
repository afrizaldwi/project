interface InfoCardProps {
  label: string;
  value: string;
}

const InfoCard = ({ label, value }: InfoCardProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
  </div>
);

interface SewaDetailCardProps {
  nama: string;
  nomorKamar: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
}

const SewaDetailCard = ({ nama, nomorKamar, tanggalMasuk, tanggalKeluar }: SewaDetailCardProps) => {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <InfoCard label="Nama Penghuni" value={nama} />
      <InfoCard label="Nomor Kamar" value={nomorKamar} />
      <InfoCard label="Tanggal Masuk" value={tanggalMasuk} />
      <InfoCard label="Tanggal Keluar Saat Ini" value={tanggalKeluar} />
    </section>
  );
};

export default SewaDetailCard;
