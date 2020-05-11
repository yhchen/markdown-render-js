# MarkdownToHtml
> 将Markdown文档转换为HTML显示

## 说明
> 在程序的中，我结合了bootstrap的样式，所以稍微更改了下模块marked的源码，这也是为了显示更好。我的测试md文档放在了，public/doc下。这边用了一个代码高亮的插件：highlight.js，你也可以用一些别的。<br><br>
> 本应用是采用 node.js + Express 搭建的

# 准备工作
## 安装marked
git clone https://github.com/yhchen/markdown-render-js
cd markdown-render-js
npm install

# 关键步骤
## config.js
``` Javascript
const path = require('path');

var config = {};
//                                        ↓↓↓修改为你自己的路径↓↓↓
config.RelativePath = path.join(__dirname, '/public/markdown/'/*replace to your directory...*/);
console.log('relative path:' + config.RelativePath);

module.exports = config;
```

## doc.ejs
``` HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">
	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
    <link rel="stylesheet" href="/css/doc.css">
</head>
<body>
    <nav class="navbar navbar-default navbar-fixed-top">
	  <div class="container">
	    <div class="navbar-header">
	     	<a class="navbar-brand" href="#"> Markdown</a>
	    </div>
	    <button type="button" class="btn btn-primary navbar-btn navbar-right" id="download"><span class="glyphicon glyphicon-download-alt"></span> Download</button>
	  </div>
	</nav>
	<div class="container" id="doc-page">
		<%- doc %>
	</div>
	<div class="footer">
		<span>© 2017 Gavin</span>
	</div>
</body>
</script>
</html>
```

## app.js
> 只给出路由部分

``` JavaScript
const doc = require('./routes/doc');
app.use('/doc', doc);
```

# Demo演示
To be continue...
