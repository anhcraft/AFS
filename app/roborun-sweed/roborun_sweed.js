/*! (c) Copyright by Applications for student */
"use strict";

var user = '';

var roborun_sweed = {
    dom: {
        setData: function(n, v) {
            afs.dom.setData('roborun-sweed-' + user + '-' + n, v);
        },
        getData: function(n) {
            return afs.dom.getData('roborun-sweed-' + user + '-' + n);
        }
    },
    run: function() {
        var u = $_GET['user'];
        u = afs.dom.atob(u);
        user = u;

		$(function() {
			var money = 0;
			var hard = 0;
			var runAni = null;
				
		   function play() {
				money = 0;
				var runAniTime = 5;
				var totalWidth = 0;
				var distanceWidth = 0; // metres
				var maxCoins = 10;
				var Browser = navigator.userAgent;
				var startClick = false;
				var keys = {};
				var antiStop = false;

				window.addEventListener("keydown",function(e){
						keys[e.keyCode] = true;
						switch(e.keyCode){
							case 38:
							case 40: e.preventDefault(); break;
							default: break;
						}
					},
				false);

				window.addEventListener('keyup',
					function(e){
						keys[e.keyCode] = false;

					},
				false);

				console.clear();

				if (Browser.indexOf('MSIE') >= 0) {
					maxCoins = 10;
				}  else if (Browser.indexOf('Edge') >= 0) {
					maxCoins = 10;
				} else if (Browser.indexOf('Firefox') >= 0) {
					maxCoins = 8;
				} else if (Browser.indexOf('Chrome') >= 0) {
					maxCoins = 8;
				} else if (Browser.indexOf('Safari') >= 0) {
					maxCoins = 8;
				} else if (Browser.indexOf('Opera') >= 0) {
					maxCoins = 8;
				} else {
					maxCoins = 8;
				}

				var coinsHigh = [10, 60, 110, 160, 210];
				var coinsMargin = 40;
				var coinLastMargin = 80;
				var coinsList = [];
				var up = 1;
				$('.robo').css("margin-top", "-30px");
				
				if(hard == 1){
					runAniTime = 3;
				}
				
				$(window).on("keyup", function(e) {
					if (e.keyCode == 38) {
						 if (up == 4) {
							up = 5;
							$('.robo').css("margin-top", "-230px");
							return false;
						}
						
						 if (up == 3) {
							up = 4;
							$('.robo').css("margin-top", "-180px");
							return false;
						}

						if (up == 2) {
							up = 3;
							$('.robo').css("margin-top", "-130px");
							return false;
						}

						if (up == 1) {
							up = 2;
							$('.robo').css("margin-top", "-80px");
							return false;
						}

						e.preventDefault();
						return false;

					}

					if (e.keyCode == 40) {
						if (up == 2) {
							up = 1;
							$('.robo').css("margin-top", "-30px");
							return false;
						}

						if (up == 3) {
							up = 2;
							$('.robo').css("margin-top", "-80px");
							return false;
						}

						if (up == 4) {
							up = 3;
							$('.robo').css("margin-top", "-130px");
							return false;
						}
						
						if (up == 5) {
							up = 4;
							$('.robo').css("margin-top", "-180px");
							return false;
						}

						e.preventDefault();
						return false;

					}

					e.preventDefault();
					return false;
				});

				function createCoin() {
					coinsList = [];
					$('.coinsArea').html("");
					for (var i = 0; i < maxCoins; i++) {
						var this_coinHigh = Math.floor(Math.random() * 5);
						var this_grobo = Math.floor(Math.random() * 4);
						var coin_High = coinsHigh[this_coinHigh];
						var coinMarginLeft = coinLastMargin + coinsMargin;
						$('.coinsArea').append("<div class='coin grobo-" + this_grobo + "' style='margin-top:-" + coin_High + "px;margin-left:" + coinMarginLeft + "px'></div>");
						coinsList.push({
							ups: this_coinHigh + 1,
							margin: coinMarginLeft,
							grobo: this_grobo
						});

						coinLastMargin = coinMarginLeft;
					}
				}

				function run() {
					createCoin();
					var coinsAt = 0;
					runAni = setInterval(function() {
						for (var i = 0; i < coinsList.length; i++) {
							var e = coinsList[i];
							if (coinsAt !== e.margin) {
								if (e.ups == up && e.margin == distanceWidth + 10) {
									if (e.grobo == 0) {
										money += 1;
										$('.totalCoin').html('$' + money);
										coinsAt += e.margin;
									}

									if (e.grobo == 1 && !antiStop){
										$('.totalCoin').html('$' + money);
										clearInterval(runAni);
										return false;
									}
									
									if (e.grobo == 2) {
										if(0 < money){
											money -= 1;
										}
										$('.totalCoin').html('$' + money);
										coinsAt += e.margin;
									}
									
									if (e.grobo == 3) {
										antiStop = true;
										setInterval(function(){
											antiStop = false;
										}, 5000);
										coinsAt += e.margin;
									}
								}
							}
						}

						$(".totalDistance").html(totalWidth + "m");
						$('.robo').css("margin-left", distanceWidth + "px");
						distanceWidth += 1;
						totalWidth += 1;

						if (distanceWidth == 470) {
							clearInterval(runAni);
							$('.robo').css("margin-left", "0px");
							up = up;
							coinLastMargin = 80;
							distanceWidth = 0;
							run();

						}

					}, runAniTime);
				}
			

				$(".robo").click(function() {
					if (startClick == false) {
						run();
						startClick = true;
					}
				});
			}

			play();
			
			$('.play').click(function(){
				clearInterval(runAni);
				runAni = null;
				$("body").css("background-color","#fff");
				$('.totalCoin').html('$0');
				$('.totalDistance').html('0m');
				$('.game').html('<div class="robo"></div><div class="coinsArea"></div><div class="area"> <div class="dirt">Ấn vào robo để bắt đầu chơi</div></div>');

				play();
			});
			
			$('.mode').click(function(){
				if(hard == 0){
					$(this).css("background-color","#f38888");
					hard = 1;
				} else {
					$(this).css("background-color","#3bb35b");
					hard = 0;
				}
			});
		});
    }
};