import * as BABYLON from 'babylonjs';
import earcut from 'earcut';
import grass from './assets/grass.png';
import rocks from './assets/rocks.png';

// Get the canvas DOM element
const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
// CreateScene function that creates and return the scene
const createScene = function(){
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(engine);
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;

    const gameSize = 200;
    const polys = [[{x:0, y:gameSize}, {x:gameSize, y:gameSize}, {x:gameSize, y:0},  {x:0, y:0}]];
    const dispolys = [[{x:40, y:200 -40}, {x:gameSize -40, y:gameSize-40}, {x:gameSize-40, y:40},  {x:40, y:40}]];
    const grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
    const rocksMaterial = new BABYLON.StandardMaterial("rocksMaterial", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture(grass, scene);
    rocksMaterial.diffuseTexture = new BABYLON.Texture(rocks, scene);
    const polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", 
        { shape: polys[0].map(it=>new BABYLON.Vector3(it.x/10, 0, it.y/10)), 
            depth: 0.1, 
            holes: dispolys.map(poly=>poly.map(it=>new BABYLON.Vector3(it.x/10, 0, it.y/10))), 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            frontUVs: new BABYLON.Vector4(0, 0, 5, 5),
            //faceUV: new Array(4).fill(0).map(it=>new BABYLON.Vector4(0, 0, 5, 5))
        }, scene, earcut);
    polygon.material = grassMaterial;
    const sides = BABYLON.MeshBuilder.ExtrudePolygon("polygon", 
        { shape: polys[0].map(it=>new BABYLON.Vector3(it.x/10, 0, it.y/10)), 
            depth: 1, 
            holes: dispolys.map(poly=>poly.map(it=>new BABYLON.Vector3(it.x/10, 0, it.y/10))), 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            //frontUVs: new BABYLON.Vector4(0, 0, 5, 5),
            faceUV: new Array(4).fill(0).map(it=>new BABYLON.Vector4(0, 0, 5, 1))
        }, scene, earcut);
    sides.position.y = -0.1;
    sides.material = rocksMaterial;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    // Return the created scene
    return scene;
}
// call the createScene function
const scene = createScene();
// run the render loop
engine.runRenderLoop(function(){
    scene.render();
});
// the canvas/window resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});