var http = require( 'http' ),
	fs   = require( 'fs' ),
	url  = require( 'url' ),
	path = require( 'path' ),
	mimeTypes = require( './mime' ).types;

http.createServer( function( request, response ){
	console.log( 'url:' + request.url );
	var pathName = url.parse( request.url ).pathname;
	console.log( 'pathName:' + pathName );

	var realPath = 'yunzhida' + pathName;

	fs.exists( realPath, function( isExist ){
		console.log( 'isExist:' + isExist );
		if ( !isExist ) {
			//response.setHeader( 'charset', 'UTF-8' );
			//response.setEncoding( 'utf8' );
			//response.setHeader("Content-type", "text/plain;charset=UTF-8");ASCII
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

}).listen(8989);
