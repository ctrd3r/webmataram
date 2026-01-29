<?php
require 'function.php';
$result = mysqli_query($conn, "SELECT * FROM kepalastageof ");

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
        <section id="about" class="about">
            <div class="container">

                <div class="row justify-content-between">
                    <div class="col-lg-4 d-flex align-items-center justify-content-center about-img">
                        <img src="assets/img/328159038_128242550167823_6326442750092010507_n.jpg" class="img-fluid" alt="" data-aos="zoom-in">
                    </div>
                    <div class="col-lg-7 pt-5 pt-lg-0">
                        <h3 data-aos="fade-up">Sejarah Stasiun Geofisika Mataram</h3>
                        <p data-aos="fade-up" data-aos-delay="100">
                            Stasiun Geofisika Kelas III Mataram, Nusa Tenggara Barat berada di Jl. Adi Sucipto No. 10. Kelurahan Rembiga, Kecamatan Selaparang, Kota Mataram, Provinsi Nusa Tenggara Barat, dengan koordinat 8.56 Lintang Selatan dan 116.09 Bujur Timur, elevasi setinggi 26 meter di atas permukaan laut.
                            Awal mula sejak berdiri pada tahun 1981 Stasiun Geofisika Kelas III Mataram, Nusa Tenggara Barat bernama Stasiun Geofisika Kelas III Kahang Kahang Karangasem yang berada di Banjar Dinas Kahang Kahang. Desa Kerthamandala, Kecamatan Abang. Kabupaten Karangasem, Provinsi Bali. Stasiun Geofisika Kahang Kahang dibangun setelah terjadi gempabumi di Kahang Kahang pada tanggal 17 Desember 1979 yang mengakibatkan kerusakan cukup luas di wilayah Kahang Kahang. Hingga Saat ini jabatan Kepala Stasiun telah berganti kepemimpinan sebanyak 8 kali
                            Awal berdirinya Stasiun Geofisika Kelas III Kahang Kahang Karangasem dipimpin oleh Bapak Nyoman Padang Selanjutnya berturut-turut dipimpin oleh Bapak Sugiharto, Bapak Dahono, Bapak Hary Setiyono periode tahun 1999 sd. 2008, Bapak Muhammad Chudor, S.T. periode tahun 2008 s.d. 2014, Bapak Tony Agus Wijaya, S.Si periode tahun 2014 s.d. 2015, Bapak Agus Riyanto, S.P., M.M. periode tahun 2015 sd 2019,
                            Pada tahun 2016 Stasiun Geofisika Kelas III Kahang Kahang Karangasem direlokasi ke Mataram, Nusa Tenggara Barat berdasarkan Surat Menteri Pemberdayaan Aparatur Negara dan Reformasi Birokrasi Nomor B/1712/M PAN-RB/05/2016 tanggal 12 Mei 2016 dan Peraturan Kepala Badan Meteorologi, Klimatologi dan Geofisika Nomor 9 tahun 2016.
                            Sejak 4 November 2016, berdasarkan Perka BMKG Nomor 9 Tahun 2016, Stasiun Geofisika Kelas III Kahang Kahang Karangasem berganti nama menjadi Stasiun Geofisika Kelas III Mataram. Saat ini Stasiun Geofisika Kelas III Mataram dipimpin oleh Bapak Ardhianto Septiadhi, S.Si.
                        </p>
                    </div>
                </div>
                <div class="row d-flex align-items-center">
                    <div class="col-lg-12" style="text-align: center;">
                        <h3 data-aos="fade-up">Visi - Misi Stasiun Geofisika Mataram</h3>
                        <h4>Visi</h4>
                        <p>Mewujudkan BMKG yang handal, tanggap dan mampu dalam rangka mendukung keselamatan masyarakat serta keberhasilan pembangunan nasional, dan berperan aktif di tingkat Internasional.
                        </p>
                        <h4>Misi</h4>
                        <p><br>1. Mengamati dan memahami fenomena meteorologi, klimatologi, kualitas udara dan geofisika<br>
                            <br>2. Menyediakan data, informasi dan jasa meteorologi, klimatologi, kualitas udara dan geofisika yang handal dan terpercaya.</br>
                            <br> 3. Mengkoordinasikan dan memfasilitasi kegiatan di bidang meteorologi, klimatologi, kualitas udara dan geofisika </br>
                            <br>4. Berpartisipasi aktif dalam kegiatan internasional di Bidang meteorologi, klimatologi, kualitas udara dan geofisika </br>
                        </p>
                    </div>

                </div>
            </div>
        </section>
        <!-- End About Section -->
        <!-- <section id="clients" class="client section-bg">
            <div class="container" data-aos="fade-up">

                <div class="section-title">
                    <h2>Organisasi</h2>
                </div>

                <div class="clients-slider swiper" data-aos="fade-up" data-aos-delay="100">
                    <div class="swiper-wrapper align-items-center">
                        <?php while ($row = mysqli_fetch_assoc($result)) : ?>
                            <div class="swiper-slide " data-aos="zoom-in" data-aos-delay="100">
                                <div class="member ">
                                    <img src="img/<?= $row["gambar"]; ?>" class="img-fluid" alt="">
                                    <div class="member-info">
                                        <div class="member-info-content">
                                            <h4><?= $row["nama"]; ?></h4>
                                            <span><?= $row["jabatan"]; ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        <?php endwhile; ?>

                        <div class="swiper-slide " data-aos="zoom-in" data-aos-delay="100">
                            <div class="member">
                                <img src="assets/img/team/team-1.jpg" class="img-fluid" alt="">
                                <div class="member-info">
                                    <div class="member-info-content">
                                        <h4>Walter White</h4>
                                        <span>Chief Executive Officer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide " data-aos="zoom-in" data-aos-delay="100">
                            <div class="member">
                                <img src="assets/img/team/team-1.jpg" class="img-fluid" alt="">
                                <div class="member-info">
                                    <div class="member-info-content">
                                        <h4>Walter White</h4>
                                        <span>Chief Executive Officer</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div class="swiper-pagination"></div>
                </div>
        </section> -->

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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Template Main JS File -->
    <script src="assets/js/main.js"></script>
    <!-- leafleat -->
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>

</body>

</html>


