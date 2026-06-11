--
-- PostgreSQL database dump
--

\restrict DZgzNrQnWeNYq7zcbmaeLgfJ5LyOms3nqAej4HKTD2TKfenFGnv1Kt2ozdYPrt9

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: buku_tamu; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.buku_tamu (
    id_tamu bigint NOT NULL,
    nama_tamu character varying(100) NOT NULL,
    no_hp_tamu character varying(20),
    bertemu_dengan bigint,
    keperluan text,
    waktu_berkunjung timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.buku_tamu OWNER TO kost_user;

--
-- Name: buku_tamu_id_tamu_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.buku_tamu_id_tamu_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buku_tamu_id_tamu_seq OWNER TO kost_user;

--
-- Name: buku_tamu_id_tamu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.buku_tamu_id_tamu_seq OWNED BY public.buku_tamu.id_tamu;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache OWNER TO kost_user;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO kost_user;

--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO kost_user;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO kost_user;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO kost_user;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO kost_user;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO kost_user;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: kamar; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.kamar (
    id_kamar bigint NOT NULL,
    nomor_kamar character varying(10) NOT NULL,
    fasilitas text,
    harga_bulanan numeric(15,2) NOT NULL,
    luas_kamar character varying(50),
    foto_kamar character varying(255),
    status_kamar character varying(255) DEFAULT 'tersedia'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT kamar_status_kamar_check CHECK (((status_kamar)::text = ANY ((ARRAY['tersedia'::character varying, 'terisi'::character varying, 'perbaikan'::character varying])::text[])))
);


ALTER TABLE public.kamar OWNER TO kost_user;

--
-- Name: kamar_id_kamar_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.kamar_id_kamar_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kamar_id_kamar_seq OWNER TO kost_user;

--
-- Name: kamar_id_kamar_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.kamar_id_kamar_seq OWNED BY public.kamar.id_kamar;


--
-- Name: keluhan; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.keluhan (
    id_keluhan bigint NOT NULL,
    id_sewa bigint NOT NULL,
    judul_keluhan character varying(100) NOT NULL,
    deskripsi_keluhan text NOT NULL,
    foto_kerusakan character varying(255),
    status_keluhan character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    tanggal_lapor timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tanggal_selesai timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT keluhan_status_keluhan_check CHECK (((status_keluhan)::text = ANY ((ARRAY['pending'::character varying, 'proses'::character varying, 'selesai'::character varying])::text[])))
);


ALTER TABLE public.keluhan OWNER TO kost_user;

--
-- Name: keluhan_id_keluhan_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.keluhan_id_keluhan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.keluhan_id_keluhan_seq OWNER TO kost_user;

--
-- Name: keluhan_id_keluhan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.keluhan_id_keluhan_seq OWNED BY public.keluhan.id_keluhan;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO kost_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO kost_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: mobile_device_tokens; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.mobile_device_tokens (
    id bigint NOT NULL,
    id_user bigint NOT NULL,
    device_token text NOT NULL,
    platform character varying(20) DEFAULT 'android'::character varying NOT NULL,
    last_used_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.mobile_device_tokens OWNER TO kost_user;

--
-- Name: mobile_device_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.mobile_device_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mobile_device_tokens_id_seq OWNER TO kost_user;

--
-- Name: mobile_device_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.mobile_device_tokens_id_seq OWNED BY public.mobile_device_tokens.id;


--
-- Name: notifikasis; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.notifikasis (
    id bigint NOT NULL,
    id_user bigint NOT NULL,
    id_tagihan bigint NOT NULL,
    role_target character varying(20) NOT NULL,
    tipe character varying(50) NOT NULL,
    judul character varying(255) NOT NULL,
    pesan text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp(0) without time zone,
    pushed_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    last_reminded_at date,
    reminder_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.notifikasis OWNER TO kost_user;

--
-- Name: notifikasis_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.notifikasis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifikasis_id_seq OWNER TO kost_user;

--
-- Name: notifikasis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.notifikasis_id_seq OWNED BY public.notifikasis.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO kost_user;

--
-- Name: pembayaran; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.pembayaran (
    id_pembayaran bigint NOT NULL,
    id_tagihan bigint NOT NULL,
    tanggal_bayar date NOT NULL,
    jumlah_bayar numeric(15,2) NOT NULL,
    metode_pembayaran character varying(50),
    bukti_bayar character varying(255),
    status_verifikasi character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    catatan_admin text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT pembayaran_status_verifikasi_check CHECK (((status_verifikasi)::text = ANY ((ARRAY['pending'::character varying, 'diterima'::character varying, 'ditolak'::character varying])::text[])))
);


ALTER TABLE public.pembayaran OWNER TO kost_user;

--
-- Name: pembayaran_id_pembayaran_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.pembayaran_id_pembayaran_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pembayaran_id_pembayaran_seq OWNER TO kost_user;

--
-- Name: pembayaran_id_pembayaran_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.pembayaran_id_pembayaran_seq OWNED BY public.pembayaran.id_pembayaran;


--
-- Name: pengeluaran; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.pengeluaran (
    id_pengeluaran bigint NOT NULL,
    judul_pengeluaran character varying(100) NOT NULL,
    deskripsi text,
    jumlah_pengeluaran numeric(15,2) NOT NULL,
    tanggal_pengeluaran date NOT NULL,
    bukti_foto character varying(255),
    dibuat_oleh bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.pengeluaran OWNER TO kost_user;

--
-- Name: pengeluaran_id_pengeluaran_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.pengeluaran_id_pengeluaran_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pengeluaran_id_pengeluaran_seq OWNER TO kost_user;

--
-- Name: pengeluaran_id_pengeluaran_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.pengeluaran_id_pengeluaran_seq OWNED BY public.pengeluaran.id_pengeluaran;


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO kost_user;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO kost_user;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: riwayat_sewa; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.riwayat_sewa (
    id_sewa bigint NOT NULL,
    id_user bigint NOT NULL,
    id_kamar bigint NOT NULL,
    tanggal_masuk date NOT NULL,
    tanggal_keluar date,
    harga_deal numeric(15,2) NOT NULL,
    durasi_sewa_bulan integer DEFAULT 1 NOT NULL,
    status_sewa character varying(255) DEFAULT 'aktif'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT riwayat_sewa_status_sewa_check CHECK (((status_sewa)::text = ANY ((ARRAY['aktif'::character varying, 'selesai'::character varying, 'dibatalkan'::character varying])::text[])))
);


ALTER TABLE public.riwayat_sewa OWNER TO kost_user;

--
-- Name: riwayat_sewa_id_sewa_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.riwayat_sewa_id_sewa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_sewa_id_sewa_seq OWNER TO kost_user;

--
-- Name: riwayat_sewa_id_sewa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.riwayat_sewa_id_sewa_seq OWNED BY public.riwayat_sewa.id_sewa;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO kost_user;

--
-- Name: tagihan; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.tagihan (
    id_tagihan bigint NOT NULL,
    id_sewa bigint NOT NULL,
    kode_invoice character varying(50) NOT NULL,
    tanggal_tagihan date NOT NULL,
    tanggal_jatuh_tempo date NOT NULL,
    total_tagihan numeric(15,2) NOT NULL,
    status_tagihan character varying(255) DEFAULT 'belum_bayar'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT tagihan_status_tagihan_check CHECK (((status_tagihan)::text = ANY ((ARRAY['belum_bayar'::character varying, 'lunas'::character varying, 'telat'::character varying, 'dibatalkan'::character varying])::text[])))
);


ALTER TABLE public.tagihan OWNER TO kost_user;

--
-- Name: tagihan_id_tagihan_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.tagihan_id_tagihan_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tagihan_id_tagihan_seq OWNER TO kost_user;

--
-- Name: tagihan_id_tagihan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.tagihan_id_tagihan_seq OWNED BY public.tagihan.id_tagihan;


--
-- Name: users; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'penyewa'::character varying NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    no_hp character varying(20) NOT NULL,
    foto_profil character varying(255),
    alamat_asal text,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'penyewa'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO kost_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO kost_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: kost_user
--

CREATE TABLE public.visitors (
    id bigint NOT NULL,
    visitor_key character varying(64) NOT NULL,
    visit_date date NOT NULL,
    country character varying(100),
    city character varying(100),
    browser_name character varying(50),
    last_seen_at timestamp(0) without time zone,
    analytics_consent boolean DEFAULT false NOT NULL,
    location_consent boolean DEFAULT false NOT NULL,
    browser_consent boolean DEFAULT false NOT NULL
);


ALTER TABLE public.visitors OWNER TO kost_user;

--
-- Name: visitors_id_seq; Type: SEQUENCE; Schema: public; Owner: kost_user
--

CREATE SEQUENCE public.visitors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitors_id_seq OWNER TO kost_user;

--
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kost_user
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- Name: buku_tamu id_tamu; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.buku_tamu ALTER COLUMN id_tamu SET DEFAULT nextval('public.buku_tamu_id_tamu_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: kamar id_kamar; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.kamar ALTER COLUMN id_kamar SET DEFAULT nextval('public.kamar_id_kamar_seq'::regclass);


--
-- Name: keluhan id_keluhan; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.keluhan ALTER COLUMN id_keluhan SET DEFAULT nextval('public.keluhan_id_keluhan_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: mobile_device_tokens id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.mobile_device_tokens ALTER COLUMN id SET DEFAULT nextval('public.mobile_device_tokens_id_seq'::regclass);


--
-- Name: notifikasis id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.notifikasis ALTER COLUMN id SET DEFAULT nextval('public.notifikasis_id_seq'::regclass);


--
-- Name: pembayaran id_pembayaran; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.pembayaran ALTER COLUMN id_pembayaran SET DEFAULT nextval('public.pembayaran_id_pembayaran_seq'::regclass);


--
-- Name: pengeluaran id_pengeluaran; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.pengeluaran ALTER COLUMN id_pengeluaran SET DEFAULT nextval('public.pengeluaran_id_pengeluaran_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: riwayat_sewa id_sewa; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.riwayat_sewa ALTER COLUMN id_sewa SET DEFAULT nextval('public.riwayat_sewa_id_sewa_seq'::regclass);


--
-- Name: tagihan id_tagihan; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.tagihan ALTER COLUMN id_tagihan SET DEFAULT nextval('public.tagihan_id_tagihan_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- Data for Name: buku_tamu; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.buku_tamu (id_tamu, nama_tamu, no_hp_tamu, bertemu_dengan, keperluan, waktu_berkunjung, created_at, updated_at) FROM stdin;
1	PAG-DEMO Tamu 001	0812340001	3	Demo pagination	2026-06-07 09:03:28	2026-06-07 09:04:28	2026-06-07 09:04:28
2	PAG-DEMO Tamu 002	0812340002	4	Demo pagination	2026-06-07 09:02:29	2026-06-07 09:04:29	2026-06-07 09:04:29
3	PAG-DEMO Tamu 003	0812340003	5	Demo pagination	2026-06-07 09:01:29	2026-06-07 09:04:29	2026-06-07 09:04:29
4	PAG-DEMO Tamu 004	0812340004	6	Demo pagination	2026-06-07 09:00:29	2026-06-07 09:04:29	2026-06-07 09:04:29
5	PAG-DEMO Tamu 005	0812340005	7	Demo pagination	2026-06-07 08:59:29	2026-06-07 09:04:29	2026-06-07 09:04:29
6	PAG-DEMO Tamu 006	0812340006	8	Demo pagination	2026-06-07 08:58:29	2026-06-07 09:04:29	2026-06-07 09:04:29
7	PAG-DEMO Tamu 007	0812340007	9	Demo pagination	2026-06-07 08:57:30	2026-06-07 09:04:30	2026-06-07 09:04:30
8	PAG-DEMO Tamu 008	0812340008	10	Demo pagination	2026-06-07 08:56:30	2026-06-07 09:04:30	2026-06-07 09:04:30
9	PAG-DEMO Tamu 009	0812340009	11	Demo pagination	2026-06-07 08:55:30	2026-06-07 09:04:30	2026-06-07 09:04:30
10	PAG-DEMO Tamu 010	0812340010	12	Demo pagination	2026-06-07 08:54:30	2026-06-07 09:04:30	2026-06-07 09:04:30
11	PAG-DEMO Tamu 011	0812340011	13	Demo pagination	2026-06-07 08:53:30	2026-06-07 09:04:30	2026-06-07 09:04:30
12	PAG-DEMO Tamu 012	0812340012	14	Demo pagination	2026-06-07 08:52:31	2026-06-07 09:04:31	2026-06-07 09:04:31
13	PAG-DEMO Tamu 013	0812340013	15	Demo pagination	2026-06-07 08:51:31	2026-06-07 09:04:31	2026-06-07 09:04:31
14	PAG-DEMO Tamu 014	0812340014	16	Demo pagination	2026-06-07 08:50:31	2026-06-07 09:04:31	2026-06-07 09:04:31
15	PAG-DEMO Tamu 015	0812340015	17	Demo pagination	2026-06-07 08:49:31	2026-06-07 09:04:31	2026-06-07 09:04:31
16	PAG-DEMO Tamu 016	0812340016	18	Demo pagination	2026-06-07 08:48:31	2026-06-07 09:04:31	2026-06-07 09:04:31
17	PAG-DEMO Tamu 017	0812340017	19	Demo pagination	2026-06-07 08:47:32	2026-06-07 09:04:32	2026-06-07 09:04:32
18	PAG-DEMO Tamu 018	0812340018	20	Demo pagination	2026-06-07 08:46:32	2026-06-07 09:04:32	2026-06-07 09:04:32
19	PAG-DEMO Tamu 019	0812340019	21	Demo pagination	2026-06-07 08:45:32	2026-06-07 09:04:32	2026-06-07 09:04:32
20	PAG-DEMO Tamu 020	0812340020	22	Demo pagination	2026-06-07 08:44:32	2026-06-07 09:04:32	2026-06-07 09:04:32
21	PAG-DEMO Tamu 021	0812340021	23	Demo pagination	2026-06-07 08:43:32	2026-06-07 09:04:32	2026-06-07 09:04:32
22	PAG-DEMO Tamu 022	0812340022	24	Demo pagination	2026-06-07 08:42:33	2026-06-07 09:04:33	2026-06-07 09:04:33
23	PAG-DEMO Tamu 023	0812340023	25	Demo pagination	2026-06-07 08:41:33	2026-06-07 09:04:33	2026-06-07 09:04:33
24	PAG-DEMO Tamu 024	0812340024	26	Demo pagination	2026-06-07 08:40:33	2026-06-07 09:04:33	2026-06-07 09:04:33
25	PAG-DEMO Tamu 025	0812340025	27	Demo pagination	2026-06-07 08:39:33	2026-06-07 09:04:33	2026-06-07 09:04:33
26	PAG-DEMO Tamu 026	0812340026	28	Demo pagination	2026-06-07 08:38:33	2026-06-07 09:04:33	2026-06-07 09:04:33
27	PAG-DEMO Tamu 027	0812340027	29	Demo pagination	2026-06-07 08:37:34	2026-06-07 09:04:34	2026-06-07 09:04:34
28	PAG-DEMO Tamu 028	0812340028	30	Demo pagination	2026-06-07 08:36:34	2026-06-07 09:04:34	2026-06-07 09:04:34
29	PAG-DEMO Tamu 029	0812340029	31	Demo pagination	2026-06-07 08:35:34	2026-06-07 09:04:34	2026-06-07 09:04:34
30	PAG-DEMO Tamu 030	0812340030	32	Demo pagination	2026-06-07 08:34:34	2026-06-07 09:04:34	2026-06-07 09:04:34
31	PAG-DEMO Tamu 031	0812340031	33	Demo pagination	2026-06-07 08:33:34	2026-06-07 09:04:34	2026-06-07 09:04:34
32	PAG-DEMO Tamu 032	0812340032	34	Demo pagination	2026-06-07 08:32:35	2026-06-07 09:04:35	2026-06-07 09:04:35
33	PAG-DEMO Tamu 033	0812340033	35	Demo pagination	2026-06-07 08:31:35	2026-06-07 09:04:35	2026-06-07 09:04:35
34	PAG-DEMO Tamu 034	0812340034	36	Demo pagination	2026-06-07 08:30:35	2026-06-07 09:04:35	2026-06-07 09:04:35
35	PAG-DEMO Tamu 035	0812340035	37	Demo pagination	2026-06-07 08:29:35	2026-06-07 09:04:35	2026-06-07 09:04:35
36	PAG-DEMO Tamu 036	0812340036	38	Demo pagination	2026-06-07 08:28:35	2026-06-07 09:04:35	2026-06-07 09:04:35
37	PAG-DEMO Tamu 037	0812340037	39	Demo pagination	2026-06-07 08:27:36	2026-06-07 09:04:36	2026-06-07 09:04:36
38	PAG-DEMO Tamu 038	0812340038	40	Demo pagination	2026-06-07 08:26:36	2026-06-07 09:04:36	2026-06-07 09:04:36
39	PAG-DEMO Tamu 039	0812340039	41	Demo pagination	2026-06-07 08:25:36	2026-06-07 09:04:36	2026-06-07 09:04:36
40	PAG-DEMO Tamu 040	0812340040	42	Demo pagination	2026-06-07 08:24:36	2026-06-07 09:04:36	2026-06-07 09:04:36
41	PAG-DEMO Tamu 041	0812340041	43	Demo pagination	2026-06-07 08:23:36	2026-06-07 09:04:36	2026-06-07 09:04:36
42	PAG-DEMO Tamu 042	0812340042	44	Demo pagination	2026-06-07 08:22:37	2026-06-07 09:04:37	2026-06-07 09:04:37
43	PAG-DEMO Tamu 043	0812340043	45	Demo pagination	2026-06-07 08:21:37	2026-06-07 09:04:37	2026-06-07 09:04:37
44	PAG-DEMO Tamu 044	0812340044	46	Demo pagination	2026-06-07 08:20:37	2026-06-07 09:04:37	2026-06-07 09:04:37
45	PAG-DEMO Tamu 045	0812340045	47	Demo pagination	2026-06-07 08:19:37	2026-06-07 09:04:37	2026-06-07 09:04:37
46	PAG-DEMO Tamu 046	0812340046	48	Demo pagination	2026-06-07 08:18:38	2026-06-07 09:04:38	2026-06-07 09:04:38
47	PAG-DEMO Tamu 047	0812340047	49	Demo pagination	2026-06-07 08:17:38	2026-06-07 09:04:38	2026-06-07 09:04:38
48	PAG-DEMO Tamu 048	0812340048	50	Demo pagination	2026-06-07 08:16:38	2026-06-07 09:04:38	2026-06-07 09:04:38
49	PAG-DEMO Tamu 049	0812340049	51	Demo pagination	2026-06-07 08:15:38	2026-06-07 09:04:38	2026-06-07 09:04:38
50	PAG-DEMO Tamu 050	0812340050	52	Demo pagination	2026-06-07 08:14:38	2026-06-07 09:04:38	2026-06-07 09:04:38
51	PAG-DEMO Tamu 051	0812340051	53	Demo pagination	2026-06-07 08:13:39	2026-06-07 09:04:39	2026-06-07 09:04:39
52	PAG-DEMO Tamu 052	0812340052	54	Demo pagination	2026-06-07 08:12:39	2026-06-07 09:04:39	2026-06-07 09:04:39
53	PAG-DEMO Tamu 053	0812340053	55	Demo pagination	2026-06-07 08:11:39	2026-06-07 09:04:39	2026-06-07 09:04:39
54	PAG-DEMO Tamu 054	0812340054	56	Demo pagination	2026-06-07 08:10:39	2026-06-07 09:04:39	2026-06-07 09:04:39
55	PAG-DEMO Tamu 055	0812340055	57	Demo pagination	2026-06-07 08:09:39	2026-06-07 09:04:39	2026-06-07 09:04:39
56	PAG-DEMO Tamu 056	0812340056	58	Demo pagination	2026-06-07 08:08:40	2026-06-07 09:04:40	2026-06-07 09:04:40
57	PAG-DEMO Tamu 057	0812340057	59	Demo pagination	2026-06-07 08:07:40	2026-06-07 09:04:40	2026-06-07 09:04:40
58	PAG-DEMO Tamu 058	0812340058	60	Demo pagination	2026-06-07 08:06:40	2026-06-07 09:04:40	2026-06-07 09:04:40
59	PAG-DEMO Tamu 059	0812340059	61	Demo pagination	2026-06-07 08:05:40	2026-06-07 09:04:40	2026-06-07 09:04:40
60	PAG-DEMO Tamu 060	0812340060	62	Demo pagination	2026-06-07 08:04:40	2026-06-07 09:04:40	2026-06-07 09:04:40
61	PAG-DEMO Tamu 061	0812340061	63	Demo pagination	2026-06-07 08:03:41	2026-06-07 09:04:41	2026-06-07 09:04:41
62	PAG-DEMO Tamu 062	0812340062	64	Demo pagination	2026-06-07 08:02:41	2026-06-07 09:04:41	2026-06-07 09:04:41
63	PAG-DEMO Tamu 063	0812340063	65	Demo pagination	2026-06-07 08:01:41	2026-06-07 09:04:41	2026-06-07 09:04:41
64	PAG-DEMO Tamu 064	0812340064	66	Demo pagination	2026-06-07 08:00:41	2026-06-07 09:04:41	2026-06-07 09:04:41
65	PAG-DEMO Tamu 065	0812340065	67	Demo pagination	2026-06-07 07:59:41	2026-06-07 09:04:41	2026-06-07 09:04:41
66	PAG-DEMO Tamu 066	0812340066	68	Demo pagination	2026-06-07 07:58:42	2026-06-07 09:04:42	2026-06-07 09:04:42
67	PAG-DEMO Tamu 067	0812340067	69	Demo pagination	2026-06-07 07:57:42	2026-06-07 09:04:42	2026-06-07 09:04:42
68	PAG-DEMO Tamu 068	0812340068	70	Demo pagination	2026-06-07 07:56:42	2026-06-07 09:04:42	2026-06-07 09:04:42
69	PAG-DEMO Tamu 069	0812340069	71	Demo pagination	2026-06-07 07:55:42	2026-06-07 09:04:42	2026-06-07 09:04:42
70	PAG-DEMO Tamu 070	0812340070	72	Demo pagination	2026-06-07 07:54:42	2026-06-07 09:04:42	2026-06-07 09:04:42
71	PAG-DEMO Tamu 071	0812340071	73	Demo pagination	2026-06-07 07:53:43	2026-06-07 09:04:43	2026-06-07 09:04:43
72	PAG-DEMO Tamu 072	0812340072	74	Demo pagination	2026-06-07 07:52:43	2026-06-07 09:04:43	2026-06-07 09:04:43
73	PAG-DEMO Tamu 073	0812340073	75	Demo pagination	2026-06-07 07:51:43	2026-06-07 09:04:43	2026-06-07 09:04:43
74	PAG-DEMO Tamu 074	0812340074	76	Demo pagination	2026-06-07 07:50:43	2026-06-07 09:04:43	2026-06-07 09:04:43
75	PAG-DEMO Tamu 075	0812340075	77	Demo pagination	2026-06-07 07:49:43	2026-06-07 09:04:43	2026-06-07 09:04:43
76	PAG-DEMO Tamu 076	0812340076	78	Demo pagination	2026-06-07 07:48:44	2026-06-07 09:04:44	2026-06-07 09:04:44
77	PAG-DEMO Tamu 077	0812340077	79	Demo pagination	2026-06-07 07:47:44	2026-06-07 09:04:44	2026-06-07 09:04:44
78	PAG-DEMO Tamu 078	0812340078	80	Demo pagination	2026-06-07 07:46:44	2026-06-07 09:04:44	2026-06-07 09:04:44
79	PAG-DEMO Tamu 079	0812340079	81	Demo pagination	2026-06-07 07:45:44	2026-06-07 09:04:44	2026-06-07 09:04:44
80	PAG-DEMO Tamu 080	0812340080	82	Demo pagination	2026-06-07 07:44:44	2026-06-07 09:04:44	2026-06-07 09:04:44
81	PAG-DEMO Tamu 081	0812340081	83	Demo pagination	2026-06-07 07:43:45	2026-06-07 09:04:45	2026-06-07 09:04:45
82	PAG-DEMO Tamu 082	0812340082	84	Demo pagination	2026-06-07 07:42:45	2026-06-07 09:04:45	2026-06-07 09:04:45
83	PAG-DEMO Tamu 083	0812340083	85	Demo pagination	2026-06-07 07:41:45	2026-06-07 09:04:45	2026-06-07 09:04:45
84	PAG-DEMO Tamu 084	0812340084	86	Demo pagination	2026-06-07 07:40:45	2026-06-07 09:04:45	2026-06-07 09:04:45
85	PAG-DEMO Tamu 085	0812340085	87	Demo pagination	2026-06-07 07:39:45	2026-06-07 09:04:45	2026-06-07 09:04:45
86	PAG-DEMO Tamu 086	0812340086	88	Demo pagination	2026-06-07 07:38:46	2026-06-07 09:04:46	2026-06-07 09:04:46
87	PAG-DEMO Tamu 087	0812340087	89	Demo pagination	2026-06-07 07:37:46	2026-06-07 09:04:46	2026-06-07 09:04:46
88	PAG-DEMO Tamu 088	0812340088	90	Demo pagination	2026-06-07 07:36:46	2026-06-07 09:04:46	2026-06-07 09:04:46
89	PAG-DEMO Tamu 089	0812340089	91	Demo pagination	2026-06-07 07:35:46	2026-06-07 09:04:46	2026-06-07 09:04:46
90	PAG-DEMO Tamu 090	0812340090	92	Demo pagination	2026-06-07 07:34:46	2026-06-07 09:04:46	2026-06-07 09:04:46
91	PAG-DEMO Tamu 091	0812340091	93	Demo pagination	2026-06-07 07:33:47	2026-06-07 09:04:47	2026-06-07 09:04:47
92	PAG-DEMO Tamu 092	0812340092	94	Demo pagination	2026-06-07 07:32:47	2026-06-07 09:04:47	2026-06-07 09:04:47
93	PAG-DEMO Tamu 093	0812340093	95	Demo pagination	2026-06-07 07:31:47	2026-06-07 09:04:47	2026-06-07 09:04:47
94	PAG-DEMO Tamu 094	0812340094	96	Demo pagination	2026-06-07 07:30:47	2026-06-07 09:04:47	2026-06-07 09:04:47
95	PAG-DEMO Tamu 095	0812340095	97	Demo pagination	2026-06-07 07:29:47	2026-06-07 09:04:47	2026-06-07 09:04:47
96	PAG-DEMO Tamu 096	0812340096	98	Demo pagination	2026-06-07 07:28:48	2026-06-07 09:04:48	2026-06-07 09:04:48
97	PAG-DEMO Tamu 097	0812340097	99	Demo pagination	2026-06-07 07:27:48	2026-06-07 09:04:48	2026-06-07 09:04:48
98	PAG-DEMO Tamu 098	0812340098	100	Demo pagination	2026-06-07 07:26:48	2026-06-07 09:04:48	2026-06-07 09:04:48
99	PAG-DEMO Tamu 099	0812340099	101	Demo pagination	2026-06-07 07:25:48	2026-06-07 09:04:48	2026-06-07 09:04:48
100	PAG-DEMO Tamu 100	0812340100	102	Demo pagination	2026-06-07 07:24:48	2026-06-07 09:04:48	2026-06-07 09:04:48
101	PAG-DEMO Tamu 101	0812340101	103	Demo pagination	2026-06-07 07:23:49	2026-06-07 09:04:49	2026-06-07 09:04:49
102	PAG-DEMO Tamu 102	0812340102	104	Demo pagination	2026-06-07 07:22:49	2026-06-07 09:04:49	2026-06-07 09:04:49
103	PAG-DEMO Tamu 103	0812340103	105	Demo pagination	2026-06-07 07:21:49	2026-06-07 09:04:49	2026-06-07 09:04:49
104	PAG-DEMO Tamu 104	0812340104	106	Demo pagination	2026-06-07 07:20:49	2026-06-07 09:04:49	2026-06-07 09:04:49
105	PAG-DEMO Tamu 105	0812340105	107	Demo pagination	2026-06-07 07:19:49	2026-06-07 09:04:49	2026-06-07 09:04:49
106	PAG-DEMO Tamu 106	0812340106	108	Demo pagination	2026-06-07 07:18:50	2026-06-07 09:04:50	2026-06-07 09:04:50
107	PAG-DEMO Tamu 107	0812340107	109	Demo pagination	2026-06-07 07:17:50	2026-06-07 09:04:50	2026-06-07 09:04:50
108	PAG-DEMO Tamu 108	0812340108	110	Demo pagination	2026-06-07 07:16:50	2026-06-07 09:04:50	2026-06-07 09:04:50
109	PAG-DEMO Tamu 109	0812340109	111	Demo pagination	2026-06-07 07:15:50	2026-06-07 09:04:50	2026-06-07 09:04:50
110	PAG-DEMO Tamu 110	0812340110	112	Demo pagination	2026-06-07 07:14:50	2026-06-07 09:04:50	2026-06-07 09:04:50
111	PAG-DEMO Tamu 111	0812340111	113	Demo pagination	2026-06-07 07:13:51	2026-06-07 09:04:51	2026-06-07 09:04:51
112	PAG-DEMO Tamu 112	0812340112	114	Demo pagination	2026-06-07 07:12:51	2026-06-07 09:04:51	2026-06-07 09:04:51
113	PAG-DEMO Tamu 113	0812340113	115	Demo pagination	2026-06-07 07:11:51	2026-06-07 09:04:51	2026-06-07 09:04:51
114	PAG-DEMO Tamu 114	0812340114	116	Demo pagination	2026-06-07 07:10:51	2026-06-07 09:04:51	2026-06-07 09:04:51
115	PAG-DEMO Tamu 115	0812340115	117	Demo pagination	2026-06-07 07:09:51	2026-06-07 09:04:51	2026-06-07 09:04:51
116	PAG-DEMO Tamu 116	0812340116	118	Demo pagination	2026-06-07 07:08:52	2026-06-07 09:04:52	2026-06-07 09:04:52
117	PAG-DEMO Tamu 117	0812340117	119	Demo pagination	2026-06-07 07:07:52	2026-06-07 09:04:52	2026-06-07 09:04:52
118	PAG-DEMO Tamu 118	0812340118	120	Demo pagination	2026-06-07 07:06:52	2026-06-07 09:04:52	2026-06-07 09:04:52
119	PAG-DEMO Tamu 119	0812340119	121	Demo pagination	2026-06-07 07:05:52	2026-06-07 09:04:52	2026-06-07 09:04:52
120	PAG-DEMO Tamu 120	0812340120	122	Demo pagination	2026-06-07 07:04:52	2026-06-07 09:04:52	2026-06-07 09:04:52
121	PAG-DEMO Tamu 121	0812340121	123	Demo pagination	2026-06-07 07:03:52	2026-06-07 09:04:52	2026-06-07 09:04:52
122	PAG-DEMO Tamu 122	0812340122	124	Demo pagination	2026-06-07 07:02:53	2026-06-07 09:04:53	2026-06-07 09:04:53
123	PAG-DEMO Tamu 123	0812340123	125	Demo pagination	2026-06-07 07:01:53	2026-06-07 09:04:53	2026-06-07 09:04:53
124	PAG-DEMO Tamu 124	0812340124	126	Demo pagination	2026-06-07 07:00:53	2026-06-07 09:04:53	2026-06-07 09:04:53
125	PAG-DEMO Tamu 125	0812340125	127	Demo pagination	2026-06-07 06:59:53	2026-06-07 09:04:53	2026-06-07 09:04:53
126	PAG-DEMO Tamu 126	0812340126	128	Demo pagination	2026-06-07 06:58:53	2026-06-07 09:04:53	2026-06-07 09:04:53
127	PAG-DEMO Tamu 127	0812340127	129	Demo pagination	2026-06-07 06:57:54	2026-06-07 09:04:54	2026-06-07 09:04:54
128	PAG-DEMO Tamu 128	0812340128	130	Demo pagination	2026-06-07 06:56:54	2026-06-07 09:04:54	2026-06-07 09:04:54
129	PAG-DEMO Tamu 129	0812340129	131	Demo pagination	2026-06-07 06:55:54	2026-06-07 09:04:54	2026-06-07 09:04:54
130	PAG-DEMO Tamu 130	0812340130	132	Demo pagination	2026-06-07 06:54:54	2026-06-07 09:04:54	2026-06-07 09:04:54
131	PAG-DEMO Tamu 131	0812340131	133	Demo pagination	2026-06-07 06:53:54	2026-06-07 09:04:54	2026-06-07 09:04:54
132	PAG-DEMO Tamu 132	0812340132	134	Demo pagination	2026-06-07 06:52:55	2026-06-07 09:04:55	2026-06-07 09:04:55
133	PAG-DEMO Tamu 133	0812340133	135	Demo pagination	2026-06-07 06:51:55	2026-06-07 09:04:55	2026-06-07 09:04:55
134	PAG-DEMO Tamu 134	0812340134	136	Demo pagination	2026-06-07 06:50:55	2026-06-07 09:04:55	2026-06-07 09:04:55
135	PAG-DEMO Tamu 135	0812340135	137	Demo pagination	2026-06-07 06:49:55	2026-06-07 09:04:55	2026-06-07 09:04:55
136	PAG-DEMO Tamu 136	0812340136	138	Demo pagination	2026-06-07 06:48:55	2026-06-07 09:04:55	2026-06-07 09:04:55
137	PAG-DEMO Tamu 137	0812340137	139	Demo pagination	2026-06-07 06:47:56	2026-06-07 09:04:56	2026-06-07 09:04:56
138	PAG-DEMO Tamu 138	0812340138	140	Demo pagination	2026-06-07 06:46:56	2026-06-07 09:04:56	2026-06-07 09:04:56
139	PAG-DEMO Tamu 139	0812340139	141	Demo pagination	2026-06-07 06:45:56	2026-06-07 09:04:56	2026-06-07 09:04:56
140	PAG-DEMO Tamu 140	0812340140	142	Demo pagination	2026-06-07 06:44:56	2026-06-07 09:04:56	2026-06-07 09:04:56
141	PAG-DEMO Tamu 141	0812340141	143	Demo pagination	2026-06-07 06:43:56	2026-06-07 09:04:56	2026-06-07 09:04:56
142	PAG-DEMO Tamu 142	0812340142	144	Demo pagination	2026-06-07 06:42:57	2026-06-07 09:04:57	2026-06-07 09:04:57
143	PAG-DEMO Tamu 143	0812340143	145	Demo pagination	2026-06-07 06:41:57	2026-06-07 09:04:57	2026-06-07 09:04:57
144	PAG-DEMO Tamu 144	0812340144	146	Demo pagination	2026-06-07 06:40:57	2026-06-07 09:04:57	2026-06-07 09:04:57
145	PAG-DEMO Tamu 145	0812340145	147	Demo pagination	2026-06-07 06:39:57	2026-06-07 09:04:57	2026-06-07 09:04:57
146	PAG-DEMO Tamu 146	0812340146	148	Demo pagination	2026-06-07 06:38:57	2026-06-07 09:04:57	2026-06-07 09:04:57
147	PAG-DEMO Tamu 147	0812340147	149	Demo pagination	2026-06-07 06:37:58	2026-06-07 09:04:58	2026-06-07 09:04:58
148	PAG-DEMO Tamu 148	0812340148	150	Demo pagination	2026-06-07 06:36:58	2026-06-07 09:04:58	2026-06-07 09:04:58
149	PAG-DEMO Tamu 149	0812340149	151	Demo pagination	2026-06-07 06:35:58	2026-06-07 09:04:58	2026-06-07 09:04:58
150	PAG-DEMO Tamu 150	0812340150	152	Demo pagination	2026-06-07 06:34:58	2026-06-07 09:04:58	2026-06-07 09:04:58
151	PAG-DEMO Tamu 151	0812340151	153	Demo pagination	2026-06-07 06:33:58	2026-06-07 09:04:58	2026-06-07 09:04:58
152	PAG-DEMO Tamu 152	0812340152	154	Demo pagination	2026-06-07 06:32:59	2026-06-07 09:04:59	2026-06-07 09:04:59
153	PAG-DEMO Tamu 153	0812340153	155	Demo pagination	2026-06-07 06:31:59	2026-06-07 09:04:59	2026-06-07 09:04:59
154	PAG-DEMO Tamu 154	0812340154	156	Demo pagination	2026-06-07 06:30:59	2026-06-07 09:04:59	2026-06-07 09:04:59
155	PAG-DEMO Tamu 155	0812340155	157	Demo pagination	2026-06-07 06:29:59	2026-06-07 09:04:59	2026-06-07 09:04:59
156	PAG-DEMO Tamu 156	0812340156	158	Demo pagination	2026-06-07 06:29:00	2026-06-07 09:05:00	2026-06-07 09:05:00
157	PAG-DEMO Tamu 157	0812340157	159	Demo pagination	2026-06-07 06:28:00	2026-06-07 09:05:00	2026-06-07 09:05:00
158	PAG-DEMO Tamu 158	0812340158	160	Demo pagination	2026-06-07 06:27:00	2026-06-07 09:05:00	2026-06-07 09:05:00
159	PAG-DEMO Tamu 159	0812340159	161	Demo pagination	2026-06-07 06:26:00	2026-06-07 09:05:00	2026-06-07 09:05:00
160	PAG-DEMO Tamu 160	0812340160	162	Demo pagination	2026-06-07 06:25:00	2026-06-07 09:05:00	2026-06-07 09:05:00
161	PAG-DEMO Tamu 161	0812340161	163	Demo pagination	2026-06-07 06:24:01	2026-06-07 09:05:01	2026-06-07 09:05:01
162	PAG-DEMO Tamu 162	0812340162	164	Demo pagination	2026-06-07 06:23:01	2026-06-07 09:05:01	2026-06-07 09:05:01
163	PAG-DEMO Tamu 163	0812340163	165	Demo pagination	2026-06-07 06:22:01	2026-06-07 09:05:01	2026-06-07 09:05:01
164	PAG-DEMO Tamu 164	0812340164	166	Demo pagination	2026-06-07 06:21:01	2026-06-07 09:05:01	2026-06-07 09:05:01
165	PAG-DEMO Tamu 165	0812340165	167	Demo pagination	2026-06-07 06:20:01	2026-06-07 09:05:01	2026-06-07 09:05:01
166	PAG-DEMO Tamu 166	0812340166	168	Demo pagination	2026-06-07 06:19:02	2026-06-07 09:05:02	2026-06-07 09:05:02
167	PAG-DEMO Tamu 167	0812340167	169	Demo pagination	2026-06-07 06:18:02	2026-06-07 09:05:02	2026-06-07 09:05:02
168	PAG-DEMO Tamu 168	0812340168	170	Demo pagination	2026-06-07 06:17:02	2026-06-07 09:05:02	2026-06-07 09:05:02
169	PAG-DEMO Tamu 169	0812340169	171	Demo pagination	2026-06-07 06:16:02	2026-06-07 09:05:02	2026-06-07 09:05:02
170	PAG-DEMO Tamu 170	0812340170	172	Demo pagination	2026-06-07 06:15:02	2026-06-07 09:05:02	2026-06-07 09:05:02
171	PAG-DEMO Tamu 171	0812340171	173	Demo pagination	2026-06-07 06:14:03	2026-06-07 09:05:03	2026-06-07 09:05:03
172	PAG-DEMO Tamu 172	0812340172	174	Demo pagination	2026-06-07 06:13:03	2026-06-07 09:05:03	2026-06-07 09:05:03
173	PAG-DEMO Tamu 173	0812340173	175	Demo pagination	2026-06-07 06:12:03	2026-06-07 09:05:03	2026-06-07 09:05:03
174	PAG-DEMO Tamu 174	0812340174	176	Demo pagination	2026-06-07 06:11:03	2026-06-07 09:05:03	2026-06-07 09:05:03
175	PAG-DEMO Tamu 175	0812340175	177	Demo pagination	2026-06-07 06:10:03	2026-06-07 09:05:03	2026-06-07 09:05:03
176	PAG-DEMO Tamu 176	0812340176	178	Demo pagination	2026-06-07 06:09:04	2026-06-07 09:05:04	2026-06-07 09:05:04
177	PAG-DEMO Tamu 177	0812340177	179	Demo pagination	2026-06-07 06:08:04	2026-06-07 09:05:04	2026-06-07 09:05:04
178	PAG-DEMO Tamu 178	0812340178	180	Demo pagination	2026-06-07 06:07:04	2026-06-07 09:05:04	2026-06-07 09:05:04
179	PAG-DEMO Tamu 179	0812340179	181	Demo pagination	2026-06-07 06:06:04	2026-06-07 09:05:04	2026-06-07 09:05:04
180	PAG-DEMO Tamu 180	0812340180	182	Demo pagination	2026-06-07 06:05:04	2026-06-07 09:05:04	2026-06-07 09:05:04
181	PAG-DEMO Tamu 181	0812340181	183	Demo pagination	2026-06-07 06:04:05	2026-06-07 09:05:05	2026-06-07 09:05:05
182	PAG-DEMO Tamu 182	0812340182	184	Demo pagination	2026-06-07 06:03:05	2026-06-07 09:05:05	2026-06-07 09:05:05
183	PAG-DEMO Tamu 183	0812340183	185	Demo pagination	2026-06-07 06:02:05	2026-06-07 09:05:05	2026-06-07 09:05:05
184	PAG-DEMO Tamu 184	0812340184	186	Demo pagination	2026-06-07 06:01:05	2026-06-07 09:05:05	2026-06-07 09:05:05
185	PAG-DEMO Tamu 185	0812340185	187	Demo pagination	2026-06-07 06:00:05	2026-06-07 09:05:05	2026-06-07 09:05:05
186	PAG-DEMO Tamu 186	0812340186	188	Demo pagination	2026-06-07 05:59:06	2026-06-07 09:05:06	2026-06-07 09:05:06
187	PAG-DEMO Tamu 187	0812340187	189	Demo pagination	2026-06-07 05:58:06	2026-06-07 09:05:06	2026-06-07 09:05:06
188	PAG-DEMO Tamu 188	0812340188	190	Demo pagination	2026-06-07 05:57:06	2026-06-07 09:05:06	2026-06-07 09:05:06
189	PAG-DEMO Tamu 189	0812340189	191	Demo pagination	2026-06-07 05:56:06	2026-06-07 09:05:06	2026-06-07 09:05:06
190	PAG-DEMO Tamu 190	0812340190	192	Demo pagination	2026-06-07 05:55:06	2026-06-07 09:05:06	2026-06-07 09:05:06
191	PAG-DEMO Tamu 191	0812340191	193	Demo pagination	2026-06-07 05:54:07	2026-06-07 09:05:07	2026-06-07 09:05:07
192	PAG-DEMO Tamu 192	0812340192	194	Demo pagination	2026-06-07 05:53:07	2026-06-07 09:05:07	2026-06-07 09:05:07
193	PAG-DEMO Tamu 193	0812340193	195	Demo pagination	2026-06-07 05:52:07	2026-06-07 09:05:07	2026-06-07 09:05:07
194	PAG-DEMO Tamu 194	0812340194	196	Demo pagination	2026-06-07 05:51:07	2026-06-07 09:05:07	2026-06-07 09:05:07
195	PAG-DEMO Tamu 195	0812340195	197	Demo pagination	2026-06-07 05:50:07	2026-06-07 09:05:07	2026-06-07 09:05:07
196	PAG-DEMO Tamu 196	0812340196	198	Demo pagination	2026-06-07 05:49:08	2026-06-07 09:05:08	2026-06-07 09:05:08
197	PAG-DEMO Tamu 197	0812340197	199	Demo pagination	2026-06-07 05:48:08	2026-06-07 09:05:08	2026-06-07 09:05:08
198	PAG-DEMO Tamu 198	0812340198	200	Demo pagination	2026-06-07 05:47:08	2026-06-07 09:05:08	2026-06-07 09:05:08
199	PAG-DEMO Tamu 199	0812340199	201	Demo pagination	2026-06-07 05:46:08	2026-06-07 09:05:08	2026-06-07 09:05:08
200	PAG-DEMO Tamu 200	0812340200	202	Demo pagination	2026-06-07 05:45:09	2026-06-07 09:05:09	2026-06-07 09:05:09
201	PAG-DEMO Tamu 201	0812340201	203	Demo pagination	2026-06-07 05:44:09	2026-06-07 09:05:09	2026-06-07 09:05:09
202	PAG-DEMO Tamu 202	0812340202	204	Demo pagination	2026-06-07 05:43:09	2026-06-07 09:05:09	2026-06-07 09:05:09
203	PAG-DEMO Tamu 203	0812340203	205	Demo pagination	2026-06-07 05:42:09	2026-06-07 09:05:09	2026-06-07 09:05:09
204	PAG-DEMO Tamu 204	0812340204	206	Demo pagination	2026-06-07 05:41:09	2026-06-07 09:05:09	2026-06-07 09:05:09
205	PAG-DEMO Tamu 205	0812340205	207	Demo pagination	2026-06-07 05:40:10	2026-06-07 09:05:10	2026-06-07 09:05:10
206	Budi	081674921647	210	Main	2026-06-10 23:26:41	2026-06-10 23:26:41	2026-06-10 23:26:41
207	Santoso	08761943751953	207	Main	2026-06-11 03:50:41	2026-06-11 03:50:41	2026-06-11 03:50:41
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.cache (key, value, expiration) FROM stdin;
laravel-cache-cg9lqMx37sOixWMz	a:1:{s:11:"valid_until";i:1780839253;}	1782048913
laravel-cache-ENUBLQcTWKrDGnlr	a:1:{s:11:"valid_until";i:1780880956;}	1782090076
laravel-cache-JB29OX4dLaJrZYER	a:1:{s:11:"valid_until";i:1781096159;}	1782304919
laravel-cache-mB5AmkifJAjMrTG7	a:1:{s:11:"valid_until";i:1781105694;}	1782314394
laravel-cache-hKl48p64Qa6Q3yAb	a:1:{s:11:"valid_until";i:1781105715;}	1782315375
laravel-cache-G3Mz0mFqd0jNEDQE	a:1:{s:11:"valid_until";i:1781105763;}	1782315363
laravel-cache-VXzyL6SmHzHlYmN3	a:1:{s:11:"valid_until";i:1781105916;}	1782315456
laravel-cache-GQqGTJbOmidxijIv	a:1:{s:11:"valid_until";i:1781106303;}	1782315603
laravel-cache-oS9ehhMI9vdUoXbc	a:1:{s:11:"valid_until";i:1781107404;}	1782316044
laravel-cache-qlL9odT3s3Q288VD	a:1:{s:11:"valid_until";i:1781107461;}	1782317121
laravel-cache-mH7QYQDSaY37zwbZ	a:1:{s:11:"valid_until";i:1781108606;}	1782318086
laravel-cache-bd96QzRXOC8tcF8X	a:1:{s:11:"valid_until";i:1781108645;}	1782318305
laravel-cache-kQ4GXDdzWSejBcSj	a:1:{s:11:"valid_until";i:1781119083;}	1782328683
laravel-cache-yltdVshsxNYDJhkd	a:1:{s:11:"valid_until";i:1781119365;}	1782328785
laravel-cache-OdXWyzaOvu8RMuph	a:1:{s:11:"valid_until";i:1781123551;}	1782329011
laravel-cache-Fgt7j2buwRc9WlZj	a:1:{s:11:"valid_until";i:1781123685;}	1782333225
laravel-cache-ZSq5U9KXnk1v4ocv	a:1:{s:11:"valid_until";i:1781125472;}	1782333392
laravel-cache-dfgt8HiZLlvSCsEP	a:1:{s:11:"valid_until";i:1781125510;}	1782335170
laravel-cache-7a1My5fB5KH6R9nt	a:1:{s:11:"valid_until";i:1781125888;}	1782335188
laravel-cache-3ovVZUdPRltMSqS3	a:1:{s:11:"valid_until";i:1781126068;}	1782335548
laravel-cache-nQfkZ617eQvOaZBq	a:1:{s:11:"valid_until";i:1781126101;}	1782335761
laravel-cache-zuwxO8a3WhMB934a	a:1:{s:11:"valid_until";i:1781126352;}	1782335772
laravel-cache-iIibWfPw2ko5k8SA	a:1:{s:11:"valid_until";i:1781126373;}	1782336033
laravel-cache-9VUbRcEQ8kifkzeg	a:1:{s:11:"valid_until";i:1781127602;}	1782336062
laravel-cache-jAmtw7VePoenuVpz	a:1:{s:11:"valid_until";i:1781128319;}	1782337319
laravel-cache-MNcdaNBSTmRwtG0P	a:1:{s:11:"valid_until";i:1781128763;}	1782338003
laravel-cache-AqYqkREwLDSH38Eb	a:1:{s:11:"valid_until";i:1781128811;}	1782338471
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: kamar; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.kamar (id_kamar, nomor_kamar, fasilitas, harga_bulanan, luas_kamar, foto_kamar, status_kamar, created_at, updated_at) FROM stdin;
2	P001	Kasur, Lemari, WiFi	1000000.00	3x4 m	kamar/rORxgBhRcrr05ayVHw8MSIZz9hkDoHNJvDetmTFK.jpg	terisi	2026-06-07 09:04:28	2026-06-07 16:13:32
3	P002	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:28	2026-06-07 09:04:28
5	P004	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:29	2026-06-07 09:04:29
6	P005	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:29	2026-06-07 09:04:29
7	P006	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:29	2026-06-07 09:04:29
8	P007	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:29	2026-06-07 09:04:29
9	P008	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:30	2026-06-07 09:04:30
10	P009	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:30	2026-06-07 09:04:30
11	P010	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:30	2026-06-07 09:04:30
12	P011	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:30	2026-06-07 09:04:30
13	P012	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:30	2026-06-07 09:04:30
14	P013	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:31	2026-06-07 09:04:31
15	P014	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:31	2026-06-07 09:04:31
16	P015	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:31	2026-06-07 09:04:31
17	P016	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:31	2026-06-07 09:04:31
18	P017	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:31	2026-06-07 09:04:31
19	P018	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:32	2026-06-07 09:04:32
20	P019	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:32	2026-06-07 09:04:32
21	P020	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:32	2026-06-07 09:04:32
22	P021	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:32	2026-06-07 09:04:32
23	P022	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:32	2026-06-07 09:04:32
24	P023	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:33	2026-06-07 09:04:33
25	P024	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:33	2026-06-07 09:04:33
26	P025	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:33	2026-06-07 09:04:33
27	P026	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:33	2026-06-07 09:04:33
28	P027	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:33	2026-06-07 09:04:33
30	P029	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:34	2026-06-07 09:04:34
31	P030	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:34	2026-06-07 09:04:34
32	P031	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:34	2026-06-07 09:04:34
33	P032	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:34	2026-06-07 09:04:34
34	P033	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:35	2026-06-07 09:04:35
35	P034	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:35	2026-06-07 09:04:35
36	P035	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:35	2026-06-07 09:04:35
37	P036	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:35	2026-06-07 09:04:35
38	P037	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:35	2026-06-07 09:04:35
39	P038	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:36	2026-06-07 09:04:36
40	P039	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:36	2026-06-07 09:04:36
41	P040	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:36	2026-06-07 09:04:36
42	P041	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:36	2026-06-07 09:04:36
43	P042	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:36	2026-06-07 09:04:36
44	P043	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:37	2026-06-07 09:04:37
45	P044	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:37	2026-06-07 09:04:37
46	P045	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:37	2026-06-07 09:04:37
47	P046	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:37	2026-06-07 09:04:37
48	P047	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:38	2026-06-07 09:04:38
49	P048	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:38	2026-06-07 09:04:38
50	P049	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:38	2026-06-07 09:04:38
51	P050	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:38	2026-06-07 09:04:38
52	P051	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:38	2026-06-07 09:04:38
53	P052	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:39	2026-06-07 09:04:39
54	P053	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:39	2026-06-07 09:04:39
55	P054	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:39	2026-06-07 09:04:39
56	P055	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:39	2026-06-07 09:04:39
57	P056	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:39	2026-06-07 09:04:39
58	P057	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:40	2026-06-07 09:04:40
59	P058	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:40	2026-06-07 09:04:40
60	P059	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:40	2026-06-07 09:04:40
61	P060	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:40	2026-06-07 09:04:40
62	P061	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:40	2026-06-07 09:04:40
63	P062	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:41	2026-06-07 09:04:41
64	P063	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:41	2026-06-07 09:04:41
65	P064	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:41	2026-06-07 09:04:41
66	P065	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:41	2026-06-07 09:04:41
67	P066	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:41	2026-06-07 09:04:41
68	P067	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:42	2026-06-07 09:04:42
69	P068	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:42	2026-06-07 09:04:42
70	P069	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:42	2026-06-07 09:04:42
71	P070	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:42	2026-06-07 09:04:42
72	P071	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:42	2026-06-07 09:04:42
73	P072	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:43	2026-06-07 09:04:43
74	P073	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:43	2026-06-07 09:04:43
75	P074	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:43	2026-06-07 09:04:43
4	P003	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	tersedia	2026-06-07 09:04:29	2026-06-10 07:21:28
29	P028	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	tersedia	2026-06-07 09:04:34	2026-06-10 16:25:19
76	P075	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:43	2026-06-07 09:04:43
77	P076	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:43	2026-06-07 09:04:43
78	P077	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:44	2026-06-07 09:04:44
79	P078	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:44	2026-06-07 09:04:44
80	P079	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:44	2026-06-07 09:04:44
81	P080	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:44	2026-06-07 09:04:44
82	P081	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:44	2026-06-07 09:04:44
83	P082	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:45	2026-06-07 09:04:45
84	P083	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:45	2026-06-07 09:04:45
85	P084	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:45	2026-06-07 09:04:45
86	P085	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:45	2026-06-07 09:04:45
87	P086	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:45	2026-06-07 09:04:45
88	P087	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:46	2026-06-07 09:04:46
89	P088	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:46	2026-06-07 09:04:46
90	P089	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:46	2026-06-07 09:04:46
91	P090	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:46	2026-06-07 09:04:46
92	P091	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:46	2026-06-07 09:04:46
93	P092	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:47	2026-06-07 09:04:47
94	P093	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:47	2026-06-07 09:04:47
95	P094	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:47	2026-06-07 09:04:47
96	P095	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:47	2026-06-07 09:04:47
97	P096	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:47	2026-06-07 09:04:47
98	P097	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:48	2026-06-07 09:04:48
99	P098	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:48	2026-06-07 09:04:48
100	P099	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:48	2026-06-07 09:04:48
101	P100	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:48	2026-06-07 09:04:48
102	P101	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:48	2026-06-07 09:04:48
103	P102	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:49	2026-06-07 09:04:49
104	P103	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:49	2026-06-07 09:04:49
105	P104	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:49	2026-06-07 09:04:49
106	P105	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:49	2026-06-07 09:04:49
107	P106	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:49	2026-06-07 09:04:49
108	P107	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:50	2026-06-07 09:04:50
109	P108	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:50	2026-06-07 09:04:50
110	P109	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:50	2026-06-07 09:04:50
111	P110	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:50	2026-06-07 09:04:50
112	P111	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:50	2026-06-07 09:04:50
113	P112	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:51	2026-06-07 09:04:51
114	P113	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:51	2026-06-07 09:04:51
115	P114	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:51	2026-06-07 09:04:51
116	P115	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:51	2026-06-07 09:04:51
117	P116	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:51	2026-06-07 09:04:51
118	P117	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:52	2026-06-07 09:04:52
119	P118	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:52	2026-06-07 09:04:52
120	P119	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:52	2026-06-07 09:04:52
121	P120	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:52	2026-06-07 09:04:52
122	P121	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:52	2026-06-07 09:04:52
123	P122	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:52	2026-06-07 09:04:52
124	P123	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:53	2026-06-07 09:04:53
125	P124	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:53	2026-06-07 09:04:53
126	P125	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:53	2026-06-07 09:04:53
127	P126	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:53	2026-06-07 09:04:53
128	P127	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:53	2026-06-07 09:04:53
129	P128	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:54	2026-06-07 09:04:54
130	P129	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:54	2026-06-07 09:04:54
131	P130	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:54	2026-06-07 09:04:54
132	P131	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:54	2026-06-07 09:04:54
133	P132	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:54	2026-06-07 09:04:54
134	P133	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:55	2026-06-07 09:04:55
135	P134	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:55	2026-06-07 09:04:55
136	P135	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:55	2026-06-07 09:04:55
137	P136	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:55	2026-06-07 09:04:55
138	P137	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:55	2026-06-07 09:04:55
139	P138	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:56	2026-06-07 09:04:56
140	P139	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:56	2026-06-07 09:04:56
141	P140	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:56	2026-06-07 09:04:56
142	P141	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:56	2026-06-07 09:04:56
143	P142	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:56	2026-06-07 09:04:56
144	P143	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:57	2026-06-07 09:04:57
145	P144	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:57	2026-06-07 09:04:57
146	P145	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:57	2026-06-07 09:04:57
147	P146	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:57	2026-06-07 09:04:57
148	P147	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:57	2026-06-07 09:04:57
149	P148	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:58	2026-06-07 09:04:58
150	P149	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:58	2026-06-07 09:04:58
151	P150	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:58	2026-06-07 09:04:58
152	P151	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:58	2026-06-07 09:04:58
153	P152	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:58	2026-06-07 09:04:58
154	P153	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:59	2026-06-07 09:04:59
155	P154	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:59	2026-06-07 09:04:59
156	P155	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:59	2026-06-07 09:04:59
157	P156	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:04:59	2026-06-07 09:04:59
158	P157	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:00	2026-06-07 09:05:00
159	P158	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:00	2026-06-07 09:05:00
161	P160	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:00	2026-06-07 09:05:00
162	P161	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:00	2026-06-07 09:05:00
163	P162	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:01	2026-06-07 09:05:01
164	P163	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:01	2026-06-07 09:05:01
165	P164	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:01	2026-06-07 09:05:01
166	P165	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:01	2026-06-07 09:05:01
167	P166	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:01	2026-06-07 09:05:01
168	P167	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:02	2026-06-07 09:05:02
169	P168	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:02	2026-06-07 09:05:02
170	P169	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:02	2026-06-07 09:05:02
171	P170	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:02	2026-06-07 09:05:02
172	P171	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:02	2026-06-07 09:05:02
173	P172	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:03	2026-06-07 09:05:03
174	P173	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:03	2026-06-07 09:05:03
175	P174	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:03	2026-06-07 09:05:03
176	P175	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:03	2026-06-07 09:05:03
177	P176	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:03	2026-06-07 09:05:03
178	P177	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:04	2026-06-07 09:05:04
179	P178	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:04	2026-06-07 09:05:04
180	P179	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:04	2026-06-07 09:05:04
181	P180	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:04	2026-06-07 09:05:04
182	P181	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:04	2026-06-07 09:05:04
183	P182	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:05	2026-06-07 09:05:05
184	P183	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:05	2026-06-07 09:05:05
185	P184	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:05	2026-06-07 09:05:05
186	P185	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:05	2026-06-07 09:05:05
187	P186	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:05	2026-06-07 09:05:05
188	P187	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:06	2026-06-07 09:05:06
189	P188	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:06	2026-06-07 09:05:06
190	P189	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:06	2026-06-07 09:05:06
191	P190	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:06	2026-06-07 09:05:06
192	P191	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:06	2026-06-07 09:05:06
193	P192	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:07	2026-06-07 09:05:07
194	P193	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:07	2026-06-07 09:05:07
195	P194	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:07	2026-06-07 09:05:07
196	P195	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:07	2026-06-07 09:05:07
197	P196	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:07	2026-06-07 09:05:07
198	P197	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:08	2026-06-07 09:05:08
199	P198	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:08	2026-06-07 09:05:08
200	P199	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:08	2026-06-07 09:05:08
201	P200	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:08	2026-06-07 09:05:08
202	P201	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:09	2026-06-07 09:05:09
203	P202	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:09	2026-06-07 09:05:09
204	P203	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:09	2026-06-07 09:05:09
205	P204	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:09	2026-06-07 09:05:09
206	P205	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	terisi	2026-06-07 09:05:09	2026-06-07 09:05:09
160	P159	Kasur, Lemari, WiFi	1000000.00	3x4 m	\N	tersedia	2026-06-07 09:05:00	2026-06-07 20:35:19
207	DEMO-H7	Kasur, Lemari, Meja Belajar	750000.00	3x3	\N	tersedia	2026-06-07 20:39:49	2026-06-10 07:22:01
1	B-01	AC, Kasur, WiFi	1200000.00	3x3	\N	terisi	2026-06-06 16:29:06	2026-06-10 23:22:23
\.


--
-- Data for Name: keluhan; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.keluhan (id_keluhan, id_sewa, judul_keluhan, deskripsi_keluhan, foto_kerusakan, status_keluhan, tanggal_lapor, tanggal_selesai, created_at, updated_at) FROM stdin;
2	3	PAG-DEMO Keluhan 002	Data demo pagination keluhan	\N	selesai	2026-06-07 07:04:29	2026-06-07 09:04:29	2026-06-07 09:04:29	2026-06-07 09:04:29
4	5	PAG-DEMO Keluhan 004	Data demo pagination keluhan	\N	proses	2026-06-07 05:04:29	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
5	6	PAG-DEMO Keluhan 005	Data demo pagination keluhan	\N	selesai	2026-06-07 04:04:29	2026-06-07 09:04:29	2026-06-07 09:04:29	2026-06-07 09:04:29
6	7	PAG-DEMO Keluhan 006	Data demo pagination keluhan	\N	pending	2026-06-07 03:04:29	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
7	8	PAG-DEMO Keluhan 007	Data demo pagination keluhan	\N	proses	2026-06-07 02:04:30	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
8	9	PAG-DEMO Keluhan 008	Data demo pagination keluhan	\N	selesai	2026-06-07 01:04:30	2026-06-07 09:04:30	2026-06-07 09:04:30	2026-06-07 09:04:30
9	10	PAG-DEMO Keluhan 009	Data demo pagination keluhan	\N	pending	2026-06-07 00:04:30	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
10	11	PAG-DEMO Keluhan 010	Data demo pagination keluhan	\N	proses	2026-06-06 23:04:30	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
11	12	PAG-DEMO Keluhan 011	Data demo pagination keluhan	\N	selesai	2026-06-06 22:04:30	2026-06-07 09:04:30	2026-06-07 09:04:30	2026-06-07 09:04:30
12	13	PAG-DEMO Keluhan 012	Data demo pagination keluhan	\N	pending	2026-06-06 21:04:31	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
13	14	PAG-DEMO Keluhan 013	Data demo pagination keluhan	\N	proses	2026-06-06 20:04:31	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
14	15	PAG-DEMO Keluhan 014	Data demo pagination keluhan	\N	selesai	2026-06-06 19:04:31	2026-06-07 09:04:31	2026-06-07 09:04:31	2026-06-07 09:04:31
15	16	PAG-DEMO Keluhan 015	Data demo pagination keluhan	\N	pending	2026-06-06 18:04:31	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
16	17	PAG-DEMO Keluhan 016	Data demo pagination keluhan	\N	proses	2026-06-06 17:04:31	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
17	18	PAG-DEMO Keluhan 017	Data demo pagination keluhan	\N	selesai	2026-06-06 16:04:32	2026-06-07 09:04:32	2026-06-07 09:04:32	2026-06-07 09:04:32
18	19	PAG-DEMO Keluhan 018	Data demo pagination keluhan	\N	pending	2026-06-06 15:04:32	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
19	20	PAG-DEMO Keluhan 019	Data demo pagination keluhan	\N	proses	2026-06-06 14:04:32	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
20	21	PAG-DEMO Keluhan 020	Data demo pagination keluhan	\N	selesai	2026-06-06 13:04:32	2026-06-07 09:04:32	2026-06-07 09:04:32	2026-06-07 09:04:32
21	22	PAG-DEMO Keluhan 021	Data demo pagination keluhan	\N	pending	2026-06-06 12:04:32	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
22	23	PAG-DEMO Keluhan 022	Data demo pagination keluhan	\N	proses	2026-06-06 11:04:33	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
23	24	PAG-DEMO Keluhan 023	Data demo pagination keluhan	\N	selesai	2026-06-06 10:04:33	2026-06-07 09:04:33	2026-06-07 09:04:33	2026-06-07 09:04:33
24	25	PAG-DEMO Keluhan 024	Data demo pagination keluhan	\N	pending	2026-06-06 09:04:33	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
25	26	PAG-DEMO Keluhan 025	Data demo pagination keluhan	\N	proses	2026-06-06 08:04:33	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
26	27	PAG-DEMO Keluhan 026	Data demo pagination keluhan	\N	selesai	2026-06-06 07:04:33	2026-06-07 09:04:33	2026-06-07 09:04:33	2026-06-07 09:04:33
27	28	PAG-DEMO Keluhan 027	Data demo pagination keluhan	\N	pending	2026-06-06 06:04:34	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
28	29	PAG-DEMO Keluhan 028	Data demo pagination keluhan	\N	proses	2026-06-06 05:04:34	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
29	30	PAG-DEMO Keluhan 029	Data demo pagination keluhan	\N	selesai	2026-06-06 04:04:34	2026-06-07 09:04:34	2026-06-07 09:04:34	2026-06-07 09:04:34
30	31	PAG-DEMO Keluhan 030	Data demo pagination keluhan	\N	pending	2026-06-06 03:04:34	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
31	32	PAG-DEMO Keluhan 031	Data demo pagination keluhan	\N	proses	2026-06-06 02:04:34	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
32	33	PAG-DEMO Keluhan 032	Data demo pagination keluhan	\N	selesai	2026-06-06 01:04:35	2026-06-07 09:04:35	2026-06-07 09:04:35	2026-06-07 09:04:35
33	34	PAG-DEMO Keluhan 033	Data demo pagination keluhan	\N	pending	2026-06-06 00:04:35	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
34	35	PAG-DEMO Keluhan 034	Data demo pagination keluhan	\N	proses	2026-06-05 23:04:35	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
35	36	PAG-DEMO Keluhan 035	Data demo pagination keluhan	\N	selesai	2026-06-05 22:04:35	2026-06-07 09:04:35	2026-06-07 09:04:35	2026-06-07 09:04:35
36	37	PAG-DEMO Keluhan 036	Data demo pagination keluhan	\N	pending	2026-06-05 21:04:35	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
37	38	PAG-DEMO Keluhan 037	Data demo pagination keluhan	\N	proses	2026-06-05 20:04:36	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
38	39	PAG-DEMO Keluhan 038	Data demo pagination keluhan	\N	selesai	2026-06-05 19:04:36	2026-06-07 09:04:36	2026-06-07 09:04:36	2026-06-07 09:04:36
39	40	PAG-DEMO Keluhan 039	Data demo pagination keluhan	\N	pending	2026-06-05 18:04:36	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
40	41	PAG-DEMO Keluhan 040	Data demo pagination keluhan	\N	proses	2026-06-05 17:04:36	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
41	42	PAG-DEMO Keluhan 041	Data demo pagination keluhan	\N	selesai	2026-06-05 16:04:36	2026-06-07 09:04:36	2026-06-07 09:04:36	2026-06-07 09:04:36
42	43	PAG-DEMO Keluhan 042	Data demo pagination keluhan	\N	pending	2026-06-05 15:04:37	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
43	44	PAG-DEMO Keluhan 043	Data demo pagination keluhan	\N	proses	2026-06-05 14:04:37	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
44	45	PAG-DEMO Keluhan 044	Data demo pagination keluhan	\N	selesai	2026-06-05 13:04:37	2026-06-07 09:04:37	2026-06-07 09:04:37	2026-06-07 09:04:37
45	46	PAG-DEMO Keluhan 045	Data demo pagination keluhan	\N	pending	2026-06-05 12:04:37	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
46	47	PAG-DEMO Keluhan 046	Data demo pagination keluhan	\N	proses	2026-06-05 11:04:38	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
47	48	PAG-DEMO Keluhan 047	Data demo pagination keluhan	\N	selesai	2026-06-05 10:04:38	2026-06-07 09:04:38	2026-06-07 09:04:38	2026-06-07 09:04:38
48	49	PAG-DEMO Keluhan 048	Data demo pagination keluhan	\N	pending	2026-06-05 09:04:38	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
49	50	PAG-DEMO Keluhan 049	Data demo pagination keluhan	\N	proses	2026-06-05 08:04:38	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
50	51	PAG-DEMO Keluhan 050	Data demo pagination keluhan	\N	selesai	2026-06-05 07:04:38	2026-06-07 09:04:38	2026-06-07 09:04:38	2026-06-07 09:04:38
51	52	PAG-DEMO Keluhan 051	Data demo pagination keluhan	\N	pending	2026-06-05 06:04:39	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
52	53	PAG-DEMO Keluhan 052	Data demo pagination keluhan	\N	proses	2026-06-05 05:04:39	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
53	54	PAG-DEMO Keluhan 053	Data demo pagination keluhan	\N	selesai	2026-06-05 04:04:39	2026-06-07 09:04:39	2026-06-07 09:04:39	2026-06-07 09:04:39
54	55	PAG-DEMO Keluhan 054	Data demo pagination keluhan	\N	pending	2026-06-05 03:04:39	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
55	56	PAG-DEMO Keluhan 055	Data demo pagination keluhan	\N	proses	2026-06-05 02:04:39	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
56	57	PAG-DEMO Keluhan 056	Data demo pagination keluhan	\N	selesai	2026-06-05 01:04:40	2026-06-07 09:04:40	2026-06-07 09:04:40	2026-06-07 09:04:40
57	58	PAG-DEMO Keluhan 057	Data demo pagination keluhan	\N	pending	2026-06-05 00:04:40	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
58	59	PAG-DEMO Keluhan 058	Data demo pagination keluhan	\N	proses	2026-06-04 23:04:40	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
59	60	PAG-DEMO Keluhan 059	Data demo pagination keluhan	\N	selesai	2026-06-04 22:04:40	2026-06-07 09:04:40	2026-06-07 09:04:40	2026-06-07 09:04:40
60	61	PAG-DEMO Keluhan 060	Data demo pagination keluhan	\N	pending	2026-06-04 21:04:40	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
61	62	PAG-DEMO Keluhan 061	Data demo pagination keluhan	\N	proses	2026-06-04 20:04:41	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
62	63	PAG-DEMO Keluhan 062	Data demo pagination keluhan	\N	selesai	2026-06-04 19:04:41	2026-06-07 09:04:41	2026-06-07 09:04:41	2026-06-07 09:04:41
63	64	PAG-DEMO Keluhan 063	Data demo pagination keluhan	\N	pending	2026-06-04 18:04:41	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
64	65	PAG-DEMO Keluhan 064	Data demo pagination keluhan	\N	proses	2026-06-04 17:04:41	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
65	66	PAG-DEMO Keluhan 065	Data demo pagination keluhan	\N	selesai	2026-06-04 16:04:41	2026-06-07 09:04:41	2026-06-07 09:04:41	2026-06-07 09:04:41
66	67	PAG-DEMO Keluhan 066	Data demo pagination keluhan	\N	pending	2026-06-04 15:04:42	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
67	68	PAG-DEMO Keluhan 067	Data demo pagination keluhan	\N	proses	2026-06-04 14:04:42	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
68	69	PAG-DEMO Keluhan 068	Data demo pagination keluhan	\N	selesai	2026-06-04 13:04:42	2026-06-07 09:04:42	2026-06-07 09:04:42	2026-06-07 09:04:42
69	70	PAG-DEMO Keluhan 069	Data demo pagination keluhan	\N	pending	2026-06-04 12:04:42	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
70	71	PAG-DEMO Keluhan 070	Data demo pagination keluhan	\N	proses	2026-06-04 11:04:42	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
71	72	PAG-DEMO Keluhan 071	Data demo pagination keluhan	\N	selesai	2026-06-04 10:04:43	2026-06-07 09:04:43	2026-06-07 09:04:43	2026-06-07 09:04:43
72	73	PAG-DEMO Keluhan 072	Data demo pagination keluhan	\N	pending	2026-06-04 09:04:43	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
73	74	PAG-DEMO Keluhan 073	Data demo pagination keluhan	\N	proses	2026-06-04 08:04:43	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
74	75	PAG-DEMO Keluhan 074	Data demo pagination keluhan	\N	selesai	2026-06-04 07:04:43	2026-06-07 09:04:43	2026-06-07 09:04:43	2026-06-07 09:04:43
75	76	PAG-DEMO Keluhan 075	Data demo pagination keluhan	\N	pending	2026-06-04 06:04:43	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
76	77	PAG-DEMO Keluhan 076	Data demo pagination keluhan	\N	proses	2026-06-04 05:04:44	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
77	78	PAG-DEMO Keluhan 077	Data demo pagination keluhan	\N	selesai	2026-06-04 04:04:44	2026-06-07 09:04:44	2026-06-07 09:04:44	2026-06-07 09:04:44
78	79	PAG-DEMO Keluhan 078	Data demo pagination keluhan	\N	pending	2026-06-04 03:04:44	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
79	80	PAG-DEMO Keluhan 079	Data demo pagination keluhan	\N	proses	2026-06-04 02:04:44	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
80	81	PAG-DEMO Keluhan 080	Data demo pagination keluhan	\N	selesai	2026-06-04 01:04:44	2026-06-07 09:04:44	2026-06-07 09:04:44	2026-06-07 09:04:44
81	82	PAG-DEMO Keluhan 081	Data demo pagination keluhan	\N	pending	2026-06-04 00:04:45	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
82	83	PAG-DEMO Keluhan 082	Data demo pagination keluhan	\N	proses	2026-06-03 23:04:45	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
83	84	PAG-DEMO Keluhan 083	Data demo pagination keluhan	\N	selesai	2026-06-03 22:04:45	2026-06-07 09:04:45	2026-06-07 09:04:45	2026-06-07 09:04:45
84	85	PAG-DEMO Keluhan 084	Data demo pagination keluhan	\N	pending	2026-06-03 21:04:45	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
85	86	PAG-DEMO Keluhan 085	Data demo pagination keluhan	\N	proses	2026-06-03 20:04:45	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
86	87	PAG-DEMO Keluhan 086	Data demo pagination keluhan	\N	selesai	2026-06-03 19:04:46	2026-06-07 09:04:46	2026-06-07 09:04:46	2026-06-07 09:04:46
87	88	PAG-DEMO Keluhan 087	Data demo pagination keluhan	\N	pending	2026-06-03 18:04:46	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
88	89	PAG-DEMO Keluhan 088	Data demo pagination keluhan	\N	proses	2026-06-03 17:04:46	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
89	90	PAG-DEMO Keluhan 089	Data demo pagination keluhan	\N	selesai	2026-06-03 16:04:46	2026-06-07 09:04:46	2026-06-07 09:04:46	2026-06-07 09:04:46
90	91	PAG-DEMO Keluhan 090	Data demo pagination keluhan	\N	pending	2026-06-03 15:04:46	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
91	92	PAG-DEMO Keluhan 091	Data demo pagination keluhan	\N	proses	2026-06-03 14:04:47	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
92	93	PAG-DEMO Keluhan 092	Data demo pagination keluhan	\N	selesai	2026-06-03 13:04:47	2026-06-07 09:04:47	2026-06-07 09:04:47	2026-06-07 09:04:47
93	94	PAG-DEMO Keluhan 093	Data demo pagination keluhan	\N	pending	2026-06-03 12:04:47	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
94	95	PAG-DEMO Keluhan 094	Data demo pagination keluhan	\N	proses	2026-06-03 11:04:47	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
95	96	PAG-DEMO Keluhan 095	Data demo pagination keluhan	\N	selesai	2026-06-03 10:04:47	2026-06-07 09:04:47	2026-06-07 09:04:47	2026-06-07 09:04:47
96	97	PAG-DEMO Keluhan 096	Data demo pagination keluhan	\N	pending	2026-06-03 09:04:48	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
97	98	PAG-DEMO Keluhan 097	Data demo pagination keluhan	\N	proses	2026-06-03 08:04:48	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
98	99	PAG-DEMO Keluhan 098	Data demo pagination keluhan	\N	selesai	2026-06-03 07:04:48	2026-06-07 09:04:48	2026-06-07 09:04:48	2026-06-07 09:04:48
99	100	PAG-DEMO Keluhan 099	Data demo pagination keluhan	\N	pending	2026-06-03 06:04:48	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
100	101	PAG-DEMO Keluhan 100	Data demo pagination keluhan	\N	proses	2026-06-03 05:04:48	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
101	102	PAG-DEMO Keluhan 101	Data demo pagination keluhan	\N	selesai	2026-06-03 04:04:49	2026-06-07 09:04:49	2026-06-07 09:04:49	2026-06-07 09:04:49
102	103	PAG-DEMO Keluhan 102	Data demo pagination keluhan	\N	pending	2026-06-03 03:04:49	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
103	104	PAG-DEMO Keluhan 103	Data demo pagination keluhan	\N	proses	2026-06-03 02:04:49	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
104	105	PAG-DEMO Keluhan 104	Data demo pagination keluhan	\N	selesai	2026-06-03 01:04:49	2026-06-07 09:04:49	2026-06-07 09:04:49	2026-06-07 09:04:49
105	106	PAG-DEMO Keluhan 105	Data demo pagination keluhan	\N	pending	2026-06-03 00:04:49	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
106	107	PAG-DEMO Keluhan 106	Data demo pagination keluhan	\N	proses	2026-06-02 23:04:50	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
107	108	PAG-DEMO Keluhan 107	Data demo pagination keluhan	\N	selesai	2026-06-02 22:04:50	2026-06-07 09:04:50	2026-06-07 09:04:50	2026-06-07 09:04:50
108	109	PAG-DEMO Keluhan 108	Data demo pagination keluhan	\N	pending	2026-06-02 21:04:50	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
109	110	PAG-DEMO Keluhan 109	Data demo pagination keluhan	\N	proses	2026-06-02 20:04:50	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
110	111	PAG-DEMO Keluhan 110	Data demo pagination keluhan	\N	selesai	2026-06-02 19:04:50	2026-06-07 09:04:50	2026-06-07 09:04:50	2026-06-07 09:04:50
111	112	PAG-DEMO Keluhan 111	Data demo pagination keluhan	\N	pending	2026-06-02 18:04:51	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
112	113	PAG-DEMO Keluhan 112	Data demo pagination keluhan	\N	proses	2026-06-02 17:04:51	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
113	114	PAG-DEMO Keluhan 113	Data demo pagination keluhan	\N	selesai	2026-06-02 16:04:51	2026-06-07 09:04:51	2026-06-07 09:04:51	2026-06-07 09:04:51
114	115	PAG-DEMO Keluhan 114	Data demo pagination keluhan	\N	pending	2026-06-02 15:04:51	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
115	116	PAG-DEMO Keluhan 115	Data demo pagination keluhan	\N	proses	2026-06-02 14:04:51	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
116	117	PAG-DEMO Keluhan 116	Data demo pagination keluhan	\N	selesai	2026-06-02 13:04:52	2026-06-07 09:04:52	2026-06-07 09:04:52	2026-06-07 09:04:52
117	118	PAG-DEMO Keluhan 117	Data demo pagination keluhan	\N	pending	2026-06-02 12:04:52	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
118	119	PAG-DEMO Keluhan 118	Data demo pagination keluhan	\N	proses	2026-06-02 11:04:52	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
119	120	PAG-DEMO Keluhan 119	Data demo pagination keluhan	\N	selesai	2026-06-02 10:04:52	2026-06-07 09:04:52	2026-06-07 09:04:52	2026-06-07 09:04:52
120	121	PAG-DEMO Keluhan 120	Data demo pagination keluhan	\N	pending	2026-06-02 09:04:52	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
121	122	PAG-DEMO Keluhan 121	Data demo pagination keluhan	\N	proses	2026-06-02 08:04:52	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
122	123	PAG-DEMO Keluhan 122	Data demo pagination keluhan	\N	selesai	2026-06-02 07:04:53	2026-06-07 09:04:53	2026-06-07 09:04:53	2026-06-07 09:04:53
123	124	PAG-DEMO Keluhan 123	Data demo pagination keluhan	\N	pending	2026-06-02 06:04:53	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
124	125	PAG-DEMO Keluhan 124	Data demo pagination keluhan	\N	proses	2026-06-02 05:04:53	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
125	126	PAG-DEMO Keluhan 125	Data demo pagination keluhan	\N	selesai	2026-06-02 04:04:53	2026-06-07 09:04:53	2026-06-07 09:04:53	2026-06-07 09:04:53
126	127	PAG-DEMO Keluhan 126	Data demo pagination keluhan	\N	pending	2026-06-02 03:04:53	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
127	128	PAG-DEMO Keluhan 127	Data demo pagination keluhan	\N	proses	2026-06-02 02:04:54	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
128	129	PAG-DEMO Keluhan 128	Data demo pagination keluhan	\N	selesai	2026-06-02 01:04:54	2026-06-07 09:04:54	2026-06-07 09:04:54	2026-06-07 09:04:54
129	130	PAG-DEMO Keluhan 129	Data demo pagination keluhan	\N	pending	2026-06-02 00:04:54	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
130	131	PAG-DEMO Keluhan 130	Data demo pagination keluhan	\N	proses	2026-06-01 23:04:54	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
131	132	PAG-DEMO Keluhan 131	Data demo pagination keluhan	\N	selesai	2026-06-01 22:04:54	2026-06-07 09:04:54	2026-06-07 09:04:54	2026-06-07 09:04:54
132	133	PAG-DEMO Keluhan 132	Data demo pagination keluhan	\N	pending	2026-06-01 21:04:55	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
133	134	PAG-DEMO Keluhan 133	Data demo pagination keluhan	\N	proses	2026-06-01 20:04:55	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
134	135	PAG-DEMO Keluhan 134	Data demo pagination keluhan	\N	selesai	2026-06-01 19:04:55	2026-06-07 09:04:55	2026-06-07 09:04:55	2026-06-07 09:04:55
135	136	PAG-DEMO Keluhan 135	Data demo pagination keluhan	\N	pending	2026-06-01 18:04:55	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
136	137	PAG-DEMO Keluhan 136	Data demo pagination keluhan	\N	proses	2026-06-01 17:04:55	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
137	138	PAG-DEMO Keluhan 137	Data demo pagination keluhan	\N	selesai	2026-06-01 16:04:56	2026-06-07 09:04:56	2026-06-07 09:04:56	2026-06-07 09:04:56
138	139	PAG-DEMO Keluhan 138	Data demo pagination keluhan	\N	pending	2026-06-01 15:04:56	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
139	140	PAG-DEMO Keluhan 139	Data demo pagination keluhan	\N	proses	2026-06-01 14:04:56	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
140	141	PAG-DEMO Keluhan 140	Data demo pagination keluhan	\N	selesai	2026-06-01 13:04:56	2026-06-07 09:04:56	2026-06-07 09:04:56	2026-06-07 09:04:56
141	142	PAG-DEMO Keluhan 141	Data demo pagination keluhan	\N	pending	2026-06-01 12:04:56	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
142	143	PAG-DEMO Keluhan 142	Data demo pagination keluhan	\N	proses	2026-06-01 11:04:57	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
143	144	PAG-DEMO Keluhan 143	Data demo pagination keluhan	\N	selesai	2026-06-01 10:04:57	2026-06-07 09:04:57	2026-06-07 09:04:57	2026-06-07 09:04:57
144	145	PAG-DEMO Keluhan 144	Data demo pagination keluhan	\N	pending	2026-06-01 09:04:57	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
145	146	PAG-DEMO Keluhan 145	Data demo pagination keluhan	\N	proses	2026-06-01 08:04:57	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
146	147	PAG-DEMO Keluhan 146	Data demo pagination keluhan	\N	selesai	2026-06-01 07:04:57	2026-06-07 09:04:57	2026-06-07 09:04:57	2026-06-07 09:04:57
147	148	PAG-DEMO Keluhan 147	Data demo pagination keluhan	\N	pending	2026-06-01 06:04:58	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
148	149	PAG-DEMO Keluhan 148	Data demo pagination keluhan	\N	proses	2026-06-01 05:04:58	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
149	150	PAG-DEMO Keluhan 149	Data demo pagination keluhan	\N	selesai	2026-06-01 04:04:58	2026-06-07 09:04:58	2026-06-07 09:04:58	2026-06-07 09:04:58
150	151	PAG-DEMO Keluhan 150	Data demo pagination keluhan	\N	pending	2026-06-01 03:04:58	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
151	152	PAG-DEMO Keluhan 151	Data demo pagination keluhan	\N	proses	2026-06-01 02:04:58	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
152	153	PAG-DEMO Keluhan 152	Data demo pagination keluhan	\N	selesai	2026-06-01 01:04:59	2026-06-07 09:04:59	2026-06-07 09:04:59	2026-06-07 09:04:59
153	154	PAG-DEMO Keluhan 153	Data demo pagination keluhan	\N	pending	2026-06-01 00:04:59	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
154	155	PAG-DEMO Keluhan 154	Data demo pagination keluhan	\N	proses	2026-05-31 23:04:59	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
155	156	PAG-DEMO Keluhan 155	Data demo pagination keluhan	\N	selesai	2026-05-31 22:04:59	2026-06-07 09:04:59	2026-06-07 09:04:59	2026-06-07 09:04:59
156	157	PAG-DEMO Keluhan 156	Data demo pagination keluhan	\N	pending	2026-05-31 21:05:00	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
157	158	PAG-DEMO Keluhan 157	Data demo pagination keluhan	\N	proses	2026-05-31 20:05:00	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
158	159	PAG-DEMO Keluhan 158	Data demo pagination keluhan	\N	selesai	2026-05-31 19:05:00	2026-06-07 09:05:00	2026-06-07 09:05:00	2026-06-07 09:05:00
159	160	PAG-DEMO Keluhan 159	Data demo pagination keluhan	\N	pending	2026-05-31 18:05:00	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
160	161	PAG-DEMO Keluhan 160	Data demo pagination keluhan	\N	proses	2026-05-31 17:05:00	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
161	162	PAG-DEMO Keluhan 161	Data demo pagination keluhan	\N	selesai	2026-05-31 16:05:01	2026-06-07 09:05:01	2026-06-07 09:05:01	2026-06-07 09:05:01
162	163	PAG-DEMO Keluhan 162	Data demo pagination keluhan	\N	pending	2026-05-31 15:05:01	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
163	164	PAG-DEMO Keluhan 163	Data demo pagination keluhan	\N	proses	2026-05-31 14:05:01	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
164	165	PAG-DEMO Keluhan 164	Data demo pagination keluhan	\N	selesai	2026-05-31 13:05:01	2026-06-07 09:05:01	2026-06-07 09:05:01	2026-06-07 09:05:01
165	166	PAG-DEMO Keluhan 165	Data demo pagination keluhan	\N	pending	2026-05-31 12:05:01	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
166	167	PAG-DEMO Keluhan 166	Data demo pagination keluhan	\N	proses	2026-05-31 11:05:02	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
167	168	PAG-DEMO Keluhan 167	Data demo pagination keluhan	\N	selesai	2026-05-31 10:05:02	2026-06-07 09:05:02	2026-06-07 09:05:02	2026-06-07 09:05:02
168	169	PAG-DEMO Keluhan 168	Data demo pagination keluhan	\N	pending	2026-05-31 09:05:02	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
169	170	PAG-DEMO Keluhan 169	Data demo pagination keluhan	\N	proses	2026-05-31 08:05:02	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
170	171	PAG-DEMO Keluhan 170	Data demo pagination keluhan	\N	selesai	2026-05-31 07:05:02	2026-06-07 09:05:02	2026-06-07 09:05:02	2026-06-07 09:05:02
171	172	PAG-DEMO Keluhan 171	Data demo pagination keluhan	\N	pending	2026-05-31 06:05:03	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
172	173	PAG-DEMO Keluhan 172	Data demo pagination keluhan	\N	proses	2026-05-31 05:05:03	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
173	174	PAG-DEMO Keluhan 173	Data demo pagination keluhan	\N	selesai	2026-05-31 04:05:03	2026-06-07 09:05:03	2026-06-07 09:05:03	2026-06-07 09:05:03
174	175	PAG-DEMO Keluhan 174	Data demo pagination keluhan	\N	pending	2026-05-31 03:05:03	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
175	176	PAG-DEMO Keluhan 175	Data demo pagination keluhan	\N	proses	2026-05-31 02:05:03	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
176	177	PAG-DEMO Keluhan 176	Data demo pagination keluhan	\N	selesai	2026-05-31 01:05:04	2026-06-07 09:05:04	2026-06-07 09:05:04	2026-06-07 09:05:04
177	178	PAG-DEMO Keluhan 177	Data demo pagination keluhan	\N	pending	2026-05-31 00:05:04	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
178	179	PAG-DEMO Keluhan 178	Data demo pagination keluhan	\N	proses	2026-05-30 23:05:04	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
179	180	PAG-DEMO Keluhan 179	Data demo pagination keluhan	\N	selesai	2026-05-30 22:05:04	2026-06-07 09:05:04	2026-06-07 09:05:04	2026-06-07 09:05:04
180	181	PAG-DEMO Keluhan 180	Data demo pagination keluhan	\N	pending	2026-05-30 21:05:04	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
181	182	PAG-DEMO Keluhan 181	Data demo pagination keluhan	\N	proses	2026-05-30 20:05:05	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
182	183	PAG-DEMO Keluhan 182	Data demo pagination keluhan	\N	selesai	2026-05-30 19:05:05	2026-06-07 09:05:05	2026-06-07 09:05:05	2026-06-07 09:05:05
183	184	PAG-DEMO Keluhan 183	Data demo pagination keluhan	\N	pending	2026-05-30 18:05:05	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
184	185	PAG-DEMO Keluhan 184	Data demo pagination keluhan	\N	proses	2026-05-30 17:05:05	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
185	186	PAG-DEMO Keluhan 185	Data demo pagination keluhan	\N	selesai	2026-05-30 16:05:05	2026-06-07 09:05:05	2026-06-07 09:05:05	2026-06-07 09:05:05
186	187	PAG-DEMO Keluhan 186	Data demo pagination keluhan	\N	pending	2026-05-30 15:05:06	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
187	188	PAG-DEMO Keluhan 187	Data demo pagination keluhan	\N	proses	2026-05-30 14:05:06	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
188	189	PAG-DEMO Keluhan 188	Data demo pagination keluhan	\N	selesai	2026-05-30 13:05:06	2026-06-07 09:05:06	2026-06-07 09:05:06	2026-06-07 09:05:06
189	190	PAG-DEMO Keluhan 189	Data demo pagination keluhan	\N	pending	2026-05-30 12:05:06	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
190	191	PAG-DEMO Keluhan 190	Data demo pagination keluhan	\N	proses	2026-05-30 11:05:06	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
191	192	PAG-DEMO Keluhan 191	Data demo pagination keluhan	\N	selesai	2026-05-30 10:05:07	2026-06-07 09:05:07	2026-06-07 09:05:07	2026-06-07 09:05:07
192	193	PAG-DEMO Keluhan 192	Data demo pagination keluhan	\N	pending	2026-05-30 09:05:07	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
193	194	PAG-DEMO Keluhan 193	Data demo pagination keluhan	\N	proses	2026-05-30 08:05:07	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
194	195	PAG-DEMO Keluhan 194	Data demo pagination keluhan	\N	selesai	2026-05-30 07:05:07	2026-06-07 09:05:07	2026-06-07 09:05:07	2026-06-07 09:05:07
195	196	PAG-DEMO Keluhan 195	Data demo pagination keluhan	\N	pending	2026-05-30 06:05:07	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
196	197	PAG-DEMO Keluhan 196	Data demo pagination keluhan	\N	proses	2026-05-30 05:05:08	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
197	198	PAG-DEMO Keluhan 197	Data demo pagination keluhan	\N	selesai	2026-05-30 04:05:08	2026-06-07 09:05:08	2026-06-07 09:05:08	2026-06-07 09:05:08
198	199	PAG-DEMO Keluhan 198	Data demo pagination keluhan	\N	pending	2026-05-30 03:05:08	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
199	200	PAG-DEMO Keluhan 199	Data demo pagination keluhan	\N	proses	2026-05-30 02:05:08	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
200	201	PAG-DEMO Keluhan 200	Data demo pagination keluhan	\N	selesai	2026-05-30 01:05:09	2026-06-07 09:05:09	2026-06-07 09:05:09	2026-06-07 09:05:09
201	202	PAG-DEMO Keluhan 201	Data demo pagination keluhan	\N	pending	2026-05-30 00:05:09	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
202	203	PAG-DEMO Keluhan 202	Data demo pagination keluhan	\N	proses	2026-05-29 23:05:09	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
203	204	PAG-DEMO Keluhan 203	Data demo pagination keluhan	\N	selesai	2026-05-29 22:05:09	2026-06-07 09:05:09	2026-06-07 09:05:09	2026-06-07 09:05:09
204	205	PAG-DEMO Keluhan 204	Data demo pagination keluhan	\N	pending	2026-05-29 21:05:09	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
205	206	PAG-DEMO Keluhan 205	Data demo pagination keluhan	\N	proses	2026-05-29 20:05:10	\N	2026-06-07 09:05:10	2026-06-07 09:05:10
206	19	asdasd	asdasd	keluhan/DVMRWV7cEr17y1R18uUy6ghxo2sezTDKymrDFh9S.jpg	pending	2026-06-10 23:04:16	\N	2026-06-10 23:04:16	2026-06-10 23:04:16
207	209	Air mati	Air mati sejak tadi pagi	keluhan/ZvVTJWvvkJxRVjwjbYVKPpNkSSHsYRWG9XXVt37s.jpg	pending	2026-06-11 03:33:41	\N	2026-06-11 03:33:41	2026-06-11 03:33:41
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	0001_01_01_000003_create_kamar_table	1
5	0001_01_01_000004_create_riwayat_sewa_table	1
6	0001_01_01_000005_create_keluhans_table	1
7	0001_01_01_000006_create_tagihan_table	1
8	0001_01_01_000007_create_pengeluarans_table	1
9	0001_01_01_000008_create_buku_tamus_table	1
10	0001_01_01_000009_create_pembayaran_table	1
11	2026_04_22_014815_create_personal_access_tokens_table	1
12	2026_04_30_101018_create_visitors_table	1
13	2026_05_02_024451_add_tracking_columns_to_visitors_table	1
14	2026_05_16_102117_simplify_visitors_table	1
15	2026_05_17_212039_create_notifikasis_table	1
16	2026_05_17_212104_create_mobile_device_tokens_table	1
17	2026_05_17_223436_add_reminder_tracking_to_notifikasis_table	1
18	2026_06_05_000001_add_analytics_columns_to_visitors_table	1
19	2026_06_05_000002_add_browser_consent_to_visitors_table	1
\.


--
-- Data for Name: mobile_device_tokens; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.mobile_device_tokens (id, id_user, device_token, platform, last_used_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifikasis; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.notifikasis (id, id_user, id_tagihan, role_target, tipe, judul, pesan, is_read, read_at, pushed_at, created_at, updated_at, last_reminded_at, reminder_count) FROM stdin;
3	4	4	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
4	1	4	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 002 kamar P002: Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
5	5	5	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
7	6	6	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
11	8	8	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
13	9	9	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
15	10	10	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
17	11	11	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
19	12	12	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
21	13	13	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
23	14	14	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
25	15	15	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
27	16	16	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
29	17	17	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
31	18	18	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
37	23	23	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-07 10:18:39	2026-06-07	1
42	1	25	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 023 kamar P023: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
38	1	23	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 021 kamar P021: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
32	1	18	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 016 kamar P016: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
30	1	17	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 015 kamar P015: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
28	1	16	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 014 kamar P014: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
26	1	15	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 013 kamar P013: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
24	1	14	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 012 kamar P012: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
18	1	11	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 009 kamar P009: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
16	1	10	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 008 kamar P008: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
14	1	9	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 007 kamar P007: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
34	1	19	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 017 kamar P017: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:39	2026-06-10 16:25:15	2026-06-10	4
12	1	8	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 006 kamar P006: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
8	1	6	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 004 kamar P004: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
6	1	5	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 003 kamar P003: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
40	1	24	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 022 kamar P022: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
1	3	3	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
35	22	22	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
22	1	13	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 011 kamar P011: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
41	25	25	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
33	19	19	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:56	2026-06-10	4
9	7	7	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
39	24	24	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
63	36	36	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
48	1	28	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 026 kamar P026: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
43	26	26	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
75	44	44	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
81	47	47	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
73	43	43	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
79	46	46	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
71	42	42	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
77	45	45	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
83	48	48	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
50	1	29	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 027 kamar P027: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
76	1	44	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 042 kamar P042: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
68	1	38	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 036 kamar P036: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
51	30	30	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
53	31	31	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
49	29	29	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
47	28	28	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
67	38	38	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
61	35	35	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
70	1	39	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 037 kamar P037: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
44	1	26	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 024 kamar P024: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
52	1	30	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 028 kamar P028: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
45	27	27	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:39	2026-06-10 09:13:55	2026-06-10	4
78	1	45	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 043 kamar P043: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
82	1	47	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 045 kamar P045: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
80	1	46	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 044 kamar P044: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
57	33	33	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
74	1	43	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 041 kamar P041: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
65	37	37	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
59	34	34	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
64	1	36	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 034 kamar P034: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
46	1	27	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 025 kamar P025: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
72	1	42	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 040 kamar P040: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
69	39	39	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
55	32	32	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:55	2026-06-10	4
56	1	32	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 030 kamar P030: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
84	1	48	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 046 kamar P046: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
126	1	71	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 069 kamar P069: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
116	1	66	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 064 kamar P064: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
112	1	64	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 062 kamar P062: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
93	53	53	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
103	58	58	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
107	62	62	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
109	63	63	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
111	64	64	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
113	65	65	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
115	66	66	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
101	57	57	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
117	67	67	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
119	68	68	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
114	1	65	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 063 kamar P063: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
123	70	70	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
120	1	68	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 066 kamar P066: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
122	1	69	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 067 kamar P067: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
85	49	49	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
89	51	51	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
91	52	52	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
99	56	56	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
118	1	67	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 065 kamar P065: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
95	54	54	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
105	59	59	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
87	50	50	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
97	55	55	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
90	1	51	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 049 kamar P049: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
92	1	52	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 050 kamar P050: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
108	1	62	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 060 kamar P060: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
96	1	54	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 052 kamar P052: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
125	71	71	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
100	1	56	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 054 kamar P054: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
121	69	69	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
88	1	50	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 048 kamar P048: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
102	1	57	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 055 kamar P055: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
110	1	63	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 061 kamar P061: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
147	84	84	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
127	72	72	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
151	86	86	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
153	87	87	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
155	88	88	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
157	89	89	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
159	90	90	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
163	92	92	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
167	94	94	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
150	1	85	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 083 kamar P083: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
133	75	75	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
152	1	86	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 084 kamar P084: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
161	91	91	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
135	76	76	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
129	73	73	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
139	78	78	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
143	82	82	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
137	77	77	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
141	79	79	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
160	1	90	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 088 kamar P088: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
145	83	83	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
148	1	84	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 082 kamar P082: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
164	1	92	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 090 kamar P090: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
149	85	85	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
128	1	72	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 070 kamar P070: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
166	1	93	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 091 kamar P091: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
130	1	73	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 071 kamar P071: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
131	74	74	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
134	1	75	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 073 kamar P073: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
168	1	94	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 092 kamar P092: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
140	1	78	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 076 kamar P076: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
142	1	79	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 077 kamar P077: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
165	93	93	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
132	1	74	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 072 kamar P072: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
158	1	89	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 087 kamar P087: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
154	1	87	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 085 kamar P085: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
203	114	114	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
188	1	106	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 104 kamar P104: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
199	112	112	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
208	1	116	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 114 kamar P114: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
174	1	97	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 095 kamar P095: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
207	116	116	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
195	110	110	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
206	1	115	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 113 kamar P113: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
176	1	98	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 096 kamar P096: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
185	105	105	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
187	106	106	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
173	97	97	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
198	1	111	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 109 kamar P109: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
189	107	107	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
191	108	108	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
201	113	113	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
177	99	99	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
204	1	114	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 112 kamar P112: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
190	1	107	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 105 kamar P105: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
196	1	110	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 108 kamar P108: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
194	1	109	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 107 kamar P107: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
197	111	111	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
179	102	102	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
209	117	117	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
205	115	115	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
169	95	95	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
192	1	108	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 106 kamar P106: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
171	96	96	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
193	109	109	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
202	1	113	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 111 kamar P111: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
210	1	117	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 115 kamar P115: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
175	98	98	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
181	103	103	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
183	104	104	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
229	129	129	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
225	127	127	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
231	130	130	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
239	134	134	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
236	1	132	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 130 kamar P130: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
241	135	135	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
243	136	136	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
245	137	137	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
247	138	138	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
249	139	139	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
251	142	142	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
226	1	127	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 125 kamar P125: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
237	133	133	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
240	1	134	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 132 kamar P132: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
221	125	125	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
215	122	122	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
217	123	123	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
227	128	128	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
219	124	124	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
242	1	135	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 133 kamar P133: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
235	132	132	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
250	1	139	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 137 kamar P137: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
244	1	136	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 134 kamar P134: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
233	131	131	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
246	1	137	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 135 kamar P135: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
252	1	142	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 140 kamar P140: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
220	1	124	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 122 kamar P122: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
228	1	128	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 126 kamar P126: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
211	118	118	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
222	1	125	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 123 kamar P123: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
234	1	131	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 129 kamar P129: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
224	1	126	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 124 kamar P124: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
223	126	126	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
213	119	119	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
218	1	123	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 121 kamar P121: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
238	1	133	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 131 kamar P131: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
248	1	138	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 136 kamar P136: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
259	146	146	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
261	147	147	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
265	149	149	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
274	1	153	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 151 kamar P151: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
267	150	150	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
271	152	152	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
273	153	153	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
275	154	154	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
277	155	155	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
279	156	156	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
283	158	158	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
276	1	154	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 152 kamar P152: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
285	159	159	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
287	162	162	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
257	145	145	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
292	1	164	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 162 kamar P162: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
262	1	147	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 145 kamar P145: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
293	165	165	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
269	151	151	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
263	148	148	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
284	1	158	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 156 kamar P156: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
278	1	155	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 153 kamar P153: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
291	164	164	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
272	1	152	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 150 kamar P150: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
268	1	150	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 148 kamar P148: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
256	1	144	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 142 kamar P142: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
286	1	159	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 157 kamar P157: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
281	157	157	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:57	2026-06-10	4
294	1	165	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 163 kamar P163: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
289	163	163	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
258	1	145	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 143 kamar P143: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
264	1	148	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 146 kamar P146: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
255	144	144	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
290	1	163	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 161 kamar P161: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
253	143	143	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:40	2026-06-10 09:13:56	2026-06-10	4
282	1	157	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 155 kamar P155: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
270	1	151	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 149 kamar P149: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
295	166	166	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
324	1	182	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 180 kamar P180: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
327	184	184	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
325	183	183	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
314	1	175	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 173 kamar P173: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
299	168	168	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
301	169	169	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
303	170	170	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
312	1	174	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 172 kamar P172: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
305	171	171	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
322	1	179	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 177 kamar P177: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
313	175	175	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
317	177	177	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
315	176	176	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
319	178	178	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
321	179	179	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
323	182	182	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
316	1	176	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 174 kamar P174: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
331	186	186	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
297	167	167	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
326	1	183	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 181 kamar P181: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
307	172	172	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
334	1	187	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 185 kamar P185: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
300	1	168	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 166 kamar P166: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
320	1	178	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 176 kamar P176: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
336	1	188	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 186 kamar P186: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
296	1	166	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 164 kamar P164: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
308	1	172	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 170 kamar P170: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
329	185	185	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
298	1	167	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 165 kamar P165: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
304	1	170	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 168 kamar P168: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
311	174	174	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
333	187	187	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
302	1	169	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 167 kamar P167: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
309	173	173	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
335	188	188	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
318	1	177	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 175 kamar P175: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:41	2026-06-10 16:25:13	2026-06-10	4
342	1	191	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 189 kamar P189: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
344	1	192	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 190 kamar P190: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
365	205	205	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
367	206	206	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
369	207	207	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
330	1	185	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 183 kamar P183: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
370	1	207	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 205 kamar P205: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
357	199	199	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 4 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
355	198	198	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 3 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
351	196	196	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 1 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
353	197	197	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 2 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
340	1	190	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 188 kamar P188: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
347	194	194	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
345	193	193	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
343	192	192	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
341	191	191	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
288	1	162	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 160 kamar P160: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
337	189	189	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
354	1	197	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 195 kamar P195: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
338	1	189	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 187 kamar P187: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
368	1	206	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 204 kamar P204: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
364	1	204	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 202 kamar P202: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
349	195	195	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 0 hari.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
362	1	203	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 201 kamar P201: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
366	1	205	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 203 kamar P203: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
352	1	196	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 194 kamar P194: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
136	1	76	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 074 kamar P074: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
360	1	202	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 200 kamar P200: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
339	190	190	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
328	1	184	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 182 kamar P182: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
361	203	203	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
359	202	202	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
350	1	195	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 193 kamar P193: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
332	1	186	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 184 kamar P184: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
363	204	204	penyewa	tagihan_reminder	Tagihan terlambat	Tagihan sudah melewati tanggal jatuh tempo.	f	\N	\N	2026-06-07 10:18:41	2026-06-10 09:13:57	2026-06-10	4
356	1	198	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 196 kamar P196: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
186	1	105	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 103 kamar P103: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
378	1	80	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 078 kamar P078: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:15	\N	2026-06-08 07:11:47	2026-06-10 16:25:15	2026-06-10	3
180	1	102	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 100 kamar P100: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
376	1	60	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 058 kamar P058: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:15	\N	2026-06-08 07:11:47	2026-06-10 16:25:15	2026-06-10	3
381	120	120	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:56	2026-06-10	3
98	1	55	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 053 kamar P053: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
380	1	100	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 098 kamar P098: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:15	\N	2026-06-08 07:11:47	2026-06-10 16:25:15	2026-06-10	3
184	1	104	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 102 kamar P102: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
379	100	100	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:56	2026-06-10	3
216	1	122	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 120 kamar P120: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
94	1	53	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 051 kamar P051: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
377	80	80	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:56	2026-06-10	3
144	1	82	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 080 kamar P080: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
232	1	130	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 128 kamar P128: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
146	1	83	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 081 kamar P081: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
358	1	199	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 197 kamar P197: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
212	1	118	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 116 kamar P116: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
36	1	22	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 020 kamar P020: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
20	1	12	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 010 kamar P010: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-07 16:06:27	\N	2026-06-07 10:18:39	2026-06-07 16:06:27	2026-06-07	1
62	1	35	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 033 kamar P033: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
54	1	31	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 029 kamar P029: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
182	1	103	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 101 kamar P101: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
375	60	60	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:56	2026-06-10	3
2	1	3	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 001 kamar P001: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
372	1	20	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 018 kamar P018: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:16	\N	2026-06-08 07:11:46	2026-06-10 16:25:16	2026-06-10	3
66	1	37	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 035 kamar P035: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
373	40	40	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:46	2026-06-10 09:13:55	2026-06-10	3
260	1	146	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 144 kamar P144: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
214	1	119	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 117 kamar P117: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
178	1	99	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 097 kamar P097: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
371	20	20	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:46	2026-06-10 09:13:55	2026-06-10	3
86	1	49	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 047 kamar P047: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
170	1	95	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 093 kamar P093: Tagihan akan jatuh tempo dalam 0 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
306	1	171	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 169 kamar P169: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
405	141	141	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:06	2026-06-10 09:13:56	2026-06-10	2
391	209	210	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:48	2026-06-09 13:50:07	2026-06-09	2
409	201	201	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:07	2026-06-10 09:13:57	2026-06-10	2
172	1	96	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 094 kamar P094: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
58	1	33	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 031 kamar P031: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
385	160	160	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:57	2026-06-10	3
400	1	81	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 079 kamar P079: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:16	\N	2026-06-09 13:50:05	2026-06-10 16:25:16	2026-06-10	2
60	1	34	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 032 kamar P032: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
402	1	101	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 099 kamar P099: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:15	\N	2026-06-09 13:50:06	2026-06-10 16:25:15	2026-06-10	2
403	121	121	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:06	2026-06-10 09:13:56	2026-06-10	2
389	200	200	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:48	2026-06-10 09:13:57	2026-06-10	3
394	1	21	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 019 kamar P019: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:16	\N	2026-06-09 13:50:05	2026-06-10 16:25:16	2026-06-10	2
395	41	41	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:05	2026-06-10 09:13:55	2026-06-10	2
397	61	61	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:05	2026-06-10 09:13:56	2026-06-10	2
398	1	61	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 059 kamar P059: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:16	\N	2026-06-09 13:50:05	2026-06-10 16:25:16	2026-06-10	2
383	140	140	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:56	2026-06-10	3
396	1	41	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 039 kamar P039: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:16	\N	2026-06-09 13:50:05	2026-06-10 16:25:16	2026-06-10	2
392	1	210	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	Demo H7 Penyewa kamar DEMO-H7: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-09 13:50:20	\N	2026-06-08 07:11:48	2026-06-09 13:50:20	2026-06-09	2
310	1	173	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 171 kamar P171: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
387	180	180	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 5 hari.	f	\N	\N	2026-06-08 07:11:47	2026-06-10 09:13:57	2026-06-10	3
404	1	121	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 119 kamar P119: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:15	\N	2026-06-09 13:50:06	2026-06-10 16:25:15	2026-06-10	2
407	181	181	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:07	2026-06-10 09:13:57	2026-06-10	2
401	101	101	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:06	2026-06-10 09:13:56	2026-06-10	2
406	1	141	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 139 kamar P139: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:15	\N	2026-06-09 13:50:06	2026-06-10 16:25:15	2026-06-10	2
124	1	70	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 068 kamar P068: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
374	1	40	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 038 kamar P038: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:16	\N	2026-06-08 07:11:46	2026-06-10 16:25:16	2026-06-10	3
399	81	81	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:05	2026-06-10 09:13:56	2026-06-10	2
393	21	21	penyewa	tagihan_reminder	Tagihan akan jatuh tempo	Tagihan akan jatuh tempo dalam 6 hari.	f	\N	\N	2026-06-09 13:50:04	2026-06-10 09:13:55	2026-06-10	2
386	1	160	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 158 kamar P158: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:14	\N	2026-06-08 07:11:47	2026-06-10 16:25:14	2026-06-10	3
388	1	180	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 178 kamar P178: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:14	\N	2026-06-08 07:11:47	2026-06-10 16:25:14	2026-06-10	3
280	1	156	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 154 kamar P154: Tagihan akan jatuh tempo dalam 1 hari.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
408	1	181	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 179 kamar P179: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:14	\N	2026-06-09 13:50:07	2026-06-10 16:25:14	2026-06-10	2
348	1	194	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 192 kamar P192: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
384	1	140	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 138 kamar P138: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:16	\N	2026-06-08 07:11:47	2026-06-10 16:25:16	2026-06-10	3
410	1	201	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 199 kamar P199: Tagihan akan jatuh tempo dalam 6 hari.	t	2026-06-10 16:25:13	\N	2026-06-09 13:50:07	2026-06-10 16:25:13	2026-06-10	2
266	1	149	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 147 kamar P147: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:13	\N	2026-06-07 10:18:40	2026-06-10 16:25:13	2026-06-10	4
346	1	193	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 191 kamar P191: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:41	2026-06-10 16:25:14	2026-06-10	4
390	1	200	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 198 kamar P198: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:14	\N	2026-06-08 07:11:48	2026-06-10 16:25:14	2026-06-10	3
230	1	129	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 127 kamar P127: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:14	\N	2026-06-07 10:18:40	2026-06-10 16:25:14	2026-06-10	4
156	1	88	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 086 kamar P086: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
162	1	91	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 089 kamar P089: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
254	1	143	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 141 kamar P141: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
138	1	77	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 075 kamar P075: Tagihan akan jatuh tempo dalam 2 hari.	t	2026-06-10 16:25:15	\N	2026-06-07 10:18:40	2026-06-10 16:25:15	2026-06-10	4
200	1	112	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 110 kamar P110: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
382	1	120	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 118 kamar P118: Tagihan akan jatuh tempo dalam 5 hari.	t	2026-06-10 16:25:16	\N	2026-06-08 07:11:47	2026-06-10 16:25:16	2026-06-10	3
106	1	59	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 057 kamar P057: Tagihan akan jatuh tempo dalam 4 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
104	1	58	admin	admin_tagihan_reminder	Tagihan akan jatuh tempo	PAG-DEMO Penghuni 056 kamar P056: Tagihan akan jatuh tempo dalam 3 hari.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:40	2026-06-10 16:25:16	2026-06-10	4
10	1	7	admin	admin_tagihan_reminder	Tagihan terlambat	PAG-DEMO Penghuni 005 kamar P005: Tagihan sudah melewati tanggal jatuh tempo.	t	2026-06-10 16:25:16	\N	2026-06-07 10:18:39	2026-06-10 16:25:16	2026-06-10	4
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: pembayaran; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.pembayaran (id_pembayaran, id_tagihan, tanggal_bayar, jumlah_bayar, metode_pembayaran, bukti_bayar, status_verifikasi, catatan_admin, created_at, updated_at) FROM stdin;
1	1	2026-06-06	1200000.00	Tunai	bukti-bayar/2l9eqXgcDIuMlSzLscd0HiYLgL1OcHPkO5tw9t6n.pdf	diterima	\N	2026-06-06 20:07:37	2026-06-06 20:07:37
2	2	2026-06-06	2400000.00	transfer bank	bukti-pembayaran/4Qi0cYA9HCxZNncdD65V4rujxTF2xXEG1gzoAFac.pdf	diterima	\N	2026-06-06 20:10:00	2026-06-06 20:10:08
3	3	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:28	2026-06-07 09:04:28
21	21	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
22	22	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
24	24	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
25	25	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
26	26	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
27	27	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
28	28	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
29	29	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
30	30	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
31	31	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
32	32	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
33	33	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
34	34	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
35	35	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
36	36	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
37	37	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
38	38	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
39	39	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
40	40	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
41	41	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
42	42	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
43	43	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
44	44	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
45	45	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
46	46	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
47	47	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
48	48	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
49	49	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
50	50	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
51	51	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
52	52	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
53	53	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
54	54	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
55	55	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
56	56	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
57	57	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
58	58	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
59	59	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
60	60	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
61	61	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
62	62	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
63	63	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
64	64	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
65	65	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
66	66	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
67	67	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
68	68	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
69	69	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
70	70	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
71	71	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
72	72	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
73	73	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
74	74	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
75	75	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
76	76	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
77	77	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
78	78	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
79	79	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
80	80	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
5	5	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:29	2026-06-07 16:06:30
6	6	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:29	2026-06-07 16:06:37
7	7	2026-06-07	1000000.00	Transfer Bank	\N	ditolak	\N	2026-06-07 09:04:29	2026-06-07 16:06:40
8	8	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:29	2026-06-07 16:06:42
9	9	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:30	2026-06-07 16:06:44
10	10	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:30	2026-06-07 16:06:46
11	11	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:30	2026-06-07 16:07:08
12	12	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:30	2026-06-07 16:07:10
13	13	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:30	2026-06-07 16:07:11
14	14	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:31	2026-06-07 16:14:11
15	15	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:31	2026-06-07 19:02:40
18	18	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:31	2026-06-07 19:02:43
17	17	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:31	2026-06-07 19:02:44
23	23	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:32	2026-06-07 19:02:46
19	19	2026-06-07	1000000.00	Transfer Bank	\N	ditolak	\N	2026-06-07 09:04:32	2026-06-07 20:49:30
20	20	2026-06-07	1000000.00	Transfer Bank	\N	ditolak	\N	2026-06-07 09:04:32	2026-06-10 22:35:52
81	81	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
82	82	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
83	83	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
84	84	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
85	85	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
86	86	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
87	87	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
88	88	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
89	89	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
90	90	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
91	91	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
92	92	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
93	93	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
94	94	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
95	95	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
96	96	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
97	97	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
98	98	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
99	99	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
100	100	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
101	101	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
102	102	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
103	103	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
104	104	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
105	105	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
106	106	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
107	107	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
108	108	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
109	109	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
110	110	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
111	111	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
112	112	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
113	113	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
114	114	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
115	115	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
116	116	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
117	117	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
118	118	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
119	119	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
120	120	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
121	121	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
122	122	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
123	123	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
124	124	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
125	125	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
126	126	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
127	127	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
128	128	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
129	129	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
130	130	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
131	131	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
132	132	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
133	133	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
134	134	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
135	135	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
136	136	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
137	137	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
138	138	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
139	139	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
140	140	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
141	141	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
142	142	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
143	143	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
144	144	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
145	145	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
146	146	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
147	147	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
148	148	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
149	149	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
150	150	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
151	151	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
152	152	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
153	153	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
154	154	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
155	155	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
156	156	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
157	157	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
158	158	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
159	159	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
160	160	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
162	162	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
163	163	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
164	164	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
165	165	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
166	166	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
167	167	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
168	168	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
169	169	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
170	170	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
171	171	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
172	172	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
173	173	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
174	174	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
175	175	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
176	176	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
177	177	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
178	178	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
179	179	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
180	180	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
181	181	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
182	182	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
183	183	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
184	184	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
185	185	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
186	186	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
187	187	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
188	188	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
189	189	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
190	190	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
191	191	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
192	192	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
193	193	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
194	194	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
195	195	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
196	196	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
197	197	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
198	198	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
199	199	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
200	200	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
201	201	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
202	202	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
203	203	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
204	204	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
205	205	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
206	206	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
207	207	2026-06-07	1000000.00	Transfer Bank	\N	pending	\N	2026-06-07 09:05:10	2026-06-07 09:05:10
4	4	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:29	2026-06-07 16:06:22
16	16	2026-06-07	1000000.00	Transfer Bank	\N	diterima	\N	2026-06-07 09:04:31	2026-06-07 19:02:42
161	161	2026-06-07	1000000.00	Transfer Bank	\N	ditolak	\N	2026-06-07 09:05:00	2026-06-07 20:34:56
208	208	2026-06-07	1200000.00	Tunai	bukti-bayar/8CJWfBUtX9y8iE7zHRNkZ38C9ukMoSqmeQo73Jy9.jpg	diterima	\N	2026-06-07 20:38:27	2026-06-07 20:38:27
209	20	2026-06-10	1000000.00	e-wallet	bukti-pembayaran/kpBU5Cdl53cObwdi4N0uiyTnBnUCyfRepNvjgo9a.pdf	ditolak	\N	2026-06-10 22:36:31	2026-06-10 23:03:35
210	212	2026-06-10	1200000.00	Transfer Bank	bukti-bayar/tVExuqynIKDffGsX6uaSLSR0QF2gEvAprwIhRoZF.pdf	diterima	\N	2026-06-10 23:22:23	2026-06-10 23:22:23
\.


--
-- Data for Name: pengeluaran; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.pengeluaran (id_pengeluaran, judul_pengeluaran, deskripsi, jumlah_pengeluaran, tanggal_pengeluaran, bukti_foto, dibuat_oleh, created_at, updated_at) FROM stdin;
1	das	asdaa	800000.00	2026-06-06	\N	1	2026-06-06 20:09:46	2026-06-06 20:09:46
2	Perbaikan kamar	\N	1000000.00	2026-06-10	\N	1	2026-06-11 03:05:43	2026-06-11 03:05:43
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: riwayat_sewa; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.riwayat_sewa (id_sewa, id_user, id_kamar, tanggal_masuk, tanggal_keluar, harga_deal, durasi_sewa_bulan, status_sewa, created_at, updated_at) FROM stdin;
4	5	4	2026-01-01	2026-06-10	12000000.00	12	selesai	2026-06-07 09:04:29	2026-06-10 07:21:28
2	3	2	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:28	2026-06-07 09:04:28
3	4	3	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:29	2026-06-07 09:04:29
5	6	5	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:29	2026-06-07 09:04:29
6	7	6	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:29	2026-06-07 09:04:29
7	8	7	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:29	2026-06-07 09:04:29
8	9	8	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:30	2026-06-07 09:04:30
9	10	9	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:30	2026-06-07 09:04:30
10	11	10	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:30	2026-06-07 09:04:30
11	12	11	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:30	2026-06-07 09:04:30
12	13	12	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:30	2026-06-07 09:04:30
13	14	13	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:31	2026-06-07 09:04:31
14	15	14	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:31	2026-06-07 09:04:31
15	16	15	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:31	2026-06-07 09:04:31
16	17	16	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:31	2026-06-07 09:04:31
17	18	17	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:31	2026-06-07 09:04:31
18	19	18	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:32	2026-06-07 09:04:32
19	20	19	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:32	2026-06-07 09:04:32
20	21	20	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:32	2026-06-07 09:04:32
21	22	21	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:32	2026-06-07 09:04:32
22	23	22	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:32	2026-06-07 09:04:32
23	24	23	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:33	2026-06-07 09:04:33
24	25	24	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:33	2026-06-07 09:04:33
25	26	25	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:33	2026-06-07 09:04:33
26	27	26	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:33	2026-06-07 09:04:33
27	28	27	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:33	2026-06-07 09:04:33
28	29	28	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:34	2026-06-07 09:04:34
30	31	30	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:34	2026-06-07 09:04:34
31	32	31	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:34	2026-06-07 09:04:34
32	33	32	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:34	2026-06-07 09:04:34
33	34	33	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:35	2026-06-07 09:04:35
34	35	34	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:35	2026-06-07 09:04:35
35	36	35	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:35	2026-06-07 09:04:35
36	37	36	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:35	2026-06-07 09:04:35
37	38	37	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:35	2026-06-07 09:04:35
38	39	38	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:36	2026-06-07 09:04:36
39	40	39	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:36	2026-06-07 09:04:36
40	41	40	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:36	2026-06-07 09:04:36
41	42	41	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:36	2026-06-07 09:04:36
42	43	42	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:36	2026-06-07 09:04:36
43	44	43	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:37	2026-06-07 09:04:37
44	45	44	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:37	2026-06-07 09:04:37
45	46	45	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:37	2026-06-07 09:04:37
46	47	46	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:37	2026-06-07 09:04:37
47	48	47	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:38	2026-06-07 09:04:38
48	49	48	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:38	2026-06-07 09:04:38
49	50	49	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:38	2026-06-07 09:04:38
50	51	50	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:38	2026-06-07 09:04:38
51	52	51	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:38	2026-06-07 09:04:38
52	53	52	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:39	2026-06-07 09:04:39
53	54	53	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:39	2026-06-07 09:04:39
54	55	54	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:39	2026-06-07 09:04:39
55	56	55	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:39	2026-06-07 09:04:39
56	57	56	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:39	2026-06-07 09:04:39
57	58	57	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:40	2026-06-07 09:04:40
58	59	58	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:40	2026-06-07 09:04:40
59	60	59	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:40	2026-06-07 09:04:40
60	61	60	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:40	2026-06-07 09:04:40
61	62	61	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:40	2026-06-07 09:04:40
62	63	62	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:41	2026-06-07 09:04:41
63	64	63	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:41	2026-06-07 09:04:41
64	65	64	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:41	2026-06-07 09:04:41
65	66	65	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:41	2026-06-07 09:04:41
66	67	66	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:41	2026-06-07 09:04:41
67	68	67	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:42	2026-06-07 09:04:42
68	69	68	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:42	2026-06-07 09:04:42
69	70	69	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:42	2026-06-07 09:04:42
70	71	70	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:42	2026-06-07 09:04:42
71	72	71	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:42	2026-06-07 09:04:42
72	73	72	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:43	2026-06-07 09:04:43
73	74	73	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:43	2026-06-07 09:04:43
74	75	74	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:43	2026-06-07 09:04:43
75	76	75	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:43	2026-06-07 09:04:43
76	77	76	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:43	2026-06-07 09:04:43
77	78	77	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:44	2026-06-07 09:04:44
78	79	78	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:44	2026-06-07 09:04:44
79	80	79	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:44	2026-06-07 09:04:44
80	81	80	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:44	2026-06-07 09:04:44
81	82	81	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:44	2026-06-07 09:04:44
29	30	29	2026-01-01	2026-06-10	13000000.00	13	selesai	2026-06-07 09:04:34	2026-06-10 16:25:19
82	83	82	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:45	2026-06-07 09:04:45
83	84	83	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:45	2026-06-07 09:04:45
84	85	84	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:45	2026-06-07 09:04:45
85	86	85	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:45	2026-06-07 09:04:45
86	87	86	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:45	2026-06-07 09:04:45
87	88	87	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:46	2026-06-07 09:04:46
88	89	88	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:46	2026-06-07 09:04:46
89	90	89	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:46	2026-06-07 09:04:46
90	91	90	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:46	2026-06-07 09:04:46
91	92	91	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:46	2026-06-07 09:04:46
92	93	92	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:47	2026-06-07 09:04:47
93	94	93	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:47	2026-06-07 09:04:47
94	95	94	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:47	2026-06-07 09:04:47
95	96	95	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:47	2026-06-07 09:04:47
96	97	96	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:47	2026-06-07 09:04:47
97	98	97	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:48	2026-06-07 09:04:48
98	99	98	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:48	2026-06-07 09:04:48
99	100	99	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:48	2026-06-07 09:04:48
100	101	100	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:48	2026-06-07 09:04:48
101	102	101	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:48	2026-06-07 09:04:48
102	103	102	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:49	2026-06-07 09:04:49
103	104	103	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:49	2026-06-07 09:04:49
104	105	104	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:49	2026-06-07 09:04:49
105	106	105	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:49	2026-06-07 09:04:49
106	107	106	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:49	2026-06-07 09:04:49
107	108	107	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:50	2026-06-07 09:04:50
108	109	108	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:50	2026-06-07 09:04:50
109	110	109	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:50	2026-06-07 09:04:50
110	111	110	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:50	2026-06-07 09:04:50
111	112	111	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:50	2026-06-07 09:04:50
112	113	112	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:51	2026-06-07 09:04:51
113	114	113	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:51	2026-06-07 09:04:51
114	115	114	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:51	2026-06-07 09:04:51
115	116	115	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:51	2026-06-07 09:04:51
116	117	116	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:51	2026-06-07 09:04:51
117	118	117	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:52	2026-06-07 09:04:52
118	119	118	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:52	2026-06-07 09:04:52
119	120	119	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:52	2026-06-07 09:04:52
120	121	120	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:52	2026-06-07 09:04:52
121	122	121	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:52	2026-06-07 09:04:52
122	123	122	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:52	2026-06-07 09:04:52
123	124	123	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:53	2026-06-07 09:04:53
124	125	124	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:53	2026-06-07 09:04:53
125	126	125	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:53	2026-06-07 09:04:53
126	127	126	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:53	2026-06-07 09:04:53
127	128	127	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:53	2026-06-07 09:04:53
128	129	128	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:54	2026-06-07 09:04:54
129	130	129	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:54	2026-06-07 09:04:54
130	131	130	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:54	2026-06-07 09:04:54
131	132	131	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:54	2026-06-07 09:04:54
132	133	132	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:54	2026-06-07 09:04:54
133	134	133	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:55	2026-06-07 09:04:55
134	135	134	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:55	2026-06-07 09:04:55
135	136	135	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:55	2026-06-07 09:04:55
136	137	136	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:55	2026-06-07 09:04:55
137	138	137	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:55	2026-06-07 09:04:55
138	139	138	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:56	2026-06-07 09:04:56
139	140	139	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:56	2026-06-07 09:04:56
140	141	140	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:56	2026-06-07 09:04:56
141	142	141	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:56	2026-06-07 09:04:56
142	143	142	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:56	2026-06-07 09:04:56
143	144	143	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:57	2026-06-07 09:04:57
144	145	144	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:57	2026-06-07 09:04:57
145	146	145	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:57	2026-06-07 09:04:57
146	147	146	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:57	2026-06-07 09:04:57
147	148	147	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:57	2026-06-07 09:04:57
148	149	148	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:58	2026-06-07 09:04:58
149	150	149	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:58	2026-06-07 09:04:58
150	151	150	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:58	2026-06-07 09:04:58
151	152	151	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:58	2026-06-07 09:04:58
152	153	152	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:58	2026-06-07 09:04:58
153	154	153	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:59	2026-06-07 09:04:59
154	155	154	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:59	2026-06-07 09:04:59
155	156	155	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:59	2026-06-07 09:04:59
156	157	156	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:59	2026-06-07 09:04:59
157	158	157	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:04:59	2026-06-07 09:04:59
158	159	158	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:00	2026-06-07 09:05:00
159	160	159	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:00	2026-06-07 09:05:00
161	162	161	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:00	2026-06-07 09:05:00
162	163	162	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:01	2026-06-07 09:05:01
163	164	163	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:01	2026-06-07 09:05:01
164	165	164	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:01	2026-06-07 09:05:01
165	166	165	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:01	2026-06-07 09:05:01
166	167	166	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:01	2026-06-07 09:05:01
167	168	167	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:02	2026-06-07 09:05:02
168	169	168	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:02	2026-06-07 09:05:02
169	170	169	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:02	2026-06-07 09:05:02
170	171	170	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:02	2026-06-07 09:05:02
171	172	171	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:02	2026-06-07 09:05:02
172	173	172	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:03	2026-06-07 09:05:03
173	174	173	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:03	2026-06-07 09:05:03
174	175	174	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:03	2026-06-07 09:05:03
175	176	175	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:03	2026-06-07 09:05:03
176	177	176	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:03	2026-06-07 09:05:03
177	178	177	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:04	2026-06-07 09:05:04
178	179	178	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:04	2026-06-07 09:05:04
179	180	179	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:04	2026-06-07 09:05:04
180	181	180	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:04	2026-06-07 09:05:04
181	182	181	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:04	2026-06-07 09:05:04
182	183	182	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:05	2026-06-07 09:05:05
183	184	183	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:05	2026-06-07 09:05:05
184	185	184	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:05	2026-06-07 09:05:05
185	186	185	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:05	2026-06-07 09:05:05
186	187	186	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:05	2026-06-07 09:05:05
187	188	187	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:06	2026-06-07 09:05:06
188	189	188	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:06	2026-06-07 09:05:06
189	190	189	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:06	2026-06-07 09:05:06
190	191	190	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:06	2026-06-07 09:05:06
191	192	191	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:06	2026-06-07 09:05:06
192	193	192	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:07	2026-06-07 09:05:07
193	194	193	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:07	2026-06-07 09:05:07
194	195	194	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:07	2026-06-07 09:05:07
195	196	195	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:07	2026-06-07 09:05:07
196	197	196	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:07	2026-06-07 09:05:07
197	198	197	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:08	2026-06-07 09:05:08
198	199	198	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:08	2026-06-07 09:05:08
199	200	199	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:08	2026-06-07 09:05:08
200	201	200	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:08	2026-06-07 09:05:08
201	202	201	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:09	2026-06-07 09:05:09
202	203	202	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:09	2026-06-07 09:05:09
203	204	203	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:09	2026-06-07 09:05:09
204	205	204	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:09	2026-06-07 09:05:09
205	206	205	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:09	2026-06-07 09:05:09
206	207	206	2026-01-01	2026-12-31	12000000.00	12	aktif	2026-06-07 09:05:10	2026-06-07 09:05:10
1	2	1	2026-06-06	2026-06-07	3600000.00	3	selesai	2026-06-06 20:07:37	2026-06-07 16:12:34
160	161	160	2026-01-01	2026-06-07	12000000.00	12	selesai	2026-06-07 09:05:00	2026-06-07 20:35:19
207	208	1	2026-06-07	2026-06-07	2400000.00	2	selesai	2026-06-07 20:38:27	2026-06-07 20:49:07
208	209	207	2026-05-15	2026-06-10	750000.00	1	selesai	2026-06-07 20:39:49	2026-06-10 07:22:01
209	210	1	2026-06-10	2026-07-10	1200000.00	1	aktif	2026-06-10 23:22:23	2026-06-10 23:22:23
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
0DWvPOpOvoLXkIGLWJQrhUT8pQELYkQ5owbU6qSL	\N	172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJfdG9rZW4iOiJlbnRENzdneE14Y1BSNUt1VE9Hd21xYlZ3V09ySW9qaVh4dnU2dzFvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzE5Mi4xNjguMC42OjgwMDAiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=	1781083004
V7KlIIUY77xtMwfySmK7KCSFQfJgVE6nc7baQ88y	\N	172.18.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	eyJfdG9rZW4iOiJ1bW5VSzdxVlh6dmN5Sk9ha2hvMks1eXZiOUdLTmpnd244Nk1wNGdiIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzE5Mi4xNjguMC42OjgwMDAiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=	1781083087
eUui9x8zLMYBtQugcelBZpwfi9cxTJ8QVUBUvy1v	\N	172.18.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	eyJfdG9rZW4iOiJVSHh0OWdsRHZpNmZydFVMUW0zSzEzZzJTSjNJcGJxc2djNDdGc1p2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzE5Mi4xNjguMTM3LjI1Mjo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19	1781136386
\.


--
-- Data for Name: tagihan; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.tagihan (id_tagihan, id_sewa, kode_invoice, tanggal_tagihan, tanggal_jatuh_tempo, total_tagihan, status_tagihan, created_at, updated_at) FROM stdin;
1	1	INV-20260606200737-2	2026-06-06	2026-06-06	1200000.00	lunas	2026-06-06 20:07:37	2026-06-06 20:07:37
2	1	INV-EXT-20260606-1-FI0YLO	2026-06-06	2026-07-06	2400000.00	lunas	2026-06-06 20:09:02	2026-06-06 20:10:08
3	2	PAG-DEMO-001	2026-06-06	2026-05-29	1000000.00	telat	2026-06-07 09:04:28	2026-06-07 09:04:28
7	6	PAG-DEMO-005	2026-06-02	2026-06-02	1000000.00	telat	2026-06-07 09:04:29	2026-06-07 09:04:29
20	19	PAG-DEMO-018	2026-05-20	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:32	2026-06-07 09:04:32
21	20	PAG-DEMO-019	2026-05-19	2026-06-16	1000000.00	telat	2026-06-07 09:04:32	2026-06-07 09:04:32
22	21	PAG-DEMO-020	2026-05-18	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:32	2026-06-07 09:04:32
24	23	PAG-DEMO-022	2026-05-16	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:33	2026-06-07 09:04:33
25	24	PAG-DEMO-023	2026-05-15	2026-05-31	1000000.00	telat	2026-06-07 09:04:33	2026-06-07 09:04:33
26	25	PAG-DEMO-024	2026-05-14	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:33	2026-06-07 09:04:33
27	26	PAG-DEMO-025	2026-05-13	2026-06-02	1000000.00	telat	2026-06-07 09:04:33	2026-06-07 09:04:33
28	27	PAG-DEMO-026	2026-05-12	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:33	2026-06-07 09:04:33
29	28	PAG-DEMO-027	2026-05-11	2026-06-04	1000000.00	telat	2026-06-07 09:04:34	2026-06-07 09:04:34
31	30	PAG-DEMO-029	2026-05-09	2026-06-06	1000000.00	telat	2026-06-07 09:04:34	2026-06-07 09:04:34
32	31	PAG-DEMO-030	2026-06-07	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:34	2026-06-07 09:04:34
33	32	PAG-DEMO-031	2026-06-06	2026-06-08	1000000.00	telat	2026-06-07 09:04:34	2026-06-07 09:04:34
34	33	PAG-DEMO-032	2026-06-05	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:35	2026-06-07 09:04:35
35	34	PAG-DEMO-033	2026-06-04	2026-06-10	1000000.00	telat	2026-06-07 09:04:35	2026-06-07 09:04:35
36	35	PAG-DEMO-034	2026-06-03	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:35	2026-06-07 09:04:35
37	36	PAG-DEMO-035	2026-06-02	2026-06-12	1000000.00	telat	2026-06-07 09:04:35	2026-06-07 09:04:35
38	37	PAG-DEMO-036	2026-06-01	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:04:35	2026-06-07 09:04:35
39	38	PAG-DEMO-037	2026-05-31	2026-06-14	1000000.00	telat	2026-06-07 09:04:36	2026-06-07 09:04:36
40	39	PAG-DEMO-038	2026-05-30	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:36	2026-06-07 09:04:36
41	40	PAG-DEMO-039	2026-05-29	2026-06-16	1000000.00	telat	2026-06-07 09:04:36	2026-06-07 09:04:36
42	41	PAG-DEMO-040	2026-05-28	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:36	2026-06-07 09:04:36
43	42	PAG-DEMO-041	2026-05-27	2026-05-29	1000000.00	telat	2026-06-07 09:04:36	2026-06-07 09:04:36
44	43	PAG-DEMO-042	2026-05-26	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:37	2026-06-07 09:04:37
45	44	PAG-DEMO-043	2026-05-25	2026-05-31	1000000.00	telat	2026-06-07 09:04:37	2026-06-07 09:04:37
46	45	PAG-DEMO-044	2026-05-24	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:37	2026-06-07 09:04:37
47	46	PAG-DEMO-045	2026-05-23	2026-06-02	1000000.00	telat	2026-06-07 09:04:37	2026-06-07 09:04:37
48	47	PAG-DEMO-046	2026-05-22	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:38	2026-06-07 09:04:38
49	48	PAG-DEMO-047	2026-05-21	2026-06-04	1000000.00	telat	2026-06-07 09:04:38	2026-06-07 09:04:38
50	49	PAG-DEMO-048	2026-05-20	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:04:38	2026-06-07 09:04:38
51	50	PAG-DEMO-049	2026-05-19	2026-06-06	1000000.00	telat	2026-06-07 09:04:38	2026-06-07 09:04:38
52	51	PAG-DEMO-050	2026-05-18	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:38	2026-06-07 09:04:38
53	52	PAG-DEMO-051	2026-05-17	2026-06-08	1000000.00	telat	2026-06-07 09:04:39	2026-06-07 09:04:39
54	53	PAG-DEMO-052	2026-05-16	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:39	2026-06-07 09:04:39
55	54	PAG-DEMO-053	2026-05-15	2026-06-10	1000000.00	telat	2026-06-07 09:04:39	2026-06-07 09:04:39
56	55	PAG-DEMO-054	2026-05-14	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:39	2026-06-07 09:04:39
57	56	PAG-DEMO-055	2026-05-13	2026-06-12	1000000.00	telat	2026-06-07 09:04:39	2026-06-07 09:04:39
58	57	PAG-DEMO-056	2026-05-12	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:04:40	2026-06-07 09:04:40
59	58	PAG-DEMO-057	2026-05-11	2026-06-14	1000000.00	telat	2026-06-07 09:04:40	2026-06-07 09:04:40
60	59	PAG-DEMO-058	2026-05-10	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:40	2026-06-07 09:04:40
61	60	PAG-DEMO-059	2026-05-09	2026-06-16	1000000.00	telat	2026-06-07 09:04:40	2026-06-07 09:04:40
62	61	PAG-DEMO-060	2026-06-07	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:40	2026-06-07 09:04:40
63	62	PAG-DEMO-061	2026-06-06	2026-05-29	1000000.00	telat	2026-06-07 09:04:41	2026-06-07 09:04:41
64	63	PAG-DEMO-062	2026-06-05	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:41	2026-06-07 09:04:41
65	64	PAG-DEMO-063	2026-06-04	2026-05-31	1000000.00	telat	2026-06-07 09:04:41	2026-06-07 09:04:41
66	65	PAG-DEMO-064	2026-06-03	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:41	2026-06-07 09:04:41
67	66	PAG-DEMO-065	2026-06-02	2026-06-02	1000000.00	telat	2026-06-07 09:04:41	2026-06-07 09:04:41
68	67	PAG-DEMO-066	2026-06-01	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:42	2026-06-07 09:04:42
69	68	PAG-DEMO-067	2026-05-31	2026-06-04	1000000.00	telat	2026-06-07 09:04:42	2026-06-07 09:04:42
70	69	PAG-DEMO-068	2026-05-30	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:04:42	2026-06-07 09:04:42
71	70	PAG-DEMO-069	2026-05-29	2026-06-06	1000000.00	telat	2026-06-07 09:04:42	2026-06-07 09:04:42
72	71	PAG-DEMO-070	2026-05-28	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:42	2026-06-07 09:04:42
73	72	PAG-DEMO-071	2026-05-27	2026-06-08	1000000.00	telat	2026-06-07 09:04:43	2026-06-07 09:04:43
74	73	PAG-DEMO-072	2026-05-26	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:43	2026-06-07 09:04:43
75	74	PAG-DEMO-073	2026-05-25	2026-06-10	1000000.00	telat	2026-06-07 09:04:43	2026-06-07 09:04:43
76	75	PAG-DEMO-074	2026-05-24	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:43	2026-06-07 09:04:43
77	76	PAG-DEMO-075	2026-05-23	2026-06-12	1000000.00	telat	2026-06-07 09:04:43	2026-06-07 09:04:43
78	77	PAG-DEMO-076	2026-05-22	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:04:44	2026-06-07 09:04:44
5	4	PAG-DEMO-003	2026-06-04	2026-05-31	1000000.00	lunas	2026-06-07 09:04:29	2026-06-07 16:06:30
6	5	PAG-DEMO-004	2026-06-03	2026-06-01	1000000.00	lunas	2026-06-07 09:04:29	2026-06-07 16:06:37
8	7	PAG-DEMO-006	2026-06-01	2026-06-03	1000000.00	lunas	2026-06-07 09:04:29	2026-06-07 16:06:42
9	8	PAG-DEMO-007	2026-05-31	2026-06-04	1000000.00	lunas	2026-06-07 09:04:30	2026-06-07 16:06:44
10	9	PAG-DEMO-008	2026-05-30	2026-06-05	1000000.00	lunas	2026-06-07 09:04:30	2026-06-07 16:06:46
11	10	PAG-DEMO-009	2026-05-29	2026-06-06	1000000.00	lunas	2026-06-07 09:04:30	2026-06-07 16:07:08
12	11	PAG-DEMO-010	2026-05-28	2026-06-07	1000000.00	lunas	2026-06-07 09:04:30	2026-06-07 16:07:10
13	12	PAG-DEMO-011	2026-05-27	2026-06-08	1000000.00	lunas	2026-06-07 09:04:30	2026-06-07 16:07:11
14	13	PAG-DEMO-012	2026-05-26	2026-06-09	1000000.00	lunas	2026-06-07 09:04:31	2026-06-07 16:14:11
15	14	PAG-DEMO-013	2026-05-25	2026-06-10	1000000.00	lunas	2026-06-07 09:04:31	2026-06-07 19:02:40
16	15	PAG-DEMO-014	2026-05-24	2026-06-11	1000000.00	lunas	2026-06-07 09:04:31	2026-06-07 19:02:42
18	17	PAG-DEMO-016	2026-05-22	2026-06-13	1000000.00	lunas	2026-06-07 09:04:31	2026-06-07 19:02:43
17	16	PAG-DEMO-015	2026-05-23	2026-06-12	1000000.00	lunas	2026-06-07 09:04:31	2026-06-07 19:02:44
23	22	PAG-DEMO-021	2026-05-17	2026-05-29	1000000.00	lunas	2026-06-07 09:04:32	2026-06-07 19:02:46
19	18	PAG-DEMO-017	2026-05-21	2026-06-14	1000000.00	belum_bayar	2026-06-07 09:04:32	2026-06-07 20:49:30
30	29	PAG-DEMO-028	2026-05-10	2026-06-05	1000000.00	dibatalkan	2026-06-07 09:04:34	2026-06-10 16:25:19
79	78	PAG-DEMO-077	2026-05-21	2026-06-14	1000000.00	telat	2026-06-07 09:04:44	2026-06-07 09:04:44
80	79	PAG-DEMO-078	2026-05-20	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:44	2026-06-07 09:04:44
81	80	PAG-DEMO-079	2026-05-19	2026-06-16	1000000.00	telat	2026-06-07 09:04:44	2026-06-07 09:04:44
82	81	PAG-DEMO-080	2026-05-18	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:44	2026-06-07 09:04:44
83	82	PAG-DEMO-081	2026-05-17	2026-05-29	1000000.00	telat	2026-06-07 09:04:45	2026-06-07 09:04:45
84	83	PAG-DEMO-082	2026-05-16	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:45	2026-06-07 09:04:45
85	84	PAG-DEMO-083	2026-05-15	2026-05-31	1000000.00	telat	2026-06-07 09:04:45	2026-06-07 09:04:45
86	85	PAG-DEMO-084	2026-05-14	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:45	2026-06-07 09:04:45
87	86	PAG-DEMO-085	2026-05-13	2026-06-02	1000000.00	telat	2026-06-07 09:04:45	2026-06-07 09:04:45
88	87	PAG-DEMO-086	2026-05-12	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:46	2026-06-07 09:04:46
89	88	PAG-DEMO-087	2026-05-11	2026-06-04	1000000.00	telat	2026-06-07 09:04:46	2026-06-07 09:04:46
90	89	PAG-DEMO-088	2026-05-10	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:04:46	2026-06-07 09:04:46
91	90	PAG-DEMO-089	2026-05-09	2026-06-06	1000000.00	telat	2026-06-07 09:04:46	2026-06-07 09:04:46
92	91	PAG-DEMO-090	2026-06-07	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:46	2026-06-07 09:04:46
93	92	PAG-DEMO-091	2026-06-06	2026-06-08	1000000.00	telat	2026-06-07 09:04:47	2026-06-07 09:04:47
94	93	PAG-DEMO-092	2026-06-05	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:47	2026-06-07 09:04:47
95	94	PAG-DEMO-093	2026-06-04	2026-06-10	1000000.00	telat	2026-06-07 09:04:47	2026-06-07 09:04:47
96	95	PAG-DEMO-094	2026-06-03	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:47	2026-06-07 09:04:47
97	96	PAG-DEMO-095	2026-06-02	2026-06-12	1000000.00	telat	2026-06-07 09:04:47	2026-06-07 09:04:47
98	97	PAG-DEMO-096	2026-06-01	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:04:48	2026-06-07 09:04:48
99	98	PAG-DEMO-097	2026-05-31	2026-06-14	1000000.00	telat	2026-06-07 09:04:48	2026-06-07 09:04:48
100	99	PAG-DEMO-098	2026-05-30	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:48	2026-06-07 09:04:48
101	100	PAG-DEMO-099	2026-05-29	2026-06-16	1000000.00	telat	2026-06-07 09:04:48	2026-06-07 09:04:48
102	101	PAG-DEMO-100	2026-05-28	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:48	2026-06-07 09:04:48
103	102	PAG-DEMO-101	2026-05-27	2026-05-29	1000000.00	telat	2026-06-07 09:04:49	2026-06-07 09:04:49
104	103	PAG-DEMO-102	2026-05-26	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:49	2026-06-07 09:04:49
105	104	PAG-DEMO-103	2026-05-25	2026-05-31	1000000.00	telat	2026-06-07 09:04:49	2026-06-07 09:04:49
106	105	PAG-DEMO-104	2026-05-24	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:49	2026-06-07 09:04:49
107	106	PAG-DEMO-105	2026-05-23	2026-06-02	1000000.00	telat	2026-06-07 09:04:49	2026-06-07 09:04:49
108	107	PAG-DEMO-106	2026-05-22	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:50	2026-06-07 09:04:50
109	108	PAG-DEMO-107	2026-05-21	2026-06-04	1000000.00	telat	2026-06-07 09:04:50	2026-06-07 09:04:50
110	109	PAG-DEMO-108	2026-05-20	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:04:50	2026-06-07 09:04:50
111	110	PAG-DEMO-109	2026-05-19	2026-06-06	1000000.00	telat	2026-06-07 09:04:50	2026-06-07 09:04:50
112	111	PAG-DEMO-110	2026-05-18	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:50	2026-06-07 09:04:50
113	112	PAG-DEMO-111	2026-05-17	2026-06-08	1000000.00	telat	2026-06-07 09:04:51	2026-06-07 09:04:51
114	113	PAG-DEMO-112	2026-05-16	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:51	2026-06-07 09:04:51
115	114	PAG-DEMO-113	2026-05-15	2026-06-10	1000000.00	telat	2026-06-07 09:04:51	2026-06-07 09:04:51
116	115	PAG-DEMO-114	2026-05-14	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:51	2026-06-07 09:04:51
117	116	PAG-DEMO-115	2026-05-13	2026-06-12	1000000.00	telat	2026-06-07 09:04:51	2026-06-07 09:04:51
118	117	PAG-DEMO-116	2026-05-12	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:04:52	2026-06-07 09:04:52
119	118	PAG-DEMO-117	2026-05-11	2026-06-14	1000000.00	telat	2026-06-07 09:04:52	2026-06-07 09:04:52
120	119	PAG-DEMO-118	2026-05-10	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:52	2026-06-07 09:04:52
121	120	PAG-DEMO-119	2026-05-09	2026-06-16	1000000.00	telat	2026-06-07 09:04:52	2026-06-07 09:04:52
122	121	PAG-DEMO-120	2026-06-07	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:52	2026-06-07 09:04:52
123	122	PAG-DEMO-121	2026-06-06	2026-05-29	1000000.00	telat	2026-06-07 09:04:52	2026-06-07 09:04:52
124	123	PAG-DEMO-122	2026-06-05	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:53	2026-06-07 09:04:53
125	124	PAG-DEMO-123	2026-06-04	2026-05-31	1000000.00	telat	2026-06-07 09:04:53	2026-06-07 09:04:53
126	125	PAG-DEMO-124	2026-06-03	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:53	2026-06-07 09:04:53
127	126	PAG-DEMO-125	2026-06-02	2026-06-02	1000000.00	telat	2026-06-07 09:04:53	2026-06-07 09:04:53
128	127	PAG-DEMO-126	2026-06-01	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:53	2026-06-07 09:04:53
129	128	PAG-DEMO-127	2026-05-31	2026-06-04	1000000.00	telat	2026-06-07 09:04:54	2026-06-07 09:04:54
130	129	PAG-DEMO-128	2026-05-30	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:04:54	2026-06-07 09:04:54
131	130	PAG-DEMO-129	2026-05-29	2026-06-06	1000000.00	telat	2026-06-07 09:04:54	2026-06-07 09:04:54
132	131	PAG-DEMO-130	2026-05-28	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:54	2026-06-07 09:04:54
133	132	PAG-DEMO-131	2026-05-27	2026-06-08	1000000.00	telat	2026-06-07 09:04:54	2026-06-07 09:04:54
134	133	PAG-DEMO-132	2026-05-26	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:55	2026-06-07 09:04:55
135	134	PAG-DEMO-133	2026-05-25	2026-06-10	1000000.00	telat	2026-06-07 09:04:55	2026-06-07 09:04:55
136	135	PAG-DEMO-134	2026-05-24	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:55	2026-06-07 09:04:55
137	136	PAG-DEMO-135	2026-05-23	2026-06-12	1000000.00	telat	2026-06-07 09:04:55	2026-06-07 09:04:55
138	137	PAG-DEMO-136	2026-05-22	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:04:55	2026-06-07 09:04:55
139	138	PAG-DEMO-137	2026-05-21	2026-06-14	1000000.00	telat	2026-06-07 09:04:56	2026-06-07 09:04:56
140	139	PAG-DEMO-138	2026-05-20	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:04:56	2026-06-07 09:04:56
141	140	PAG-DEMO-139	2026-05-19	2026-06-16	1000000.00	telat	2026-06-07 09:04:56	2026-06-07 09:04:56
142	141	PAG-DEMO-140	2026-05-18	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:04:56	2026-06-07 09:04:56
143	142	PAG-DEMO-141	2026-05-17	2026-05-29	1000000.00	telat	2026-06-07 09:04:56	2026-06-07 09:04:56
144	143	PAG-DEMO-142	2026-05-16	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:04:57	2026-06-07 09:04:57
145	144	PAG-DEMO-143	2026-05-15	2026-05-31	1000000.00	telat	2026-06-07 09:04:57	2026-06-07 09:04:57
146	145	PAG-DEMO-144	2026-05-14	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:04:57	2026-06-07 09:04:57
147	146	PAG-DEMO-145	2026-05-13	2026-06-02	1000000.00	telat	2026-06-07 09:04:57	2026-06-07 09:04:57
148	147	PAG-DEMO-146	2026-05-12	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:04:57	2026-06-07 09:04:57
149	148	PAG-DEMO-147	2026-05-11	2026-06-04	1000000.00	telat	2026-06-07 09:04:58	2026-06-07 09:04:58
150	149	PAG-DEMO-148	2026-05-10	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:04:58	2026-06-07 09:04:58
151	150	PAG-DEMO-149	2026-05-09	2026-06-06	1000000.00	telat	2026-06-07 09:04:58	2026-06-07 09:04:58
152	151	PAG-DEMO-150	2026-06-07	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:04:58	2026-06-07 09:04:58
153	152	PAG-DEMO-151	2026-06-06	2026-06-08	1000000.00	telat	2026-06-07 09:04:58	2026-06-07 09:04:58
154	153	PAG-DEMO-152	2026-06-05	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:04:59	2026-06-07 09:04:59
155	154	PAG-DEMO-153	2026-06-04	2026-06-10	1000000.00	telat	2026-06-07 09:04:59	2026-06-07 09:04:59
156	155	PAG-DEMO-154	2026-06-03	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:04:59	2026-06-07 09:04:59
157	156	PAG-DEMO-155	2026-06-02	2026-06-12	1000000.00	telat	2026-06-07 09:04:59	2026-06-07 09:04:59
158	157	PAG-DEMO-156	2026-06-01	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:05:00	2026-06-07 09:05:00
159	158	PAG-DEMO-157	2026-05-31	2026-06-14	1000000.00	telat	2026-06-07 09:05:00	2026-06-07 09:05:00
160	159	PAG-DEMO-158	2026-05-30	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:05:00	2026-06-07 09:05:00
162	161	PAG-DEMO-160	2026-05-28	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:05:00	2026-06-07 09:05:00
163	162	PAG-DEMO-161	2026-05-27	2026-05-29	1000000.00	telat	2026-06-07 09:05:01	2026-06-07 09:05:01
164	163	PAG-DEMO-162	2026-05-26	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:05:01	2026-06-07 09:05:01
165	164	PAG-DEMO-163	2026-05-25	2026-05-31	1000000.00	telat	2026-06-07 09:05:01	2026-06-07 09:05:01
166	165	PAG-DEMO-164	2026-05-24	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:05:01	2026-06-07 09:05:01
167	166	PAG-DEMO-165	2026-05-23	2026-06-02	1000000.00	telat	2026-06-07 09:05:01	2026-06-07 09:05:01
168	167	PAG-DEMO-166	2026-05-22	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:05:02	2026-06-07 09:05:02
169	168	PAG-DEMO-167	2026-05-21	2026-06-04	1000000.00	telat	2026-06-07 09:05:02	2026-06-07 09:05:02
170	169	PAG-DEMO-168	2026-05-20	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:05:02	2026-06-07 09:05:02
171	170	PAG-DEMO-169	2026-05-19	2026-06-06	1000000.00	telat	2026-06-07 09:05:02	2026-06-07 09:05:02
172	171	PAG-DEMO-170	2026-05-18	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:05:02	2026-06-07 09:05:02
173	172	PAG-DEMO-171	2026-05-17	2026-06-08	1000000.00	telat	2026-06-07 09:05:03	2026-06-07 09:05:03
174	173	PAG-DEMO-172	2026-05-16	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:05:03	2026-06-07 09:05:03
175	174	PAG-DEMO-173	2026-05-15	2026-06-10	1000000.00	telat	2026-06-07 09:05:03	2026-06-07 09:05:03
176	175	PAG-DEMO-174	2026-05-14	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:05:03	2026-06-07 09:05:03
177	176	PAG-DEMO-175	2026-05-13	2026-06-12	1000000.00	telat	2026-06-07 09:05:03	2026-06-07 09:05:03
178	177	PAG-DEMO-176	2026-05-12	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:05:04	2026-06-07 09:05:04
179	178	PAG-DEMO-177	2026-05-11	2026-06-14	1000000.00	telat	2026-06-07 09:05:04	2026-06-07 09:05:04
180	179	PAG-DEMO-178	2026-05-10	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:05:04	2026-06-07 09:05:04
181	180	PAG-DEMO-179	2026-05-09	2026-06-16	1000000.00	telat	2026-06-07 09:05:04	2026-06-07 09:05:04
182	181	PAG-DEMO-180	2026-06-07	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:05:04	2026-06-07 09:05:04
183	182	PAG-DEMO-181	2026-06-06	2026-05-29	1000000.00	telat	2026-06-07 09:05:05	2026-06-07 09:05:05
184	183	PAG-DEMO-182	2026-06-05	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:05:05	2026-06-07 09:05:05
185	184	PAG-DEMO-183	2026-06-04	2026-05-31	1000000.00	telat	2026-06-07 09:05:05	2026-06-07 09:05:05
186	185	PAG-DEMO-184	2026-06-03	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:05:05	2026-06-07 09:05:05
187	186	PAG-DEMO-185	2026-06-02	2026-06-02	1000000.00	telat	2026-06-07 09:05:05	2026-06-07 09:05:05
188	187	PAG-DEMO-186	2026-06-01	2026-06-03	1000000.00	belum_bayar	2026-06-07 09:05:06	2026-06-07 09:05:06
189	188	PAG-DEMO-187	2026-05-31	2026-06-04	1000000.00	telat	2026-06-07 09:05:06	2026-06-07 09:05:06
190	189	PAG-DEMO-188	2026-05-30	2026-06-05	1000000.00	belum_bayar	2026-06-07 09:05:06	2026-06-07 09:05:06
191	190	PAG-DEMO-189	2026-05-29	2026-06-06	1000000.00	telat	2026-06-07 09:05:06	2026-06-07 09:05:06
192	191	PAG-DEMO-190	2026-05-28	2026-06-07	1000000.00	belum_bayar	2026-06-07 09:05:06	2026-06-07 09:05:06
193	192	PAG-DEMO-191	2026-05-27	2026-06-08	1000000.00	telat	2026-06-07 09:05:07	2026-06-07 09:05:07
194	193	PAG-DEMO-192	2026-05-26	2026-06-09	1000000.00	belum_bayar	2026-06-07 09:05:07	2026-06-07 09:05:07
195	194	PAG-DEMO-193	2026-05-25	2026-06-10	1000000.00	telat	2026-06-07 09:05:07	2026-06-07 09:05:07
196	195	PAG-DEMO-194	2026-05-24	2026-06-11	1000000.00	belum_bayar	2026-06-07 09:05:07	2026-06-07 09:05:07
197	196	PAG-DEMO-195	2026-05-23	2026-06-12	1000000.00	telat	2026-06-07 09:05:07	2026-06-07 09:05:07
198	197	PAG-DEMO-196	2026-05-22	2026-06-13	1000000.00	belum_bayar	2026-06-07 09:05:08	2026-06-07 09:05:08
199	198	PAG-DEMO-197	2026-05-21	2026-06-14	1000000.00	telat	2026-06-07 09:05:08	2026-06-07 09:05:08
200	199	PAG-DEMO-198	2026-05-20	2026-06-15	1000000.00	belum_bayar	2026-06-07 09:05:08	2026-06-07 09:05:08
201	200	PAG-DEMO-199	2026-05-19	2026-06-16	1000000.00	telat	2026-06-07 09:05:08	2026-06-07 09:05:08
202	201	PAG-DEMO-200	2026-05-18	2026-05-28	1000000.00	belum_bayar	2026-06-07 09:05:09	2026-06-07 09:05:09
203	202	PAG-DEMO-201	2026-05-17	2026-05-29	1000000.00	telat	2026-06-07 09:05:09	2026-06-07 09:05:09
204	203	PAG-DEMO-202	2026-05-16	2026-05-30	1000000.00	belum_bayar	2026-06-07 09:05:09	2026-06-07 09:05:09
205	204	PAG-DEMO-203	2026-05-15	2026-05-31	1000000.00	telat	2026-06-07 09:05:09	2026-06-07 09:05:09
206	205	PAG-DEMO-204	2026-05-14	2026-06-01	1000000.00	belum_bayar	2026-06-07 09:05:09	2026-06-07 09:05:09
207	206	PAG-DEMO-205	2026-05-13	2026-06-02	1000000.00	telat	2026-06-07 09:05:10	2026-06-07 09:05:10
4	3	PAG-DEMO-002	2026-06-05	2026-05-30	1000000.00	lunas	2026-06-07 09:04:29	2026-06-07 16:06:22
161	160	PAG-DEMO-159	2026-05-29	2026-06-16	1000000.00	dibatalkan	2026-06-07 09:05:00	2026-06-07 20:35:19
208	207	INV-20260607203827-208	2026-06-07	2026-06-07	1200000.00	lunas	2026-06-07 20:38:27	2026-06-07 20:38:27
209	207	INV-EXT-20260607-207-T1FXOU	2026-06-07	2026-07-07	1200000.00	dibatalkan	2026-06-07 20:38:47	2026-06-07 20:49:07
210	208	INV-DEMO-H7	2026-06-07	2026-06-14	750000.00	dibatalkan	2026-06-07 20:39:49	2026-06-10 07:22:01
211	29	INV-EXT-20260610-29-PCCYNG	2026-06-10	2026-12-31	1000000.00	dibatalkan	2026-06-10 16:24:12	2026-06-10 16:25:19
212	209	INV-20260610232223-210	2026-06-10	2026-06-10	1200000.00	lunas	2026-06-10 23:22:23	2026-06-10 23:22:23
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.users (id, email, password, role, nama_lengkap, no_hp, foto_profil, alamat_asal, remember_token, created_at, updated_at) FROM stdin;
2	afrizal.dwi.ahmad.9130@kost.com	$2y$12$VfLyloywMlWzyg1uhG/9C.3u1WRGgakM8im5ZPbAOgv6NbqOdGWwq	penyewa	Afrizal Dwi Ahmad	6281917052146	\N	Pelemwatu RT 03 RW 02 kavlingan pagar hijau, Menganti, gresik	\N	2026-06-06 20:07:37	2026-06-06 20:08:32
3	pag.demo.001@kost.test	$2y$12$xE40AF4/r5ux3126esjD5uWvs5rMX9lVY07NPTdzsr0AJ.e2ovDN2	penyewa	PAG-DEMO Penghuni 001	628123450001	\N	Alamat demo pagination	\N	2026-06-07 09:04:28	2026-06-07 09:04:28
4	pag.demo.002@kost.test	$2y$12$J3Ey1zijjPXqjjtmpnqX.Ob8crKZSwuyHMG7131N5p1eP6WiZUYOW	penyewa	PAG-DEMO Penghuni 002	628123450002	\N	Alamat demo pagination	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
5	pag.demo.003@kost.test	$2y$12$XWfWge/b.QvmNf0mPfqWKOtnr.RZORPB4Rdg1i0/z6XrYx9p4VRcO	penyewa	PAG-DEMO Penghuni 003	628123450003	\N	Alamat demo pagination	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
6	pag.demo.004@kost.test	$2y$12$erYtuLPYCsUFr93iP/9SNeV.bYEuEkN5.pxKyIyXEMJ9zozJV1aC6	penyewa	PAG-DEMO Penghuni 004	628123450004	\N	Alamat demo pagination	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
7	pag.demo.005@kost.test	$2y$12$MxqHnQHcX3O2Qj6WC6ozA./LR5jx5i0.QjoD.0rcRWzt4JKrTf8O2	penyewa	PAG-DEMO Penghuni 005	628123450005	\N	Alamat demo pagination	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
8	pag.demo.006@kost.test	$2y$12$lqhpbALW3mrYa5Ay7/jumesGK27vqCxfjtQcIuoTaeWD8xFKKuGWW	penyewa	PAG-DEMO Penghuni 006	628123450006	\N	Alamat demo pagination	\N	2026-06-07 09:04:29	2026-06-07 09:04:29
9	pag.demo.007@kost.test	$2y$12$LWOzemkJkxZ6NNrogGqzKOHWCu/36bJzMNF0TuaR84RP48xZMqHfG	penyewa	PAG-DEMO Penghuni 007	628123450007	\N	Alamat demo pagination	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
10	pag.demo.008@kost.test	$2y$12$qI7UB7sUukm3NsDsEquwFuT4fz0nr8e2oHhlM0RCxZSrYJK5.AHgO	penyewa	PAG-DEMO Penghuni 008	628123450008	\N	Alamat demo pagination	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
11	pag.demo.009@kost.test	$2y$12$jpXdbT2yN9/OKBDSMCBE2.YEzMmjT9I3p1X563P0Py225CzWK9Pqi	penyewa	PAG-DEMO Penghuni 009	628123450009	\N	Alamat demo pagination	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
12	pag.demo.010@kost.test	$2y$12$RhVOglNtzJ.dud37CSGCyO1FVOChG8.vyVLAvvWN7ejRnec1l1Yxy	penyewa	PAG-DEMO Penghuni 010	628123450010	\N	Alamat demo pagination	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
13	pag.demo.011@kost.test	$2y$12$PPgd8YAjTLCeOV5VZRwmu.KfZUqkLSzZIBHtgdl0MX1viAvXvSVAy	penyewa	PAG-DEMO Penghuni 011	628123450011	\N	Alamat demo pagination	\N	2026-06-07 09:04:30	2026-06-07 09:04:30
14	pag.demo.012@kost.test	$2y$12$zOVPfbZvJ76OMvtfxDMpoe7HnIAXOlnZflNeE6hwMcsT1dA1GcAJ6	penyewa	PAG-DEMO Penghuni 012	628123450012	\N	Alamat demo pagination	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
15	pag.demo.013@kost.test	$2y$12$UplcEU2zpkfPIZqX1E3U8OC0qT9Oelu/9Zh3WJuHa7Xyz4lZL7Y6W	penyewa	PAG-DEMO Penghuni 013	628123450013	\N	Alamat demo pagination	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
16	pag.demo.014@kost.test	$2y$12$l4AFJnqIKVVdbs6L.MtiN.CllddWhyGlnXHcoQVwWf9PNulG3L22.	penyewa	PAG-DEMO Penghuni 014	628123450014	\N	Alamat demo pagination	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
17	pag.demo.015@kost.test	$2y$12$s4xk7/mqCgJAbdHUK.pu1O51M3d..O4Anke3LA4H7AcrBVwQUekt6	penyewa	PAG-DEMO Penghuni 015	628123450015	\N	Alamat demo pagination	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
18	pag.demo.016@kost.test	$2y$12$tQf.kxR26q2L8IFs12ZsEuDAMqf75FRw1psd1YOyrkWBZtnLvxO9C	penyewa	PAG-DEMO Penghuni 016	628123450016	\N	Alamat demo pagination	\N	2026-06-07 09:04:31	2026-06-07 09:04:31
19	pag.demo.017@kost.test	$2y$12$r97jJtdhNnPsfKdhw1xlS.F6iTtJ84Z2PoooEKDXl1b57iJphfMRG	penyewa	PAG-DEMO Penghuni 017	628123450017	\N	Alamat demo pagination	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
20	pag.demo.018@kost.test	$2y$12$ca43IJUueQSFVYQDAjz6PO8RN7Y1fPmMtCwdKzknfx1m/0ZUU6Yo.	penyewa	PAG-DEMO Penghuni 018	628123450018	\N	Alamat demo pagination	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
21	pag.demo.019@kost.test	$2y$12$RUl1PVWNwu9HEbf52gdK0uBU2io.LEUAHF0GYMfWsOBxHc0kBO0ey	penyewa	PAG-DEMO Penghuni 019	628123450019	\N	Alamat demo pagination	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
22	pag.demo.020@kost.test	$2y$12$eAYfwT2myosJJ0a6Ae.YZuQu2OxJt5rI2Z55wHeyZt.atxJj1rCle	penyewa	PAG-DEMO Penghuni 020	628123450020	\N	Alamat demo pagination	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
23	pag.demo.021@kost.test	$2y$12$LOH6IqhwKviKBOGOcZT0GeJ2IUZqu1C6D5F6ZdPfroYQh5CFx1Hxe	penyewa	PAG-DEMO Penghuni 021	628123450021	\N	Alamat demo pagination	\N	2026-06-07 09:04:32	2026-06-07 09:04:32
24	pag.demo.022@kost.test	$2y$12$K/ioh7U4kvA3e6sw/caRyeyhh.rLIdGVE9C87X7bAhzfmKTMXMMVm	penyewa	PAG-DEMO Penghuni 022	628123450022	\N	Alamat demo pagination	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
25	pag.demo.023@kost.test	$2y$12$QgKgdG3nWoOGJGLkg.BtMeRioZg.nKRSMzP4io9Fqnn5Y7pW8szA2	penyewa	PAG-DEMO Penghuni 023	628123450023	\N	Alamat demo pagination	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
26	pag.demo.024@kost.test	$2y$12$7ZEqMTqwG3uK73y8dm1u8O0Z3b5ZKHrfRyF4kVMsfTRl5xVCLl1Zm	penyewa	PAG-DEMO Penghuni 024	628123450024	\N	Alamat demo pagination	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
27	pag.demo.025@kost.test	$2y$12$XrYxKDwLSQFd7wGyqWm/pe0dlYZCwVKEG3Q1wiJGXevWRa1IoeWoa	penyewa	PAG-DEMO Penghuni 025	628123450025	\N	Alamat demo pagination	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
28	pag.demo.026@kost.test	$2y$12$knBF1QqiHmy2VcNzjAPE/edZM2//KZhXz6K6mQeXPCNxGJRygFQmi	penyewa	PAG-DEMO Penghuni 026	628123450026	\N	Alamat demo pagination	\N	2026-06-07 09:04:33	2026-06-07 09:04:33
29	pag.demo.027@kost.test	$2y$12$LPzaIvJgFjdq/46sv4TloO7Dk6vA0pveEfHDNzizJwldYGqsrmdgq	penyewa	PAG-DEMO Penghuni 027	628123450027	\N	Alamat demo pagination	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
30	pag.demo.028@kost.test	$2y$12$VUjyVpQOJ5xhjlLMaAioa.1cPlWWcWs4r04P6y8Mrju87odA9anNG	penyewa	PAG-DEMO Penghuni 028	628123450028	\N	Alamat demo pagination	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
31	pag.demo.029@kost.test	$2y$12$xJOU4rCwS1tCJZnI63W0r.CHQtHVwUG4T2NtsjoPE7awsKGk.AUbe	penyewa	PAG-DEMO Penghuni 029	628123450029	\N	Alamat demo pagination	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
32	pag.demo.030@kost.test	$2y$12$EuhxbTtIf9dCcTRvWkEEX.vrSqw1FtuXjrJKDjOl.iL6FvGmfeCRK	penyewa	PAG-DEMO Penghuni 030	628123450030	\N	Alamat demo pagination	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
33	pag.demo.031@kost.test	$2y$12$aSAyy94MHqgwTBPyvLUowujcubocZEI9HLjMPw1ODv7V78klGApH6	penyewa	PAG-DEMO Penghuni 031	628123450031	\N	Alamat demo pagination	\N	2026-06-07 09:04:34	2026-06-07 09:04:34
34	pag.demo.032@kost.test	$2y$12$E9jT2zjYrgDptPLd0Qnn0OXiE/a/JbRQXiFZkXdZyYSsZB3fzBfzK	penyewa	PAG-DEMO Penghuni 032	628123450032	\N	Alamat demo pagination	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
35	pag.demo.033@kost.test	$2y$12$ObdoT2.w3mDlmfYOEJ5bQeEiZKOgLopIzNe8sh88PnUS0ZaKxZtv6	penyewa	PAG-DEMO Penghuni 033	628123450033	\N	Alamat demo pagination	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
36	pag.demo.034@kost.test	$2y$12$PNA.quW3EeG2r0qKoGJd1OfyvrS9TfODMNDozr8DHTTnIO0eJIbFe	penyewa	PAG-DEMO Penghuni 034	628123450034	\N	Alamat demo pagination	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
37	pag.demo.035@kost.test	$2y$12$yP/bvXKypxs8xGC9QsGIqOf1qnDoZp6OOIc6MGTX7soS3Z7ge5AKm	penyewa	PAG-DEMO Penghuni 035	628123450035	\N	Alamat demo pagination	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
38	pag.demo.036@kost.test	$2y$12$sj1HENHe03wIgVl8j001LeVUQQ6GPs3gHKaKKcBwY62EbnnLzNflW	penyewa	PAG-DEMO Penghuni 036	628123450036	\N	Alamat demo pagination	\N	2026-06-07 09:04:35	2026-06-07 09:04:35
39	pag.demo.037@kost.test	$2y$12$oKBnDA9MXj/G4a.5XJhVOeu2K59s.ojuV1cXKpwQDMQ72TriH81ZK	penyewa	PAG-DEMO Penghuni 037	628123450037	\N	Alamat demo pagination	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
40	pag.demo.038@kost.test	$2y$12$QKoGHhKLVKZrjXFSRIlH6.JBZr5l5E9cZ5vh/ORcJFEp6iusx1Niq	penyewa	PAG-DEMO Penghuni 038	628123450038	\N	Alamat demo pagination	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
41	pag.demo.039@kost.test	$2y$12$wLvS4PSJGzCa1QsYux.0D.034UQHLjuXf1yUFX6mIYxZtljuVF286	penyewa	PAG-DEMO Penghuni 039	628123450039	\N	Alamat demo pagination	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
42	pag.demo.040@kost.test	$2y$12$AeDgFMmdxTyJtWc/F/.0TuNoaGimRTHjEz0yBqd4zwjEXjlKhWfQy	penyewa	PAG-DEMO Penghuni 040	628123450040	\N	Alamat demo pagination	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
43	pag.demo.041@kost.test	$2y$12$6y/VaHDSIbroGvL.kXZcDOFE18pBts9mKSPs/f2jqJkx7hfViZm7i	penyewa	PAG-DEMO Penghuni 041	628123450041	\N	Alamat demo pagination	\N	2026-06-07 09:04:36	2026-06-07 09:04:36
44	pag.demo.042@kost.test	$2y$12$K5JxvjYE/mFzz4e2F3lELenG8XF2pf/bV8gVdASAegxhY6.X8n9jC	penyewa	PAG-DEMO Penghuni 042	628123450042	\N	Alamat demo pagination	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
45	pag.demo.043@kost.test	$2y$12$u2E6xF5GCWfcOKQXvFydOO4ar0KwcfoWxEBC4wnjv4/tDYi2lpPn2	penyewa	PAG-DEMO Penghuni 043	628123450043	\N	Alamat demo pagination	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
46	pag.demo.044@kost.test	$2y$12$iZsUQ.bqCITHbl0eses1IOyGDJvc1VKyP9iok3wvZOdNRjhgQrifS	penyewa	PAG-DEMO Penghuni 044	628123450044	\N	Alamat demo pagination	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
47	pag.demo.045@kost.test	$2y$12$Zaf7VpG5YTMXWYTSq0rwieBDLwUwjzDFAwPJ.wv97HCjIELLZcxuW	penyewa	PAG-DEMO Penghuni 045	628123450045	\N	Alamat demo pagination	\N	2026-06-07 09:04:37	2026-06-07 09:04:37
48	pag.demo.046@kost.test	$2y$12$AJi9R753pB6vYHIOYZXSbekTcFXwiDyh8a0JNcdTEFPBv76xKKK5.	penyewa	PAG-DEMO Penghuni 046	628123450046	\N	Alamat demo pagination	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
49	pag.demo.047@kost.test	$2y$12$WXCbtrM2jomLt2Dsykqar.p7sVO35oicvxPX0CI8VynfvNakIEzRi	penyewa	PAG-DEMO Penghuni 047	628123450047	\N	Alamat demo pagination	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
50	pag.demo.048@kost.test	$2y$12$ZHonUB5x/N1MLFVVLnPdLeErWdJGVPzLqHPwr3c.eBsxHrF38LjXG	penyewa	PAG-DEMO Penghuni 048	628123450048	\N	Alamat demo pagination	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
51	pag.demo.049@kost.test	$2y$12$8r7.cTqv5WpqrwfT32CRs.QP6QoA9.IUKJnJ0OGJQ9fJCZ0TlxG0O	penyewa	PAG-DEMO Penghuni 049	628123450049	\N	Alamat demo pagination	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
52	pag.demo.050@kost.test	$2y$12$dILm9inYDnNwyOqfcxPmqeNj/rS4qPcGdAD6AqSvY9ewjl/SwvBWC	penyewa	PAG-DEMO Penghuni 050	628123450050	\N	Alamat demo pagination	\N	2026-06-07 09:04:38	2026-06-07 09:04:38
53	pag.demo.051@kost.test	$2y$12$c5s246YEI1wR.uWZk8ka8.hWYdrXCJvwn7KUHN9iqrO1VHum2o6oS	penyewa	PAG-DEMO Penghuni 051	628123450051	\N	Alamat demo pagination	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
54	pag.demo.052@kost.test	$2y$12$TTGGYsL5N2biLnWl.Wante6c2o5F/v5aUICFG4BvaknNWr3qnhO.2	penyewa	PAG-DEMO Penghuni 052	628123450052	\N	Alamat demo pagination	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
55	pag.demo.053@kost.test	$2y$12$tJgPYQdhbINYn/b1YG4Mq.GYnTwQN./tRsWaIAGKqNqTQde54czIK	penyewa	PAG-DEMO Penghuni 053	628123450053	\N	Alamat demo pagination	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
56	pag.demo.054@kost.test	$2y$12$c34vjU6LEwGIxWW23/bcOuTlSVWCEf33LiExN6LqyBCXRP0TFOtjG	penyewa	PAG-DEMO Penghuni 054	628123450054	\N	Alamat demo pagination	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
57	pag.demo.055@kost.test	$2y$12$yEDb7VbPDuRGu3MkYnXVyO2IsGZhC/kYgvcdygrKLfF6h.dd/ijxC	penyewa	PAG-DEMO Penghuni 055	628123450055	\N	Alamat demo pagination	\N	2026-06-07 09:04:39	2026-06-07 09:04:39
58	pag.demo.056@kost.test	$2y$12$nfyiEjIzsRcuJulJ2ozOceD0vm0M2znqVUnKDMgmrqN3pkT66zVL6	penyewa	PAG-DEMO Penghuni 056	628123450056	\N	Alamat demo pagination	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
59	pag.demo.057@kost.test	$2y$12$OE82XICd.oDDUfXGbWVaT.LvElES.hwipqoyKkvj9PsCJTKlE72s.	penyewa	PAG-DEMO Penghuni 057	628123450057	\N	Alamat demo pagination	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
60	pag.demo.058@kost.test	$2y$12$Huork0rCNdkRDDpF3rdR1.eQCuwYRtiQb0RK.FCNYqmnfITdO98zq	penyewa	PAG-DEMO Penghuni 058	628123450058	\N	Alamat demo pagination	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
61	pag.demo.059@kost.test	$2y$12$4ZZEgTUbbcAuoFzekYJVvOwYp4wXjCz7.ysg/zMRu2ICyMh2oWi/K	penyewa	PAG-DEMO Penghuni 059	628123450059	\N	Alamat demo pagination	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
62	pag.demo.060@kost.test	$2y$12$3.If/Mds0RhLNEkHdtRx1Oh1j8E3lBRQRXdFGLL2nNUFkWzvqbQ9G	penyewa	PAG-DEMO Penghuni 060	628123450060	\N	Alamat demo pagination	\N	2026-06-07 09:04:40	2026-06-07 09:04:40
63	pag.demo.061@kost.test	$2y$12$ERj1tYsX/lWgtBTzbX21Fegd879bjMUHrLrTiNUAPqR0EmxpNTzT6	penyewa	PAG-DEMO Penghuni 061	628123450061	\N	Alamat demo pagination	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
64	pag.demo.062@kost.test	$2y$12$QYVopFZFrk0Bv4k.7.GrReLYiCMpGcRNtyJYmolw9dOi5aTyqnrWG	penyewa	PAG-DEMO Penghuni 062	628123450062	\N	Alamat demo pagination	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
65	pag.demo.063@kost.test	$2y$12$yP5K.TjFeLhfWQpA0oQ/JuUrJYoHDBksARnJb91V9aA3pk/OU0f96	penyewa	PAG-DEMO Penghuni 063	628123450063	\N	Alamat demo pagination	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
66	pag.demo.064@kost.test	$2y$12$FdqvdJKRz7O5cYQUUVdGpuhKEXyNWcLcowGgzBfwIurs9RLb09tva	penyewa	PAG-DEMO Penghuni 064	628123450064	\N	Alamat demo pagination	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
67	pag.demo.065@kost.test	$2y$12$brLmbL5kT6XrHTu7WFocC.Rzk4CjmUrh45VL2iYqV2F6Y5VPSe/rW	penyewa	PAG-DEMO Penghuni 065	628123450065	\N	Alamat demo pagination	\N	2026-06-07 09:04:41	2026-06-07 09:04:41
68	pag.demo.066@kost.test	$2y$12$tEKlFhUvCcXzBRc2y09q/esKrqF1IcdDMXJJiCBrG9NnYj3O0yLGK	penyewa	PAG-DEMO Penghuni 066	628123450066	\N	Alamat demo pagination	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
69	pag.demo.067@kost.test	$2y$12$l6yI/cwn0.Mx9f/NtWSUVO0OkW.lBepenepu8UJIJJPXhu65nEs3m	penyewa	PAG-DEMO Penghuni 067	628123450067	\N	Alamat demo pagination	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
70	pag.demo.068@kost.test	$2y$12$oUeYwkuB9Z/WOiXr0YU1F.q9kdt3Cr3vSsztzXIK1dqhp4wFYfpoK	penyewa	PAG-DEMO Penghuni 068	628123450068	\N	Alamat demo pagination	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
71	pag.demo.069@kost.test	$2y$12$yTHEq9OonRjgifsCfnDekeb8Hj7HvPa2V4JGxTleYw7aCERgiKvY.	penyewa	PAG-DEMO Penghuni 069	628123450069	\N	Alamat demo pagination	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
72	pag.demo.070@kost.test	$2y$12$4yMIGjw5NF1YqpUc860j.eJxRuZEGonJAv6htHdMJoM2Z4GXpd5hm	penyewa	PAG-DEMO Penghuni 070	628123450070	\N	Alamat demo pagination	\N	2026-06-07 09:04:42	2026-06-07 09:04:42
73	pag.demo.071@kost.test	$2y$12$B5wBvqK7ZqsfdBxuRaKGSOXt/VYa867S6pZmGVObIGUJrhyem.Hpe	penyewa	PAG-DEMO Penghuni 071	628123450071	\N	Alamat demo pagination	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
74	pag.demo.072@kost.test	$2y$12$vBoG1sMk7SqltKNoI3.KW.9q7Wnh9RPrKZqOobnLtr7345j3NRTEO	penyewa	PAG-DEMO Penghuni 072	628123450072	\N	Alamat demo pagination	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
75	pag.demo.073@kost.test	$2y$12$vDRmPmW85NqBStiaFu6SkOn0g7.qtWdYIkx4viIedZGenfdrGvQF6	penyewa	PAG-DEMO Penghuni 073	628123450073	\N	Alamat demo pagination	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
76	pag.demo.074@kost.test	$2y$12$.vq5/ppfMWwnFU6x/vh5EuCs0Jz/pzh1ERTn3WX5UIQsDtdcvj7Ga	penyewa	PAG-DEMO Penghuni 074	628123450074	\N	Alamat demo pagination	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
77	pag.demo.075@kost.test	$2y$12$pIgbuJIfo1PEqAoLRiup5uTfC/0dXZJ1r3viEoKBzUdsciGsUlR3.	penyewa	PAG-DEMO Penghuni 075	628123450075	\N	Alamat demo pagination	\N	2026-06-07 09:04:43	2026-06-07 09:04:43
78	pag.demo.076@kost.test	$2y$12$JMwOiRaKJf1tSF9xy2NJh.xdBabLeqOSNceoP1AJLe4wk4U1aOHLK	penyewa	PAG-DEMO Penghuni 076	628123450076	\N	Alamat demo pagination	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
79	pag.demo.077@kost.test	$2y$12$agdW8IfUI2nD9mHADmo8a.wzsXsKD7H9DQ8bHvC4.srkJBm.V/RYK	penyewa	PAG-DEMO Penghuni 077	628123450077	\N	Alamat demo pagination	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
80	pag.demo.078@kost.test	$2y$12$PCW9i3PvjEAPGSmhhHYOJOmO/h3kSpAPna.20T02s8cGsjayibPSC	penyewa	PAG-DEMO Penghuni 078	628123450078	\N	Alamat demo pagination	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
81	pag.demo.079@kost.test	$2y$12$BhA1O1kMziDT9DjUfHoklec0WflG7VE7BPpLfeyXZsFO7RSfYyUNa	penyewa	PAG-DEMO Penghuni 079	628123450079	\N	Alamat demo pagination	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
82	pag.demo.080@kost.test	$2y$12$HXo2EbUTFsI76t3c7ktVVufjF8ViZ0JF6Z1PM/.qowjAKNeRAUF62	penyewa	PAG-DEMO Penghuni 080	628123450080	\N	Alamat demo pagination	\N	2026-06-07 09:04:44	2026-06-07 09:04:44
83	pag.demo.081@kost.test	$2y$12$G7Hywp42TIzz7cL3oFR46umxKX5uTM2Wo/zZi6ivyOXFsNwY57ksy	penyewa	PAG-DEMO Penghuni 081	628123450081	\N	Alamat demo pagination	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
84	pag.demo.082@kost.test	$2y$12$IvpgIEU/V5x16fzhGoQOoONTSkEVYj1zM3ShlU0k0Z4jrppnw1AbK	penyewa	PAG-DEMO Penghuni 082	628123450082	\N	Alamat demo pagination	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
85	pag.demo.083@kost.test	$2y$12$PTTxm85fQO.hOoxGYU0JKOfK2CFdkAmkFg2zUXoGPxSeQO/uFtUt6	penyewa	PAG-DEMO Penghuni 083	628123450083	\N	Alamat demo pagination	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
86	pag.demo.084@kost.test	$2y$12$aynIAoKq3x5o36AnW/CD1.8EwtTIv3O6lXSW1pX3vqQjLBRLry/6u	penyewa	PAG-DEMO Penghuni 084	628123450084	\N	Alamat demo pagination	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
87	pag.demo.085@kost.test	$2y$12$x718kP9xK8TiApFrdVDeoO6/4MyjGIohkTeuUHa1RmKllWNCsRKve	penyewa	PAG-DEMO Penghuni 085	628123450085	\N	Alamat demo pagination	\N	2026-06-07 09:04:45	2026-06-07 09:04:45
88	pag.demo.086@kost.test	$2y$12$72M8IW1R6qKREtS3ySqXlukRgFS.QKcsMw5.0SL4mAEqhkQxAcaLK	penyewa	PAG-DEMO Penghuni 086	628123450086	\N	Alamat demo pagination	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
89	pag.demo.087@kost.test	$2y$12$Qjb67IovUXHArqJpJQgy.uZrwbl0ghYTeDAQgARyBCHqLO44kyL6O	penyewa	PAG-DEMO Penghuni 087	628123450087	\N	Alamat demo pagination	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
90	pag.demo.088@kost.test	$2y$12$UXX6WCg4tpPiJPJgW0Jb2eqoyO7SfXRKamNxF7uI6UF7DpuJWiNu6	penyewa	PAG-DEMO Penghuni 088	628123450088	\N	Alamat demo pagination	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
91	pag.demo.089@kost.test	$2y$12$t1.VNJMBX2dXfD0IXd.JOuXV4x52Za16vfIwc6JX4aBiCdo8Z4/02	penyewa	PAG-DEMO Penghuni 089	628123450089	\N	Alamat demo pagination	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
92	pag.demo.090@kost.test	$2y$12$kCZmCiZ/Id/if.xRleL7cO4MYtcOAyDhdBTDFWv30MU9uFLsWpiO.	penyewa	PAG-DEMO Penghuni 090	628123450090	\N	Alamat demo pagination	\N	2026-06-07 09:04:46	2026-06-07 09:04:46
93	pag.demo.091@kost.test	$2y$12$wDQxMSIat5PutOqcIh1ooO0QwtrHbbD.vIcnip0ABfkZRVKTiH76u	penyewa	PAG-DEMO Penghuni 091	628123450091	\N	Alamat demo pagination	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
94	pag.demo.092@kost.test	$2y$12$HfDP53Udp.H.gqnoRrSY4uEd8XL0tHfUhf5lw6So0oWbYFmWC.tZ2	penyewa	PAG-DEMO Penghuni 092	628123450092	\N	Alamat demo pagination	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
95	pag.demo.093@kost.test	$2y$12$vZQ2OVzhxDbajJhiXT8CpuweuqNJWaFX9CL4gWLK.OeiolYcwxL3q	penyewa	PAG-DEMO Penghuni 093	628123450093	\N	Alamat demo pagination	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
96	pag.demo.094@kost.test	$2y$12$ydtr1c6jXQKDsk721jEdKO2q/2bYESR.XoRd.l1qrcRnbaSHvBYzG	penyewa	PAG-DEMO Penghuni 094	628123450094	\N	Alamat demo pagination	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
97	pag.demo.095@kost.test	$2y$12$O5exb7.wSjd1FRPsVchGpuWTcUKJ12IILKop22K31f.s7ubORT8sC	penyewa	PAG-DEMO Penghuni 095	628123450095	\N	Alamat demo pagination	\N	2026-06-07 09:04:47	2026-06-07 09:04:47
98	pag.demo.096@kost.test	$2y$12$ZkoWCyykowM5tTnfMv41W.wXR8o5X3AcauqrHCRdm3LlwLVp/GICG	penyewa	PAG-DEMO Penghuni 096	628123450096	\N	Alamat demo pagination	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
99	pag.demo.097@kost.test	$2y$12$/HqNkFBk/Qr5YNI.QiqNae3UQXjo7/PNljHRWDPM6oO2bN/ZhNCxW	penyewa	PAG-DEMO Penghuni 097	628123450097	\N	Alamat demo pagination	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
100	pag.demo.098@kost.test	$2y$12$aISGK9SkXMzYM4dh0M43XuSPuFy3YMwxIEKL4/eElgRgpFp/KCDyu	penyewa	PAG-DEMO Penghuni 098	628123450098	\N	Alamat demo pagination	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
101	pag.demo.099@kost.test	$2y$12$oubeyCnoeuVpfa3aQr9/ie9rh2avrRKyj82oMIHt0ul6ZX4YAVtr2	penyewa	PAG-DEMO Penghuni 099	628123450099	\N	Alamat demo pagination	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
102	pag.demo.100@kost.test	$2y$12$b3oNZEIkN1RvrApjTQ8xSeM/o9oprf1ZNVGiUAet3YXWUpk6i31.u	penyewa	PAG-DEMO Penghuni 100	628123450100	\N	Alamat demo pagination	\N	2026-06-07 09:04:48	2026-06-07 09:04:48
103	pag.demo.101@kost.test	$2y$12$qBja7zrFrMLIQ2x5T7vePuPewQ/8Hh4XKfBZINGnloMlqktrxLAVK	penyewa	PAG-DEMO Penghuni 101	628123450101	\N	Alamat demo pagination	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
104	pag.demo.102@kost.test	$2y$12$fI2UR0RHvlNo8fevI75kE.u0HciBERaE5NL9m0k50H1x7eN0D8wDu	penyewa	PAG-DEMO Penghuni 102	628123450102	\N	Alamat demo pagination	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
105	pag.demo.103@kost.test	$2y$12$4RnlgJSBDx5g9Itlgj8UTOsUA9aYf5LX8pdrfJNT/DCjppZb4ypSW	penyewa	PAG-DEMO Penghuni 103	628123450103	\N	Alamat demo pagination	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
106	pag.demo.104@kost.test	$2y$12$g5/oaHrtqnmYKCIbpdsz6O65hnPGTkQ1eXuOKs2w6OG5Ma7VLjqnW	penyewa	PAG-DEMO Penghuni 104	628123450104	\N	Alamat demo pagination	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
107	pag.demo.105@kost.test	$2y$12$Q7eHBsDPNrtszacvoW0GpOzVHkQXSfJxnjvibsliUAtynSwGwAt2C	penyewa	PAG-DEMO Penghuni 105	628123450105	\N	Alamat demo pagination	\N	2026-06-07 09:04:49	2026-06-07 09:04:49
108	pag.demo.106@kost.test	$2y$12$5i54Sm2Sx/6fWJgcOttofOSOgM7TdV7IHxGsNLPio/lZUJEV7jGvu	penyewa	PAG-DEMO Penghuni 106	628123450106	\N	Alamat demo pagination	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
109	pag.demo.107@kost.test	$2y$12$rbNlRj/uNQYz42sse6Nt0.hHUqCNMHK4ttS3H5KMHLYDxlfL/dU1O	penyewa	PAG-DEMO Penghuni 107	628123450107	\N	Alamat demo pagination	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
110	pag.demo.108@kost.test	$2y$12$yrPRrpqyor1R7EigspASmeel1kKC/ZDNOZg7mwj9756j5ne4XBPbK	penyewa	PAG-DEMO Penghuni 108	628123450108	\N	Alamat demo pagination	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
111	pag.demo.109@kost.test	$2y$12$ffDDw/a3lHvxUOJzX6/TBe3DTtpMjhiPK/64LstjMlQhgV659tZme	penyewa	PAG-DEMO Penghuni 109	628123450109	\N	Alamat demo pagination	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
112	pag.demo.110@kost.test	$2y$12$rtvNcy4Ix5Q4/Gbk8zfRb.OeC4XOWY5/024O/4TCNpl2N2ava5XO6	penyewa	PAG-DEMO Penghuni 110	628123450110	\N	Alamat demo pagination	\N	2026-06-07 09:04:50	2026-06-07 09:04:50
113	pag.demo.111@kost.test	$2y$12$W9UbOqiMRjXAYtcih786auLyKHHFTqmH.iGYu4BQN6w5larcwzcKa	penyewa	PAG-DEMO Penghuni 111	628123450111	\N	Alamat demo pagination	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
114	pag.demo.112@kost.test	$2y$12$rEgs2Tr76WKjUZxkaXRVA.iBP1VqlzU3mdv8/6yQQaaFDWe/74juO	penyewa	PAG-DEMO Penghuni 112	628123450112	\N	Alamat demo pagination	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
115	pag.demo.113@kost.test	$2y$12$8qObnCUyRE3Zhn83AJNAkOIWzpUqCmTZ7tnmxpV8feOKcl1IUO3ii	penyewa	PAG-DEMO Penghuni 113	628123450113	\N	Alamat demo pagination	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
116	pag.demo.114@kost.test	$2y$12$h7aHvm9B9EX/BAyBdFoROOGlhOE/igFAHT/6U5A1v8GA3ayQ7.urO	penyewa	PAG-DEMO Penghuni 114	628123450114	\N	Alamat demo pagination	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
117	pag.demo.115@kost.test	$2y$12$J4j0oBtH2XzyaGQC2iOx.u1A/g19Nc4RHxBb.bxEiwNY.P9ul.BL6	penyewa	PAG-DEMO Penghuni 115	628123450115	\N	Alamat demo pagination	\N	2026-06-07 09:04:51	2026-06-07 09:04:51
118	pag.demo.116@kost.test	$2y$12$v/Hm0Ol4pMHZ.uat0uiH6.gATBQkvswznwOD/00h.IsFQeuLZI.Q.	penyewa	PAG-DEMO Penghuni 116	628123450116	\N	Alamat demo pagination	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
119	pag.demo.117@kost.test	$2y$12$PeDNbrjCrpKa1zVpItXdM.JE.5A4Z.YL8a6ND3ZJg7lxd9Nhxq9Di	penyewa	PAG-DEMO Penghuni 117	628123450117	\N	Alamat demo pagination	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
120	pag.demo.118@kost.test	$2y$12$QL9dxwGrS5WuelrxpFcXkOO1w//TaRuKSFsjakih.rXed3NNdmZGK	penyewa	PAG-DEMO Penghuni 118	628123450118	\N	Alamat demo pagination	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
121	pag.demo.119@kost.test	$2y$12$HziHnkKoBQhtIRjORO.2EuIJ8rlz/KJIfC8q/EycGWoCSxfn1.GL2	penyewa	PAG-DEMO Penghuni 119	628123450119	\N	Alamat demo pagination	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
122	pag.demo.120@kost.test	$2y$12$eIMsGSMjDkwfyf76Qfl83.wAarJwAQNHePvAJRqXkQkAT/EN09EYa	penyewa	PAG-DEMO Penghuni 120	628123450120	\N	Alamat demo pagination	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
123	pag.demo.121@kost.test	$2y$12$YvRmwxXw3sRdShm78qo5PO.Po92oPJjfbl4fIdbgt.lrHx1w6Qfhe	penyewa	PAG-DEMO Penghuni 121	628123450121	\N	Alamat demo pagination	\N	2026-06-07 09:04:52	2026-06-07 09:04:52
124	pag.demo.122@kost.test	$2y$12$CsTgu3VCu.cPgfkYDvU9V.ltB2FZkDN7GFmOaUExtnOJjFcI/7sJe	penyewa	PAG-DEMO Penghuni 122	628123450122	\N	Alamat demo pagination	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
125	pag.demo.123@kost.test	$2y$12$FDQ0TFtsvU7AGUfOVzwELebwMMRI6k3idGhyRzWkgsHM8ch3STlZS	penyewa	PAG-DEMO Penghuni 123	628123450123	\N	Alamat demo pagination	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
126	pag.demo.124@kost.test	$2y$12$xO6Gmrieo73cilcMt4mm2eC1RH8Wae4LHLFmJ7xKnMvF74FSya3Ju	penyewa	PAG-DEMO Penghuni 124	628123450124	\N	Alamat demo pagination	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
127	pag.demo.125@kost.test	$2y$12$GTn8Y3xSEv7.cAVgOaSGcO4mCQpZqsH8DfmLZgreFjMeuy19Cwueu	penyewa	PAG-DEMO Penghuni 125	628123450125	\N	Alamat demo pagination	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
128	pag.demo.126@kost.test	$2y$12$GYA44dfbapwNIDBFuaN16.g1NN/yS4cEjXWn.9mWUiarCudmtgtf2	penyewa	PAG-DEMO Penghuni 126	628123450126	\N	Alamat demo pagination	\N	2026-06-07 09:04:53	2026-06-07 09:04:53
129	pag.demo.127@kost.test	$2y$12$b1wd.v2tu5LsSIHbeSmwO.hbgncsasq1TYf1HNm7NWoygRdhoZ0/C	penyewa	PAG-DEMO Penghuni 127	628123450127	\N	Alamat demo pagination	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
130	pag.demo.128@kost.test	$2y$12$Ajr65b8Zw9BDAUyRpcF9wOzJLzM6N4MH.rU8ybliTHdZzHdG4Rfv2	penyewa	PAG-DEMO Penghuni 128	628123450128	\N	Alamat demo pagination	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
131	pag.demo.129@kost.test	$2y$12$TE0ht/kGkzmxR0YOpPaRiOunzURSqUi.fnXazKmq4JYk5u93X8MAa	penyewa	PAG-DEMO Penghuni 129	628123450129	\N	Alamat demo pagination	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
132	pag.demo.130@kost.test	$2y$12$6ZA4Al5UkL0siK/SZP/Tpe2NDZOFSlfqrl5QsGS6SpDvibFETAfNK	penyewa	PAG-DEMO Penghuni 130	628123450130	\N	Alamat demo pagination	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
133	pag.demo.131@kost.test	$2y$12$1iZ2BOxtG6VvDgniKLOYTeHtPav.Cyf2l4vhb/w1BIynoCb1RqygS	penyewa	PAG-DEMO Penghuni 131	628123450131	\N	Alamat demo pagination	\N	2026-06-07 09:04:54	2026-06-07 09:04:54
134	pag.demo.132@kost.test	$2y$12$9Lhz2Y7yYSzRQ2iwxnFQiey25n9.7mYOXLP5mTxWz6pFyvfMzzGJe	penyewa	PAG-DEMO Penghuni 132	628123450132	\N	Alamat demo pagination	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
135	pag.demo.133@kost.test	$2y$12$ys9LjeVfHZaPqqM8p9WfiuEKY1m20KEtj9IYVuk/UN1LbxUsfAWEO	penyewa	PAG-DEMO Penghuni 133	628123450133	\N	Alamat demo pagination	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
136	pag.demo.134@kost.test	$2y$12$WfY24cJ0Ydt795RrDPP/JuOxlKd8YlcdwrPao8dFv1t9Htse4uwXW	penyewa	PAG-DEMO Penghuni 134	628123450134	\N	Alamat demo pagination	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
137	pag.demo.135@kost.test	$2y$12$1ldRuja1tyahIDM6YLEwNuWL7KV74NV34kXq8fCpcn1LJ0Sg1rl3W	penyewa	PAG-DEMO Penghuni 135	628123450135	\N	Alamat demo pagination	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
138	pag.demo.136@kost.test	$2y$12$zAz4GeQZ3lH39Dz9EE3C0u5b3Wt70Yk4olciAMlz5KvR/MHlgLLda	penyewa	PAG-DEMO Penghuni 136	628123450136	\N	Alamat demo pagination	\N	2026-06-07 09:04:55	2026-06-07 09:04:55
139	pag.demo.137@kost.test	$2y$12$hlXC/lHAHNzqDdSYpDN75eYmg9AhT9Ddjt862B6ewrS0o9PM.Kwji	penyewa	PAG-DEMO Penghuni 137	628123450137	\N	Alamat demo pagination	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
140	pag.demo.138@kost.test	$2y$12$mRqw2yTMv8HbYIxuR.qG6OA3bSyvPSsSlGfWkR3sz9Xd4I2vT0Gki	penyewa	PAG-DEMO Penghuni 138	628123450138	\N	Alamat demo pagination	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
141	pag.demo.139@kost.test	$2y$12$OT4bseRCxgUmqxgXgQTo3.xsj3TtuGzN7KE7rq3LSDPLxNNg46daW	penyewa	PAG-DEMO Penghuni 139	628123450139	\N	Alamat demo pagination	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
142	pag.demo.140@kost.test	$2y$12$ziP138y7vzybmKzool2GC.CJgkNW2c5RD8jK6V2IFqqChQeFbzrEK	penyewa	PAG-DEMO Penghuni 140	628123450140	\N	Alamat demo pagination	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
143	pag.demo.141@kost.test	$2y$12$yOtFCgUZebcwTRppfcLf9e09aGdVlG7GF12nXFGmvr9aHXtY2lmrC	penyewa	PAG-DEMO Penghuni 141	628123450141	\N	Alamat demo pagination	\N	2026-06-07 09:04:56	2026-06-07 09:04:56
144	pag.demo.142@kost.test	$2y$12$DfuW3lOhqkkn7q1seLZwouHZWrHXIB4LDtNIENoyibjNZ/CQYrrLW	penyewa	PAG-DEMO Penghuni 142	628123450142	\N	Alamat demo pagination	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
145	pag.demo.143@kost.test	$2y$12$BiG2kKn0zDOEkm1g3wJsuu6mhhs/v0Dlb/C0JYCaa3FIgg2QvwoaW	penyewa	PAG-DEMO Penghuni 143	628123450143	\N	Alamat demo pagination	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
146	pag.demo.144@kost.test	$2y$12$5c.Ldv5WNFA4P1JAbZMtJukZy20tJlgHyC3fruPimsANcwiYx8Btu	penyewa	PAG-DEMO Penghuni 144	628123450144	\N	Alamat demo pagination	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
147	pag.demo.145@kost.test	$2y$12$1H6SUtqcxWYBpg36y9EiUO1umqNhs.C/seX3itvJh0rpekAjJPtSe	penyewa	PAG-DEMO Penghuni 145	628123450145	\N	Alamat demo pagination	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
148	pag.demo.146@kost.test	$2y$12$i7j47.ERvbYaIV6XpO3aO.R1Nwk3q7eQklVGodT98JPJm1vEceSbW	penyewa	PAG-DEMO Penghuni 146	628123450146	\N	Alamat demo pagination	\N	2026-06-07 09:04:57	2026-06-07 09:04:57
149	pag.demo.147@kost.test	$2y$12$BiddPmlUEjSpEDJg5Iiiju7O07brbjOd0enillKFrbkEOODGCFYza	penyewa	PAG-DEMO Penghuni 147	628123450147	\N	Alamat demo pagination	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
150	pag.demo.148@kost.test	$2y$12$ow0ARAVY7.WvtK6nIwHQ5esg5MeX5tfXULchaftfNHAMr7EYJBE9S	penyewa	PAG-DEMO Penghuni 148	628123450148	\N	Alamat demo pagination	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
151	pag.demo.149@kost.test	$2y$12$dHasi/xTsYUzRfSaN7.VdugoRdHxFRoaTYZTQIl0xhtDsY3AP7pK2	penyewa	PAG-DEMO Penghuni 149	628123450149	\N	Alamat demo pagination	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
152	pag.demo.150@kost.test	$2y$12$sZ8tdpGpzUKYNNe38eVJt.BfHXJJnmWG5rxB3eRmcAm.jf76jIUxO	penyewa	PAG-DEMO Penghuni 150	628123450150	\N	Alamat demo pagination	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
153	pag.demo.151@kost.test	$2y$12$gg9beeRm0/.AYssIfjueA.LHZny6Vk7JsKWvfsVlRObIVIYRfuU8e	penyewa	PAG-DEMO Penghuni 151	628123450151	\N	Alamat demo pagination	\N	2026-06-07 09:04:58	2026-06-07 09:04:58
154	pag.demo.152@kost.test	$2y$12$7S8YlYu1xnzwuGxcSIzzReng2ZfSfoxtesU44lGbDNnWqBBBgot12	penyewa	PAG-DEMO Penghuni 152	628123450152	\N	Alamat demo pagination	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
155	pag.demo.153@kost.test	$2y$12$78LlCuBHf.9qpwjh8TQn.uV1J09el1Sym6LENfBDktqEgAwUapyFO	penyewa	PAG-DEMO Penghuni 153	628123450153	\N	Alamat demo pagination	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
156	pag.demo.154@kost.test	$2y$12$Do5y6XfdLCCnQM0EPcuT6.ZmzXBBfEREDD/FVWvNiLdny3Ux/pFpC	penyewa	PAG-DEMO Penghuni 154	628123450154	\N	Alamat demo pagination	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
157	pag.demo.155@kost.test	$2y$12$tjlMBW1bw3.s/3veF95XSu3MBrF3y8UTwLRYwm4AnuSv8NUuLXrxG	penyewa	PAG-DEMO Penghuni 155	628123450155	\N	Alamat demo pagination	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
158	pag.demo.156@kost.test	$2y$12$QQ7K/7FDoNhLbXx6vMApWOinCAxPBntNfnNJED0UDYP6pF7MELoyC	penyewa	PAG-DEMO Penghuni 156	628123450156	\N	Alamat demo pagination	\N	2026-06-07 09:04:59	2026-06-07 09:04:59
159	pag.demo.157@kost.test	$2y$12$waef7KGtdOfRP.WZq4du1Oq6oJGqd857BJ5klmbsdSmUmr5h3g3q2	penyewa	PAG-DEMO Penghuni 157	628123450157	\N	Alamat demo pagination	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
160	pag.demo.158@kost.test	$2y$12$jb.Po7cN2.quwNnVD2d8v.Edx.vBm1yLoYhsCyYukj0m8D8Lu37Hy	penyewa	PAG-DEMO Penghuni 158	628123450158	\N	Alamat demo pagination	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
161	pag.demo.159@kost.test	$2y$12$ZutLlfUApnKp1.kvy55Q.Oy/phnp24KiEcE5D/CfJtPCl4TOxGSsi	penyewa	PAG-DEMO Penghuni 159	628123450159	\N	Alamat demo pagination	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
162	pag.demo.160@kost.test	$2y$12$IVb4zLfLbYLqEhYw92coK.dAl24xcOB9WZbuzj4hBLQJdTmoNa8ay	penyewa	PAG-DEMO Penghuni 160	628123450160	\N	Alamat demo pagination	\N	2026-06-07 09:05:00	2026-06-07 09:05:00
163	pag.demo.161@kost.test	$2y$12$UHyeJ7t2FOF.vaPGf5PRneDsR4VrbJGs2KMFNKnXu.p5aaGwjb2nK	penyewa	PAG-DEMO Penghuni 161	628123450161	\N	Alamat demo pagination	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
164	pag.demo.162@kost.test	$2y$12$u3tCOfIT8DXA9I.kRzLuJ.HLzFi.2JUnbx6UvwPLPtX0Hkg8g.kty	penyewa	PAG-DEMO Penghuni 162	628123450162	\N	Alamat demo pagination	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
165	pag.demo.163@kost.test	$2y$12$RfA1JwsekM8BQWgswKP6m.zh9iMY1V/bS6T4WzMammmuLy3qkiQ42	penyewa	PAG-DEMO Penghuni 163	628123450163	\N	Alamat demo pagination	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
166	pag.demo.164@kost.test	$2y$12$xkUHMwtXnSJIr0ntaKqtj..DbKiqKSq3nbB8V1kqxVEgJOTUHcz86	penyewa	PAG-DEMO Penghuni 164	628123450164	\N	Alamat demo pagination	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
167	pag.demo.165@kost.test	$2y$12$WuJ94gWklZqoG/2Z602u6u95Sq5Rr9OpxjDB2VfIR41lQ5Yf9iwj6	penyewa	PAG-DEMO Penghuni 165	628123450165	\N	Alamat demo pagination	\N	2026-06-07 09:05:01	2026-06-07 09:05:01
168	pag.demo.166@kost.test	$2y$12$FGvCak/6KcUZ1k2gLXXe2OWhXoadKynNEemoferWqpzPI8cfnLslu	penyewa	PAG-DEMO Penghuni 166	628123450166	\N	Alamat demo pagination	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
169	pag.demo.167@kost.test	$2y$12$LJVqawzRe2KqwnLxtd5.NeiPnucjusOkJ97QLouHWSEe9NyaZ2HgW	penyewa	PAG-DEMO Penghuni 167	628123450167	\N	Alamat demo pagination	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
170	pag.demo.168@kost.test	$2y$12$TC9EkC5feMxjAf46wMGvsukdiXN/rRnPI0oBlfyScanz4iYjZMCSa	penyewa	PAG-DEMO Penghuni 168	628123450168	\N	Alamat demo pagination	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
171	pag.demo.169@kost.test	$2y$12$yOLpAHvMvifM1A8IO1sqSuVo17OdBe1mYCH5NfzVe3dSRjlO1qI.S	penyewa	PAG-DEMO Penghuni 169	628123450169	\N	Alamat demo pagination	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
172	pag.demo.170@kost.test	$2y$12$3Kh2.4Ye.om5XTxLfhOIIeQGZUFMOY87D/4GcUovMk/esQNxm1uia	penyewa	PAG-DEMO Penghuni 170	628123450170	\N	Alamat demo pagination	\N	2026-06-07 09:05:02	2026-06-07 09:05:02
173	pag.demo.171@kost.test	$2y$12$3gQy0aeLAx6On8Kwgl02DeSaSJOYxTTcIiR8lgW7z1T3uwgJdGH7.	penyewa	PAG-DEMO Penghuni 171	628123450171	\N	Alamat demo pagination	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
174	pag.demo.172@kost.test	$2y$12$NHoZuhte204ZoSaqB0YG6ujuRDefZyIg./GJHH9Fh/xNkzFryWRLK	penyewa	PAG-DEMO Penghuni 172	628123450172	\N	Alamat demo pagination	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
175	pag.demo.173@kost.test	$2y$12$LOeoZLJtUmPEQB9szlLg1euxWHOJl1nvP5F03WCv2IsVoJHWXjXKq	penyewa	PAG-DEMO Penghuni 173	628123450173	\N	Alamat demo pagination	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
176	pag.demo.174@kost.test	$2y$12$Gg.agrZoz8FVPbVT0hKHhuZHjng01dDwKEHyuXdoNiPV/5KpOerCC	penyewa	PAG-DEMO Penghuni 174	628123450174	\N	Alamat demo pagination	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
177	pag.demo.175@kost.test	$2y$12$gYB33nFYNJ98T6dg2sAlo.POAGVKmEFBiNJuE55M75tAJyPgWTI0K	penyewa	PAG-DEMO Penghuni 175	628123450175	\N	Alamat demo pagination	\N	2026-06-07 09:05:03	2026-06-07 09:05:03
178	pag.demo.176@kost.test	$2y$12$hPsINtYgU/NDTFmuHm4q3.YyILMnTToW1XKiANSyu3OjGUu1s6YfW	penyewa	PAG-DEMO Penghuni 176	628123450176	\N	Alamat demo pagination	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
179	pag.demo.177@kost.test	$2y$12$DmZVincj6qn.hcXjilQar./tArde3rEPABx43P7QC2.DHAQlefCJ6	penyewa	PAG-DEMO Penghuni 177	628123450177	\N	Alamat demo pagination	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
180	pag.demo.178@kost.test	$2y$12$95TJJfIz.HjK29d5AdgeOOOJXI7WLbVLcbhbvqWksBhX1.UwkZX9m	penyewa	PAG-DEMO Penghuni 178	628123450178	\N	Alamat demo pagination	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
181	pag.demo.179@kost.test	$2y$12$rJErrQn/Q1UwQ4in/uMX5OfQ8ht5SDXz.WO6iAKiOV1PDL4S7H2rC	penyewa	PAG-DEMO Penghuni 179	628123450179	\N	Alamat demo pagination	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
182	pag.demo.180@kost.test	$2y$12$2xAwS7Gg06U9qSDIa41GGeHXwAdxG1STcAfPIcDoD4IOi/DGsrm.S	penyewa	PAG-DEMO Penghuni 180	628123450180	\N	Alamat demo pagination	\N	2026-06-07 09:05:04	2026-06-07 09:05:04
183	pag.demo.181@kost.test	$2y$12$orsOtbfJoCKCEZl6Vgqab.G/0Jpf6zOQrwpjNqSz5S9083EdImP3i	penyewa	PAG-DEMO Penghuni 181	628123450181	\N	Alamat demo pagination	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
184	pag.demo.182@kost.test	$2y$12$v/c3nT9EJncFqCIHsgzq3.lwped06bIdvQ4HFMtJc74abqovEXto6	penyewa	PAG-DEMO Penghuni 182	628123450182	\N	Alamat demo pagination	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
185	pag.demo.183@kost.test	$2y$12$1UHGlOs0DdVoYs1xF5pm4evhBGc/wHEVygWNnqW2kbIOgjNihSTLu	penyewa	PAG-DEMO Penghuni 183	628123450183	\N	Alamat demo pagination	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
186	pag.demo.184@kost.test	$2y$12$ZFtqP.Fcv5GDgx9LNFCMaeU1c5QJ7a/1G.mUd3GaXXSazyvxSGw5u	penyewa	PAG-DEMO Penghuni 184	628123450184	\N	Alamat demo pagination	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
187	pag.demo.185@kost.test	$2y$12$glF8OOXb86XMeWJ3PrmrL.t2DoHX2yM/N4ngvqjcpjcVN1xrvGcCq	penyewa	PAG-DEMO Penghuni 185	628123450185	\N	Alamat demo pagination	\N	2026-06-07 09:05:05	2026-06-07 09:05:05
188	pag.demo.186@kost.test	$2y$12$uZOPKfW1hdRejShAol9dOecPcHOVYd8KvUCd00Psq9F/p5nOd16ui	penyewa	PAG-DEMO Penghuni 186	628123450186	\N	Alamat demo pagination	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
189	pag.demo.187@kost.test	$2y$12$36qLNStzDwboUDCjly0Z2.CYLvlH57X1ox/8Awr/9jJCwh9B/DvTm	penyewa	PAG-DEMO Penghuni 187	628123450187	\N	Alamat demo pagination	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
190	pag.demo.188@kost.test	$2y$12$eojL6.Mr5ZYj4gDkJwXhc.JBNUsac4gj0YlK/Xyg46JInrDRVj3/6	penyewa	PAG-DEMO Penghuni 188	628123450188	\N	Alamat demo pagination	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
191	pag.demo.189@kost.test	$2y$12$1huk8wuaVjoSMigHNgxdwu9kuLEr2dzBt9INhstrhRSl0CgBIYLX2	penyewa	PAG-DEMO Penghuni 189	628123450189	\N	Alamat demo pagination	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
192	pag.demo.190@kost.test	$2y$12$YrnNCkOnZqsuyfF2I3o.AeX2raQlckZ/OdITN3/OW510tk/o5MKRC	penyewa	PAG-DEMO Penghuni 190	628123450190	\N	Alamat demo pagination	\N	2026-06-07 09:05:06	2026-06-07 09:05:06
193	pag.demo.191@kost.test	$2y$12$CzlaO4D4fykD6lZ/fuubxOIG32cQo.0LR3KC4idsmoGWGeGlYjXk.	penyewa	PAG-DEMO Penghuni 191	628123450191	\N	Alamat demo pagination	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
194	pag.demo.192@kost.test	$2y$12$NnX5WUV2zna3y.xPUwD/Serfx4A4wIOpHnYUCAxh1hMrpnmC9zNUK	penyewa	PAG-DEMO Penghuni 192	628123450192	\N	Alamat demo pagination	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
195	pag.demo.193@kost.test	$2y$12$lAnvKhHyLXUR8cuZ/O8ITO93B.U.2vL32/h1wjWKpOfgOnvtNUui.	penyewa	PAG-DEMO Penghuni 193	628123450193	\N	Alamat demo pagination	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
196	pag.demo.194@kost.test	$2y$12$ZbCeZmpyOYD4wm1ggssTGOaB7EdZ1ESkl0KmKOqhinujxFDGGCKf.	penyewa	PAG-DEMO Penghuni 194	628123450194	\N	Alamat demo pagination	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
197	pag.demo.195@kost.test	$2y$12$uNmEHpPZCEpAh4l/5wCHT.JbBw15xUrLF/Xnc9ozzqPR/zIshwwta	penyewa	PAG-DEMO Penghuni 195	628123450195	\N	Alamat demo pagination	\N	2026-06-07 09:05:07	2026-06-07 09:05:07
198	pag.demo.196@kost.test	$2y$12$3F0poRhldQqqXFs16YehjOoE2GzxiiR/kORB7Dvc6ENXuwbd2Gvte	penyewa	PAG-DEMO Penghuni 196	628123450196	\N	Alamat demo pagination	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
199	pag.demo.197@kost.test	$2y$12$HQPgQ.teufj8lGGZllId0.aHDjchJZYz6VzrQCx7/Kh0ouiPRhnUm	penyewa	PAG-DEMO Penghuni 197	628123450197	\N	Alamat demo pagination	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
200	pag.demo.198@kost.test	$2y$12$ZvoLDApvIZLo1BV9OUGl5uxNoZYv9yV0gY/UwP7ktG/.iBrrrcKV.	penyewa	PAG-DEMO Penghuni 198	628123450198	\N	Alamat demo pagination	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
201	pag.demo.199@kost.test	$2y$12$edffY6pnYETAsBT1eptdUu59o1ujETX2ZV6p3mFtOyOQHVG1YS2mm	penyewa	PAG-DEMO Penghuni 199	628123450199	\N	Alamat demo pagination	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
202	pag.demo.200@kost.test	$2y$12$BjLjfXxJT5F5YR6x5Yf1DuroAs6IyHNQVcE6x4kptAbv/.ZIMmOoi	penyewa	PAG-DEMO Penghuni 200	628123450200	\N	Alamat demo pagination	\N	2026-06-07 09:05:08	2026-06-07 09:05:08
203	pag.demo.201@kost.test	$2y$12$toHGL5T.d4M0D4cmhhd2YuvUdh/fTVf8w0yYn4Fg87uLPQyXl2xFO	penyewa	PAG-DEMO Penghuni 201	628123450201	\N	Alamat demo pagination	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
204	pag.demo.202@kost.test	$2y$12$XnNI/yrTrQr.58X9vN6rWufcUVsub98eX16fsJvGWaXjwVdcW4tJa	penyewa	PAG-DEMO Penghuni 202	628123450202	\N	Alamat demo pagination	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
205	pag.demo.203@kost.test	$2y$12$e5aGjDzKSqbQA1X3UgnxQuW2QwrPxwyaw4UFxrHCse4I95JCcn6FK	penyewa	PAG-DEMO Penghuni 203	628123450203	\N	Alamat demo pagination	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
206	pag.demo.204@kost.test	$2y$12$pPaAbHAuOg/widO9LDfdZORLltlsEZNhyZ5nbCuq9RoIFZQKCNcqm	penyewa	PAG-DEMO Penghuni 204	628123450204	\N	Alamat demo pagination	\N	2026-06-07 09:05:09	2026-06-07 09:05:09
207	pag.demo.205@kost.test	$2y$12$KhA/mP1Gl3Ju8HJJ6qflCORFCkMHpDSrORpGSWnm/fyFX1VqKsUru	penyewa	PAG-DEMO Penghuni 205	628123450205	\N	Alamat demo pagination	\N	2026-06-07 09:05:10	2026-06-07 09:05:10
208	afrizal.dwi.ahmad.5630@kost.com	$2y$12$WASEKgxBSZiyA.pFuDm7L.miMtRbmBz9wpbqGXRgQuTOsqRxq5W5K	penyewa	Afrizal Dwi Ahmad	6281917052146	\N	Pelemwatu RT 03 RW 02 kavlingan pagar hijau, Menganti, gresik	\N	2026-06-07 20:38:27	2026-06-07 20:38:27
209	demo.h7@kost.com	$2y$12$RYlmZsIv2zbBL2OIbsgYueeqnRv1KOzPuo5W0oAJEkUwkuts07Bqq	penyewa	Demo H7 Penyewa	6281234567890	\N	Data demo H-7	\N	2026-06-07 20:39:49	2026-06-07 20:39:49
210	afrizal.dwi.ahmad.8694@kost.com	$2y$12$t5gMfXlRYmcPfXIAWtNC.uNVhU2POo597z6Sk4yK9TB.4.r4/SDZ2	penyewa	Afrizal Dwi Ahmad	6281917052146	\N	Tambak asri	\N	2026-06-10 23:22:23	2026-06-10 23:24:05
1	admin@kost.com	$2y$12$OyR7wzNH0PV5uvQOP8SppuU5pAF2uCndtpmIkCgPK/SLrwxPRDW/a	admin	Admin Kost	081234567890	\N	Sidoarjo	\N	2026-06-06 11:22:13	2026-06-11 04:11:28
\.


--
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: kost_user
--

COPY public.visitors (id, visitor_key, visit_date, country, city, browser_name, last_seen_at, analytics_consent, location_consent, browser_consent) FROM stdin;
6	b9870d758bb19152714d9277ee195cddd9c1523543f9feb59bb2cfc23070d06c	2026-06-07	\N	\N	Brave	2026-06-07 11:34:54	t	t	t
8	da3410cd8730430115e6bc900fd596d8128c620b5ff9a9b1b0651dea208f2dc2	2026-06-07	\N	\N	Brave	2026-06-07 20:33:26	t	t	t
10	5f199a22795ce0b28c7855103941d067eb5fd85061ca9016429100ff6dedaa35	2026-06-08	Indonesia	Gresik	Brave	2026-06-08 07:19:42	t	t	t
9	da3410cd8730430115e6bc900fd596d8128c620b5ff9a9b1b0651dea208f2dc2	2026-06-08	\N	\N	Brave	2026-06-08 21:42:35	t	t	t
13	b9870d758bb19152714d9277ee195cddd9c1523543f9feb59bb2cfc23070d06c	2026-06-09	\N	\N	Brave	2026-06-09 17:23:09	t	t	t
12	da3410cd8730430115e6bc900fd596d8128c620b5ff9a9b1b0651dea208f2dc2	2026-06-09	Indonesia	Gresik	Brave	2026-06-09 18:20:08	t	t	t
15	b9870d758bb19152714d9277ee195cddd9c1523543f9feb59bb2cfc23070d06c	2026-06-10	\N	\N	Brave	2026-06-10 16:15:56	t	t	t
14	da3410cd8730430115e6bc900fd596d8128c620b5ff9a9b1b0651dea208f2dc2	2026-06-10	\N	\N	Brave	2026-06-10 18:39:44	t	t	t
16	0ff66c0db17e9986d8b4bf56ae295f486a78bd3be843148b015a7f8d5f936a83	2026-06-10	Indonesia	Gresik	Edge	2026-06-10 18:39:56	t	t	t
17	da3410cd8730430115e6bc900fd596d8128c620b5ff9a9b1b0651dea208f2dc2	2026-06-11	\N	\N	Chrome	2026-06-11 07:06:52	t	t	t
4	5f199a22795ce0b28c7855103941d067eb5fd85061ca9016429100ff6dedaa35	2026-06-06	Indonesia	Gresik	Brave	2026-06-06 16:33:58	t	t	t
3	126d7c4ca4dbdd4cf97392b1338bacd07a90f9c4ac26be86cf7972ee76606294	2026-06-06	\N	\N	Brave	2026-06-06 16:38:33	t	t	t
2	c0ce6a652b0f3cc6db9f5866c85f1ff89dd274b2f2c4464916a284ac7959b5be	2026-06-06	\N	\N	\N	2026-06-06 16:57:30	t	f	f
1	da3410cd8730430115e6bc900fd596d8128c620b5ff9a9b1b0651dea208f2dc2	2026-06-06	\N	\N	Brave	2026-06-06 20:07:05	t	t	t
5	2be9166be9715ae3e79a00a24a2cafc742662f37f78a9fb52881c98e033decd6	2026-06-06	\N	\N	Edge	2026-06-06 20:24:29	t	t	t
7	60faf62be7d2acda01cbcbdebb5cdb5240c5d5e5c8003dd66886a7d8a8fcb86b	2026-06-07	\N	\N	Brave	2026-06-07 10:21:01	t	t	t
\.


--
-- Name: buku_tamu_id_tamu_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.buku_tamu_id_tamu_seq', 207, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: kamar_id_kamar_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.kamar_id_kamar_seq', 209, true);


--
-- Name: keluhan_id_keluhan_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.keluhan_id_keluhan_seq', 207, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.migrations_id_seq', 19, true);


--
-- Name: mobile_device_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.mobile_device_tokens_id_seq', 1, false);


--
-- Name: notifikasis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.notifikasis_id_seq', 410, true);


--
-- Name: pembayaran_id_pembayaran_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.pembayaran_id_pembayaran_seq', 210, true);


--
-- Name: pengeluaran_id_pengeluaran_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.pengeluaran_id_pengeluaran_seq', 2, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 1, false);


--
-- Name: riwayat_sewa_id_sewa_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.riwayat_sewa_id_sewa_seq', 209, true);


--
-- Name: tagihan_id_tagihan_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.tagihan_id_tagihan_seq', 212, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.users_id_seq', 210, true);


--
-- Name: visitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kost_user
--

SELECT pg_catalog.setval('public.visitors_id_seq', 17, true);


--
-- Name: buku_tamu buku_tamu_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.buku_tamu
    ADD CONSTRAINT buku_tamu_pkey PRIMARY KEY (id_tamu);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: kamar kamar_nomor_kamar_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.kamar
    ADD CONSTRAINT kamar_nomor_kamar_unique UNIQUE (nomor_kamar);


--
-- Name: kamar kamar_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.kamar
    ADD CONSTRAINT kamar_pkey PRIMARY KEY (id_kamar);


--
-- Name: keluhan keluhan_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.keluhan
    ADD CONSTRAINT keluhan_pkey PRIMARY KEY (id_keluhan);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: mobile_device_tokens mobile_device_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.mobile_device_tokens
    ADD CONSTRAINT mobile_device_tokens_pkey PRIMARY KEY (id);


--
-- Name: mobile_device_tokens mobile_tokens_user_token_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.mobile_device_tokens
    ADD CONSTRAINT mobile_tokens_user_token_unique UNIQUE (id_user, device_token);


--
-- Name: notifikasis notifikasis_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.notifikasis
    ADD CONSTRAINT notifikasis_pkey PRIMARY KEY (id);


--
-- Name: notifikasis notifikasis_user_tagihan_tipe_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.notifikasis
    ADD CONSTRAINT notifikasis_user_tagihan_tipe_unique UNIQUE (id_user, id_tagihan, tipe);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: pembayaran pembayaran_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.pembayaran
    ADD CONSTRAINT pembayaran_pkey PRIMARY KEY (id_pembayaran);


--
-- Name: pengeluaran pengeluaran_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.pengeluaran
    ADD CONSTRAINT pengeluaran_pkey PRIMARY KEY (id_pengeluaran);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: riwayat_sewa riwayat_sewa_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.riwayat_sewa
    ADD CONSTRAINT riwayat_sewa_pkey PRIMARY KEY (id_sewa);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: tagihan tagihan_kode_invoice_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.tagihan
    ADD CONSTRAINT tagihan_kode_invoice_unique UNIQUE (kode_invoice);


--
-- Name: tagihan tagihan_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.tagihan
    ADD CONSTRAINT tagihan_pkey PRIMARY KEY (id_tagihan);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_visitor_key_visit_date_unique; Type: CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_visitor_key_visit_date_unique UNIQUE (visitor_key, visit_date);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: kost_user
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: buku_tamu buku_tamu_bertemu_dengan_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.buku_tamu
    ADD CONSTRAINT buku_tamu_bertemu_dengan_foreign FOREIGN KEY (bertemu_dengan) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: keluhan keluhan_id_sewa_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.keluhan
    ADD CONSTRAINT keluhan_id_sewa_foreign FOREIGN KEY (id_sewa) REFERENCES public.riwayat_sewa(id_sewa) ON DELETE CASCADE;


--
-- Name: mobile_device_tokens mobile_device_tokens_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.mobile_device_tokens
    ADD CONSTRAINT mobile_device_tokens_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifikasis notifikasis_id_tagihan_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.notifikasis
    ADD CONSTRAINT notifikasis_id_tagihan_foreign FOREIGN KEY (id_tagihan) REFERENCES public.tagihan(id_tagihan) ON DELETE CASCADE;


--
-- Name: notifikasis notifikasis_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.notifikasis
    ADD CONSTRAINT notifikasis_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pembayaran pembayaran_id_tagihan_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.pembayaran
    ADD CONSTRAINT pembayaran_id_tagihan_foreign FOREIGN KEY (id_tagihan) REFERENCES public.tagihan(id_tagihan) ON DELETE CASCADE;


--
-- Name: pengeluaran pengeluaran_dibuat_oleh_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.pengeluaran
    ADD CONSTRAINT pengeluaran_dibuat_oleh_foreign FOREIGN KEY (dibuat_oleh) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: riwayat_sewa riwayat_sewa_id_kamar_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.riwayat_sewa
    ADD CONSTRAINT riwayat_sewa_id_kamar_foreign FOREIGN KEY (id_kamar) REFERENCES public.kamar(id_kamar) ON DELETE RESTRICT;


--
-- Name: riwayat_sewa riwayat_sewa_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.riwayat_sewa
    ADD CONSTRAINT riwayat_sewa_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tagihan tagihan_id_sewa_foreign; Type: FK CONSTRAINT; Schema: public; Owner: kost_user
--

ALTER TABLE ONLY public.tagihan
    ADD CONSTRAINT tagihan_id_sewa_foreign FOREIGN KEY (id_sewa) REFERENCES public.riwayat_sewa(id_sewa) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict DZgzNrQnWeNYq7zcbmaeLgfJ5LyOms3nqAej4HKTD2TKfenFGnv1Kt2ozdYPrt9

