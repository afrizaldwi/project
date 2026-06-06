type LandingFacilitiesProps = {
  facilities: string[];
};

const LandingFacilities = ({ facilities }: LandingFacilitiesProps) => {
  return (
    <section id="fasilitas" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h3 className="mb-2 text-center text-2xl font-bold text-dark">
          Fasilitas Umum
        </h3>
        <p className="mb-10 text-center text-gray-500">
          Semua yang Anda butuhkan sudah tersedia untuk mendukung aktivitas harian.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {facilities.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-primary/10 bg-secondary p-4 text-center"
            >
              <p className="text-sm font-medium text-dark">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFacilities;
