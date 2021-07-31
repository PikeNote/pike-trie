var server = require("../trie-server/server.js");
var fs = require('fs');
var tap = require("tap");

function requestInject(fastify, url, payload, method) {
    return new Promise(function(resolve, reject) {
        fastify.inject({
            method: method,
            payload: payload,
            url: url
        }, (err, response) => {
            resolve([err, response])
        });
    })
}

tap.beforeEach(async (t) => {
    const fastify = server();

    t.teardown(() => fastify.close());

    requestInject(fastify, '/resetTrie', {}, 'GET');
});

tap.test('Testing of the main root directory', t => {
    t.plan(3)

    const fastify = server();

    t.teardown(() => fastify.close())

    requestInject(fastify, '/', {}, 'GET').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload), {
            "status": '100x'
        })
    })
});

tap.test('Testing clear of the trie', t => {
    t.plan(3)

    const fastify = server();

    t.teardown(() => fastify.close())

    requestInject(fastify, '/resetTrie', {}, 'GET').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload), {
            "status": '100x',
            "result": "Trie cleared!"
        })
    })
});

tap.test('Testing adding/removing words to the trie', t => {
    var randomString = (Math.random() + 1).toString(36).substring(7); // Random input from (https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript) 
    t.plan(12)

    const fastify = server();

    t.teardown(() => fastify.close())

    function addTrie() {
        requestInject(fastify, '/addTrie', {
            "input": randomString
        }, 'POST').then((promise) => {
            let err = promise[0];
            let response = promise[1];
            t.error(err)
            t.equal(response.statusCode, 200)
            t.same(JSON.parse(response.payload), {
                "status": '100x',
                "result": "Operation added to queue!"
            })

            requestInject(fastify, '/searchTrie', {
                "input": randomString
            }, 'POST').then((promise) => {
                let err = promise[0];
                let response = promise[1];
                t.error(err)
                t.equal(response.statusCode, 200)
                t.same(JSON.parse(response.payload), {
                    "status": '100x',
                    "result": true
                })
                removeTrie();
            })
        })
    }

    function removeTrie() {

        requestInject(fastify, '/removeTrie', {
            "input": randomString
        }, 'POST').then((promise) => {
            let err = promise[0];
            let response = promise[1];
            t.error(err)
            t.equal(response.statusCode, 200)
            t.same(JSON.parse(response.payload), {
                "status": '100x',
                "result": "Operation added to queue!"
            })

            requestInject(fastify, '/searchTrie', {
                "input": randomString
            }, 'POST').then((promise) => {
                let err = promise[0];
                let response = promise[1];
                t.error(err)
                t.equal(response.statusCode, 200)
                t.same(JSON.parse(response.payload), {
                    "status": '100x',
                    "result": false
                })
            })
        })
    }

    addTrie();
});

tap.test('Adding/removing duplicate entries', t => {
    var randomString = (Math.random() + 1).toString(36).substring(7); // Random input from (https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript) 
    t.plan(12)

    const fastify = server();

    t.teardown(() => fastify.close())

    function addTrie() {
        requestInject(fastify, '/addTrie', {
            "input": randomString
        }, 'POST').then((promise) => {
            let err = promise[0];
            let response = promise[1];
            t.error(err)
            t.equal(response.statusCode, 200)
            t.same(JSON.parse(response.payload), {
                "status": '100x',
                "result": "Operation added to queue!"
            })
        })

        requestInject(fastify, '/addTrie', {
            "input": randomString
        }, 'POST').then((promise) => {
            let err = promise[0];
            let response = promise[1];
            t.error(err)
            t.equal(response.statusCode, 200)
            t.same(JSON.parse(response.payload), {
                "status": '102x',
                "result": "Word is already in the trie!"
            })
            removeTrie();
        })
    }

    function removeTrie() {
        requestInject(fastify, '/removeTrie', {
            "input": randomString
        }, 'POST').then((promise) => {
            let err = promise[0];
            let response = promise[1];
            t.error(err)
            t.equal(response.statusCode, 200)
            t.same(JSON.parse(response.payload), {
                "status": '100x',
                "result": "Operation added to queue!"
            })
        })

        requestInject(fastify, '/removeTrie', {
            "input": randomString
        }, 'POST').then((promise) => {
            let err = promise[0];
            let response = promise[1];
            t.error(err)
            t.equal(response.statusCode, 200)
            t.same(JSON.parse(response.payload), {
                "status": '102x',
                "result": "Word does not exist in the trie!"
            })
        })
    }

    addTrie();
});

tap.test('Rapid 200 word adds/removes', t => {
    t.plan(6)

    const fastify = server();

    t.teardown(() => fastify.close())


    var charArray = []
    for (var i = 0; i < 200; i++) charArray[i] = (Math.random() + 1).toString(36).substring(7); // Random input from (https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript)

    for (i = 0; i < charArray.length; i++) {
        requestInject(fastify, '/addTrie', {
            "input": charArray[i]
        }, 'POST');
    }

    requestInject(fastify, '/queryTrie', {
        "input": ""
    }, 'POST').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload)["result"].filter(t => (!charArray.includes(t))), [])
    })

    for (i = 0; i < charArray.length; i++) {
        requestInject(fastify, '/removeTrie', {
            "input": charArray[i]
        }, 'POST');
    }

    requestInject(fastify, '/queryTrie', {
        "input": ""
    }, 'POST').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload)["result"], [])
    })
})

tap.test("Not including parameter in request", t => {
    t.plan(6)

    const fastify = server();

    t.teardown(() => fastify.close())

    requestInject(fastify, '/addTrie', {}, 'POST').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload), {
            "status": '102x',
            "result": "No proper parameter provided"
        })
    })

    requestInject(fastify, '/removeTrie', {}, 'POST').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload), {
            "status": '102x',
            "result": "No proper parameter provided"
        })
    })
});

tap.test("Query non-existant words", t => {
    t.plan(3)

    const fastify = server();

    t.teardown(() => fastify.close())

    requestInject(fastify, '/queryTrie', {
        "input": "qwerty"
    }, 'POST').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload)["result"], [])
    })
});

tap.test("Executing in the correct order", t => {
    t.plan(3)

    const fastify = server();

    t.teardown(() => fastify.close())

    async function addRemove() {
        requestInject(fastify, '/addTrie', {
            "input": "Duplication test"
        }, 'POST');

        requestInject(fastify, '/removeTrie', {
            "input": "Duplication test"
        }, 'POST');
    }

    addRemove();

    requestInject(fastify, '/searchTrie', {
        "input": "Duplication test"
    }, 'POST').then((promise) => {
        let err = promise[0];
        let response = promise[1];
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(JSON.parse(response.payload), {
            "status": '100x',
            "result": false
        })
    })
});