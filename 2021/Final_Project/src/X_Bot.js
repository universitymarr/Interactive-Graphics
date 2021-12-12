import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';
import * as THREE from '../libs/three_js/three.module.js';


class X_Bot{
    
    constructor(){

        this.gltfLoader = null;
        this.data_loaded = null;
        this.model = null;
        this.scene = null;

        this.parts = {
            armature : null,

            hips : null,
            
            spine : null,
            spine_1  : null,
            spine_2 : null,
            neck : null,

            head : null,
            head_top_end : null,

            left_eye : null,
            right_eye : null,


            // LEFT
            left_shoulder : null,
            left_arm : null,
            left_fore_arm : null,
            left_hand : null,

            left_hand_thumb_1 : null,
            left_hand_thumb_2 : null,
            left_hand_thumb_3 : null,
            left_hand_thumb_4 : null,

            left_hand_index_1 : null,
            left_hand_index_2 : null,
            left_hand_index_3 : null,
            left_hand_index_4 : null,

            left_hand_middle_1 : null,
            left_hand_middle_2 : null,
            left_hand_middle_3 : null,
            left_hand_middle_4 : null,

            left_hand_ring_1 : null,
            left_hand_ring_2 : null,
            left_hand_ring_3 : null,
            left_hand_ring_4 : null,

            left_hand_pinky_1 : null,
            left_hand_pinky_2 : null,
            left_hand_pinky_3 : null,
            left_hand_pinky_4 : null,


            // RIGHT
            right_shoulder : null,
            right_arm : null,
            right_fore_arm : null,
            right_hand : null,

            right_hand_thumb_1 : null,
            right_hand_thumb_2 : null,
            right_hand_thumb_3 : null,
            right_hand_thumb_4 : null,

            right_hand_index_1 : null,
            right_hand_index_2 : null,
            right_hand_index_3 : null,
            right_hand_index_4 : null,

            right_hand_middle_1 : null,
            right_hand_middle_2 : null,
            right_hand_middle_3 : null,
            right_hand_middle_4 : null,

            right_hand_ring_1 : null,
            right_hand_ring_2 : null,
            right_hand_ring_3 : null,
            right_hand_ring_4 : null,

            right_hand_pinky_1 : null,
            right_hand_pinky_2 : null,
            right_hand_pinky_3 : null,
            right_hand_pinky_4 : null,


            // LEFT
            left_up_leg : null,
            left_leg : null,
            left_foot : null,
            left_toe_base : null,
            left_toe_end : null,


            // RIGHT
            right_up_leg : null,
            right_leg : null,
            right_foot : null,
            right_toe_base : null,
            right_toe_end : null
        }

        this.materials = {
            surface : null,
            joints : null
        }

        this.T_configuration = {
            // HIPS --------------------------------------------
            hips_position: {x: 0.33, y: 99.54, z:0}, 
            hips_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0}, 
            //_________________________________________________________
        
            // SPINES ----------------------------------------------------
            spine_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            spine1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            spine2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // __________________________________________________________
        
            // NECK -----------------------------------------------------
            neck_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _________________________________________________________
        
            // HEAD ---------------------------------------------------
            head_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _______________________________________________________
        
            // LEFT UPPER LIMBS ------------------------------------
            leftshoulder_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            leftarm_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            leftforearm_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ______________________________________________________
        
            // LEFT HAND --------------------------------------------
            lefthand_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // thumb
            lefthandthumb1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandthumb2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandthumb3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            // index
            lefthandindex1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandindex2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandindex3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //middle
            lefthandmiddle1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandmiddle2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandmiddle3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //ring
            lefthandring1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandring2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandring3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //pinky
            lefthandpinky1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandpinky2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandpinky3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ______________________________________________________
        
            // RIGHT UPPER LIMBS ------------------------------------
            rightshoulder_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            rightarm_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //fore arm
            rightforearm_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _____________________________________________________
        
            // RIGHT HAND --------------------------------------------
            righthand_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //pinky
            righthandpinky1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandpinky2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandpinky3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //ring
            righthandring1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandring2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandring3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            // middle
            righthandmiddle1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandmiddle2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandmiddle3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //index
            righthandindex1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandindex2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandindex3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            // thumb
            righthandthumb1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandthumb2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandthumb3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _____________________________________________________
        
            // LEFT DOWN LIMBS ------------------------------------
            leftupleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            leftleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ________________________________________________________
        
            // LEFT FOOT -----------------------------------------------
            leftfoot_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            lefttoebase_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            //__________________________________________________________
        
            // RIGHT DOWN LIMBS ------------------------------------
            rightupleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            rightleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _________________________________________________________
        
            // RIGHT FOOT -------------------------------------------------
            rightfoot_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            righttoebase_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ___________________________________________________________
        }

        this.rest_configuration = {
            // HIPS --------------------------------------------
            //hips_position: {x: 0.33, y: 99.54, z:0},
            hips_position: {x: 0.33, y: 105, z:0}, 
            hips_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0}, 
            //_________________________________________________________
        
            // SPINES ----------------------------------------------------
            spine_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            spine1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            spine2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // __________________________________________________________
        
            // NECK -----------------------------------------------------
            neck_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _________________________________________________________
        
            // HEAD ---------------------------------------------------
            head_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _______________________________________________________
        
            // LEFT UPPER LIMBS ------------------------------------
            leftshoulder_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            leftarm_quaternion: {x: 0.0, y: 0.0, z:-0.57346234436332832659922809930443, w: 0.81923192051904046657032585614919},
            
            leftforearm_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ______________________________________________________
        
            // LEFT HAND --------------------------------------------
            lefthand_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // thumb
            lefthandthumb1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandthumb2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandthumb3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            // index
            lefthandindex1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandindex2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandindex3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //middle
            lefthandmiddle1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandmiddle2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandmiddle3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //ring
            lefthandring1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandring2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandring3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //pinky
            lefthandpinky1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandpinky2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            lefthandpinky3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ______________________________________________________
        
            // RIGHT UPPER LIMBS ------------------------------------
            rightshoulder_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            rightarm_quaternion:  {x: 0.0, y: 0.0, z:0.57346234436332832659922809930443, w: 0.81923192051904046657032585614919},
            
            //fore arm
            rightforearm_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _____________________________________________________
        
            // RIGHT HAND --------------------------------------------
            righthand_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //pinky
            righthandpinky1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandpinky2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandpinky3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //ring
            righthandring1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandring2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandring3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            // middle
            righthandmiddle1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandmiddle2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandmiddle3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            //index
            righthandindex1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandindex2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandindex3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            // thumb
            righthandthumb1_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandthumb2_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            righthandthumb3_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _____________________________________________________
        
            // LEFT DOWN LIMBS ------------------------------------
            leftupleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            leftleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ________________________________________________________
        
            // LEFT FOOT -----------------------------------------------
            leftfoot_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            lefttoebase_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            //__________________________________________________________
        
            // RIGHT DOWN LIMBS ------------------------------------
            rightupleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            rightleg_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // _________________________________________________________
        
            // RIGHT FOOT -------------------------------------------------
            rightfoot_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            
            righttoebase_quaternion: {x: 0.0, y: 0.0, z:0.0, w: 1.0},
            // ___________________________________________________________
        }


        this.COLORS = {
            WHITE: 0xd6d6d6,
            BLUE: 0x010014
        };
    }
    

    async load(model_path){
        this.gltfLoader = new GLTFLoader();
        this.data_loaded = await this.gltfLoader.loadAsync(model_path);
        this.scene = this.data_loaded.scene;  
        this.model = this.scene.getObjectByName('Armature');
        this.__init();  
    }

    set_color(surface_color, joints_color){
        // let surface = 0xd6d6d6;
        // let joints = 0x010014;

        this.materials.surface.material = new THREE.MeshPhongMaterial({color: surface_color, specular:surface_color, shininess:5}); 
        this.materials.joints.material = new THREE.MeshPhongMaterial({color: joints_color, specular:joints_color, shininess:5});
    }

    __init(){
        this.model.scale.x = 1.0;
        this.model.scale.y = 1.0;
        this.model.scale.z = 1.0;

        this.parts.armature = this.model.getObjectByName('Armature');
        
        this.parts.hips = this.model.getObjectByName('mixamorigHips');
        
        this.parts.spine = this.model.getObjectByName('mixamorigSpine');
        this.parts.spine_1  = this.model.getObjectByName('mixamorigSpine1');
        this.parts.spine_2 = this.model.getObjectByName('mixamorigSpine2');


        this.parts.neck = this.model.getObjectByName('mixamorigNeck');
        
        this.parts.head = this.model.getObjectByName('mixamorigHead');
        this.parts.head_top_end = this.model.getObjectByName('mixamorigHeadTop_End');
        
        this.parts.left_eye = this.model.getObjectByName('mixamorigLeftEye');
        this.parts.right_eye = this.model.getObjectByName('mixamorigRightEye');
        
        
        // LEFT
        this.parts.left_shoulder = this.model.getObjectByName('mixamorigLeftShoulder');
        this.parts.left_arm = this.model.getObjectByName('mixamorigLeftArm');
        this.parts.left_fore_arm = this.model.getObjectByName('mixamorigLeftForeArm');
        this.parts.left_hand = this.model.getObjectByName('mixamorigLeftHand');
        
        this.parts.left_hand_thumb_1 = this.model.getObjectByName('mixamorigLeftHandThumb1');
        this.parts.left_hand_thumb_2 = this.model.getObjectByName('mixamorigLeftHandThumb2');
        this.parts.left_hand_thumb_3 = this.model.getObjectByName('mixamorigLeftHandThumb3');
        this.parts.left_hand_thumb_4 = this.model.getObjectByName('mixamorigLeftHandThumb4');
        
        this.parts.left_hand_index_1 = this.model.getObjectByName('mixamorigLeftHandIndex1');
        this.parts.left_hand_index_2 = this.model.getObjectByName('mixamorigLeftHandIndex2');
        this.parts.left_hand_index_3 = this.model.getObjectByName('mixamorigLeftHandIndex3');
        this.parts.left_hand_index_4 = this.model.getObjectByName('mixamorigLeftHandIndex4');
        
        this.parts.left_hand_middle_1 = this.model.getObjectByName('mixamorigLeftHandMiddle1');
        this.parts.left_hand_middle_2 = this.model.getObjectByName('mixamorigLeftHandMiddle2');
        this.parts.left_hand_middle_3 = this.model.getObjectByName('mixamorigLeftHandMiddle3');
        this.parts.left_hand_middle_4 = this.model.getObjectByName('mixamorigLeftHandMiddle4');
        
        this.parts.left_hand_ring_1 = this.model.getObjectByName('mixamorigLeftHandRing1');
        this.parts.left_hand_ring_2 = this.model.getObjectByName('mixamorigLeftHandRing2');
        this.parts.left_hand_ring_3 = this.model.getObjectByName('mixamorigLeftHandRing3');
        this.parts.left_hand_ring_4 = this.model.getObjectByName('mixamorigLeftHandRing4');
        
        this.parts.left_hand_pinky_1 = this.model.getObjectByName('mixamorigLeftHandPinky1');
        this.parts.left_hand_pinky_2 = this.model.getObjectByName('mixamorigLeftHandPinky2');
        this.parts.left_hand_pinky_3 = this.model.getObjectByName('mixamorigLeftHandPinky3');
        this.parts.left_hand_pinky_4 = this.model.getObjectByName('mixamorigLeftHandPinky4');


        // RIGHT
        this.parts.right_shoulder = this.model.getObjectByName('mixamorigRightShoulder');
        this.parts.right_arm = this.model.getObjectByName('mixamorigRightArm');
        this.parts.right_fore_arm = this.model.getObjectByName('mixamorigRightForeArm');
        this.parts.right_hand = this.model.getObjectByName('mixamorigRightHand');
        
        this.parts.right_hand_thumb_1 = this.model.getObjectByName('mixamorigRightHandThumb1');
        this.parts.right_hand_thumb_2 = this.model.getObjectByName('mixamorigRightHandThumb2');
        this.parts.right_hand_thumb_3 = this.model.getObjectByName('mixamorigRightHandThumb3');
        this.parts.right_hand_thumb_4 = this.model.getObjectByName('mixamorigRightHandThumb4');
        
        this.parts.right_hand_index_1 = this.model.getObjectByName('mixamorigRightHandIndex1');
        this.parts.right_hand_index_2 = this.model.getObjectByName('mixamorigRightHandIndex2');
        this.parts.right_hand_index_3 = this.model.getObjectByName('mixamorigRightHandIndex3');
        this.parts.right_hand_index_4 = this.model.getObjectByName('mixamorigRightHandIndex4');
        
        this.parts.right_hand_middle_1 = this.model.getObjectByName('mixamorigRightHandMiddle1');
        this.parts.right_hand_middle_2 = this.model.getObjectByName('mixamorigRightHandMiddle2');
        this.parts.right_hand_middle_3 = this.model.getObjectByName('mixamorigRightHandMiddle3');
        this.parts.right_hand_middle_4 = this.model.getObjectByName('mixamorigRightHandMiddle4');
        
        this.parts.right_hand_ring_1 = this.model.getObjectByName('mixamorigRightHandRing1');
        this.parts.right_hand_ring_2 = this.model.getObjectByName('mixamorigRightHandRing2');
        this.parts.right_hand_ring_3 = this.model.getObjectByName('mixamorigRightHandRing3');
        this.parts.right_hand_ring_4 = this.model.getObjectByName('mixamorigRightHandRing4');
        
        this.parts.right_hand_pinky_1 = this.model.getObjectByName('mixamorigRightHandPinky1');
        this.parts.right_hand_pinky_2 = this.model.getObjectByName('mixamorigRightHandPinky2');
        this.parts.right_hand_pinky_3 = this.model.getObjectByName('mixamorigRightHandPinky3');
        this.parts.right_hand_pinky_4 = this.model.getObjectByName('mixamorigRightHandPinky4');


        // LEFT
        this.parts.left_up_leg = this.model.getObjectByName('mixamorigLeftUpLeg');
        this.parts.left_leg = this.model.getObjectByName('mixamorigLeftLeg');
        this.parts.left_foot = this.model.getObjectByName('mixamorigLeftFoot');
        this.parts.left_toe_base = this.model.getObjectByName('mixamorigLeftToeBase');
        this.parts.left_toe_end = this.model.getObjectByName('mixamorigLeftToe_End');


        // RIGHT
        this.parts.right_up_leg = this.model.getObjectByName('mixamorigRightUpLeg');
        this.parts.right_leg = this.model.getObjectByName('mixamorigRightLeg');
        this.parts.right_foot = this.model.getObjectByName('mixamorigRightFoot');
        this.parts.right_toe_base = this.model.getObjectByName('mixamorigRightToeBase');
        this.parts.right_toe_end = this.model.getObjectByName('mixamorigRightToe_End');



        this.materials.surface = this.model.getObjectByName('Beta_Surface');
        this.materials.joints = this.model.getObjectByName('Beta_Joints');
        
    }

    _assign_dict_xyz(dst, src){
        dst.x = src.x;
        dst.y = src.y;
        dst.z = src.z;
    }

    _assign_dict_xyzw(dst, src){
        dst.x = src.x;
        dst.y = src.y;
        dst.z = src.z;
        dst.w = src.w;
    }

    set_configuration(config){
        // HIPS --------------------------------------------
        this._assign_dict_xyz(this.parts.hips.position, config.hips_position);
        this._assign_dict_xyzw(this.parts.hips.quaternion, config.hips_quaternion);
        //_________________________________________________________
                
        // SPINES ----------------------------------------------------
        this._assign_dict_xyzw(this.parts.spine.quaternion, config.spine_quaternion);
 
        this._assign_dict_xyzw(this.parts.spine_1.quaternion, config.spine1_quaternion);
        
        this._assign_dict_xyzw(this.parts.spine_2.quaternion, config.spine2_quaternion);
        // __________________________________________________________
    
        // NECK -----------------------------------------------------
        this._assign_dict_xyzw(this.parts.neck.quaternion, config.neck_quaternion);
        // _________________________________________________________
    
        // HEAD ---------------------------------------------------
        this._assign_dict_xyzw(this.parts.head.quaternion, config.head_quaternion);
        // _______________________________________________________
    
        // LEFT UPPER LIMBS ------------------------------------
        this._assign_dict_xyzw(this.parts.left_shoulder.quaternion, config.leftshoulder_quaternion); 
        
        this._assign_dict_xyzw(this.parts.left_arm.quaternion, config.leftarm_quaternion); 
        
        this._assign_dict_xyzw(this.parts.left_fore_arm.quaternion, config.leftforearm_quaternion);
        // ______________________________________________________
                
        // LEFT HAND --------------------------------------------
        this._assign_dict_xyzw(this.parts.left_hand.quaternion, config.lefthand_quaternion);
        
        // thumb
        this._assign_dict_xyzw(this.parts.left_hand_thumb_1.quaternion, config.lefthandthumb1_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_thumb_2.quaternion, config.lefthandthumb2_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_thumb_3.quaternion, config.lefthandthumb3_quaternion);
        
        // index
        this._assign_dict_xyzw(this.parts.left_hand_index_1.quaternion, config.lefthandindex1_quaternion); 
        this._assign_dict_xyzw(this.parts.left_hand_index_2.quaternion, config.lefthandindex2_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_index_3.quaternion, config.lefthandindex3_quaternion);
        
        //middle
        this._assign_dict_xyzw(this.parts.left_hand_middle_1.quaternion, config.lefthandmiddle1_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_middle_2.quaternion, config.lefthandmiddle2_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_middle_3.quaternion, config.lefthandmiddle3_quaternion);
        
 
        //ring
        this._assign_dict_xyzw(this.parts.left_hand_ring_1.quaternion, config.lefthandring1_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_ring_2.quaternion, config.lefthandring2_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_ring_3.quaternion, config.lefthandring3_quaternion);
        
        //pinky
        this._assign_dict_xyzw(this.parts.left_hand_pinky_1.quaternion, config.lefthandpinky1_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_pinky_2.quaternion, config.lefthandpinky2_quaternion);
        this._assign_dict_xyzw(this.parts.left_hand_pinky_3.quaternion, config.lefthandpinky3_quaternion);
        // ______________________________________________________
                
        // right UPPER LIMBS ------------------------------------
        this._assign_dict_xyzw(this.parts.right_shoulder.quaternion, config.rightshoulder_quaternion); 
        
        this._assign_dict_xyzw(this.parts.right_arm.quaternion, config.rightarm_quaternion); 
        
        this._assign_dict_xyzw(this.parts.right_fore_arm.quaternion, config.rightforearm_quaternion);
        // ______________________________________________________
                
        // right HAND --------------------------------------------
        this._assign_dict_xyzw(this.parts.right_hand.quaternion, config.righthand_quaternion);
        
        // thumb
        this._assign_dict_xyzw(this.parts.right_hand_thumb_1.quaternion, config.righthandthumb1_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_thumb_2.quaternion, config.righthandthumb2_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_thumb_3.quaternion, config.righthandthumb3_quaternion);
        
        // index
        this._assign_dict_xyzw(this.parts.right_hand_index_1.quaternion, config.righthandindex1_quaternion); 
        this._assign_dict_xyzw(this.parts.right_hand_index_2.quaternion, config.righthandindex2_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_index_3.quaternion, config.righthandindex3_quaternion);
        
        //middle
        this._assign_dict_xyzw(this.parts.right_hand_middle_1.quaternion, config.righthandmiddle1_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_middle_2.quaternion, config.righthandmiddle2_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_middle_3.quaternion, config.righthandmiddle3_quaternion);
        
 
        //ring
        this._assign_dict_xyzw(this.parts.right_hand_ring_1.quaternion, config.righthandring1_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_ring_2.quaternion, config.righthandring2_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_ring_3.quaternion, config.righthandring3_quaternion);
        
        //pinky
        this._assign_dict_xyzw(this.parts.right_hand_pinky_1.quaternion, config.righthandpinky1_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_pinky_2.quaternion, config.righthandpinky2_quaternion);
        this._assign_dict_xyzw(this.parts.right_hand_pinky_3.quaternion, config.righthandpinky3_quaternion);
        // ______________________________________________________
 
 
        // LEFT DOWN LIMBS ------------------------------------
        this._assign_dict_xyzw(this.parts.left_up_leg.quaternion, config.leftupleg_quaternion);
        this._assign_dict_xyzw(this.parts.left_leg.quaternion, config.leftleg_quaternion);
        // ________________________________________________________
                
        // LEFT FOOT -----------------------------------------------
        this._assign_dict_xyzw(this.parts.left_foot.quaternion, config.leftfoot_quaternion);
        this._assign_dict_xyzw(this.parts.left_toe_base.quaternion, config.lefttoebase_quaternion);
        //__________________________________________________________
    
 
        // right DOWN LIMBS ------------------------------------
        this._assign_dict_xyzw(this.parts.right_up_leg.quaternion, config.rightupleg_quaternion);
        this._assign_dict_xyzw(this.parts.right_leg.quaternion, config.rightleg_quaternion);
        // ________________________________________________________
                
        // right FOOT -----------------------------------------------
        this._assign_dict_xyzw(this.parts.right_foot.quaternion, config.rightfoot_quaternion);
        this._assign_dict_xyzw(this.parts.right_toe_base.quaternion, config.righttoebase_quaternion);
        //__________________________________________________________
    }



    set_rest_configuration(){
        this.set_configuration(this.rest_configuration);
    }

    get_current_configuration(){
        let config = JSON.parse(JSON.stringify(this.rest_configuration));
        
        // HIPS --------------------------------------------
        this._assign_dict_xyz(config.hips_position, this.parts.hips.position);
        this._assign_dict_xyzw(config.hips_quaternion, this.parts.hips.quaternion);
        //_________________________________________________________
                
        // SPINES ----------------------------------------------------
        this._assign_dict_xyzw(config.spine_quaternion, this.parts.spine.quaternion);
 
        this._assign_dict_xyzw(config.spine1_quaternion, this.parts.spine_1.quaternion);
        
        this._assign_dict_xyzw(config.spine2_quaternion, this.parts.spine_2.quaternion);
        // __________________________________________________________
    
        // NECK -----------------------------------------------------
        this._assign_dict_xyzw(config.neck_quaternion, this.parts.neck.quaternion);
        // _________________________________________________________
    
        // HEAD ---------------------------------------------------
        this._assign_dict_xyzw(config.head_quaternion, this.parts.head.quaternion);
        // _______________________________________________________
    
        // LEFT UPPER LIMBS ------------------------------------
        this._assign_dict_xyzw(config.leftshoulder_quaternion, this.parts.left_shoulder.quaternion); 
        
        this._assign_dict_xyzw(config.leftarm_quaternion, this.parts.left_arm.quaternion); 
        
        this._assign_dict_xyzw(config.leftforearm_quaternion, this.parts.left_fore_arm.quaternion);
        // ______________________________________________________
                
        // LEFT HAND --------------------------------------------
        this._assign_dict_xyzw(config.lefthand_quaternion, this.parts.left_hand.quaternion);
        
        // thumb
        this._assign_dict_xyzw(config.lefthandthumb1_quaternion, this.parts.left_hand_thumb_1.quaternion);
        this._assign_dict_xyzw(config.lefthandthumb2_quaternion, this.parts.left_hand_thumb_2.quaternion);
        this._assign_dict_xyzw(config.lefthandthumb3_quaternion, this.parts.left_hand_thumb_3.quaternion);
        
        // index
        this._assign_dict_xyzw(config.lefthandindex1_quaternion, this.parts.left_hand_index_1.quaternion); 
        this._assign_dict_xyzw(config.lefthandindex2_quaternion, this.parts.left_hand_index_2.quaternion);
        this._assign_dict_xyzw(config.lefthandindex3_quaternion, this.parts.left_hand_index_3.quaternion);
        
        //middle
        this._assign_dict_xyzw(config.lefthandmiddle1_quaternion, this.parts.left_hand_middle_1.quaternion);
        this._assign_dict_xyzw(config.lefthandmiddle2_quaternion, this.parts.left_hand_middle_2.quaternion);
        this._assign_dict_xyzw(config.lefthandmiddle3_quaternion, this.parts.left_hand_middle_3.quaternion);
        
 
        //ring
        this._assign_dict_xyzw(config.lefthandring1_quaternion, this.parts.left_hand_ring_1.quaternion);
        this._assign_dict_xyzw(config.lefthandring2_quaternion, this.parts.left_hand_ring_2.quaternion);
        this._assign_dict_xyzw(config.lefthandring3_quaternion, this.parts.left_hand_ring_3.quaternion);
        
        //pinky
        this._assign_dict_xyzw(config.lefthandpinky1_quaternion, this.parts.left_hand_pinky_1.quaternion);
        this._assign_dict_xyzw(config.lefthandpinky2_quaternion, this.parts.left_hand_pinky_2.quaternion);
        this._assign_dict_xyzw(config.lefthandpinky3_quaternion, this.parts.left_hand_pinky_3.quaternion);
        // ______________________________________________________
                
        // right UPPER LIMBS ------------------------------------
        this._assign_dict_xyzw(config.rightshoulder_quaternion, this.parts.right_shoulder.quaternion); 
        
        this._assign_dict_xyzw(config.rightarm_quaternion, this.parts.right_arm.quaternion);
        
        this._assign_dict_xyzw(config.rightforearm_quaternion, this.parts.right_fore_arm.quaternion);
        // ______________________________________________________
                
        // right HAND --------------------------------------------
        this._assign_dict_xyzw(config.righthand_quaternion, this.parts.right_hand.quaternion);
        
        // thumb
        this._assign_dict_xyzw(config.righthandthumb1_quaternion, this.parts.right_hand_thumb_1.quaternion);
        this._assign_dict_xyzw(config.righthandthumb2_quaternion, this.parts.right_hand_thumb_2.quaternion);
        this._assign_dict_xyzw(config.righthandthumb3_quaternion, this.parts.right_hand_thumb_3.quaternion);
        
        // index
        this._assign_dict_xyzw(config.righthandindex1_quaternion, this.parts.right_hand_index_1.quaternion); 
        this._assign_dict_xyzw(config.righthandindex2_quaternion, this.parts.right_hand_index_2.quaternion);
        this._assign_dict_xyzw(config.righthandindex3_quaternion, this.parts.right_hand_index_3.quaternion);
        
        //middle
        this._assign_dict_xyzw(config.righthandmiddle1_quaternion, this.parts.right_hand_middle_1.quaternion);
        this._assign_dict_xyzw(config.righthandmiddle2_quaternion, this.parts.right_hand_middle_2.quaternion);
        this._assign_dict_xyzw(config.righthandmiddle3_quaternion, this.parts.right_hand_middle_3.quaternion);
        
 
        //ring
        this._assign_dict_xyzw(config.righthandring1_quaternion, this.parts.right_hand_ring_1.quaternion);
        this._assign_dict_xyzw(config.righthandring2_quaternion, this.parts.right_hand_ring_2.quaternion);
        this._assign_dict_xyzw(config.righthandring3_quaternion, this.parts.right_hand_ring_3.quaternion);
        
        //pinky
        this._assign_dict_xyzw(config.righthandpinky1_quaternion, this.parts.right_hand_pinky_1.quaternion);
        this._assign_dict_xyzw(config.righthandpinky2_quaternion, this.parts.right_hand_pinky_2.quaternion);
        this._assign_dict_xyzw(config.righthandpinky3_quaternion, this.parts.right_hand_pinky_3.quaternion);
        // ______________________________________________________
 
 
        // LEFT DOWN LIMBS ------------------------------------
        this._assign_dict_xyzw(config.leftupleg_quaternion, this.parts.left_up_leg.quaternion);
        this._assign_dict_xyzw(config.leftleg_quaternion, this.parts.left_leg.quaternion);
        // ________________________________________________________
                
        // LEFT FOOT -----------------------------------------------
        this._assign_dict_xyzw(config.leftfoot_quaternion, this.parts.left_foot.quaternion);
        this._assign_dict_xyzw(config.lefttoebase_quaternion, this.parts.left_toe_base.quaternion);
        //__________________________________________________________
    
 
        // right DOWN LIMBS ------------------------------------
        this._assign_dict_xyzw(config.rightupleg_quaternion, this.parts.right_up_leg.quaternion);
        this._assign_dict_xyzw(config.rightleg_quaternion, this.parts.right_leg.quaternion);
        // ________________________________________________________
                
        // right FOOT -----------------------------------------------
        this._assign_dict_xyzw(config.rightfoot_quaternion, this.parts.right_foot.quaternion);
        this._assign_dict_xyzw(config.righttoebase_quaternion, this.parts.right_toe_base.quaternion);
        //__________________________________________________________
        
        return config;
    }

 
}


export { X_Bot };
