/**
 * Project: pitayajs
 * File: pitaya-net.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(()=>{
	"use strict";
	
	const exports = {
		StreamReadAll: (stream, doDrain=false)=>{
			return new Promise((fulfill, reject)=>{
				stream.on('error', reject );
				
				if ( doDrain ) {
					stream.on('end', fulfill );
					stream.resume();
				}
				else {
					let buff = [];
					stream.on('end', ()=>{ fulfill(Buffer.concat(buff)); buff = null; });
					stream.on('data', (chunk)=>{ buff.push(chunk); });
				}
			});
		},
		StreamDrain:(stream)=>{
			return exports.StreamReadAll(stream, true);
		},
		HTTPParseQuery:(queryStr)=>{
			queryStr = queryStr || '';
			let query = {var:{}, flag:[]};
			queryStr.split( '&' ).forEach((item)=>{
				let eq = item.indexOf('=');
				if (eq < 0) {
					query.flag.push(decodeURIComponent(item));
				}
				else {
					query.var[decodeURIComponent(item.substring(0, eq))] = decodeURIComponent(item.substring(eq+1));
				}
			});
			
			return query;
		},
		HTTPPullPathComp:(path)=>{
			if ( typeof path === "string" ) {
				path = {url:path, comp:''};
			}
		
			let {comp, url} = path;
			let divider = url.indexOf('/', 1);
			if ( divider >= 0 ) {
				comp = url.substring(0,divider);
				url  = url.substring(divider);
			}
			else {
				comp = url;
				url	 = '';
			}
			
			return {url:url, comp:comp};
		}
	};
	
	module.exports = exports;
})();

