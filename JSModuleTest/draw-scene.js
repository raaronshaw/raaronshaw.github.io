import {mat4} from './glMatrix/index.js';
import {drawEntity, drawTexturedEntity, drawEntityToFramebuffer} from './drawEntity.js';
import {fb, debug_colours} from './events.js';
//import {entity} from './entity.js'

function drawScene(gl, entities, viewMatrix) {
  //gl.bindBuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear the canvas before we start drawing on it.
    gl.enable(gl.DEPTH_TEST); 
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear the canvas before we start drawing on it.
    gl.enable(gl.DEPTH_TEST); 
    
    
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  

   
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    let batchskip = 0;//use in future for rubber stamping same object multiple times to skip VP/VC buffer binds. Reformat drawEntity loop for assets
    for(let i = 0; i<entities.length ; i++)
    {
      if(entities[i].texture==0)
        drawEntity(gl, projectionMatrix, viewMatrix, entities[i], batchskip);
      else
        drawTexturedEntity(gl, projectionMatrix, viewMatrix, entities[i], batchskip);
        
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    for(let i = 0; i<entities.length ; i++)
    {
      drawEntityToFramebuffer(gl, projectionMatrix, viewMatrix, entities[i], batchskip);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
  }
  

  

  
  export { drawScene };