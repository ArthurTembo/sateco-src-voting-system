<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'username' => 'testuser',
        'first_name' => 'Test',
        'middle_name' => 'N.',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users include voting-system profile fields', function () {
    $user = User::factory()->create([
        'username' => 'alicevoter',
        'first_name' => 'Alice',
        'middle_name' => 'M.',
        'last_name' => 'Voter',
        'is_admin' => false,
        'has_voted' => false,
    ]);

    expect($user)
        ->username->toBe('alicevoter')
        ->first_name->toBe('Alice')
        ->middle_name->toBe('M.')
        ->last_name->toBe('Voter')
        ->is_admin->toBeFalse()
        ->has_voted->toBeFalse();
});