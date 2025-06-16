import {model} from './init-buffers.js'
import { component, components } from './entity.js';
import {loadTexture, defaultColor} from './conveyorLayout.js';
import { vec3, vec4, mat4, quat} from './lib/glMatrix/index.js';
import {ASSETS} from './init-buffers.js';

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
    rotate(angle, axis)
    {
        this.children.forEach(
            function(child)
            {
                child.setRotation(angle, axis);
            }
        );
    }
    move(xyz_delta)
    {
        this.children.forEach(
            function(child)
            {
                child.move(xyz_delta);
            }
        );   
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
    construct()
    {
        for(let i =0; i<this.children.length;i++)
        {
            //Need better way
            let assetIndex = this.children[i].assetIndex;
            if(assetIndex == model.INT05_48)
            {
                let index_prev = i-1;
                let index_next = i+1;
                if(index_prev>=0 && index_next<this.children.length)
                {
                    let uiya = this.children[index_prev].getPositionEnd();
                    let uiyb = this.children[index_next].getPositionEnd();
                    let midpoint = vec3.fromValues(
                        (uiya[0] + uiyb[0]) / 2,
                        (uiya[1] + uiyb[1]) / 2,
                        (uiya[2] + uiyb[2]) / 2
                    );
                    this.children[i].setPositionTest(midpoint);
                    this.children[i].setLength(vec3.distance(uiya, uiyb));
                }
                if(index_prev>=0 && index_next<this.children.length && false)
                {
                    let aa = this.children[index_prev].length;
                    let bb = this.children[index_next].length;
                    let aaa = this.children[index_prev].getPosition();
                    let bbb = this.children[index_next].getPosition();
                    let dd = vec3.distance(aaa, bbb);

                    let ratio = ((dd-aa-bb)/2+aa)/dd;
                    let vectoroftrain = vec3.create();
                    vec3.scale(vectoroftrain, this.getVector(), ratio);
                    this.children[i].setLength(dd-aa-bb);
                    let movetopos = vec3.create();
                    vec3.subtract(movetopos, aaa, vectoroftrain);

                    this.children[i].setPositionTest(movetopos);
                }
            }
        }
    }
}