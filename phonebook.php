<?php

// Connect to database
include('connect-db.php');

// Function to save new contact
/**
* @param <string> $name // Name of the contact
* @param <string> $phone // The phone number of the contact
*/

function saveContact($name,$phone){
  $sql="INSERT INTO contacts (full_name, phone_number) VALUES ('".$name."','".$phone."');";
  $result=mysql_query($sql)or die(mysql_error());
}

// Function to delete contact
/**
* @param <int> id //the contact ID in database we wish to delete
*/
function deleteContact($id){
  $sql="DELETE FROM contacts where id=".$id;
  $result=mysql_query($sql);
}

// Function to edit contact name
/**
* @param <string> $name // Name of the contact
* @param <int> id // The contact ID in database we wish to delete
*/
function editName($name,$id) {
  $sql = "UPDATE contacts SET
          full_name='".$name."' WHERE id='".$id."'";
  $result=mysql_query($sql)or die(mysql_error());
}

// Function to edit contact phone number
/**
* @param <string> $phone // The phone number of the contact
* @param <int> id // The contact ID in database we wish to delete
*/
function editPhone($phone,$id) {
  $sql = "UPDATE contacts SET
          phone_number='".$phone."' WHERE id='".$id."'";
  $result=mysql_query($sql)or die(mysql_error());
}

// Let's get all the contacts
function getContacts(){
  // Execute the sql to get all the contacts in database
  $sql="SELECT * FROM contacts";
  $result=mysql_query($sql);
  // Store the contacts in an array of objects
  $contacts=array();
  while($record=mysql_fetch_object($result)){
                array_push($contacts,$record);
  }
  // Return the contacts
  return $contacts;
}

// Let's handle the AJAX calls now

$action=$_POST['action'];

if ($action=="add") {
    // Get the post variables for the new contact
    $name=$_POST['name'];
    $phone=$_POST['phone'];
    // Save the new contact
    saveContact($name,$phone);
    $output['msg']=$name." has been saved.";
    // Reload the contacts
    $output['contacts']=getContacts();
    echo json_encode($output);
} else if ($action=="delete") {
    // Collect the ID we wish to delete
    $id=$_POST['id'];
    //delete contact with that ID
    deleteContact($id);
    $output['msg']="Contact deleted.";
    // Reload the contacts
    $output['contacts']=getContacts();
    echo json_encode($output);
} else if ($action=="editName") {
    // Collect the ID we wish to edit
    $id=$_POST['pk'];
    // Get the post variables for the edited name
    $name=$_POST['value'];
    // Update name in database
    editName($name,$id);
    $output['msg']="Contact name updated.";
    echo json_encode($output);
} else if ($action=="editPhone") {
    // Collect the ID we wish to edit
    $id=$_POST['pk'];
    // Get the post variables for the edited phone number
    $phone=$_POST['value'];
    // Update phone number in database
    editPhone($phone,$id);
    $output['msg']="Contact phone number updated.";
    echo json_encode($output);
} else {
    $output['contacts']=getContacts();
    $output['msg']="List of all contacts";
    echo json_encode($output);
}

?>
