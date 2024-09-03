/**
 * 
 */
$(()=>{
	$.ajax({
		type:'post',
		url:'./data.json',
		
		success: function(result){
			let list = result.list;
			let str = '';
			$.each(list, function(index, item) {
				str += "<div>"
				str += "<img class='mainImage' src='" + item.img + "' />"
				str += "<h3 class='name'>" + item.name + "</h3>"
				str += "<div class='price' style='display: none'>" + item.price + "</div>"
				str += "<div class='address' style='display: none'>" + item.address + "</div>"
				str += "<div class='moredetail' style='display: none'>" + item.moredetail + "</div>"
				str += "<div class='conv'' style='display: none'>" + item.conv + "</div>"
				str += "<div class='line' style='display: none'>" + item.line + "</div>"
				str += "<div class='pie' style='display: none'>" + item.pie + "</div>"
				str += "<div class='bar' style='display: none'>" + item.bar + "</div>"
				str += "</div>";
				if(index==4){
					$("#city").html(str);
				}
			});
			$("#product").html(str);
			
			$('#city').slick({
			  centerMode: true,
			  slidesToShow: 3,
			  variableWidth: true,
			  autoplay: true,
			  autoplaySpeed: 2000,
			  responsive: [
			    {
			      breakpoint: 768,
			      settings: {
			        arrows: false,
			        centerMode: true,
			        slidesToShow: 3
			      }
			    },
			    {
			      breakpoint: 480,
			      settings: {
			        arrows: false,
			        centerMode: true,
			        slidesToShow: 1
			      }
			    }
			  ]
			});
		}
	})
	
	$('#product, #city').on('click', '.mainImage', openDetail);
	
	if(sessionStorage.getItem('userInfo')!=null){
		$('#login-button').html('Logout');
	}
	
	$('#more').on('click', function() {
		if($(this).html()=='더보기'){
			$('#product>div:nth-child(n+7)').css('display','block');
			$(this).html('접기');					
		} else{
			$('#product>div:nth-child(n+7)').css('display','none');
			$(this).html('더보기');
		}
	});
	
	$('#login').on('click', function() {
		if($('#id').val()==""||$('#pwd').val()==""){
			$('#message').html('정보를 다시 입력해주세요');
			$('#messageModal').modal('show');		
		}else{
			let userInfo = {id:$('#id').val(), pass:$('#pwd').val()};
			sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
			$('#login-button').html('Logout');
			$('#message').html('Login Successed!!');
			$('#messageModal').modal('show');
		}
	});
	
	$('#messageModal').on('hidden.bs.modal', function (e) {
	     if($('#message').html()=='정보를 다시 입력해주세요'){
	    	 $('#loginModal').modal('show');
	     }else if($('#message').html()=='예약 날짜를 입력해주세요'){
	    	 $('#detailsModal').modal('show');
	     }else if($('#message').html()=='로그인을 해주세요'){
	    	 $('#loginModal').modal('show');
	     }else if($('#message').html()=='위시리스트에 추가되었습니다.'){
	    	 $('#detailsModal').modal('show');
	     }
	})
	
	$('#mypage-button').on('click', function(){
		if(sessionStorage.getItem('userInfo')==null){
			$('#message').html('로그인을 해주세요');
			$('#messageModal').modal('show');
		}else{
			location.href = 'mypage.html';
		}
	});
	
	$('#login-button').on('click', function(){
		if($(this).html()=='Logout'){
			sessionStorage.removeItem("userInfo");
			$('#message').html('Logout Successed!!');
			$('#messageModal').modal('show');
			$('#login-button').html('Login');
			$('#id').val('');
			$('#pwd').val('');
		}else{
			$('#loginModal').modal('show');
		}
	});
	
	$('#sound-button').on('click', function(){
		if($('#sound-img').attr('src')=='./img/mute.png'){
			$('#background-audio')[0].pause();
			$('#sound-img').attr('src', './img/sound.png');
		}else{
			$('#background-audio')[0].play();
			$('#sound-img').attr('src','./img/mute.png');
		}
	});
	
	function openDetail() {
		let src = $(this).attr('src');
		$('#mainImage img').attr('src', src);
		$('#subImage img:nth-child(1)').attr('src', '.' + src.split('.')[1] + '-1.jpg');
		$('#subImage img:nth-child(2)').attr('src', '.' + src.split('.')[1] + '-2.jpg');
		$('#subImage img:nth-child(3)').attr('src', '.' + src.split('.')[1] + '-3.jpg');
		$('#subImage img:nth-child(4)').attr('src', '.' + src.split('.')[1] + '-4.jpg');
		$('#name').html($(this).siblings('.name').html());
		$('#address').html($(this).siblings('.address').html());
		$('#moredetail').html($(this).siblings('.moredetail').html());
		
		let conv = $(this).siblings('.conv').html().split(',');
		$('#detail .conv').prop('checked', false);
		$.each(conv, function(index, item) {
			$('#detail .conv').each(function() {
				if(item==$(this).val()) $(this).prop('checked', true);
			})
		});
		
		let line = $(this).siblings('.line').html().split(',');
		lineChart.data.datasets[0].data = [parseInt(line[0]),parseInt(line[1]),parseInt(line[2]),parseInt(line[3])];
		lineChart.update();
		
		
		let bar = $(this).siblings('.bar').html().split(',');
		barChart.data.datasets[0].data = [parseInt(bar[0]),parseInt(bar[1]),parseInt(bar[2]),parseInt(bar[3]),parseInt(bar[4]),parseInt(bar[5])];
		barChart.update();
		
		let m = parseFloat($(this).siblings('.pie').html());
		let f = 100 - m;
		google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => drawChart(m, f));

        function drawChart(m, f) {                
            const data = google.visualization.arrayToDataTable([
                ['Gender', 'Percentage'],
                ['M', m],
                ['F', f],
            ]);
            const options = {
                title: '성별간 예약자수',
                width: 300,
                height: 300,
            };
            const chart = new google.visualization.PieChart(document.querySelector('#pie-chart'));
            chart.draw(data, options);
        };
		$('#price').html($(this).siblings('.price').html() + "&#8361;");
		
		$('#detailsModal').modal('show');
	}
	
	
	
	$('#wish').on('click', function() {
		localStorage.setItem('wishList' + '&' + $('#name').html(), $('#mainImage>img').attr('src') + ',' + 
																   $('#address').html() + ',' + 
																   $('#price').html());
		$('#message').html('위시리스트에 추가되었습니다.');
		$('#detailsModal').modal('hide');
		$('#messageModal').modal('show');
	});
	
	$('#reserve').on('click', function() {
		if($('#sDate').val()==''||$('#eDate').val()==''){
			$('#detailsModal').modal('hide');
			$('#message').html('예약 날짜를 입력해주세요');
			$('#messageModal').modal('show');
		}else{
			localStorage.setItem('reserveList' + '&' + $('#name').html(), $('#mainImage>img').attr('src') + ',' + 
																		  $('#address').html() + ',' + 
																		  $('#price').html() + ',' +
																		  $('#sDate').val() + ',' +
																		  $('#eDate').val());	
			$('#message').html('예약이 완료되었습니다.');
			$('#detailsModal').modal('hide');
			$('#messageModal').modal('show');
		}
	});
});	

const lctx = document.querySelector("#line-chart");
const lineChart = new Chart(lctx, {
	type:'line',
	data:{
		labels:['7일', '2주일', '1달', '1달이상'],
		datasets:[
			{
				label:'예약기간 분포도',
				data:[1,2,3,4],
			},
		]
	},
	options:{
		scales:{
			y:{
				min: 0,
				ticks: {
		        	stepSize: 1,
		        }
			}
		},
	}
});

const bctx = document.querySelector("#bar-chart");
const barChart = new Chart(bctx, {
	type:'bar',
	data:{
		labels:['20대', '30대', '40대', '50대', '60대', '70대'],
		datasets:[
			{
				label:'연령대별 방문자수',
				data:[1,2,3,4,5,6],
			},
		]
	},
	options:{
		responsive:false,
		scales:{
			y:{
				min: 0,
				ticks: {
		        	stepSize: 1,
		        }
			}
		}
	}
});