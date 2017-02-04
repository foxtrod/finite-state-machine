class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error("config isn't passed");
        } else {
            this.state = config.initial;
            this.config = config;
            //this.prevState = null;
            //this.nextState = null;
            this.flagForChangeState = null;
            this.flagForTrigger = null;
            this.count = 0;
            this.storageOfStates = [];
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        this.count++;
        this.storageOfStates[this.count] = this.state;
        this.flagForChangeState = false;
        if (!this.config.states[state]) {
            throw new Error("such state isn't exist");
        } else {
            this.prevState = this.state;
            this.state = state;
            this.count++;
            this.storageOfStates[this.count] = this.state;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.count++;
        this.storageOfStates[this.count] = this.state;
        this.flagForTrigger = false;
        var newState = this.config.states[this.state].transitions[event];
        if (!newState) {
            throw new Error("such event isn't exist");
        }
        this.prevState = this.state;
        this.state = newState;
        this.count++;
        this.storageOfStates[this.count] = this.state;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {

        var states = Object.keys(this.config.states);
        var statesOfEvent = [];

        if (!event) {
            return states;
        }
        for (var i = 0; i < states.length; i++) {
            var transitions = this.config.states[states[i]].transitions;
            if (transitions[event]) {
                statesOfEvent.push(states[i]);
            }
        }
        return statesOfEvent;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        this.flagForChangeState = true;
        this.flagForTrigger = true;

        if (this.storageOfStates.length > 0) {
            this.count--;
            if (this.count == 0) {
                this.state = this.config.initial;
                return false;
            } else {
                this.state = this.storageOfStates[this.count];
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        this.count++;
        if ((this.state = this.storageOfStates[this.count])) {
            return true;
        } else if (this.flagForChangeState) {
            return false;
        } else if (this.flagForTrigger) {
            return false;
        } else if (this.config.initial) {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.storageOfStates = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
