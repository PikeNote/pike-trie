/*jshint esversion: 6 */ 

function buildServer() {
  const fastify = require('fastify')({
    logger: false
  });
  
  var queueProcesser = require('./queueProcessing.js');
  
  var queue = new queueProcesser.queue();
  
  /* 
  Internal Response Codes
  100x - Success
  101x - Failed (unknown cause)
  102x - Failed (with cause)
  103x - Maintaince
  */
  
  /* Main Webserver */
  
  // Form body extension
  // Enables post requests
  fastify.register(require('fastify-formbody'));
  
  fastify.get('/', (request, reply) => {
    reply
      .code(200)
      .send({ "status": '100x' });
  });
  
  
  fastify.post('/addTrie', (req, reply) => {
    var word = checkInput(req.body, reply);
    if (word) {
      var queueChecks = queue.addQueue(word, "add");
      reply
        .code(200)
        .send({ "status": queueChecks[0], "result": queueChecks[1] });
    }
  });
  
  fastify.post('/removeTrie', (req, reply) => {
    var word = checkInput(req.body, reply);
    if (word) {
      word = req.body.input.toLowerCase();
      var queueChecks = queue.addQueue(word, "remove");
      reply
        .code(200)
        .send({ "status": queueChecks[0], "result": queueChecks[1] });
    }
  });
  
  fastify.post('/queryTrie', (req, reply) => {
    var word = req.body.input || "";
  
    var queryTrieResults = queueProcesser.queryTrie(word);
  
    reply
      .code(200)
      .send({ "status": queryTrieResults[0], "result": queryTrieResults[1] });
  
  });
  
  fastify.post('/searchTrie', (req, reply) => {
    var word = checkInput(req.body, reply);
    if (word) {
      var queryTrieResults = queueProcesser.searchTrie(word, true);
  
      reply
        .code(200)
        .send({ "status": "100x", "result": queryTrieResults[0] });
    }
  });
  
  fastify.get('/resetTrie', (request, reply) => {
    queueProcesser.resetNode();
    reply
      .code(200)
      .send({ "status": '100x', "result":"Trie cleared!"});
  });
  
  function checkInput(postInput, reply) {
    if ("input" in postInput && postInput.input != "") {
      return postInput.input.toLowerCase();
    } else {
      reply
        .code(200)
        .send({ "status": "102x", "result": "No proper parameter provided" });
      return false;
    }
  }
  return fastify;
}

module.exports = buildServer;
