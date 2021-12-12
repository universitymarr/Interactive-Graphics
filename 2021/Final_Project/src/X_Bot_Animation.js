import * as TWEEN from '../libs/tween_js/tween.esm.js';

import { Tween_spline } from './Tween_spline.js'
import { Utils } from './Utils.js'


class X_Bot_Animation{
    
    constructor(_x_bot){
        this.x_bot = _x_bot;
        this.utils = new Utils();
        this.array_animation = null;
        this.loop = null;
    }

    _init_fix_component(component, x_bot_part){
        const value = component.animation.values[0];
        if(x_bot_part.hasOwnProperty("_w")){
            x_bot_part.set(value.x, value.y, value.z, value.w);
        }
        else if(x_bot_part.hasOwnProperty("x")){
            x_bot_part.set(value.x, value.y, value.z);
        }
        else{
            console.log("ERROR")
        }
    }

    _init_default_tween(component, x_bot_part){
        if(x_bot_part.hasOwnProperty("_w")){
            component.func = (object) => {
                x_bot_part.set(object.x, object.y, object.z, object.w);
            } 
        }
        else if(x_bot_part.hasOwnProperty("x")){
            component.func = (object) => {
                x_bot_part.set(object.x, object.y, object.z);
            }
        }
        else{
            console.log("ERROR")
        }
        component.enable = true;
        component.tween = new Tween_spline(component.animation['times'], component.animation['values'], 
                                            component.func, 
                                            TWEEN.Easing.Quadratic.None, 
                                            TWEEN.Interpolation.CatmullRom);
        component.tween.init(this.loop);
    }

    _init_default(component, x_bot_part){
        const num_key_frames = component.animation.times.length;

        if(num_key_frames == 1){
            this._init_fix_component(component, x_bot_part);
        }
        else if(num_key_frames == 0){
            // nothing to do
        }
        else{
            this._init_default_tween(component, x_bot_part);
        }
    }

    _init_hips_quaternion(component, x_bot_part){
        const num_key_frames = component.animation.times.length;
        if( !(num_key_frames > 1)){
            return;
        }
        component.func = (object) => {
            x_bot_part.x = object.x;
            //#############
            x_bot_part.y = object.y;
            //############
            x_bot_part.z = object.z;
        }
        component.enable = true;
        component.tween = new Tween_spline(component.animation['times'], component.animation['values'], 
                                            component.func, 
                                            TWEEN.Easing.Quadratic.None, 
                                            TWEEN.Interpolation.CatmullRom);
        component.tween.init(this.loop);
    }

    _init_hips_position(component, x_bot_part){
        const num_key_frames = component.animation.times.length;
        if( !(num_key_frames > 1)){
            return;
        }
        component.func = (object) => {
            x_bot_part.x = object.x;
            x_bot_part.y = object.y;
        }
        //console.log(JSON.stringify(component.animation));
        component.enable = true;
        component.tween = new Tween_spline(component.animation['times'], component.animation['values'], 
                                            component.func, 
                                            TWEEN.Easing.Quadratic.None, 
                                            TWEEN.Interpolation.CatmullRom);
        component.tween.init(this.loop);
    }


    init(array_animation, loop){
        this.loop = loop;
        this.array_animation = array_animation;

        // HIPS -------------------------------------------------------------------------------------------------
        this._init_hips_position(this.array_animation.hips_position, this.x_bot.parts.hips.position);
        // ____________________________________________________________________________________________________
    
        // HIPS -----------------------------------------------
        this._init_hips_quaternion(this.array_animation.hips_quaternion, this.x_bot.parts.hips.quaternion);
        // __________________________________________________________
    
        // SPINE -----------------------------------------------
        this._init_default(this.array_animation.spine_quaternion, this.x_bot.parts.spine.quaternion)
        this._init_default(this.array_animation.spine1_quaternion, this.x_bot.parts.spine_1.quaternion)
        this._init_default(this.array_animation.spine2_quaternion, this.x_bot.parts.spine_2.quaternion)
        // __________________________________________________________

        // NECK ----------------------------------------------------
        this._init_default(this.array_animation.neck_quaternion, this.x_bot.parts.neck.quaternion)
        // _________________________________________________________

        // HEAD -----------------------------------------------------
        this._init_default(this.array_animation.head_quaternion, this.x_bot.parts.head.quaternion)
        // __________________________________________________________

        // LEFT UPPER LIMBS ------------------------------------
        this._init_default(this.array_animation.leftshoulder_quaternion, this.x_bot.parts.left_shoulder.quaternion)
        this._init_default(this.array_animation.leftarm_quaternion, this.x_bot.parts.left_arm.quaternion)
        this._init_default(this.array_animation.leftforearm_quaternion, this.x_bot.parts.left_fore_arm.quaternion)
        // ______________________________________________________


        // LEFT HAND --------------------------------------------
        this._init_default(this.array_animation.lefthand_quaternion, this.x_bot.parts.left_hand.quaternion)

        // thumb
        this._init_default(this.array_animation.lefthandthumb1_quaternion, this.x_bot.parts.left_hand_thumb_1.quaternion)
        this._init_default(this.array_animation.lefthandthumb2_quaternion, this.x_bot.parts.left_hand_thumb_2.quaternion)
        this._init_default(this.array_animation.lefthandthumb3_quaternion, this.x_bot.parts.left_hand_thumb_3.quaternion)

        // index
        this._init_default(this.array_animation.lefthandindex1_quaternion, this.x_bot.parts.left_hand_index_1.quaternion)
        this._init_default(this.array_animation.lefthandindex2_quaternion, this.x_bot.parts.left_hand_index_2.quaternion)
        this._init_default(this.array_animation.lefthandindex3_quaternion, this.x_bot.parts.left_hand_index_3.quaternion)

        //middle
        this._init_default(this.array_animation.lefthandmiddle1_quaternion, this.x_bot.parts.left_hand_middle_1.quaternion)
        this._init_default(this.array_animation.lefthandmiddle2_quaternion, this.x_bot.parts.left_hand_middle_2.quaternion)
        this._init_default(this.array_animation.lefthandmiddle3_quaternion, this.x_bot.parts.left_hand_middle_3.quaternion)

        //ring
        this._init_default(this.array_animation.lefthandring1_quaternion, this.x_bot.parts.left_hand_ring_1.quaternion)
        this._init_default(this.array_animation.lefthandring2_quaternion, this.x_bot.parts.left_hand_ring_2.quaternion)
        this._init_default(this.array_animation.lefthandring3_quaternion, this.x_bot.parts.left_hand_ring_3.quaternion)

        //pinky
        this._init_default(this.array_animation.lefthandpinky1_quaternion, this.x_bot.parts.left_hand_pinky_1.quaternion)
        this._init_default(this.array_animation.lefthandpinky2_quaternion, this.x_bot.parts.left_hand_pinky_2.quaternion)
        this._init_default(this.array_animation.lefthandpinky3_quaternion, this.x_bot.parts.left_hand_pinky_3.quaternion)
        // ______________________________________________________


        // RIGHT UPPER LIMBS ------------------------------------
        this._init_default(this.array_animation.rightshoulder_quaternion, this.x_bot.parts.right_shoulder.quaternion)
        this._init_default(this.array_animation.rightarm_quaternion, this.x_bot.parts.right_arm.quaternion)
        this._init_default(this.array_animation.rightforearm_quaternion, this.x_bot.parts.right_fore_arm.quaternion)
        // ______________________________________________________

        // RIGHT HAND --------------------------------------------
        this._init_default(this.array_animation.righthand_quaternion, this.x_bot.parts.right_hand.quaternion)

        // thumb
        this._init_default(this.array_animation.righthandthumb1_quaternion, this.x_bot.parts.right_hand_thumb_1.quaternion)
        this._init_default(this.array_animation.righthandthumb2_quaternion, this.x_bot.parts.right_hand_thumb_2.quaternion)
        this._init_default(this.array_animation.righthandthumb3_quaternion, this.x_bot.parts.right_hand_thumb_3.quaternion)

        // index
        this._init_default(this.array_animation.righthandindex1_quaternion, this.x_bot.parts.right_hand_index_1.quaternion)
        this._init_default(this.array_animation.righthandindex2_quaternion, this.x_bot.parts.right_hand_index_2.quaternion)
        this._init_default(this.array_animation.righthandindex3_quaternion, this.x_bot.parts.right_hand_index_3.quaternion)

        //middle
        this._init_default(this.array_animation.righthandmiddle1_quaternion, this.x_bot.parts.right_hand_middle_1.quaternion)
        this._init_default(this.array_animation.righthandmiddle2_quaternion, this.x_bot.parts.right_hand_middle_2.quaternion)
        this._init_default(this.array_animation.righthandmiddle3_quaternion, this.x_bot.parts.right_hand_middle_3.quaternion)

        //ring
        this._init_default(this.array_animation.righthandring1_quaternion, this.x_bot.parts.right_hand_ring_1.quaternion)
        this._init_default(this.array_animation.righthandring2_quaternion, this.x_bot.parts.right_hand_ring_2.quaternion)
        this._init_default(this.array_animation.righthandring3_quaternion, this.x_bot.parts.right_hand_ring_3.quaternion)

        //pinky
        this._init_default(this.array_animation.righthandpinky1_quaternion, this.x_bot.parts.right_hand_pinky_1.quaternion)
        this._init_default(this.array_animation.righthandpinky2_quaternion, this.x_bot.parts.right_hand_pinky_2.quaternion)
        this._init_default(this.array_animation.righthandpinky3_quaternion, this.x_bot.parts.right_hand_pinky_3.quaternion)
        // ______________________________________________________
    

        // LEFT DOWN LIMBS ------------------------------------
        this._init_default(this.array_animation.leftupleg_quaternion, this.x_bot.parts.left_up_leg.quaternion)
        this._init_default(this.array_animation.leftleg_quaternion, this.x_bot.parts.left_leg.quaternion)
        // ________________________________________________________

        // LEFT FOOT -----------------------------------------------
        this._init_default(this.array_animation.leftfoot_quaternion, this.x_bot.parts.left_foot.quaternion)
        this._init_default(this.array_animation.lefttoebase_quaternion, this.x_bot.parts.left_toe_base.quaternion)
        // _____________________________________________________

        // RIGHT DOWN LIMBS ------------------------------------
        this._init_default(this.array_animation.rightupleg_quaternion, this.x_bot.parts.right_up_leg.quaternion)
        this._init_default(this.array_animation.rightleg_quaternion, this.x_bot.parts.right_leg.quaternion)
        // ________________________________________________________

        // RIGHT FOOT -----------------------------------------------
        this._init_default(this.array_animation.rightfoot_quaternion, this.x_bot.parts.right_foot.quaternion)
        this._init_default(this.array_animation.righttoebase_quaternion, this.x_bot.parts.right_toe_base.quaternion)
        // _____________________________________________________

    }

    start(){
        for (const [key, value] of Object.entries(this.array_animation)) {
            //console.log(key, value);
            if(value.enable){
                value.tween.start();
            }
        }
    }

    update(){
        for (const [key, value] of Object.entries(this.array_animation)) {
            //console.log(key, value);
            if(value.enable){
                value.tween.update();
            }
        }
    }

    reset(){
        for (const [key, value] of Object.entries(this.array_animation)) {
            //console.log(key, value);
            if(value.enable){
                value.tween.reset();
            }
        }
    }


}
export { X_Bot_Animation };

