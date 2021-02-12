"use strict";

var canvas;
var gl;

// TOTAL VERTICES
var numVertices  = 144;

var program;
var c;
var texture;

var pointsArray = [];
var normalsArray = [];
var colorsArray = [];
var texCoordsArray = [];

/* VERTICES COORDINATES IN VEC4 */

var vertices = [
    vec4(0.000846,0.288500,-0.000354,1.0),
    vec4(0.108422,0.009080,-0.119625,1.0),
    vec4(0.111559,0.009227,0.127520,1.0),
    vec4(-0.129183,0.008254,-0.118410,1.0),
    vec4(-0.128720,0.007343,0.126627,1.0),
    vec4(0.167628 ,0.167628, 0.167628,1.0),
    vec4(-0.167628 ,0.167628, 0.167628,1.0),
    vec4( 0.167628 ,0.167628, -0.167628,1.0),
    vec4( -0.167628 ,0.167628, -0.167628,1.0),
    vec4(0.203894, 0.167628, 0.203894,1.0),
    vec4(-0.203894, 0.167628, 0.203894,1.0),
    vec4( 0.203894, 0.167628, -0.203894,1.0),
    vec4( -0.203894, 0.167628, -0.203894,1.0),
    vec4( 0.204687 ,0.193801 ,0.203013,1.0),
    vec4( -0.203102, 0.193801, 0.203013,1.0),
    vec4(0.204687 ,0.193801, -0.204776,1.0),
    vec4( -0.203102, 0.193801, -0.204776,1.0),
    vec4( -0.172216, 0.008056, -0.172516,1.0),
    vec4( -0.171574, 0.006994, 0.168516,1.0),
    vec4( 0.161284 ,0.009427 ,-0.174221,1.0),
    vec4( 0.165651, 0.009427 ,0.169769,1.0),
    vec4( 0.107394, -0.093700, -0.116622,1.0),
    vec4( 0.110531, -0.093553 ,0.130524,1.0),
    vec4( -0.130210 ,-0.094526, -0.115407,1.0),
    vec4( -0.129748 ,-0.095437, 0.129631,1.0)

];

/* TEXTURE COORDINATES */

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

/* VIEW */

var eyeLoc;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var radius = 2.5;
var theta = -45.0;
var phi = 0.2;

/* PERSPECTIVE */

var near = 0.1;
var far = 3.0;
var dr = 5.0 * Math.PI/180.0;
var  fovy = 15.0;  
var  aspect;     

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;

/* DIRECTIONAL LIGHT  */

var directLightDirection = vec4(-2.5, 0.5, 1.0, 0.0);
var directLightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var directLightDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
var directLightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

/* SPOTLIGHT*/

var xSpotLight=0.05;
var ySpotLight=0.1;
var zSpotLight=1.0;

var rSpotLightA=0.0;
var gSpotLightA=0.0;
var bSpotLightA=0.0;

var rSpotLightD=1.0;
var gSpotLightD=0.2;
var bSpotLightD=0.0;

var rSpotLightS=0.3;
var gSpotLightS=0.7;
var bSpotLightS=0.5;

var xSpotLightDir=0.0;
var ySpotLightDir=0.0;
var zSpotLightDir=1.0;

var spotLightPosition = vec4(xSpotLight, ySpotLight, zSpotLight, 1.0 );
var spotLightAmbient = vec4(rSpotLightA, gSpotLightA, bSpotLightA, 1.0 );
var spotLightDiffuse = vec4(rSpotLightD, gSpotLightD, bSpotLightD, 1.0 );
var spotLightSpecular = vec4(rSpotLightS, gSpotLightS, bSpotLightS, 1.0 );
var spotLightDirection = vec4(xSpotLightDir,ySpotLightDir,zSpotLightDir,0.0);
var spot=0.999;

/* MATERIAL */

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 20.0;

var ambientColor, diffuseColor, specularColor;
var nMatrix, nMatrixLoc;

/* TEXTURE */

var enableTexture = 0.0

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);
}

/* FRAGMENT SHADING --> CARTOON */

var disableCartoon = 1.0 

/* FUNCTIONS FOR FACES */

function triangle(a, b, c) {
	var t1 = subtract(vertices[b], vertices[a]);
	var t2 = subtract(vertices[c], vertices[a]);
	var normal = normalize(cross(t2, t1));
	normal = vec4(normal[0], normal[1], normal[2], 0.0);
    
	pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

	pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
}

function quad(a, b, c, d) {

    var t1 = subtract(vertices[b], vertices[a]);
	var t2 = subtract(vertices[c], vertices[a]);
	var normal = normalize(cross(t2, t1));
	normal = vec4(normal[0], normal[1], normal[2], 0.0);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
}

/* FACES */

function SvevaColorCube()
{   

    // MIDDLE
    quad(6,5,20,18);
    quad(6,18,17,8);
    quad(7, 19, 20,5);
    quad(8, 17, 19,7);

    // MIDDLE T
    quad(10,9,5,6);
    quad(9,11,7,5);
    quad(12,10, 6, 8);
    quad(11,12, 8, 7);
    
    // MIDDLE - TOP
    quad(14,13,9,10);
    quad(13,15,11,9);
    quad(16,14,10,12);
    quad(15,16,12,11);

    // BOTTOM QUAD
    quad(3,4,2,1);

    // BOTTOM T
    quad(4,3,17,18);
    quad(3,1,19,17);
    quad(2,4,18,20);
    quad(1,2,20,19);

    // BOTTOM
    quad(4,2,22,24);
    quad(1,3,23,21);
    quad(22,2,1,21);
    quad(3,4,24,23);
    quad(24,23,21,22);

    // TOP 
    triangle(0,13,14);
    triangle(0,15,13);
    triangle(0,14,16);
    triangle(0,16,15);
}

/* HERE WE GO ---> START */

window.onload = function init() {

    /****************** CANVAS ******************/

    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    aspect =  canvas.width/canvas.height;

    gl.enable(gl.DEPTH_TEST);

    /********************* SHADERS *****************/

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    /******************** LIGHTS *********************/

    var directAmbientProduct = mult(directLightAmbient, materialAmbient);
    var directDiffuseProduct = mult(directLightDiffuse, materialDiffuse);
    var directSpecularProduct = mult(directLightSpecular, materialSpecular);

    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);
    
    /***************** IMG FOR TEXTURE ***************/

    var image = document.getElementById("texImage");
    
    /******************* BUILD FIGURE **************+*/

    SvevaColorCube();
	
	var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
		
	var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);
	
	modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
	nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");


    /*********************** SLIDERS  VIEW *******************************/

    document.getElementById("zFarSlider").onchange = function(event) {
        far = event.target.value;
    };
    document.getElementById("zNearSlider").onchange = function(event) {
        near = event.target.value;
    };
    document.getElementById("radiusSlider").onchange = function(event) {
        radius = event.target.value;
    };
    document.getElementById("thetaSlider").onchange = function(event) {
        theta = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("aspectSlider").onchange = function(event) {
        aspect = event.target.value;
    };
    document.getElementById("fovSlider").onchange = function(event) {
        fovy = event.target.value;
    };

    /*********************** SLIDERS  SPOT *******************************/


    document.getElementById("xSpotLight").onchange = function(event) {
        xSpotLight = event.target.value;
        spotLightPosition[0] = xSpotLight;
        init();
    };
    document.getElementById("ySpotLight").onchange = function(event) {
        ySpotLight = event.target.value;
        spotLightPosition[1] = ySpotLight;
        init();
    };
    document.getElementById("zSpotLight").onchange = function(event) {
        zSpotLight = event.target.value;
        spotLightPosition[2] = zSpotLight;
        init();
    };
    document.getElementById("rSpotLightA").onchange = function(event) {
        rSpotLightA = event.target.value;
        spotLightAmbient[0] = rSpotLightA;
        init();
    };
    document.getElementById("gSpotLightA").onchange = function(event) {
        gSpotLightA = event.target.value;
        spotLightAmbient[1] = gSpotLightA;
        init();
    };
    document.getElementById("bSpotLightA").onchange = function(event) {
        bSpotLightA = event.target.value;
        spotLightAmbient[2] = bSpotLightA;
        init();
    };
    document.getElementById("rSpotLightD").onchange = function(event) {
        rSpotLightD = event.target.value;
        spotLightDiffuse[0] = rSpotLightD;
        init();
    };
    document.getElementById("gSpotLightD").onchange = function(event) {
        gSpotLightD = event.target.value;
        spotLightDiffuse[1] = gSpotLightD;
        init();
    };
    document.getElementById("bSpotLightD").onchange = function(event) {
        bSpotLightD = event.target.value;
        spotLightDiffuse[2] = bSpotLightD;
        init();
    };
    document.getElementById("rSpotLightS").onchange = function(event) {
        rSpotLightS = event.target.value;
        spotLightSpecular[0] = rSpotLightS;
        init();
    };
    document.getElementById("gSpotLightS").onchange = function(event) {
        gSpotLightS = event.target.value;
        spotLightSpecular[1] = gSpotLightS;
        init();
    };
    document.getElementById("bSpotLightS").onchange = function(event) {
        bSpotLightS = event.target.value;
        spotLightSpecular[2] = bSpotLightS;
        init();
    };

    document.getElementById("xSpotLightDir").onchange = function(event) {
        xSpotLightDir = event.target.value;
        spotLightDirection[0] = xSpotLightDir;
        init();
    };
    document.getElementById("ySpotLightDir").onchange = function(event) {
        ySpotLightDir = event.target.value;
        spotLightDirection[1] = ySpotLightDir;
        init();
    };
    document.getElementById("zSpotLightDir").onchange = function(event) {
        zSpotLightDir = event.target.value;
        spotLightDirection[2] = zSpotLightDir;
        init();
    };

    document.getElementById("spot").onchange = function(event) {
        spot = event.target.value;
        init();
    };
    
    /*********************** BUTTONS *******************************/

    document.getElementById("EnableTexture").onclick = function(){
        enableTexture = 1.0-enableTexture; 
        if(enableTexture ==1.0){
            configureTexture(image);
        }
    };

    document.getElementById("DisableCartoon").onclick = function(){
        disableCartoon = 1.0-disableCartoon; 
        init();
    };

    /******************** UNIFORM DIRECTIONAL LIGHT *****************/

    
    gl.uniform4fv( gl.getUniformLocation(program,
        "uDirectionLightDirection"), directLightDirection );
	gl.uniform4fv( gl.getUniformLocation(program,
       "uDirectionAmbientProduct"),directAmbientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uDirectionDiffuseProduct"),directDiffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "uDirectionSpecularProduct"), directSpecularProduct );

    /**************** UNIFORM SPOTLIGHT ***********************/
    
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotLightPosition"), spotLightPosition );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotLightDirection"),spotLightDirection );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotAmbientProduct"),spotAmbientProduct);
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotDiffuseProduct"),spotDiffuseProduct);
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotSpecularProduct"), spotSpecularProduct);
    gl.uniform1f( gl.getUniformLocation(program,
        "uSpot"), spot );
    

    gl.uniform1f( gl.getUniformLocation(program,
        "uShininess"),materialShininess );

    render();
}

var render = function() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    
    /**************** EYE  **********************/

    gl.uniform3fv(gl.getUniformLocation(program,
            "eyePosition"), eye);
    
    /**************** FOR TEXTURE  **********************/

    gl.uniform1f( gl.getUniformLocation(program,
                "turnOn"), enableTexture );
    
    /**************** FOR CARTOON **********************/

    gl.uniform1f(gl.getUniformLocation(program,
                    "ShadingOff"), disableCartoon );

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far); 
	nMatrix =normalMatrix(modelViewMatrix, true );
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix));
	
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimationFrame(render);
}
