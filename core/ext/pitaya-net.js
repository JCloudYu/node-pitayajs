/**
 * Project: pitayajs
 * File: pitaya-net.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */

/**
 * Network supportive functions
 * @module ext/pitaya-net
 */
(()=>{
	"use strict";
	
	/**
	 * @namespace PitayaNetHelper
	 */
	const exports = {
		/**
		 * Read all string into buffer
		 * @async
		 * @param {stream.Readable} stream The source stream
		 * @param {Number} size_limit The max size of data to be read from stream
		 * @param {Boolean} doDrain Whether to drain input instead of read contents
		 * @returns {Promise<Buffer>}
		 */
		StreamReadAll: (stream, size_limit=0, doDrain=false)=>{
			return new Promise((fulfill, reject)=>{
				stream.on('error', reject );
				
				if ( doDrain ) {
					stream.on('end', fulfill );
					stream.resume();
				}
				else {
					let buff = [], length = 0;
					stream.on('end', ()=>{ fulfill(Buffer.concat(buff)); buff = null; });
					stream.on('data', (chunk)=>{
						length += chunk.length;
						if ( size_limit <= 0 || size_limit >= length) {
							buff.push(chunk);
						}
						else {
							stream.pause();
							buff.splice(0);
							stream.removeAllListeners();
							setTimeout(()=>{
								stream.on( 'end', ()=>{ reject(new RangeError( "Client has uploaded data with too large size!" )) } );
								stream.resume();
							}, 0);
						}
					});
				}
			});
		},
		
		/**
		 * Read and discard all data from given stream
		 * @async
		 * @param {stream.Readable} stream
		 * @returns {Promise}
		 */
		StreamDrain:(stream)=>{
			return exports.StreamReadAll(stream, 0, true);
		},
		
		/**
		 * Parse given query string and divide the content into variables and flags.
		 * @param {String} queryStr The string to be parsed
		 * @param {Boolean} fullPath Whether the string contains the path part
		 * @returns {{var: {}, flag:String[]}}
		 */
		HTTPParseQuery:(queryStr, fullPath=true)=>{
			queryStr = queryStr || '';
			let query = {var:{}, flag:[]};
			
			if ( fullPath ) {
				let q = queryStr.indexOf( '?' );
				queryStr = (q < 0) ? queryStr : queryStr.substring(q+1);
			}
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
		
		/**
		 * Extract a path component from the given string
		 * @param {String|{url:String,[comp]:String}} path The path to be extracted from
		 * @param {Boolean} fullPath Whether the string contains query part
		 * @param {String} separator The token that divides the components
		 * @returns {{url:String, comp:String}}
		 */
		HTTPPullPathComp:__DIVIDE_AND_PULL,
		
		/**
		 * @type PitayaNetCookieHelper
		 */
		HTTPCookie: require('./pitaya-net-cookie')
	};
	
	module.exports = exports;
	
	
	
	/**
	 * Extract a path component from the given string
	 * @private
	 * @param {String|{url:String,[comp]:String}} path The path to be extracted from
	 * @param {Boolean} fullPath Whether the string contains query part
	 * @param {String} separator The token that divides the components
	 * @returns {{url:String, comp:String}}
	 */
	function __DIVIDE_AND_PULL(path, fullPath=true, separator='/') {
		if ( Object(path) !== path ) {
			path = {url:''+path, comp:''};
		}
		
		let {comp='', url=''} = path;
		let limit = !fullPath ? -1 : url.indexOf( '?' );
		limit = (limit < 0) ? url.length : limit;
		
		let divider = url.indexOf(separator, 1);
		if ( divider >= 0 && divider < limit ) {
			comp = url.substring(0,divider);
			url  = url.substring(divider);
		}
		else {
			comp = url;
			url	 = null;
		}
		
		return {url, comp};
	}
})();

