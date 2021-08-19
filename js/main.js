//main.js

//Initialize the objects for use in the scene
let scene, camera, renderer, light, helper;
let shape, grid, gridMesh;

//Variables for the rotation animation of both the light and the camera
var radius = 12;
var radius2 = 5;
var angle = 0;
var angle2 = 0;

//This function initializes the scene, camera, renderer, and light.
function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    light = new THREE.DirectionalLight(0xf82d93, 1);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);

    light.position.z = 10;
    light.position.y = 5;
    light.position.x = 3;

    camera.position.z = 10;
    camera.position.y = 5;
    camera.lookAt(0,0,0);
}

//This function initializes the shape on the scene
function initShape(){
    const shapeGeo = new THREE.SphereGeometry(1, 32, 16);
    const shapeMat = new THREE.MeshBasicMaterial( { color: 0xf82d93, wireframe: false } );

    shape = new THREE.Mesh(shapeGeo, shapeMat);
    shape.position.x = 10;
    shape.position.y = 5;
    shape.position.z = 3;

    scene.add(shape);
}

function generateRandomNumber() {
    var min = -0.5,
        max = 0.5,
        highlightedNumber = Math.random() * (max - min) + min;

    return (highlightedNumber);
};

function initGrid(){
    grid = [];
    gridMesh = [];

    const startX = 4.5;
    const startZ = 4.5;
    const nodeGeo = new THREE.BoxGeometry(1, 1, 1);
    var nodeMat = new THREE.MeshPhongMaterial( { color: Math.floor(Math.random()*16777215), wireframe: false } );

    for (let i = 0; i < 10; i++){
        for (let j=0; j < 10; j++){
            var gridNode = {
                xPos: startX - i,
                zPos: startZ - j
            };
            grid.push(gridNode);
        }
    }

    for (gridNode in grid) {
        nodeMat = new THREE.MeshPhongMaterial( { color: Math.floor(Math.random()*16777215), wireframe: false } );
        gridMesh.push(new THREE.Mesh(nodeGeo, nodeMat));
    }

    console.log(gridMesh[0]);

    var count = 0;
    var ht = -0.5;
    var asc = true;
    for (let i = 0; i < 100; i++){
        gridMesh[i].position.x = grid[count].xPos;
        gridMesh[i].position.z = grid[count].zPos;
        gridMesh[i].position.y = generateRandomNumber();
        count += 1;

        if (asc){
            ht += 0.1;
        } else {
            ht -= 0.1;
        }

        if (ht == -0.5){
            asc = true;
        }
        if (ht == 0.5){
            asc = false;
        }

        scene.add(gridMesh[i]);
    }
}

//This function adds the grid and the light helper lines to the scene
function showGrid(){
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions, 0x5959);
    scene.add( gridHelper );      

    helper = new THREE.DirectionalLightHelper( light, 1 );
    scene.add(helper);

}

var truthTable = []
for (let i = 0; i < 100; i++){
    if (Math.random() > 0.5){
        truthTable.push(true);
    } else {
        truthTable.push(false);
    }
}


var framecount = 0;
var playing = true;
//This function recursively animates the scene by changing properties of the objects placed on the scene.
function animate(){
    requestAnimationFrame(animate);

    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);
    angle += 0.003;

    camera.lookAt(0,0,0);

    light.position.x = radius2 * Math.cos(angle2);
    light.position.z = radius2 * Math.sin(angle2);
    shape.position.x = radius2 * Math.cos(angle2);
    shape.position.z = radius2 * Math.sin(angle2);
    angle2 += 0.01;

    try{
        helper.update();
    } catch (error){

    }

    for (let i = 0; i < gridMesh.length; i++){
        if (truthTable[i]){
            gridMesh[i].position.y += 0.01;
        } else {
            gridMesh[i].position.y -= 0.01;
        }

        if (gridMesh[i].position.y >= 0.5){
            truthTable[i] = false;
        }
        if (gridMesh[i].position.y <= -0.5){
            truthTable[i] = true;
        }

    }

    if (framecount%30 == 0 && framecount != 0){
        var rgb = {r: Math.random(), g: Math.random(), b: Math.random()}
        shape.material.color = rgb;
        light.color = rgb;
    }
    console.log(shape);

    if (playing){
        framecount += 1;   
    }

    renderer.render(scene, camera);
}

function playAudio(){
    playing = !playing;
}

//Function calls
init();
initGrid();
initShape();
//showGrid();
animate();