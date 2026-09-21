<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class CategoryImport implements ToCollection
{
    public int $imported = 0;

    /**
    * @param Collection $collection
    */
    public function collection(Collection $rows)
    {
       foreach ($rows as $index => $row) {
           // Skip header row if present
           if ($index === 0 && isset($row[0]) && strtolower(trim($row[0])) === 'name') {
               continue;
           }

           if (!isset($row[0]) || trim($row[0]) === '') {
               continue;
           }

           $model = \App\Models\Category::firstOrCreate([
               'name' => $row[0],
           ], [
               'description' => $row[1] ?? null,
           ]);

           if ($model->wasRecentlyCreated) {
               $this->imported++;
           }
       }
    }

    public function getImportedCount(): int
    {
        return $this->imported;
    }
}
