<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            // Branding
            $table->string('logo_path')->nullable();
            $table->string('logo_size', 20)->default('medium'); // small|medium|large
            $table->string('logo_position', 20)->default('left'); // left|center|right
            $table->string('primary_color', 7)->default('#4F46E5');
            $table->string('secondary_color', 7)->default('#14B8A6');

            // Digital signature
            $table->string('signature_path')->nullable();
            $table->boolean('signature_enabled')->default(false);
            $table->unsignedSmallInteger('signature_width')->default(150);
            $table->unsignedSmallInteger('signature_x')->default(0);
            $table->unsignedSmallInteger('signature_y')->default(0);

            // Company stamp
            $table->string('stamp_path')->nullable();
            $table->boolean('stamp_enabled')->default(false);
            $table->unsignedSmallInteger('stamp_width')->default(150);
            $table->unsignedSmallInteger('stamp_rotation')->default(0);
            $table->unsignedTinyInteger('stamp_opacity')->default(100);
            $table->unsignedSmallInteger('stamp_x')->default(0);
            $table->unsignedSmallInteger('stamp_y')->default(0);

            $table->string('qr_code_path')->nullable();

            // Contact & legal
            $table->text('address')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('tin', 50)->nullable();
            $table->string('vrn', 50)->nullable();
            $table->string('business_registration_number', 50)->nullable();

            // Invoice defaults
            $table->text('footer_text')->nullable();
            $table->text('terms_conditions')->nullable();
            $table->text('payment_instructions')->nullable();
            $table->foreignId('default_currency_id')->nullable()->constrained('currencies')->nullOnDelete();
            $table->string('default_language', 5)->default('en');
            $table->string('invoice_prefix', 20)->default('INV');
            $table->string('invoice_number_format', 50)->default('{PREFIX}-{YEAR}-{NUMBER}');
            $table->unsignedInteger('next_invoice_number')->default(1);

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
