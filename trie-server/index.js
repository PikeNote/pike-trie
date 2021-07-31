const server = require("./server");
var fastify = server();

fastify.listen(
  3000,
  '0.0.0.0',
  function(err, address) {
    if (err) throw err;
  }
);