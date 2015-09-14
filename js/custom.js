//global variable to hold client copy of the addresses in the database
var addresslist = '';

//reload the address list using ajax
function displayAddressList(items) {
  //empty the contacts lists
  var list = $('#contactsList');
  //save a client copy of the items array for validation whenever its refreshed from server
  addresslist = items;
  //loop thru all the items and add to the list
  var lh = '';
  for (var i = 0; i < items.length; i++) {
    lh += '<li class="collection-item avatar"><img src="img/no_photo.png" alt="" class="circle"><span class="title"><a href="#" class="name" data-id="' +
      items[i].id + '">' + items[i].full_name + '</a></span>';
    lh += '<p data-id="' + items[i].id + '">' + items[i].phone_number + '</p>';
    lh += '<a href="#deleteId" class="secondary-content deletebtn" contactid="' + items[i].id + '"><i class="material-icons red-text text-darken-1">delete</i></a>';
    lh += '</li>';
  }
  list.html(lh);
  //set the delete button event after every reload
  setDeleteButtonEvents()
}

//function to set the save contact button event
function setSaveButtonEvent() {
  $('#saveContactBtn').click(function (e) {
    e.preventDefault();
    //get the name and phone data
    var name = $('#name').val();
    var phone = $('#phone').val();
    //validate: ensure the name of phone is not empty, the name and phone not in dbase and
    //the name has only text and number has only numbers
    if (name == '' || phone == '') {
      Materialize.toast('The name or phone number cannot be empty', 4000)
    } else {
      //call the ajax save function
      Materialize.toast('Saving...', 2000);
      $.ajax({
        url: 'phonebook.php',
        data: 'action=add&name=' + name + '&phone=' + phone,
        dataType: 'json',
        type: 'post',
        success: function (j) {
          $('#addContactModal').closeModal();
          //show the notice
          Materialize.toast(j.msg, 4000);
          //empty the input fields
          $('#name').val('');
          $('#phone').val('');
          //refresh the address list
          displayAddressList(j.contacts);
        }
      });
    }
  });
}

//function to set all delete button events
function setDeleteButtonEvents() {
  $('.deletebtn').each(function (i) {
    //set the delete event on each delete button
    $(this).click(function () {
      //confirm
      var answer = confirm('Are you sure you\'d like to delete this contact?');
      if (!answer) {
        return;
      }
      //set the delete notice
      Materialize.toast('Deleting...', 4000);
      //get the contactid of the current delete btn
      var id = $(this).attr('contactid');
      //call the ajax deleete function
      $.ajax({
        url: 'phonebook.php',
        data: 'action=delete&id=' + id,
        dataType: 'json',
        type: 'post',
        success: function (j) {
          Materialize.toast(j.msg, 4000)
          //refresh the address list
          displayAddressList(j.contacts);
        }
      });
    });
  });
}

$(document).ready(function () {

  //set all the delete button events
  setDeleteButtonEvents();

  //set the save button event
  setSaveButtonEvent();

  //load the address list now
  //call the ajax save function
  $.ajax({
    url: 'phonebook.php',
    data: '',
    dataType: 'json',
    type: 'post',
    success: function (j) {
      //refresh the address list
      displayAddressList(j.contacts);
    },
  });

    $.fn.editable.defaults.mode = 'inline';

  $('.name').editable({
    defaults: ($.fn.poshytip) ? $.fn.poshytip.defaults : null,
    type: 'text',
    name: 'name',
    pk: function () {
        return $(this).data('id');
    },
    url: 'phonebook.php',
    ajaxOptions: {
      dataType: 'json',
      type: 'post',
    },
    success: function (j) {
      //show the notice
      Materialize.toast(j.msg, 4000);
      //refresh the address list
      displayAddressList(j.contacts);
    }
  });

  $('.tooltipped').tooltip({
    delay: 20
  });

  $('.modal-trigger').leanModal();

  //$('#searchIcon').click(function (e) {
  //  e.preventDefault();
  //
  //  $('.nav-content').addClass('hide');
  //
  //  if ($('#searchBox').hasClass('hide')) {
  //    $('#searchBox').removeClass('hide');
  //    $('#search').focus();
  //  } else {
  //    $('#searchBox').addClass('hide');
  //  }
  //});
  //
  //$('main, footer, #closeSearch').click(function () {
  //  $('#searchBox').addClass('hide');
  //  $('.nav-content').removeClass('hide');
  //});

});
