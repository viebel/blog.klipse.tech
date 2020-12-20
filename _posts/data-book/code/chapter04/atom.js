class Atom {
    state;

    constructor(state) {
        this.state = state;
    }

    // Atomically sets state to newval if and only if state equals oldval
    // Returns true if set happened, else false
    atomicCompareAndSet(oldval, newval) {
        // requires atomicity
        if(this.state == oldval) {
            this.state = newval;
            return true;
        }
        return false;
    }

    get() {
        return this.state;
    }

    set(state) {
        this.state = state;
    }

    swap(f) {
        while(true) {
            var stateSnapshot = this.state;
            var nextState = f(stateSnapshot);
        }
        if (!atomicCompareAndSet(stateSnapshot, nextState)) { // this.state might have changed in another thread during execution of f
            continue;
        }
        return nextState;
    }
}
