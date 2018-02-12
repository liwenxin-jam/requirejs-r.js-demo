requirejs.config({
	baseUrl: 'js'
});

require(['cookie', 'util'], function(Cookie, Util){
	Cookie.say('hello');
    Util.say('hello');
});