<?php

// Connect to database
include('connect-db.php');

// Fetch record from database

$output = "";
$table = "contacts";
$sql = mysql_query("SELECT * FROM $table");
$columns_total = mysql_num_fields($sql);

// Get the field name

for ($i = 0; $i < $columns_total; $i++) {
$heading = mysql_field_name($sql, $i);
$output .= '"'.$heading.'",';
}
$output .="\n";

// Get records from the table

while ($row = mysql_fetch_array($sql)) {
for ($i = 0; $i < $columns_total; $i++) {
$output .='"'.$row["$i"].'",';
}
$output .="\n";
}

// Download the file

$filename = "contacts_export.csv";
header('Content-type: application/csv');
header('Content-Disposition: attachment; filename='.$filename);

echo $output;
exit;

?>
