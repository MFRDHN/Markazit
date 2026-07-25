<?php

namespace Database\Factories;

use App\Models\Applicant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantFactory extends Factory
{
    protected $model = Applicant::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'usia' => fake()->numberBetween(18, 35),
            'no_hp' => fake()->unique()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'status' => 'pending',
        ];
    }
}
