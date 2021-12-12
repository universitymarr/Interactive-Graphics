import * as THREE from '../build/three.module.js';

import * as TWEEN from '../build/tween.esm.js';


import { Utils } from './Utils.js'

import { X_Bot } from './X_Bot.js'
import { Environment } from './Environment.js'

import { Tween_spline } from './Tween_spline.js'


import Stats from './jsm/libs/stats.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';

import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';


let camera, scene, renderer, stats;

const clock = new THREE.Clock();
const utils = new Utils();

const X_BOT_PATH_MODEL = './models/x_bot_T_pose.glb';
const ENV_PATH_MODEL = './models/cube.glb';

let mixer;

let x_bot;
let env;

function add_lights(){


    
}

async function load_models(){
    //X_BOT
    x_bot = new X_Bot();
    await x_bot.load(X_BOT_PATH_MODEL);

    //ROOM
    env = new Environment();
    await env.load(ENV_PATH_MODEL);

}

function tween_test(){
    // x0 -> x1 in 5sec
    const coords = {x: 0, y: 0, z: 0} // Start at (0, 0)
    const tween_1 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({x: 300, y: 200, z :400}, 5000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate((object) => {
            // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            x_bot.model.position.set(object.x, object.y, object.z);
        })
       // .start() // Start the tween immediately.
       // .repeat(Infinity)
    
    //x1->x2 in 8sec
    const tween_2 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to({x: -300, y: -200, z :-40}, 8000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate((object) => {
        // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        x_bot.model.position.set(object.x, object.y, object.z);
    })
    
    //x2->x3 in 16sec
    const tween_3 = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to({x: 0, y: 0, z :0}, 16000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate((object) => {
        // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        x_bot.model.position.set(object.x, object.y, object.z);
    })
    //.start() // Start the tween immediately.
    //.repeat(Infinity)

    
    tween_1.chain(tween_2)
    tween_2.chain(tween_3)
    //tween_3.chain(tween_1)
    tween_1.start();
}

let tween_spline;

function test_tween_spline(){
    let times = [0, 5000, 12000, 16000];
    let values = [
        {x: 0, y: 0, z :0},
        {x: 400, y: 220, z :400},
        {x: -500, y: 220, z :-550},
        {x: 0, y: 0, z :0}
    ]

    let func_handler = (object) => {
        // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        x_bot.model.position.set(object.x, object.y, object.z);
    }

  
        tween_spline = new Tween_spline(times, values, func_handler, TWEEN.Easing.Quadratic.Out, TWEEN.Interpolation.CatmullRom);
        tween_spline.init(true);
        tween_spline.start();

}

function init() {

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 8000;
  
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set( 100, 200, 800 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    //scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    // ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );


    x_bot.model.scale.x = 1;
    x_bot.model.scale.y = 1;
    x_bot.model.scale.z = 1;

    x_bot.materials.surface.material = new THREE.MeshPhongMaterial({color: 0xd6d6d6});  // greenish blue
    x_bot.materials.joints.material = new THREE.MeshPhongMaterial({color: 0x010014});
    
    test_tween_spline();


    scene.add(x_bot.model)




    //console.log(utils.dumpObject(env.model).join('\n'));

    const color = 0xFFFFFF;
    const intensity = 0.5;
    
    const ambient_light = new THREE.AmbientLight(color, intensity);
    scene.add(ambient_light)

    env.init();
 
    scene.add(env.scene);

    //console.log(utils.dumpObject(env.scene).join('\n'));


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

    //console.log(utils.dumpObject(scene).join('\n'));


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    if ( mixer ) mixer.update( delta );

    renderer.render( scene, camera );

    stats.update();

    
    tween_spline.update();

}

await load_models();
init();
animate();

