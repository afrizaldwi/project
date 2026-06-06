const rentalSteps = [
  {
    title: "Lihat Informasi Kost",
    description: "Calon penyewa dapat melihat informasi kost, fasilitas, dan ketersediaan kamar melalui landing page.",
  },
  {
    title: "Hubungi Admin",
    description: "Calon penyewa menghubungi admin untuk konfirmasi kamar dan proses penyewaan.",
  },
  {
    title: "Konfirmasi Data dan Pembayaran Awal",
    description: "Calon penyewa melengkapi data dan melakukan pembayaran awal sesuai arahan admin.",
  },
  {
    title: "Penghuni Menerima Akun Sdari Admin",
    description: "Setelah proses pendaftaran disetujui, penghuni menerima akun dari admin untuk mengakses sistem",
  },
  {
    title: "Penyewa Login ke Aplikasi",
    description: "Penyewa dapat login untuk melihat tagihan, mengunggah bukti pembayaran, melihat riwayat sewa, dan mengirim keluhan.",
  },
];

const LandingSteps = () => {
  return (
    <section id="tahapan" className="bg-secondary px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h3 className="mb-2 text-center text-2xl font-bold text-dark">
          Cara Menjadi Penghuni
        </h3>
        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-500">
          Alur berikut membantu calon penyewa memahami proses dari melihat informasi kost sampai menggunakan aplikasi sebagai penghuni.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {rentalSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-lg border border-primary/10 bg-white p-5 shadow-sm"
            >
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {index + 1}
              </span>
              <h4 className="mb-2 font-bold text-dark">{step.title}</h4>
              <p className="text-sm leading-6 text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingSteps;
