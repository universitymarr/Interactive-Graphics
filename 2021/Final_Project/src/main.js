import * as THREE from '../libs/three_js/three.module.js';
import { Environment } from './Environment.js'
import { X_Bot } from './X_Bot.js'
import { X_bot_Walk } from './X_bot_Walk.js'
import { X_Bot_Sphere_Animation } from './X_Bot_Sphere_Animation.js'
import Stats from '../libs/human_interface/stats.module.js';
import { GUI } from '../libs/human_interface/dat.gui.module.js';
import { OrbitControls } from '../libs/human_interface/OrbitControls.js';


let camera, scene, renderer, stats;

const X_BOT_PATH_MODEL = './src/models/x_bot_rotated.glb';
const ENV_PATH_MODEL = './src/models/room.glb';


let x_bot;
let x_bot_walk;

let env;

let sphere_animation;
let walk_animation;

await load_models();
init();
animate();

async function load_models(){
    //X_BOT TABLE ---------------------------------
    x_bot = new X_Bot();
    await x_bot.load(X_BOT_PATH_MODEL);
    // --------------------------------------------

    //X_BOT_WALK -----------------------------------
    x_bot_walk = new X_Bot();
    await x_bot_walk.load(X_BOT_PATH_MODEL);

    x_bot_walk.parts.armature.position.x = -200;
    x_bot_walk.parts.armature.position.z = -100;
    // --------------------------------------------

    //ROOM ----------------------------------------
    env = new Environment();
    await env.load(ENV_PATH_MODEL);
    // --------------------------------------------
}

function init() {
    // CONTAINER ----------------------------------------------------------------
    const container = document.createElement( 'div' );
    document.body.appendChild( container );
    // --------------------------------------------------------------------------

    // CAMERA -------------------------------------------------------------------
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 8000;
  
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set( 0, 200, 1150 );
    // --------------------------------------------------------------------------

    // RENDERER -------------------------------------------------------------------
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );
    // --------------------------------------------------------------------------
    
    // CONTROLS ------------------------------------------------------------------
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();
    // ---------------------------------------------------------------------------
    
    // STATS ---------------------------------------------------------------------
    stats = new Stats();
    container.appendChild( stats.dom );
    // ---------------------------------------------------------------------------

    // SCENE --------------------------------------------------------------------
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    // --------------------------------------------------------------------------

    // X_BOT WALK ---------------------------------------------------------------------
    let surface_color = x_bot_walk.COLORS.WHITE;
    let joints_color = 0x8B0000;
    x_bot_walk.set_color(surface_color, joints_color);
    x_bot_walk.set_rest_configuration();

    scene.add(x_bot_walk.model)

    walk_animation = new X_bot_Walk(x_bot_walk);
    // --------------------------------------------------------------------------------

    // X_BOT TABLE --------------------------------------------------------------------
    surface_color = x_bot.COLORS.WHITE;
    joints_color = x_bot.COLORS.BLUE;
    x_bot.set_color(surface_color, joints_color);
    x_bot.set_rest_configuration();

    scene.add(x_bot.model)

    sphere_animation = new X_Bot_Sphere_Animation(x_bot, env);
    sphere_animation.init();
    sphere_animation.start();
    //---------------------------------------------------------------------------------
    
    // ENVIRONMENT --------------------------------------------------------------------
    env.init(scene, walk_animation);
    // --------------------------------------------------------------------------------

    // GUI ---------------------------------------------------------------------------
    window.addEventListener( 'resize', onWindowResize );
    keyboard_listener_init();
    GUI_init();
    // -------------------------------------------------------------------------------
}


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    
    stats.update();

    walk_animation.update();
    sphere_animation.update();
}


function GUI_init(){
    //SOURCE: three.js fundamentals
    class ColorGUIHelper {
        constructor(object, prop) {
        this.object = object;
        this.prop = prop;
        }
        get value() {
        return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
        this.object[this.prop].set(hexString);
        }
    }
    
    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(x_bot_walk.materials.surface.material, 'color'), 'value').name('Color');
    gui.addColor(new ColorGUIHelper(x_bot_walk.materials.surface.material, 'specular'), 'value').name('Specular');
}


function keyboard_listener_init(){
    document.addEventListener('keydown', (event) => {
        var name = event.key;
        var code = event.code;

        walk_animation.keydown_dispatcher(name);
    }, false)

    document.addEventListener('keyup', (event) => {
        var name = event.key;
        var code = event.code;

        walk_animation.keyup_dispatcher(name);
    }, false)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}





// FOR DEBUG
function add_axes_helper(scene, x_bot){
    const axesHelper = new THREE.AxesHelper( 500 );
 
    scene.add( axesHelper );

    const axesHelper02 = new THREE.AxesHelper( 500 );
    scene.add( axesHelper02 );

    const axesHelper2 = new THREE.AxesHelper( 500 );
 
    x_bot.scene.add( axesHelper2 );

    let node;
    let axes;

    node = x_bot.model;
    axes = new THREE.AxesHelper(300);
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    node.add(axes);


    node = x_bot.parts.hips;
    axes = new THREE.AxesHelper(50);
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    node.add(axes);
}

