/**
 * 
 */
$(()=>{
	$('#id').attr('value', JSON.parse(sessionStorage.getItem('userInfo')).id);
	
	wishlist();
	reservelist();
	
	$('#wishlist-add').on('click', '.wishlist-cancel', deleteWishlist);
	$('#wishlist-add').on('click', '.reserve-add', reserve);
	$('#reserve-add').on('click', '.reserve-cancel', deleteReservelist);
	
	$('#logout-button').on('click', function(){
		sessionStorage.removeItem("userInfo");
		$('#message').html('Logout Successed!!');
		$('#messageModal').modal('show');
	});
	
	$('#messageModal').on('hidden.bs.modal', function (e) {
		if($('#message').html()=='Logout Successed!!'){
			location.href = 'index.html';					
		}
	})
	
	$('#info-change').on('click', function() {
		if($('#pwd').val()==''||$('#pwd2').val()==''||$('#pwd').val()!=$('#pwd2').val()){
			$('#message').html('정보를 다시 입력해주세요.');
			$('#messageModal').modal('show');
			$('#pwd2').val('');
		}else{
			let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
			userInfo.id = $('#id').val();
			userInfo.pass = $('#pwd').val();
			sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
			$('#message').html('정보 수정에 성공하였습니다.');
			$('#messageModal').modal('show');
			$('#pwd').val('');
			$('#pwd2').val('');
		}
	});
	
	$('#delete').on('click', function() {
		if($(this).attr('name').split('&')[0]=='wishList'){
			localStorage.removeItem($(this).attr('name'));
			wishlist();
			$('#deleteModal').modal('hide');
		}else{
			localStorage.removeItem($(this).attr('name'));
			reservelist();
			$('#deleteModal').modal('hide');
		}
	});
});//ready

function wishlist() {
	var wishlist = "";
	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		if (key.startsWith("wish")) {
			let data = localStorage.getItem(key).split(",");
			let id = key.split("&")
			wishlist += "<div class='wishlist'>";
			wishlist += "<div class='wishlist-item'>";
			wishlist += "<img src='" + data[0] + "'>";
			wishlist += "<div class='wishlist-item-text'>";
			wishlist += "<div class='wishlist-title'>" + id[1] + "</div>";
			wishlist += "<div class='wishlist-location'>" + data[1] + "</div>";
			wishlist += "<div class='wishlist-price'>" + data[2] + "</div>";
			wishlist += "<input type='date' class='wishlist-start-date'> <input type='date' class='wishlist-end-date'>";
			wishlist += "</div>";
			wishlist += "</div>";
			wishlist += "<div class='wishlist-item-icon'>";
			wishlist += "<button class='btn reserve-add' value='" + key + "'><img src='./img/reserve.jpg'></button>";
			wishlist += "<button class='btn wishlist-cancel' value='" + key + "'><img src='./img/cancel.jpg'></button>";
			wishlist += "</div>";
			wishlist += "</div>";
		}
	}
	if(wishlist=="") wishlist = "<h3>위시리스트에 해당하는 숙소가 없습니다.</h3>";
	// 결과를 HTML에 삽입
	$('#wishlist-add').html(wishlist);
}

function reservelist() {
	var reservelist = "";
	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		if (key.startsWith("reserve")) {
			let data = localStorage.getItem(key).split(",");
			let id = key.split("&")
			reservelist += "<div class='reserve'>";
			reservelist += "<div class='reserve-item'>";
			reservelist += "<img src='" + data[0] + "'>";			
			reservelist += "<div class='reserve-item-text'>";
			reservelist += "<div class='reserve-title'>" + id[1] + "</div>";
			reservelist += "<div class='reserve-location'>" + data[1] + "</div>";
			reservelist += "<div class='reserve-price'>" + data[2] + "</div>";
			reservelist += "<div class='reservelist-start-date'> 날짜 : " + data[3] + " ~ " + data[4] + "</div>";
			reservelist += "</div>";
			reservelist += "</div>";
			reservelist += "<div class='reserve-item-icon'>";
			reservelist += "<button class='btn reserve-cancel' value ='" + key + "'><img src='./img/cancel.jpg'></button>";
			reservelist += "</div>";
			reservelist += "</div>";
		}
	}//for
	if(reservelist=="") reservelist = "<h3>예약내역이 없습니다.</h3>";
	$('#reserve-add').html(reservelist);
}//reservelist

function reserve(){
	if($(this).parent().prev().find('.wishlist-start-date').val()==''||$(this).parent().prev().find('.wishlist-end-date').val()==''){
		$('#message').html('예약 날짜를 입력해주세요');
		$('#messageModal').modal('show');
	}else{
		let key = $(this).val();
		let value = localStorage.getItem(key);
		let toReserve = key.replace("wish", "reserve");
		localStorage.setItem(toReserve, value + "," + $(this).parent().prev().find('.wishlist-start-date').val() + "," + $(this).parent().prev().find('.wishlist-end-date').val());

		localStorage.removeItem(key);
		
		wishlist();
		reservelist();
		
		$('#message').html('예약에 성공하였습니다.');
		$('#messageModal').modal('show');
	}
};

function deleteWishlist(){
	$('#delete').attr('name', $(this).val());
	$('#deleteModal').modal('show');
}//deleteWishlist

function deleteReservelist(){
	$('#delete').attr('name', $(this).val());
	$('#deleteModal').modal('show');
}//deleteReservelist