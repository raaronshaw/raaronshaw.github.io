import {mat4, vec3, mat3} from './glMatrix/index.js';

export class entity  {
    constructor(assetIndex, shaderIndex, position, Kd) {
        if(assetIndex == undefined) this.assetIndex = 0;
        else this.assetIndex = assetIndex;
        if(shaderIndex == undefined) this.shaderIndex = 0; 
        else this.shaderIndex = shaderIndex;
        this.Kd = [0.2, 0.2, 0.2];
        this.translationMatrix = mat4.create();
        if(position != undefined) this.setLocation(position);
        this.scalingMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
    }

    setLocation(position){
        mat4.translate(this.translationMatrix, this.translationMatrix, [position[0], position[1], position[2]]); 
    }
    getLocation(){return vec3(translationMatrix[3], translationMatrix[7], translationMatrix[11]);}


}