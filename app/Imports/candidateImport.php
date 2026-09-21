<?php

namespace App\Imports;

use App\Models\Candidate;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class candidateImport implements ToCollection
{
    public int $imported = 0;

    public function __construct(private ?int $categoryId = null)
    {
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            if ($index === 0 && isset($row[0]) && strtolower(trim((string) $row[0])) === 'studentid') {
                continue;
            }

            $studentId = trim((string) ($row[0] ?? ''));
            $firstName = trim((string) ($row[1] ?? ''));
            $middleName = trim((string) ($row[2] ?? ''));
            $lastName = trim((string) ($row[3] ?? ''));
            $gender = strtolower(trim((string) ($row[4] ?? '')));
            $categoryName = trim((string) ($row[5] ?? ''));
            $course = trim((string) ($row[6] ?? ''));

            if ($studentId === '' || $firstName === '' || $lastName === '') {
                continue;
            }

            $genderValue = in_array($gender, ['male', 'female'], true) ? $gender : null;

            $categoryId = $this->categoryId;
            if ($categoryName !== '') {
                $category = \App\Models\Category::firstOrCreate(['name' => $categoryName]);
                $categoryId = $category->id;
            }

            $candidate = Candidate::updateOrCreate(
                ['student_id' => $studentId],
                [
                    'category_id' => $categoryId ?? 1,
                    'first_name' => $firstName,
                    'middle_name' => $middleName !== '' ? $middleName : null,
                    'last_name' => $lastName,
                    'gender' => $genderValue,
                    'course' => $course !== '' ? $course : null,
                    'is_active' => true,
                ]
            );

            if ($candidate->wasRecentlyCreated) {
                $this->imported++;
            }
        }
    }

    public function getImportedCount(): int
    {
        return $this->imported;
    }
}
