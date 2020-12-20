class SystemData {
    systemData;

    constructor() {
        this.systemData = new Atom();
    }

    get() {
        return systemData.get();
    }

    set(data) {
        this.systemData.reset(data);
    }

    validate(previousSystemData, nextSystemData) {
        // cross reference books and authors
        return true;
    }

    update(previousSystemData, nextSystemData) {
        if(!validate(previousSystemData, nextSystemData)) {
            throw "The desired next system data is not valid";
        }
        this.systemData.swap(function(current) {
            return Conflict.resolve(current,
                                    previousSystemData,
                                    nextSystemData);
        });
    }
}
