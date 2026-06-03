import PasswordChangeCard from "../../components/profile/PasswordChangeCard";
import useAuth from "../../hook/useAuth";

interface ProfileUser {
  nama_lengkap?: string | null;
  email?: string | null;
  role?: string | null;
  no_hp?: string | null;
  alamat_asal?: string | null;
}

const formatRole = (role?: string | null) => {
  if (!role) return "-";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const AdminProfil = () => {
  const { user: authUser, isLoading } = useAuth();
  const user = authUser as ProfileUser | null;

  if (isLoading) {
    return (
      <main className="p-4 sm:p-6">
        <p className="text-sm text-gray-500">Memuat profil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-4 sm:p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
          Data profil tidak tersedia. Silakan login ulang.
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
          Profil Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {user.nama_lengkap || "Admin"}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-blue-100">
          Informasi akun admin yang sedang login di sistem manajemen kost.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <ProfileSummaryCard label="Role" value={formatRole(user.role)} />
        <ProfileSummaryCard label="Email" value={user.email || "-"} />
        <ProfileSummaryCard label="No. HP" value={user.no_hp || "-"} />
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Detail Akun</h2>
        <p className="mt-1 text-sm text-gray-500">
          Data ini berasal dari akun yang sedang login. Fitur edit profil belum
          diaktifkan pada tahap ini.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ProfileInfoItem label="Nama Lengkap" value={user.nama_lengkap || "-"} />
          <ProfileInfoItem label="Email" value={user.email || "-"} />
          <ProfileInfoItem label="Role" value={formatRole(user.role)} />
          <ProfileInfoItem label="No. HP" value={user.no_hp || "-"} />
          <ProfileInfoItem
            label="Alamat Asal"
            value={user.alamat_asal || "-"}
            fullWidth
          />
        </div>
      </section>

      <PasswordChangeCard />
    </main>
  );
};

interface ProfileSummaryCardProps {
  label: string;
  value: string;
}

const ProfileSummaryCard = ({ label, value }: ProfileSummaryCardProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 break-words text-xl font-bold text-gray-900">{value}</p>
  </div>
);

interface ProfileInfoItemProps {
  label: string;
  value: string;
  fullWidth?: boolean;
}

const ProfileInfoItem = ({ label, value, fullWidth }: ProfileInfoItemProps) => (
  <div
    className={`rounded-xl border border-gray-100 bg-gray-50 p-4 ${fullWidth ? "md:col-span-2" : ""
      }`}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-bold text-gray-900">{value}</p>
  </div>
);

export default AdminProfil;