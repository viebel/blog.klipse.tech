DataDiff.leaves = function(obj, prefix = '') {
    return _.reduce(obj,
                    function(acc, v, k) {
                        if (_.isObject(v)) {
                            return _.concat(acc,
                                            DataDiff.leaves(v,
                                                            prefix + k + "."))
                        }
                        return _.concat(acc, [prefix + k]);
                    },
                    []);
}

DataDiff.isEmptyIntersection = function(delta1, delta2) {
    return _.isEmpty(_.intersection(DataDiff.leaves(delta1),
                                    DataDiff.leaves(delta2)));
}
