import * as BABYLON from 'babylonjs';
import earcut from 'earcut';
import grass from './assets/grass.png';
import rocks from './assets/rocks.png';
import floor from './assets/floor.png';
import {init} from './core/xone';
import './style.css';

// Get the canvas DOM element
const canvas: HTMLCanvasElement = document.querySelector('.canvas') as HTMLCanvasElement;
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
// CreateScene function that creates and return the scene
const createScene = function(){
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(engine);
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(10, 8, -30), scene);
    // Target the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(10, 0, -20));
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    const sphere = BABYLON.Mesh.CreateCylinder('sphere1', 1.5, 1, 0.1, 8, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;

    const gameSize = 200;
    const polys = [[{x:0, y:gameSize}, {x:gameSize, y:gameSize}, {x:gameSize, y:0},  {x:0, y:0}]];
    const dispolys = [[{x:40, y:200 -40}, {x:gameSize -40, y:gameSize-40}, {x:gameSize-40, y:40},  {x:40, y:40}]];
    const grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
    const rocksMaterial = new BABYLON.StandardMaterial("rocksMaterial", scene);
    const floorMaterial = new BABYLON.StandardMaterial("floorMaterial", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture(grass, scene);
    rocksMaterial.diffuseTexture = new BABYLON.Texture(rocks, scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture(floor, scene);
    let polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", 
        { shape: polys[0].map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10)), 
            depth: 0.1, 
            holes: dispolys.map(poly=>poly.map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10))), 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            frontUVs: new BABYLON.Vector4(0, 0, 5, 5),
            //faceUV: new Array(4).fill(0).map(it=>new BABYLON.Vector4(0, 0, 5, 5))
        }, scene, earcut);
    polygon.material = grassMaterial;
    let sides = BABYLON.MeshBuilder.ExtrudePolygon("polygon", 
        { shape: polys[0].map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10)), 
            depth: 1, 
            holes: dispolys.map(poly=>poly.map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10))), 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            //frontUVs: new BABYLON.Vector4(0, 0, 5, 5),
            faceUV: new Array(4).fill(0).map(it=>new BABYLON.Vector4(0, 0, 5, 1))
        }, scene, earcut);
    sides.position.y = -0.1;
    sides.material = rocksMaterial;

    const enemySpheres = new Array(2).fill(null).map((it, i)=> {
        const enemy = BABYLON.Mesh.CreateSphere('enemy_sphere'+i, 16, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
        enemy.position.y = -0.5;
        return enemy;
    });
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    const ground = BABYLON.MeshBuilder.CreatePlane('ground1', {width:20, height:20, updatable:true, frontUVs: new BABYLON.Vector4(0, 0, 5, 5), sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y=-1;
    ground.position.x=10;
    ground.position.z=-10;
    ground.material = floorMaterial;

    const pathPoints: BABYLON.Mesh[] = [];

    init((data)=>{
        sphere.position.x = data.player.x /10;
        sphere.position.z = -data.player.y /10;
        polygon.dispose();
        polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", 
        { shape: data.polys[0].map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10)), 
            depth: 0.1, 
            holes: data.holes.map(poly=>poly.map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10))), 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            frontUVs: new BABYLON.Vector4(0, 0, 5, 5),
            //faceUV: new Array(4).fill(0).map(it=>new BABYLON.Vector4(0, 0, 5, 5))
        }, scene, earcut);
        polygon.material = grassMaterial;
        sides.dispose();
        sides = BABYLON.MeshBuilder.ExtrudePolygon("polygon", 
        { shape: data.polys[0].map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10)), 
            depth: 1, 
            holes: data.holes.map(poly=>poly.map(it=>new BABYLON.Vector3(it.x/10, 0, -it.y/10))), 
            updatable: true, 
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            //frontUVs: new BABYLON.Vector4(0, 0, 5, 5),
            faceUV: new Array(4).fill(0).map(it=>new BABYLON.Vector4(0, 0, 5, 1))
        }, scene, earcut);
        sides.position.y = -0.1;
        sides.material = rocksMaterial;

        data.enemies.forEach((it, i)=>{
            enemySpheres[i].position.x = it.pos.x/10;
            enemySpheres[i].position.z = -it.pos.y/10;
        });

        pathPoints.forEach(it=>it.dispose());
        pathPoints.splice(0, pathPoints.length);
        data.playerPath.forEach((it, i, arr)=>{
            const startPoint = it;
            const endPoint = arr[i+1] || data.player;
            if (i == arr.length -1){
            //    return;
            }
            const lineLength = Math.hypot(startPoint.x - endPoint.x, startPoint.y - endPoint.y);
            data.inPoly && new Array(Math.floor(lineLength / 5)+1).fill(0).forEach((it, i)=>{
                const pathPoint = BABYLON.Mesh.CreateCylinder('sphere1', 0.8, 0.3, 0.3, 6, 1, scene, false, BABYLON.Mesh.FRONTSIDE);
                pathPoint.position.y = -0.3;
                pathPoint.position.y = -0.5;
                pathPoint.position.x = (startPoint.x - i * 5*(startPoint.x - endPoint.x)/ lineLength) / 10;
                pathPoint.position.z = -(startPoint.y - i * 5*(startPoint.y - endPoint.y)/ lineLength) / 10;
                pathPoints.push(pathPoint);
            });
        });
        camera.position.x = data.player.x / 10 / 2 + 5;
        camera.position.z = -data.player.y / 10 / 2 - 20;
    });

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