<?php

namespace Tests\Feature;

use App\Models\Applicant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_applicant_cannot_manage_content()
    {
        $applicant = User::factory()->create(['role' => 'applicant']);

        Sanctum::actingAs($applicant);

        // ponytail: two probes suffice — every admin route shares the same
        // 'admin' middleware on one route group
        $this->postJson('/api/programs', ['nama' => 'X', 'deskripsi' => 'Y'])->assertForbidden();
        $this->postJson('/api/blogs', ['judul' => 'X', 'konten' => 'Y'])->assertForbidden();
    }

    public function test_payment_is_attributed_to_own_applicant_not_body_id()
    {
        $user = User::factory()->create(['role' => 'applicant']);
        $own = Applicant::factory()->create(['user_id' => $user->id, 'payment_allowed_at' => now()]);

        Sanctum::actingAs($user);

        $res = $this->postJson('/api/payments', [
            'applicant_id' => 999999,
            'jumlah' => 100000,
            'keterangan' => 'DP',
            'bukti' => UploadedFile::fake()->image('bukti.jpg'),
        ]);

        $res->assertCreated();
        $this->assertSame($own->id, $res->json('data.applicant.id') ?? $res->json('data.applicant_id'));
    }

    public function test_blog_content_is_sanitized_on_store()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Sanctum::actingAs($admin);

        $res = $this->postJson('/api/blogs', [
            'judul' => 'T',
            'konten' => '<p>ok</p><script>alert(1)</script><img src=x onerror=alert(2)><a href="javascript:alert(3)">k</a><a href="https://a.co">l</a>',
        ]);

        $res->assertCreated();
        $konten = $res->json('data.konten');

        $this->assertStringNotContainsString('<script', $konten);
        $this->assertStringNotContainsString('alert(1)', $konten); // script subtree fully dropped
        $this->assertStringNotContainsString('<img', $konten);
        $this->assertStringNotContainsString('javascript:', $konten);
        $this->assertStringContainsString('href="https://a.co"', $konten);
    }

    public function test_registration_limited_to_two_per_ip()
    {
        // Test client's requests originate from 127.0.0.1
        User::factory()->count(2)->create(['role' => 'applicant', 'registrasi_ip' => '127.0.0.1']);

        // 3rd attempt from the same IP is blocked
        $this->postJson('/api/applicants', [
            'email' => 'spam3@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(429);
        $this->assertDatabaseMissing('users', ['email' => 'spam3@test.com']);

        // Different IP still works, and the IP is recorded for tracing
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.9'])
            ->postJson('/api/applicants', [
                'email' => 'clean@test.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])->assertOk();

        $this->assertDatabaseHas('users', ['email' => 'clean@test.com', 'registrasi_ip' => '198.51.100.9']);
    }

    public function test_updating_own_profile_syncs_users_table()
    {
        $user = User::factory()->create(['role' => 'applicant', 'email' => 'old@test.com', 'name' => 'old@test.com']);
        Applicant::factory()->create(['user_id' => $user->id, 'email' => 'old@test.com']);

        Sanctum::actingAs($user);

        // Login authenticates against users.email — if the edit only touched
        // applicants.email, the user would be locked out after changing email
        $this->putJson('/api/applicants/me', [
            'nama' => 'Budi Santoso',
            'email' => 'new@test.com',
        ])->assertOk();

        $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'new@test.com', 'name' => 'Budi Santoso']);
    }

    public function test_registration_blocked_across_rotating_cgnat_ips()
    {
        // CGNAT rotates the public IP per session within one block —
        // .10 then .77 must count as the same network
        foreach (['198.51.100.10', '198.51.100.77'] as $i => $ip) {
            $this->withServerVariables(['REMOTE_ADDR' => $ip])
                ->postJson('/api/applicants', [
                    'email' => "cgnat{$i}@test.com",
                    'password' => 'password123',
                    'password_confirmation' => 'password123',
                ])->assertOk();
        }

        // Third device-session from the same /24 is blocked
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.200'])
            ->postJson('/api/applicants', [
                'email' => 'cgnat2@test.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])->assertStatus(429);

        // Different /24 still works
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.5'])
            ->postJson('/api/applicants', [
                'email' => 'clean2@test.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])->assertOk();
    }
}
