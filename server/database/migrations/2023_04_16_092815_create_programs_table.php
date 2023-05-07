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
            $table->string('title');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('location')->nullable();
            $table->text('details')->nullable();
            $table->string('lead')->nullable();
            $table->text('participants')->nullable();
            $table->text('flow')->nullable();
            $table->text('additional_details')->nullable();
            $table->string('partner')->nullable();
            $table->string('attendance')->nullable();
            $table->string('certificate')->nullable();
            $table->string('invitation')->nullable();
            $table->enum('status', ['draft', 'prospect','upcoming', 'ongoing', 'ended', 'completed', 'archived'])->default('draft');
            $table->enum('initiative', ['Project', 'Activity', 'Training']);
            $table->timestamps();

            $table->foreign('lead')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('partner')->references('id')->on('partners')->onDelete('set null');

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
