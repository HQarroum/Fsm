![Logo](http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/CPT-FSM-abcd.svg/326px-CPT-FSM-abcd.svg.png)

## Fsm

[![Build Status](https://api.travis-ci.org/HQarroum/Fsm.svg?branch=master)](https://travis-ci.org/HQarroum/Fsm) [![CodeFactor](https://www.codefactor.io/repository/github/hqarroum/fsm/badge)](https://www.codefactor.io/repository/github/hqarroum/fsm)
[![DeepSource](https://deepsource.io/gh/HQarroum/Fsm.svg/?label=active+issues&show_trend=true&token=n0J9M6_vrt266HkCkMLYQlft)](https://deepsource.io/gh/HQarroum/Fsm/?ref=repository-badge)

A tiny implementation of a finite state machine written in Javascript.

Current version: **2.0.0**

Lead Maintainer: [Halim Qarroum](mailto:hqarroum@awox.com)

## Install

```bash
npm install --save fsm.js
```

## Usage

### Creating the FSM

To create an instance of the state machine you simply have to call its constructor :

```javascript
const fsm = new Fsm();
```

### Creating a state

A `state` is an instance of a `Fsm.State` object. It takes a reference to the state machine it is associated with as well as optional callbacks associated with the state lifecycle.

As you can see below, creating a state is pretty straightforward :

```javascript
const state = new Fsm.State({

  /**
   * An optional name for the state.
   */
  name: 'initialization',

  /**
   * A reference to the used state machine.
   */
  fsm: fsm,

  /**
   * An optional callback invoked when the state is
   * entered.
   */
  onEntry: () => {},

  /**
   * An optional callback invoked upon a received
   * event.
   */
  onEvent: (event) => {
    // Do something with the received `event`.
  },

  /**
   * An optional callback invoked when the state is
   * exited.
   */
  onExit: function () {}
});
```

### Starting the state machine

When a state machine is created, it is stopped by default. To start a state machine you need to give it a reference to the initial state in which it should be starting :

```javascript
/**
 * This will cause the given `state`
 * to be entered.
 */
fsm.start(state);
```

### Playing around with events

Usually, you will want states to react to received events by executing actions and transitioning between one another. This can be achieved through the `postEvent` and `transitionTo` primitives as shown in the example below.

```javascript
/**
 * The `initialization` state of the system.
 */
const initialization = new Fsm.State({
  fsm: fsm,
  name: 'initialization',
  onEntry: () => console.log('Initialization ...'),
  onExit:  () => console.log('Initialization completed.'),
  onEvent: (event) => {
    if (event === 'init.done') {
      this.transitionTo(initialized);
    }
  }
});

/**
 * The `initialized` state.
 */
const initialized = new Fsm.State({
  fsm: fsm,
  name: 'initialized',
  onEntry: () => console.log('System initialized !')
});

// Starting the fsm.
fsm.start(initializing);

// Simulating an asynchronous event.
setTimeout(() => fsm.postEvent('init.done'), 1000);
```

The above code will output :

```
Initializing
Initialization done
Initialized !
```

## Example

In the [elevator example](https://github.com/HQarroum/Fsm/blob/master/examples/elevator/index.js), we implemented, as an example of a real life problem, the bare minimum functions provided by an elevator using a finite state machine.

For the sake of simplicity, the implementation is really dummy, meaning that smart behaviours such as ordering of the levels given their location along the elevator path are not implemented.
