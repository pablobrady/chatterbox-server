/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var storage = [];

exports.requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";

  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;
  if(request.method==="POST") {
    console.log('POST REQUEST');
    statusCode = 201;
    var postBody = '';
    request.on('data', function(data){
      postBody += data;
    })
    request.on('end', function(){
      var post = JSON.parse(postBody)
      post['createdAt'] = Date.now()
      console.log('post @ 35: ', post);
      storage.push(post);
      console.log('storage @ 36: ', storage);
    })
    response.writeHead(statusCode, headers);
    var responseData = { results: storage };
    response.end( JSON.stringify(responseData) );
  } else if (request.method === 'GET') {
    var tempArray = String(request.url).split('createdAt=');
    var passedInCreatedAt = tempArray[1];

    var tempStorage = [];
    for(var i=0; i<storage.length; i++) {
      if(storage[i].createdAt > passedInCreatedAt) {
        tempStorage.push(storage[i]);
      }
    }

    response.writeHead(statusCode, headers);
    var responseData = { results: tempStorage };
    response.end( JSON.stringify(responseData) );
  } else if (request.method === 'OPTIONS') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    // var responseData = { results: storage };
    response.end();
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

