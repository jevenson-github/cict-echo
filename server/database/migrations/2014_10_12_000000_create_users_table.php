<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email_address')->unique();
            $table->string('password');
            $table->string('department')->nullable();
            $table->string('designation')->nullable();
            $table->string('profile_image')->nullable();
            $table->enum('user_level', ['admin', 'faculty'])->default('faculty')->nullable();
            $table->enum('status', ['verified', 'pending', 'rejected', 'resigned'])->default('pending');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
