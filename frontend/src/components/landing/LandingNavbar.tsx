import { Link } from "react-router-dom";

type LandingNavbarProps = {
  isScrolled: boolean;
};

const navigationItems = [
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Kamar", href: "#kamar" },
  { label: "Fitur", href: "#fitur" },
  { label: "Tahapan", href: "#tahapan" },
  { label: "Lokasi", href: "#lokasi" },
  { label: "Kontak", href: "#kontak" },
];

const LandingNavbar = ({ isScrolled }: LandingNavbarProps) => {
  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-40 bg-white transition-shadow ${isScrolled ? "shadow-md" : ""
        }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-bold text-primary">Basecamp Kost</a>
        <div className="hidden items-center gap-6 text-sm font-medium text-dark md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
        <Link
          to="/login"
          className="rounded bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-accent"
        >
          Masuk Penghuni
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
