<?php

// Connect to DB
include('connect-db.php');

//function to save new contact
/**
* @param <string> $name //name of the contact
* @param <string> $phone //the telephone number of the contact
*/

function saveContact($name,$phone){
  $sql="INSERT INTO contacts (full_name, phone_number) VALUES ('".$name."','".$phone."');";
  $result=mysql_query($sql)or die(mysql_error());
}

//lets write a function to delete contact
/**
* @param <int> id //the contact id in database we wish to delete
*/
function deleteContact($id){
  $sql="DELETE FROM contacts where id=".$id;
  $result=mysql_query($sql);
}

function editContact($name,$phone,$id) {
  $sql = "UPDATE contacts SET full_name=".$name."WHERE id=".$id;
}

//lets get all the contacts
function getContacts(){
  //execute the sql to get all the contacts in db
  $sql="SELECT * FROM contacts";
  $result=mysql_query($sql);
  //store the contacts in an array of objects
  $contacts=array();
  while($record=mysql_fetch_object($result)){
                array_push($contacts,$record);
  }
  //return the contacts
  return $contacts;
}

//lets handle the Ajax calls now
$action=$_POST['action'];

//the action for now is either add or delete
if ($action=="add")
{
  //get the post variables for the new contact
  $name=$_POST['name'];
  $phone=$_POST['phone'];
  //save the new contact
  saveContact($name,$phone);
  $output['msg']=$name." has been saved.";
  //reload the contacts
  $output['contacts']=getContacts();
  echo json_encode($output);
}

else if ($action=="delete")
{
  //collect the id we wish to delete
  $id=$_POST['id'];
  //delete the contact with that id
  deleteContact($id);
  $output['msg']="Contact deleted.";
  //reload the contacts
  $output['contacts']=getContacts();
  echo json_encode($output);
}

else
{
  $output['contacts']=getContacts();
  $output['msg']="List of all contacts";
  echo json_encode($output);
}

?>
