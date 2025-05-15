import {my_glsl_fs_str, my_glsl_vs_str, my_glsl_vsSource, my_glsl_fsSource, my_GUI_glsl_fs_str, my_GUI_glsl_vs_str } from "./glslSrc.js";
import {my_Mouse_Pick_glsl_fs_str, my_Mouse_Pick_glsl_vs_str } from "./glslSrc.js";
import {my_temp_glsl_fs_str, my_temp_glsl_vs_str } from "./glslSrc.js";
export const shaderAttributesTest = {
  aVertexPosition : 0,
  aVertexNormals : 0,
  uKd : 0,
  uMatrixView : 0,
  uMatrixProjection : 0,
  uMatrixModel : 0
};


export const shader = [];



class shaderClass {
  constructor(gl, program)
  {
    this.program = program;
    this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(this.aVertexPosition);
    this.aVertexNormals = gl.getAttribLocation(program, "aVertexNormals");
    gl.enableVertexAttribArray(this.aVertexNormals);
    this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
    //gl.enableVertexAttribArray(this.aTextureCoord);
    this.uKd = gl.getUniformLocation(program, "uKd");
    this.uMatrixView = gl.getUniformLocation(program, "Matrix_View");
    this.uMatrixProjection = gl.getUniformLocation(program, "Matrix_Projection");
    this.uMatrixModel =  gl.getUniformLocation(program, "Matrix_Model");

    this.uSampler = gl.getUniformLocation(program, "uSampler");
  }
};

    


//const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

function initShaderProgram(gl){//}, vsSource, fsSource) {
    let shaderProgramme = initProgram(gl, my_glsl_vsSource, my_glsl_fsSource);
    
    //0
    shader.push(new shaderClass(gl, initProgram(gl, my_glsl_vs_str, my_glsl_fs_str)));

    //1
    shader.push(new shaderClass(gl, initProgram(gl, my_GUI_glsl_vs_str, my_GUI_glsl_fs_str)));

    //2
    //shader.push(new shaderClass(gl, initProgram(gl, my_glsl_vs_str, my_glsl_fs_str)));
    shader.push(new shaderClass(gl, initProgram(gl, my_Mouse_Pick_glsl_vs_str, my_Mouse_Pick_glsl_fs_str)));

    //3
    shader.push(new shaderClass(gl, initProgram(gl, my_temp_glsl_vs_str, my_temp_glsl_fs_str)));

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
  

    
export function initProgram(gl, vertexShaderSrc, fragmentShaderSrc)
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