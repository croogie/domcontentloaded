var m = require('measure');
var url = 'onet.pl';

exports.test_add = function(test) {
    m.clear(url);

    m.add(url, 10);
    test.assertEqual(m.getLast(url), 10);

    m.add(url, 0);
    test.assertEqual(m.getLast(url), 0);

    m.add(url, 5.5);
    test.assertEqual(m.getLast(url), 5.5);
    
    test.done();
}

exports.test_avg = function(test){
    m.clear(url);
    
    m.add(url, 10);
    test.assertEqual(m.getAverage(url), 10);

    m.add(url, 20);
    test.assertEqual(m.getAverage(url), 15);

    m.add(url, 0);
    m.add(url, 0);
    test.assertEqual(m.getAverage(url), 7.5);
    
    test.done();
}

exports.test_get = function(test){
    m.clear(url);
    
    m.add(url, 10);
    test.assertEqual(String(m.get(url)), String([10]));
    
    m.add(url, 5.5);
    test.assertEqual(String(m.get(url)), String([10, 5.5]));

    m.add(url, 0);
    test.assertEqual(String(m.get(url)), String([10, 5.5, 0]));
}