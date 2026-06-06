const LandingHero = () => {
  return (
    <section className="bg-secondary px-6 pb-20 pt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
            Informasi Kost Online
          </p>
          <h2 className="mb-4 text-4xl font-bold leading-tight text-dark lg:text-5xl">
            Hunian Nyaman <br />
            <span className="text-primary">di Tengah Kota</span>
          </h2>
          <p className="mb-2 text-gray-500">Jl. No. 123, Surabaya, Jawa Timur</p>
          <p className="mb-8 max-w-lg text-gray-500">
            Lihat informasi kost, fasilitas, ketersediaan kamar, dan alur penyewaan sebelum menghubungi admin secara online.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#kamar"
              className="rounded bg-primary px-6 py-3 text-center font-medium text-white transition-colors hover:bg-accent"
            >
              Lihat Kamar
            </a>

            <a
              href="#tahapan"
              className="rounded border border-primary px-6 py-3 text-center font-medium text-primary transition-colors hover:bg-secondary"
            >
              Tahapan Menyewa
            </a>
          </div>
        </div>
        <div className="w-full flex-1">
          <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-light shadow-sm">
            <img
              src="/hero.webp"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
