"use strict";


var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var nMatrix;

var normalMatrixLoc;
var modelViewMatrixLoc;
var flag_object_Loc;

// LIGHT ----------------------------------------------------
var lightPosition = vec4(0.0, 2.0, 0.0, 1.0 );
// ----------------------------------------------------------

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

// VIEW POSITION ----------------------------------------------------- 
var radius = 0.001;// current distace of the camera from the origin
var theta_view = -90* Math.PI/180.0;//0.0;
var phi = 0.0;

// position of the camera
var eye;
   var eye_x;
   var eye_y;
   var eye_z;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
// ---------------------------------------------------------------------


var NUM_NODES = 11;
// ID PARTS --------------------------
var ID_TORSO = 0;
var ID_HEAD  = 1;
var ID_LEG_FRONT_LEFT_UPPER = 2;
var ID_LEG_FRONT_LEFT_LOWER = 3;
var ID_LEG_FRONT_RIGHT_UPPER = 4;
var ID_LEG_FRONT_RIGHT_LOWER = 5;
var ID_LEG_BACK_LEFT_UPPER = 6;
var ID_LEG_BACK_LEFT_LOWER = 7;
var ID_LEG_BACK_RIGHT_UPPER = 8;
var ID_LEG_BACK_RIGHT_LOWER = 9;
var ID_TAIL = 10;
// -----------------------------------

// OBJECT'S FLAGS -----------------------
var FLAG_LAND = 0;
var FLAG_LEG_LOWER = 1;
var FLAG_LEG_UPPER = 2;
var FLAG_HEAD_FRONT = 3;
var FLAG_TORSO = 4;
var FLAG_TAIL = 5;
var FLAG_FENCE = 6;
var FLAG_LAND_UPPER = 7;
var FLAG_HEAD = 8;
var FLAG_OTHER = -1;
// ---------------------------------------
var flag_object = FLAG_LAND; //current object




// PARAMETERS OF SHEEP ---------------
var TORSO_HEIGHT = 5.0;
var TORSO_WIDTH = 3.0;

var UPPER_FRONT_LEG_HEIGHT = 3.0;
var LOWER_FRONT_LEG_HEIGHT = 2.0;

var UPPER_FRONT_LEG_WIDTH  = 0.8;
var LOWER_FRONT_LEG_WIDTH  = 0.5;

var UPPER_BACK_LEG_WIDTH  = 0.8;
var LOWER_BACK_LEG_WIDTH  = 0.5;

var LOWER_BACK_LEG_HEIGHT = 2.0;
var UPPER_BACK_LEG_HEIGHT = 3.0;

var HEAD_HEIGHT = 1.5;
var HEAD_WIDTH = 1.0;

var TAIL_HEIGHT = 2;
var TAIL_WIDTH = 0.7;
// ----------------------------------




var stack = [];
var figure = [];
for( var i=0; i<NUM_NODES; i++) 
    figure[i] = createNode(null, null, null, null);

function createNode(transform, render, sibling, child){
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}



var START_Z = 25;
var INITIAL_STATE = {
    // TORSO --------------
    torso_RX: 90, // rotation around x-axis
    torso_RY: 0, // rotation around y-axis
    torso_RZ: 0, // rotation around z-axis

    torso_TX: 0, // translation x
    torso_TY: 0, // translation y
    torso_TZ: START_Z, // translation z
    // --------------------

    // HEAD ---------------
    head_RX: 0, // rotation around x-axis
    head_RY: 0, // rotation around y-axis
    //---------------------

    // FRONT LEGS -------------------
    leg_front_left_upper: 90, // rotation around x-axis
    leg_front_left_lower: 0, // rotation around x-axis

    leg_front_right_upper: 90, // rotation around x-axis
    leg_front_right_lower: 0, // rotation around x-axis
    // ------------------------------ 

    // BACK LEGS ---------------------
    leg_back_left_upper: 90, // rotation around x-axis
    leg_back_left_lower: 0, // rotation around x-axis

    leg_back_right_upper: 90, // rotation around x-axis
    leg_back_right_lower: 0, // rotation around x-axis
    // -------------------------------

    // TAIL --------------------------
    tail: -45 // rotation around x-axis
    // -------------------------------
}






var state = {
    // TORSO --------------
    torso_RX: 0, // rotation around x-axis
    torso_RY: 0, // rotation around y-axis
    torso_RZ: 0, // rotation around z-axis

    torso_TX: 0, // translation x
    torso_TY: 0, // translation y
    torso_TZ: 0, // translation z
    // --------------------

    // HEAD ---------------
    head_RX: 0, // rotation around x-axis
    head_RY: 0, // rotation around y-axis
    //---------------------

    // FRONT LEGS -------------------
    leg_front_left_upper: 0, // rotation around x-axis
    leg_front_left_lower: 0, // rotation around x-axis

    leg_front_right_upper: 0, // rotation around x-axis
    leg_front_right_lower: 0, // rotation around x-axis
    // ------------------------------ 

    // BACK LEGS ---------------------
    leg_back_left_upper: 0, // rotation around x-axis
    leg_back_left_lower: 0, // rotation around x-axis

    leg_back_right_upper: 0, // rotation around x-axis
    leg_back_right_lower: 0, // rotation around x-axis
    // -------------------------------

    // TAIL --------------------------
    tail: 0 // rotation around x-axis
    // -------------------------------
}


var vBuffer;
var modelViewLoc;

var pointsArray = [];
var texSize =  256;
var texCoordsArray = [];
var tangentsArray = [];
var normalsArray = [];


// SPLINES  ----------------------------
// splines objects
var spline_jump;

var spline_upper_leg_dx;
var spline_lower_leg_dx;
var spline_upper_leg_sx;
var spline_lower_leg_sx;

// time
var walk_time;
var walk_time_start;
var walk_interval; //used to restart the spline 


var z_time;
var z_time_start;

var jump_time;
var jump_start_time;

var start_jump = false; //flag
// -------------------------------------------

var running_animation = false;
var old_running_animation = false; //used to detect the start

var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var texture_land;
var texture_sheep_face;

function initTextures(){
    var image1 = document.getElementById("texture_land");
    texture_land = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture_land);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);    
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_land"), 0);

    var image2 = document.getElementById("texture_sheep_face");
    texture_sheep_face = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture_sheep_face);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_sheep_face"), 1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture_land);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture_sheep_face);
}


window.onload = function init() {
    
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.6, 0.86, 1, 1);

    gui();

    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program);
    gl.enable(gl.DEPTH_TEST);

    initTextures();

    instanceMatrix = mat4();

    projectionMatrix = ortho(-30.0,30.0,-30.0, 30.0,-30.0,30.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    normalMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");

    flag_object_Loc = gl.getUniformLocation(program, "U_flag_object")

    cube();

    // NORMALS
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    // TANGENTS
    var tangBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tangentsArray), gl.STATIC_DRAW);
    var tangentsLoc = gl.getAttribLocation(program, "aTangent");
    gl.vertexAttribPointer(tangentsLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tangentsLoc);

    // POSITIONS
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    // TEXTURE COORDINATES
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    // BUMP TEXTURE NORMALS
    var texture_normals = get_normals_texture(texSize);
    configureBumpTexture(texture_normals);

    // SETUP ANIMATION
    init_sheep_animation();
 
    // SET START STATE OF THE SHEEP
    set_start_state();

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT );

    eye_x = radius*Math.sin(theta_view)*Math.cos(phi);
    eye_y = radius*Math.sin(theta_view)*Math.sin(phi);
    eye_z = radius*Math.cos(theta_view);
    eye = vec3(eye_x, eye_y, eye_z);
    modelViewMatrix = lookAt(eye, at, up);


    var light_pos_eye = mult(modelViewMatrix, lightPosition);
    gl.uniform4fv( gl.getUniformLocation(program, "uEyeLightPosition"), light_pos_eye);


    render_land();
    render_fence();
    render_sheep();
    
    requestAnimationFrame(render);
}



/*
    Set the initial state of the sheep
*/
function set_start_state(){
    set_torso(INITIAL_STATE.torso_RX, INITIAL_STATE.torso_RY, INITIAL_STATE.torso_RZ, 
                INITIAL_STATE.torso_TX, INITIAL_STATE.torso_TY, INITIAL_STATE.torso_TZ);
    
    set_head(INITIAL_STATE.head_RX, INITIAL_STATE.head_RY);

    // front
    set_leg_front_left_upper(INITIAL_STATE.leg_front_left_upper);
    set_leg_front_left_lower(INITIAL_STATE.leg_front_left_lower);
 
    set_leg_front_right_upper(INITIAL_STATE.leg_front_right_upper);
    set_leg_front_right_lower(INITIAL_STATE.leg_front_right_lower);

    // back
    set_leg_back_left_upper(INITIAL_STATE.leg_back_left_upper);
    set_leg_back_left_lower(INITIAL_STATE.leg_back_left_lower);

    set_leg_back_right_upper(INITIAL_STATE.leg_back_right_upper);
    set_leg_back_right_lower(INITIAL_STATE.leg_back_right_lower);

    //tail
    set_tail(INITIAL_STATE.tail);
}


// SHEEP'S ANIMATION -----------------------------------------------------------------------------------------
var START_JUMP_Z_POSITION = 5;
var END_JUMP_Z_POSITION = -19;
var z; 
function render_sheep(){
    if(running_animation != old_running_animation){
        init_sheep_animation();
        old_running_animation = running_animation;
    }
    else if(running_animation){
        z_time = Date.now()-z_time_start;
        z = START_Z-z_time/100; // Z position
        

        if(z > START_JUMP_Z_POSITION) {
            set_walk();
            set_z();
        }
        else if(z <= START_JUMP_Z_POSITION && z > END_JUMP_Z_POSITION){
            if(start_jump==false){
                start_jump=true;
                jump_start_time = Date.now();
            }
            set_y();
            set_z();
        }
        else if(z <= -19 && z > -23.3){
            set_walk();
            set_z();
        }
        else{
            // no operation
            // end animation
        }
    }

    traverse(ID_TORSO); 
}

/*
    Function used to define the splines
*/
function init_sheep_animation(){
    // WALK -----------------------------------------------------------------------
    var walk_timestamp = [0, 0.15, 0.4, 0.55, 0.70];
    walk_interval = walk_timestamp[walk_timestamp.length-1];

    // right leg
    var step_upper_leg_dx = [90, 70, 70, 110, 90];
    var step_lower_leg_dx = [0, 0, 25, 0, 0];
        
    spline_upper_leg_dx = new Splines(step_upper_leg_dx, walk_timestamp, 0, 0);
    spline_upper_leg_dx.init();

    spline_lower_leg_dx = new Splines(step_lower_leg_dx, walk_timestamp, 0, 0);
    spline_lower_leg_dx.init();

    // left leg
    var step_upper_leg_sx = [70, 90, 90, 110, 70];
    var step_lower_leg_sx = [0, 0, 0, 0, 25];

    spline_upper_leg_sx = new Splines(step_upper_leg_sx, walk_timestamp, 0, 0);
    spline_upper_leg_sx.init();

    spline_lower_leg_sx = new Splines(step_lower_leg_sx, walk_timestamp, 0, 0);
    spline_lower_leg_sx.init();
    // ----------------------------------------------------------------------------

    // Y position -----------------------------------------------------------------
    var step_jump = [0, 7, 12, 7, 0];
    var jump_timestamp = [0, 0.6, 1.2, 1.8, 2.4];

    spline_jump = new Splines(step_jump, jump_timestamp, 0, 0);
    spline_jump.init();
    // ----------------------------------------------------------------------------


    // SETUP TIMES -----------------------------------------------------------------
    var time = Date.now();

    walk_time = time;
    walk_time_start = time;//walk_time;

    z_time = time;
    z_time_start =time;

    jump_time = time;
    jump_start_time = time;
    //-----------------------------------------------------------------------------
}

/*
    Set the vertical position of the sheep
*/
function set_y(){
    jump_time = (Date.now()-jump_start_time)/1000; //seconds

    var y = spline_jump.step(jump_time);
    set_torso(null, null, null, null, y, null);
}

/*
    Set horizonatal position of the sheep
*/
function set_z(){
    set_torso(null, null, null, null, null, z);
}

/*
    Movemenents of the leg to walk
*/
function set_walk(){
    walk_time = Date.now()-walk_time_start;
    var time_s = walk_time / 1000;
    if(time_s > walk_interval){
        time_s = 0;
        walk_time_start = Date.now(); //restart the trajectory
    }

    set_leg_front_right_lower(spline_lower_leg_dx.step(time_s));
    set_leg_front_right_upper(spline_upper_leg_dx.step(time_s));

    set_leg_front_left_lower(spline_lower_leg_sx.step(time_s));
    set_leg_front_left_upper(spline_upper_leg_sx.step(time_s));


    set_leg_back_right_lower(spline_lower_leg_sx.step(time_s));
    set_leg_back_right_upper(spline_upper_leg_sx.step(time_s));

    set_leg_back_left_lower(spline_lower_leg_dx.step(time_s));
    set_leg_back_left_upper(spline_upper_leg_dx.step(time_s));
}
// --------------------------------------------------------------------------------------------------------------




// BUMP TEXTURE ----------------------------------------------------------------------------------------
function configureBumpTexture( image ) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_bump"), 2);
}

function get_normals_texture(texSize){
    // Bump Data
    var data = Matrix(texSize+1, texSize+1);
    for (var i = 0; i<= texSize; i++) 
        for (var j=0; j<=texSize; j++)
            data[i][j] = Math.random()*500;//rawData[i*256+j];


    // Bump Map Normals
    var normalst = Matrix(texSize, texSize);
    for (var i=0; i<texSize; i++) 
        for ( var j = 0; j < texSize; j++)
            normalst[i][j] = new Array();
            
    for (var i=0; i<texSize; i++) 
        for( var j = 0; j < texSize; j++) {
            normalst[i][j][0] = data[i][j]-data[i+1][j];
            normalst[i][j][1] = data[i][j]-data[i][j+1];
            normalst[i][j][2] = 1;
    }

    // Scale to Texture Coordinates
    for (var i=0; i<texSize; i++){
        for (var j=0; j<texSize; j++) {
            var d = 0;
            
            for(k=0;k<3;k++) 
                d+=normalst[i][j][k]*normalst[i][j][k];
            
            d = Math.sqrt(d);
            
            for(k=0;k<3;k++) 
                normalst[i][j][k]= 0.5*normalst[i][j][k]/d + 0.5;
        }
    }

    // Normal Texture Array
    var normals = new Uint8Array(3*texSize*texSize);
        for (var i = 0; i < texSize; i++)
            for (var j = 0; j < texSize; j++)
            for(var k =0; k<3; k++)
                    normals[3*texSize*i+3*j+k] = 255*normalst[i][j][k];
    
    return normals;
}
// ------------------------------------------------------------------------------------------------



// LAND -----------------------------------------------------------------------------------
var LAND_HEIGHT = 0.5;
var LAND_WIDTH = 55;

function render_land(){
    stack.push(modelViewMatrix);    
    modelViewMatrix = mult(modelViewMatrix, translate(0,-2.5, 0));
    modelViewMatrix = mult(modelViewMatrix, scale(LAND_WIDTH, LAND_HEIGHT, LAND_WIDTH));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );

    gl.uniform1i(flag_object_Loc, FLAG_LAND);
    for(var i =0; i<3; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }

    gl.uniform1i(flag_object_Loc, FLAG_LAND_UPPER);
    gl.drawArrays(gl.TRIANGLE_FAN, 4*3, 4);

    gl.uniform1i(flag_object_Loc, FLAG_LAND);    
    for(var i=4; i<6; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    
    modelViewMatrix = stack.pop();
}
// -------------------------------------------------------------------------------------------

// FENCE ---------------------------------------------------------------------------------------------
var FENCE_POSITION_Z = -6;

// horizontal pickets
var H_PICKET_HEIGHT = 7;
var H_PICKET_WIDTH_X = 1;
var H_PICKET_WIDTH_Z = 0.5;

// horizontal fence
var FENCE_Y_STEP_SIZE = 3;
var FENCE_Y_START = 0;
var FENCE_Y_END = H_PICKET_HEIGHT-3;

// vertical fence
var FENCE_X_STEP_SIZE = 3;
var FENCE_X_START = -25;
var FENCE_X_END = 25;

// vertical pickets
var V_PICKET_LENGTH =  Math.abs(FENCE_X_END - FENCE_X_START);
var V_PICKET_WIDTH_Y = H_PICKET_WIDTH_X;
var V_PICKET_WIDTH_Z = H_PICKET_WIDTH_Z;

function render_fence(){
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, FENCE_POSITION_Z));

    gl.uniform1i(flag_object_Loc, FLAG_FENCE);
    var matrix;

    // vertical picket fence
    for(var step = FENCE_X_START; step < FENCE_X_END; step += FENCE_X_STEP_SIZE){
        matrix = mult(modelViewMatrix, translate(step, 1, 0));
        matrix = mult(matrix, scale(H_PICKET_WIDTH_X, H_PICKET_HEIGHT, H_PICKET_WIDTH_Z));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(matrix) );
        for(var i =0; i<6; i++) 
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }

    // horizontal picket fence
    for(var step = FENCE_Y_START; step < FENCE_Y_END; step += FENCE_Y_STEP_SIZE){
        matrix = mult(modelViewMatrix, translate(0, step, 0));
        matrix = mult(matrix, scale(V_PICKET_LENGTH, V_PICKET_WIDTH_Y, V_PICKET_WIDTH_Z));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(matrix) );
        for(var i =0; i<6; i++) 
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
    
    modelViewMatrix = stack.pop();
}
// ------------------------------------------------------------------------------------------------------

// HIERARCHICAL MODEL ----------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function render_torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*TORSO_HEIGHT, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( TORSO_WIDTH, TORSO_HEIGHT, TORSO_WIDTH));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));


    gl.uniform1i(flag_object_Loc, FLAG_TORSO);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_torso(Rx, Ry, Rz, Tx, Ty, Tz){
    if(Rx != null) state.torso_RX = Rx;
    if(Ry != null) state.torso_RY = Ry;
    if(Rz != null) state.torso_RZ = Rz;

    if(Tx != null) state.torso_TX = Tx;
    if(Ty != null) state.torso_TY = Ty;
    if(Tz != null) state.torso_TZ = Tz;
        
    var m = translate(state.torso_TX, state.torso_TY, state.torso_TZ);
    
    m = mult(m, translate(0.0, 0.5*TORSO_HEIGHT, 0.0));
    
    m = mult(m, rotate(state.torso_RX, vec3(1, 0, 0) ));
    m = mult(m, rotate(state.torso_RY, vec3(0, 1, 0) ));
    m = mult(m, rotate(state.torso_RZ, vec3(0, 0, 1) ));
    
    m = mult(m, translate(0.0, -0.5*TORSO_HEIGHT, 0.0) );
 
    figure[ID_TORSO] = createNode( m, render_torso, null, ID_HEAD );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_front_left_upper() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UPPER_FRONT_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UPPER_FRONT_LEG_WIDTH, UPPER_FRONT_LEG_HEIGHT, UPPER_FRONT_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_UPPER);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_front_left_upper(Rx){
    if(Rx != null) state.leg_front_left_upper = Rx;

    //var m = translate(-(TORSO_WIDTH+UPPER_FRONT_LEG_WIDTH), 0.9*TORSO_HEIGHT, 0.0);
    var m = translate(-(0.5*TORSO_WIDTH), 0.9*TORSO_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_front_left_upper, vec3(1, 0, 0)));
    figure[ID_LEG_FRONT_LEFT_UPPER] = createNode( m, render_leg_front_left_upper, ID_LEG_FRONT_RIGHT_UPPER, ID_LEG_FRONT_LEFT_LOWER );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_front_left_lower() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * LOWER_FRONT_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LOWER_FRONT_LEG_WIDTH, LOWER_FRONT_LEG_HEIGHT, LOWER_FRONT_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_LOWER);

    for(var i =0; i<6; i++)
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_front_left_lower(Rx){
    if(Rx!=null) state.leg_front_left_lower = Rx;
    var m = translate(0.0, UPPER_FRONT_LEG_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_front_left_lower, vec3(1, 0, 0)));
    figure[ID_LEG_FRONT_LEFT_LOWER] = createNode( m, render_leg_front_left_lower, null, null );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_front_right_upper() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UPPER_FRONT_LEG_HEIGHT, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale(UPPER_FRONT_LEG_WIDTH, UPPER_FRONT_LEG_HEIGHT, UPPER_FRONT_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_UPPER);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_front_right_upper(Rx){
    if(Rx != null) state.leg_front_right_upper = Rx;

    var m = translate(0.5*TORSO_WIDTH, 0.9*TORSO_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_front_right_upper, vec3(1, 0, 0)));
    figure[ID_LEG_FRONT_RIGHT_UPPER] = createNode( m, render_leg_front_right_upper, ID_LEG_BACK_LEFT_UPPER, ID_LEG_FRONT_RIGHT_LOWER );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_front_right_lower() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * LOWER_FRONT_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LOWER_FRONT_LEG_WIDTH, LOWER_FRONT_LEG_HEIGHT, LOWER_FRONT_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_LOWER);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_front_right_lower(Rx){
    if(Rx!=null) state.leg_front_right_lower = Rx;
    var m = translate(0.0, UPPER_FRONT_LEG_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_front_right_lower, vec3(1, 0, 0)));
    figure[ID_LEG_FRONT_RIGHT_LOWER] = createNode( m, render_leg_front_right_lower, null, null );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_back_left_upper() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UPPER_BACK_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UPPER_BACK_LEG_WIDTH, UPPER_BACK_LEG_HEIGHT, UPPER_BACK_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_UPPER);

    for(var i =0; i<6; i++)
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_back_left_upper(Rx){
    if(Rx != null) state.leg_back_left_upper = Rx;
    //var m = translate(-(TORSO_WIDTH+UPPER_BACK_LEG_WIDTH), 0.1*UPPER_BACK_LEG_HEIGHT, 0.0);
    var m = translate(-(0.5*TORSO_WIDTH), 0.1*UPPER_BACK_LEG_HEIGHT, 0.0);
    m = mult(m , rotate(state.leg_back_left_upper, vec3(1, 0, 0)));
    figure[ID_LEG_BACK_LEFT_UPPER] = createNode( m, render_leg_back_left_upper, ID_LEG_BACK_RIGHT_UPPER, ID_LEG_BACK_LEFT_LOWER );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_back_left_lower() {
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * LOWER_BACK_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LOWER_BACK_LEG_WIDTH, LOWER_BACK_LEG_HEIGHT, LOWER_BACK_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_LOWER);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_back_left_lower(Rx){
    if(Rx!=null) state.leg_back_left_lower = Rx;
    var m = translate(0.0, UPPER_BACK_LEG_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_back_left_lower, vec3(1, 0, 0)));
    figure[ID_LEG_BACK_LEFT_LOWER] = createNode( m, render_leg_back_left_lower, null, null );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_back_right_upper() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UPPER_BACK_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UPPER_BACK_LEG_WIDTH, UPPER_BACK_LEG_HEIGHT, UPPER_BACK_LEG_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_UPPER);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_back_right_upper(Rx){
    if(Rx!=null) state.leg_back_right_upper = Rx;
    //var m = translate(TORSO_WIDTH+UPPER_BACK_LEG_WIDTH, 0.1*UPPER_BACK_LEG_HEIGHT, 0.0);
    var m = translate(0.5*TORSO_WIDTH, 0.1*UPPER_BACK_LEG_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_back_right_upper, vec3(1, 0, 0)));
    figure[ID_LEG_BACK_RIGHT_UPPER] = createNode( m, render_leg_back_right_upper, null, ID_LEG_BACK_RIGHT_LOWER );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function render_leg_back_right_lower() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * LOWER_BACK_LEG_HEIGHT, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LOWER_BACK_LEG_WIDTH, LOWER_BACK_LEG_HEIGHT, LOWER_BACK_LEG_WIDTH) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_LEG_LOWER);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function set_leg_back_right_lower(Rx){
    if(Rx!=null) state.leg_back_right_lower = Rx;
    var m = translate(0.0, UPPER_BACK_LEG_HEIGHT, 0.0);
    m = mult(m, rotate(state.leg_back_right_lower, vec3(1, 0, 0)));
    figure[ID_LEG_BACK_RIGHT_LOWER] = createNode( m, render_leg_back_right_lower, null, null );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function set_head(Rx, Ry){
    if(Rx != null) state.head_RX = Rx;
    if(Ry != null) state.head_RY = Ry;

    var m = translate(0.0, TORSO_HEIGHT+0.5*HEAD_HEIGHT - 0.2*HEAD_HEIGHT, 0.5*TORSO_WIDTH + 0.01*TORSO_WIDTH);
    m = mult(m, rotate(state.head_RX, vec3(1, 0, 0)))
    m = mult(m, rotate(state.head_RY, vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*HEAD_HEIGHT, 0.0));
    figure[ID_HEAD] = createNode( m, render_head, ID_TAIL, null);//ID_LEG_FRONT_LEFT_UPPER, null);
}
function render_head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * HEAD_HEIGHT, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(HEAD_WIDTH, HEAD_HEIGHT, HEAD_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_HEAD);

    for(var i =0; i<3; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }

    gl.uniform1i(flag_object_Loc, FLAG_HEAD_FRONT);
    gl.drawArrays(gl.TRIANGLE_FAN, 4*3, 4);

    gl.uniform1i(flag_object_Loc, FLAG_HEAD);    
    for(var i=4; i<6; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function set_tail(Rx){
    if(Rx != null) state.tail = Rx;
    
    var m = translate(0, -0.5*TAIL_HEIGHT + 0.3*TAIL_HEIGHT, 0.0);
    m = mult(m, rotate(state.tail, vec3(1, 0, 0)))
    m = mult(m, translate(0.0, -0.5*TAIL_HEIGHT, 0.0));
    figure[ID_TAIL] = createNode( m, render_tail, ID_LEG_FRONT_LEFT_UPPER, null);
}
function render_tail() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * TAIL_HEIGHT, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(TAIL_WIDTH, TAIL_HEIGHT, TAIL_WIDTH) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    var nMatrix = normalMatrix(instanceMatrix, true);
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(nMatrix));

    gl.uniform1i(flag_object_Loc, FLAG_TAIL);

    for(var i =0; i<6; i++) 
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------------------------------------

function traverse(Id) {
    if(Id == null) 
        return;
    
    stack.push(modelViewMatrix);
    
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    
    figure[Id].render();
    
    if(figure[Id].child != null) 
        traverse(figure[Id].child);
    
    modelViewMatrix = stack.pop();
    
    if(figure[Id].sibling != null) 
        traverse(figure[Id].sibling);
}



function quad(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);
    
    t1 = vec3(Math.abs(t1[0]), Math.abs(t1[1]), Math.abs(t1[2]));

    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal);
    tangentsArray.push(t1);

    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);
    tangentsArray.push(t1);

    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[3]);
    normalsArray.push(normal);
    tangentsArray.push(t1);

    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal);
    tangentsArray.push(t1);
}

function cube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}





























function gui(){
    document.getElementById("radiusSlider").onchange = function(event) {
        radius = event.target.value;
     };
  
     document.getElementById("thetaSlider").onchange = function(event) {
        theta_view = event.target.value* Math.PI/180.0;
     };
     
     document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
     };

    document.getElementById("Button_start").onclick = function(){
        running_animation = true;
    };

}





