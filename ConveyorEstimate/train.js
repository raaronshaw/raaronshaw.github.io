import {model} from './init-buffers.js'
import { component, components } from './entity.js';
import {loadTexture, defaultColor} from './conveyorLayout.js';
import { vec3} from './lib/glMatrix/index.js';

export class train
{
    constructor(x, y, z, components){
        this.start = vec3.fromValues(x,y,z);
        this.end = vec3.fromValues(x+10, y, z);
        this.selected = false;
        this.children = [];
        if(components!=undefined)
            for(const child of components)
                this.children.push(child);
    }
    testInitiate()
    {
        this.children = [
            new component(model.TAI10_48, 0, [ this.start[0],        this.start[1], this.start[2]], 0, defaultColor),
            new component(model.INT05_48, 0, [ this.start[0]+30-5.5, this.start[1], this.start[2]], 0, defaultColor), 
            new component(model.DRI02_48, 0, [ this.start[0]+80-1,   this.start[1], this.start[2]], 0, defaultColor)//,
        ];
    }
    getLength()
    {
        let a = this.getStartPosition();
        let b = this.getEndPosition();
        let solution = 0;
        solution = Math.pow(
            Math.pow(a[0]-b[0],2)+
            Math.pow(a[1]-b[1],2)+
            Math.pow(a[2]-b[2],2)
        ,0.5);
        return solution;

    }
    getVector()
    {
        let a = this.getEndPosition();
        let b = this.getStartPosition();
        let solution = [
            [b[0]-a[0]],
            [b[1]-a[1]],
            [b[2]-a[2]]
        ];
        
        return solution;

    }
    getStartPosition()
    {
        return this.children[0].getLocation();
    }
    getEndPosition()
    {
        return this.children[this.children.length-1].getLocation();

    }
    draw(gl, projectionMatrix, viewMatrix, shaderIndex)
    {
        for(let i =0; i<this.children.length; i++)
        {
            this.children[i].draw(gl, projectionMatrix, viewMatrix, shaderIndex);
        }
    }
    setSelected(selected)
    {
        this.selected = selected;
        for(let i =0; i<this.children.length; i++)
        {
            this.children[i].selected = this.selected;
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