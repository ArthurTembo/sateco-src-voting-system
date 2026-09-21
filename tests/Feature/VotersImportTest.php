<?php

namespace Tests\Feature;

use App\Imports\votersImport;
use App\Models\User;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class VotersImportTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Rows in the expected import order: StudentID, FirstName, MiddleName,
     * LastName, Gender, Course (first row may be a header).
     */
    private const ROWS = [
        ['StudentID', 'FirstName', 'MiddleName', 'LastName', 'Gender', 'Course'],
        ['2023-0001', 'Juan', 'Reyes', 'Dela Cruz', 'Male', 'BSIT'],
        ['2023-0002', 'Maria', '', 'Santos', 'female', 'BSED'],
        ['2023-0003', 'Pedro', 'Bautista', 'Ramirez', '', ''],
    ];

    public function test_import_generates_unique_plain_six_character_passwords(): void
    {
        $import = new votersImport();
        $import->collection(new Collection(self::ROWS));

        $voters = Voter::orderBy('student_id')->get();

        $this->assertCount(3, $voters);
        $this->assertSame(3, $import->getImportedCount());

        foreach ($voters as $voter) {
            // 6 characters, no hashing (bcrypt hashes are 60 chars starting with $2y$)
            $this->assertMatchesRegularExpression('/^[A-HJ-NP-Z2-9]{6}$/', $voter->password);
            $this->assertSame(6, strlen($voter->password));
        }

        // Every password must be unique
        $this->assertCount(3, $voters->pluck('password')->unique());
    }

    public function test_reimporting_existing_voters_keeps_their_password(): void
    {
        $first = new votersImport();
        $first->collection(new Collection(self::ROWS));
        $originalPassword = Voter::where('student_id', '2023-0001')->value('password');

        $second = new votersImport();
        $second->collection(new Collection(self::ROWS));

        $this->assertSame(3, Voter::count()); // no duplicates
        $this->assertSame(0, $second->getImportedCount());
        $this->assertSame($originalPassword, Voter::where('student_id', '2023-0001')->value('password'));
    }

    public function test_generated_passwords_are_unique_across_a_larger_batch(): void
    {
        $rows = [];
        for ($i = 1; $i <= 40; $i++) {
            $rows[] = [(string) (20250000 + $i), 'First'.$i, '', 'Last'.$i, 'male', 'BSIT'];
        }

        (new votersImport())->collection(new Collection($rows));

        $passwords = Voter::pluck('password');

        $this->assertCount(40, $passwords);
        $this->assertCount(40, $passwords->unique());
        $passwords->each(fn ($password) => $this->assertMatchesRegularExpression('/^[A-HJ-NP-Z2-9]{6}$/', $password));
    }

    public function test_voters_imported_before_passwords_existed_get_one_on_reimport(): void
    {
        // A voter created manually/imported earlier without a password
        Voter::create([
            'student_id' => '2023-0001',
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'gender' => 'male',
            'course' => 'BSIT',
            'password' => null,
        ]);

        (new votersImport())->collection(new Collection(self::ROWS));

        $voter = Voter::where('student_id', '2023-0001')->first();

        $this->assertMatchesRegularExpression('/^[A-HJ-NP-Z2-9]{6}$/', $voter->password);
        // 2023-0001 existed already (kept), 2023-0002 and 2023-0003 are new.
        $this->assertSame(3, Voter::count());
        $this->assertSame(1, Voter::where('student_id', '2023-0001')->count());
    }

    public function test_admin_upload_stores_voters_with_generated_passwords(): void
    {
        $user = User::factory()->create();

        $csv = "StudentID,FirstName,MiddleName,LastName,Gender,Course\n"
            ."2023-0100,Ana,,Lim,female,BSBA\n"
            ."2023-0101,Liwayway,Cruz,Mendoza,male,BSIT\n";

        $response = $this->actingAs($user)
            ->post(route('admin.voters.import'), [
                'file' => UploadedFile::fake()->createWithContent('voters.csv', $csv),
            ]);

        $response->assertRedirect(route('admin.voters.index'));
        $response->assertSessionHas('success');

        $this->assertSame(2, Voter::count());

        $passwords = Voter::orderBy('student_id')->pluck('password');

        $this->assertMatchesRegularExpression('/^[A-HJ-NP-Z2-9]{6}$/', $passwords[0]);
        $this->assertMatchesRegularExpression('/^[A-HJ-NP-Z2-9]{6}$/', $passwords[1]);
        $this->assertNotSame($passwords[0], $passwords[1]);
    }
}
