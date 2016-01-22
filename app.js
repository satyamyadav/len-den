(function () {

	function timeStamp() {
	// Create a date object with the current time
	  var now = new Date();

	// Create an array with the current month, day and time
	  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

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

	$('.collapsible').collapsible({
	  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});

var getData = function() {
	var lenDenData = {};
	var me = {id:0, name: "satyam"}
	var dena = [];
	var friends = [
		{id: 1, name: 'vishal'},
		{id:2,  name: 'atul'}
	]

	var denaData = [
		{id:0, uid: 1, timestamp: "23/10/2014", purpose: 'ola cab book kiya ', amount: 50},
		{id:1, uid: 2, timestamp: "23/10/2014", purpose: 'break fast ', amount: 20},
		{id:3, uid: 2, timestamp: "23/10/2014", purpose: 'movie ', amount: 200}
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
	console.log(uid, purpose, amount);
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

	console.log('addin data: ', data, dena);
	localStorage.setItem('lenDenData', JSON.stringify(data));
	//location.reload();
	initlenDen(window.jQuery);


};


var initlenDen = function ($) {

var data = getData();

var me = data.me;
var friends = data.friends;
var dena = data.dena;
console.log('aaya  data: ', data, dena, friends, me);

var $dena = $('.dena');
console.log($dena);
var totalDena = 0;
dena.map(function(item) {
	totalDena = totalDena + parseInt(item.amount);
});

$('.total-dena').html('Rs. ' + totalDena);

var $denaFrndList = $('.dena-friend-list');
console.log($denaFrndList);
$denaFrndList.empty();

friends.forEach(function(friend){
	console.log(friend.name);
	var total = 0;
	dena.map(function(item){
		if (item.uid == friend.id) {
			total = total + parseInt(item.amount);
		};
	});
	$denaFrndList.append(''
		+ '<li class="" >'
		  + '<div class="dena-friend collapsible-header hoverable red lighten-5" data-uid="' + friend.id + ' ">'
		  	+ '<i class="fa fa-user"></i>' 
		  	+ friend.name + '<span class="right">' + total + '</span>' 
		  + '</div>'
      + '<div class="collapsible-body" style="display: none;">'
        + '<ul class="dena-friend-details collection">'
          + '<li>ola ola</li>'
        + '</ul> '
        	+'<div class="row">'
        		+'<div class="col s3">'
        			+'<input class="input-field" id="dena-amount' + friend.id +'" placeholder="amount in Rs." type="number"/>'
        		+'</div>'
        		+'<div class="col s7">'
        			+'<input class="input-field" id="dena-purpose' + friend.id + '" placeholder="purpose" type="text" />'
        		+'</div>'
        		+'<div class="col s2">'
        			+'<div class="btn btn-add-dena" id="dena-add' + friend.id + '" data-uid="'+ friend.id +'">Add</div>'
        		+'</div>'
        	+'</div>'
      + '</div>'
    + '</li>')
});

var $denaFriend = $('.dena-friend');

$denaFriend.on('click', function(el){
	el.preventDefault();
	var $this = $(this);
	var uid = $this.data('uid');
	var $details = $('.dena-friend-details');
	$details.html('');
	var total = 0;
	dena.map(function(item){
		console.log(item);
		if (item.uid == uid) {
			console.log('details:', $details);
			$details.append('<li class="collection-item grey lighten-3"> <div class="left"><small style="margin-right:5px"> ' + item.date + '</small>'
				+ '<small style="margin-right:5px"> ' + /*item.time*/ '</small>' +'</div><span class="center">' + item.purpose + '</span><span class="right">' + item.amount + '</span></li>');
			total = total + parseInt(item.amount);
		};
		var details = item.uid;
		console.log(total);
	});
	$details.append(''+
		 '<li class="collection-item">total: <span class="right red-text lighten-2">' + total + '</span></li>'
		+'');

});



$denaAddBtn = $('.btn-add-dena');
$denaAddBtn.on('click', function(ev){
	ev.preventDefault();
	console.log('click');
	var $this = $(this);
	var uid = $this.data('uid');
	var $denaAmount = $('#dena-amount' + uid );
	var $denaPurpose = $('#dena-purpose' + uid );
	var amount = $denaAmount.val();
	var purpose = $denaPurpose = $denaPurpose.val();
	submitDena(uid, purpose, amount, data);
});





}


  
initlenDen(window.jQuery);
} ());