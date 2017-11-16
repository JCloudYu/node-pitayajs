/**
 * Project: pitayajs
 * File: test.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(()=>{
	"use strict";
	
	const pitaya = require( '../core/pitaya' ).chain({handler:[
		(control, result)=>{
			console.log( 0, result );
			control.next = [
				(control, result)=>{ console.log(1, result); return 'a'; },
				(control, result)=>{ console.log(2, result); return 'b'; },
				(control, result)=>{ return new Promise((fulfill)=>{
					setTimeout(()=>{ console.log(3, result); fulfill('c'); }, 1000)
				});},
				(control, result)=>{ console.log(4, result); return 'd'; },
				(control, result)=>{ control.stop = true; console.log(5, result); return 'e'; },
				(control, result)=>{ return new Promise((fulfill)=>{
					setTimeout(()=>{ console.log(6, result); fulfill('c'); }, 10000)
				}); },
				(control, result)=>{ console.log(7, result); return 'g'; },
				(control, result)=>{ console.log(8, result); return 'h'; },
			];
			
			return 'k';
		},
		(control, result)=>{ console.log(9, result); return 'i'; },
	]}).trigger().then((result)=>{console.log(`final ${result}`)});
})();
