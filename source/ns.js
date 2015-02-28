(function() {
    window['ds'] = window['ds'] || {};
    var _modules = {};
    var _services = {};

    ds['extend'] = function(obj, props) {
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    };

    ds['module'] = function (module, dependencies) {
        var getDependencies = function (dependencies) {
            for (var i = 0; i < dependencies.length; i++) {
                var children = _modules[dependencies[i]];
                _modules[module] = _modules[module].concat(children);
                getDependencies(children);
            }
        };
        var build = function (inject) {
            var fn = inject[inject.length - 1];
            var args = [];
            for (var i = 0; i < inject.length - 1; i++) {
                var d = _services[module][inject[i]];
                args.push(d);
            }
            return fn.apply(this, args);
        };
    
        _modules[module] = _modules[module] || [];
        _services[module] = _services[module] || {};
    
        if (dependencies && dependencies.length > 0) {
            _modules[module] = _modules[module].concat(dependencies);
            getDependencies(dependencies);
            dependencies = _modules[module];
            for (var i = 0; i < dependencies.length; i++) {
                ds.extend(_services[module],_services[dependencies[i]]);
            }
        }

        var provider = function(name, inject) {
            _services[module][name] = build(inject);
            return moduleRtn;
        };
        var moduleRtn = {

            'factory': provider,
            'controller': provider

        };
        return moduleRtn;
    };
})();