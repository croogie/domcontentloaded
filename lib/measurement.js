var ss = require("simple-storage");

if (!ss.storage.measurements)
    ss.storage.measurements = {};
    
var m = ss.storage.measurements;

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

var exports = {
    
    /**
     * Checks if any data is stored in storage
     * 
     * @return boolean
     */
    exists: function(url){
        return (m[url] && m[url].length);
    },
    
    /**
     * Returns array with all measurements for url. 
     * If storage is empty then return an empty array.
     * 
     * @return array
     */
    get: function(url){
        if (this.exists(url)){
            return m[url];
        } else {
            return [];
        }
    },
    
    /**
     * Adding new measurement to pool
     * 
     * @return this
     */
    add: function(url, time){
        if (!this.exists(url)){
            m[url] = [];
        }
        
        m[url].push(time);
        
        return this;
    },

    /**
     * Clear all measurements for specified url
     * 
     * @return boolean
     */
    clear: function(url){
        m[url] = [];
        
        return true;
    },

    /**
     * Returns average for stored measurements
     * 
     * @return int|float
     */
    getAverage: function(url){
        if (this.exists(url)){
            return m[url].avg();
        }
    },

    /**
     * Returns last loading time stored in db
     * 
     * @return int|null
     */
    getLast: function(url){
        if (m[url] && m[url].length) {
            return m[url][m[url].length - 1];
        }
        
        return null;
    }
};