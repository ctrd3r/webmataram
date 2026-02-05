<?php
require 'function.php';
$id = $_GET["id"];
if (hapus($id) > 0) {
    echo "<script>
             alert('berhasil');
             document.location.href = 'adminhasil.php';
        </script>";
}
if (hapusbuletin($id) > 0) {
    echo "<script>
             alert('berhasil');
             document.location.href = 'adminhasilbuletin.php';
        </script>";
}
if (hapuspetir($id) > 0) {
    echo "<script>
             alert('berhasil');
             document.location.href = 'adminhasilpetir.php';
        </script>";
}
if (hapussejarah($id) > 0) {
    echo "<script>
             alert('berhasil');
             document.location.href = 'adminhasilsejarah.php';
        </script>";
}
if (hapuswaktu($id) > 0) {
    echo "<script>
             alert('berhasil');
             document.location.href = 'adminhasilwaktu.php';
        </script>";
}
