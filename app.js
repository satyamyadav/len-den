(function () {

	$('.collapsible').collapsible({
	  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});

	$('.modal-trigger').leanModal();
	
  // Initialize collapse button
  $(".button-collapse").sideNav();

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

	var toast = {

		notify: function(msg){
			$('#notify').html(msg).slideDown();
			setTimeout(function(){
				$('#notify').slideUp();
			}, 4000);
			//return Materialize.toast(msg, 4000, 'green lighten-1');
			
		},
		warn: function(msg){
			$('#warn').html(msg).slideDown();
			setTimeout(function(){
				$('#warn').slideUp();
			}, 4000);
			//return Materialize.toast(msg, 4000, 'red lighten-1');
			
		}
	};


	toast.notify('welcome !!');

	var initStore = function() {
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

	initStore();



var store = {};
store.data = {};
store.load = function(){
	data = JSON.parse(window.localStorage.getItem('lenDenData'));
	store.data = data;
	return data;
}

store.update = function(){
	window.localStorage.removeItem('lenDenData');
	window.localStorage.setItem('lenDenData', JSON.stringify(store.data));

}

store.save = function(key, data){
	store.load();
	var arr = store.data[key];
	console.log(arr, key);
	arr.push(data);
	store.update();
}

store.delete = function(key, id){
	store.load();
	var arr = store.data[key];
	var newArr = [];

	arr.map(function(item){
		if (item.id != id) {
			newArr.push(item);
		};
	});

	store.data[key] = newArr;
	store.update();

};



var initView = function($){
console.log('initView');

	$app = $('.app');
	var type = $app.data('type');

	function appendFriends (){
		store.load();
		var arr = store.data[type];
		console.log(store.data, arr);
		//var friendList = [];
		$('.friend-list').empty();
		var total = 0;
		arr.forEach(function(item){
			store.data.friends.forEach(function(friend){
				if (friend.id == item.uid) {
					console.log(friend.id, item.uid);
					$('li')
					.html('<div class="friend collapsible-header hoverable red lighten-5" data-uid="' + friend.id + ' ">'
							  	+ '<i class="fa fa-user grey-text lighten-4"></i>' 
							  	+ friend.name + '<span class="right">' + total + '</span>'
							  	+'<a class=" left whatsapp-link" href="intent://send/'+ parseInt(friend.mo) +'#Intent;scheme=smsto;package=com.whatsapp;action=android.intent.action.SENDTO;end" target="__blank"  ><i class="fa fa-whatsapp green-text"></i></a>' 
							  + '</div>'
					      + '<div class="collapsible-body" style="display: none;">'
					        + '<ul class="friend-details collection">'
					          + '<li>ola ola</li>'
					        + '</ul> '
					      + '</div>'
					    	)

					.appendTo('.friend-list')

					total = total + parseInt(item.amount);						
				};
			})
		})
	};

	appendFriends();

	function appendDetails (type) {
		$friend = $('.friend');
		$friend.on('click', function(ev){								
			ev.preventDefault();
			$this = $(this);
			var uid = $this.data('uid');
			$('#add-purpose').data('uid', uid);
			var $details = $('.friend-details');
			$details.empty();
			store.load();
			var arr = store.data[type];
			arr.map(function(item){
				if (item.uid == uid) {
					$details.append('<li class="dismissable collection-item grey lighten-3 dena-details" data-id="' + item.id + '"> <div class="left"><small style="margin-right:5px"> ' + item.date + '</small>'
						+ '<small style="margin-right:5px"> ' + /*item.time*/ '</small>' +'</div><span class="center">' + item.purpose + '</span>' 
						+ '<div class=" secondary-content right" ><i class="fa fa-trash grey-text dena-paid" data-id="' + item.id + '"></i></div>' 
						+ '<span class="right" style="margin-right:10px">' + item.amount + '</span>'
						+'</li>');
				};
			});

		})
	}

	appendDetails(type);


	//var friendList = store.data.friends[]


}

initView(jQuery);

} ());





