import { initBuffers } from './init-buffers.js';
import { drawScene } from './draw-scene.js';
import { initShaderProgram } from './shader.js';
import { component, components } from './entity.js';
import { ASSETS } from './init-buffers.js';
import { mat4} from './glMatrix/index.js';
import { startCanvasEvents, fb, camera_position, camera_orientation, downForward, downBack} from './events.js';
import { naiveGUISetup } from './GUIPanels.js';
import {shader } from './shader.js';
import { vec3} from './glMatrix/index.js';
import {train} from './train.js';
let cubeRotation = 0.0;
export let deltaTime = 0;
export let defaultColor = vec3.fromValues(0.4, 0.4, 0.4);
export let viewMatrix = mat4.create();
export let trains = [];
export let camera_velocity_test = 0;
export let camera_acceleration = 0;
export let camera_velocity_vector = vec3.create();


main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#Layout");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  //BEGIN: REVISE (Need to clean models to enable)
  gl.disable(gl.CULL_FACE);
  //END  : REVISE
  gl.cullFace(gl.BACK);
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  const shaderProgram = initShaderProgram(gl);

  const buffers = initBuffers(gl);
  
  naiveEntitySetup(gl);
  naiveGUISetup(gl);
  
  let fbb = startCanvasEvents(components, gl);

  // Draw the scene repeatedly
  let then = 0;
  function render(now) 
  {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;


    //current fail inprog work cameraMovement(deltaTime, viewMatrix);
    drawScene(gl, components, viewMatrix);
    //colorPicker(gl, shader[2], fbb);

    RotateFirstCube(components, deltaTime);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

export function accelerate(vector)
{
  camera_acceleration=vector[0];
  //camera_acceleration=vector[1];
  //camera_acceleration=vector[0];

}

function cameraMovement(deltaTime, viewMatrix)
{

  let cam_moved = 0;
  let movement_direction = vec3.create();  
  if(downForward == true)
  { 
    //camera_velocity_test = camera_velocity_test + (camera_acceleration*deltaTime);
    camera_velocity_vector[0] = camera_velocity_vector[0] + (camera_acceleration*deltaTime);
  }
  //if(downBack == true)
 // {
//    camera_velocity_test = camera_velocity_test + (camera_acceleration*deltaTime);
//  }
  if(downForward == false)
  {
    //camera_velocity_test = camera_velocity_test-(camera_velocity_test*deltaTime*10)/2;
    camera_velocity_vector[0] = camera_velocity_vector[0] - (camera_acceleration*deltaTime*10)/2;
  }
//  if(downBack == false) 
 // {
 //   camera_velocity_test = camera_velocity_test-(camera_velocity_test*deltaTime*10)/2;
 // }
  
  vec3.normalize(movement_direction, [viewMatrix[2], viewMatrix[6], viewMatrix[10]]);
  //vec3.scale(movement_direction,movement_direction,camera_velocity_test);
  movement_direction = vec3.fromValues(
    movement_direction[0]*camera_velocity_vector[0],
    movement_direction[1]*camera_velocity_vector[0],
    movement_direction[2]*camera_velocity_vector[0]);//camera_velocity_vector[2];
  
  cam_moved = true;

  if (camera_velocity_vector[0] > 0.1) 
  { 
    vec3.subtract(camera_position, camera_position, movement_direction);
    console.log(camera_velocity_vector[0]);
    let T = mat4.create();
    let R = mat4.create();
    mat4.translate(T, mat4.create(), [-camera_position[0], -camera_position[1], -camera_position[2]]);
    mat4.fromQuat(R, camera_orientation);
    mat4.multiply(viewMatrix, R, T);
  }  
}

function colorPicker(gl, shaderProgramme, fbb)
{
  
}


function RotateFirstCube(components, deltaTime)
{
  let speed = 1.0;
  let R = components[0].rotationMatrix;
  mat4.rotate(R, R, deltaTime*speed, [0, 0, 1]); 
  mat4.rotate(R, R, deltaTime*speed * 0.7, [0, 1, 0]); 
  mat4.rotate(R, R, deltaTime*speed * 0.3, [1, 0, 0]); 
  components[0].setRotationMatrix(R);

  
  //setRotationMatrix();

}


function naiveEntitySetup(gl)
{
    
    //ASSET, shader, pos, color, texture
    trains.push(new train(-13,0,-40));
    trains.push(new train(-13,-50,-100));
    let texture = loadTexture(gl, [0.5,  0.5,  0.5], "./test_image.png");
    components.push(new component(0, 0, [-10.0, -10.0, -50.0], texture, defaultColor));
  // texture = loadTexture(gl, [1.0,  0.5,  1.0], 0);
   // components.push(new component(0, 0, [10.0, -10.0, -50.0], texture, defaultColor));
    //components.push(new component(0, 0, [-10.0,  -5.0, -50.0], 0, defaultColor));
    //entities.push(new entity(0, 0, [-10.0,   0.0, -50.0], texture));
    // texture = loadTexture(gl, [1.0,  0.5,  1.0], 0);
   // components.push(new component(0, 0, [-10.0,   5.0, -50.0], 0, defaultColor));
   //components.push(new component(0, 0, [-10.0,  10.0, -50.0], 0, defaultColor));

   // components.push(new component(0, 0, [ -5.0, -10.0, -50.0], 0, defaultColor));
   // components.push(new component(0, 0, [ -5.0,  -5.0, -50.0], 0, defaultColor));
   // components.push(new component(0, 0, [ -5.0,   0.0, -50.0], 0, defaultColor));
   // components.push(new component(0, 0, [ -5.0,   5.0, -50.0], 0, defaultColor));
   // components.push(new component(0, 0, [ -5.0,  10.0, -50.0], 0, defaultColor));
/*
    entities.push(new entity(0, 0, [  0.0, -10.0, -50.0], texture));
    entities.push(new entity(0, 0, [  0.0,  -5.0, -50.0], texture));
    entities.push(new entity(0, 0, [  0.0,   0.0, -50.0], texture));
    entities.push(new entity(0, 0, [  0.0,   5.0, -50.0], texture));
    //entities.push(new entity(0, 0, [  0.0,  10.0, -50.0], texture));

    entities.push(new entity(0, 0, [  5.0, -10.0, -50.0], texture));
    entities.push(new entity(0, 0, [  5.0,  -5.0, -50.0], texture));
    entities.push(new entity(0, 0, [  5.0,   0.0, -50.0], texture));
    entities.push(new entity(0, 0, [  5.0,   5.0, -50.0], texture));
    entities.push(new entity(0, 0, [  5.0,  10.0, -50.0], texture));

    entities.push(new entity(0, 0, [ 10.0, -10.0, -50.0], texture));
    entities.push(new entity(0, 0, [ 10.0,  -5.0, -50.0], texture));
    entities.push(new entity(0, 0, [ 10.0,   0.0, -50.0], texture));
    entities.push(new entity(0, 0, [ 10.0,   5.0, -50.0], texture));
    entities.push(new entity(0, 0, [ 10.0,  10.0, -50.0], texture));*/
    
    //texture = loadTexture(gl, [1.0,  0.5,  1.0], "./test_image.png");
    //entities.push(new entity(1, 1, [0.0,  0.0, -10.0], texture));

}

export function loadTexture(gl, defaultcolor, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array(
    [defaultcolor[0]*255, defaultcolor[1]*255, defaultcolor[2]*255, 255]
  ));

  if(url!=0)
  {
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    image.src = url;
  }

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}


function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}



