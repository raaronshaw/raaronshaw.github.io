import {my_glsl_fs_str, my_glsl_vs_str, my_glsl_vsSource, my_glsl_fsSource } from "./glslSrc.js";
export const shaderAttributesTest = {
  aVertexPosition : 0,
  aVertexNormals : 0,
  uKd : 0,
  uMatrixView : 0,
  uMatrixProjection : 0,
  uMatrixModel : 0
};

export var shaderCustom = 0;
export const shader = [];



class shaderClass {
  constructor(gl, program)
  {
    this.program = program;
    this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(this.aVertexPosition);
    this.aVertexNormals = gl.getAttribLocation(program, "aVertexNormals");
    gl.enableVertexAttribArray(this.aVertexNormals);
    this.uKd = gl.getUniformLocation(program, "Kd");
    this.uMatrixView = gl.getUniformLocation(program, "Matrix_View");
    this.uMatrixProjection = gl.getUniformLocation(program, "Matrix_Projection");
    this.uMatrixModel =  gl.getUniformLocation(program, "Matrix_Model");  
  }
};





//const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

function initShaderProgram(gl){//}, vsSource, fsSource) {
    let shaderProgramme = initProgram(gl, my_glsl_vsSource, my_glsl_fsSource);
    shader.push(new shaderClass(gl, initProgram(gl, my_glsl_vs_str, my_glsl_fs_str)));
    //shader.push(initProgram());
    //shader.push(new shaderClass(gl, initProgram(gl,)));
    return shaderProgramme;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;}
  

    
function initProgram(gl, vertexShaderSrc, fragmentShaderSrc)
{
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
  let shaderProgramme = gl.createProgram();
  gl.attachShader(shaderProgramme, vertexShader);
  gl.attachShader(shaderProgramme, fragmentShader);
  gl.linkProgram(shaderProgramme);
  if (!gl.getProgramParameter(shaderProgramme, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgramme
      )}`
    );
    return null;
  }
  return shaderProgramme;}


export {initShaderProgram};