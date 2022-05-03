/**
 * ///////////////////////////////////////
 * //////// Finite state machine /////////
 * ///////////////////////////////////////
 *
 * This module exposes the interface of
 * the finite state machine.
 */

/**
 * The state machine constructor.
 */
const Fsm = function () {
  this.currentState = null;
};

/**
 * Transitions the state machine to the
 * given state.
 */
Fsm.prototype.transitionTo = function (state, args) {
  if (!state) {
    throw new Error('Expected a valid state');
  }
  if (this.currentState !== state) {
    if (this.currentState && this.currentState.onExit) {
      this.currentState.onExit();
    }
    this.currentState = state;
    if (this.currentState.onEntry) {
      this.currentState.onEntry(args);
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
  return (this.currentState);
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
  if (!options || !options.fsm) {
    throw new Error('Unexpected arguments');
  }
  this.name_ = options.name;
  // Implementing defined attributes in the current state.
  Object.keys(options).forEach((key) => {
    if (key !== 'name') {
      if (typeof options[key] === 'function') {
        options[key] = options[key].bind(this);
      }
      this[key] = options[key];
    }
  });
};

/**
 * Transitions the currently bound
 * state machine to the given `state`.
 * @param {*} state the state to transition to.
 */
Fsm.State.prototype.transitionTo = function (state) {
  this.fsm.transitionTo(state);
};

/**
 * Returns the Fsm name.
 */
Fsm.State.prototype.name = function () {
  return (this.name_);
};

export default Fsm;
