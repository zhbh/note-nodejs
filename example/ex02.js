/*
	静态文本服务器

	实例 ex02.js
*/
var http = require( 'http' ),
	fs   = require( 'fs' ),
	url  = require( 'url' ),
	path = require( 'path' ),
	mimeTypes = require( './mime' ).types,
	zlib = require( 'zlib' ),
	config = require( './config' );

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
			var requestType = path.extname( realPath );
			requestType = requestType ? requestType.slice( 1 ) : 'unknown';

			var contentType = ( mimeTypes[ requestType ] ? mimeTypes[ requestType ] : 'text/plain' ) + ';charset=UTF-8',
				acceptEncoding = request.headers[ 'accept-encoding' ] || '';

			var localFile = fs.createReadStream( realPath ),
				matchToggle = pathName.match( config.compress.match );

			//读取文件修改日期，响应头设置最新修改
			fs.stat( realPath, function ( err, stat ) {
			    var lastModified = stat.mtime.toUTCString( );
			    response.setHeader( 'Last-Modified', lastModified );
			    response.setHeader( 'Content-Type', contentType );

			    //启用缓存
			    if ( request.headers[ 'if-modified-since' ] && lastModified === request.headers[ 'if-modified-since' ] ) {
				    response.writeHead( 304, 'Not Modified' );
				    response.end();

				    return;
				}

				if( requestType.match( config.expires.match ) ) {
					var expires = new Date( );
					expires.setTime( expires.getTime() + config.expires.maxAge * 1000 );
					response.setHeader( 'Expires', expires.toUTCString() );
					response.setHeader( 'Cache-Control', 'max-age=' + config.expires.maxAge );
				}

			    //启用压缩
				if ( matchToggle && acceptEncoding.match( /\bgzip\b/ ) ) {
					response.writeHead( 200, {
						'Content-Encoding' : 'gzip'
					} );

					localFile.pipe( zlib.createGzip( ) ).pipe( response );
				}else if( matchToggle && acceptEncoding.match( /\bdeflate\b/ ) ) {
					response.writeHead( 200, {
						'Content-Encoding' : 'deflate'
					} );

					localFile.pipe( zlib.createDeflate( ) ).pipe( response );
				}else {
					localFile.pipe( response );
				}
			} );
		}
	} );

} ).listen( 8080 );