"use strict";

var canvas;
var gl;

var positionsArray = []; //contains position of usb and neon
var normalsArray = []; //contains normals of usb
var texCoordsArray = []; //contains texture coordinate of usb

var modelViewMatrix, projectionMatrix;

//true -> per-vertex
//false -> per-fragment
var per_vertex_shading = true; //current mode
var old_per_vertex_shading = true; //old mode (used to detect the change inside render function)
var mode_label; //object used to print the current shading mode


var texCoord = [
   vec2(0, 0),
   vec2(0, 1),
   vec2(1, 1),
   vec2(1, 0)
];

// VERTICIES #############################################################################
// The total number of vertices is 32

var vertices_case = [
   /* a1 */ vec4(-0.375, -0.144, -0.025, 1),
   /* b1 */ vec4(-0.375, 0.206, -0.025, 1),
   /* c1 */ vec4(0.375, 0.206, -0.025, 1),
   /* d1 */ vec4(0.375, -0.144, -0.025, 1),
   /* e1 */ vec4(-0.375, -0.144, -0.525, 1),
   /* f1 */ vec4(-0.375, 0.206, -0.525, 1),
   /* g1 */ vec4(0.375, 0.206, -0.525, 1),
   /* h1 */ vec4(0.375, -0.144, -0.525, 1)
];

var vertices_usb_port = [
   /* a2 */ vec4(-0.3, -0.081, 0.575, 1),
   /* b2 */ vec4(-0.3, 0.144, 0.575, 1),
   /* c2 */ vec4(0.3, 0.144, 0.575, 1),
   /* d2 */ vec4(0.3, -0.081, 0.575, 1),
   /* e2 */ vec4(-0.3, -0.081, -0.025, 1),
   /* f2 */ vec4(-0.3, 0.144, -0.025, 1),
   /* g2 */ vec4(0.3, 0.144, -0.025, 1),
   /* h2 */ vec4(0.3, -0.081, -0.025, 1),
   /* i2 */ vec4(-0.3, 0.144, 0.325, 1),
   /* j2 */ vec4(-0.2, 0.144, 0.325, 1),
   /* k2 */ vec4(-0.075, 0.144, 0.325, 1),
   /* l2 */ vec4(0.075, 0.144, 0.325, 1),
   /* m2 */ vec4(0.2, 0.144, 0.325, 1),
   /* n2 */ vec4(0.3, 0.144, 0.325, 1),
   /* o2 */ vec4(-0.3, 0.144, 0.225, 1),
   /* p2 */ vec4(-0.2, 0.144, 0.225, 1),
   /* q2 */ vec4(-0.075, 0.144, 0.225, 1),
   /* r2 */ vec4(0.075, 0.144, 0.225, 1),
   /* s2 */ vec4(0.2, 0.144, 0.225, 1),
   /* t2 */ vec4(0.3, 0.144, 0.225, 1),
   /* u2 */ vec4(-0.3, 0.019, 0.575, 1),
   /* v2 */ vec4(0.3, 0.019, 0.575, 1)
];

// ONLY f3 and g3 vertices are used
// other vertices are used as padding, in this way we can access to the buffer
// using as index the vertex's name (i.e. f and g)
var vertices_usb_pins = [
   /* a3=a2 */vertices_usb_port[name_to_index('a')], //vec4(-0.3, -0.081, 0.575, 1),
   /* b3=u2 */vertices_usb_port[name_to_index('u')], //vec4(-0.3, 0.019, 0.575, 1),
   /* c3=v2 */vertices_usb_port[name_to_index('v')], //vec4(0.3, 0.019, 0.575, 1),
   /* d3=d2 */vertices_usb_port[name_to_index('d')], //vec4(0.3, -0.081, 0.575, 1),
   /* e3=e2 */vertices_usb_port[name_to_index('e')], //vec4(-0.3, -0.081, -0.025, 1),
   /* f3 */ vec4(-0.3, 0.019, -0.025, 1),
   /* g3 */ vec4(0.3, 0.019, -0.025, 1),
   /* h3=h2 */vertices_usb_port[name_to_index('h')],//vec4(0.3, -0.081, -0.025, 1),   
];

var numPositions_USB = 36+24+6+12+6+12;
var numPositions_NEON=0;
// #############################################################################################


// LIGHT ##################################################################

// size of neon tube
var radius_NEON = 0.02;
var height_NEON = 1.5; 

// The three lights are alligned on a line parallel to x-axis
/*
    ____________________________________
   |______*__________*_________*________|
        -0.5         0        0.5

                   y ^
                     |
                     ---> x
*/
var light_1 = -0.5;
var light_2 = 0.0;
var light_3 = 0.5;

// light position used in USB program
var lightPosition_1 = vec4(light_1, 1, 0, 0);
var lightPosition_2 = vec4(light_2, 1, 0, 0);
var lightPosition_3 = vec4(light_3, 1, 0, 0);



// light position used in NEON program
// The following coordinate are used to compute the emissive terms
// for the cylindrical neon, since the neon is built starting from 0
// we need to convert the light position in the intervall [0, height_NEON]
var l1 = light_1 + (height_NEON/2);
var l2 = light_2 + (height_NEON/2);
var l3 = light_3 + (height_NEON/2);

// properties of the light
var lightAmbient = vec4(0.4, 0.4, 0.4, 1.0);
var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

// status of the light
var status_light = true;
var ambientProduct_NEON;
var materialAmbient_NEON = vec4(0.4, 0.4, 0.4, 1.0);

// ############################################################################


// MATERIAL ##################################################################
// material properties of the usb 
var materialAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var materialDiffuse = vec4(0.3, 0.3, 0.3, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;

// product used during the rendering
var ambientProduct;
var diffuseProduct;
var specularProduct;
// ###########################################################################



// PROGRAMS ########################################################
var program_usb; //current program used for render the usb
var program_neon; // current program used for neon light

//PER-VERTEX PROGRAM
var program_usb_PV;
var program_neon_PV;

//PER-FRAGMENT PROGRAM
var program_usb_PF;
var program_neon_PF;
//##########################################################################

// ROTATION ############################################################
var direction = 1; //1 or -1 //clockwise or couterclockwise
var flag = true; //disable/enable rotation

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0; //current rotation axis
var theta = vec3(0, 0, 0); // angle in degree 


// VIEW POSITION ################################################### 
var radius = 4.0; // current distace of the camera from the origin

// angles used to move the camera
var theta_view = 0.0;
var phi = 0.0;

// position of the camera
var eye;
   var eye_x;
   var eye_y;
   var eye_z;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// PERSPECTIVE PROJECTION ###########################################
//define the view volume
var near = 0.3;
var far = 5.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;  // Viewport aspect ratio
// ####################################################################

// MAIN FUNCTION
function init() {
   canvas = document.getElementById("gl-canvas");
   gl = canvas.getContext('webgl2');
   if (!gl) alert( "WebGL 2.0 isn't available");

   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clearColor(0.1, 0.1, 0.1, 1.0);
   gl.enable(gl.DEPTH_TEST);

   build(); // build usb and neon light 
   gui_interface_init();

   init_programs();
   render();
}

// RENDER FUNCTION
function render(){
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear buffers

   // if the shading mode is changed then it changes the programs
   if(old_per_vertex_shading != per_vertex_shading){
      init_programs();
      old_per_vertex_shading = per_vertex_shading;
   }
   render_neon();
   render_usb();
   requestAnimationFrame(render);
}



// FUNCTIONS USED IN init() #############################################################

// build the usb object and the neon
// the two functions used are declared at the end of this JS file
function build(){
   build_usb(positionsArray, normalsArray, texCoordsArray);
   build_cylinder(positionsArray, normalsArray, radius_NEON, height_NEON);
}

function gui_interface_init(){
   document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
   document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
   document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
   document.getElementById("ButtonT").onclick = function(){flag = !flag;};

   document.getElementById("ButtonD").onclick = function(){direction=(direction==1)?-1:1;};

   document.getElementById("Button_light").onclick = function(){status_light = !status_light;};

   document.getElementById("Button_Toggle_shading").onclick = function(){
      old_per_vertex_shading = per_vertex_shading;
      per_vertex_shading = !per_vertex_shading;
   };

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
      theta_view = event.target.value* Math.PI/180.0;
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
}

function init_programs(){
   mode_label = document.getElementById("mode_label"); // label in HTML page

   if(per_vertex_shading){
      program_usb_PV = initShaders(gl, "vertex-shader_USB_per_vert", "fragment-shader_USB_per_vert");
      init_program_USB(program_usb_PV);
      program_neon_PV = initShaders(gl, "vertex-shader_NEON_per_vert", "fragment-shader_NEON_per_vert");
      init_program_NEON(program_neon_PV);    

      mode_label.innerHTML = "<div> PER-VERTEX </div>";
   }
   else{
      program_usb_PF = initShaders(gl, "vertex-shader_USB_per_frag", "fragment-shader_USB_per_frag");
      init_program_USB(program_usb_PF);
      program_neon_PF = initShaders(gl, "vertex-shader_NEON_per_frag", "fragment-shader_NEON_per_frag");
      init_program_NEON(program_neon_PF); 

      mode_label.innerHTML = "<div> PER-FRAGMENT </div>";
   }

   // update the current programs
   program_neon = (per_vertex_shading)?program_neon_PV:program_neon_PF;
   program_usb = (per_vertex_shading)?program_usb_PV:program_usb_PF;
}

function init_program_NEON(program){
   // build program
   gl.useProgram(program);

   // POSITIONS
      var vBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
      var positionLoc = gl.getAttribLocation(program, "aPosition");
      gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

   // position of the lights inside the tube
   gl.uniform1f(gl.getUniformLocation(program, "ul1"), l1);
   gl.uniform1f(gl.getUniformLocation(program, "ul2"), l2);
   gl.uniform1f(gl.getUniformLocation(program, "ul3"), l3);
   
   ambientProduct_NEON = mult(lightAmbient, materialAmbient_NEON);
   gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), ambientProduct_NEON);
}


function init_program_USB(program){
   gl.useProgram(program);

   //NORMALS
      var nBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
      var normalLoc = gl.getAttribLocation(program, "aNormal");
      gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(normalLoc);

   // POSITIONS
      var vBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
      var positionLoc = gl.getAttribLocation(program, "aPosition");
      gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

   // TEXTURE
      texture_init(program);

      ambientProduct = mult(lightAmbient, materialAmbient);
      diffuseProduct = mult(lightDiffuse, materialDiffuse);
      specularProduct = mult(lightSpecular, materialSpecular);
   // MATERIAL AND LIGHT
      gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), ambientProduct);
      gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"), diffuseProduct);
      gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"), specularProduct);
      
      gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);
}

function texture_init(webgl_program){
   var tBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

   var texCoordLoc = gl.getAttribLocation(webgl_program, "aTexCoord");
   gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(texCoordLoc);

   var image = new Image();
   image.onload = function() {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   }
   image.src = "texture_1.jpg";
}
// ##############################################################################################


// FUNCTIONS USED IN render() ##################################################################
function render_neon(){

   gl.useProgram(program_neon);

   projectionMatrix = perspective(fovy, aspect, near, far);
   gl.uniformMatrix4fv(gl.getUniformLocation(program_neon, "uProjectionMatrix"), false, flatten(projectionMatrix));

   eye_x = radius*Math.sin(theta_view)*Math.cos(phi);
   eye_y = radius*Math.sin(theta_view)*Math.sin(phi);
   eye_z = radius*Math.cos(theta_view);
   eye = vec3(eye_x, eye_y, eye_z);
   modelViewMatrix = lookAt(eye, at, up);
   modelViewMatrix = mult(modelViewMatrix, translate(-height_NEON/2, 1,0));
   modelViewMatrix = mult(modelViewMatrix, rotate(-90, vec3(0, 1, 0)));
   gl.uniformMatrix4fv(gl.getUniformLocation(program_neon, "uModelViewMatrix"), false, flatten(modelViewMatrix));

   gl.uniform1f(gl.getUniformLocation(program_neon, "uLightState"), status_light);

   gl.drawArrays(gl.TRIANGLES, numPositions_USB, numPositions_NEON);
}

function render_usb(){
   
   gl.useProgram(program_usb);
   
   projectionMatrix = perspective(fovy, aspect, near, far);
   gl.uniformMatrix4fv(gl.getUniformLocation(program_usb, "uProjectionMatrix"), false, flatten(projectionMatrix)); 

   eye_x = radius*Math.sin(theta_view)*Math.cos(phi);
   eye_y = radius*Math.sin(theta_view)*Math.sin(phi);
   eye_z = radius*Math.cos(theta_view);
   eye = vec3(eye_x, eye_y, eye_z);
   modelViewMatrix = lookAt(eye, at, up);

   var l = mult(modelViewMatrix, lightPosition_1);
   gl.uniform4fv(gl.getUniformLocation(program_usb, "uLightPosition_1"), l);

   l = mult(modelViewMatrix, lightPosition_2);
   gl.uniform4fv(gl.getUniformLocation(program_usb, "uLightPosition_2"), l);

   l = mult(modelViewMatrix, lightPosition_3);
   gl.uniform4fv(gl.getUniformLocation(program_usb, "uLightPosition_3"), l);


   if(flag) theta[axis] += (2.0*direction);
   modelViewMatrix= mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
   modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
   modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));
   modelViewMatrix = mult(modelViewMatrix, scale(0.6, 0.6, 0.6));
   gl.uniformMatrix4fv(gl.getUniformLocation(program_usb, "uModelViewMatrix"), false, flatten(modelViewMatrix));

   gl.uniform1f(gl.getUniformLocation(program_usb, "uLightState"), status_light);

   gl.drawArrays(gl.TRIANGLES, 0, numPositions_USB);
}
// #############################################################################################

// START POINT
init();











// BUILD #############################################################

// Neon -------------------------------------------------------------
function build_cylinder(pos_array, norm_array, radius, height){

   //var radius = 0.02;
   var num_sectors = 100;
   //var height = 1.2;
   var number_vertical_sectors = 100;

   var circle_points = compute_base_circle(radius, num_sectors);
   //var h = 0.5;
   var dh = height/number_vertical_sectors;
   
   //vertices of the sector
   var a;
   var b;
   var c;
   var d;

   var dz;

   var i;
   var j;  
   for(i=0; i<number_vertical_sectors; i++){
      dz = dh*i;
      for(j=0; j<circle_points.length+1; j++){
         //circular access
         var idx_a = j%circle_points.length;
         var idx_d = (j+1)%circle_points.length;

         var a_temp = circle_points[idx_a]; 
         a = vec4(a_temp[0], a_temp[1], dz, 1);
         b = vec4(a_temp[0], a_temp[1], dz+dh, 1)

         var d_temp = circle_points[idx_d];
         d = vec4(d_temp[0], d_temp[1], dz, 1);
         c = vec4(d_temp[0], d_temp[1], dz+dh, 1);
         
         //draw the current sector
         sector(b,a,d,c, pos_array, norm_array);
      }
   }
   //draw the up and down side of the cylinder
   draw_circles(circle_points, vec3(0,0,0), height, pos_array, norm_array);
}

function sector(a, b, c, d, pos_array, norm_array){

   var t1 = subtract(b, a);
   var t2 = subtract(c, b);

   var normal = cross(t1, t2);
   normal = vec3(normal);

   var normal_a = normal;
   var normal_b = normal;
   var normal_c = normal;
   var normal_d = normal;

   pos_array.push(a);
   norm_array.push(normal_a);

   pos_array.push(b);
   norm_array.push(normal_b);
   
   pos_array.push(c);
   norm_array.push(normal_c);
   
   pos_array.push(a);
   norm_array.push(normal_a);
   
   pos_array.push(c);
   norm_array.push(normal_c);
   
   pos_array.push(d);
   norm_array.push(normal_d);

   numPositions_NEON += 6;
}

function draw_circles(circle_points, origin, height, pos_array, norm_array){
   var i;
   var j;
      for(i=0; i<2; i++){  
         for(j=0; j<circle_points.length+1; j++){
            //circular access
            var idx_a = j%circle_points.length;
            var idx_b = (j+1)%circle_points.length;

            var a_temp = circle_points[idx_a]; 
            var b_temp = circle_points[idx_b];

            var dz = a_temp[2]+i*height;

            var a = vec4(a_temp[0], a_temp[1], dz, 1);
            var b = vec4(b_temp[0], b_temp[1], dz, 1);
            var c = vec4(origin[0], origin[1], dz, 1);
            
            triangle(a,b,c, pos_array, norm_array);
         }
      }
}


//build a circle divided in num_sectors sectors
//the circle is on the plane xy
//it is centered at the origin
function compute_base_circle(radius, num_sectors){
   var step = 2*Math.PI/num_sectors;
   var angle;

   var points = [];
   var i;

   //build a circle on xy plane centered at the origin
   for(i=0; i<num_sectors; i++){
      angle = i*step;
      var p_x = radius*Math.cos(angle);
      var p_y = radius*Math.sin(angle);
      var p_z = 0;

      points.push(vec3(p_x, p_y, p_z));
   }
   return points;
}

function triangle(a,b,c, pos_array, norm_array){
   var t1 = subtract(b, a);
   var t2 = subtract(c, b);
   var normal = cross(t1, t2);
   normal = vec3(normal);

   pos_array.push(a);
   norm_array.push(normal);

   pos_array.push(b);
   norm_array.push(normal);
   
   pos_array.push(c);
   norm_array.push(normal);

   numPositions_NEON += 3;
}
// ------------------------------------------------------------------------



// USB -------------------------------------------------------------------------------
function build_usb(pos_array, norm_array, texture_array){
   // CASE ---------------------------------------------------------------------------------------------
   quad_char('b', 'a', 'd', 'c', vertices_case, pos_array, norm_array, texture_array); //Face 1
   quad_char('c', 'd', 'h', 'g', vertices_case, pos_array, norm_array, texture_array); //Face 2
   quad_char('d', 'a', 'e', 'h', vertices_case, pos_array, norm_array, texture_array); //Face 3
   quad_char('g', 'f', 'b', 'c', vertices_case, pos_array, norm_array, texture_array); //Face 4
   quad_char('e', 'f', 'g', 'h', vertices_case, pos_array, norm_array, texture_array); //Face 5
   quad_char('f', 'e', 'a', 'b', vertices_case, pos_array, norm_array, texture_array); //Face 6

   // USB PORT -------------------------------------------------------------------------------------
   quad_char('u', 'a', 'd', 'v', vertices_usb_port, pos_array, norm_array, texture_array); //Face 1

   quad_char('c', 'd', 'h', 'g', vertices_usb_port, pos_array, norm_array, texture_array); //Face 2
   quad_char('d', 'a', 'e', 'h', vertices_usb_port, pos_array, norm_array, texture_array); //Face 3

   quad_char('f', 'o', 't', 'g', vertices_usb_port, pos_array, norm_array, texture_array); //Face 4
   quad_char('o', 'i', 'j', 'p', vertices_usb_port, pos_array, norm_array, texture_array); //Face 4
   quad_char('q', 'k', 'l', 'r', vertices_usb_port, pos_array, norm_array, texture_array); //Face 4
   quad_char('m', 'n', 't', 's', vertices_usb_port, pos_array, norm_array, texture_array); //Face 4
   quad_char('i', 'b', 'c', 'n', vertices_usb_port, pos_array, norm_array, texture_array); //Face 4

   quad_char('f', 'e', 'a', 'b', vertices_usb_port, pos_array, norm_array, texture_array); //Face 6

   // PINS ------------------------------------------------------------------------------------------
   // front
   //quad_char('f', 'b', 'c', 'g', vertices_usb_pins, pos_array, norm_array, texture_array); //Face 4
   
   // back
   quad_char('b', 'f', 'g', 'c', vertices_usb_pins, pos_array, norm_array, texture_array); //Face 4

}

function name_to_index(vertices_name){
   return vertices_name.toLowerCase().charCodeAt(0) - 97;
}

function quad_char(a_, b_, c_, d_, vert, pos_array, norm_array, texture_array) {
   var a = name_to_index(a_)
   var b = name_to_index(b_)
   var c = name_to_index(c_)
   var d = name_to_index(d_)


   var t1 = subtract(vert[b], vert[a]);
   var t2 = subtract(vert[c], vert[b]);
   var normal = cross(t1, t2);
   normal = vec3(normal);


   pos_array.push(vert[a]);
   norm_array.push(normal);
   texture_array.push(texCoord[0]);

   pos_array.push(vert[b]);
   norm_array.push(normal);
   texture_array.push(texCoord[1]);

   pos_array.push(vert[c]);
   norm_array.push(normal);
   texture_array.push(texCoord[2]);
   
   pos_array.push(vert[a]);
   norm_array.push(normal);
   texture_array.push(texCoord[0]);
   
   pos_array.push(vert[c]);
   norm_array.push(normal);
   texture_array.push(texCoord[2]);
   
   pos_array.push(vert[d]);
   norm_array.push(normal);
   texture_array.push(texCoord[3]);
}

// -------------------------------------------------------------------------------------




