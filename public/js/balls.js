$(document).ready(function() {

	window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	$.ajax({
		type: "POST",
		url: "/balls",
		async: true,
	})
	.done(function (data) {
		data = jQuery.parseJSON(data);

		var center,
			mouse_down,
			nL = 0,
			loaderView,
			el = document.createElement("canvas");
		
		var CanvasView = Backbone.View.extend({
			initialize: function() {
				var _this = this;
				this.resize();
				this.options.ctx = this.el.getContext("2d");
			},
			resize: function() {
				var w = document.body.clientWidth;//document.getElementById('a').width;
				var h = Math.max(Math.floor(0.9 * window.innerHeight), document.body.clientHeight);
				if(w > h) {
					el.width = h;
					el.height = h;
					
					//$(div_nav).offset({left: (w / 2) - (h / 2), top: 0});
					this.$el.offset({left: (w / 2) - (h / 2), top: 5});
					
					center = {
						r: h / 2,
						x: h / 2,
						y: h / 2
					};
				}
			},
			render: function() {
				this.options.ctx.clearRect(0, 0, this.$el.width(), this.$el.height());
				
				this.collection.where({top: 1})[0].get("view").r_render(this.options.ctx);
				
				var m = this.collection.where({mouse: true}).pop();
				if (m) {
					m.get("view").r_render(this.options.ctx);
				}
			},
			getCursorPosition: function (e) {
				var x, y;
				if (e.pageX || e.pageY) {
					x = e.pageX;
					y = e.pageY;
				} else {
					x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				x = x - this.el.offsetLeft;
				y = y - this.el.offsetTop;
				return {x: x, y: y};
			},
			near: function (x, y, ax, ay, r) {
				if (Math.pow(x - ax, 2) + Math.pow(y - ay, 2) <= Math.pow(r, 2)) {
					return 1;
				} else {
					return 0;
				}
			},
			events: {
				"mouseup": "mouseup",
				"mousedown": "mousedown",
				"mousemove": "mousemove",
				"DOMMouseScroll": "rotate",
				"mousewheel": "rotate",
				"onmousewheel": "rotate"
			},
			mouseup: function (e) {
				var t_mouse_up = new Date;
				if (t_mouse_up - t_mouse_down < 300) {
					//var p = this.getCursorPosition(e);
					var a = this.collection.where({mouse: true});
					if ((a.length > 0) && (a[0].has("link"))) {
						window.location.href = a[0].get("link");
					}
				}
			},
			mousedown: function(e) {
				t_mouse_down = new Date;
			},
			mousemove: function (e) {// should be < 16 ms (now ~4ms)   [ < 1000/60 = 16 ]
				if (this.collection.models.length <= 0) {
					return;
				}
				
				var p = this.getCursorPosition(e),
					collection = this.collection;
				
				if (0 === this.near(p.x, p.y, center.x, center.y, center.r)) {
					//delete "mouse" for all
					async.forEach(
						collection.where({mouse: true}),
						function (m) {
							m.unset("mouse", {silent: true});
							m.get("view").$el.fadeOut();
						},
						null
					);
					// set mouse to top
					collection.where({top: 1})[0].set("mouse", true);//, {silent: true});
					//collection.where({top: 1})[0].center();
				} else {
					if (collection.where({mouse: true}).length <=0) {
						// set mouse to top
						collection.where({top: 1})[0].set("mouse", true);//, {silent: true});
						//collection.where({top: 1})[0].center();
					} else {
						//main logic start
						var model = collection.where({mouse: true})[0],
							find = 0;
						
						if (model.has("childs")) {
							var near = this.near;
							async.forEach(
								model.get("childs"),
								function (id) {
									if (find === 0) {
										var child_model = collection.get(id);
										if (near(p.x, p.y, child_model.get("x"), child_model.get("y"), child_model.get("r"))) {
											//delete "mouse" for all
											async.forEach(
												collection.where({mouse: true}),
												function (m) {
													m.unset("mouse", {silent: true});
													m.get("view").$el.fadeOut();
												},
												null
											);
											//set "mouse" for current child
											child_model.set("mouse", true);//, {silent: true});
											//child_model.center();
											find = 1;// break
											
										}
									}
								},
								null
							);
						}
						if (find === 0) {
							if (0 === this.near(p.x, p.y, model.get("x"), model.get("y"), model.get("r"))) {
								//delete "mouse" for all
								async.forEach(
									collection.where({mouse: true}),
									function (m) {
										m.unset("mouse", {silent: true});
										m.get("view").$el.fadeOut();
									},
									null
								);
								collection.where({top: 1})[0].set("mouse", true, {silent: true});//, {silent: true});
								//collection.where({top: 1})[0].center();
							}
						}
						//main logic end
					}
				}
			},
			rotate: function (e) {
				var evt=window.event || e,
					change = 0,
					collection = this.collection;
				if( (evt.detail? evt.detail*(-120) : evt.wheelDelta) <= -120) {
					change = -1;
				} else {
					change = 1;
				}
				if (change !== 0) {
					async.forEach(
						collection.models,
						function(model) {
							if (model.has("mouse")) {
								if(model.has("childs")) {
									var rotate_angle = change * (2 * Math.PI / model.get("childs").length);
									if (model.has("rotate")) {
										model.set("rotate", model.get("rotate") + rotate_angle, {silent: true});
									} else {
										model.set("rotate", rotate_angle, {silent: true});
									}
								}
							}
						},
						null
					);
				}
			}
		});
		
		var canvasView = new CanvasView({el: el});
	
		var IM = Backbone.Model.extend({});
		
		var CIM = Backbone.Collection.extend({
			model: IM
		});
		
		var BallView= Backbone.View.extend({
			initialize: function() {
				var h3 = document.createElement("h3");
				if (this.model.has("link")) {
					var a = document.createElement("a");
					a.setAttribute("href", this.model.get("link"));
					a.appendChild(document.createTextNode(this.model.get("id")));
					h3.appendChild(a);
				} else {
					h3.appendChild(document.createTextNode(this.model.get("id")));
				}
				var badge = document.createElement("span");
				badge.setAttribute("class", "badge badge-inverse");
				badge.appendChild(h3);
				this.el.appendChild(badge);
				this.el.style.display = 'none';
				document.body.appendChild(this.el);
			},
			render : function(ctx) {
					ctx.beginPath();
					ctx.arc(this.model.get("x"), this.model.get("y"), this.model.get("r"), 0, 2 * Math.PI, false);
					ctx.fillStyle = this.model.get("color");
					ctx.fill();
					ctx.closePath();
					
					if (this.model.has("show_title") || this.model.has("mouse")) {
						if (this.model.has("show_title")) {
							this.$el.offset({
								left: canvasView.$el.offset().left + this.model.get("x") - this.model.get("r"),
								top: canvasView.$el.offset().top + this.model.get("y") + this.model.get("r")
							});
							this.$el.fadeIn();
						}
						
						if (/*(nL === p100) &&*/ this.model.has("img")) {
							var image = cIM.get(this.model.get("img")).get("img");
							var x = 0.5 * Math.sqrt(2) * this.model.get("r");
							var y = (x / image.width) * image.height;
							ctx.drawImage(
								image,
								this.model.get("x") - (x / 2),
								this.model.get("y") - (y / 2),
								x,
								y
							);
						}
					}
					
					if (this.model.has("mouse")) {
						ctx.stroke();
						//document.getElementById('text').appendChild(document.createTextNode(this.model.get("text")));
						//this.$el.offset({
						//	left: canvasView.$el.offset().left + this.model.get("x") + this.model.get("r"),
						//	top: canvasView.$el.offset().top + this.model.get("y")
						//});
						//this.$el.fadeIn();
						
						//if ((nL === p100) && this.model.has("img")) {
						//	var a = 0.5 * Math.sqrt(2) * this.model.get("r");
						//	ctx.drawImage(
						//		cIM.get(this.model.get("img")).get("img"),
						//		this.model.get("x") - (a / 2),
						//		this.model.get("y") - (a / 2),
						//		a,
						//		a
						//	);
						//}
					}
			},
			r_render : function(ctx) {
				var model = this.model;
				if(this.model.get("draw")) {
					this.render(ctx);
					if (model.has("childs")) {
						var childs = model.get("childs");
						async.forEach(
							childs,
							function(id) {
								var child_model = model.collection.get(id);
								child_model.get("view").r_render(ctx);
							},
							null
						);
					}
				}
			}
		});
		
		function ll (fn) {
			setTimeout(fn);
		}
		// using:
		//ll(function () {
		//	
		//});
		
		var NavbarView= Backbone.View.extend({
			initialize: function() {
				this.el.setAttribute("align", "center");
				this.el.style.display = 'none';
				var div_nav = document.createElement("div");
				if ($.browser.mozilla === true) {
					div_nav.setAttribute("align", "left");
				} else {
					div_nav.setAttribute("align", "center");
				}
				div_nav.appendChild(this.options.canvas);
				this.el.appendChild(div_nav);
			},
			events: {
				"DOMMouseScroll": "rotate",
				"mousewheel": "rotate",
				"onmousewheel": "rotate"
			},
			rotate: function (e) {
				canvasView.rotate(e);
			}
		});
		
		var LoaderView= Backbone.View.extend({
			initialize: function() {
				
				
				
				var img1 = document.createElement("img");
				//img1.setAttribute("class", "img-rounded");
				var _el = this.el;
				img1.onload = function () {
					var w = 1 * window.innerWidth;
					var h = 1 * window.innerHeight;
					var x = Math.floor(0.5 * w);
					var y = Math.floor(img1.height * x / img1.width);
					var offx = 0.52 * (w - x);//0.5 - center
					var offy = 0;
					if (h > y) {
						offy = 0.3 * (h - y) ;//0.5 - center
					}
					img1.width = x;
					img1.height = y;
					
					// Loading...
					var p = document.createElement("p");
					p.appendChild(document.createTextNode("Loading..."));
					p.setAttribute("align", "center");
					var r1 = document.createElement("div");
					r1.setAttribute("class", "row");
					r1.appendChild(p);
					_el.insertBefore(r1, _el.getElementsByTagName('div')[0]);
					// image
					var r2 = document.createElement("div");
					r2.setAttribute("class", "row");
					r2.appendChild(img1);
					_el.insertBefore(r2, _el.getElementsByTagName('div')[0]);
					$(img1).offset({left: offx, top: offy});
					// Title: Deep Data
					var h1 = document.createElement("h1");
					h1.style.color = "black";
					h1.appendChild(document.createTextNode("Deep Data"));
					h1.setAttribute("align", "center");
					var r0 = document.createElement("div");
					r0.setAttribute("class", "row");
					r0.appendChild(h1);
					_el.insertBefore(r0, _el.getElementsByTagName('div')[0]);
				};
				img1.src = "/img/DD.png";
				
				this.options.parent.appendChild(this.el);
			}
		});
		
		function LetsStart() {
			loaderView.$el.fadeOut('slow', function() {
				loaderView.remove();
				
				canvasView.collection = c;
				c.where({top: 1})[0].set("mouse", true, {silent: true});
				
				document.body.appendChild(navbarView.el);
				
				var logo = document.createElement("img");
				logo.onload = function () {
					var w = 1 * window.innerWidth;
					var h = 1 * window.innerHeight;
					var x = Math.floor(0.1 * w);
					var y = Math.floor(logo.height * x / logo.width);
					logo.width = x;
					logo.height = y;
					
					$('.logo').append(logo);
					$('.logo').append("Deep Data");
					
					navbarView.$el.fadeIn('slow', function() {
						(function animloop() {
							requestAnimFrame(animloop);
							async.parallel([
								tree(c.where({top: 1})[0]),
								canvasView.render()
							]);
						})();
						// Block start: google-analytics
						var _gaq = _gaq || [];
						_gaq.push(['_setAccount', 'UA-38147981-1']);
						_gaq.push(['_trackPageview']);
						
						(function() {
						var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
						ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
						var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
						})();
						// Block end: google-analytics
						
					});
				};
				logo.src = "/img/DD.png";
				
			});
		}
		
		var ProgressView= Backbone.View.extend({
			initialize: function() {
				var bar = document.createElement("div");
				bar.setAttribute("class", "bar");
				this.el.appendChild(bar);
				
				this.progress(0);
				this.options.parent.appendChild(this.el);
			},
			progress: function(per) {
				this.el.childNodes[0].setAttribute("style", "width: " + per + "%;");
				if (per === 100) {
					setTimeout(function(){return LetsStart();}, 2000);
				}
			}
		});
		
		var Ball = Backbone.Model.extend({
			initialize: function() {
				if (this.has("top")) {
					this.set("x", center.x);
					this.set("y", center.y);
					this.set("r", center.r);
				}
				this.set({view: new BallView({model: this, className: ""})}, {silent: true});
			},
			defaults: {
				"draw": true,
				"alfa": 0
			},
			son : function(r, x, y, n) {
				this.set("to_r", Math.floor(r / n));
				this.set("to_x", x + Math.floor((3 * r / n) * Math.cos(this.get("alfa"))));
				this.set("to_y", y - Math.floor(3 * (r / n) * Math.sin(this.get("alfa"))));
				//this.set("timer", new Date());
				
				if (!this.has("x")) {
					this.set("x", this.get("to_x"));
				}
				if (!this.has("y")) {
					this.set("y", this.get("to_y"));
				}
				if (!this.has("r")) {
					this.set("r", this.get("to_r"));
				}
			},
			center: function() {
				if(this.has("childs")){
					this.set("to_r", center.r);
				} else {
					this.set("to_r", Math.floor(0.5 * center.r));
				}
				this.set("to_x", center.x);
				this.set("to_y", center.y);
				
				
				//this.set("timer", new Date());
			},
			go: function() {
				// t -> ++
				// x0.................x.........................to_x
				// t0..................t1.......................?
				
				// v = 
				
				// f(x) = to_x - x     => 0
				// x = to_x -f(x);
				// f(x)     => to_x
				
				// f1(x) = +- x           with [x0 : f2(x0) = to_x] (lineal depend)
				// f2(x) = +- x*sin(x) with [x0 : f2(x0) = to_x] (not lineal)
				var x = this.get("x");
				var to_x = this.get("to_x");
				var y = this.get("y");
				var to_y = this.get("to_y");
				var r = this.get("r");
				var to_r = this.get("to_r");
				//var t0 = this.get("timer");
				
				if (x < to_x) {
					x++;
					this.set("x", x);
				}
				if (x > to_x) {
					x--;
					this.set("x", x);
				}
				if (y < to_y) {
					y++;
					this.set("y", y);
				}
				if (y > to_y) {
					y--;
					this.set("y", y);
				}
				if (r < to_r) {
					r++;
					
					//var a = this.get("color").split(",");
					//a.pop();
					//a.push((1.2 * r / center.r) + ")");
					//this.set("color", a.join(","), {silent: true});
					
					this.set("r", r);
				}
				if (r > to_r) {
					if (r > 1) {
						r--;
					}
					
					//var alfa = ();// this.get("color").split(",").pop().split("").reverse().join("").substring(1).split("").reverse().join("") ;
					//var a = this.get("color").split(",");
					//a.pop();
					//a.push((1.2 * r / center.r) + ")");
					//this.set("color", a.join(","), {silent: true});
					
					this.set("r", r);
				}
			}
		});
	
		var C = Backbone.Collection.extend({
			model: Ball
		});
	
		var tree = function(model) {
			model.go();
			if (model.has("childs")) {
				var childs = model.get("childs");
				var alfa = 0.4;// random
				if(model.has("rotate")) {
					alfa = model.get("rotate");
				}
				async.forEach(
					childs,
					function(id) {
						var child_model = model.collection.get(id);
						
						alfa = alfa + 2 * Math.PI / childs.length;
						
						child_model.set("alfa", alfa);
						
						if (child_model.has("mouse")) {
							child_model.center();
						} else {
							child_model.son(
								model.get("r"),
								model.get("x"),
								model.get("y"),
								4
							);
						}
						
						if (model.has("mouse")) {
							child_model.set({show_title: true}, {silent: true});
						} else {
							child_model.unset("show_title", {silent: true});
							child_model.get("view").$el.fadeOut('slow');
						}
						
						tree(child_model);
					},
					null
				);
			}
		}
			
		var p100 = 0;
		for (var i = 0; i < data.length; i++) {
			if(data[i].hasOwnProperty("img")) {
				p100++;
			}
		}
		nL = 0;
		
		var c = new C();
		var cIM = new CIM();
		
		
		var navbarView = new NavbarView({className: "navbar navbar-fixed-top", canvas: el});
		var loaderView = new LoaderView({className: "row", parent: document.body});
		var progressView = new ProgressView({className: "row progress progress-striped", parent: loaderView.el});
		
		for (var i = 0; i < data.length; i++) {
			if(data[i].hasOwnProperty("img")) {
				var imgObj = new Image();
				imgObj.onload = function(){
					progressView.progress(Math.round(100 * ++nL / p100));
				};
				imgObj.src = data[i].img;
				var iM = new IM({img: imgObj});
				data[i].img = iM.cid;
				cIM.add(iM);
			}
			c.add(data[i]);
		}
		
		//async.parallel(
		//	[
		//		function(callback) {
		//			loaderView = new LoaderView({className: "progress progress-striped", parent: document.body});
		//			ll(function() {
		//				//while (loaderView.$el.width != "100%") {
		//					loaderView.progress(Math.round(100 * nL / p100));
		//					//loaderView.$el.width = (nL / p100) * 100 + "%";
		//				//}
		//			});
		//			return callback(null, true);
		//		},
		//		function(callback) {
		//			for (var i = 0; i < data.length; i++) {
		//				if(data[i].hasOwnProperty("img")) {
		//					var imgObj = new Image();
		//					imgObj.onload = function(){
		//						nL++;
		//					};
		//					imgObj.src = data[i].img;
		//					var iM = new IM({img: imgObj});
		//					data[i].img = iM.cid;
		//					cIM.add(iM);
		//				}
		//				c.add(data[i]);
		//			}
		//			return callback(null, true);
		//		}
		//	],
		//	function (err, results) {
		//		//results = {loader: true, set_collections: true}
		//		//loaderView.remove();
		//		document.body.appendChild(navbar);
		//		canvasView.collection = c;
		//
		//		(function animloop() {
		//			requestAnimFrame(animloop);
		//			document.body.clientHeight = canvasView.el.width;
		//			async.parallel([
		//				tree(c.where({top: 1})[0]),
		//				canvasView.render()
		//			]);
		//		})();
		//	}
		//);
		
		
		
		
		
	});
});
