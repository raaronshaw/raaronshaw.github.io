import {mat4} from './glMatrix/index.js';
import {drawEntity} from './drawEntity.js';
//import {entity} from './entity.js'

function drawScene(gl, entities, viewMatrix) {
  
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear the canvas before we start drawing on it.

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  

   

    let batchskip = 0;//use in future for rubber stamping same object multiple times to skip VP/VC buffer binds. Reformat drawEntity loop for assets
    for(let i = 0; i<entities.length ; i++)
      drawEntity(gl, projectionMatrix, viewMatrix, entities[i], batchskip);
  }
  

  

  
  export { drawScene };