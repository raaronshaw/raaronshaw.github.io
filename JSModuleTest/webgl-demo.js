import { initBuffers } from './init-buffers.js';
import { drawScene } from './draw-scene.js';
import { initShaderProgram } from './shader.js';
import { entity } from './entity.js';
import { ASSETS } from './init-buffers.js';
let cubeRotation = 0.0;
let deltaTime = 0;
const entities = [];
// will set to true when video can be copied to texture

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
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Set clear color to black, fully opaque
  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
 // gl.clear(gl.COLOR_BUFFER_BIT);

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl);//, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram,"uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
  };
  console.log(programInfo.uniformLocations.projectionMatrix);

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  const texture = initTexture(gl);
  const video = 0;//setupVideo("Firefox.mp4");

  // Flip image pixels into the bottom-to-top order that WebGL expects.
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

 naiveEntitySetup();

  // Draw the scene repeatedly
  let then = 0;
  function render(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

 //   if (copyVideo) {
 //     updateTexture(gl, texture, video);
 //   }

    drawScene(gl, programInfo, buffers, texture, cubeRotation, entities);
    cubeRotation += deltaTime;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function naiveEntitySetup()
{
    //ASSET, shader, pos
    entities.push(new entity(0, 0, [-1.0,-1.0,-8.0]));

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

function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
}

function setupVideo(url) {
  const video = document.createElement("video");

  let playing = false;
  let timeupdate = false;

  video.playsInline = true;
  video.muted = true;
  video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener(
    "playing",
    () => {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    () => {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      //copyVideo = true;
      copyVideo = false;
    }
  }

  return video;
}