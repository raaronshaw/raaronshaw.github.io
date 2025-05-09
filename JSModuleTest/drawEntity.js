 //drawEntity(gl, projectionMatrix, viewMatrix, entities[0]);
 import {shaderCustom, shaderAttributesTest} from './shader.js';
 import {ASSETS} from './init-buffers.js';
 import {mat4} from './glMatrix/index.js';
const TRIANGLE = 3;
//const testVP = [-0.1, ]
function drawEntity(gl, projectionMatrix, viewMatrix, entity)
{
  //  console.log("shader.js");
  //  console.log(shaderProgramme);
   // console.log(gl.TRIANGLE);
   // console.log(shaderAttributesTest);
    //let shader = shaderCustom;
   // console.log(ASSETS[entitiy.assetIndex].VP_Buffer);
   // setTimeout(function() {
        // Code to be executed after the delay
   //     console.log("This message appears after 2 seconds");
   //   }, 10000);
    //console.log(shaderCustom);
    //console.log("\n");
    gl.useProgram(shaderCustom);

   

    let rate = 0.01;
    mat4.rotate(
        entity.translationMatrix, // destination matrix
        entity.translationMatrix, // matrix to rotate
        rate, // amount to rotate in radians
        [0.3, 0.7, 1.0]
      ); // axis to rotate around (Z)
     





      
//console.log(shaderAttributesTest.uMatrixProjection);
    gl.uniformMatrix4fv(shaderAttributesTest.uMatrixModel, false, entity.translationMatrix);
    //gl.uniformMatrix4fv(entitiy.shaderProgramme.Matrix_Projection_Uniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderAttributesTest.uMatrixProjection, false, projectionMatrix);
//    gl.uniformMatrix4fv(entitiy.shaderProgramme.Matrix_View_Uniform, false, viewMatrix);
    gl.uniformMatrix4fv(shaderAttributesTest.uMatrixView, false, mat4.create());
//    gl.uniform3fv(entitiy.shaderProgramme.Kd, [255 / 255, 181 / 255, 0 / 255]);//color
    gl.uniform3fv(shaderAttributesTest.Kd, [180 / 255, 181 / 255, 0 / 255]);//color
    //mat4.identity(Maxtrix_Move);
    //mat4.translate(Maxtrix_Move, Maxtrix_Move, ASSETS[key].POS);
    
//    gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entitiy.assetIndex][0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VP_Buffer);
//    gl.vertexAttribPointer(entitiy.shaderProgramme.vertexPositionAttribute, TRIANGLE, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(shaderAttributesTest.aVertexPosition, TRIANGLE, gl.FLOAT, false, 0, 0);



    //    gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entitiy.assetIndex][1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entity.assetIndex].VC_Buffer);
//    gl.vertexAttribPointer(entitiy.shaderProgramme.vertexNormalsAttribute, TRIANGLE, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(shaderAttributesTest.aVertexNormals, TRIANGLE, gl.FLOAT, false, 0, 0);

    //    gl.uniformMatrix4fv(entitiy.shaderProgramme.Matrix_Model_Uniform, false, entitiy.translationMatrix);
 //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shaderAttributesTest.indexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, ASSETS[entity.assetIndex].numItems);
 //  gl.drawElements(gl.TRIANGLES, ASSETS[entity.assetIndex].numItems, gl.UNSIGNED_SHORT, 0);
    //console.log(ASSETS[entity.assetIndex].numItems);
}

export {drawEntity};