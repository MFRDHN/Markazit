<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Applicant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class ApplicantFotoTest extends TestCase
{
    use RefreshDatabase;

    private User $user1;
    private User $user2;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user1 = User::factory()->create(['role' => 'applicant']);
        $this->user2 = User::factory()->create(['role' => 'applicant']);

        Applicant::factory()->create(['user_id' => $this->user1->id, 'foto' => '']);
        Applicant::factory()->create(['user_id' => $this->user2->id, 'foto' => '']);
    }

    public function test_each_applicant_gets_unique_foto_path_on_upload()
    {
        Sanctum::actingAs($this->user1);

        $foto1 = UploadedFile::fake()->image('foto1.jpg', 100, 100);
        $this->putJson('/api/applicants/me', ['foto' => $foto1])->assertOk();

        $app1 = $this->user1->applicant->fresh();
        $this->assertNotNull($app1->foto);
        $this->assertStringStartsWith('applicants/foto/', $app1->foto);

        // Upload foto for user2
        Sanctum::actingAs($this->user2);
        $foto2 = UploadedFile::fake()->image('foto2.jpg', 100, 100);
        $this->putJson('/api/applicants/me', ['foto' => $foto2])->assertOk();

        $app2 = $this->user2->applicant->fresh();
        $this->assertNotNull($app2->foto);
        $this->assertStringStartsWith('applicants/foto/', $app2->foto);

        // Paths must be different
        $this->assertNotEquals($app1->foto, $app2->foto);

        // Files must exist on disk
        Storage::disk('local')->assertExists($app1->foto);
        Storage::disk('local')->assertExists($app2->foto);
    }

    public function test_admin_viewFile_returns_correct_foto_for_each_applicant()
    {
        // Upload fotos
        Sanctum::actingAs($this->user1);
        $foto1 = UploadedFile::fake()->image('foto1.jpg', 50, 50);
        $this->putJson('/api/applicants/me', ['foto' => $foto1]);

        Sanctum::actingAs($this->user2);
        $foto2 = UploadedFile::fake()->image('foto2.jpg', 60, 60);
        $this->putJson('/api/applicants/me', ['foto' => $foto2]);

        $app1 = $this->user1->applicant->fresh();
        $app2 = $this->user2->applicant->fresh();

        // Admin views each foto
        Sanctum::actingAs($this->admin);

        $response1 = $this->getJson("/api/applicants/{$app1->id}/file/foto");
        $response1->assertOk();
        $response1->assertHeader('Content-Type', 'image/jpeg');

        $response2 = $this->getJson("/api/applicants/{$app2->id}/file/foto");
        $response2->assertOk();
        $response2->assertHeader('Content-Type', 'image/jpeg');

        // File contents must differ
        $this->assertNotEquals(
            $response1->streamedContent(),
            $response2->streamedContent()
        );
    }

    public function test_admin_list_returns_unique_foto_paths()
    {
        Sanctum::actingAs($this->user1);
        $this->putJson('/api/applicants/me', ['foto' => UploadedFile::fake()->image('a.jpg')]);

        Sanctum::actingAs($this->user2);
        $this->putJson('/api/applicants/me', ['foto' => UploadedFile::fake()->image('b.jpg')]);

        Sanctum::actingAs($this->admin);
        $response = $this->getJson('/api/applicants?per_page=50');

        $response->assertOk();
        $fotos = collect($response->json('data'))->pluck('foto');

        // Must have 2 unique foto paths
        $this->assertCount(2, $fotos->unique());
        $this->assertCount(2, $fotos);
    }
}
