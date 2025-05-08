 //drawEntity(gl, projectionMatrix, viewMatrix, entities[0]);
function drawEntity(gl, projectionMatrix, viewMatrix, entitiy)
{
    gl.useProgram(entitiy.shaderProgramme);
    gl.uniformMatrix4fv(entitiy.shaderProgramme.Matrix_Projection_Uniform, false, projectionMatrix);
    gl.uniformMatrix4fv(entitiy.shaderProgramme.Matrix_View_Uniform, false, viewMatrix);
    gl.uniform3fv(entitiy.shaderProgramme.Kd, vec3(255 / 255, 181 / 255, 0 / 255));//color
    //mat4.identity(Maxtrix_Move);
    //mat4.translate(Maxtrix_Move, Maxtrix_Move, ASSETS[key].POS);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entitiy.assetIndex][0]);
    gl.vertexAttribPointer(entitiy.shaderProgramme.vertexPositionAttribute, TRIANGLE, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[entitiy.assetIndex][1]);
    gl.vertexAttribPointer(entitiy.shaderProgramme.vertexNormalsAttribute, TRIANGLE, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(entitiy.shaderProgramme.Matrix_Model_Uniform, false, entitiy.translationMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, ASSETS[entitiy.assetIndex][2]);
}

export {drawEntity};