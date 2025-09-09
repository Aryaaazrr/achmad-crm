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
        Schema::create('customer', function (Blueprint $table) {
            $table->id('id_customer');
            $table->string('customer_name');
            $table->string('contact')->nullable();
            $table->string('address')->nullable();
            $table->unsignedBigInteger('id_leads');
            $table->foreign('id_leads')->references('id_leads')->on('leads')->onUpdate('cascade')->onDelete('cascade');
            $table->enum('status', ['active', 'non-active'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer');
    }
};
