
/*
    LIbrary based on Robotics 1 lectures
    REFERENCE: http://www.diag.uniroma1.it/~deluca/rob1_en/13_TrajectoryPlanningJoints.pdf
*/

class Splines{
    constructor(_array_position, _array_time_step, _v_start, _v_end) {
        this.array_position = _array_position;
        this.array_time_step = _array_time_step;
        this.v_start = _v_start;
        this.v_end = _v_end;
        this.splines_coeff = []; //matrix of coeffs
    }

    init(){
        if(this.array_position.length != this.array_time_step.length){
            console.log("spline_resolver: wrong lengths !!");
            return null;
        }
        
        var num_knots = this.array_position.length;
        
        var q = this.array_position;
        var t = this.array_time_step;
    
        var h = [];
        for(var i=1; i<num_knots; i++){
            h.push(t[i]-t[i-1]); //duration of the interval
        }
    
        var A = Matrix_zeros(num_knots-2, num_knots-2);
        for(var i=0; i<A.length; i++){
            A[i][i] = 2*(h[i] + h[i+1]);
    
            if(i>0) A[i-1][i] = h[i-1];
            if(i+1 < A.length) A[i+1][i] = h[i+2]; 
        }
    
        var b = Matrix_zeros(num_knots-2, 1);
        
        for(var i=0; i<b.length; i++){
            b[i][0] = 3*(q[i+2] - q[i+1]) * h[i]/h[i+1] + 3*(q[i+1] - q[i]) * h[i+1]/h[i];
        }
        b[0][0] -= h[2]*this.v_start;
        b[b.length-1][0] -= h[num_knots-2]*this.v_end;
    
     
        //from the linear system Ax=b we can obtain the internal velocities
        var A_inv = Matrix_inverse(A);
        var v_interm = Matrix_multiply(A_inv, b); //v_1 ... v_N-2
        var v = [this.v_start];
        for(var i=0; i<v_interm.length; i++)
            v.push(v_interm[i][0]);
        v.push(this.v_end);
    
        var num_cubic_funcs = num_knots-1;
        var num_coeff_cubic_func = 4;
        //in each row there is the coefficients of a cubic poly [a0, a1, a2, a3]
        this.splines_coeff = Matrix_zeros(num_cubic_funcs, num_coeff_cubic_func); 
        
        for(var i=0; i<num_cubic_funcs; i++){
            var a0 = q[i];
            var a1 = v[i];
            var AA = Matrix_from_list([
                [Math.pow(h[i],2), Math.pow(h[i], 3)],
                [2*h[i], 3*Math.pow(h[i],2)]
            ])
            var bb = Matrix_from_list([
                [q[i+1] - q[i] - v[i]*h[i]],
                [v[i+1]-v[i]]
            ])
    
            //from AAx=BB we obtain a2 ans a3
            var a2_a3 = Matrix_multiply(Matrix_inverse(AA), bb);
            var a2 = a2_a3[0][0];
            var a3 = a2_a3[1][0];
    
            this.splines_coeff[i][0] = a0;
            this.splines_coeff[i][1] = a1;
            this.splines_coeff[i][2] = a2;
            this.splines_coeff[i][3] = a3;
        }
        //this.splines_coeff = splines_coeff;
    }

    get_splines_coeff(){
        return this.splines_coeff;
    }

    step(time){
        var t_k = this.get_t_k(time);
        if(t_k==null) return null; //end of trajectory
        //console.log(t_k);
        var tau = time - this.array_time_step[t_k];
        var a0 = this.splines_coeff[t_k][0];
        var a1 = this.splines_coeff[t_k][1];
        var a2 = this.splines_coeff[t_k][2];
        var a3 = this.splines_coeff[t_k][3];

        return cubic_poly_func(a0, a1, a2, a3, tau);
    }

    get_t_k(time){
        for(var i=0; i<this.array_time_step.length-1; i++){
            if(time >= this.array_time_step[i] && time < this.array_time_step[i+1])
                return i;

            if(time == this.array_time_step[i+1])
                return i;
        }
        return null;
    }
}

function cubic_poly_func(a0, a1, a2, a3, tau){
    return a3*(Math.pow(tau, 3)) + a2*(Math.pow(tau, 2)) + a1*tau + a0;
}

// var array_position = [45, 90, -45, 45];
// var array_time_step = [1, 2, 2.5, 4];
// var v_start = 0;
// var v_end = 0;

function spline_resolver(array_position, array_time_step, v_start, v_end){
    if(array_position.length != array_time_step.length){
        console.log("spline_resolver: wrong lengths !!");
        return null;
    }
    
    var num_knots = array_position.length;
    
    var q = array_position;
    var t = array_time_step;

    var h = [];
    for(var i=1; i<num_knots; i++){
        h.push(t[i]-t[i-1]); //duration of the interval
    }

    var A = Matrix_zeros(num_knots-2, num_knots-2);
    for(var i=0; i<A.length; i++){
        A[i][i] = 2*(h[i] + h[i+1]);

        if(i>0) A[i-1][i] = h[i-1];
        if(i+1 < A.length) A[i+1][i] = h[i+2]; 
    }

    var b = Matrix_zeros(num_knots-2, 1);
    
    for(var i=0; i<b.length; i++){
        b[i][0] = 3*(q[i+2] - q[i+1]) * h[i]/h[i+1] + 3*(q[i+1] - q[i]) * h[i+1]/h[i];
    }
    b[0][0] -= h[2]*v_start;
    b[b.length-1][0] -= h[num_knots-2]*v_end;

 
    //from the linear system Ax=b we can obtain the internal velocities
    var A_inv = Matrix_inverse(A);
    var v_interm = Matrix_multiply(A_inv, b); //v_1 ... v_N-2
    var v = [v_start];
    for(var i=0; i<v_interm.length; i++)
        v.push(v_interm[i][0]);
    v.push(v_end);

    var num_cubic_funcs = num_knots-1;
    var num_coeff_cubic_func = 4;
    //in each row there is the coefficients of a cubic poly [a0, a1, a2, a3]
    var splines_coeff = Matrix_zeros(num_cubic_funcs, num_coeff_cubic_func); 
    
    for(var i=0; i<num_cubic_funcs; i++){
        var a0 = q[i];
        var a1 = v[i];
        var AA = Matrix_from_list([
            [Math.pow(h[i],2), Math.pow(h[i], 3)],
            [2*h[i], 3*Math.pow(h[i],2)]
        ])
        var bb = Matrix_from_list([
            [q[i+1] - q[i] - v[i]*h[i]],
            [v[i+1]-v[i]]
        ])

        //from AAx=BB we obtain a2 ans a3
        var a2_a3 = Matrix_multiply(Matrix_inverse(AA), bb);
        var a2 = a2_a3[0][0];
        var a3 = a2_a3[1][0];

        splines_coeff[i][0] = a0;
        splines_coeff[i][1] = a1;
        splines_coeff[i][2] = a2;
        splines_coeff[i][3] = a3;
    }
    return splines_coeff;
}
