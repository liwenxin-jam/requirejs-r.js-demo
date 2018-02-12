---
title:  require.js和r.js使用小结
author: 黎文欣
tags: 工具
categories:
  - requirejs
blogexcerpt: 文字摘要
date: 2017-04-25 21:34:12
thumbnail:
---
这是一个基于require.js和r.js实现图片异步加载模块和合并打包js的测试项目。一开始会先给大家介绍一下require.js的简单用法，其它再对拿almond对比来实现r.js打包合并js文件。

- 最早的时候，所有Javascript代码都写在一个文件里面，只要加载这一个文件就够了。后来，代码越来越多，一个文件不够了，必须分成多个文件，依次加载。使用require.js可以实现js文件的异步加载，避免网页失去响应；其次是管理模块之间的依赖性，便于代码的编写和维护。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>requirejs-demo</title>
    <!-- async属性表明这个文件需要异步加载，避免网页失去响应。IE不支持这个属性，只支持defer，所以把defer也写上。 -->
    <script src="js/require.js" defer async="true" data-main="js/main"></script>
</head>
<body>
    <div>Hello World!</div>
</body>
</html>
```

- 模块的加载行为可以进行自定义。require.config()就写在主模块（main.js）的头部。参数就是一个对象，这个对象的paths属性指定各个模块的加载路径。路径默认与main.js在同一个目录（js子目录。如果这些模块在其他目录，比如js/lib目录，则有两种写法。一种是逐一指定路径，例如"jquery": "lib/jquery.min",直接改变基目录（baseUrl）;某个模块在另一台主机上，也可以直接指定它的网址;如果加载多个模块，就会发出多次HTTP请求，会影响网页的加载速度。因此，require.js提供了一个优化工具，当模块部署完毕以后，可以用这个工具将多个模块合并在一个文件中，减少HTTP请求数。比如jQuery）符合AMD规范，更多的库并不符合。underscore和backbone这两个库，都没有采用AMD规范编写。如果要加载它们的话，必须先定义它们的特征。
```js
//main.js
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
        //  exports: '_'
        // },
        // 'backbone': {
        //  deps: ['underscore', 'jquery'],
        //  exports: 'Backbone'
        // },
        // 'jQuery.scroll': {
        //  deps: ['jquery'],
        //  exports: 'jQuery.fn.scroll'
        // }
    }
});
```

- 第一个参数是一个数组，表示所依赖的模块，上例就是['moduleA', 'moduleB', 'moduleC']，即主模块依赖这三个模块；第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块。它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。
```js
//模块加载格式
require(['moduleA', 'moduleB', 'moduleC'], function(moduleA, moduleB, moduleC) {　　　　 
  // some code here
});

require(['math'], function(math){
  console.log(math.add(1,1));
});

// require.js还提供一系列插件，实现一些特定的功能。
// domready插件，可以让回调函数在页面DOM结构加载完成后再运行。
// text和image插件，则是允许require.js加载文本和图片文件。npm install requirejs/text
// 类似的插件还有json和mdown，用于加载json文件和markdown文件。
// 插件下载地址： https://github.com/requirejs/requirejs/wiki/Plugins
// 第一种方式
require(['domReady', 'math'], function (domReady, math) {
  domReady(function () {
    //This function is called once the DOM is ready.
    //It will be safe to query the DOM and manipulate
    //DOM nodes in this function.
    console.log(math.add(1,1));
  });
});
// 第二种方式
require(['domready!', 'math'], function(doc, math){
    console.log(math.add(1,1));
});
```

- 如果这个模块不依赖其他模块，那么define()函数的第一个参数可以不是一个数组，但你可以告诉它是一个空数组。
```js
//myLib.js
define(function(){
    var doSomething = function(){
        console.log('Weclome to Requirejs!');
    }

    return {
        doSomething: doSomething
    }
});
```

- 如果这个模块还依赖其他模块，那么define()函数的第一个参数，必须是一个数组，指明该模块的依赖性。
```js
// math.js
// define(function(){
//  var add = function(x, y){
//      return x + y;
//  };
//  return {
//      add: add
//  };
// });

define(['myLib', 'text!../../review.txt'], function(myLib, review){
    console.log(review);
    myLib.doSomething();
    var add = function(x, y){   
        // myLib.doSomething(); 
        return x + y;
    };
    return {
        add: add
    };
});
```

- r.js打包，下面将会有两种情况的打包，前者是没有引入almond的情况下，后者是引入almond的情况。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>almond-demo</title>
    <!-- <script src="js/require.js" data-main="js/main-built.js"></script> -->
    <script src="js/require.js" data-main="js/main-almond-built.js"></script>
</head>
<body>
    Hello World!
</body>
</html>
```

- 配置打包命令，可以不配置，但在终端命令行需要手打的指令会比较长，建议还是配置好点。
```js
//build.js
({
    baseUrl: "js",
    name: "main",
    optimize: "none",
    out: "js/main-built.js"
})
```

- 入口文件，它依赖两个自定义库文件cookie和util
```js
//main.js
requirejs.config({
    baseUrl: 'js'
});

require(['cookie', 'util'], function(Cookie, Util){
    Cookie.say('hello');
    Util.say('hello');
});
```

- cookie文件
```js
//cookie.js
define([], function(){
    return {
        say: function(msg){
            console.log("cookie:" + msg);
        }
    };
});
```

- util文件
```js
//util.js
define([], function(){
    return {
        say: function(msg){
            console.log("util:" + msg);
        }
    };
});
```

- 执行打包语句
```js
//这种情况下的打包文件会相对比起用almond方式打包的文件相对会较大
node r.js -o build.js 
```

- 引入almond.js库打包，注意wrap属性，如果没有wrap属性，相当于暴露了公共API。例如在浏览器调试那里输入var cookie = require('cookie');
```js
//build-almond.js
({
    baseUrl: "js",
    name: "almond",
    include: "main",
    out: "js/main-almond-built.js",
    wrap: true   //如果需要调试某个模块可以去掉当前属性
})
```

- 执行打包语句
```js
//node r.js -o baseUrl=js name=almond include=main out=js/main-almond-built.js wrap=true optimize=none
node r.js -o build-almond.js
```

综上所述，两种打包方式各有各的特点，个人根据业务需求来决定使用哪种方式打包会比较好。如果需要上面栗子源码可以从本人github[requirejs-r.js-demo](https://github.com/liwenxin-jam/requirejs-r.js-demo "requirejs-r.js-demo")上下载测试。

- 参考文献
1、[Javascript模块化编程（三）：require.js的用法](http://www.ruanyifeng.com/blog/2012/11/require_js.html?bsh_bid=230697246 "Javascript模块化编程（三）：require.js的用法")
2、[requirejs：杏仁的优化(almond)](http://www.cnblogs.com/chyingp/p/requirejs-almond-introduction.html "requirejs：杏仁的优化(almond)")

