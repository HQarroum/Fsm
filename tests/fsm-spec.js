define(['fsm'], function (Fsm) {
    
    /**
     * Fsm test plan.
     */
    describe('Fsm', function() {
	
        /**
         * Insert test.
         */
        it('should be able to be started given a new state', function () {
            var fsm = new Fsm();
            var state = new Fsm.State({
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
            var fsm = new Fsm();

            // Creating a `red` state.
            var red = new Fsm.State({
                name: 'red',
                fsm: fsm
            });

            // Creating a `green` state.
            var green = new Fsm.State({
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
         * Transition between states.
         */
        it('should be able to transition between states using events', function () {
            var fsm = new Fsm();

            // Creating a `red` state.
            var red = new Fsm.State({
                name: 'red',
                fsm: fsm,
                onEvent: function (event) {
                    if (event === 'green') {
                        this.transitionTo(green);
                    }
                }
            });

            // Creating a `green` state.
            var green = new Fsm.State({
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
            var fsm = new Fsm();
            
            var red = new Fsm.State({
                name: 'red',
                fsm: fsm,
                onEntry: function () {},
                onExit: function () {},
                onEvent: function () {}
            });

            var green = new Fsm.State({
                name: 'green',
                fsm: fsm,
                onEntry: function () {},
                onExit: function () {},
                onEvent: function () {}
            });

            // Spying on the red state callbacks.
            spyOn(red, "onEntry");
            spyOn(red, "onExit");
            spyOn(red, "onEvent");

            // Spying on the green state callbacks.
            spyOn(green, "onEntry");
            spyOn(green, "onExit");
            spyOn(green, "onEvent");

            // Starting the Fsm.
            fsm.start(red);
            // Testing whether the red state has been
            // entered.
            expect(red.onEntry).toHaveBeenCalled();
            expect(red.onExit).not.toHaveBeenCalled();
            expect(red.onEvent).not.toHaveBeenCalled();
            // Transitioning to the green state.
            fsm.transitionTo(green);
            // Testing whether the green state has been
            // entered.
            expect(red.onExit).toHaveBeenCalled();
            expect(green.onEntry).toHaveBeenCalled();
            expect(green.onExit).not.toHaveBeenCalled();
            expect(green.onEvent).not.toHaveBeenCalled();
            // Posting an event.
            fsm.postEvent({ foo: 'bar'});
            // Testing whether the current state's `onEvent`
            // callback has been called.
            expect(green.onEvent).toHaveBeenCalledWith({ foo: 'bar' });
        });
    
    });

});
