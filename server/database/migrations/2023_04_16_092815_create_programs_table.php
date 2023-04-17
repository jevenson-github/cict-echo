<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->string('program_title');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('location')->nullable();
            $table->text('program_details')->nullable();
            $table->unsignedBigInteger('program_lead_id')->nullable();
            $table->foreign('program_lead_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('program_members')->nullable();
            $table->text('participants')->nullable();
            $table->text('program_flow')->nullable();
            $table->text('additional_details')->nullable();
            $table->string('partner_id')->nullable();
            $table->foreign('partner_id')->references('id')->on('partners')->onDelete('set null');
            $table->enum('status', ['draft', 'upcoming', 'ongoing', 'ended', 'completed', 'archived'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
