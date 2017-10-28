(()=>{
	"use strict";
	
	const pitaya = require( '../pitaya' ).chain({handler:[
		(control, result)=>{
			console.log( 0, result );
			control.next = [
				(control, result)=>{ console.log(1, result); return 'a'; },
				(control, result)=>{ console.log(2, result); return 'b'; },
				(control, result)=>{ return new Promise((fulfill)=>{
					setTimeout(()=>{ console.log(3, result); fulfill('c'); }, 5000)
				});},
				(control, result)=>{ console.log(4, result); return 'd'; },
			];
			
			return 'k';
		},
		(control, result)=>{ console.log(5, result); return 'e'; },
	]}).trigger().then((result)=>{console.log(`final ${result}`)});
})();
