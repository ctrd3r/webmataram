<?php
require 'function.php';
$result = mysqli_query($conn, "SELECT * FROM infogempa ORDER BY id DESC LIMIT 1");
$result2 = mysqli_query($conn, "SELECT * FROM gempanew  ORDER BY id DESC LIMIT 1");
$result3 = mysqli_query($conn, "SELECT * FROM kemitraan ORDER BY id DESC LIMIT 3");

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


  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">
  <!-- leafleat -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />
  <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js'></script>
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
  </header><!-- End Header -->

  <!-- ======= Hero Section ======= -->
  <section id="hero" class="d-flex align-items-center">

    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-8 ">
          <h5>Gempa Terkini</h5>
          <div class="box-body">
            <div id="mapid"></div>
          </div>
        </div>
        <div class="col-lg-4 hero-img  ">
          <h5>Gempa Dirasakan</h5>
          <?php while ($row = mysqli_fetch_assoc($result)) : ?>
            <img src="img/<?= $row["gambar"]; ?>" class="img-fluid " alt="" style="width: 200px; height: 250px ; float: left; margin-right: 20px;">
            <div class=" gempabumi-detail " style="font-size: 16px; ">
              <ul class="list-unstyled">
                <li><span class="waktu"><?= $row["waktu"]; ?></li>
                <li><span class="ic magnitude"></span><i class="bi bi-activity" style="float: left; font-size: 20px; margin-right: 20px;"></i>
                  Magnitudo <br><?= $row["magnitudo"]; ?></br>
                </li>
                <li><span class="ic kedalaman"></span><i class="bi bi-activity" style="float: left; font-size: 20px; margin-right: 20px; "></i>
                  Kedalaman <br><?= $row["kedalaman"]; ?></br>
                </li>
                <li><span class="ic koordinat"></span><i class="bi bi-record-circle" style="float: left; font-size: 20px; margin-right: 20px; "></i>
                  Koordinat <br><span><?= $row["koordinat"]; ?></span></br>
                </li>
                <li><span class="ic lokasi"></span><i class="bi bi-geo-alt-fill" style="float: left; font-size: 25px; margin-right: 20px; margin-top:20px "></i>
                  Lokasi <br><span><?= $row["lokasi"]; ?></span></br>
                </li>
                <li><span class="ic dirasakan"></span><i class="bi bi-broadcast" style="float: left; font-size: 20px; margin-right: 20px;"></i>
                  Dirasakan <br><span><?= $row["dirasakan"]; ?></span> </br>
                </li>
                <li><a class="more" href="gempa.php">Selengkapnya →</a></li>
              </ul>
            </div>
          <?php endwhile; ?>
        </div>
      </div>
    </div>

  </section><!-- End Hero -->
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
              Awal mula sejak berdiri pada tahun 1981 Stasiun Geofisika Kelas III Mataram, Nusa Tenggara Barat bernama Stasiun Geofisika Kelas III Kahang Kahang Karangasem yang berada di Banjar Dinas Kahang Kahang
            </p>
            <a class="more" href="sejarah.php">Selengkapnya →</a>
            <div class="row">
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
                <i class="bi bi-file-earmark-text-fill"></i>
                <h4>Visi - Misi</h4>
                <p>Mewujudkan BMKG yang handal, tanggap dan mampu dalam rangka mendukung keselamatan masyarakat serta keberhasilan pembangunan nasional, dan berperan aktif di tingkat Internasional.</p>
                <a class="more" href="sejarah.php">Selengkapnya →</a>
              </div>
              <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
                <i class="bi bi-people"></i>
                <h4>Struktur Organisasi</h4>
                <p>Sejak 4 November 2016, berdasarkan Perka BMKG Nomor 9 Tahun 2016, Stasiun Geofisika Kelas III Kahang Kahang Karangasem berganti nama menjadi Stasiun Geofisika Kelas III Mataram. Saat ini Stasiun Geofisika Kelas III Mataram dipimpin oleh Bapak Ardhianto Septiadhi, S.Si.</p>
                <a class="more" href="sejarah.php">Selengkapnya →</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section><!-- End About Section -->

    <!-- ======= Services Section ======= -->
    <section id="services" class="services section-bg">
      <div class="container" data-aos="fade-up">

        <div class="section-title">
          <h2>Informasi</h2>
          <p>Dapatkan Informasi Terbaru</p>
        </div>

        <div class="row">
          <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
            <div class="icon-box">
              <div class="icon"><i class="bi bi-activity"></i></div>
              <h4 class="title"><a href="gempa.php">Informasi Gempa Bumi</a></h4>
              <p class="description">Dapatkan informasi kejadian gempabumi di wilayah Nusa Tenggara Barat</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="200">
            <div class="icon-box">
              <div class="icon"><i class="bi bi-lightning"></i></div>
              <h4 class="title"><a href="petir.php">Informasi Listrik Udara</a></h4>
              <p class="description">Dapatkan informasi kelistrikan udara di wilayah Nusa Tenggara Barat</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="300">
            <div class="icon-box">
              <div class="icon"><i class="bi bi-calendar-week" style="height: 50px;"></i></div>
              <h4 class="title"><a href="waktu.php">Informasi Tanda Waktu</a></h4>
              <p class="description">Dapatkan informasi terbit terbenam di wilayah Nusa Tenggara Barat</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="400">
            <div class="icon-box">
              <div class="icon"><i class="bx bx-world"></i></div>
              <h4 class="title"><a href="linktr.ee/Stageof_Mataram">Permintaan Data Online</a></h4>
              <p class="description">Menyediakan pelayanan data - data gempabumi dan listrik udara</p>
            </div>
          </div>

        </div>

      </div>
    </section><!-- End Services Section -->
    <!-- awal card slider -->



    <!-- akhir card slider -->

    <!-- carousel awal -->
    <section class="app-donwload">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 img-app">
            <img src="assets/img/first.webp" alt="" class="img-fluid" style="height: 400px; ">
          </div>
          <div class="col-lg-6 deskripsi">
            <h1 style="font-size: 60px; font-weight:700;">Aplikasi <br> Info BMKG</h1>
            <p style="font-size: 20px;">Informasi Cuaca, Iklim, Kualitas Udara, dan Gempabumi di Indonesia dalam Satu Genggaman Aplikasi</p>
            <span><a href="https://play.google.com/store/apps/details?id=com.Info_BMKG" class="btn btn-biru " style="background-color: #54A8C7; color: white;"><i class="bi bi-google-play" style="color: white;"></i> Google Play</a></span>
            <span><a href="https://itunes.apple.com/id/app/id1114372539?l=id" class="btn btn-hijau btn-icon " style="background-color: #45C4A0; color: white;"><i class="bi bi-apple" color: white;></i> App Store</a></span>
          </div>
        </div>
      </div>
    </section>

    <!-- carousel akhir -->

    <!-- ======= Portfolio Section ======= -->
    <section class="pt-5 pb-5">
      <div class="container">
        <div class="row">
          <div class="col-6">
            <h3 class="mb-3">Kegiatan Stasiun Geofisika Mataram </h3>
          </div>
          <div class="col-lg-2 text-right ms-auto">
            <a class="btn btn-primary mb-3 mr-1" href="#carouselExampleIndicators2" role="button" data-bs-slide="prev" data-bs-target="#carouselExampleIndicators2">
              <i class="bi bi-arrow-left"></i>
            </a>
            <a class="btn btn-primary mb-3 " href="#carouselExampleIndicators2" role="button" data-bs-slide="next" data-bs-target="#carouselExampleIndicators2">
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
          <div class="col-12">
            <div id="carouselExampleIndicators2" class="carousel slide" data-ride="carousel">

              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <?php while ($row = mysqli_fetch_assoc($result3)) : ?>
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
                </div>

                <div class="carousel-item">
                  <div class="row">

                    <div class="col-md-4 mb-3">
                      <div class="card">
                        <img class="img-fluid" alt="100%x280" style="height: 273px; width : 418px;" src="img/I2.jpeg">
                        <div class="card-body">
                          <h4 class="card-title">Sabtu, 20 Mei 2023</h4>
                          <p class="card-text">Pengamatan Hilal Awal Bulan Zulkaidah 1444 H di Pantai Loang Baloq, Kota Mataram</p>

                        </div>

                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="card">
                        <img class="img-fluid" alt="100%x280" style="height: 273px; width : 418px;" src="img/I3.jpeg">
                        <div class="card-body">
                          <h4 class="card-title">Sabtu, 20 Mei 2023</h4>
                          <p class="card-text">Preventif Maintance Peralatan WRS New Generation di BPBD Kota Mataram, SAR Mataram, dan RRI Mataram</p>

                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="card">
                        <img class="img-fluid" alt="100%x280" style="height: 273px; width : 418px;" src="img/I4.jpeg">
                        <h4 class="card-title">Rabu, 17 Mei 2023</h4>
                        <p class="card-text">Pemeliharaan dan Pengecekan peralatan Akselerograf SUBE (Sumbawa), BMNI (Bima), dan BNSN (Bima)</p>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
    <!-- End Portfolio Section -->

    <!-- ======= F.A.Q Section ======= -->



    <!-- ======= Clients Section ======= -->
    <!-- End Clients Section -->

    <!-- ======= Contact Us Section ======= -->
    <section id="contact" class="contact">
      <div class="container" data-aos="fade-up">

        <div class="section-title">
          <p>Kritik dan Saran</p>
        </div>

        <div class="row">

          <!-- <div class="col-lg-5 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">
            <div class="info">
              <div class="address">
                <i class="bi bi-geo-alt"></i>
                <h4>Location:</h4>
                <p>A108 Adam Street, New York, NY 535022</p>
              </div>

              <div class="email">
                <i class="bi bi-envelope"></i>
                <h4>Email:</h4>
                <p>info@example.com</p>
              </div>

              <div class="phone">
                <i class="bi bi-phone"></i>
                <h4>Call:</h4>
                <p>+1 5589 55488 55s</p>
              </div>

              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621" frameborder="0" style="border:0; width: 100%; height: 290px;" allowfullscreen></iframe>
            </div>

          </div> -->

          <div class="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="200">
            <form action="forms/contact.php" method="post" role="form" class="php-email-form">
              <div class="row">
                <div class="form-group col-md-6">
                  <label for="name">Nama</label>
                  <input type="text" name="name" class="form-control" id="name" required>
                </div>
                <div class="form-group col-md-6 mt-3 mt-md-0">
                  <label for="name">Email</label>
                  <input type="email" class="form-control" name="email" id="email" required>
                </div>
              </div>
              <div class="form-group mt-3">
                <label for="name">Pesan</label>
                <textarea class="form-control" name="message" rows="10" required></textarea>
              </div>
              <div class="my-3">
                <div class="loading">Loading</div>
                <div class="error-message"></div>
                <div class="sent-message">Your message has been sent. Thank you!</div>
              </div>
              <div class="text-center"><button type="submit">Kirim</button></div>
            </form>
          </div>

        </div>

      </div>
    </section><!-- End Contact Us Section -->
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

  <!-- <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a> -->

  <!-- Vendor JS Files -->
  <script src="assets/vendor/aos/aos.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
  <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>
  <!-- leafleat -->
  <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
  <script>
    var map = L.map('mapid').setView([-8.6, 117], 7);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    <?php foreach ($result2 as $row) : ?>
      L.marker([<?= $row["lat"]; ?>, <?= $row["lon"]; ?>]).addTo(map)
        .bindPopup("<?= $row["gempabumi"]; ?>")
        .openPopup();
    <?php endforeach; ?>
  </script>

  <!--Start of Tawk.to Script-->
  <script type="text/javascript">
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/642511394247f20fefe8c5be/1gsocmj00';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  </script>
  <!--End of Tawk.to Script-->

</body>

</html>