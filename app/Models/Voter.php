<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',    
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'course',
        'has_voted',
        'password',
    ];

    protected $casts = [
        'has_voted' => 'boolean',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Aggregate counts backing the voter overview cards.
     *
     * Gender is stored lowercase ('male', 'female', 'other'); the comparison is
     * case-insensitive so rows edited by hand still land in the right bucket.
     * Computed in a single query and returned as integers, because SUM() yields
     * NULL when the table is empty.
     *
     * @return array{total: int, male: int, female: int}
     */
    public static function overviewStats(): array
    {
        $totals = static::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN LOWER(gender) = 'male' THEN 1 ELSE 0 END) as male")
            ->selectRaw("SUM(CASE WHEN LOWER(gender) = 'female' THEN 1 ELSE 0 END) as female")
            ->first();

        return [
            'total' => (int) ($totals->total ?? 0),
            'male' => (int) ($totals->male ?? 0),
            'female' => (int) ($totals->female ?? 0),
        ];
    }

    /**
     * Narrow a voter listing down to a free-text search of the student ID
     * ("ID"), the first name and the surname.
     *
     * The term is split into words before matching, so a typed full name such as
     * "juan cruz" still finds a voter whose first name and surname live in
     * separate columns. Each word may match a different column, which also makes
     * "cruz juan" work. LIKE wildcards are escaped so a literal "%" or "_" in
     * the term cannot widen the search to every voter. An empty term leaves the
     * query untouched, so an unfiltered listing stays a plain "all voters".
     */
    public function scopeSearch(Builder $query, ?string $search): void
    {
        $terms = preg_split('/\s+/', trim((string) $search), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        foreach ($terms as $term) {
            $pattern = '%'.addcslashes($term, '%_').'%';

            $query->where(function (Builder $query) use ($pattern) {
                $query->where('student_id', 'like', $pattern)
                    ->orWhere('first_name', 'like', $pattern)
                    ->orWhere('last_name', 'like', $pattern);
            });
        }
    }
}
