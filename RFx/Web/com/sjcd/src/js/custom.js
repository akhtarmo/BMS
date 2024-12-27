sideMenuMobile();
function sideMenuMobile(){
    $("<div class='side-menu-mobile-btn'><i class='fas fa-align-justify'></i></div>").appendTo("body");
    $("body").on("click",".side-menu-mobile-btn",function(){
        $(".vertical-menu").toggleClass("active");
    });
}
AOS.init();
initDataTable();
	function initDataTable(){
	if($('.DataTable')[0]){
		$(".total-number").text($('.DataTable tbody tr').length);
		$('.DataTable').DataTable({
		paging: false, //make all rows shown..
		});
	}
}

jQuery(function ($) {
	//$('.numbers').countUp();
	if($('.numbers')[0]) $('.numbers').countUp();
	$('#date_from').on("change",function(){
        $(".Procurement-section > .row:nth-child(2) table tbody > tr").hide();
        $(".Procurement-section > .row:nth-child(2) table tbody > tr:nth-child(1)").show();
        $(".Procurement-section > .row:nth-child(2) table tbody > tr:nth-child(2)").show();
        $(".Procurement-section > .row:nth-child(2) table tbody > tr:nth-child(3)").show();
        if($(this).val() === ""){
          $(".Procurement-section > .row:nth-child(2) table tbody > tr").show();
        }
      });
      //
      $('#date_to').on("change",function(){
        $(".Procurement-section > .row:nth-child(2) table tbody > tr").hide();
        $(".Procurement-section > .row:nth-child(2) table tbody > tr:nth-child(3)").show();
        $(".Procurement-section > .row:nth-child(2) table tbody > tr:nth-child(4)").show();
        if($(this).val() === ""){
          $(".Procurement-section > .row:nth-child(2) table tbody > tr").show();
        }
      });

		/*$('.toggle-search').on('click', function () {
			$(this).toggleClass('fa-search fa-times ml-2');
			$('.hidden-search').toggle();
		})*/
		
	//cardEqualHeight();
	/*$(window).resize(function() {
		cardEqualHeight();
	});


	function cardEqualHeight(){
		if($(".section-Procurement .card.special-card")[0]){
			$('.section-Procurement .card').css("height","auto");
			if(!isMob()){
			// console.log("dsa");
			var full_height = $(".section-Procurement > .row").height();
			var max_height = 0;
			var sum_height_special_card = 15;
			var final_max = 0;
			$('.section-Procurement .card').each(function(i){
				if($(this).height() > max_height) max_height = $(this).height();
				if($(this).hasClass("special-card")){
				sum_height_special_card+= $(this).height();
				}
			});
			final_max = max_height;
			if(sum_height_special_card > max_height) final_max = sum_height_special_card;
			$('.section-Procurement .card').css("height",final_max);
			$('.section-Procurement .card.special-card').css("height",(final_max - 15) / 2);
			}
		}
	}*/

  function isMob() {
      return window.innerWidth < 768;
  }
	$("#side-menu >li:not(.menu-title)").on("click",function(){
		if(!$(this).hasClass('has-sub-menu')) {
			$(this).toggleClass("active").siblings().removeClass("active");
			var className= $(this).attr('id');
			$('.main-content >div').hide();
			$('.main-content >div.'+className+'').show()
			$('.has-sub-menu li').each(function(e){
				$(this).removeClass("active")
			})
		} else {
			$(this).toggleClass("active")
		}
	});
	$("#side-menu2 >li").on("click",function(){
		$(this).toggleClass("active").siblings().removeClass("active");
		$(this).parent().parent().siblings().removeClass("active")
		$(this).parent().parent().click();
		var className2= $(this).attr('id');
		$('.main-content >div').hide();
		$('.main-content >div.'+className2+'').show()
	});
	$(".close-menu").on("click",function(){
		$(".vertical-menu").removeClass("active");
		$(".main-content").removeClass("active");
	});
	$(".toggle-mob-menu").on("click",function(){
		$(".vertical-menu").addClass("active");
		$(".main-content").addClass("active");
	});
})

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};
var randomScalingFactor = function() {
	return Math.round(Math.random() * 100);
};
var config = {
	type: 'pie',
	data: {
		datasets: [{
			data: [
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
			],
			backgroundColor: [
				window.chartColors.red,
				window.chartColors.orange,
				window.chartColors.yellow,
				window.chartColors.green,
				window.chartColors.blue,
			],
			label: 'Dataset 1'
		}],
		labels: [
			'طبقة للمخطط',
			'متأخر',
			'ملغي',
			'قيد التحقيق',
			'في خطر'
		]
	},
	options: {
		responsive: true
	}
};
var config2 = {
	type: 'pie',
	data: {
		datasets: [{
			data: [
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
			],
			backgroundColor: [
				window.chartColors.red,
				window.chartColors.orange,
				window.chartColors.yellow,
				window.chartColors.green,
				window.chartColors.blue,
			],
			label: 'Dataset 1'
		}],
		labels: [
			'تكنولجيا المعلومات',
			'ادارة التنفيذ',
			'ادارة التدقيق الداخلي',
			'ادارة الخدمات الادارية',
			'مكتب الرئيس'
		]
	},
	options: {
		responsive: true
	}
};
window.onload = function() {
	var ctx = document.getElementById('chart-area').getContext('2d');
	var ctx2 = document.getElementById('chart-area2').getContext('2d');
	window.myPie = new Chart(ctx, config);
	window.myPie = new Chart(ctx2, config2);
};
document.getElementById('randomizeData').addEventListener('click', function() {
	config.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return randomScalingFactor();
		});
	});
	window.myPie.update();
});
var colorNames = Object.keys(window.chartColors);






var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var config = {
	type: 'line',
	data: {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [{
			label: 'My First dataset',
			backgroundColor: window.chartColors.red,
			borderColor: window.chartColors.red,
			data: [
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor()
			],
			fill: false,
		}, {
			label: 'My Second dataset',
			fill: false,
			backgroundColor: window.chartColors.blue,
			borderColor: window.chartColors.blue,
			data: [
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor(),
				randomScalingFactor()
			],
		}]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Chart.js Line Chart'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Month'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Value'
				}
			}]
		}
	}
};

window.onload = function() {
	var ctx3 = document.getElementById('canvas3').getContext('2d');
	window.myLine = new Chart(ctx3, config3);
};

document.getElementById('randomizeData').addEventListener('click', function() {
	config3.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return randomScalingFactor();
		});

	});

	window.myLine.update();
});

var colorNames = Object.keys(window.chartColors);
document.getElementById('addDataset').addEventListener('click', function() {
	var colorName = colorNames[config3.data.datasets.length % colorNames.length];
	var newColor = window.chartColors[colorName];
	var newDataset = {
		label: 'Dataset ' + config3.data.datasets.length,
		backgroundColor: newColor,
		borderColor: newColor,
		data: [],
		fill: false
	};

	for (var index = 0; index < config3.data.labels.length; ++index) {
		newDataset.data.push(randomScalingFactor());
	}

	config3.data.datasets.push(newDataset);
	window.myLine.update();
});

document.getElementById('addData').addEventListener('click', function() {
	if (config3.data.datasets.length > 0) {
		var month = MONTHS[config3.data.labels.length % MONTHS.length];
		config3.data.labels.push(month);

		config3.data.datasets.forEach(function(dataset) {
			dataset.data.push(randomScalingFactor());
		});

		window.myLine.update();
	}
});

document.getElementById('removeDataset').addEventListener('click', function() {
	config3.data.datasets.splice(0, 1);
	window.myLine.update();
});

document.getElementById('removeData').addEventListener('click', function() {
	config3.data.labels.splice(-1, 1); // remove the label first

	config3.data.datasets.forEach(function(dataset) {
		dataset.data.pop();
	});

	window.myLine.update();
});
