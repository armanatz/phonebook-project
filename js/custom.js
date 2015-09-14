// Global variable to hold client copy of the addresses in the database
var addresslist = '';

// Reload the address list using AJAX
function displayAddressList(items) {
  // Empty the contacts lists
  var list = $('#contactsList');
  //save a client copy of the items array for validation whenever its refreshed from server
  addresslist = items;
  // Loop through all the items and add to the list
  var lh = '';
  for (var i = 0; i < items.length; i++) {
    lh += '<li class="collection-item avatar"><img src="img/no_photo.png" alt="" class="circle"><span class="title"><a href="#" class="name" data-id="' +
      items[i].id + '">' + items[i].full_name + '</a></span>';
    lh += '<p><a href="#" class="phone" data-id="' + items[i].id + '">' + items[i].phone_number + '</a></p>';
    lh += '<a href="#" class="secondary-content deletebtn" contactid="' + items[i].id + '"><i class="material-icons red-text text-darken-1">delete</i></a>';
    lh += '</li>';
  }
  list.html(lh);
  // Set the delete button event after every reload
  setDeleteButtonEvents()
}

//function to set the save contact button event
function setSaveButtonEvent() {
  $('#saveContactBtn').click(function (e) {
    e.preventDefault();
    // Get the name and phone data
    var name = $('#name').val();
    var phone = $('#phone').val();
    // Validate: Ensure the name or phone is not empty
    if (name == '' || phone == '') {
      Materialize.toast('The name or phone number cannot be empty', 4000)
    } else {
      // Call the AJAX save function
      Materialize.toast('Saving...', 2000);
      $.ajax({
        url: 'phonebook.php',
        data: 'action=add&name=' + name + '&phone=' + phone,
        dataType: 'json',
        type: 'post',
        success: function (j) {
          $('#addContactModal').closeModal();
          // Show success notice
          Materialize.toast(j.msg, 4000);
          // Empty the input fields
          $('#name').val('');
          $('#phone').val('');
          // Refresh the list and re-initialize X-editable code
          displayAddressList(j.contacts);
          initXeditName();
          initXeditPhone();
        }
      });
    }
  });
}

//function to set all delete button events
function setDeleteButtonEvents() {
  $('.deletebtn').each(function (i) {
    // Set the delete event on each delete button
    $(this).click(function () {
      // Alert for confirmation
      var answer = confirm('Are you sure you\'d like to delete this contact?');
      if (!answer) {
        return;
      }
      // Set the delete notice
      Materialize.toast('Deleting...', 4000);
      // Get the contactid of the current delete button
      var id = $(this).attr('contactid');
      // Call the AJAX delete function
      $.ajax({
        url: 'phonebook.php',
        data: 'action=delete&id=' + id,
        dataType: 'json',
        type: 'post',
        success: function (j) {
          Materialize.toast(j.msg, 4000)
          // Refresh the list and re-initialize X-editable code
          displayAddressList(j.contacts);
          initXeditName();
          initXeditPhone();
        }
      });
    });
  });
}

// X-editable function for inline editing of name
function initXeditName() {
  $('.name').editable({
    type: 'text',
    mode: 'inline',
    showbuttons: false,
    pk: function () {
        return $(this).data('id');
    },
    params: {
      action: 'editName',
    },
    url: 'phonebook.php',
    ajaxOptions: {
      dataType: 'json',
    },
    success: function (j) {
      // Show success notice
      Materialize.toast(j.msg, 4000);
    }
  });
}

// X-editable function for inline editing of phone number
function initXeditPhone() {
  $('.phone').editable({
    type: 'text',
    mode: 'inline',
    showbuttons: false,
    pk: function () {
        return $(this).data('id');
    },
    params: {
      action: 'editPhone',
    },
    url: 'phonebook.php',
    ajaxOptions: {
      dataType: 'json',
    },
    success: function (j) {
      // Show success notice
      Materialize.toast(j.msg, 4000);
    }
  });
}

$(document).ready(function () {

  // Set all the delete button events
  setDeleteButtonEvents();

  // Set the save button event
  setSaveButtonEvent();

  // Load the address list now
  // Call the AJAX save function
  $.ajax({
    url: 'phonebook.php',
    data: '',
    dataType: 'json',
    type: 'post',
    success: function (j) {
      // Refresh the list and re-initialize X-editable code
      displayAddressList(j.contacts);
      initXeditName();
      initXeditPhone();
    },
  });

  // Initialize tooltips for FAB
  $('.tooltipped').tooltip({
    delay: 20
  });

  // Initialize add contact modal
  $('.modal-trigger').leanModal();

});
