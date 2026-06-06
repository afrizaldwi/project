const appFeatures = [
  {
    title: "Informasi Kamar",
    description: "Calon penyewa dapat melihat pilihan kamar, harga bulanan, fasilitas, dan status ketersediaan.",
  },
  {
    title: "Tagihan dan Pembayaran",
    description: "Penyewa dapat memantau tagihan serta mengunggah bukti pembayaran melalui aplikasi.",
  },
  {
    title: "Riwayat Sewa",
    description: "Data masa sewa membantu penyewa dan admin melihat periode hunian dengan lebih rapi.",
  },
  {
    title: "Keluhan Kerusakan",
    description: "Penyewa dapat mengirim keluhan atau laporan kerusakan agar admin dapat menindaklanjuti.",
  },
];

const LandingAbout = () => {
  return (
    <section id="fitur" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-center gap-10 lg:flex-row">
          <div className="flex-1">
            <div className="flex h-64 items-center justify-center max-md:h-full overflow-hidden rounded-xl bg-light shadow-sm">
              <img
                src="/about.webp"
                alt="Lingkungan Kost Bahagia"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
              Kost Nyaman dengan Layanan Digital
            </p>
            <h3 className="mb-4 text-2xl font-bold text-dark">
              Informasi Kost untuk Calon Penyewa dan Pengelolaan untuk Penghuni
            </h3>
            <p className="mb-4 text-gray-500">
              Kost Bahagia adalah hunian nyaman yang berlokasi strategis di pusat kota Surabaya. Landing page ini membantu calon penyewa melihat informasi kost sebelum menghubungi admin.
            </p>
            <p className="text-gray-500">
              Setelah terdaftar, penyewa dapat menggunakan aplikasi untuk melihat tagihan, pembayaran, riwayat sewa, dan menyampaikan keluhan secara online.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {appFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm"
            >
              <h4 className="mb-2 font-bold text-dark">{feature.title}</h4>
              <p className="text-sm leading-6 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
