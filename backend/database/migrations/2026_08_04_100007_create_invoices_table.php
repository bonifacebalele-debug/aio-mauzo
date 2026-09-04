<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_template_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('currency_id')->constrained();

            $table->string('invoice_number')->unique();
            $table->string('reference')->nullable();
            $table->date('invoice_date');
            $table->date('due_date')->nullable();

            $table->enum('status', ['draft', 'sent', 'viewed', 'paid', 'cancelled', 'overdue'])->default('draft');

            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_total', 15, 2)->default(0);
            $table->decimal('tax_total', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->decimal('amount_paid', 15, 2)->default(0);

            $table->text('notes')->nullable();
            $table->text('terms')->nullable();

            $table->foreignId('prepared_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('duplicated_from')->nullable()->constrained('invoices')->nullOnDelete();

            $table->string('pdf_path')->nullable();
            $table->timestamp('pdf_generated_at')->nullable();

            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('invoice_date');
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
