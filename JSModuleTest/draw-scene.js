import {mat4} from './glMatrix/index.js';
import {drawEntity, drawTexturedEntity, drawEntityToFramebuffer} from './drawEntity.js';
import {fb, debug_colours} from './events.js';
//import {entity} from './entity.js'
import {shader} from './shader.js';
import {trains} from './webgl-demo.js';

function drawScene(gl, components, viewMatrix) {
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
    for(let i = 0; i<trains.length; i++)
    {
      trains[i].draw(gl, projectionMatrix, viewMatrix, 3);
    }
    for(let i = 0; i<components.length ; i++)
    {
      if(components[i].texture==0)
        ;//components[i].draw(gl, projectionMatrix, viewMatrix);
        //drawEntity(gl, projectionMatrix, viewMatrix, entities[i], batchskip);
      else
        drawTexturedEntity(gl, projectionMatrix, viewMatrix, components[i], batchskip);
        
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    for(let i = 0; i<trains.length; i++)
    {
      trains[i].draw(gl, projectionMatrix, viewMatrix, 2);
    }
    for(let i = 0; i<components.length ; i++)
    {
      drawEntityToFramebuffer(gl, projectionMatrix, viewMatrix, components[i], batchskip);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
  }
  

  

  
  export { drawScene };