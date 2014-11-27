
    ds.make.static.class({
        type: 'string',
        compare: function (a, b) {
            if (a.toString() < b.toString()) return -1;
            if (a.toString() > b.toString()) return 1;
            return 0;
        }
    });

    ds.make.class({
        type: 'ArrayUtils.BinarySearch',
        properties: {
            array: []
        },
        constructor: function (array) {
            if (!array || array.length == 0) throw 'The array needs to have some elements in it!';
            array.sort();
            this.array = array;
        },
        search: function (search) {
            var array = this.array;
            var length = array.length;
            var index = Math.floor(array.length * 0.5);

            while (length > 1) {
                var cmp = string.compare(search, array[index]);
                if (cmp == 0) return index;

                length = Math.ceil(length * 0.5);
                var half = Math.ceil(length * 0.5);
                index = index + (half * cmp);
            }
            return -1;
        }
    });

    // now lets test it
    var a = new ArrayUtils.BinarySearch(array);
    
    // accuracy test
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        var index = array.indexOf(item);
        var bindex = a.search(item);
        if (array[index] != array[bindex]) throw 'The binary search result was incorrect!  i: ' +i +'  item: '+item+'  index: '+index + '>' +array[index]+'  bindex: '+bindex +'>' +array[bindex];
    }

    // speed test
    var iterations = 1000000;
    var old_time = (new Date()).getTime();
    for (var i = 0; i < iterations; i++) {
        var item = array[Math.floor(Math.random() * array.length)];
        var index = array.indexOf(item);
    }
    var new_time = (new Date()).getTime();
    var seconds_passed_indexOf = (new_time - old_time)/1000;

    old_time = (new Date()).getTime();
    for (var i = 0; i < iterations; i++) {
        var item = array[Math.floor(Math.random() * array.length)];
        var index = a.search(item);
    }
    new_time = (new Date()).getTime();
    var seconds_passed_binary_search = (new_time - old_time)/1000;

    console.log(iterations + ' iterations\nindexOf:\t\t' + seconds_passed_indexOf + '\nbinary search:\t\t' + seconds_passed_binary_search)