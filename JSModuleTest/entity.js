import {mat4, vec3, mat3} from './glMatrix/index.js';

export let entities = [];

let counter = 1;
export class entity  {
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
    

}