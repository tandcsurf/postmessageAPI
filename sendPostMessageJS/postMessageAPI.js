let postMessageAPI = {};

postMessageAPI.sendPostMessage = function (dataObject, callback) {
  //add an event listener to the window, listening for a 'message' event from outside domains
  window.addEventListener('message', eventListener);
  //this is the listener function for a 'message' event, for when another domain gets our postMessage, and sends back some data in a postMessage
  function eventListener(e) {
    //if origin is whitelist-approved, test for message type, and place data accordingly
    if (checkWhiteList(e.origin)) {
      //if the data incoming is from a post request, plunk it down into the DOM under "returned post data".
      //otherwise, send it to the GET results section
      if (e.data.type === "post") {
        callback(e.data);
        resultsPost = `confirmed! cc: ${e.data.cc} cvv: ${e.data.cvv}`;
        window.removeEventListener('message', eventListener);
      } else {
        callback(e.data);
        resultsGet = e.data.Message;
        window.removeEventListener('message', eventListener);
      }
    } else {
      return
    }
  }
  //insert loading message into results areas
  if (dataObject.type === 'get') {
    resultsGet.innerHTML = "loading...";
  } else if (dataObject.type === 'post') {
    resultsPost.innerHTML = "loading...";
  }
  //send postMessage
  receiver.postMessage(JSON.stringify(dataObject), 'http://localhost:8001');
};
