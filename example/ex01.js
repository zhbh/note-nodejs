/*
	静态文本服务器

	1. 创建http服务器，并设置监听端口，request获取请求头和请求体的数据对象；

	2. 根据请求链接，得知具体请求的文件；

	3. 如果是未知的文件，则返回index.html；

	4. 使用本地文件接口，读取相应的文件；

	5. 不同文件类型，需要返回不同内容类型相应头（根据文件后缀判断响应内容类型，告诉浏览器展示内容）；

	6. 请求文件不存在，则返回提示在服务器找不到相关文件。
*/
var http = require( 'http' ),
	fs   = require( 'fs' ),
	url  = require( 'url' ),
	path = require( 'path' ),
	mimeTypes = require( './mime' ).types;

http.createServer( function( request, response ) {

	var pathName = url.parse( request.url ).pathname;

	if ( pathName === '/' ) {
		pathName += 'index.html';
	}

	var realPath = 'src' + pathName;

	fs.exists( realPath, function( isExist ){
		if ( !isExist ) {
			
			response.writeHead( 404, { 'Content-Type' : 'text/html;charset=UTF-8' } );
			response.end( '当前路径：' + pathName + '在服务器找不到' );

		}else {
			var requestMimeType = path.extname( realPath );
			requestMimeType = requestMimeType ? requestMimeType.slice( 1 ) : 'unknown';

			var contentType = ( mimeTypes[ requestMimeType ] ? mimeTypes[ requestMimeType ] : 'text/plain' ) + ';charset=UTF-8';

			var htmlfile = fs.readFile( realPath, function( err, data ){
				response.writeHead( 200, { 'Content-Type' : contentType } );
				response.end( data );
			});
		}
	} );

}).listen( 8989 );
