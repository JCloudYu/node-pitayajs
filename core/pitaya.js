(()=>{
	"use strict";
	
	const BUILTIN_FIELDS = [ 'env', 'next', 'stop', 'handler' ];
	const Pitaya = (config)=>{
		config = config || {};
	
		let inputHandler = config.handler;
		if ( !inputHandler ) {
			throw "Entry handler is not set!";
		}
	
	
	
		if ( !Array.isArray(inputHandler) ) {
			inputHandler = [inputHandler];
		}
		const _handler = inputHandler;
	
		
	
		return {
			init:function() {
				let promise = Promise.resolve();
				_handler.forEach((handler)=>{
					if ( !handler.init ) return;
					promise = promise.then(handler.init);
				});
				
				return promise;
			},
			trigger:function(env, chainData=null) {
				// Prepare constant objects
				let control = {};
				Object.defineProperties(control, {
					env:{
						value:env,
						writable:false, enumerable:true, configurable:false
					},
					next:{
						value:null,
						writable:true, enumerable:true, configurable:false
					},
					stop:{
						value:false,
						writable:true, enumerable:true, configurable:false
					},
				});

				Object.keys(config).forEach((key)=>{
					if ( BUILTIN_FIELDS.indexOf(key) >= 0 ) return;
					control[key] = config[key];
				});
				
				
				
				// Prepare module chaining queue
				let queue = _handler.slice(0);
				return __LOOP_MODULE(chainData);
				
				
				
				
				
				
				function __LOOP_MODULE(result) {
					// Stop promise chain if there's no more items in the module chaining queue
					if ( queue.length === 0 || control.stop ) { return Promise.resolve(result); }
				
				
				
					// Fetch the next item from module chaining queue and execute it
					let queuedModule = queue.shift();
					result = queuedModule(control, result);
					
					// Check if there's a need to assign more modules?
					if ( Array.isArray(control.next) ) {
						queue.splice(0, 0, ...control.next);
					}
					else
					if ( control.next ) {
						queue.splice(0, 0, control.next);
					}
					
					control.next = null;
					
					
					
					// Force promisefy the module results
					return Promise.resolve(result).then(__LOOP_MODULE);
				}
			}
		};
	};
	
	
	Pitaya.chain = Pitaya;
	Pitaya.net	 = require( './ext/pitaya-net' );
	module.exports = Pitaya;
})();
