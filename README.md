![Logo](http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/CPT-FSM-abcd.svg/326px-CPT-FSM-abcd.svg.png)

## Fsm

[![Build Status](https://api.travis-ci.org/HQarroum/Fsm.svg?branch=master)](https://travis-ci.org/HQarroum/Fsm) [![CodeFactor](https://www.codefactor.io/repository/github/hqarroum/fsm/badge)](https://www.codefactor.io/repository/github/hqarroum/fsm)

A tiny implementation of a finite state machine written in Javascript.

Current version: **1.0.6**

Lead Maintainer: [Halim Qarroum](mailto:hqarroum@awox.com)

## Install

##### Using NPM

```bash
npm install --save fsm.js
```

##### Using Bower

```bash
bower install --save fsm.js
```

## Usage

### Creating the FSM

To create an instance of the state machine you simply have to call its constructor :

```javascript
var fsm = new Fsm();
```

### Creating a state

A `state` is an instance of a `Fsm.State` object. It takes a reference to the state machine it is associated with as well as optional callbacks associated with the state lifecycle.

As you can see below, creating a state is pretty straightforward :

```javascript
var state = new Fsm.State({
    /**
     * An optional name for the
     * state.
     */
    name: 'initialization',

    /**
     * The reference to the state machine.
     */
    fsm: fsm,

    /**
     * An optional callback invoked
     * when the state is entered.
     */
    onEntry: function () {},

    /**
     * An optional callback invoked upon
     * a received event.
     */
    onEvent: function (event) {
      // Do something with the
      // received `event`.
    },

    /**
     * An optional callback invoked
     * when the state is exited.
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

More often than not, you will want states to react to received events by executing actions and transitioning between one another.

This can be achieved through the `postEvent` and `transitionTo` primitives :

```javascript
/**
 * The `initializing` state.
 */
var initializing = new Fsm.State({
  fsm: fsm,
  name: 'initializing',
  onEntry: function () {
    console.log('Initializing');
  },
  onEvent: function (event) {
    if (event === 'init.done') {
      this.transitionTo(initialized);
    }
  },
  onExit: function () {
    console.log('Initialization done');
  }
});

/**
 * The `initialized` state.
 */
var initialized = new Fsm.State({
  fsm: fsm,
  name: 'initialized',
  onEntry: function () {
    console.log('Initialized !');
  }
});

// Starting the fsm.
fsm.start(initializing);

// Simulating an asynchronous event.
setTimeout(function () {
  fsm.postEvent('init.done');
}, 1000);
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

## Building

This project uses `Grunt` as its build system and `Bower` and `NPM` as dependency management systems.

Grunt uses the `Gruntfile.js` file to actually build the project, and will as a *default* task copy the produced binaries in the `dist/` folder.

Grunt relies on `Node.js` to execute the tasks required to build the project, so you will need to ensure that it is available on your build machine.

To install Grunt, its modules, and fetch the Bower dependencies of the project you will need to run the following command :

```bash
# This will install Grunt tasks and fetch the
# required Bower module as a postinstall task.
npm install
```

To run a build using the default task, simply run the following :

```bash
grunt
```

## Tests

Tests are available in the `tests/` directory.

You can either trigger them using `Jasmine JS` and its HTML presenter by opening `tests/index.html` in a browser, or trigger the
following commands :

```bash
# Using grunt
grunt

# Using NPM
npm test
```
