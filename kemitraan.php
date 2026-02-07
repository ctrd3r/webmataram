<?php
require 'function.php';

$jumlahData = count(query("SELECT * FROM kemitraan"));
$jumlahHalaman = ceil($jumlahData / 3);
if (isset($_GET["halaman"])) {
    $halamanAktif = (int) $_GET["halaman"];
} else {
    $halamanAktif = 1;
}
$halamanAktif = max(1, $halamanAktif);
$awalData = (3 * $halamanAktif) - 3;

// Ensure numeric offset to prevent injection via GET
$awalData = (int) $awalData;
$result = mysqli_query($conn, "SELECT * FROM kemitraan ORDER BY id DESC LIMIT $awalData, 3");

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>stageofntb</title>
    <meta content="" name="description">
    <meta content="" name="keywords">

    <!-- Favicons -->


    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,600,600i,700,700i" rel="stylesheet">

    <!-- Vendor CSS Files -->
    <link href="assets/vendor/aos/aos.css" rel="stylesheet">
    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
    <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
    <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

    <!-- Template Main CSS File -->
    <link href="assets/css/style.css" rel="stylesheet">
    <!-- leafleat -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />

    <!-- =======================================================
  * Template Name: Ninestars - v4.10.0
  * Template URL: https://bootstrapmade.com/ninestars-free-bootstrap-3-theme-for-creative/
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
</head>

<body>

    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top d-flex align-items-center">
        <div class="container d-flex align-items-center justify-content-between">

            <div class="logo">
                <a class="navbar-brand" href="index.php">
                    <img src="assets/img/Group 16.png" alt="Bootstrap" width="348" height="80">
                </a>
                <!-- Uncomment below if you prefer to use an image logo -->
                <!-- <a href="index.html"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->
            </div>

            <nav id="navbar" class="navbar">
                <ul>
                    <li class="dropdown"><a href="#"><span>Informasi Geofisika</span> <i class="bi bi-chevron-down"></i></a>
                        <ul>
                            <li><a href="gempa.php">Gempabumi Dirasakan</a></li>
                            <li><a href="petir.php">Petir</a></li>
                            <li><a href="waktu.php">Tanda Waktu</a></li>
                            <li><a href="mitigasi.html">Edukasi Mitigasi</a></li>
                            <li><a href="https://www.bmkg.go.id/gempabumi/antisipasi-gempabumi.bmkg">Antisipasi Gempa Bumi</a></li>
                        </ul>
                    </li>
                    <li class="dropdown"><a href="#"><span>Produk Geofisika</span> <i class="bi bi-chevron-down"></i></a>
                        <ul>
                            <li><a href="buletin.php">Buletin Bulanan</a></li>
                            <li><a href="majalah.php">Majalah Geonews</a></li>
                        </ul>
                    </li>
                    <li class="dropdown"><a href="#"><span>Pojok Geofisika</span> <i class="bi bi-chevron-down"></i></a>
                        <ul>
                            <li><a href="kemitraan.php">Kemitraan</a></li>
                            <li><a href="alat.php">Peralatan Seismik</a></li>
                        </ul>
                    </li>
                    <li><a class="nav-link " href="https://linktr.ee/Stageof_Mataram">Data Online</a></li>
                    <li><a class="nav-link " href="sakip.php">SAKIP</a></li>
                    <!-- <li><a class="getstarted " href="login.php">Login</a></li> -->
                </ul>
                <i class="bi bi-list mobile-nav-toggle"></i>
            </nav><!-- .navbar -->

        </div>
    </header>
    <!-- End Header -->

    <main id="main">

        <!-- ======= About Section ======= -->
        <!-- ======= Portfolio Section ======= -->
        <section id="portfolio" class="portfolio">
            <div class="container" data-aos="fade-up">

                <div class="section-title">
                    <h2>Kegiataan Stasiun Geofisika Mataram</h2>
                    <p></p>
                </div>

                <div class="row">
                    <?php while ($row = mysqli_fetch_assoc($result)) : ?>
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <img class="img-fluid" alt="100%x280" src="img/<?= $row["gambar"]; ?>" style="height: 273px; width : 418px;">
                                <div class="card-body">
                                    <h4 class="card-title"><?= $row["waktu"]; ?></h4>
                                    <p class="card-text"><?= $row["judul"]; ?></p>
                                </div>
                            </div>
                        </div>
                    <?php endwhile; ?>
                </div>

                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <?php for ($i = 1; $i <= $jumlahHalaman; $i++) : ?>
                            <?php if ($i == $halamanAktif) : ?>
                                <li class="page-item active"><a class="page-link" href="?halaman=<?= $i; ?>"><?= $i; ?></a></li>
                            <?php else : ?>
                                <li class="page-item"><a class="page-link" href="?halaman=<?= $i; ?>"><?= $i; ?></a></li>
                            <?php endif; ?>
                        <?php endfor; ?>
                    </ul>
                </nav>

            </div>
        </section><!-- End Portfolio Section -->
        <!-- ======= Services Section ======= -->

        <!-- ======= Portfolio Section ======= -->

        <!-- ======= Clients Section ======= -->
        <!-- End Clients Section -->

        <!-- ======= Contact Us Section ======= -->
        <!-- End Contact Us Section -->

    </main><!-- End #main -->

    <!-- ======= Footer ======= -->
    <footer id="footer">
        <div class="footer-newsletter">
            <div class="container">
                <div class="row justify-content-center">

                </div>
            </div>
        </div>

        <div class="footer-top">
            <div class="container">
                <div class="row">

                    <div class="col-lg-4 col-md-6 footer-contact">
                        <a href=""><img src="assets/img/logo-bmkg.png" alt="" style="height :62px; margin-bottom :30px;"></a>
                        <h3>Kantor</h3>
                        <p>
                            Jl. Adi Sucipto No.10 <br>
                            Rembige, Kec. Selaparang, Kota Mataram<br>
                            Nusa Tenggara Barat <br><br>
                            <strong>Telephone:</strong> +1 5589 55488 55<br>
                            <strong>Email:</strong> stageof.mataram@bmkg.go.id<br>
                        </p>
                    </div>

                    <div class="col-lg-4 col-md-6 footer-links">
                        <h4>Link BMKG</h4>
                        <ul>
                            <li><i class="bx bx-chevron-right"></i> <a href="https://inatews.bmkg.go.id/wrs/index.html">WRS</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="http://202.90.198.40/sismon-wrs/">Sistem Monitoring InaTEWS</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="http://dataonline.bmkg.go.id">Data Online BMKG</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="http://web.meteo.bmkg.go.id">Informasi Cuaca</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="mitigasi.html">Edukasi Mitigasi</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="http://cews.bmkg.go.id">CEWS (Climate Early Warning System)</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-4 col-md-6 footer-links">
                        <h4>Sosial Media Kami</h4>
                        <p>Informasi kami dapat juga diakses melalui media sosial kami</p>
                        <div class="social-links mt-3">
                            <a href="https://twitter.com/stageof_mataram" class="twitter"><i class="bx bxl-twitter"></i></a>
                            <a href="https://www.facebook.com/stasiungeofisika.mataram" class="facebook"><i class="bx bxl-facebook"></i></a>
                            <a href="https://www.instagram.com/infogempa_ntb" class="instagram"><i class="bx bxl-instagram"></i></a>
                            <a href="https://www.youtube.com/@stasiungeofisikamataram7031" class="youtube"><i class="bx bxl-youtube"></i></a>
                            <a href="https://wa.me/6281338099295" class="youtube"><i class="bx bxl-whatsapp"></i></a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </footer>
    <!-- End Footer -->

    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

    <!-- Vendor JS Files -->
    <script src="assets/vendor/aos/aos.js"></script>
    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
    <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
    <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
    <script src="assets/vendor/php-email-form/validate.js"></script>

    <!-- Template Main JS File -->
    <script src="assets/js/main.js"></script>
    <!-- leafleat -->
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>

</body>

</html>


