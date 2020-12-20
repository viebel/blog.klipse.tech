Consistency.resolveConflicts = function(currentSystemData,
                                        claimedCurrentSystemData,
                                        nextSystemData) {
    if(detectConflicts(currentSystemData, claimedCurrentSystemData)) {
        throw "Concurrent mutation detected. Aborting...";
    }
    return nextSystemData;
}
