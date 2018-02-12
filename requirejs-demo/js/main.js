// main.js
console.log("加载main.js成功！");

require.config({
	baseUrl: "js/lib",
	paths: {
	   // "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
// 　　　　"jquery": "jquery.min",
// 　　　　"underscore": "underscore.min",
// 　　　　"backbone": "backbone.min"
		  "domReady": "domReady",
		  "text": "../../node_modules/text/text",
		  "math": "../math",
		  "myLib": "../myLib"
　　},
	shim: {
		//每个模块要定义（1）exports值（输出的变量名），表明这个模块外部调用时的名称；（2）deps数组，表明该模块的依赖性。
		// 'underscore': {
		// 	exports: '_'
		// },
		// 'backbone': {
		// 	deps: ['underscore', 'jquery'],
		// 	exports: 'Backbone'
		// },
		// 'jQuery.scroll': {
		// 	deps: ['jquery'],
		// 	exports: 'jQuery.fn.scroll'
		// }
	}
});

//模块加载格式
// require(['moduleA', 'moduleB', 'moduleC'], function(moduleA, moduleB, moduleC) {　　　　 
// 	// some code here
// });

// require(['math'], function(math){
// 	console.log(math.add(1,1));
// });

// require.js还提供一系列插件，实现一些特定的功能。
// domready插件，可以让回调函数在页面DOM结构加载完成后再运行。
// text和image插件，则是允许require.js加载文本和图片文件。npm install requirejs/text
// 类似的插件还有json和mdown，用于加载json文件和markdown文件。
// 插件下载地址： https://github.com/requirejs/requirejs/wiki/Plugins
// 第一种方式
// require(['domReady', 'math'], function (domReady, math) {
//   domReady(function () {
//     //This function is called once the DOM is ready.
//     //It will be safe to query the DOM and manipulate
//     //DOM nodes in this function.
//     console.log(math.add(1,1));
//   });
// });
// 第二种方式
require(['domready!', 'math'], function(doc, math){
	console.log(math.add(1,1));
});

