<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keluhan;
use App\Models\RiwayatSewa;
use App\Patterns\Strategy\AdminKeluhanStrategy;
use App\Patterns\Strategy\PenyewaKeluhanStrategy;
use App\Patterns\Strategy\KeluhanQueryStrategy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class KeluhanController extends Controller
{
    public function index(Request $request)
    {
        $id_user = $request->id_user;
        $role = $request->role;

        // Strategy Selection
        $strategy = $role === 'admin' 
            ? new AdminKeluhanStrategy() 
            : new PenyewaKeluhanStrategy();

        $query = $strategy->buildQuery($id_user);

        $data = $query->orderBy('tanggal_lapor', 'desc')->get()->map(function ($item) {
            return [
                'id_keluhan' => $item->id_keluhan,
                'judul' => $item->judul_keluhan,
                'deskripsi' => $item->deskripsi_keluhan,
                'status' => $item->status_keluhan,
                'tanggal_lapor' => $item->tanggal_lapor,
                'tanggal_selesai' => $item->tanggal_selesai,
                'foto' => $item->foto_kerusakan ? asset('storage/' . $item->foto_kerusakan) : null,
                'id_user' => $item->riwayatSewa ? $item->riwayatSewa->id_user : null,
                'nama_penyewa' => ($item->riwayatSewa && $item->riwayatSewa->user) ? $item->riwayatSewa->user->nama_lengkap : '-',
                'id_kamar' => $item->riwayatSewa ? $item->riwayatSewa->id_kamar : null,
                'nomor_kamar' => ($item->riwayatSewa && $item->riwayatSewa->kamar) ? $item->riwayatSewa->kamar->nomor_kamar : '-'
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_user' => 'required|exists:users,id',
            'judul' => 'required|string|max:100',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        // Cari sewa aktif untuk user ini
        $sewaAktif = RiwayatSewa::where('id_user', $request->id_user)
            ->where('status_sewa', 'aktif')
            ->first();

        if (!$sewaAktif) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki sewa aktif'
            ], 400);
        }

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('kerusakan', 'public');
        }

        $keluhan = Keluhan::create([
            'id_sewa' => $sewaAktif->id_sewa,
            'judul_keluhan' => $request->judul,
            'deskripsi_keluhan' => $request->deskripsi,
            'foto_kerusakan' => $fotoPath,
            'status_keluhan' => 'pending',
            'tanggal_lapor' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Keluhan berhasil dikirim',
            'data' => $keluhan
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $keluhan = Keluhan::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,proses,selesai',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $keluhan->status_keluhan = $request->status;
        if ($request->status === 'selesai') {
            $keluhan->tanggal_selesai = now();
        }
        $keluhan->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status keluhan berhasil diupdate'
        ]);
    }

    public function destroy($id)
    {
        $keluhan = Keluhan::findOrFail($id);
        
        if ($keluhan->foto_kerusakan) {
            Storage::disk('public')->delete($keluhan->foto_kerusakan);
        }
        
        $keluhan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Keluhan berhasil dihapus'
        ]);
    }
}
