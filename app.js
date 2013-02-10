
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
							id: "+7 926 591 65 59",
							img: "data:image/png;base64,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"
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
