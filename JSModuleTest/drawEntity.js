 import {shader} from './shader.js';
 import {ASSETS} from './init-buffers.js';
 import {mat4} from './glMatrix/index.js';
import {fb, debug_colours} from './events.js';

function drawEntity(gl, projectionMatrix, viewMatrix, entity, batchskip)
{
  let index = 3;//entity.shaderIndex;
  {
    gl.useProgram(shader[index].program);

    if(batchskip==0)
    {
        gl.uniformMatrix4fv(shader[index].uMatrixProjection, false, projectionMatrix);
        gl.uniformMatrix4fv(shader[index].uMatrixView, false, viewMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VP_Buffer);
        gl.vertexAttribPointer(shader[index].aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VC_Buffer);
        gl.vertexAttribPointer(shader[index].aVertexNormals, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aVertexNormals);
        
        gl.uniform3fv(shader[index].uKd, entity.Kd); 
    }

    gl.uniformMatrix4fv(shader[index].uMatrixModel, false, entity.transformationMatrix);//translationMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, ASSETS[entity.assetIndex].numItems);
  }
}


function drawTexturedEntity(gl, projectionMatrix, viewMatrix, entity, batchskip)
{
  //if(debug_colours)
  
  let index = 0;//entity.shaderIndex;
  {
    
    //index = 2;
    gl.useProgram(shader[index].program);


  /*  mat4.rotate(
        entity.translationMatrix, // destination matrix
        entity.translationMatrix, // matrix to rotate
        rate, // amount to rotate in radians
        [0.3, 0.7, 1.0]
      ); // axis to rotate around (Z)
  */
    if(batchskip==0)
    {
        gl.uniformMatrix4fv(shader[index].uMatrixProjection, false, projectionMatrix);
        gl.uniformMatrix4fv(shader[index].uMatrixView, false, viewMatrix);
        


        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VP_Buffer);
        gl.vertexAttribPointer(shader[index].aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VC_Buffer);
        gl.vertexAttribPointer(shader[index].aVertexNormals, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aVertexNormals);
        
        gl.uniform3fv(shader[index].uKd, entity.Kd);//color
        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].TC_Buffer);
        gl.vertexAttribPointer(shader[index].aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aTextureCoord);

        if(entity.texture==0)
          gl.bindTexture(gl.TEXTURE_2D, null);
        else
          gl.bindTexture(gl.TEXTURE_2D, entity.texture);
        
        
    }


    gl.uniformMatrix4fv(shader[index].uMatrixModel, false, entity.transformationMatrix);//translationMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, ASSETS[entity.assetIndex].numItems);
    

  }




}

export function drawEntityToFramebuffer(gl, projectionMatrix, viewMatrix, entity, batchskip)
{
  //if(debug_colours)
  
  let index = 2;
  //gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    //let index = entity.shaderIndex;
    index = 2;
    gl.useProgram(shader[index].program);


  /*  mat4.rotate(
        entity.translationMatrix, // destination matrix
        entity.translationMatrix, // matrix to rotate
        rate, // amount to rotate in radians
        [0.3, 0.7, 1.0]
      ); // axis to rotate around (Z)
  */
    if(batchskip==0)
    {
        gl.uniformMatrix4fv(shader[index].uMatrixProjection, false, projectionMatrix);
        gl.uniformMatrix4fv(shader[index].uMatrixView, false, viewMatrix);
        


        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VP_Buffer);
        gl.vertexAttribPointer(shader[index].aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VC_Buffer);
        gl.vertexAttribPointer(shader[index].aVertexNormals, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader[index].aVertexNormals);
        
        gl.uniform3fv(shader[index].uKd, [entity.uid/255,0.0,0.0]);//color
        //gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].TC_Buffer);
        //gl.vertexAttribPointer(shader[index].aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        //gl.enableVertexAttribArray(shader[index].aTextureCoord);

        if(entity.texture==0)
          gl.bindTexture(gl.TEXTURE_2D, null);
        else
          gl.bindTexture(gl.TEXTURE_2D, entity.texture);
        
        
    }


    gl.uniformMatrix4fv(shader[index].uMatrixModel, false, entity.transformationMatrix);//translationMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, ASSETS[entity.assetIndex].numItems);
    

  
 //gl.bindFramebuffer(gl.FRAMEBUFFER, null);


}

export {drawEntity, drawTexturedEntity};