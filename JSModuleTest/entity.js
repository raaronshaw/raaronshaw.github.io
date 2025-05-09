import {mat4, vec3, mat3} from './glMatrix/index.js';

export class entity  {

   // scalingMatrix = mat4.identity();
  //  rotationMatrix = mat4.identity();
   // translationMatrix = mat4.identity();
  //  shaderProgramme = 0;
  //  assetIndex = 0;
    constructor(assetIndex, shader, position) {
        if(assetIndex == undefined) this.assetIndex = 0;
        else this.assetIndex = assetIndex;
        this.scalingMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        
        if(shader == undefined) this.shaderProgramme = 0; 
        else this.shaderProgramme = shader;
        this.translationMatrix = mat4.create();
        if(position != undefined) this.setLocation(position);
    }
    setShader(shaderProgramme)
    {this.shaderProgramme = shaderProgramme;}
    setLocation(position){
        mat4.translate(this.translationMatrix, this.translationMatrix, [position[0], position[1], position[2]]); 
    }
    getLocation(){return vec3(translationMatrix[3], translationMatrix[7], translationMatrix[11]);}


}