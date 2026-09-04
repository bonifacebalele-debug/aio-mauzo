<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

/**
 * Generic tabular export used by every report. The same $rows collection
 * (array of associative arrays) drives the on-screen JSON, this export,
 * and the PDF view, so numbers never drift between formats.
 */
class ReportExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        private readonly Collection $rows,
        private readonly array $headings,
    ) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return $this->headings;
    }

    public function map($row): array
    {
        return array_values($row);
    }
}
