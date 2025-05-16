import {model} from './init-buffers.js'
import { component, components } from './entity.js';
import {loadTexture, defaultColor} from './webgl-demo.js';
import { vec3} from './glMatrix/index.js';

export class train
{
    constructor(x, y, z){
        this.start = vec3.fromValues(x,y,z);
        this.end = vec3.fromValues(x+10, y, z);
        this.children = [
            new component(model.Cube, 0, [ x,      y, z], 0, defaultColor),
            new component(model.Cube, 0, [ x+5,    y, z], 0, defaultColor), 
            new component(model.Cube, 0, [ x+10,   y, z], 0, defaultColor)
        
        ];
    }
    draw(gl, projectionMatrix, viewMatrix, shaderIndex)
    {
        for(let i =0; i<this.children.length; i++)
        {
            this.children[i].draw(gl, projectionMatrix, viewMatrix, shaderIndex);
        }
    }
    setColor(Kd)
    {
        for(let i =0; i<this.children.length; i++)
        {
            this.children[i].Kd = Kd;
        }

    }
}