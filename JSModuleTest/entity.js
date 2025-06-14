import {mat4, vec3, mat3} from './glMatrix/index.js';
import {shader} from './shader.js';
import {ASSETS} from './init-buffers.js';

export let components = [];

let counter = 1;
export class component  {
        constructor(assetIndex, shaderIndex, position, texture, Kd) {
        this.uid = counter++;
        this.selected = 0;
        this.scale = 1;
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
    getRotationMatrix() {return this.rotationMatrix;}
    getTranslationMatrix() {return this.translationMatrix;}
    setRotation(x_axis, y_axis, z_axis) {
        this.rotationMatrix = mat4.create();
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, y_axis, [0,1,0]);
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    rotate(x_axis, y_axis, z_axis) {
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, y_axis, [0,1,0]);
        //mat4.rotate(out, a, rad, axis);
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    setPosition(position){this.setTranslationMatrix(position);}
    setPositionTest(position){
        mat4.translate(this.translationMatrix, mat4.create(), [position[0], position[1], position[2]]); 
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    move(xyz_change){
        this.setTranslationMatrix(xyz_change);
    }
    setTranslationMatrix(position){
        mat4.translate(this.translationMatrix, this.translationMatrix, [position[0], position[1], position[2]]); 
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    
    }
    getPosition(){return [this.translationMatrix[12], this.translationMatrix[13], this.translationMatrix[14]];}
    getLocation(){return [this.translationMatrix[12], this.translationMatrix[13], this.translationMatrix[14]];}

    setTransformationMatrix(T, R)
    {
        mat4.multiply(this.transformationMatrix, T, R); 
    }

    setRotationMatrix(R)
    {
        this.rotationMatrix = R;
        this.setTransformationMatrix(this.transformationMatrix, R);
    }

    setScaleMatrix(ratio)
    {
        //ratio=2;
        let S = mat4.create();
        mat4.fromScaling(S, [ratio, 1, 1]);
        let inbetween = mat4.create();
        //mat4.multiply(inbetween, this.translationMatrix, S); 
        //mat4.multiply(this.transformationMatrix, inbetween, this.rotationMatrix); 
       
        //mat4.multiply(inbetween, S, this.translationMatrix); 
       // mat4.multiply(this.transformationMatrix, inbetween, this.rotationMatrix); 

        mat4.multiply(inbetween, this.translationMatrix, this.rotationMatrix); 
        mat4.multiply(this.transformationMatrix, inbetween, S); 
        //let TRS = mat4.fromValues(TR);//mat4.create();
        //mat4.multiply(TRS, TR, S);
        
        //this.transformationMatrix = mat4.fromValues(TRS);

        //this.setTransformationMatrix(this.translationMatrix, R);
        //this.setTransformationMatrix(this.transformationMatrix, this.rotationMatrix);
        
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