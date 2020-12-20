class SystemData {
    systemData;
    previousSystemData;

    get() {
        return this.systemData;
    }

    set(_systemData) {
        this.systemData = _systemData;
    }

    commit(previous, next) {
        var systemDataBeforeUpdate = this.systemData;
        if(!Consistency.validate(previous, next) {
            throw "The system data to be committed is not valid!";
        });
        this.systemData = SystemConsistency.reconcile(systemData,
                                                      previous,
                                                      next);
        this.previousSystemData = systemDataBeforeUpdate;
    }

    undo() {
        this.systemData = this.previousSystemData;
    }
}
