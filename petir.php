<?php
$conn = mysqli_connect("127.0.0.1", "root", "", "mataram");
$result = mysqli_query($conn, "SELECT * FROM infopetir ORDER BY id DESC LIMIT 1");

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>stageof_mataram</title>
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
                            <li><a href="waktu.php">Tanda Waktu</a></li>                            <li><a href="mitigasi.html">Edukasi Mitigasi</a></li>
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
            <div class="container ">
                <?php while ($row = mysqli_fetch_assoc($result)) : ?>
                    <div class="row justify-content-between" style="margin-top: 50px;">
                        <div class="col-lg-4 d-flex align-items-center justify-content-center about-img">
                            <img src="img/<?= $row["gambar"]; ?>" class="img-fluid" alt="" data-aos="zoom-in">
                        </div>
                        <div class="col-lg-7 pt-5 pt-lg-0">
                            <h3 data-aos="fade-up"><?= $row["judul"]; ?></h3>
                            <p data-aos="fade-up" data-aos-delay="100">
                                <?= $row["narasi"]; ?>
                        </div>
                    </div>
                <?php endwhile; ?>
                <div class="row">
                    <div class="d-flex justify-content-center  align-items-center " style="background-color: bisque; margin: top 50px;">
                        <canvas id="myChart"></canvas>

                    </div>
                </div>
            </div>
        </section>

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
                    <div class="col-lg-6">
                        <div class="footer-top">
                            <div class="col-lg-6 footer-links">
                                <img src="assets/img/logo-bmkg.png" class="img-fluid" style="height: 50px; margin-bottom: 20px;">
                                <h3>Kantor</h3>
                                <p>
                                    Jl. Adi Sucipto No.10, Rembiga, Kec. Selaparang, Kota Mataram<br>
                                </p>
                                <h4>Sosial Media Kami</h4>
                                <p>Dapatkan Informasi Terbaru Dari Sosial Media Kami</p>
                                <div class="social-links mt-3">
                                    <a href="#" class="twitter"><i class="bx bxl-twitter"></i></a>
                                    <a href="#" class="facebook"><i class="bx bxl-facebook"></i></a>
                                    <a href="#" class="instagram"><i class="bx bxl-instagram"></i></a>
                                    <a href="#" class="google-plus"><i class="bx bxl-skype"></i></a>
                                    <a href="#" class="linkedin"><i class="bx bxl-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer><!-- End Footer -->

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
    <script>
        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            labels: 'aaaa',
            data: {
                labels: ['Kab Bima', 'Kab Dompu', 'Kab Lombok Utara', 'Kota Bima', 'Kab Lombok Barat', 'Kab Sumbawa Barat', 'Kab Lombok Tengah', 'Kab Lombok Timur', 'Kota Mataram', 'Kab Sumbawa'],
                datasets: [{
                    <?php foreach ($result as $row) : ?> data: [

                            <?= $row["kabBima"]; ?>, <?= $row["kabDompu"]; ?>, <?= $row["kabLU"]; ?>, <?= $row["bima"]; ?>, <?= $row["kabLobar"]; ?>, <?= $row["kabSumbawaBarat"]; ?>, <?= $row["kabLoteng"]; ?>, <?= $row["kabLotim"]; ?>, <?= $row["mataram"]; ?>, <?= $row["sumbawa"]; ?>
                        ],
                    <?php endforeach; ?>



                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
            },
        });
    </script>
</body>

</html>
