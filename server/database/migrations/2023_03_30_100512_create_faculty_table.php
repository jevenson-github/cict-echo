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
        Schema::create('faculty', function (Blueprint $table) {
            $table->id('employee_id');
            $table->string('username')->unique();
            $table->string('password');
            $table->string('email')->unique();
            $table->string('first_name');
            $table->char('middle_initial', 1)->nullable();
            $table->string('last_name');
            $table->string('post_nominal')->nullable();
            $table->enum('employment_status', ['Regular', 'Part-time', 'Resigned']);
            $table->enum('department', ['BSIT', 'BLIS', 'Allied']);
            $table->string('designation')->nullable();
            $table->string('profile_picture')->nullable();
            $table->tinyInteger('user_level')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty');
    }
};
