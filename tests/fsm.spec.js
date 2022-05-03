import Fsm from '../fsm.js';
import sinon from 'sinon';

/**
 * Fsm test plan.
 */
describe('Fsm', function() {
  let fsm;

  /**
   * On each test, we create a new fsm.
   */
  beforeEach(function () {
    fsm = new Fsm();
  });

  /**
   * Initial state test.
   */
  it('should be able to be started given a new state', function () {
    const state = new Fsm.State({
      name: 'state',
      fsm: fsm
    });

    expect(state.name()).toEqual('state');
    fsm.start(state);
    expect(fsm.state()).toBe(state);
  });

  /**
   * Transition between states.
   */
  it('should be able to transition between states', function () {
    // Creating a `red` state.
    const red = new Fsm.State({
      name: 'red',
      fsm: fsm
    });

    // Creating a `green` state.
    const green = new Fsm.State({
      name: 'green',
      fsm: fsm
    });

    fsm.start(red);
    fsm.transitionTo(green);
    expect(fsm.state()).toBe(green);
    fsm.transitionTo(red);
    expect(fsm.state()).toBe(red);
  });

  /**
   * Transition between states using events.
   */
  it('should be able to transition between states using events', function () {
    // Creating a `red` state.
    const red = new Fsm.State({
      name: 'red',
      fsm: fsm,
      onEvent: function (event) {
        if (event === 'green') {
            this.transitionTo(green);
        }
      }
    });

    // Creating a `green` state.
    const green = new Fsm.State({
      name: 'green',
      fsm: fsm,
      onEvent: function (event) {
        if (event === 'red') {
            this.transitionTo(red);
        }
      }
    });

    fsm.start(red);
    fsm.postEvent('green');
    expect(fsm.state()).toBe(green);
    fsm.postEvent('red');
    expect(fsm.state()).toBe(red);
    fsm.postEvent('red');
    expect(fsm.state()).toBe(red);
  });

  /**
   * State lifecycle test.
   */
  it('should respect the states lifecycle', function () {
    const red = new Fsm.State({
      name: 'red',
      fsm: fsm,
      onEntry: function () {},
      onExit: function () {},
      onEvent: function () {}
    });

    const green = new Fsm.State({
      name: 'green',
      fsm: fsm,
      onEntry: function () {},
      onExit: function () {},
      onEvent: function () {}
    });

    // Spying on the red state callbacks.
    const onEntryRedSpy = sinon.spy(red, "onEntry");
    const onExitRedSpy = sinon.spy(red, "onExit");
    const onEventRedSpy = sinon.spy(red, "onEvent");

    // Spying on the green state callbacks.
    const onEntryGreenSpy = sinon.spy(green, "onEntry");
    const onExitGreenSpy = sinon.spy(green, "onExit");
    const onEventGreenSpy = sinon.spy(green, "onEvent");

    // Starting the Fsm.
    fsm.start(red);
    // Testing whether the red state has been
    // entered.
    expect(onEntryRedSpy.calledOnce);
    expect(onExitRedSpy.calledOnce);
    expect(onEventRedSpy.calledOnce);
    // Transitioning to the green state.
    fsm.transitionTo(green);
    // Testing whether the green state has been
    // entered.
    expect(onExitRedSpy.calledOnce);
    expect(onEntryGreenSpy.calledOnce);
    expect(onExitGreenSpy.calledOnce);
    expect(onEventGreenSpy.calledOnce);
    // Posting an event.
    fsm.postEvent({ foo: 'bar'});
    // Testing whether the current state's `onEvent`
    // callback has been called.
    expect(onEventGreenSpy.calledOnce);
  });
});
