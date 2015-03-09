/**
 * Created by Ivan on 05.03.2015.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "whiteboardendpoint";
var websocket = new WebSocket(wsUri);

websocket.onerror = function (evt) {
    onError(evt)
};
websocket.onmessage = function (evt) {
    onMessage(evt)
};

function sendText(json) {
    console.log("sending text: " + json);
    websocket.send(json);
}

function onMessage(evt) {
    console.log("received: " + evt.data);
    drawImageText(evt.data);
}
function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}