/**
 * Created by Ivan on 05.03.2015.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "whiteboardendpoint";
var websocket = new WebSocket("ws://localhost:8080/WebSocketTomcatEE_war_exploded/gameendpoint");

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
    console.log("received onMessage websocket: " + evt.data);

}
function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}