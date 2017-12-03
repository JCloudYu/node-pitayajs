/**
 * Project: pitayajs
 * File: pitaya-misc.js
 * Author: JCloudYu
 * Create Date: Dec. 04, 2017
 */
 
/**
 * Miscellaneous supportive functions
 * @module ext/pitaya-misc
 */
(()=>{
	"use strict";
	
	const SMALL_MAP = {
		js:'application/javascript',
		json:'application/json',
		css:'text/css',
		jpg:'image/jpeg',
		jpeg:'image/jpeg',
		png:'image/png',
		bmp:'image/bmp',
		tif:'image/tiff',
		tiff:'image/tiff',
		ico:'image/x-icon',
		txt:'text/plain'
	};
	
	/**
	 * @namespace PitayaMiscHelper
	 */
	const exports = {
		/**
		 * Read extension from file and detect the mime of the extension if possible (don't count on it...)
		 * @param {String} path The string to be parsed
		 * @param {Boolean} guessMime Whether to guess the mime of the extension
		 * @param {{[String]:{String}}} map The extended map known by developer
		 * @returns null|String|{ext:String,mime:String|Boolean}
		 */
		ObtainExtension:(path, guessMime=false, map={})=>{
			path = (path || '').trim();
			let period = path.lastIndexOf('.');
			if ( period < 0 ) return null;
			
			let ext = path.substring(period+1);
			if ( !guessMime ) return ext;
			
			let mime = map[ext] || SMALL_MAP[ext] || false;
			return { ext, mime };
		}
	};
	
	module.exports = exports;
})();

