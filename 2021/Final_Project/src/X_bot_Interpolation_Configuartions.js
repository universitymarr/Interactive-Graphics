import { Utils } from './Utils.js'
import { X_Bot_Animation } from './X_Bot_Animation.js'

class X_bot_Interpolation_Configuartions{
    
    constructor(_x_bot){
        this.x_bot_animation_obj = new X_Bot_Animation(_x_bot);
        this.utils = new Utils();
    }


    init(start_config, end_config, time_interval){
        let array_animation = this._x_bot_configurations_to_animation(start_config, end_config, time_interval);
        const loop = false;
        this.x_bot_animation_obj.init(array_animation, loop);
    }

    init_v2(array_config, array_time, loop){
        if(!this._check_times(array_time)){
            console.log("ERROR array times must be ascending order!!!")
            return 
        }
        let array_animation = this._x_bot_configurations_to_animation_v3(array_config, array_time);
        //const loop = false;
        this.x_bot_animation_obj.init(array_animation, loop);
    }

    start(){
        this.x_bot_animation_obj.start();
    }

    update(){
        this.x_bot_animation_obj.update();
    }

    reset(){
        this.x_bot_animation_obj.reset();
    }

    _check_times(array_time){
        for(let i=0; i<array_time.length-1; i++){
            if(array_time[i]>array_time[i+1]){
                return false;
            }
        }
        return true;
    }
    __poses_to_animation(start, end, time_interval, animation){
        if(!this.utils.deepEqual(start, end)){
            animation.times.push(0);
            animation.values.push(start);

            animation.times.push(time_interval);
            animation.values.push(end);
        }
    }


    ___are_all_equal(array_poses_part){
        for(let i=0; i<array_poses_part.length-1; i++){
            if(!this.utils.deepEqual(array_poses_part[i], array_poses_part[i+1])){
                return false;
            }
        }
        return true;
    }

    __poses_to_animation_v3(array_poses_part, array_time, animation){
        if(!this.___are_all_equal(array_poses_part)){
            animation.times = array_time;
            animation.values = array_poses_part;
        }
        else{
            animation.times.push(array_time[0]);
            animation.values.push(array_poses_part[0]);
        }
    }

    __array_config_to_array_part(array_config, parts_key){
        let array_part = [];
        for(let i=0; i<array_config.length; i++){
            array_part.push(array_config[i][parts_key])
        }
        return array_part;
    }

    _x_bot_configurations_to_animation_v3(array_config, array_time){
        if(array_time.length != array_time.length){
            console.log("ERROR: not same length");
            return;
        }
        let my_array_animation = {
            // HIPS --------------------------------------------
            hips_position: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            hips_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            //_________________________________________________________

            // SPINES ----------------------------------------------------
            spine_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },

            spine1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            spine2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // __________________________________________________________

            // NECK -----------------------------------------------------
            neck_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _________________________________________________________

            // HEAD ---------------------------------------------------
            head_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _______________________________________________________

            // LEFT UPPER LIMBS ------------------------------------
            leftshoulder_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            leftarm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            leftforearm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ______________________________________________________

            // LEFT HAND --------------------------------------------
            lefthand_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },

            // thumb
            lefthandthumb1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandthumb2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandthumb3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            // index
            lefthandindex1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandindex2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandindex3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //middle
            lefthandmiddle1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandmiddle2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandmiddle3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //ring
            lefthandring1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandring2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandring3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //pinky
            lefthandpinky1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandpinky2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandpinky3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ______________________________________________________

            // RIGHT UPPER LIMBS ------------------------------------
            rightshoulder_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            rightarm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //fore arm
            rightforearm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _____________________________________________________

            // RIGHT HAND --------------------------------------------
            righthand_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //pinky
            righthandpinky1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandpinky2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandpinky3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //ring
            righthandring1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandring2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandring3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            // middle
            righthandmiddle1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandmiddle2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandmiddle3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //index
            righthandindex1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandindex2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandindex3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            // thumb
            righthandthumb1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandthumb2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandthumb3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _____________________________________________________

            // LEFT DOWN LIMBS ------------------------------------
            leftupleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            leftleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ________________________________________________________

            // LEFT FOOT -----------------------------------------------
            leftfoot_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            lefttoebase_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            //__________________________________________________________

            // RIGHT DOWN LIMBS ------------------------------------
            rightupleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            rightleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _________________________________________________________

            // RIGHT FOOT -------------------------------------------------
            rightfoot_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            righttoebase_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ___________________________________________________________
        }

        for (const [key, value] of Object.entries(my_array_animation)) {
            let array_poses_part = this.__array_config_to_array_part(array_config, key);
            this.__poses_to_animation_v3(array_poses_part, array_time, my_array_animation[key].animation);
        }

        return my_array_animation;
    }



    _x_bot_configurations_to_animation(start, end, time_interval){
        let my_array_animation = {
            // HIPS --------------------------------------------
            hips_position: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            hips_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            //_________________________________________________________

            // SPINES ----------------------------------------------------
            spine_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },

            spine1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            spine2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // __________________________________________________________

            // NECK -----------------------------------------------------
            neck_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _________________________________________________________

            // HEAD ---------------------------------------------------
            head_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _______________________________________________________

            // LEFT UPPER LIMBS ------------------------------------
            leftshoulder_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            leftarm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            leftforearm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ______________________________________________________

            // LEFT HAND --------------------------------------------
            lefthand_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },

            // thumb
            lefthandthumb1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandthumb2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandthumb3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            // index
            lefthandindex1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandindex2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandindex3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //middle
            lefthandmiddle1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandmiddle2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandmiddle3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //ring
            lefthandring1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandring2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandring3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //pinky
            lefthandpinky1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandpinky2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            lefthandpinky3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ______________________________________________________

            // RIGHT UPPER LIMBS ------------------------------------
            rightshoulder_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            rightarm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //fore arm
            rightforearm_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _____________________________________________________

            // RIGHT HAND --------------------------------------------
            righthand_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //pinky
            righthandpinky1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandpinky2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandpinky3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //ring
            righthandring1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandring2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandring3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            // middle
            righthandmiddle1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandmiddle2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandmiddle3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            //index
            righthandindex1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandindex2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandindex3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            // thumb
            righthandthumb1_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandthumb2_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            righthandthumb3_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _____________________________________________________

            // LEFT DOWN LIMBS ------------------------------------
            leftupleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            leftleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ________________________________________________________

            // LEFT FOOT -----------------------------------------------
            leftfoot_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            lefttoebase_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            //__________________________________________________________

            // RIGHT DOWN LIMBS ------------------------------------
            rightupleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            rightleg_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // _________________________________________________________

            // RIGHT FOOT -------------------------------------------------
            rightfoot_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            
            righttoebase_quaternion: {
                enable: false,
                func: null,
                tween: null,
                animation: {
                    times: [], 
                    values: []
                }
            },
            // ___________________________________________________________
        }


        for (const [key, value] of Object.entries(my_array_animation)) {
            this.__poses_to_animation(start[key], end[key], time_interval, my_array_animation[key].animation);
        }

        return my_array_animation;
    }
}
export { X_bot_Interpolation_Configuartions };
