<?php

namespace App\Http\Controllers;

use App\Services\InvoiceService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceService $invoiceService
    ) {}

    public function adminIndex(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');

        return response()->json([
            'data' => $this->invoiceService->getAdminInvoices(),
        ]);
    }

    public function penyewaIndex(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'penyewa', 403, 'Akses hanya untuk penyewa.');

        return response()->json([
            'data' => $this->invoiceService->getPenyewaInvoices($request->user()->id),
        ]);
    }

    public function adminPdf(Request $request, int $idPembayaran): Response
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');

        $invoice = $this->invoiceService->getInvoiceDetail($idPembayaran);
        $fileName = ($invoice['kode_invoice'] ?? 'invoice') . '.pdf';

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
        ])
            ->setPaper('a4', 'portrait')
            ->download($fileName);
    }

    public function penyewaPdf(Request $request, int $idPembayaran): Response
    {
        abort_unless($request->user()?->role === 'penyewa', 403, 'Akses hanya untuk penyewa.');

        $invoice = $this->invoiceService->getInvoiceDetail(
            idPembayaran: $idPembayaran,
            userId: $request->user()->id
        );

        $fileName = ($invoice['kode_invoice'] ?? 'invoice') . '.pdf';

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
        ])
            ->setPaper('a4', 'portrait')
            ->download($fileName);
    }
}
