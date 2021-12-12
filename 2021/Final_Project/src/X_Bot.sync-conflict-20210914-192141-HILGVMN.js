import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';


class X_Bot{
    
    constructor(){

        this.gltfLoader = null;
        this.data_loaded = null;
        this.model = null;
        this.scene = null;

        this.parts = {
            //armature : null,

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
    }
    

    async load(model_path){
        this.gltfLoader = new GLTFLoader();
        this.data_loaded = await this.gltfLoader.loadAsync(model_path);
        this.scene = this.data_loaded.scene;  
        this.model = this.scene.getObjectByName('Armature');
        this.__init();  
    }

    __init(){
        //this.parts.armature = this.model.getObjectByName('Armature');
        
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



}


export { X_Bot };
