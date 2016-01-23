(function () {

	$('.collapsible').collapsible({
	  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});

	$('.modal-trigger').leanModal();

	function timeStamp() {
	// Create a date object with the current time
	  var now = new Date();

	// Create an array with the current month, day and time
	  var date = [ now.getDate(), now.getMonth() + 1, now.getFullYear() ];

	// Create an array with the current hour, minute and second
	  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

	// Determine AM or PM suffix based on the hour
	  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

	// Convert hour from military time
	  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

	// If hour is 0, set it to 12
	  time[0] = time[0] || 12;

	// If seconds and minutes are less than 10, add a zero
	  for ( var i = 1; i < 3; i++ ) {
	    if ( time[i] < 10 ) {
	      time[i] = "0" + time[i];
	    }
	  }

	// Return the formatted string
	  return [date.join("/") , time.join(":") + " " + suffix];
	};

	var toast = {};
	toast.notify = function(msg){
		Materialize.toast(msg, 4000, 'green lighten-1');
	};
	toast.warn = function(msg){

		Materialize.toast(msg, 4000, 'red lighten-1');
	};

	toast.notify('welcome !!');

var getData = function() {
	var lenDenData = {};
	var me = {id:0, name: "satyam"}
	var dena = [];
	var friends = [
		{id: 1, name: 'satyam', mo: 7376867678}
	]

	var denaData = [
		{id:0, uid: 1, date: timeStamp()[0], time: timeStamp()[1], purpose: 'Enjoy it', amount: 0}
	]

	lenDenData.me = me;
	lenDenData.dena = denaData;
	lenDenData.friends = friends;

	if(typeof(Storage) !== "undefined") {
	    // Code for localStorage/sessionStorage.
	  if (localStorage.lenDenData) {
			lenDenData = JSON.parse(window.localStorage.getItem('lenDenData'));
		} else {
			localStorage.setItem('lenDenData', JSON.stringify(lenDenData));
		}
	} else {
	    // Sorry! No Web Storage support..
	}
	return lenDenData;
};


var submitDena = function(uid, purpose, amount, data){
	var dena = data.dena;
	var id = dena.length + 1;

	var formData = {};
	formData.id = id;
	formData.purpose = purpose;
	formData.uid = uid;
	formData.amount = amount;
	formData.date = timeStamp()[0];
	formData.time = timeStamp()[1];

	dena.push(formData);

	localStorage.setItem('lenDenData', JSON.stringify(data));
	//location.reload();
	toast.notify('Dena added succesfully !');
	initlenDen(window.jQuery);
	$('.add-dena-form').hide();
	$('.friend-modal-btn').show();



};

var deleteDena = function(id){
	var data = getData();
	var dena = data.dena;
	var newDena = [];

	dena.map(function(item){
		if (item.id != id) {
			newDena.push(item);
		};
	});

	data.dena = newDena;
	localStorage.setItem('lenDenData', JSON.stringify(data));
	//location.reload();
	toast.warn('Dena deleted succesfully !');
	
	initlenDen(window.jQuery);
	$('.add-dena-form').hide();
	$('.friend-modal-btn').show();	


};



var addFriend = function(name, no, data){

	var friendExists = function(name, no, data){
		var exists = false;
		data.friends.map(function(friend){
			if (friend.name == name) {
				exists = true;
			}	
		});
		return exists;
	};


	var newfriend = {};
	var friends = data.friends;
	var friendExists = friendExists(name, no, data);

	if (!(friendExists)) {
		newfriend.name = name;
		newfriend.mo = no;
		newfriend.id = friends.length + 1;
		friends.push(newfriend);
		localStorage.setItem('lenDenData', JSON.stringify(data));
		toast.notify('You added new friend !');
		initlenDen(window.jQuery);
		$('.add-dena-form').hide();
		$('.friend-modal-btn').show();


	} else {
		toast.warn('You have already added'+ name + 'in your friends');

	};

};


var initlenDen = function ($) {

var data = getData();

var me = data.me;
var friends = data.friends;
var dena = data.dena;


var $addFriendBtn = $('.add-friend-btn');

$addFriendBtn.on('click', function(ev){
	ev.preventDefault();
	friendName = $('.friend-name').val();
	friendMo = $('.friend-no').val();
	
	if (friendName.length > 0) {
		addFriend(friendName, friendMo, data);
		
	};	
});

var $dena = $('.dena');
var totalDena = 0;
dena.map(function(item) {
	totalDena = totalDena + parseInt(item.amount);
});

$('.total-dena').html('Rs. ' + totalDena);

var $denaFrndList = $('.dena-friend-list');
$denaFrndList.empty();

friends.forEach(function(friend){
	var total = 0;
	dena.map(function(item){
		if (item.uid == friend.id) {
			total = total + parseInt(item.amount);
		};
	});
/*
	var msg = 'hey!' + friend.name + ', I am trying to return your Rs. ' + total + ', as soon as posible';
 msg = "hello";*/
	$denaFrndList.append(''
		+ '<li class="dismissable" >'
		  + '<div class="dena-friend collapsible-header hoverable red lighten-5" data-uid="' + friend.id + ' ">'
		  	+ '<i class="fa fa-user grey-text lighten-4"></i>' 
		  	+ friend.name + '<span class="right">' + total + '</span>'
		  	+'<a class=" left whatsapp-link" href="intent://send/'+ parseInt(friend.mo) +'#Intent;scheme=smsto;package=com.whatsapp;action=android.intent.action.SENDTO;end" target="__blank"  ><i class="fa fa-whatsapp green-text"></i></a>' 
		  + '</div>'
      + '<div class="collapsible-body" style="display: none;">'
        + '<ul class="dena-friend-details collection">'
          + '<li>ola ola</li>'
        + '</ul> '
      + '</div>'
    + '</li>')
});

Materialize.showStaggeredList($denaFrndList);

var $denaFriend = $('.dena-friend');

$denaFriend.on('click', function(el){
	el.preventDefault();
	var $this = $(this);
	//$('.friend-modal-btn').toggle();
	//$('.add-dena-form').toggle();
	if ($this.parent().hasClass('active')) {
		$('.add-dena-form').hide();
		$('.friend-modal-btn').show();		
	} else {
		$('.friend-modal-btn').hide();
		$('.add-dena-form').show();
	};
	var uid = $this.data('uid');
	//$('.add-dena-form').data('uid') = uid;
	$('#dena-add').data('uid', uid);
	var $details = $('.dena-friend-details');
	$details.html('');
	var total = 0;
	dena.map(function(item){
		if (item.uid == uid) {
			$details.append('<li class="collection-item grey lighten-3 dena-details" data-id="' + item.id + '"> <div class="left"><small style="margin-right:5px"> ' + item.date + '</small>'
				+ '<small style="margin-right:5px"> ' + /*item.time*/ '</small>' +'</div><span class="center">' + item.purpose + '</span>' 
				+ '<div class=" secondary-content right" ><i class="fa fa-trash grey-text dena-paid" data-id="' + item.id + '"></i></div>' 
				+ '<span class="right" style="margin-right:10px">' + item.amount + '</span>'
				+'</li>');
			total = total + parseInt(item.amount);
		};
		var details = item.uid;
	});
	$details.append(''+
		 '<li class="collection-item">total: '
		 + '<div class="dena-total-paid secondary-content right" data-uid="' + uid + '"><i class="fa fa-trash grey-text"></i></div>' 
		 +'<span class="right red-text lighten-2"  style="margin-right:10px">' + total + '</span>'
		 +'</li>'
		+'');

	var $denaPaid = $('.dena-paid');
	$denaPaid.on('click', function(ev){
		ev.preventDefault();
		var denaId = $(this).data('id');
		deleteDena(denaId);
	});



});

var $whatsappLink = $('.whatsapp-link');
$whatsappLink.on('click', function(ev){
	ev.stopPropagation();
});



var $denaAddBtn = $('#dena-add');
$denaAddBtn.on('click', function(ev){
	ev.preventDefault();
	var $this = $(this);
	var uid = $this.data('uid');
	var $denaAmount = $('#dena-amount');
	var $denaPurpose = $('#dena-purpose');
	var amount = parseInt($denaAmount.val());
	var purpose = 'spends'
	purpose = $denaPurpose.val();
	if (amount > 0 ) {
		submitDena(uid, purpose, amount, data);
	};
});




}


  
initlenDen(window.jQuery);
} ());