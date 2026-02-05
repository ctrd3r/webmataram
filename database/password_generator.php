<?php
// Password Generator untuk Admin Users
// File: database/password_generator.php

/**
 * Script untuk generate password hash yang aman
 * Gunakan script ini untuk membuat password hash sebelum insert ke database
 */

// Fungsi untuk generate password hash
function generatePasswordHash($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Fungsi untuk verify password
function verifyPasswordHash($password, $hash) {
    return password_verify($password, $hash);
}

// Fungsi untuk generate random password
function generateRandomPassword($length = 12) {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    $password = '';
    
    for ($i = 0; $i < $length; $i++) {
        $password .= $characters[random_int(0, strlen($characters) - 1)];
    }
    
    return $password;
}

// Fungsi untuk generate SQL INSERT statement
function generateUserInsertSQL($nama, $username, $email, $password, $bio, $role_id = 2) {
    $hashedPassword = generatePasswordHash($password);
    
    $sql = "INSERT INTO penulis (nama_lengkap, username, email, password, bio, role_id, status) VALUES\n";
    $sql .= "('" . addslashes($nama) . "', '" . addslashes($username) . "', '" . addslashes($email) . "', ";
    $sql .= "'" . $hashedPassword . "', '" . addslashes($bio) . "', " . $role_id . ", 'aktif');";
    
    return $sql;
}

// ========================================
// CONTOH PENGGUNAAN
// ========================================

echo "=== PASSWORD GENERATOR UNTUK ADMIN BMKG ===\n\n";

// 1. Generate hash untuk password tertentu
$passwords = [
    'superadmin123',
    'bmkgadmin2024',
    'editor2024',
    'junior2024',
    'moderator2024'
];

echo "1. PASSWORD HASHES:\n";
echo "-------------------\n";
foreach ($passwords as $password) {
    $hash = generatePasswordHash($password);
    echo "Password: $password\n";
    echo "Hash: $hash\n\n";
}

// 2. Generate random passwords
echo "2. RANDOM PASSWORDS:\n";
echo "--------------------\n";
for ($i = 1; $i <= 5; $i++) {
    $randomPassword = generateRandomPassword(12);
    $hash = generatePasswordHash($randomPassword);
    echo "Random Password $i: $randomPassword\n";
    echo "Hash: $hash\n\n";
}

// 3. Generate complete SQL statements
echo "3. SQL INSERT STATEMENTS:\n";
echo "-------------------------\n";

$users = [
    [
        'nama' => 'Super Administrator BMKG',
        'username' => 'superadmin',
        'email' => 'superadmin@bmkg.go.id',
        'password' => 'SuperAdmin2024!',
        'bio' => 'Super Administrator dengan akses penuh sistem',
        'role_id' => 1
    ],
    [
        'nama' => 'Administrator Utama',
        'username' => 'admin_utama',
        'email' => 'admin.utama@bmkg.go.id',
        'password' => 'AdminUtama2024!',
        'bio' => 'Administrator utama sistem berita BMKG',
        'role_id' => 2
    ],
    [
        'nama' => 'Kepala Editor',
        'username' => 'kepala_editor',
        'email' => 'kepala.editor@bmkg.go.id',
        'password' => 'KepalaEditor2024!',
        'bio' => 'Kepala editor bertanggung jawab atas semua konten',
        'role_id' => 3
    ],
    [
        'nama' => 'Editor Gempa',
        'username' => 'editor_gempa',
        'email' => 'editor.gempa@bmkg.go.id',
        'password' => 'EditorGempa2024!',
        'bio' => 'Editor khusus untuk berita gempa bumi dan seismologi',
        'role_id' => 3
    ],
    [
        'nama' => 'Editor Cuaca',
        'username' => 'editor_cuaca',
        'email' => 'editor.cuaca@bmkg.go.id',
        'password' => 'EditorCuaca2024!',
        'bio' => 'Editor khusus untuk berita cuaca dan meteorologi',
        'role_id' => 3
    ]
];

foreach ($users as $user) {
    echo generateUserInsertSQL(
        $user['nama'],
        $user['username'],
        $user['email'],
        $user['password'],
        $user['bio'],
        $user['role_id']
    ) . "\n\n";
}

// 4. Verification test
echo "4. PASSWORD VERIFICATION TEST:\n";
echo "------------------------------\n";
$testPassword = 'SuperAdmin2024!';
$testHash = generatePasswordHash($testPassword);

echo "Original Password: $testPassword\n";
echo "Generated Hash: $testHash\n";
echo "Verification Result: " . (verifyPasswordHash($testPassword, $testHash) ? 'VALID' : 'INVALID') . "\n\n";

// 5. Generate batch users
echo "5. BATCH USER CREATION:\n";
echo "-----------------------\n";

function generateBatchUsers($count = 5, $prefix = 'user') {
    $batchSQL = "-- Batch User Creation\n";
    
    for ($i = 1; $i <= $count; $i++) {
        $username = $prefix . sprintf('%03d', $i);
        $email = $username . '@bmkg.go.id';
        $password = generateRandomPassword(12);
        $nama = 'User ' . sprintf('%03d', $i);
        $bio = 'Auto-generated user account';
        
        $batchSQL .= generateUserInsertSQL($nama, $username, $email, $password, $bio, 4) . "\n";
        $batchSQL .= "-- Username: $username, Password: $password\n\n";
    }
    
    return $batchSQL;
}

echo generateBatchUsers(3, 'staff');

// 6. Password policy checker
echo "6. PASSWORD POLICY CHECKER:\n";
echo "---------------------------\n";

function checkPasswordPolicy($password) {
    $checks = [
        'length' => strlen($password) >= 8,
        'uppercase' => preg_match('/[A-Z]/', $password),
        'lowercase' => preg_match('/[a-z]/', $password),
        'number' => preg_match('/\d/', $password),
        'special' => preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)
    ];
    
    $score = array_sum($checks);
    $strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][$score] ?? 'Very Weak';
    
    return [
        'checks' => $checks,
        'score' => $score,
        'strength' => $strength,
        'valid' => $score >= 4
    ];
}

$testPasswords = [
    'password',
    'Password123',
    'SuperAdmin2024!',
    'Weak1',
    'VeryStrongPassword123!'
];

foreach ($testPasswords as $pwd) {
    $policy = checkPasswordPolicy($pwd);
    echo "Password: $pwd\n";
    echo "Strength: {$policy['strength']} (Score: {$policy['score']}/5)\n";
    echo "Valid: " . ($policy['valid'] ? 'YES' : 'NO') . "\n";
    echo "Details: " . json_encode($policy['checks']) . "\n\n";
}

echo "=== SELESAI ===\n";
echo "Salin hash password yang dihasilkan ke dalam SQL INSERT statements Anda.\n";
echo "PENTING: Simpan password asli di tempat yang aman untuk login pertama!\n";
?>