"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

/***** VERTICES  *******/

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

var pointsArray = [];

/** ID TORSO + HEAD */

var mTorso = [0, -3.5, 0]
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;

var torsoHeight = 4.0;
var torsoWidth = 6.0;

var headHeight = 1.0;
var headWidth = 2.0;


/******** LEGS *********/

var leftFrontUpLegId = 2;
var rightFrontUpLegId = 4;

var leftFrontDownLegId = 3;
var rightFrontDownLegId = 5;

var leftRearUpLegId = 6;
var rightRearUpLegId = 8;

var leftRearDownLegId = 7;
var rightRearDownLegId = 9;

var upperArmHeight = 1.0;
var upperArmWidth  = 1.5;

var lowerArmHeight = 1.0;
var lowerArmWidth  = 0.8;

var upperLegHeight = 1.0;
var upperLegWidth  = 1.5;

var lowerLegHeight = 1.0;
var lowerLegWidth  = 0.8;

/******* TAIL *********/

var tailId = 11;
var tailHeight = 0.5;
var tailWidth = 1.0;

/****** ONE EYE *******/

var eyeId = 12;
var eyeId2 = 20;
var eyeWidth= 0.4;
var eyeHeight= 0.4;
var eyeFlag = false;

/********* TREE *******/

var trunkId = 13;
var crownOfTreeId = 14;
var crownOfTree2Id = 15;
var crownOfTree3Id = 16;
var crownOfTree4Id = 17;
var crownOfTree5Id = 18;

var trunkWidth = 2.0;
var trunkHeight = 12.0;

var crownOfTreeIdWidth = 6.5;
var crownOfTreeIdHeight = 6.5;

/************ ANIMATION **************/

var down = 0;
var rotateTroncoId = 19;

/** NODES + FUNCTION CREATE NODES */

var numNodes = 21;

var theta = [0, 90, -180, 35, 160, -5, 180,  35, 160, -5, 45,-45,40, 0, 45, 0, 80,45,45,0, 40];
console.log(theta.length)
var stack = [];
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);
var vBuffer;

/*********** TEXTURE  **************/

var textureB;
var textureH;
var textureT;
var textureC;

var texCoordsArray = [];
var textureBOn = true;
var textureTreeOn = true;
var textureTreeC = true;

/* TEXTURE COORDINATES */

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


/******** CONFIGURE TEXTURE ****************/


function configureTexture( image1,image2, image3,image4 ) {

    textureB = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureB);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);

    textureH = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureH);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMapH"), 1);
    
    textureT = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMapTT"), 2);

    textureC = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureC);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image4);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMapCT"), 3);
    
}

/********** SCALE FUNCTION  *****************/

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

/********** NODE FUNCTION  *****************/


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

/********** INIT NODES USING ID *****************/


function initNodes(Id) {

    var m = mat4();
    var t = mat4();

    switch(Id) {

    /************* BEAR - GRIZZLY ******************/    
    case torsoId:
        m = translate(mTorso[0], mTorso[1], mTorso[2])
        m = mult(m, rotate(theta[torsoId], vec3(0, 1, 0)));
        m = mult(m, rotate(theta[rotateTroncoId], vec3(0, 0, 1)));
        figure[torsoId] = createNode( m, torso, null, headId );
        break;

    case headId:
    case head1Id:
    case head2Id:

        m = translate(3.5, -1.0*headHeight+torsoHeight, 0.0);  
        m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)))
        m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[headId] = createNode( m, head, eyeId, null);
        break;

    case eyeId:
        m = translate(4, 3.5*(eyeHeight+eyeWidth), 1.0);
        m = mult(m, rotate(theta[eyeId], vec3(0, 0, 1)));
        figure[eyeId] = createNode( m, eye, eyeId2, null );
        break; 
    
    case eyeId2:
        m = translate(4, 3.5*(eyeHeight+eyeWidth), -1.0);
        m = mult(m, rotate(theta[eyeId2], vec3(0, 0, 1)));
        figure[eyeId2] = createNode( m, eye, leftFrontUpLegId, null );
        break; 

    case leftFrontUpLegId:

        m = translate((0.8*torsoHeight/3), 0.05*torsoWidth, 2.0);
        m = mult(m, rotate(theta[leftFrontUpLegId], vec3(0, 0, 1)));
        figure[leftFrontUpLegId] = createNode( m, leftUpperArm, rightFrontUpLegId, leftFrontDownLegId );
        break;

    case rightFrontUpLegId:

        m = translate(0.80*torsoHeight/2, 0.04*torsoWidth, -2.0);
        m = mult(m, rotate(theta[rightFrontUpLegId], vec3(0, 0, 1)));
        figure[rightFrontUpLegId] = createNode( m, rightUpperArm, leftRearUpLegId, rightFrontDownLegId );
        break;

    case leftRearUpLegId:

        m = translate(-(0.3*torsoHeight/3+upperLegWidth), 0.3*upperLegHeight, -2.0);
        m = mult(m , rotate(theta[leftRearUpLegId], vec3(0, 0, 1)));
        figure[leftRearUpLegId] = createNode( m, leftRearUpLeg, rightRearUpLegId, leftRearDownLegId );
        break;

    case rightRearUpLegId:

        m = translate(-(0.9*torsoHeight/3+0.1*upperLegWidth) + down, 0.3*upperLegHeight, 2.0);
        m = mult(m, rotate(theta[rightRearUpLegId], vec3(0, 0, 1)));
        figure[rightRearUpLegId] = createNode( m, rightRearUpLeg, tailId, rightRearDownLegId );
    break;

    case leftFrontDownLegId:

        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[leftFrontDownLegId], vec3(0, 0, 1)));
        figure[leftFrontDownLegId] = createNode( m, leftFrontDownLeg, null, null );
        break;

    case rightFrontDownLegId:

        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[rightFrontDownLegId], vec3(0, 0, 1)));
        figure[rightFrontDownLegId] = createNode( m, rightFrontDownLeg, null, null );
        break;

    case leftRearDownLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[leftRearDownLegId],vec3(0, 0, 1)));
        figure[leftRearDownLegId] = createNode( m, leftRearDownLeg, null, null );
        break;

    case rightRearDownLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightRearDownLegId], vec3(0, 0, 1)));
        figure[rightRearDownLegId] = createNode( m, rightRearDownLeg, null, null );
        break;

    case tailId:
        m = translate(-3.0, tailHeight+0.3*torsoHeight, 1.0);
        m = mult(m, rotate(theta[tailId], vec3(0, 0, 1)));
        figure[tailId] = createNode( m, tail, null, null );
        break;
    


    /******** TREE - SEPARATE OBJECT *****/

    case trunkId:

        t = translate(15.5, -0.4*trunkHeight, -1.0);
        t = mult(t, rotate(theta[trunkId], vec3(0, 0, 1)));
        figure[trunkId] = createNode( t, trunk, crownOfTreeId, null );
        break;
    
    case crownOfTreeId:

        t = translate(13.1, crownOfTreeIdWidth+0.2*crownOfTreeIdHeight, 1.0);
        t = mult(t, rotate(theta[crownOfTreeId], vec3(0, 0, 1)));
        figure[crownOfTreeId] = createNode( t, crownOfTree, crownOfTree2Id, null );
        break;
    
    case crownOfTree2Id:

        t = translate(17.2, crownOfTreeIdWidth+0.6*crownOfTreeIdHeight, 1.0);
        t = mult(t, rotate(theta[crownOfTree2Id], vec3(0, 0, 1)));
        figure[crownOfTree2Id] = createNode( t, crownOfTree2, crownOfTree3Id, null );
        break;

    case crownOfTree3Id:

        t = translate(14.1, crownOfTreeIdWidth+0.2*crownOfTreeIdHeight, 1.0);
        t = mult(t, rotate(theta[crownOfTree3Id], vec3(0, 0, 1)));
        figure[crownOfTree3Id] = createNode( t, crownOfTree3, crownOfTree4Id, null );
        break;
    
    case crownOfTree4Id:

        t = translate(11.5, crownOfTreeIdWidth+0.5*crownOfTreeIdHeight, 1.0);
        t = mult(t, rotate(theta[crownOfTree4Id], vec3(0, 0, 1)));
        figure[crownOfTree4Id] = createNode( t, crownOfTree4, crownOfTree5Id, null );
        break;
    
    case crownOfTree5Id:

        t = translate(12.0, 0.89*crownOfTreeIdWidth+0.1*crownOfTreeIdHeight, 1.0);
        t = mult(t, rotate(theta[crownOfTree5Id], vec3(0, 0, 1)));
        figure[crownOfTree5Id] = createNode( t, crownOfTree5, null, null );
        break;  
    }

}

/******** TRAVERSE --> FUNCTION TO CREATE BEAR STRUCTURE AND TREE STRUCTURE *********/

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}
/************************ BEAR - GRIZZLY **************************************/

function torso() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.35*torsoWidth  , 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoHeight));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
    textureBOn = false;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );


    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function eye(){
    textureBOn = false;
    textureTreeOn = false;
    textureTreeC = false;
    eyeFlag = true;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(eyeWidth, eyeHeight, eyeWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFrontDownLeg() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFrontDownLeg() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftRearUpLeg() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftRearDownLeg() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightRearUpLeg() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightRearDownLeg() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {
    textureBOn = true;
    textureTreeC = false;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

/************************ TREE  **************************************/


function trunk() {
    textureBOn = false;
    textureTreeC = false;
    textureTreeOn = true;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * trunkHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(trunkWidth, trunkHeight, trunkWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function crownOfTree(){
    textureBOn = false;
    textureTreeC = true;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * crownOfTreeIdHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(crownOfTreeIdWidth, crownOfTreeIdHeight, crownOfTreeIdWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function crownOfTree2(){
    textureBOn = false;
    textureTreeC = true;
    textureTreeOn = false;
 
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * crownOfTreeIdHeight/2, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(0.4*crownOfTreeIdWidth, 0.4*crownOfTreeIdHeight, crownOfTreeIdWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function crownOfTree3(){
    textureBOn = false;
    textureTreeC = true;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * crownOfTreeIdHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(crownOfTreeIdWidth/2, crownOfTreeIdHeight/2, crownOfTreeIdWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function crownOfTree4(){
    textureBOn = false;
    textureTreeC = true;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * crownOfTreeIdHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(crownOfTreeIdWidth/2, crownOfTreeIdHeight/2, crownOfTreeIdWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function crownOfTree5(){
    textureBOn = false;
    textureTreeC = true;
    textureTreeOn = false;
    eyeFlag = false;
    gl.uniform1f( gl.getUniformLocation(program, "eye"), eyeFlag );
    gl.uniform1f( gl.getUniformLocation(program, "textureBOn"), textureBOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeT"), textureTreeOn );
    gl.uniform1f( gl.getUniformLocation(program, "textureTreeC"), textureTreeC);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * crownOfTreeIdHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(crownOfTreeIdWidth*0.8, 0.7*crownOfTreeIdHeight, crownOfTreeIdWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


/************************ TO CREATE CUBE **************************************/


function quad(a, b, c, d) {
        
     pointsArray.push(vertices[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     texCoordsArray.push(texCoord[3]);
     
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);

    /************* ORTHOGRAPHIC PROJECTION ********************/

    instanceMatrix = mat4();
    projectionMatrix = ortho(-5.0,20.0,-15.0, 15.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    /***************** IMG FOR TEXTURE ***************/

    var image1 = document.getElementById("texImage1");
    var image2 = document.getElementById("texImage2");
    var image3 = document.getElementById("texImage3");
    var image4 = document.getElementById("texImage4");

    cube();

    /******************* POSITIONS *********************/

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    /******************** TEXTURE *********************/

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    /********************** SLIDERS ***********************/
    
    document.getElementById("Start").onclick = function(event) {
        setInterval(function() {
            go();
        }, 150);
        
    };

    document.getElementById("Reset").onclick = function(event) {
        reset();
    };

    /************************ CONFIGURE AND ACTIVE DIFFERENT TEXTURE **************************************/
   
    configureTexture(image1,image2, image3, image4);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureB);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureH);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textureT);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, textureC);

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}

/********** FUNCTION FOR ANIMATION **************************/
var move = true;
var up = false;
function go(){
    if (mTorso[0]<8.5){
        
        mTorso[0] +=1.0;
        initNodes(torsoId);

        if (move){
            
            theta[head2Id]+=20;
            initNodes(head2Id);

            theta[leftFrontUpLegId] += -25;
            initNodes(leftFrontUpLegId);

            theta[rightFrontUpLegId] += 25;
            initNodes(rightFrontUpLegId);

            theta[leftRearUpLegId] +=-25;
            initNodes(leftRearUpLegId);

            theta[rightRearUpLegId] +=25;
            initNodes(rightRearUpLegId);
            
            if (theta[leftFrontUpLegId] == -205){
                move = false;
            }
        }
        else{
            theta[head2Id]+=-20;
            initNodes(head2Id);
            theta[leftFrontUpLegId] += 25;
            initNodes(leftFrontUpLegId);

            theta[rightFrontUpLegId] += -25;
            initNodes(rightFrontUpLegId);

            theta[leftRearUpLegId] +=25;
            initNodes(leftRearUpLegId);

            theta[rightRearUpLegId] +=-25;
            initNodes(rightRearUpLegId);

            if (theta[leftFrontUpLegId] == -180){
                move = true;
            }
        }
        
    }
    else{
        if (theta[torsoId]!=180){
           
            theta[torsoId]+=20;
            initNodes(torsoId);
        }
        else{
            if (mTorso[0]!= 11){
                mTorso[0]+=1.0
                initNodes(torsoId);

                theta[leftFrontUpLegId] += 7;
                initNodes(leftFrontUpLegId);

                theta[rightFrontUpLegId] += -7;
                initNodes(rightFrontUpLegId);

                theta[leftRearUpLegId] +=7;
                initNodes(leftRearUpLegId);

                theta[rightRearUpLegId] +=-7;
                initNodes(rightRearUpLegId);

            }
            else{
                
                if (theta[rotateTroncoId]!= -60){
                    theta[rotateTroncoId] -=15;
                    mTorso[1]+=0.5;
                    initNodes(torsoId);

                    theta[leftFrontUpLegId] +=10;
                    initNodes(leftFrontUpLegId);
                    
                    theta[rightFrontUpLegId] +=20; 
                    initNodes(rightFrontUpLegId);

                    theta[leftRearUpLegId] +=10;
                    initNodes(leftRearUpLegId);
                    
                    theta[rightRearUpLegId] +=20;
                    down -=0.1;
                    initNodes(rightRearUpLegId);
                    up = true;
                }
                else{
                    if (up){
                        theta[leftRearDownLegId]+=10;
                        initNodes(leftRearDownLegId);

                        theta[rightRearDownLegId]+=10;
                        initNodes(rightRearDownLegId);

                        theta[leftRearUpLegId]+=5;
                        initNodes(leftRearUpLegId);

                        theta[rightRearUpLegId]+=5;
                        initNodes(rightRearUpLegId);

                        mTorso[1]-=0.1;
                        initNodes(torsoId);
                        if (theta[leftRearDownLegId] == 55){
                            up = false;
                            
                        }
                    }
                    else{
                        theta[leftRearDownLegId]-=10;
                        initNodes(leftRearDownLegId);

                        theta[leftRearUpLegId]-=5;
                        initNodes(leftRearUpLegId);

                        theta[rightRearDownLegId]-=10;
                        initNodes(rightRearDownLegId);

                        theta[rightRearUpLegId]-=5;
                        initNodes(rightRearUpLegId);

                        mTorso[1]+=0.1;
                        initNodes(torsoId);
                        if (theta[leftRearDownLegId] == 25){
                            up = true;
                        }

                    }   
                    
                }
            }
        }
    }
  
}

/******** RELOAD PAGE TO RESET ANIMATION *******************/

function reset(){
    window.location.reload();
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT );
        
        /* CALL 2 TRAVERSE FOR 2 DIFFERENT STRUCTURE */
        traverse(torsoId);
        traverse(trunkId);
        requestAnimationFrame(render);
}
