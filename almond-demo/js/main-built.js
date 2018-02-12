(function () {define('cookie',[], function(){
	return {
		say: function(msg){
			console.log("cookie:" + msg);
		}
	};
});
define('util',[], function(){
	return {
		say: function(msg){
			console.log("util:" + msg);
		}
	};
});
//http://www.cnblogs.com/chyingp/p/requirejs-almond-introduction.html
//node r.js -o build.js 
//node r.js -o baseUrl=js name=almond include=main out=js/main-almond-built.js wrap=true optimize=none
//node r.js -o build-almond.js
requirejs.config({
	baseUrl: 'js'
});

require(['cookie', 'util'], function(Cookie, Util){
	Cookie.say('hello');
    Util.say('hello');
});
define("main", function(){});

}());