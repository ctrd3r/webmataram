<?php
//error_reporting(0);
require 'function.php';
$conn = mysqli_connect("127.0.0.1", "root", "", "mataram");

//$xmldata = simplexml_load_file("https://bmkg-content-inatews.storage.googleapis.com/live30event.xml") or die("Failed to load");
$req = "https://bmkg-content-inatews.storage.googleapis.com/live30event.xml";
$temp = file_get_contents($req);
$xmldata = simplexml_load_string($temp);
$eventid = $xmldata->gempa[0]->eventid;
$status = $xmldata->gempa[0]->status;
$waktu = $xmldata->gempa[0]->waktu;
$waktu2 = explode(' ', $waktu);
$tgl = $waktu2[0];
$ot = $waktu2[1];
$lat0 = $xmldata->gempa[0]->lintang;
// $lat = explode('-', $lat0)[0];
$long = $xmldata->gempa[0]->bujur;
$waktu = $xmldata->gempa[0]->waktu;
$h = $xmldata->gempa[0]->dalam;
$mag = $xmldata->gempa[0]->mag;
$lok2 = $xmldata->gempa[0]->area;
echo $xmldata;


$parameter1 = "Info Gempa Mag:" . $mag . ' ' . "SR," . ' ' . $tgl . ' ' . $ot . ' ' . "WIB," . ' ' . "Lok:" . $lat0 . ' ' . "LS," . $long . ' ' . "BT" . ' ' . $lok2 . ', Kedlmn:' . $h . ' ' . "Km ::BMKG";

if (($lat0 < -7 && $lat0 > -14) && ($long > 113.5 && $long < 125) && $mag > 2.0) {
  // Use prepared statement to insert parsed XML safely
  $stmt = mysqli_prepare($conn, "INSERT INTO gempanew (tanggal, gempabumi, TIME2, OT, mag, lat, lon, depth, ket) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  if ($stmt) {
    $emptyTime = '';
    mysqli_stmt_bind_param($stmt, 'ssssdddds', $tgl, $parameter1, $emptyTime, $ot, $mag, $lat0, $long, $h, $emptyTime);
    mysqli_stmt_execute($stmt);
    $affected = mysqli_stmt_affected_rows($stmt);
    mysqli_stmt_close($stmt);
    return $affected;
  }
}


?>
<html>

<head>
  <meta http-equiv="refresh" content="5">
  <title>Parsing Data</title>
</head>

<body>
  <table border="1">
    <thead>
      <tr>
        <th>Eventid</th>
        <th>Waktu</th>
        <th>Area</th>
        <th>Magnitudo</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($xmldata as $data) : ?>

        <tr>
          <td><?= $data->eventid ?></td>
          <td><?= $data->waktu ?></td>
          <td><?= $data->area ?></td>
          <td><?= $data->mag ?></td>
        </tr>

      <?php endforeach ?>
    </tbody>
  </table>
</body>

</html>
