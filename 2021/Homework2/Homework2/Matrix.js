/*
    Useful matrix operations used during the computation of splines
*/
function Matrix(rows, cols) {
  var out = new Array(rows);
  for(var i = 0; i< rows; i++) 
      out[i] = new Array(cols);
  out.type = "Matrix";
  return out;
}



function Matrix_zeros(rows, cols){
    var mat = Matrix(rows, cols);
    for(var i=0; i<rows; i++)
        for(var j=0; j<cols; j++)
            mat[i][j] = 0;
    return mat;
}

function Matrix_identity(n){
    var mat = Matrix(n, n);
    for(var i=0; i<n; i++){
        for(var j=0; j<n; j++){
            if(i==j) mat[i][j] = 1;
            else mat[i][j] = 0;
        }
    }
    return mat;
}

function Matrix_column_vector(list_element){
  var res = Matrix_zeros(list_element.length, 1);
  for(var i=0; i<list_element.length; i++){
      res[i][0] = list_element[i];
  }
  return res;
}


function Matrix_copy(mat){
    var rows = mat.length;
    var cols = mat[0].length;

    var dst = Matrix(rows, cols);
    for(var i=0; i< rows; i++){
        for(var j=0; j<cols; j++){
            dst[i][j] = mat[i][j];
        }
    }
    return dst;
}



function Matrix_multiply(a, b){
    var a_rows = a.length;
    var a_cols = a[0].length;

    var b_rows = b.length; 
    var b_cols = b[0].length;
    
    if(a_cols != b_rows){
        console.log("Matrix_multiply: Size error");
        return null;
    }

    var m = Matrix_zeros(a_rows, b_cols);
  
    for (var r = 0; r < a_rows; ++r) {
        for (var c = 0; c < b_cols; ++c) {       
            for (var i = 0; i < a_cols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}

function Matrix_from_list(list_element){
    var rows = list_element.length;
    var cols =list_element[0].length;

    var res = Matrix(rows, cols);
    for(var i=0; i<rows; i++){
        for(var j=0; j<cols; j++){
            res[i][j] = list_element[i][j];
        }
    }
    return res;
}



function Matrix_inverse(mat) {
    var _A = Matrix_copy(mat);

    //source: https://gist.github.com/husa/5652439
    var temp,
    N = _A.length,
    E = [];
   
    for (var i = 0; i < N; i++)
      E[i] = [];
   
    for (i = 0; i < N; i++)
      for (var j = 0; j < N; j++) {
        E[i][j] = 0;
        if (i == j)
          E[i][j] = 1;
      }
   
    for (var k = 0; k < N; k++) {
      temp = _A[k][k];
   
      for (var j = 0; j < N; j++)
      {
        _A[k][j] /= temp;
        E[k][j] /= temp;
      }
   
      for (var i = k + 1; i < N; i++)
      {
        temp = _A[i][k];
   
        for (var j = 0; j < N; j++)
        {
          _A[i][j] -= _A[k][j] * temp;
          E[i][j] -= E[k][j] * temp;
        }
      }
    }
   
    for (var k = N - 1; k > 0; k--)
    {
      for (var i = k - 1; i >= 0; i--)
      {
        temp = _A[i][k];
   
        for (var j = 0; j < N; j++)
        {
          _A[i][j] -= _A[k][j] * temp;
          E[i][j] -= E[k][j] * temp;
        }
      }
    }
   
    for (var i = 0; i < N; i++)
      for (var j = 0; j < N; j++)
        _A[i][j] = E[i][j];
    return _A;
}