/**
 * Project: pitayajs
 * File: file-req-handler.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(() => {
	"use strict";
	
	const fs = require( 'fs' );
	
	
	
	module.exports = (control, chainData)=>{
		const {request:req, response:res} = control.env;
		const {nginx, apache, local} = control.paths||{};
		
		let handler, pathInfo,
		[proxyServer] = (req.headers['x-forwarded-server'] || '/').split('/');
		proxyServer = proxyServer.toLowerCase();
		
		
		if ( nginx && proxyServer === 'nginx' ) {
			pathInfo = nginx;
			handler = __SERVE_NGINX_FILE;
		}
		else
		if ( apache && proxyServer === 'apache' ) {
			pathInfo = apache;
			handler = __SERVE_APACHE_FILE;
		}
		else
		if ( local ) {
			pathInfo = local;
			handler = __SERVE_LOCAL_FILE;
		}
		else {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.write( 'Not Found!' );
			return;
		}
		
		
		
		return handler(res, pathInfo, chainData);
	};
	function __SERVE_NGINX_FILE(res, resRoot, chainData) {
		let path, contentType, headers;
		if ( typeof chainData === "string" ) {
			path = chainData;
		}
		else {
			({path, contentType} = chainData);
		}
		
		
		// Fill in nginx X-Accel Headers
		headers = { 'X-Accel-Redirect': `${resRoot}${path}` };
		if ( contentType ) {
			headers[ 'Content-Type' ] = `${contentType}`;
		}
		
		res.writeHead(200, headers);
		res.end();
	}
	function __SERVE_APACHE_FILE(res, resRoot, chainData) {
		let path, contentType, headers;
		if ( typeof chainData === "string" ) {
			path = chainData;
		}
		else {
			({path, contentType} = chainData);
		}
		
		
		// Fill in apache X-SendFile Headers
		headers = { 'X-SendFile': `${resRoot}${path}` };
		headers[ 'Content-Type' ] = contentType ? `${contentType}` : 'application/octet-stream';
		
		
		res.writeHead(200, headers);
		res.end();
	}
	function __SERVE_LOCAL_FILE(res, resRoot, chainData) {
		return new Promise((fulfill)=>{
			let path, contentType, headers;
			if ( typeof chainData === "string" ) {
				path = chainData;
			}
			else {
				({path, contentType} = chainData);
			}
			
			headers = {
				'Content-Type': (contentType ? `${contentType}` : 'application/octet-stream')
			};
			
			
			
			let resPath = `${resRoot}${path}`;
			try {
				let stat = fs.statSync(resPath);
				if ( stat.isDirectory() ) {
					throw "Not a file";
				}
				
				let stream	= fs.createReadStream(resPath, {autoClose:true});
				headers[ 'Content-Length' ] = stat.size;
				
				res.writeHead(200, headers);
				stream.pipe(res);
				stream.on( 'end', fulfill );
			}
			catch(e) {
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.write( 'Not Found!' );
				fulfill();
			}
		});
	}
})();

