import * as TWEEN from '../libs/tween_js/tween.esm.js';

class Tween_spline{
    constructor(times, values, handler_func, easing_func, interpolation_func){
        this.variable = null;
        this.tween_list = null;

        this.times_list = times;
        this.values_list = values;

        this.update_handler_function = handler_func;
        this.easing_function = easing_func;
        this.interpolation_function = interpolation_func;

        this.tween_group = null;
    }

    init(bool_loop){
        if(this.times_list.length != this.values_list.length){
            console.log("ERROR: time and value arrays must have the same length!")

            console.log(this.times_list.length, " != ", this.values_list)
            return -1;
        }

        this.variable = this.values_list[0]; //first value

        this.tween_group = new TWEEN.Group();

        const num_knots = this.times_list.length;
        this.tween_list = new Array(num_knots - 1);
        //skip first element
        for(let i=1; i<this.times_list.length; i++){
            const duration = this.times_list[i]-this.times_list[i-1];
            this.tween_list[i-1] = new TWEEN.Tween(this.variable, this.tween_group)
                .to(this.values_list[i], duration)
                .easing(this.easing_function)
                .interpolation(this.interpolation_function)
                .onUpdate(this.update_handler_function)   
        }

        for(let i=0; i<this.tween_list.length-1; i++){
            this.tween_list[i].chain(this.tween_list[i+1]);
        }

        if(bool_loop){
            const len = this.tween_list.length; 
            this.tween_list[len-1].chain(this.tween_list[0]);
        }
    }


    update(){
        this.tween_group.update();
    }


    start(){
        this.tween_list[0].start();
    }
 
    // based on https://github.com/tweenjs/tween.js/issues/302
    reset(){
        // Resets the tween (and the graphic)
        // TODO, tween.reset() API, https://github.com/tweenjs/tween.js/issues/302
        this.tween_list[0].stop() // stop is required before the next call will work
        this.tween_list[0].start(0) // restore initial values
        this.tween_list[0].update(0) // apply initial values to the graphic
        this.tween_list[0].stop() // finally, stop the tween, again
    }
}
export { Tween_spline };
