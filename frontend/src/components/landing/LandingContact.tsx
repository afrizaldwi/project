import { Link } from "react-router-dom";

const LandingContact = () => {
  return (
    <>
      <section id="lokasi" className="bg-light px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-2 text-center text-2xl font-bold text-dark">
            Lokasi Kost
          </h3>
          <p className="mb-10 text-center text-gray-500">
            Strategis dan mudah dijangkau oleh calon penyewa.
          </p>
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            <div className="w-full flex-1">
              <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11192.32100396721!2d112.78516836629777!3d-7.344571974979252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fba48250fc25%3A0xe030cbbc9482d4fd!2sUniversitas%20Islam%20Negeri%20Sunan%20Ampel%20Kampus%202!5e0!3m2!1sid!2sid!4v1779324784778!5m2!1sid!2sid"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  width="100%"
                  height="100%"
                  title="Peta lokasi Kost Bahagia"
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-3 font-bold text-dark">Kost Bahagia</h4>
              <p className="mb-2 text-gray-500">
                Jl. Contoh No. 123, Surabaya, Jawa Timur 60123
              </p>
              <p className="mb-4 text-gray-500">Dekat dengan:</p>
              <ul className="space-y-1 text-sm text-gray-500">
                <li>Universitas Contoh (500m)</li>
                <li>RS Contoh (1km)</li>
                <li>Pusat Perbelanjaan Contoh (800m)</li>
                <li>Halte Bus (200m)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="kontak" className="bg-primary px-6 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 lg:flex-row">
          <div>
            <h3 className="mb-2 text-2xl font-bold">Tertarik untuk Tinggal?</h3>
            <p className="mb-4 text-secondary">
              Hubungi admin untuk menanyakan kamar, konfirmasi penyewaan, dan informasi pembayaran awal.
            </p>
            <div className="space-y-2 text-sm text-secondary">
              <p>Telepon: 08123456789</p>
              <p>Email: kostbahagia@email.com</p>
              <p>WhatsApp: 08123456789</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="rounded bg-white px-6 py-3 text-center font-medium text-primary transition-colors hover:bg-secondary"
            >
              Hubungi via WhatsApp
            </a>
            <Link
              to="/login"
              className="rounded border border-white px-6 py-3 text-center font-medium text-white transition-colors hover:bg-accent"
            >
              Masuk Penghuni
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingContact;
