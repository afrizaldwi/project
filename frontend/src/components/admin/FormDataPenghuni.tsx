import type { ChangeEvent } from "react";

interface FormState {
  nama_lengkap: string;
  email: string;
  password: string;
  no_hp: string;
  alamat_asal: string;
  id_kamar: string;
  tanggal_masuk: string;
  durasi_sewa_bulan: string;
  metode_pembayaran: string;
  bukti_bayar: File | null;
}

interface FormDataPenghuniProps {
  form: FormState;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const FormDataPenghuni = ({ form, onChange }: FormDataPenghuniProps) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-black text-dark">Data Penghuni</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Nama Lengkap *
          </label>
          <input
            name="nama_lengkap"
            value={form.nama_lengkap}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            No. HP *
          </label>
          <input
            name="no_hp"
            type="tel"
            value={form.no_hp}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            disabled
            required
            className="w-full rounded-xl border border-gray-200 bg-light p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs font-medium text-dark/40">
            Email dibuat otomatis dari nama, tapi masih bisa diedit.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-dark/70">
            Password *
          </label>
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            disabled
            required
            className="w-full rounded-xl border border-gray-200 bg-light p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs font-medium text-dark/40">
            Berikan password ini kepada penghuni.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-bold text-dark/70">
          Alamat Asal
        </label>
        <textarea
          name="alamat_asal"
          value={form.alamat_asal}
          onChange={onChange}
          rows={3}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-dark">
          Metode Pembayaran Awal
        </label>
        <select
          name="metode_pembayaran"
          value={form.metode_pembayaran}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none focus:border-primary"
          required
        >
          <option value="">Pilih metode pembayaran</option>
          <option value="Tunai">Tunai</option>
          <option value="Transfer Bank">Transfer Bank</option>
          <option value="E-Wallet">E-Wallet</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-dark">
          Bukti Pembayaran Awal <span className="text-dark/40">(Opsional)</span>
        </label>
        <input
          type="file"
          name="bukti_bayar"
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs font-medium text-dark/40">
          Kosongkan jika pembayaran diterima langsung/tunai. Maksimal 5MB.
        </p>
      </div>
    </section>
  );
};

export default FormDataPenghuni;