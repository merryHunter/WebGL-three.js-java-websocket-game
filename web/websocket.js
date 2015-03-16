/**
 * Created by Ivan on 05.03.2015.
 * chernuhaiv@gmail.com
 */
/*====================WEbSocket connection=====================*/
var wsUri = "ws://" + document.location.host + document.location.pathname + "whiteboardendpoint";
var websocket = new WebSocket("ws://localhost:8080/WebSocketTomcatEE_war_exploded/gameendpoint");

var jsonObjectField = null;
var jsonObjectScore = null;
var jsonObjectPlayerWin = null;

var jsonObject;
var field;
var N = 10;
var EMPTY = 0;
var APPLE = 1;
var HEDGEHOG = 2;
var PLANE_SIZE = 1000;
var currentI = 0, currentJ = 0;
var updatedModel = false;
function Apple(mesh) {
    this.mesh = mesh;
    this.eaten = false;

}


websocket.onerror = function (evt) {
    onError(evt)
};

websocket.onmessage = function (evt) {
    onMessage(evt)
};

websocket.onopen = function (evt) {
    //websocket.send("open");
}

function sendText(json) {
    console.log("sending text: " + json);
    websocket.send(json);
}

function onMessage(evt) {
    console.log("received onMessage websocket: " + evt.data);
    parseJSONToObject(evt);
    if (jsonObjectPlayerWin !== null) {
        gameEnd();
    }

}

function parseJSONToObject(evt) {
    jsonObject = JSON.parse(evt.data);
    var name = null;
    for (var i in jsonObject) { //Get the first property to act as name
        name = i;
        break;
    }
    switch (name) {
        case "score":
            jsonObjectScore = jsonObject;
            break;
        case "winner":
            jsonObjectPlayerWin = jsonObject;
            break;
        case "field":
            jsonObjectField = jsonObject;
            field = new Array(N);
            for (var i = 0, k = 0; i < N; ++i) {
                field[i] = new Array(N);
                for (var j = 0; j < N; ++j, ++k) {
                    field[i][j] = jsonObjectField.field[k].v;
                }
            }
            updatedModel = true;
            break;
        default :
            onError(evt);
    }
}

function onError(evt) {
    //writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

/*=============================================================*/

var container,
    objects = [],
    apples = [],
    camera,
    scene,
    renderer,
    plane,
    mouse,
    raycaster;
var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff80, overdraw: 0.5});
var hedgehog = new THREE.Mesh(cubeGeometry, cubeMaterial);
start();
//render();


/* --=========================SCENE========================== */
// create a scene, that will hold all our elements such as objects, cameras and lights.
function start() {
    setTimeout(init, 5000);
}
function init() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    scene = new THREE.Scene();
    container = document.createElement('div');

    document.body.appendChild(container);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    //camera.position.set(500, 800, 1300);
    camera.position.set(500, 800, 1300);
    camera.lookAt(new THREE.Vector3());

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    initPlane();
    initLight();
    initModels();

    renderer.setClearColor(0xf0f0f0);
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('wheel', onDocumentWheel, false);
    /*====================================================*/

    window.addEventListener('resize', onWindowResize, false);

    render();

}

function initPlane() {
    /*========================= TEXTURE =========================*/

    var planeTexture = new THREE.ImageUtils.loadTexture('images/grass.jpg');
    planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(8, 8);
    var planeMaterial = new THREE.MeshBasicMaterial({map: planeTexture, side: THREE.DoubleSide});
    var planeGeometry = new THREE.PlaneBufferGeometry(PLANE_SIZE, PLANE_SIZE);
    planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //plane.position.y = -0.5;
    //plane.rotation.x = Math.PI / 2;
    //!!!
    //plane.position.set(-500,0,-500);
    scene.add(plane);
    objects.push(plane);
    /*======================== SKYBOX/FOG ========================*/
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
    /*======================= MODELS ==========================*/
    loadModels();

}

function loadModels() {
    var loader = new THREE.STLLoader();

    //???
    var hedgehogTexture = new THREE.ImageUtils.loadTexture('textures/hedgehogTexture.jpg');

    //var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
    var material = new THREE.MeshBasicMaterial({color: 0xAAAAAA, side: THREE.BackSide});
    loader.load('models/test1.stl', function (geometry) {
        //if (geometry.hasColors) {
        //  meshMaterial = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
        //}
        var meshMaterial = new THREE.MeshPhongMaterial({color: 0x7a030b, vertexColors: THREE.VertexColors});
        hedgehog = new THREE.Mesh(geometry, meshMaterial);
        hedgehog.position.set(5.5, 5.2, 2);
        //mesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 );
        hedgehog.scale.set(10, 10, 10);
        hedgehog.castShadow = true;
        hedgehog.receiveShadow = true;

        scene.add(hedgehog);
    });
}

function initLight() {
    var ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);
    var directionalLight = new THREE.DirectionalLight(0x808080);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);
}

function initModels() {
    if (field == null)
        return;
    var size = PLANE_SIZE / (2 * N);
    for (var i = 0; i < N; ++i) {
        for (var j = 0; j < N; ++j) {
            if (field[i][j] == APPLE) {
                var cubeGeometry = new THREE.BoxGeometry(size, size, size);
                var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff80, overdraw: 0.5});
                var meshApple = new THREE.Mesh(cubeGeometry, cubeMaterial);
                var apple = new Apple(meshApple);
                apples.push(apple);
                objects.push(meshApple);
                scene.add(meshApple);
            }
        }
    }

    hedgehog.position.x = 50;
    hedgehog.position.y = 25;
    hedgehog.position.z = 0;

    hedgehog.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    getCurrentPosIJ();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
    mouse.y = -( event.clientY / renderer.domElement.height ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        var intersect = intersects[0];
        //move hedgehog
        hedgehog.position.copy(intersect.point).add(intersect.face.normal);
        hedgehog.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        getCurrentPosIJ();
        /////
        for (var obj in objects) {
            if (objects[obj] == intersect.object) {
                for (var j in apples) {
                    if (apples[j].mesh == objects[obj]) {
                        apples[j].eaten = true;
                    }
                }
            }
        }
        /////
        /**
         * TODO:
         *rotate hedgehog orientation in forward to mouse click
         */
        //hedgehog.rotateOnAxis(new THREE.Vector3(0,1,0), 30);

    }
    updatedModel = false;
    var json = JSON.stringify({
        "pos": {
            "i": currentI,
            "j": currentJ
        }
    });
    sendText(json);
    setTimeout(render, 100);


}

function render() {
    updateView();

    renderer.render(scene, camera);
}

function onDocumentWheel(event) {
    event = event || window.event;
    var delta = event.wheelDelta;

    if (delta > 0) {
        camera.position.z -= 100;
    }
    else {
        camera.position.z += 100;
    }
    camera.updateProjectionMatrix();
    render();
}

function updateView() {
    if (jsonObjectField == null || apples == null)
        return;
    checkEatenApples();
    if (!updatedModel)
        return;
    var step = PLANE_SIZE / N;
    var translateX = -PLANE_SIZE / 2 + step / 2;
    var translateZ = -PLANE_SIZE / 2 + step / 2;
    var p = 0;
    for (var i = 0; i < N; ++i) {
        for (var j = 0; j < N; ++j) {
            if (field[i][j] == APPLE) {
                apples[p].eaten = false;
                apples[p].mesh.position.set(translateX, 25, translateZ);
                ++p;
            }
            translateX += step;
            /*
             {
             var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
             var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff80, overdraw: 0.5});
             var mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
             mesh.position.x = -20 * (k + 10 % 10);
             scene.add(mesh);
             objects.push(mesh);
             }
             */
        }
        translateX = -PLANE_SIZE / 2 + step / 2;
        translateZ += step;
    }

}

function checkEatenApples() {
    var j = 0;
    for (var a in apples) {
        if (apples[a].eaten == true) {
            var i = 0;
            for (var obj in objects) {
                if (objects[obj] == apples[a].mesh) {
                    objects.splice(i, 1);
                    break;
                }
                ++i;
            }
            i = 0;
            for (var s in scene.children) {
                if (scene.children[s] == apples[a].mesh) {
                    var selectedObject = scene.getObjectById(apples[a].mesh.id);
                    scene.remove(selectedObject);
                    break;
                }
                ++i;
            }
            apples.splice(j, 1);
            continue;
        }
        ++j;
    }

}


function gameEnd() {
    alert("You win! :)")
}

function getCurrentPosIJ() {
    var x = hedgehog.position.x + PLANE_SIZE / 2;
    var z = hedgehog.position.z + PLANE_SIZE / 2;
    currentJ = Math.floor(x / 100);
    currentI = Math.floor(z / 100);
}