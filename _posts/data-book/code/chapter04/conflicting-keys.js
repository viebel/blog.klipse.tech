var sentinel = {};
function diffObjects(data1, data2) {
    if(data1 == data2) {
        return sentinel;
    }
    var emptyObject = _.isArray(data1) ? [] : {};
    var keys = _.union(_.keys(data1), _.keys(data2));
    var res= _.reduce(keys,
                      function (acc, k) {
                          var res = diff(_.get(data1, k),
                                         _.get(data2, k));
                          if(res !== sentinel) {
                              return _.set(acc, [k], res);
                          }
                          return acc;
                      },
                      emptyObject);
    if(_.isEmpty(res)) {
        return sentinel;
    }
    return res;
}

function diff(data1, data2) {
    if(_.isObject(data1) && _.isObject(data2)) {
        return diffObjects(data1, data2);
    }
    if(data1 !== data2) {
        return data2;
    }
    return sentinel;
}
function leaves(obj, prefix = '') {
    return _.reduce(obj,
                    function(acc, v, k) {
                        if (_.isObject(v)) {
                            return _.concat(acc,
                                            leaves(v,
                                                   prefix + k + "."))
                        }
                        return _.concat(acc, [prefix + k]);
                    },
                    []);
}
data1 = {x:1, y: {z: [2]}, w: [], f:[]}
data2 = {x:1, y: {z: [3]}, z:5, f: []}
diff(data1, data2)

