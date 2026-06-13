const footerLinks = [
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Kamar", href: "#kamar" },
  { label: "Fitur", href: "#fitur" },
  { label: "Tahapan", href: "#tahapan" },
  { label: "Lokasi", href: "#lokasi" },
  { label: "Kontak", href: "#kontak" },
];

const LandingFooter = () => {
  return (
    <footer className="bg-accent px-6 py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="mb-1 text-lg font-bold">Basecamp Kost</h1>
          <p className="text-sm text-secondary">
            Jl. Contoh No. 123, Surabaya, Jawa Timur
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-secondary">
          {footerLinks.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
        <p className="text-sm text-secondary">© 2026 Basecamp Kost</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
