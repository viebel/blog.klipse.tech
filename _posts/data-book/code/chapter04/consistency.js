class SystemConsistency {
    static threeWayMerge(current, previous, next) {
        var previousToCurrent = DataDiff.diff(previous, current);
        var previousToNext = DataDiff.diff(previous, next);
        if(DataDiff.isEmptyIntersection(previousToCurrent, previousToNext)) {
            return _.merge(current, previousToNext);
        }
        throw "Conflicting concurrent mutations.";
    }
    static reconcile(current, previous, next) {
        if(current == previous) {
            // fast forward
            return next;
        }
        return SystemConsistency.threeWayMerge(current,
                                               previous,
                                               next);
    }
}
window.SystemConsistency = SystemConsistency;
