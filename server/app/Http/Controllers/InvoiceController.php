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
        abort_unless(
            $request->user()?->role === 'admin',
            403,
            'Akses hanya untuk admin.'
        );

        $this->validatePagination($request);

        $invoices = $this->invoiceService->getAdminInvoices(
            $this->perPage($request)
        );

        return response()->json([
            'data' => $this->paginatedData($invoices),
            'meta' => $this->paginationMeta($invoices),
        ]);
    }

    public function penyewaIndex(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->role === 'penyewa',
            403,
            'Akses hanya untuk penyewa.'
        );

        $this->validatePagination($request);

        $invoices = $this->invoiceService->getPenyewaInvoices(
            $request->user()->id,
            $this->perPage($request)
        );

        return response()->json([
            'data' => $this->paginatedData($invoices),
            'meta' => $this->paginationMeta($invoices),
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
