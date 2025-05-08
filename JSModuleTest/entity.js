import {mat4, vec3} from './glMatrix/index.js';

class entity  {

    scalingMatrix = mat3.identity();
    rotationMatrix = mat3.identity();
    translationMatrix = mat3.identity();
    shaderProgramme = 0;
    assetIndex = 0;
    constructor(assetIndex, shader, position) {
        if(assetIndex == undef) this.assetIndex = 0;
        else this.assetIndex = assetIndex;
        this.scalingMatrix = mat4.identity();
        this.rotationMatrix = mat4.identity();
        
        if(shader == undef) this.shaderProgramme = 0; 
        else this.shaderProgramme = shader;
        this.translationMatrix = mat4.identity();
        if(position != undef) this.setLocation(position);
    }
    setShader(shaderProgramme)
    {this.shaderProgramme = shaderProgramme;}
    setLocation(x,y,z){this.location = vec3(x, y, z);
        //adjust translationMatrix
        translationMatrix[0] = x,
        translationMatrix[4] = y;
        translationMatrix[8] = z;
    }
    getLocation(){return vec3(translationMatrix[0], translationMatrix[4], translationMatrix[8]);}


}