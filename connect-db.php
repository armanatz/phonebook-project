<?php

# Type="MYSQL"
# HTTP="true"

// Configure the database paramaters

$hostname = "localhost";
$db = "phonebook";
$user = "arman";
$pass = "helloworld";

// Connect to the database server
$connection = mysql_pconnect($hostname, $user, $pass)
or trigger_error(mysql_error(),E_USER_ERROR);

// Select the database
mysql_select_db($db)
or die("Database could not be selected");

?>
