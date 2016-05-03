/*
	静态文本服务器
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
			var requestMimeType = path.extname( realPath );
			requestMimeType = requestMimeType ? requestMimeType.slice( 1 ) : 'unknown';

			var contentType = ( mimeTypes[ requestMimeType ] ? mimeTypes[ requestMimeType ] : 'text/plain' ) + ';charset=UTF-8',
				acceptEncoding = request.headers[ 'accept-encoding' ] || '';

			var localFile = fs.createReadStream( realPath ),
				matchToggle = pathName.match( config.compress.match );

			response.setHeader( 'Content-Type', contentType );

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

		}
	} );

}).listen( 8080 );