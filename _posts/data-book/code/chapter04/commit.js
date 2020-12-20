SystemData.commit = function(previous, next) {
    if(!Consistency.validate(previous, next) {
        throw "The system data to be committed is not valid!";
    });
    this.systemData = SystemConsistency.reconcile(this.systemData,
                                                  previous,
                                                  next);
}
