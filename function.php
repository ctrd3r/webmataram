<?php
$conn = mysqli_connect("127.0.0.1", "root", "", "mataram");

function query($query)
{
    global $conn;
    $result2 = mysqli_query($conn, $query);
    $rows = [];
    while ($row = mysqli_fetch_assoc($result2)) {
        $rows[] = $row;
    }
    return $rows;
}

function registrasi($data)
{
    global $conn;
    $username = strtolower(stripslashes($data["username"]));
    $password = $data["password"];
    $password2 = $data["password2"];

    // cek konfirmasi
    if ($password !== $password2) {
        echo "<script>
            alert('konfirmasi password sesuai');
        </script>";
        return false;
    }

    // enkripsi password
    $password_hashed = password_hash($password, PASSWORD_DEFAULT);

    // tambah ke database using prepared statement (explicit columns)
    $stmt = mysqli_prepare($conn, "INSERT INTO user (username, pasword) VALUES(?, ?)");
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'ss', $username, $password_hashed);
        mysqli_stmt_execute($stmt);
        $affected = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);
        return $affected;
    }

    return false;
}

function tambah($data)
{
    global $conn;
    $waktu = $_POST["waktu"];
    $magnitudo = $_POST["magnitudo"];
    $kedalaman = $_POST["kedalaman"];
    $koordinat = $_POST["koordinat"];
    $lokasi = $_POST["lokasi"];
    $dirasakan = $_POST["dirasakan"];

    // upload gambar
    $gambar = upload();
    if (!$gambar) {
        return false;
    }

    $query = "INSERT INTO infogempa 
                VALUES
                ('', '$waktu', '$magnitudo', '$kedalaman', '$koordinat', '$lokasi', '$dirasakan', '$gambar')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}
function petir($data)
{
    global $conn;
    $judul = $_POST["judul"];
    $kabBima = $_POST["kabBima"];
    $kabDompu = $_POST["kabDompu"];
    $kabLU = $_POST["kabLU"];
    $bima = $_POST["bima"];
    $kabLobar = $_POST["kabLobar"];
    $kabsumbawabarat = $_POST["kabSumbawaBarat"];
    $kabLoteng = $_POST["kabLoteng"];
    $kabLotim = $_POST["kabLotim"];
    $mataram = $_POST["mataram"];
    $sumbawa = $_POST["sumbawa"];
    $narasi = $_POST["narasi"];

    // upload gambar
    $gambar = upload();
    if (!$gambar) {
        return false;
    }

    $query = "INSERT INTO infopetir 
                VALUES
                ('', '$judul', '$kabBima', '$kabDompu', '$kabLU', '$bima', '$kabLobar', '$kabsumbawabarat','$kabLoteng',' $kabLotim','$mataram ','$sumbawa','$gambar','$narasi')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}

function profil($data)
{
    global $conn;
    $nama = $_POST["nama"];
    $jabatan = $_POST["jabatan"];

    // upload gambar
    $gambar = upload();
    if (!$gambar) {
        return false;
    }

    $query = "INSERT INTO kepalastageof 
                VALUES
                ('', '$nama', '$jabatan', '$gambar')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}
function waktu($data)
{
    global $conn;
    $judul = $_POST["judul"];


    // upload gambar
    $gambar = upload();
    if (!$gambar) {
        return false;
    }

    $query = "INSERT INTO waktu
                VALUES
                ('', '$judul', '$gambar')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}
function kemitraan($data)
{
    global $conn;
    $judul = $_POST["judul"];


    // upload gambar
    $gambar = upload();
    if (!$gambar) {
        return false;
    }
    $waktu = $_POST["waktu"];
    $query = "INSERT INTO kemitraan
                VALUES
                ('', '$judul', '$gambar', '$waktu')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}
function buletin($data)
{
    global $conn;
    $judul = $_POST["judul"];
    $kategori = $_POST["kategori"];

    // upload gambar
    $gambar = upload();
    if (!$gambar) {
        return false;
    }
    $dokumen = unggah();
    if (!$dokumen) {
        return false;
    }

    $query = "INSERT INTO buletin 
                VALUES
                ('', '$judul','$kategori','$dokumen', '$gambar')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}
function alat($data)
{
    global $conn;
    $merek = $_POST["merek"];
    $kategori = $_POST["kategori"];
    $lat = $_POST["lat"];
    $long = $_POST["long"];
    $lokasi = $_POST["lokasi"];
    $pemasangan = $_POST["pemasangan"];
    $kategori = $_POST["kategori"];
    $status = $_POST["status"];
    date_default_timezone_set('Asia/Makassar');
    $x =  date('l, d-m-Y  H:i:s ');




    $query = "INSERT INTO alat 
                VALUES
                ('', '$merek', '$lat', '$long', '$lokasi', '$pemasangan', '$kategori', '$status','$x')";
    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}
function upload()
{
    $namaFile = $_FILES['gambar']['name'];
    $ukuranFile = $_FILES['gambar']['size'];
    $error = $_FILES['gambar']['error'];
    $tmpName = $_FILES['gambar']['tmp_name'];
    // cek apakah ada gambar diupload
    if ($error === 4 || !isset($_FILES['gambar'])) {
        return false;
    }

    if (!is_uploaded_file($tmpName)) {
        return false;
    }

    // cek apakah yang diupload gambar (extension + mime)
    $ekstensiGambarValid = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    $ekstensiGambar = strtolower(pathinfo($namaFile, PATHINFO_EXTENSION));
    if (!in_array($ekstensiGambar, $ekstensiGambarValid)) {
        return false;
    }

    // validate mime type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $tmpName);
    finfo_close($finfo);
    $allowed_mimes = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!in_array($mime, $allowed_mimes)) {
        return false;
    }

    // generate secure filename
    try {
        $random = bin2hex(random_bytes(12));
    } catch (Exception $e) {
        $random = uniqid();
    }
    $namaFileBaru = $random . '.' . $ekstensiGambar;

    // ensure upload dir
    $uploadDir = 'uploads/img/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $targetPath = $uploadDir . $namaFileBaru;
    if (move_uploaded_file($tmpName, $targetPath)) {
        chmod($targetPath, 0644);
        // extra check
        if (!getimagesize($targetPath)) {
            unlink($targetPath);
            return false;
        }
        return $namaFileBaru;
    }

    return false;
}
function unggah()
{
    $namaFile = $_FILES['dokumen']['name'];
    $ukuranFile = $_FILES['dokumen']['size'];
    $error = $_FILES['dokumen']['error'];
    $tmpName = $_FILES['dokumen']['tmp_name'];
    // cek apakah ada file diupload
    if ($error === 4 || !isset($_FILES['dokumen'])) {
        return false;
    }

    if (!is_uploaded_file($tmpName)) {
        return false;
    }

    $ekstensiDokumenValid = ['pdf'];
    $ekstensiDokumen = strtolower(pathinfo($namaFile, PATHINFO_EXTENSION));
    if (!in_array($ekstensiDokumen, $ekstensiDokumenValid)) {
        return false;
    }

    // validate mime
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $tmpName);
    finfo_close($finfo);
    if ($mime !== 'application/pdf') {
        return false;
    }

    try {
        $random = bin2hex(random_bytes(12));
    } catch (Exception $e) {
        $random = uniqid();
    }
    $namaFileBaru = $random . '.' . $ekstensiDokumen;

    $uploadDir = 'uploads/dok/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $targetPath = $uploadDir . $namaFileBaru;
    if (move_uploaded_file($tmpName, $targetPath)) {
        chmod($targetPath, 0644);
        return $namaFileBaru;
    }

    return false;
}

function hapus($id)
{
    global $conn;
    mysqli_query($conn, "DELETE FROM infogempa WHERE id = $id");

    return mysqli_affected_rows($conn);
}
function hapusbuletin($id)
{
    global $conn;
    mysqli_query($conn, "DELETE FROM buletin WHERE id = $id");

    return mysqli_affected_rows($conn);
}
function hapuspetir($id)
{
    global $conn;
    mysqli_query($conn, "DELETE FROM infopetir WHERE id = $id");

    return mysqli_affected_rows($conn);
}
function hapussejarah($id)
{
    global $conn;
    mysqli_query($conn, "DELETE FROM kepalastageof WHERE id = $id");

    return mysqli_affected_rows($conn);
}
function hapuswaktu($id)
{
    global $conn;
    mysqli_query($conn, "DELETE FROM waktu WHERE id = $id");

    return mysqli_affected_rows($conn);
}
