![Logo](http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/CPT-FSM-abcd.svg/326px-CPT-FSM-abcd.svg.png)

## Fsm
[![Build Status](https://api.travis-ci.org/HQarroum/Fsm.svg?branch=master)](https://travis-ci.org/HQarroum/Fsm) [![Code Climate](https://codeclimate.com/repos/55e340dce30ba071d900bc0f/badges/c09e5e1811845c0f344d/gpa.svg)](https://codeclimate.com/repos/55e340dce30ba071d900bc0f/feed)

A tiny implementation of a finite state machine written in Javascript.

Current version: **1.0.4**

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

We will as an example of a real life problem modelize how an elevator actually work. We will implement the bare minimum functions provided by an elevator using our state machine.

For the sake of simplicity, our `Elevator` implementation will be really dummy, meaning that smart behaviours such as ordering of the levels given their location along the elevator path will not be implemented.

```javascript
/**
 * Our `Elevator` implementation implements
 * 3 states :
 *  - `open`: the elevator doors are opened
 *  - `closed`: the elevator doors are closed
 *  - `moving`: the elevator is moving towards a level
 *
 * It exposes an external `goToLevel` method used to
 * post a user request for the elevator to go to the
 * given level.
 */
var Elevator = function () {
    var self = this;
    var TIME_PER_LEVEL = 1 * 1000;
    this.level = 0;
    this.stack = [];
    this.fsm = new Fsm();

    /**
     * The elevator is in a stationary state
     * and its doors are closed.
     */
    var open = new Fsm.State({
      fsm: self.fsm,
      name: 'open',
      onEntry: function () {
        var state = this;

        console.log('Door opened at level', self.level);
        setTimeout(function () {
          state.transitionTo(closed);
        }, 2000);
      },

      /**
       * As the elevator's doors are currently opened
       * we push any user request to go to
       * a level on the level stack.
       */
      onEvent: function (event) {
        if (event.name === 'goToLevel'
          && event.level !== self.level) {
          self.pushLevel(event.level);
        }
      }
    });

    var closed = new Fsm.State({
      fsm: self.fsm,
      name: 'closed',
      onEntry: function () {
        console.log('Door closed');
        // If there is a channel in the stack,
        // we move to that channel.
        if (self.stack[0]) {
          this.transitionTo(moving);
        }
      },

      /**
       * When the elevator's doors are closed,
       * we wait for a request to move to another
       * level.
       */
      onEvent: function (event) {
        if (event.name === 'goToLevel') {
          if (event.level === self.level) {
            this.transitionTo(open);
          } else {
            self.pushLevel(event.level);
            this.transitionTo(moving);
          }
        }
      }
    });

    var moving = new Fsm.State({
      fsm: self.fsm,
      name: 'moving',

      onEntry: function () {
        var state = this;
        var next = self.stack.shift();

        console.log('Moving to level', next);
        setTimeout(function () {
          console.log('Reached level', next);
          self.level = next;
          state.transitionTo(open);
        }, TIME_PER_LEVEL * Math.abs(next - self.level));
      },

      /**
       * As the elevator is currently moving and
       * cannot change direction nor open the
       * doors, we push any user request to go to
       * a level on the level stack.
       */
      onEvent: function (event) {
        if (event.name === 'goToLevel') {
          self.pushLevel(event.level);
        }
      }
    });

    this.fsm.start(closed);
};

/**
 * States whether the elevator is already scheduled
 * to go to the given level.
 * TODO: We could be using a binary search to insert
 * the levels and look for them.
 */
Elevator.prototype.isduplicate = function (level) {
    for (var i = 0; i < this.stack.length; ++i) {
        if (this.stack[i] === level) {
            return true;
        }
    }
    return false;
};

/**
 * Schedules the elevator to go to the given level,
 * if it is not already.
 */
Elevator.prototype.pushLevel = function (level) {
    if (!this.isduplicate(level)) {
        this.stack.push(level);
    }
};

/**
 * Requests the elevator to go to the
 * given level.
 */
Elevator.prototype.goToLevel = function (level) {
   this.fsm.postEvent({ name: 'goToLevel', level: level });
};

var elevator = new Elevator();
elevator.goToLevel(1);
elevator.goToLevel(5);
```

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

### Deployment

If you want to version the produced binaries, you can use Grunt to deploy this project in two ways :

 - Pushing the built binaries to the `release` branch associated with the Git repository of this project
 - Push the binaries to the `release` branch, and additionally, tag the binaries with the project's `package.json` version
 
To deploy the project in a continuous integration system, or simply using your development machine, you can use one, or both of the following commands :

```bash
# This will build the project and push the binaries to
# the `release` branch.
grunt release

# This will do the same as the previous command, but will
# also tag the binaries on the remote Git origin.
grunt tag
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
