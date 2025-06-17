import {mat4, vec3, vec4, mat3} from './lib/glMatrix/index.js';
import {shader} from './shader.js';
import {ASSETS} from './init-buffers.js';
import { actuated_movement as move_direction } from './globals.js';

export let components = [];

let counter = 1;
export class component  {
        constructor(assetIndex, shaderIndex, position, texture, Kd, mirror, width, length, snaps) {
        this.uid = counter++;
        this.selected = 0;
        this.scale = 1;
        this.mirror = 1;
        this.width = 48;
        this.width_ratio = 1.0;
        if(ASSETS[assetIndex].modelData == undefined) this.length = 0;
        else this.length = ASSETS[assetIndex].modelData.length;
        this.variable_length = false;
        if(assetIndex == undefined) this.assetIndex = 0;
        else this.assetIndex = assetIndex;
        if(shaderIndex == undefined) this.shaderIndex = 0; 
        else this.shaderIndex = shaderIndex;
        
        if(Kd == undefined) this.Kd = [0.7, 0.2, 0.2];
        else this.Kd = Kd;
        this.scaleMatrix = mat4.create();
        this.translationMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.transformationMatrix = mat4.create();
        if(position != undefined) this.setTranslationMatrix(position);
        else this.setTranslationMatrix([0,0,0]);
        this.setElevation(this.getPosition()[1]);
        this.scalingMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        if (texture == undefined) this.texture = 0;
        else this.texture = texture;
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
        //console.log(this.uid);
    }
    setLength(length)
    {
       // if(this.variable_length==true)
       this.length = length;//test//set scale matrix here
       this.setScaleMatrix([1,1,1]);
    }
    getRotationMatrix() {return this.rotationMatrix;}
    getTranslationMatrix() {return this.translationMatrix;}
/*    setRotation(x_axis, y_axis, z_axis) {
        this.rotationMatrix = mat4.create();
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, y_axis, [0,1,0]);
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }*/
    getQuaternion() 
    {
        let out_r = mat4.create();
        let out_t = mat4.create();
        let out_s = mat4.create();
        return mat4.decompose(out_r, out_t, out_s, this.transformationMatrix);
    }
    setRotation(angle, axis) {
        this.rotationMatrix = mat4.create();
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, angle, axis);
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    rotate(x_axis, y_axis, z_axis) {
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, y_axis, [0,1,0]);
        //mat4.rotate(out, a, rad, axis);
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    //setPosition(position){this.setTranslationMatrix(position);}
    setPosition(position){
        mat4.translate(this.translationMatrix, mat4.create(), [position[0], position[1], position[2]]); 
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    setPositionTest(position){
        mat4.translate(this.translationMatrix, mat4.create(), [position[0], position[1], position[2]]); 
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    }
    setWidth(width_inches)
    {
        this.width_ratio = width_inches/this.width;
    }
    move(xyz_change){
        this.setTranslationMatrix(xyz_change);
    }
    setElevation(elevation)
    {
        this.elevation = elevation;
        let current_position = this.getPosition();
        current_position[1] = elevation;
        this.setPosition(current_position);
    }
    resetElevation()
    {
        let current_position = this.getPosition();
        current_position[1] = this.elevation;
        //console.log(current_position[1]);
        this.setPosition(current_position);
    }
    getElevation() {return this.elevation};
    getTransformationMatrix()
    {
        return this.transformationMatrix;
    }
    setTranslationMatrix(position){
        mat4.translate(this.translationMatrix, this.translationMatrix, [position[0], position[1], position[2]]); 
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
    
    }
    getPosition(){return [this.translationMatrix[12], this.translationMatrix[13], this.translationMatrix[14]];}
    getLocation(){return [this.translationMatrix[12], this.translationMatrix[13], this.translationMatrix[14]];}
    getPositionEnd()
    {
        let position = vec4.create();
        vec4.transformMat4(position, vec4.fromValues(this.length,0,0,1), this.getTransformationMatrix());
        return position;
    }
    getPositionBegin()
    {
        //let position = vec4.create();
        //vec4.transformMat4(position, vec4.fromValues(this.length,0,0,1), this.getTransformationMatrix());
        return vec3.fromValues(this.translationMatrix[12], this.translationMatrix[13], this.translationMatrix[14]);
    }
    setTransformationMatrix(T, R)
    {
        mat4.multiply(this.transformationMatrix, T, R); 
        mat4.multiply(this.transformationMatrix, this.transformationMatrix, this.scaleMatrix); 
    }

    setRotationMatrix(R)
    {
        this.rotationMatrix = R;
        this.setTransformationMatrix(this.transformationMatrix, R);
    }
    getMovementConstraints()
    {

    }
    setMovementConstraints()
    {

    }
    setScaleMatrix(ratiovector)
    {
        ratiovector[2] = this.width_ratio;
        ratiovector[0] = this.length;
        ratiovector[1] = 1;
       // let S = mat4.create();
       // mat4.fromScaling(S, ratiovector);
        mat4.fromScaling(this.scaleMatrix, ratiovector);
        this.setTransformationMatrix(this.translationMatrix, this.rotationMatrix);
       // let inbetween = mat4.create();
       // mat4.multiply(inbetween, this.translationMatrix, this.rotationMatrix); 
        //mat4.multiply(this.transformationMatrix, inbetween, S); 
    }
    setLengthRatio(ratio)
    {
        return;
        //ratiovector[2] = this.width_ratio;
       // let S = mat4.create();
       // mat4.fromScaling(S, ratiovector);
        mat4.fromScaling(this.scaleMatrix, [ratio, 1, this.width_ratio]);
       // let inbetween = mat4.create();
       // mat4.multiply(inbetween, this.translationMatrix, this.rotationMatrix); 
        //mat4.multiply(this.transformationMatrix, inbetween, S); 
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