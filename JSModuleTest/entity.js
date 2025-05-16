import {mat4, vec3, mat3} from './glMatrix/index.js';
import {shader} from './shader.js';
import {ASSETS} from './init-buffers.js';

export let components = [];

let counter = 1;
export class component  {
    constructor(assetIndex, shaderIndex, position, texture, Kd) {
        this.uid = counter++;
        
        if(assetIndex == undefined) this.assetIndex = 0;
        else this.assetIndex = assetIndex;
        if(shaderIndex == undefined) this.shaderIndex = 0; 
        else this.shaderIndex = shaderIndex;
        
        if(Kd == undefined) this.Kd = [0.7, 0.2, 0.2];
        else this.Kd = Kd;
        
        this.translationMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.transformationMatrix = mat4.create();
        if(position != undefined) this.setTranslationMatrix(position);
        this.scalingMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        if (texture == undefined) this.texture = 0;
        else this.texture = texture;
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
        //console.log(this.uid);
    }

    setTranslationMatrix(position){
        mat4.translate(this.translationMatrix, this.translationMatrix, [position[0], position[1], position[2]]); 
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    getLocation(){return vec3(translationMatrix[3], translationMatrix[7], translationMatrix[11]);}

    setTransformationMatrix(T, R)
    {
        mat4.multiply(this.transformationMatrix, T, R); 
    }

    setRotationMatrix(R)
    {
        this.rotationMatrix = R;
        this.setTransformationMatrix(this.translationMatrix, R);
    }
    
    draw(gl, projectionMatrix, viewMatrix, shaderIndex)
    {
        let index = shaderIndex;//entity.shaderIndex;
        {
            gl.useProgram(shader[index].program);

            gl.uniformMatrix4fv(shader[index].uMatrixProjection, false, projectionMatrix);
            gl.uniformMatrix4fv(shader[index].uMatrixView, false, viewMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[this.assetIndex].VP_Buffer);
            gl.vertexAttribPointer(shader[index].aVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shader[index].aVertexPosition);

            gl.bindBuffer(gl.ARRAY_BUFFER, ASSETS[this.assetIndex].VC_Buffer);
            gl.vertexAttribPointer(shader[index].aVertexNormals, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shader[index].aVertexNormals);
            if(shaderIndex == 2)
                gl.uniform3fv(shader[index].uKd, [this.uid/255,0.0,0.0]); 
            else 
                gl.uniform3fv(shader[index].uKd, this.Kd); 

            gl.uniformMatrix4fv(shader[index].uMatrixModel, false, this.transformationMatrix);//translationMatrix);
            gl.drawArrays(gl.TRIANGLES, 0, ASSETS[this.assetIndex].numItems);
        }   
    }
}