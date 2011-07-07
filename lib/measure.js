var ss = require("simple-storage");

if (!ss.storage.measurements)
    ss.storage.measurements = {};

Array.prototype.avg = function() {
    var av = 0;
    var cnt = 0;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var e = +this[i];
        if(!e && this[i] !== 0 && this[i] !== '0') e--;
        if (this[i] == e) {
            av += e;
            cnt++;
        }
    }
    
    return av/cnt;
}
    
/**
 * Checks if any data is stored in storage
 *
 * @return boolean
 */
exports.exists = function(url){
    return (ss.storage.measurements[url] && ss.storage.measurements[url].length);
};
    
/**
 * Returns array with all measurements for url.
 * If storage is empty then return an empty array.
 *
 * @return array
 */
exports.get = function(url){
    if (this.exists(url)){
        return ss.storage.measurements[url];
    } else {
        return [];
    }
};
    
/**
 * Adding new measurement to pool
 *
 * @return this
 */
exports.add = function(url, time){
    if (!this.exists(url)){
        ss.storage.measurements[url] = [];
    }

    ss.storage.measurements[url].push(time);

    return this;
};

/**
 * Clear all measurements for specified url
 *
 * @return boolean
 */
exports.clear = function(url){
    ss.storage.measurements[url] = [];

    return true;
};

/**
 * Returns average for stored measurements
 *
 * @return int|float
 */
exports.getAverage = function(url){
    if (this.exists(url)){
        return ss.storage.measurements[url].avg();
    }
};

/**
 * Returns last loading time stored in db
 *
 * @return int|null
 */
exports.getLast = function(url){
    if (ss.storage.measurements[url] && ss.storage.measurements[url].length) {
        return ss.storage.measurements[url][ss.storage.measurements[url].length - 1];
    }

    return null;
};
