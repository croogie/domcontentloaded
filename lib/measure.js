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

exports.getValues = function(url){
    if (!this.exists(url)){
        return [];
    }
    
    var values = [];
    for (var i in ss.storage.measurements[url]) {
        if ('object' == typeof ss.storage.measurements[url][i])
            values.push(ss.storage.measurements[url][i][0]);
    }
    
    return values;
}

/**
 * Counts entries in specified url
 * @param string url
 */
exports.count = function(url){
    if (this.exists(url)) {
        return ss.storage.measurements[url].length
    }

    return 0;
}

/**
 * Adding new measurement to pool
 *
 * @return this
 */
exports.add = function(url, time){
    var avg = 0;

    if (!this.exists(url)){
        ss.storage.measurements[url] = [];
        avg = time;
    } else {
        values = this.getValues(url);
        values.push(time);
        
        avg = values.avg();
    }

    ss.storage.measurements[url].push([time, avg]);

    return [time, avg];
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
        var avg, value;
        [value, avg] = this.getLast(url);
        return avg;
    }
    
    return null;
};

/**
 * Returns last loading time stored in db
 *
 * @return int|null
 */
exports.getLast = function(url){
    var value, avg;
    if (this.exists(url)) {
        return ss.storage.measurements[url][ss.storage.measurements[url].length - 1];
    }

    return null;
};
