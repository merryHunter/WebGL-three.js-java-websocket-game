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
var MODELS_HEIGHT = 25;
var currentI = 0, currentJ = 0;
var updatedModel = false;
var loader = new THREE.STLLoader();

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
        render();
        gameEnd();
        websocket.close();
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
    setTimeout(init, 3000);
    setTimeout(render, 4000);
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

    scene.add(plane);
    objects.push(plane);
    /*======================== SKYBOX/FOG ========================*/
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

    scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
}

function loadHedgehog() {
    var loader = new THREE.STLLoader();
    //???
    var hedgehogTexture = new THREE.ImageUtils.loadTexture('textures/hedgehogTexture.jpg');

    var material = new THREE.MeshPhongMaterial({color: 0xFF0066, shininess: 30, specular: 0x111111});
    loader.load('models/test1.stl', function (geometry) {
        hedgehog = new THREE.Mesh(geometry, material);
        hedgehog.scale.set(10, 10, 10);
        hedgehog.castShadow = true;
        hedgehog.receiveShadow = true;

        scene.add(hedgehog);
    });
}

function loadApple() {

    //???
    //var appleTexture = new THREE.ImageUtils.loadTexture('textures/appleTexture.jpg');
    //var material = new THREE.MeshBasicMaterial({color: 0xAAAAAA, 00AAFF side: THREE.BackSide});
    var material = new THREE.MeshPhongMaterial({color: 0xFF0000, shininess: 30, specular: 0x111111});
    loader.load('models/apple.stl', function (geometry) {
        var meshMaterial = new THREE.MeshPhongMaterial({
            color: 0x690708,
            ambient: 0x690708, // should generally match color
            specular: 0x050505,
            shininess: 100,
            vertexColors: THREE.VertexColors
        });
        var meshApple = new THREE.Mesh(geometry, material);
        meshApple.scale.set(30, 30, 30);
        meshApple.castShadow = true;
        meshApple.receiveShadow = true;

        var apple = new Apple(meshApple);
        apples.push(apple);
        objects.push(meshApple);
        scene.add(meshApple);
    });
}

function initLight() {
    var ambientLight = new THREE.AmbientLight(0x404040); // soft white light scene.add( light );
    // var ambientLight = new THREE.AmbientLight(0x606060);
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

    //var light = new THREE.PointLight( 0xff0000, 1, 100 ); light.position.set( 150, 150, 500 ); scene.add( light );
}

function initModels() {
    if (field == null)
        return;

    for (var i = 0; i < N; ++i) {
        for (var j = 0; j < N; ++j) {
            if (field[i][j] == APPLE) {
                loadApple();
            }
            else if (field[i][j] == HEDGEHOG) {
                loadHedgehog();
            }
        }
    }

    render();
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
        //-------send request to update model----------
        var intersect = intersects[0];
        var newPosition = new THREE.Vector3().copy(intersect.point.add(intersect.face.normal));
        var oldPosition = new THREE.Vector3().copy(hedgehog.position);
        setCurrentPosIJ(newPosition);
        updatedModel = false;
        sendText(JSON.stringify({
            "pos": {
                "i": currentI,
                "j": currentJ
            }
        }));
        //------------------------------------------
        rotateHedgehogOrientation(oldPosition, newPosition);

        function moveHedgehog() {
            var distance = getDistance(oldPosition, newPosition);
            var delta = distance / (PLANE_SIZE);
            var lambda = delta;
            if (delta < 0.1) {
                delta *= N;
            }
            var frequency = 1 / lambda;
            //if(frequency > 10)
            //    frequency  /= 10;
            var i = 0;

            function frame() {
                ++i;
                lambda += delta;  // update parameters

                var tempPos = getTempPosition(oldPosition, newPosition, lambda);
                hedgehog.position.set(tempPos.x, tempPos.y, tempPos.z);
                renderer.render(scene, camera);
                // // check finish condition
                if (lambda > 10) {
                    hedgehog.position.set(newPosition.x, newPosition.y, newPosition.z);
                    render();
                    clearInterval(id);
                }

            }

            var id = setInterval(frame, frequency);
        }

        moveHedgehog();
        //======================================
        setEatenApples(intersect);

        //hedgehog.position.copy(intersect.point).add(intersect.face.normal);
        //hedgehog.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    }

    //setTimeout(render, 100);
}


/**
 * Rotate hedgehog orientation in forward to mouse click.
 * TODO: incorrect behaviour!
 * @param oldPos
 * @param newPos
 */
function rotateHedgehogOrientation(oldPos, newPos) {
    var angle = oldPos.angleTo(newPos) * 180 / Math.PI;
    var cos = cosinusBetweenVectors(oldPos, newPos);
    hedgehog.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
}

function render() {
    updateView();

    renderer.render(scene, camera);
}

function onDocumentWheel(event) {
    event = event || window.event;
    var delta = event.wheelDelta;

    if (delta > 0) {
        camera.position.z -= 10;
        camera.position.y -= 10;
    }
    else {
        camera.position.z += 10;
        camera.position.y += 10;

    }
    camera.updateProjectionMatrix();
    render();
}

function updateView() {
    if (jsonObjectField == null || apples.length == 0)
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
                apples[p].mesh.position.set(translateX, MODELS_HEIGHT, translateZ);
                ++p;
            }
            else if (field[i][j] == HEDGEHOG) {
                hedgehog.position.set(translateX, MODELS_HEIGHT / 2, translateZ);
                setCurrentPosIJ(hedgehog.position);
            }
            translateX += step;
        }
        translateX = -PLANE_SIZE / 2 + step / 2;
        translateZ += step;
    }

}

/**
 * Check @eaten property and if an apple
 * has false value, then remove this apple
 * from object, scene and apples arrays.
 */
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

/**
 * Check if user clicked onto the apple
 * and set the apple's property @eaten.
 * @param intersect object selected by mouse clicking
 */
function setEatenApples(intersect) {
    for (var obj in objects) {
        if (objects[obj] == intersect.object) {
            for (var j in apples) {
                if (apples[j].mesh == objects[obj]) {
                    apples[j].eaten = true;
                }
            }
        }
    }
}

function gameEnd() {
    alert("You win! :)")
}

/**
 * Set current position of hedgehog.
 * @param position is 3d coordinates.
 */
function setCurrentPosIJ(position) {
    var x = position.x + PLANE_SIZE / 2;
    var z = position.z + PLANE_SIZE / 2;
    currentJ = Math.floor(x / 100);
    currentI = Math.floor(z / 100);
}

function getDistance(start, end) {
    return Math.sqrt(
        (end.x - start.x) *
        (end.x - start.x) + (end.y - start.y) *
        (end.y - start.y) + (end.z - start.z) * (end.z - start.z)
    );
}

function getTempPosition(start, end, lambda) {
    var tempPosition = new THREE.Vector3();

    tempPosition.x = (start.x + lambda * end.x) / (1 + lambda);
    tempPosition.y = (start.y + lambda * end.y) / (1 + lambda);
    tempPosition.z = (start.z + lambda * end.z) / (1 + lambda);

    return tempPosition;
}

function cosinusBetweenVectors(f, s) {
    return Math.cos(
        (f.x * s.x + f.y * s.y + f.z * s.z) / (normVector(f) * normVector(s))
    );
}

function normVector(v) {
    return Math.sqrt(
        v.x * v.x + v.y * v.y + v.z * v.z
    );
}