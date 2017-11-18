/**
 * Project: pitayajs
 * File: pitay-net-cookie.js
 * Author: JCloudYu
 * Create Date: Nov. 19, 2017
 */
 
/**
 * @typedef {{
 * 		name:String,
 * 		value:*,
 * 		[expires]:Date|String|moment,
 * 		[duration]:Number,
 * 		[domain]:String,
 * 		[path]:String,
 * 		[http_only]:Boolean,
 * 		[ssl_only]:Boolean,
 * 		[same_site]:"Strict"|"Lax"
 * }} CookieDesc
 */

/**
 * Cookie processing function
 * @module ext/pitaya-net-cookie
 */
(() => {
	"use strict";
	
	const DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
	const SAME_SITE_CANDIDATE = [ 'Strict', 'Lax' ];
	const moment = require( 'moment' );
	
	//CTLs SP " ( ) , / : ; < = > ? @ [ \ ] { }
	const INVALID_TOKEN = /([^\u0020-\u007e\u0080-\u00ff]|[\u0020\u0022\u0028\u0029\u002c\u002f\u003a-\u0040\u005b-\u005d\u007b\u007d])/g;
	const INVALID_VALUE = /([^\u0021\u0023-\u002b\u002d-\u003a\u003c-\u005b\u005d-\u007e\u0080-\u00ff])/g;
	
	
	/**
	 * @namespace PitayaNetCookieHelper
	 */
	module.exports = {
		/**
		 * Parse the given cookie string based on RFC6265
		 * @param {String} cookieStr
		 * @returns {Object}
		 */
		ParseCookie:(cookieStr='')=>{
			cookieStr = cookieStr || '';
			if ( cookieStr === '' ) {
				return {};
			}
			
			let cookies = {};
			cookieStr.split( ';' ).forEach((cookie)=>{
				cookie = cookie.trim();
				let split = cookie.indexOf( '=' );
				if ( split < 0 ) { return; }
				
				cookies[cookie.substring(0, split)] = cookie.substring(split+1);
			});
			
			return cookies;
		},
		 
		/**
		 * Generate cookie string based on RFC6265 that can be used in Set-Cookie header
		 * @param {CookieDesc|CookieDesc[]} cookies
		 * @return {[String]}
		 */
		GenCookie:(cookies=[])=>{
			if ( !Array.isArray(cookies) ) {
				cookies = [cookies];
			}
		
			let cookieExp = [];
			for ( let cookieDesc of cookies ) {
				let {name, value} = cookieDesc;
				if ( !name || !value || name === '' || value === '' ) {
					continue;
				}
				
				let comp = [];
				name  = `${name}`.replace(INVALID_TOKEN, '-');
				value = `${value}`.replace(INVALID_VALUE, '-');
				comp.push( `${name}=${value}` );
				
				if ( cookieDesc.expires ) {
					let time = moment(cookieDesc.expires);
					if ( time.isValid() ) {
						comp.push( `Expires=${time.utc().format(DATE_RFC2822)}` )
					}
				}
				
				if ( cookieDesc.duration ) {
					comp.push( `Max-Age=${cookieDesc.duration|0}` );
				}
				
				if ( cookieDesc.domain ) {
					comp.push( `Domain=${cookieDesc.domain}` );
				}
				
				if ( cookieDesc.path ) {
					comp.push( `Path=${cookieDesc.path}` );
				}
				
				if ( cookieDesc.http_only ) {
					comp.push( `HttpOnly` );
				}
				
				if ( cookieDesc.ssl_only ) {
					comp.push( `Secure` );
				}
				
				if ( cookieDesc.same_site ) {
					if ( SAME_SITE_CANDIDATE.indexOf(cookieDesc.same_site) >= 0 ) {
						comp.push( `SameSite=${cookieDesc.same_site}` );
					}
				}
				
				
				cookieExp.push(comp.join('; '));
			}
			
			return cookieExp;
		}
	};
})();
