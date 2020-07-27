# Interactive-Graphics 

Here you can find the two homework carried out in the year 2019 - 2020

## Homework 1

1. Replace the cube with a more complex and irregular geometry of 20 to 30 (maximum) vertices.
Each vertex should have associated a normal (3 or 4 coordinates) and a texture coordinate (2
coordinates). Explain how you choose the normal and texture coordinates.

2. Add the viewer position (your choice), a perspective projection (your choice of parameters) and
compute the ModelView and Projection matrices in the Javascript application. The viewer position
and viewing volume should be controllable with buttons, sliders or menus. Please choose the
parameters so that the object is clearly visible.

3. Add two light sources, a spotlight in a finite position and one directional. The parameters of the
spotlight should be controllable with buttons, sliders or menus. Assign to each light source all the
necessary parameters (your choice).

4. Assign to the object a material with the relevant properties (your choice).

5. Implement a per-fragment shading model based on the shading model described at the end of this
document.

6. Add a texture loaded from file (your choice), with the pixel color a combination of the color
computed using the lighting model and the texture. Add a button that activates/deactivates the
texture.


## Homework 2

1. Create a hierarchical model of a (simplified) Grizzly bear
    + body
    + 4 legs, each one composed of 2 independent components (upper and lower leg)
    + head
    + tail
    
2. Add a texture to the all the faces of the bear, except the head. The head has a separate texture.

3. Create a (very simplified) model of a tree and position it near the bear.

4. Add a button that starts an animation of the bear so that, starting from an initial position where it
is in a walking mode, it walks towards the tree by moving (alternatively back and forth) the legs,
then stands up and starts scratching its back against the tree.
