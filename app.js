(function () {
  $(".button-collapse").sideNav();
  
	$('.collapsible').collapsible({
	  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});

	$('.modal-trigger').leanModal();
	
  // Initialize collapse button
   // Show sideNav
  //$('.button-collapse').sideNav('show');
  // Hide sideNav
  //$('.button-collapse').sideNav('hide');

  $('.nav-mobile-close').on('click', function(ev){
  	ev.preventDefault();
  	$('.button-collapse').sideNav('hide');
  });

        

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
			 //Materialize.toast(msg, 4000, 'teal lighten-1');
			$('#notify').hide();
			$('#warn').hide();
			$('#notify').html(msg).animate({top: '5', opacity: '1'},500).slideDown();
			setTimeout(function(){
				$('#notify').animate({top: '-50', opacity: '.3'},1000).slideUp();
			}, 3000);

			$('#notify').on('click', function(ev){
				ev.preventDefault();
				$(this).slideUp();
			})
			
		},
		warn: function(msg){
			//Materialize.toast(msg, 4000, 'red lighten-1');
			$('#notify').hide();
			$('#warn').hide();
			$('#warn').html(msg).animate({top: '5', opacity: '1'},500).slideDown();
			setTimeout(function(){
				$('#warn').animate({top: '-50', opacity: '.3'},1000).slideUp();
			}, 3000);
			$('#warn').on('click', function(ev){
				ev.preventDefault();
				$(this).slideUp();
			})
		}
	};


	var auth = function(token){
		var isAuthenticated = false;
	  var lock = new PatternLock('#locked',{
	    onDraw:function(pattern){
	      lock.checkForPattern(token, function(){
	      		isAuthenticated = true;
	          $('#locked').parent().hide();
	          main(jQuery);
	          toast.notify('welcome !!');
	      },function(){
	      		isAuthenticated = false;
	          toast.warn("Pattern is not correct");
	      }); 
	    }
		});

		return isAuthenticated;

	};


	var initStore = function() {
		var lenDenData = {};
		var me = {id:0, name: ""}
		var dena = [];
		var friends = [
			/*{id: 1, name: 'satyam', mo: 7376867678},
			{id: 2, name: 'vishal', mo: 7376867678}*/
		]

		var denaData = [
			/*{id:0, uid: 1, date: timeStamp()[0], time: timeStamp()[1], purpose: 'Enjoy it', amount: 0}*/
		]

		var lenaData = [
		/*	{id:0, uid: 2, date: timeStamp()[0], time: timeStamp()[1], purpose: 'lea re it', amount: 0},
			{id:1, uid: 1, date: timeStamp()[0], time: timeStamp()[1], purpose: 'lea re it', amount: 50},
			{id:1, uid: 2, date: timeStamp()[0], time: timeStamp()[1], purpose: 'lea re it', amount: 50}*/
		]

		lenDenData.me = me;
		lenDenData.dena = denaData;
		lenDenData.lena = lenaData;
		lenDenData.friends = friends;
		lenDenData.token = null;

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
		(arr, key);
		arr.push(data);
		store.update();
	}

	store.delete = function(key, id, all){
		store.load();
		(key, id);
		var arr = store.data[key];
		var newArr = [];

		if (all) {
			arr.map(function(item){
				if (item.uid != id) {
					newArr.push(item);
				};
			});			
		} else {
			arr.map(function(item){
				if (item.id != id) {
					newArr.push(item);
				};
			});
		};

		store.data[key] = newArr;
		store.update();
		toast.notify('your '+ key +' deleted successfuly ')

	};

	var calculateTotal = function(id, type){
		store.load();
		var arr = []; 
		arr = store.data[type];
		(arr);
		var total = 0;
		var frndTotal = 0;
		arr.map(function(item){
			total = total + parseInt(item.amount);
			if (id == item.uid) {
				frndTotal = frndTotal + parseInt(item.amount);
			};
		})
		return {total: total, frndTotal: frndTotal}
	};


	




var main = function($){

		$app = $('#app');
		var type = 'dena';

	function initView (type) {

		$('.grand-total').html('Rs. ' + calculateTotal(null, type).total);

		('initView: type: ', type);
		var theme = '';
		if (type == 'lena') {
			$('nav').addClass('teal darken-1');
			theme = 'teal';
		} else if ($('nav').hasClass('teal darken-1')) {
			$('nav').removeClass('teal darken-1');
			theme = 'red';
		} else{
			theme = 'red';
		};
	
		function appendFriends (){
			store.load();
			var arr = store.data[type];
			(store.data, arr, type);
			//var friendList = [];
			$('.friend-list').empty();
			var total = 0;
				store.data.friends.forEach(function(friend){
						total = calculateTotal(friend.id, type).frndTotal;
						$('<li><div class="waves-effect friend collapsible-header hoverable '+ theme +' lighten-5" data-uid="' + friend.id + ' ">'
										+ '<div class="  left" ><i title="delete '+ friend.name +' from friend list" class="fa fa-trash grey-text delete-frnd" data-uid="' + friend.id + '"></i></div>' 
								  	+ '<i class="fa fa-user grey-text lighten-4"></i>' 
										+ '<div class=" secondary-content right" ><i title="clear all '+ type +' from this friend" class="fa fa-trash grey-text paid-all" data-uid="' + friend.id + '"></i></div>' 
								  	+ friend.name + '<span class="right">' + total + '</span>'

								  	+'<a class=" left whatsapp-link" href="intent://send/'+ parseInt(friend.mo) +'#Intent;scheme=smsto;package=com.whatsapp;action=android.intent.action.SENDTO;end" target="__blank"  ><i class="fa fa-whatsapp green-text"></i></a>' 
								  + '</div>'
						      + '<div class="collapsible-body" style="display: none;">'
						        + '<ul class="friend-details collection">'
						          + '<li>ola ola</li>'
						        + '</ul> '
						      + '</div></li>')

						.appendTo('.friend-list')

				})
			var $whatsappLink = $('.whatsapp-link');
			$whatsappLink.on('click', function(ev){
				ev.stopPropagation();
			});


			var $paidAll = $('.paid-all');
			$paidAll.on('click', function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				var uid = $(this).data('uid');
				if (total > 0) {

					store.delete(type, uid, 'all');
					initView(type);
				} else {
					toast.warn('already cleared');
				};	
			});

			var $delFrnd = $('.delete-frnd');
			$delFrnd.on('click', function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				var uid = $(this).data('uid');
				if (calculateTotal(uid, type).frndTotal == 0) {
					store.delete('friends', uid);
				} else {
					toast.warn('first clear all len-den of this friend' )
				}
				//$(this)('.purpose-details').remove();
				initView(type);
			});

		};

		appendFriends();

		function appendDetails (type) {
			$friend = $('.friend');
			$friend.on('click', function(ev){								
				ev.preventDefault();
				$this = $(this);
				var uid = $this.data('uid');
				$('#add-purpose').data('uid', uid);
				if ($this.parent().hasClass('active')) {
					$('.add-form').hide();
					$('.friend-modal-btn').show();		
				} else {
					$('.friend-modal-btn').hide();
					$('.add-form').show();
				};
				var $details = $('.friend-details');
				$details.empty();
				store.load();
				var arr = store.data[type];
				arr.map(function(item){
					if (item.uid == uid) {
						$details.append('<li class="collection-item grey lighten-3 purpose-details" data-id="' + item.id + '"> <div class="left"><small style="margin-right:5px"> ' + item.date + '</small>'
							+ '<small style="margin-right:5px"> ' + /*item.time*/ '</small>' +'</div><span class="center">' + item.purpose + '</span>' 
							+ '<div class=" secondary-content right" ><i class="fa fa-trash grey-text paid" data-id="' + item.id + '"></i></div>' 
							+ '<span class="right" style="margin-right:10px">' + item.amount + '</span>'
							+'</li>');
					};
				});

			
				var $paid = $('.paid');
				$paid.on('click', function(ev){
					ev.preventDefault();
					('click');
					var id = $(this).data('id');
					store.delete(type, id);
					$(this).parents('.purpose-details').remove();
					initView(type);
				});
			})
		}

		appendDetails(type);

	};

	initView(type);	


	//var friendList = store.data.friends[]

	var $toggleApp = $('.toggle-app');
	$toggleApp.on('click', function(ev){
		ev.preventDefault();
		$this = $(this);
		if ($this.hasClass('lena')) {
			type = 'lena';
			$('.dena').parent().removeClass('active');
			$('.lena').parent().addClass('active');
			$('#app').data('type', 'lena');
			$('.add-form').removeClass('red');
			$('.add-form').addClass('teal');
			$('#add-purpose').removeClass('red');
			$('#add-purpose').addClass('teal');
			initView('lena');
		} else {
			type = 'dena';
			$('.lena').parent().removeClass('active');
			$('.dena').parent().addClass('active');

			$('#app').data('type', 'dena');
			$('.add-form').removeClass('teal');
			$('.add-form').addClass('red');
			$('#add-purpose').removeClass('teal');
			$('#add-purpose').addClass('red');
			initView('dena');
			
		};

	});



	var addFriend = function(name, no){
		store.load();
		var data = store.data;
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
			//friends.push(newfriend);
			//localStorage.setItem('lenDenData', JSON.stringify(data));
			store.save('friends', newfriend);
			initView(type);
			toast.notify('You added new friend !');
			//initlenDen(window.jQuery);
			$('.add-dena-form').hide();
			$('.friend-modal-btn').show();


		} else {
			toast.warn('You have already added  <b><u>'+ name + '</u></b>  in your friend list');

		};

	};



	var submitPurpose = function(uid, purpose, amount, type){
		store.load();
		var pData = store.data[type];
		//var dena = data.dena;
		var id = pData.length + 1;

		var formData = {};
		formData.id = id;
		formData.purpose = purpose;
		formData.uid = uid;
		formData.amount = amount;
		formData.date = timeStamp()[0];
		formData.time = timeStamp()[1];

		store.save(type, formData);

		//localStorage.setItem('lenDenData', JSON.stringify(data));
		//location.reload();
		toast.notify('Dena added succesfully !');
	//	initlenDen(window.jQuery);
		//$('.add-form').hide();
		//$('.friend-modal-btn').show();
		initView(type);


	};



	var $addFriendBtn = $('.add-friend-btn');

	$addFriendBtn.on('click', function(ev){
		ev.preventDefault();
		friendName = $('.friend-name').val();
		friendMo = $('.friend-no').val();
		
		if (friendName.length > 0) {
			addFriend(friendName, friendMo);
			$('.friend-name').val('');
			$('.friend-no').val('');
			
		};	
	});


	var $addBtn = $('#add-purpose');
	$addBtn.on('click', function(ev){
		ev.preventDefault();
		var $this = $(this);
		var uid = $this.data('uid');
		var $amount = $('#amount');
		var $purpose = $('#purpose');
		var amount = parseInt($amount.val());
		var purpose = 'spends'
		purpose = $purpose.val();
		if (amount > 0 ) {
			submitPurpose(uid, purpose, amount, type);
			$purpose.val('');
			$amount.val('');
			//toast.notify('Dena added succesfully !');

		};
	});


	$('.reset-app').on('click', function(ev){
		ev.preventDefault();
		$(this).html('working...');
		localStorage.removeItem('lenDenData');
		window.location.reload();
	});

	$('.lock-app').on('click', function(ev){
		ev.preventDefault();
	  $('#locked').parent().show();

		window.location.reload();
	});




} //main

store.load();
if (store.data.token == null) {
	toast.notify('please set a pattern as lock');
	$('#pattern-msg').html('Please set a pattern as lock'
		+ '<br/> <span> '+ timeStamp()[0] +' <span> <br/><span> '+ timeStamp()[1] +' </span>');
	var lock = new PatternLock('#locked',{
  	onDraw:function(pattern){
  		if (confirm('Are you sure you want to save this pattern')) {
  		    
	  		$('#locked').parent().hide();
	  		main(jQuery);
	  		store.data.token = pattern;
	  		store.update();
  		} else {
  			toast.notify('try again');
  		}
  	}
	});  
} else {
	$('#pattern-msg').html('Draw pattern to unlock'
		+ '<br/> <span> '+ timeStamp()[0] +' <span> <br/><span> '+ timeStamp()[1] +' </span>');
	auth(store.data.token);
	main(jQuery);
}





} ());





