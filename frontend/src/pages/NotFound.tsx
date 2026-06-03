import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
      <section className="w-full p-8 text-center">
        <p className="mb-3 text-5xl font-bold text-primary">404</p>
        <h1 className="mb-3 text-2xl font-bold text-dark">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mb-6 text-sm leading-6 text-dark">
          Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded bg-primary px-5 py-2 text-sm font-medium text-light hover:bg-accent"
        >
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
