## 学习资料
1. [NodeJS API](https://nodejs.org/download/docs/latest/api/)
2. [七天学会NodeJS](http://nqdeng.github.io/7-days-nodejs)
3. [用NodeJS打造你的静态文件服务器](http://www.open-open.com/solution/view/1321344823593)

## 学习思路

### 创建基本http服务器

1.创建http服务器，并设置监听端口（8080），request获取请求头和请求体的数据对象；

```javascript
	var http = require( 'http' );

	http.createServer( function( request, response ) {

	} ).listen( 8080 );
```

其中，request是请求数据流，包括请求头（headers）和请求体（body）；response是响应数据流，包括响应头（headers）和响应体（body）。header信息包括Host:port主机地址+端口号，User-Agent用户代理信息（硬件平台信息、软件信息[浏览器内核名称和版本号]、应用信息[名称和版本号]），Accept接收文件类型，Accept-Encoding接收压缩类型，Cache-Control缓存控制，Connection连接状态等等，其他信息通过设置请求头，如Last-Modified:[日期类型GMT-格林尼治标准时间]。

2.根据请求链接，得知具体请求的文件；

```javascript
	va url  = require( 'url' );
	var pathName = url.parse( request.url ).pathname;
```
	转换url对象，可以获取更多url方法和属性。

更简洁的写法:

```javascript
	var pathName = request.url;
```

这个对象是字符串类型。

3.如果是未知的文件，则返回index.html；

```javascript
	if ( pathName === '/' ) {
		pathName += 'index.html';
	}
```

4.读取服务器本地相应的文件；

```javascript
	var realPath = 'src' + pathName;

	var fs = require( 'fs' );

	fs.exists( realPath, function( isExist ){
		//如果找到相应文件，跳转到5和6
		//否则，跳转到7
	} );
```

引入文件读取接口，判断文件是否存在；如果不存在，则返回状态码（statusCode）404，文件类型（Content-Type），和字符编码；如果存在，则：

5.不同文件类型，需要返回不同内容类型相应头（根据文件后缀判断响应内容类型，告诉浏览器展示内容）；

```javascript	
	var path = require( 'path' );
	var requestMimeType = path.extname( realPath );
	var requestMimeType = requestMimeType ? requestMimeType.slice( 1 ) : 'unknown'; //需要去掉'.'
```

根据路径对象，获取文件扩展名，然后判断其扩展名获取相应的文件MIME类型，自定义mime.js：

> MIME(Multipurpose Internet Mail Extensions)多用途互联网邮件扩展类型，是描述消息内容类型的因特网标准。
> [MIME类型列表](http://www.w3school.com.cn/media/media_mimeref.asp)

如下代码，列出基本常用的MIME类型，其JSON对象（key-value，key是文件扩展名，value是MIME类型）：

```javascript
	exports.types = {
	    "css": "text/css",
	    "gif": "image/gif",
	    "html": "text/html",
	    "ico": "image/x-icon",
	    "jpeg": "image/jpeg",
	    "jpg": "image/jpeg",
	    "js": "text/javascript",
	    "json": "application/json",
	    "pdf": "application/pdf",
	    "png": "image/png",
	    "svg": "image/svg+xml",
	    "swf": "application/x-shockwave-flash",
	    "tiff": "image/tiff",
	    "txt": "text/plain",
	    "wav": "audio/x-wav",
	    "wma": "audio/x-ms-wma",
	    "wmv": "video/x-ms-wmv",
	    "xml": "text/xml"
	};
```

> 一般将代码合理拆分到不同的JS文件中，每一个文件就是一个模块，而文件路径就是模块名。在编写每个模块时，都有require、exports、module三个预先定义好的变量可供使用。

> 其中，`exports`对象是当前模块的导出对象，用于导出模块公有方法和属性。

6.请求文件存在，则从服务器本地读取相应的文件，并返回相应的内容类型和数据，状态码200。

```javascript
	var mimeTypes = require( './mime' ).types;

	var contentType = ( mimeTypes[ requestMimeType ] ? mimeTypes[ requestMimeType ] : 'text/plain' ) + ';charset=UTF-8';

	var htmlfile = fs.readFile( realPath, function( err, data ){
		response.writeHead( 200, { 'Content-Type' : contentType } );
		response.end( data );
	});
```

7.请求文件不存在，则返回提示在服务器找不到相关文件，返回内容类型是text/html，状态码404，并提示找不到相应的路径。

```javascript
	response.writeHead( 404, { 'Content-Type' : 'text/html;charset=UTF-8' } );
	response.end( '当前路径：' + pathName + '在服务器找不到' );
```