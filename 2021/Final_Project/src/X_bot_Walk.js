import { Linear_animation } from './Linear_animation.js'
import { X_Bot_Walk_Animation } from './X_bot_Walk_Animation.js'
import { X_bot_Interpolation_Configuartions } from './X_bot_Interpolation_Configuartions.js'
import * as THREE from '../libs/three_js/three.module.js';

import { Utils } from './Utils.js'

        
class X_bot_Walk {

    constructor(x_bot){
        this.x_bot = x_bot;
        this.utils = new Utils();
        this.left_key_pressing = false;
        this.right_key_pressing = false;

        this.move_x_bot_started = {z_pos:false, z_neg:false, x_pos:false, x_neg:false};
        this.move_x_bot_running = {z_pos:false, z_neg:false, x_pos:false, x_neg:false};
        this.move_x_bot_linear = {z_pos: new Linear_animation(), 
                                z_neg: new Linear_animation(), 
                                x_pos: new Linear_animation(), 
                                x_neg: new Linear_animation()};

        this.walking = false;

        this.walk_animation = new X_Bot_Walk_Animation(this.x_bot);
        
        this.going_to_rest = false;
        this.going_to_rest_started = false;
        this.going_to_rest_animation_walk_animation = null;

        this.clock_to_rest = new THREE.Clock();
        this.start_time_to_rest;

        this.walk_animation_started = false;

        this.template_box = {
            left_up: {x:0.0, z:0.0},
            right_bottom: {x:0.0, z:0.0}
        }
        this.boxes = [];

        this.hit_obstacle = false;
    }
  
    init(boxes){
        this.boxes = boxes;

        //console.log(JSON.stringify(this.boxes));
        const speed = 83;
        this.move_x_bot_linear.z_pos.init(speed, this.x_bot.parts.armature.position, 'z');
        this.move_x_bot_linear.z_neg.init(-speed, this.x_bot.parts.armature.position, 'z');
        this.move_x_bot_linear.x_pos.init(speed, this.x_bot.parts.armature.position, 'x');
        this.move_x_bot_linear.x_neg.init(-speed, this.x_bot.parts.armature.position, 'x');

        this.walk_animation.init();
    }


    _is_in_space(x, z){
        for(let i=0; i < this.boxes.length; i++){
            if(this. _is_in_box(this.boxes[i], x, z)){
                return true;
            }
        }
        return false;
    }

    _is_in_box(box, x, z){
        if(x >= box.right_bottom.x && z >= box.right_bottom.z &&
                x <= box.left_up.x && z <= box.left_up.z){
            return true;
        }
        else{
            return false;
        }
    }

    get_box_template(){
        return this.utils.deepCopy(this.template_box);
    }

    _will_go_outside(step, x, z, rotation_y){
        let next_x = x;
        let next_z = z;

        if(rotation_y == 0){
            next_z += step;
        }
        else if(rotation_y == Math.PI/2){
            next_x += step;
        }
        else if(rotation_y == -Math.PI/2){
            next_x -= step;
        }
        else if(rotation_y == Math.PI){
            next_z -= step;
        }

        return !this._is_in_space(next_x, next_z);
    }

    keydown_dispatcher(name){
        let rotation_y = this.x_bot.parts.armature.rotation.y;
        if(name == 'ArrowUp'){
            if(!this.hit_obstacle){
                this._start_linear(rotation_y);
                this.walking = true;
            }
            else{

            }

        }
        else if(name == 'ArrowLeft'){
            if(!this.left_key_pressing){
                

                this.left_key_pressing = true;
                this._reset_linear(rotation_y);
                const tmp = this.x_bot.parts.armature.rotation.y + Math.PI/2;
                if(tmp > Math.PI){
                    this.x_bot.parts.armature.rotation.y = -Math.PI/2;
                }
                else{
                    this.x_bot.parts.armature.rotation.y = tmp;
                }
                
                this.hit_obstacle = false;
                if(this.walking){
                    this._start_linear(this.x_bot.parts.armature.rotation.y);
                }

            }
        }
        else if(name == 'ArrowRight'){
            if(!this.right_key_pressing){
                this.right_key_pressing = true;
                this._reset_linear(rotation_y);
                const tmp = this.x_bot.parts.armature.rotation.y - Math.PI/2;
                if(tmp < -Math.PI/2){
                    this.x_bot.parts.armature.rotation.y = Math.PI;
                }
                else{
                    this.x_bot.parts.armature.rotation.y = tmp;
                }

                this.hit_obstacle = false;
                if(this.walking){
                    this._start_linear(this.x_bot.parts.armature.rotation.y);
                }
            }
        }
    }

    keyup_dispatcher(name){

        //console.log(this.x_bot.model.position)
       //console.log(this._is_in_space(this.x_bot.parts.armature.position.x, this.x_bot.parts.armature.position.z));
        let rotation_y = this.x_bot.parts.armature.rotation.y;
        if(name == 'ArrowUp'){
            if(!this.hit_obstacle){
                this._reset_linear(rotation_y);
                this.walking = false;
                this.walk_animation_started = false;
                this.going_to_rest = true;
                //########
                this.going_to_rest_started = false;
                //#########
                this.walk_animation.reset();
            }
        }
        else if(name == 'ArrowLeft'){
            this.left_key_pressing = false;
        }
        else if(name == 'ArrowRight'){
            this.right_key_pressing = false;
        }
    }

    update(){
        if(this.walking){
            if(!this.walk_animation_started){
                this.walk_animation_started = true;
                this.walk_animation.start();
            }
            let step_will = 10;
            if(this._will_go_outside(step_will, this.x_bot.parts.armature.position.x, this.x_bot.parts.armature.position.z, this.x_bot.parts.armature.rotation.y)){
                this.hit_obstacle = true;
                this.going_to_rest = true;

                this._reset_linear(this.x_bot.parts.armature.rotation.y);
                this.walking = false;
                this.walk_animation_started = false;
                this.going_to_rest = true;
    
                this.walk_animation.reset();
            }
            else{
                this.walk_animation.update();
                this._move_forward(this.x_bot.parts.armature.rotation.y);
                this.going_to_rest = false;
                this.going_to_rest_started = false;
            }

        }
        else if(this.going_to_rest){
            if(!this.going_to_rest_started){
                const current_config = this.x_bot.get_current_configuration();
                const rest_conf = this.x_bot.rest_configuration;
    
                this.going_to_rest_animation_walk_animation = new X_bot_Interpolation_Configuartions(this.x_bot);
                this.going_to_rest_animation_walk_animation.init(current_config, rest_conf, 400);
                this.going_to_rest_animation_walk_animation.start();
                this.going_to_rest_started = true;

                this.clock_to_rest.start();
                this.start_time_to_rest = this.clock_to_rest.getElapsedTime();
            }
            if(this.clock_to_rest.getElapsedTime()- this.start_time_to_rest > 0.4){//2000){
                this.going_to_rest = false;
                this.going_to_rest_started = false;
            }
            this.going_to_rest_animation_walk_animation.update();
        }
        else{
            this.x_bot.set_rest_configuration();
        }
    }



    _move_forward(rotation_y){
        if(rotation_y == 0){
            this.move_x_bot_linear.z_pos.update();
        }
        else if(rotation_y == Math.PI/2){
            this.move_x_bot_linear.x_pos.update();
        }
        else if(rotation_y == -Math.PI/2){
            this.move_x_bot_linear.x_neg.update();
        }
        else if(rotation_y == Math.PI){
            this.move_x_bot_linear.z_neg.update();
        }
    }

    _start_linear(rotation_y){
        if(rotation_y == 0){
            this._start_linear_by_name('z_pos');
        }
        else if(rotation_y == Math.PI/2){
            this._start_linear_by_name('x_pos');
        }
        else if(rotation_y == -Math.PI/2){
            this._start_linear_by_name('x_neg');
        }
        else if(rotation_y == Math.PI){
            this._start_linear_by_name('z_neg');
        }
    }

    _start_linear_by_name(x_z_pos_neg){
        if(!this.move_x_bot_started[x_z_pos_neg]){
            this.move_x_bot_linear[x_z_pos_neg].start();
            this.move_x_bot_started[x_z_pos_neg] = true;
        }
        this.move_x_bot_running[x_z_pos_neg] = true;
    }



    _reset_linear(rotation_y){
        if(rotation_y == 0){
            this._reset_linear_by_name('z_pos');
        }
        else if(rotation_y == Math.PI/2){
            this._reset_linear_by_name('x_pos');
        }
        else if(rotation_y == -Math.PI/2){
            this._reset_linear_by_name('x_neg');
        }
        else if(rotation_y == Math.PI){
            this._reset_linear_by_name('z_neg');
        }
    }

    _reset_linear_by_name(x_z_pos_neg){
        this.move_x_bot_started[x_z_pos_neg] = false;
        this.move_x_bot_running[x_z_pos_neg] = false;
        this.move_x_bot_linear[x_z_pos_neg].reset();
    }
};
export { X_bot_Walk };