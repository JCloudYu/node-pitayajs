(()=>{
	"use strict";
	module.exports = { chain:(config)=>{
		const {handler:_handler} = config;
		
		if ( !_handler ) {
			throw "Entry handler is not set!";
		}
	
		return {
			init:function() {
				return Promise.resolve().then(()=>{
					if ( !_handler.init ) {
						return;
					}
					
					return _handler.init();
				});
			},
			trigger:function(env) {
				// Prepare constant objects
				let control = {next:null};
				Object.defineProperty(control, 'env', {
					value:env, writable:false, enumerable:true, configurable:false
				});
				
				
				// Prepare module chaining queue
				let queue = [_handler];
				return __LOOP_MODULE(null);
				
				
				
				
				
				
				function __LOOP_MODULE(result) {
					// Stop promise chain if there's no more items in the module chaining queue
					if ( queue.length === 0 ) { return Promise.resolve(result); }
				
				
				
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
	}};
})();
