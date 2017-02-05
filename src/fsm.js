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
            this.flagForChangeState = null;
            this.flagForTrigger = null;
            this.currentStateIndex = 0;
            this.storageOfStates = [this.state];
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
        if (!this.config.states[state]) {
            throw new Error("such state isn't exist");
        } else {
            this.flagForChangeState = true;
            this.currentStateIndex++;
            this.state = state;
            this.storageOfStates = this.storageOfStates.slice(0, this.currentStateIndex);
            this.storageOfStates.push(this.state);
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var newState = this.config.states[this.state].transitions[event];
        if (!newState) {
            throw new Error("such event isn't exist");
        } else {
            this.currentStateIndex++;
            this.flagForTrigger = true;
            this.state = newState;
            this.storageOfStates = this.storageOfStates.slice(0, this.currentStateIndex);
            this.storageOfStates.push(this.state);
        }
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
        this.flagForChangeState = false;
        this.flagForTrigger = false;

        if (this.state == this.config.initial) {
            return false;
        } else if (this.storageOfStates.length > 0) {
            this.currentStateIndex --;
            this.state = this.storageOfStates[this.currentStateIndex];
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
        if (this.flagForChangeState || this.flagForTrigger) {
            return false;
        } else if (this.storageOfStates.length == 0) {
            return false;
        } else if (this.currentStateIndex < (this.storageOfStates.length - 1)) {
            this.currentStateIndex++;
            this.state = this.storageOfStates[this.currentStateIndex];
            return true;
        } else {
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
