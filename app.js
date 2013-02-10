
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var i, 
	a = new Array();
	


var j = {
	top: 1,
	id: "Balls",
	text: "Hi and welcome!",
	img: "http://www.freestockphotos.biz/pictures/11/11394/cherries.png",
	childs: [
		{
			id: "About this site",
			text: "Used only Backbone.js and Canvas",
			img: "http://img-fotki.yandex.ru/get/5630/19948730.6/0_7e11b_e1bbdffc_orig",
			childs: [
				{
					id: "other libs",
					text: "Look at <script src=\"...\"></script>",
					childs: [
						{
							id: "jquery",
							text: "http://jquery.com"
						},
						{
							id: "underscore.js",
							text: "http://underscore.js"
						},
						{
							id: "async.js",
							text: "http://async.js"
						},
						{
							id: "Twiter BootStrap",
							text: "Twiter BootStrap"
						}
					]
				},
				{
					id: "server side",
					childs: [
						{
							id: "Free hosting AppFog.com",
							img: "https://www.appfog.com/img/app-fog.png",
							link: "http://appfog.com"
						},
						{
							id: "node.js",
							text: "async server",
							childs: [
								{
									id: "What's doing on server side",
									childs: [
										{
											id: "Set colors for todos balls",
										},
										{
											id: "Convert data from hash to array"
										}
									]
								}
							]
						},
						{
							id: "javascript",
							text: "json anywhere"
						}
					]
				}
			]
		},
		{
			id: "backbone.js",
			text: "This is MV* framework",
			img: "http://png-3.findicons.com/files/icons/1182/quickpix_2009/128/mad_tea_party.png",
			childs: [
				{
					id: "model",
					text: "{x: 23, y: 423, r: 51, ...} is a model"
					//childs: [
					//	"model",
					//	"view"
					//],
				},
				{
					id: "view",
					text: "Drawing a ball is a view of model"
					//childs: [
					//	"model",
					//	"view"
					//],
				},
				{
					id: "events",
					text: "You can control mouse and wheel",
					childs: [
						{
							id: "mousemove",
							text: "No clicks - no content change"
						},
						{
							id: "mousewheel",
							text: "is usefull"
						}
					]
				}
			]
		},
		{
			id: "canvas",
			text: "This site has canvas element",
			link: "http://localhost:3000",
			img: "http://www.woodcoon.ru/index_files/heart.png",
			childs: [
				{
					id: "There are many other ways to show data",
					childs: [
						{
							id: "SVG",
							childs: [
								{
									id: "d3js.org - is good way to use SVG",
									link: "http://d3js.org",
									childs: [
										{
											id: "Gallery",
											link: "https://github.com/mbostock/d3/wiki/Gallery"
										}
									]
								}
							]
						},
						{
							id: "CSS animation"
						},
						{
							id: "Flash"
						}
					]
				},
				{
					id: "Canvas is good & less code",//not only div's for content",
					text: "",
					childs: [
						{
							id: "this site have 1 canvas element"
						},
						{
							id: "each one model has function render for draw round at canvas"
						}
					]
				}
			]
		},
		{
			id: "Contacts",
			text: "Going to see my perfil",
			img: "http://img-fotki.yandex.ru/get/6438/19948730.6/0_7e11a_721dc10d_orig",
			childs: [
				{
					id: "Perfiles",
					childs: [
						{
							id: "LinkedIn.com",
							img: "http://s.c.lnkd.licdn.com/scds/common/u/img/logos/LinkedIn_logo_white_92x22_v2.png",
							link: "http://es.linkedin.com/in/spirinvladimir/"
						},
						{
							id: "InfoJosbs.es",
							img: "https://media.infojobs.net/portales/ij/app/backgrounds/bg-header-logo.png",
							link: "http://www.infojobs.net/vladimir-spirin.prf"
						},
						{
							id: "tecnoempleo.com",
							img: "https://www.tecnoempleo.com/graficos/logo_encabezado4.png",
							link: "http://www.tecnoempleo.com/vladimir-spirin.mpt"
						}
					]
				},
				{
					id: "e-mail",
					text: "",
					img: "http://noscope.com/photostream/albums/various/gmail_logo.png",
					childs: [
						{
							id: "spirin.vladimir@gmail.com",
							img: "http://img-fotki.yandex.ru/get/6437/19948730.6/0_7e119_b3ffcd0a_orig"
						}
					]
				},
				{
					id: "telefon",
					img: "http://www.clker.com/cliparts/0/f/c/2/1195445181899094722molumen_phone_icon.svg.med.png",
					text: "+34 691 296 658",
					childs: [
						{
							id: "+34 691 296 658",
							img: "http://ospportal.orange.es/static/comun/img/logo.png"
						},
						{
							id: "+7 926 591 65 59"
						}
					]
				},
				{
					id: "full name",
					img: "http://www.digitalbookworld.com/wp-content/uploads/hello-my-name-is.jpg",
					text: "Spirin Vladimir Andreevich",
					childs: [
						{
							id: "Spirin",
							text: "Spirin"
						},
						{
							id: "Vladimir",
							text: "Vladimir"
						},
						{
							id: "Andreevich",
							text: "Andreevich"
						}
					]
				}
			]
		},
		{
			id: "Language",
			text: "Select Language",
			img: "http://icons.iconarchive.com/icons/shiftercat/rose/128/Wild-Rose-White-2-icon.png",
			childs: [
				{
					id: "English",
					text: "All in english, as you see :)",
					img: "http://img-fotki.yandex.ru/get/4133/19948730.6/0_7cb87_1fd74c10_orig"
				},
				{
					id: "Spanish",
					text: "Voy a traducir",
					img: "http://img-fotki.yandex.ru/get/4126/19948730.6/0_7cb88_3c9f1631_orig"
				},
				{
					id: "Russian",
					text: "Russian",
					img: "http://img-fotki.yandex.ru/get/4116/19948730.6/0_7cb89_52d1e3f7_orig"
				}
			]
		},
		{
			id: "others projects",
			link: "http://frogsballs.eu01.aws.af.cm/",
			img: "http://ocpsoft.org/wp-content/uploads/2013/01/javascript_logo_unofficial-300x300.png",
			childs: [
				{
					id: "Async table",
					link: "http://frogsballs.eu01.aws.af.cm/"
				},
				{
					id: "Game FrogsBalls",
					link: "http://frogsballs.eu01.aws.af.cm/frogs_balls.html",
					childs: [
						{
							id: "play online",
							link: "http://frogsballs.eu01.aws.af.cm/frogs_balls.html"
						},
						{
							id: "Download for Android (*.apk)",
							link: "http://frogsballs.eu01.aws.af.cm/frogs_balls.apk",
							img: "http://www.android.com/images/logo.png"
						}
					]
				},
				{
					id: "spirintravels.com",
					link: "http://spirintravels.com",
					childs: [
						{
							id: "About http://spirintravels.com"
						},
						{
							id: "Blog",
							link: "http://spirintravels.com/blog",
							childs: [
								{
									id: "Junio",
									link: "http://spirintravels.com/blogjunio"
								},
								{
									id: "Julio",
									link: "http://spirintravels.com/blogjulio"
								},
								{
									id: "Agosto",
									link: "http://spirintravels.com/blogagosto"
								},
								{
									id: "Septiembre",
									link: "http://spirintravels.com/blogseptiembre"
								},
								{
									id: "Octubre",
									link: "http://spirintravels.com/blogoctubre"
								},
								{
									id: "Noviembre",
									link: "http://spirintravels.com/blognoviembre"
								},
								{
									id: "Diciembre",
									link: "http://spirintravels.com/blogdiciembre"
								}
							]
						}
					]
				}
			]
		}
	]
};



		
(function json2a(j) {
	var el = {};
	if (j.hasOwnProperty('id')) {el.id = j.id;}
	//if (j.hasOwnProperty('text')) {el.text = j.text;}
	if (j.hasOwnProperty('link')) {el.link = j.link;}
	if (j.hasOwnProperty('img')) {el.img = j.img;}
	if ((j.hasOwnProperty('id')) && (j.id === 'Balls')) {el.top = 1;}
	if (j.hasOwnProperty('childs')) {
		var childs = new Array();
		for (var i=0; i < j.childs.length; i++) {
			childs.push(j.childs[i].id);
			json2a(j.childs[i]);
		}
		el.childs = childs;
	}
	a.push(el);
})(j);

//var colors = new Array('red','green','blue','yellow','purple','grey');
var colors = new Array('rgba(255,0,0,0.2)','rgba(0,255,0,0.2)','rgba(0,0,255,0.2)','rgba(0,255,255,0.2)','rgba(255,0,255,0.2)','rgba(255,255,0,0.2)');

function set_color_for_childs(model) {
	if( model.hasOwnProperty("childs") && model.childs.length > 0) {
		var color = 0;
		model.childs.forEach(function(child_id) {
			for(var k=0; k < a.length; k++) {
				if (a[k].id === child_id) {
					if(colors[color % colors.length] === model.color) {
						color++;
					}
					a[k].color = colors[color % colors.length];
					color++;
					set_color_for_childs(a[k]);
				}
			}
		});
	}
};

a.forEach(function(model) {
	if(model.hasOwnProperty("top")) {
		model.color = colors[0];
		set_color_for_childs(model);
	}
});

app.configure(function(){
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/balls', function (req, res) {
	res.contentType('json');
	res.json(JSON.stringify(a));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
