var jam = {
    "packages": [
        {
            "name": "lodash",
            "location": "jam/lodash",
            "main": "dist/lodash.compat.js"
        },
        {
            "name": "qwery",
            "location": "jam/qwery",
            "main": "./qwery.js"
        },
        {
            "name": "ractive",
            "location": "jam/ractive",
            "main": "Ractive.js"
        },
        {
            "name": "reqwest",
            "location": "jam/reqwest",
            "main": "./reqwest.js"
        }
    ],
    "version": "0.2.17",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "lodash",
            "location": "jam/lodash",
            "main": "dist/lodash.compat.js"
        },
        {
            "name": "qwery",
            "location": "jam/qwery",
            "main": "./qwery.js"
        },
        {
            "name": "ractive",
            "location": "jam/ractive",
            "main": "Ractive.js"
        },
        {
            "name": "reqwest",
            "location": "jam/reqwest",
            "main": "./reqwest.js"
        }
    ],
    "shim": {}
});
}
else {
    var require = {
    "packages": [
        {
            "name": "lodash",
            "location": "jam/lodash",
            "main": "dist/lodash.compat.js"
        },
        {
            "name": "qwery",
            "location": "jam/qwery",
            "main": "./qwery.js"
        },
        {
            "name": "ractive",
            "location": "jam/ractive",
            "main": "Ractive.js"
        },
        {
            "name": "reqwest",
            "location": "jam/reqwest",
            "main": "./reqwest.js"
        }
    ],
    "shim": {}
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}