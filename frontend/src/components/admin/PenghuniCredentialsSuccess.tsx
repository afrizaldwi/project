interface PenghuniCredentialsSuccessProps {
  credentials: {
    email: string;
    temporary_password: string;
  };
  phoneNumber: string;
  onGoToPenghuni: () => void;
}

const normalizeIndonesianPhoneNumber = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
};

const buildWhatsAppUrl = (
  phoneNumber: string,
  credentials: PenghuniCredentialsSuccessProps["credentials"]
) => {
  const normalizedPhoneNumber = normalizeIndonesianPhoneNumber(phoneNumber);
  const message = `Halo, akun penyewa Basecamp Kost Anda sudah dibuat.\n\nEmail: ${credentials.email}\nPassword sementara: ${credentials.temporary_password}\n\nSilakan masuk menggunakan kredensial tersebut. Simpan password ini dengan aman.`;

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
};

const PenghuniCredentialsSuccess = ({
  credentials,
  phoneNumber,
  onGoToPenghuni,
}: PenghuniCredentialsSuccessProps) => {
  const normalizedPhoneNumber = normalizeIndonesianPhoneNumber(phoneNumber);
  const whatsappUrl = buildWhatsAppUrl(normalizedPhoneNumber, credentials);
  const canShareToWhatsApp = normalizedPhoneNumber.length > 0;

  return (
    <section className="rounded-2xl border border-success/20 bg-success/10 p-6 shadow-sm">
      <h2 className="text-lg font-black text-dark">Penghuni berhasil ditambahkan</h2>
      <p className="mt-1 text-sm font-semibold text-dark/60">
        Simpan dan berikan kredensial ini kepada penyewa. Password sementara hanya ditampilkan satu kali.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-dark/50">
            Email
          </label>
          <input
            readOnly
            value={credentials.email}
            className="w-full rounded-xl border border-success/20 bg-white p-3 text-sm font-bold text-dark outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-black uppercase text-dark/50">
            Password Sementara
          </label>
          <input
            readOnly
            value={credentials.temporary_password}
            className="w-full rounded-xl border border-success/20 bg-white p-3 text-sm font-bold text-dark outline-none"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onGoToPenghuni}
          className="rounded-xl border border-success/30 bg-white px-4 py-2 text-center text-sm font-black text-success hover:bg-success/10"
        >
          Ke Data Penghuni
        </button>
        {canShareToWhatsApp && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-success px-4 py-2 text-sm font-black text-white hover:opacity-90"
          >
            Bagikan via WhatsApp
          </a>
        )}
      </div>
    </section>
  );
};

export default PenghuniCredentialsSuccess;
