<?php

namespace App\Imports;

use App\Models\Voter;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class votersImport implements ToCollection
{
    /** Alphabet for generated passwords (no easily confused I, O, 0, 1). */
    private const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    /** Required password length (plain text, not hashed). */
    private const PASSWORD_LENGTH = 6;

    public int $imported = 0;

    /** @var string[] Passwords already taken (existing rows + generated during this run). */
    private array $usedPasswords = [];

    public function __construct()
    {
        // Seed with passwords already stored so generated ones stay unique across imports.
        $this->usedPasswords = Voter::query()
            ->whereNotNull('password')
            ->pluck('password')
            ->all();
    }

    /**
     * Expected column order (header names are optional, matched by position):
     * StudentID, FirstName, MiddleName, LastName, Gender, Course
     *
     * Every imported voter gets a unique 6-character plain-text password
     * stored in the voters table. Existing voters keep their password.
     *
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            // Skip header row if present
            if ($index === 0 && isset($row[0]) && in_array(strtolower(trim((string) $row[0])), ['studentid', 'student_id'], true)) {
                continue;
            }

            $studentId = trim((string) ($row[0] ?? ''));
            $firstName = trim((string) ($row[1] ?? ''));
            $middleName = trim((string) ($row[2] ?? ''));
            $lastName = trim((string) ($row[3] ?? ''));
            $gender = strtolower(trim((string) ($row[4] ?? '')));
            $course = trim((string) ($row[5] ?? ''));

            if ($studentId === '' || $firstName === '' || $lastName === '') {
                continue;
            }

            // The gender and course columns are NOT NULL: keep the values as
            // provided, or an empty string when the spreadsheet leaves them blank.
            $genderValue = $gender;
            $courseValue = $course;

            $attributes = [
                'first_name' => $firstName,
                'middle_name' => $middleName !== '' ? $middleName : null,
                'last_name' => $lastName,
                'gender' => $genderValue,
                'course' => $courseValue,
            ];

            // Only generate a password for voters that don't have one yet.
            $existing = Voter::where('student_id', $studentId)->first();
            if (! $existing || blank($existing->password)) {
                $attributes['password'] = $this->generateUniquePassword();
            }

            $voter = Voter::updateOrCreate(
                ['student_id' => $studentId],
                $attributes
            );

            if ($voter->wasRecentlyCreated) {
                $this->imported++;
            }
        }
    }

    /**
     * Generate a unique plain-text password of 6 characters.
     */
    public function generateUniquePassword(): string
    {
        do {
            $password = self::generatePassword();
        } while (in_array($password, $this->usedPasswords, true));

        $this->usedPasswords[] = $password;

        return $password;
    }

    /**
     * Generate a single random password (uniqueness is handled by the caller).
     */
    private static function generatePassword(): string
    {
        $password = '';
        $max = strlen(self::PASSWORD_ALPHABET) - 1;

        for ($i = 0; $i < self::PASSWORD_LENGTH; $i++) {
            $password .= self::PASSWORD_ALPHABET[random_int(0, $max)];
        }

        return $password;
    }

    public function getImportedCount(): int
    {
        return $this->imported;
    }
}
