/**
 * ///////////////////////////////////////
 * //////// Finite state machine /////////
 * ///////////////////////////////////////
 *
 * This module exposes the interface of
 * the finite state machine.
 */

/**
 * Exporting the `Fsm` module appropriately given
 * the environment (AMD, Node.js and the browser).
 */
(function (name, definition) {
    if (typeof define === 'function' && define.amd) {
	// Defining the module in an AMD fashion.
	define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
	// Exporting the module for Node.js/io.js.
	module.exports = definition();
    } else {
	var instance = definition();
	var global   = this;
	var old      = global[name];
	
	/**
	 * Allowing to scope the module
	 * avoiding global namespace pollution.
	 */
	instance.noConflict = function () {
	    global[name] = old;
	    return instance;
	};
	// Exporting the module in the global
	// namespace in a browser context.
	global[name] = instance;
    }
})('Fsm', function () {

    /**
     * The state machine constructor.
     */
    var Fsm = function () {
	this.currentState = undefined;
    };
    
    /**
     * Transitions the state machine to the
     * given state.
     */
    Fsm.prototype.transitionTo = function (state) {
	if (!state) {
	    throw new Error('Expected a valid state');
	}
	if (this.currentState !== state) {
	    if (this.currentState && this.currentState.onExit) {
		this.currentState.onExit();
	    }
	    this.currentState = state;
	    if (this.currentState.onEntry) {
		this.currentState.onEntry();
	    }
	}
    };
    
    /**
     * Posts an event into the current state.
     */
    Fsm.prototype.postEvent = function (event) {
	if (this.currentState && this.currentState.onEvent) {
	    this.currentState.onEvent(event);
	}
    };
    
    /**
     * Returns the current state.
     */
    Fsm.prototype.state = function () {
	return this.currentState;
    };
    
    /**
     * Starts the state machine in the
     * given state.
     */
    Fsm.prototype.start = function (state) {
	if (!state) {
	    throw new Error('Expected a valid state');
	}
	if (!this.currentState) {
	    this.transitionTo(state);
	} else {
	    throw new Error('Fsm already started');
	}
    };
    
    /**
     * Definition of a state.
     */
    Fsm.State = function (options) {
	var unexpected = function () {
	    throw new Error('Unexpected arguments');
	};
	if (!options) {
	    unexpected();
	}
	this.fsm = options.fsm || unexpected();
	this.name_ = options.name;
	this.onEntry = options.onEntry;
	this.onExit = options.onExit;
	this.onEvent = options.onEvent;
    };
    
    /**
     * Transitions the associated Fsm
     * to the given state.
     */
    Fsm.State.prototype.transitionTo = function (state) {
	this.fsm.transitionTo(state);
    };
    
    /**
     * Returns the Fsm name.
     */
    Fsm.State.prototype.name = function () {
	return this.name_;
    };
    
    return Fsm;
});