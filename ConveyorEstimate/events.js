import {viewMatrix} from './conveyorLayout.js';
import {mat4, vec3, quat, vec4} from './lib/glMatrix/index.js';
import {components, component} from './entity.js';
import {trains, defaultColor} from './conveyorLayout.js';
import {actuated_movement} from './globals.js';
import {projectionMatrix} from'./draw-scene.js';
import {model} from './init-buffers.js';
import {train} from './train.js';

export let camera_position = vec3.fromValues(0.0, 0.0, 0.0);

export let camera_orientation = quat.create();
let speed_turn = 0.5;
let mouseRightDown = false;
let mouseLeftDown = false;
let mouseMiddleDown = false;
let mousePos = {x:0,y:0};
let mouseLeftPos = {x:0,y:0};
let mouseMiddlePos = {x:0,y:0};
let xyz_select = vec3.create();
let xyz_select_initial = vec3.create();
let xyz_select_previous = vec3.create();
let xyz_select_his = vec3.create();
let his_x = 0;

export let camera_movement = 0;
export let downForward = false;
export let downBack = false;

export let debug_colours = 0;
export let fb = 0;
export let fb_texture = 0;

function modifyText() {
    const t2 = document.getElementById("t2");
    const isNodeThree = t2.firstChild.nodeValue === "three";
    t2.firstChild.nodeValue = isNodeThree ? "two" : "three";
  }
  
  // Add event listener to table
 //document.getElementById("outside").addEventListener("click", modifyText, false);
 
 function degToRad(degrees) {
        return degrees * Math.PI / 180;   
      }
 export function startCanvasEvents(entities, gl)
 {
    let fbb = initializeColorBasedMousePicking(gl);
    document.getElementById("Layout").addEventListener("click", (event)=> { 
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      clicktest(gl, event);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      });
    
    document.getElementById("Layout").addEventListener("contextmenu", (event) => { event.preventDefault(); /*removes default right click menu may be used to show a custom context menu*/ });
    document.getElementById("Layout").addEventListener("mousedown", (event)=> { 
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      mouseDown(gl, event);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    });
    document.getElementById("Layout").addEventListener("keydown", keyDown, false);
    document.getElementById("Layout").addEventListener("keyup", keyUp, false);
    document.addEventListener("keypress", handleKeyPress, false);
    document.getElementById("Layout").addEventListener("dblclick", (event)=> {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      dblClick(gl, event);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    });
    document.getElementById("Layout").addEventListener("mouseup", mouseUp, false);
    document.getElementById("Layout").addEventListener("mousemove", (event)=> { 
      mouseMove(gl, event);
    });

    document.querySelectorAll(".Conveyor_Component").forEach(function(element){
        element.addEventListener("click", buttonClick, false);});
    
    //consider setting canvas focus when mouseover so user does not have to click on canvas to enable camera movement.
    document.getElementById("Layout").addEventListener('blur', () => {
      
      //testing resize of window, need to correct for padding and pass through values to context
      //document.getElementById("Layout").width = window.innerWidth-document.getElementById("WebGL_Models").offsetWidth;
      
      camera_movement = 0;});

    return fbb;
 }

function buttonClick(event)
{
  if(event.target.id=="CHU01_60" || event.target.id=="DRI02_48")//temp start work on add via button
  {
    //new component(0, 0, [-10.0, -10.0, -50.0], texture, defaultColor)
    //new component(model.TAI10_48, 0, [ this.start[0],        this.start[1], this.start[2]], 0, defaultColor),
    let x = 0;
    let y = 0;
    let z = 0;

    let testcomponents = 
        
    trains.push
    (
      new train
      (
        x, y, z, [new component(model[event.target.id], 0, [x,y,z],0, defaultColor)]
      )
    );
    //trains.push(new train(-50,-100,-100));
    //trains[trains.length-1].testInitiate();


    //console.log("test click chu");
  }
  //console.log(event.target.id);
  //if(event.target.className=="component")
  //{
  //  console.log(event.target.className);
 // }

 /* export const model = {
  Cube: 0,
  Square: 1,
  TAI10_48: 2,
  INT05_48: 3,
  DRI02_48: 4,
  CHU01_60: 5
};*/

 // console.log(event.target.id);
//  console.log(model["TAI10_48"]);

}

 function initializeColorBasedMousePicking(gl)
 {
  // create framebuffer 
  fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
// create a depth renderbuffer
  let depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
 
  // make a depth buffer and the same size as the targetTexture
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  fb_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fb_texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                gl.canvas.clientWidth, gl.canvas.clientHeight, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fb_texture, 0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);//unbind the created framebuffer
  return fb;
 }

 function mouseDown(gl, event)
 {
  if(event.button==2)
  {
    mouseRightDown = true;
    mousePos = {x:event.clientX, y:event.clientY};
  }
  else mouseRightDown = false;
  if(event.button==0)//Left Mouse Button
  {
    mouseLeftDown = true;
    mouseLeftPos = {x:event.clientX, y:event.clientY};
    //RAYCAST
    {
      let x = (2.0 * event.offsetX) / gl.canvas.clientWidth - 1.0; 
      let y = 1.0 - (2.0 * event.offsetY) / gl.canvas.clientHeight; 
      let z = 1.0; 

      let invertedProjectionMatrix = mat4.create();
      mat4.invert(invertedProjectionMatrix, projectionMatrix);

      let ray_eye = vec4.fromValues(
        invertedProjectionMatrix[0] * x + invertedProjectionMatrix[4] * y + invertedProjectionMatrix[8]  * -1.0 + invertedProjectionMatrix[12], 
        invertedProjectionMatrix[1] * x + invertedProjectionMatrix[5] * y + invertedProjectionMatrix[9]  * -1.0 + invertedProjectionMatrix[13], 
        -1.0, 0.0);

      let invertedViewMatrix = mat4.create();
      mat4.invert(invertedViewMatrix, viewMatrix);

      let ray_wor = vec3.fromValues(
        invertedViewMatrix[0] * ray_eye[0] + invertedViewMatrix[4] * ray_eye[1] + invertedViewMatrix[8]  * -1.0, 
        invertedViewMatrix[1] * ray_eye[0] + invertedViewMatrix[5] * ray_eye[1] + invertedViewMatrix[9]  * -1.0, 
        invertedViewMatrix[2] * ray_eye[0] + invertedViewMatrix[6] * ray_eye[1] + invertedViewMatrix[10] * -1.0
      ); 
      
      vec3.normalize(ray_wor, ray_wor);

      let t = (-1.0 * vec3.dot(camera_position, vec3.fromValues(0,1.0,0.0)) + 0.0) / vec3.dot(ray_wor, vec3.fromValues(0,1.0,0.0));
      vec3.scale(ray_wor, ray_wor, t);

      //let xyz_select = vec3.create();
      vec3.add(xyz_select, camera_position, ray_wor);
      xyz_select_previous = [xyz_select[0], xyz_select[1], xyz_select[2]];
      xyz_select_initial = xyz_select_previous;
  //   components.push(new component(0, 0, [xyz_select[0], xyz_select[1], xyz_select[2]], loadTexture(gl, [1.0,  0.5,  1.0], 0), defaultColor));
    }

    {
      let pixels = new Uint8Array(1 * 1 * 4,);
      gl.readPixels (event.offsetX, gl.canvas.clientHeight-event.offsetY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let index = pixels[0]*1+pixels[1]*256+pixels[2]*256*256;
      //document.getElementById("t3").firstChild.nodeValue = `Index ${pixels[0]*1+pixels[1]*256+pixels[2]*256*256} Selected`;
      for(let i = 0; i<components.length ; i++)
        components[i].Kd = defaultColor;
      //if(index>0)
      // components[index-1].Kd = [0.0,1.0,0.0];
      //for(let i = 0; i<trains.length ; i++)
      //{ 
      //  trains[i].setColor(defaultColor);
        //trains[i].selected = false;
      //}
      let selected = [];
      if(true)
      {
        //execute to handle selecting an already selected train/component
        for(let i = 0; i<trains.length; i++)
        {
          for(let j =0; j<trains[i].children.length;j++)
          {
            if(trains[i].children[j].selected == true) selected.push(trains[i].children[j].uid);
          }
        }

        //execute if not selecting an already selected train/component
        if(selected.includes(index)==false)
        {
          selected = [];
          for(let i = 0; i<trains.length; i++)
          {
            for(let j =0; j<trains[i].children.length;j++)
            {
              if((index)==trains[i].children[j].uid)
              {
                trains[i].children[j].selected = true;
                trains[i].children[j].Kd = [0.0,1.0,0.0];
              }
              else
              {
                trains[i].children[j].selected = false;
                trains[i].children[j].Kd = defaultColor;//[0.0,1.0,0.0];
              }
            }
          }
        }
      }
    }
  }
  else mouseLeftDown = false;
  if(event.button==1)
  {
    mouseMiddleDown = true;
    mouseMiddlePos = {x:event.clientX, y:event.clientY};
  }
  else mouseMiddleDown = false;

 }

function dblClick(gl, event) //conflict with mousemove functions and snapping, disabled until revisit
{
  return;
  let pixels = new Uint8Array(1 * 1 * 4,);
  gl.readPixels (event.offsetX, gl.canvas.clientHeight-event.offsetY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  let index = pixels[0]*1+pixels[1]*256+pixels[2]*256*256;
  //document.getElementById("t3").firstChild.nodeValue = `Index ${pixels[0]*1+pixels[1]*256+pixels[2]*256*256} Selected`;
  //console.log("dblclick");
  let selected = [];
  for(let i = 0; i<trains.length; i++)
  {
    for(let j =0; j<trains[i].children.length;j++)
    {
      if((index)==trains[i].children[j].uid)
      {
        for(let k =0; k<trains[i].children.length;k++)
        {
          selected.push(trains[i].children[k].uid);  
        }
        break;
      }
    }
  }
  for(let i = 0; i<trains.length; i++)
  {
    for(let j =0; j<trains[i].children.length;j++)
    {
      if(selected.includes(trains[i].children[j].uid)==true)
      {
        trains[i].children[j].selected = true;
        trains[i].children[j].Kd = [0.0,1.0,0.0];        
      }
      else
      {
        trains[i].children[j].selected = false;
        trains[i].children[j].Kd = defaultColor;
      }
    }
  }  
}

function mouseUp(event)
 {
  if(event.button==2)
  {
    mouseRightDown = false;
    mousePos = {x:event.clientX, y:event.clientY};
  }
  if(event.button==0)//Left Mouse Button
  {
    mouseLeftDown = false;
    mouseLeftPos = {x:event.clientX, y:event.clientY};
    for(let i =0; i<trains.length; i++)
    {
      for(let j = 0; j<trains[i].children.length; j++)
      {
        trains[i].children[j].setElevation(trains[i].children[j].getPosition()[1]);
      }
    }
  }
  if(event.button==1)
  {
    mouseMiddleDown = false;
    mouseMiddlePos = {x:event.clientX, y:event.clientY};
  }
  //else mouseRightDown = false;
 }


function mouseMove(gl, event)
{
  if(mouseLeftDown)
  {
    let deltaX = event.clientX - mousePos.x;
    let deltaY = event.clientY - mousePos.y
    mousePos = {x:event.clientX, y:event.clientY};
    {
      //RAYCAST      
      let ray_wor = 0;
      let Dhat = 0;
      let snapPoint = 0;
      {
        let x = (2.0 * event.offsetX) / gl.canvas.clientWidth - 1.0; 
        let y = 1.0 - (2.0 * event.offsetY) / gl.canvas.clientHeight; 
        let z = 1.0; 
        his_x = x;
        let invertedProjectionMatrix = mat4.create();
        mat4.invert(invertedProjectionMatrix, projectionMatrix);

        let ray_eye = vec4.fromValues(
          invertedProjectionMatrix[0] * x + invertedProjectionMatrix[4] * y + invertedProjectionMatrix[8]  * -1.0 + invertedProjectionMatrix[12], 
          invertedProjectionMatrix[1] * x + invertedProjectionMatrix[5] * y + invertedProjectionMatrix[9]  * -1.0 + invertedProjectionMatrix[13], 
          -1.0, 0.0);
        

        let invertedViewMatrix = mat4.create();
        mat4.invert(invertedViewMatrix, viewMatrix);
        
        ray_wor = vec3.fromValues(
          invertedViewMatrix[0] * ray_eye[0] + invertedViewMatrix[4] * ray_eye[1] + invertedViewMatrix[8]  * -1.0, 
          invertedViewMatrix[1] * ray_eye[0] + invertedViewMatrix[5] * ray_eye[1] + invertedViewMatrix[9]  * -1.0, 
          invertedViewMatrix[2] * ray_eye[0] + invertedViewMatrix[6] * ray_eye[1] + invertedViewMatrix[10] * -1.0
        ); 
        //Dhattestone = ray_wor;
        vec3.normalize(ray_wor, ray_wor);
        
        let y_offset = 0;

        let t = (-1.0 * vec3.dot(camera_position, vec3.fromValues(0,1.0,0.0)) + y_offset) / vec3.dot(ray_wor, vec3.fromValues(0,1.0,0.0));
        vec3.scale(ray_wor, ray_wor, t);

        //vec3.add(xyz_select, camera_position, ray_wor);
        //console.log(ray_wor);
        //Dhat = ray_wor;
      }
      //let test_train_select = 0;

      Dhat = 0;
      if(true)//need to figure out what is different from raycast at start of this function as ray_world is different
      {
        {
          let x = (2.0 * event.offsetX) / gl.canvas.clientWidth - 1.0; 
          let y = 1.0 - (2.0 * event.offsetY) / gl.canvas.clientHeight; 
          let z = 1.0; 
          his_x = x;
          let invertedProjectionMatrix = mat4.create();
          mat4.invert(invertedProjectionMatrix, projectionMatrix);

          let ray_eye = vec4.fromValues(
            invertedProjectionMatrix[0] * x + invertedProjectionMatrix[4] * y + invertedProjectionMatrix[8]  * -1.0 + invertedProjectionMatrix[12], 
            invertedProjectionMatrix[1] * x + invertedProjectionMatrix[5] * y + invertedProjectionMatrix[9]  * -1.0 + invertedProjectionMatrix[13], 
            -1.0, 
            0.0);

          let invertedViewMatrix = mat4.create();
          mat4.invert(invertedViewMatrix, viewMatrix);
          
          let ray_world = vec3.fromValues(
            invertedViewMatrix[0] * ray_eye[0] + invertedViewMatrix[4] * ray_eye[1] + invertedViewMatrix[8]  * -1.0, 
            invertedViewMatrix[1] * ray_eye[0] + invertedViewMatrix[5] * ray_eye[1] + invertedViewMatrix[9]  * -1.0, 
            invertedViewMatrix[2] * ray_eye[0] + invertedViewMatrix[6] * ray_eye[1] + invertedViewMatrix[10] * -1.0
          ); 
          //Dhattesttwo = ray_wort;
          vec3.normalize(ray_world, ray_world);
          Dhat = ray_world;
        }
              //testing snap point hits
        {
          let camsubpoint = vec3.create();
          let point = vec3.create();
          let testPoint = vec3.fromValues(0,0,0);
          vec4.transformMat4(point, vec4.fromValues(testPoint[0],testPoint[1],testPoint[2],1), trains[0].children[2].getTransformationMatrix());
          vec3.subtract(camsubpoint, vec3.fromValues(point[0],point[1],point[2]), camera_position);
          let b = vec3.dot(Dhat, camsubpoint);
          let c = vec3.dot(camsubpoint, camsubpoint);
          c = c-20*20;
          if(b*b-c>0)
          {
            snapPoint = point;
            //console.log("hit");
          }
         // else console.log("miss");
        }
      }

      for(let i = 0; i<trains.length; i++)
      {
        for(let j = 0; j<trains[i].children.length; j++)
        {
          if(trains[i].children[j].selected == true)
          {
            let magprojaontob = 0,
            test_train_select = i;
            if(false)//move elements
            {
              trains[i].children[j].move([
                //magprojaontob,//
                xyz_select[0]-xyz_select_previous[0],
                xyz_select[1]-xyz_select_previous[1],
                xyz_select[2]-xyz_select_previous[2]
              ]);
            }
            if(true && snapPoint == 0)//move elements
            {
              //trains[i].children[j].move([
                //magprojaontob,//
              //  xyz_select[0]-xyz_select_previous[0],
              //  xyz_select[1]-xyz_select_previous[1],
              //  xyz_select[2]-xyz_select_previous[2]
              //]);
               trains[i].children[j].resetElevation();
              let y_offset = trains[i].children[j].getPosition()[1];
              let t = (-1.0 * vec3.dot(camera_position, vec3.fromValues(0,1.0,0.0)) + y_offset) / vec3.dot(ray_wor, vec3.fromValues(0,1.0,0.0));
              let selection_position = vec3.create();
              vec3.scale(selection_position, ray_wor, t);
              vec3.add(selection_position, camera_position, selection_position);              

              trains[i].children[j].setPositionTest([
                //magprojaontob,//
                selection_position[0],
                selection_position[1],//trains[i].children[j].getElevation(),
                selection_position[2]
              ]);
                            
            }            
            if(true && snapPoint != 0)//move elements
            {
              trains[i].children[j].setPositionTest([
                //magprojaontob,//
                snapPoint[0],//xyz_select[0]-xyz_select_previous[0],
                snapPoint[1],//xyz_select[1]-xyz_select_previous[1],
                snapPoint[2]//xyz_select[2]-xyz_select_previous[2]
              ]);
            }            
            if(true){//rotate elements
              let angle = 0;
              let trainVector = trains[i].getVector();
              if(trainVector[0]==0) angle = Math.PI;
              else angle = Math.atan(-trainVector[2]/trainVector[0]);
              
              if(trainVector[0] >=0) angle += Math.PI;
              if(trainVector[0] < 0) angle += 0;
              
              trains[i].rotate(angle, [0,1,0]);
            }

            {//need to revise such that setPosition == setPositionTest (currently setPosition a move vs a set)
              //let testingxyz = trains[i].children[j].getPosition();
              //trains[i].children[j].setPositionTest(testingxyz);
            }
            
            

            

          }
        }
        trains[i].construct();
      }
 
      Dhat = 0;
      if(false)//need to figure out what is different from raycast at start of this function as ray_world is different
      {
        {
          let x = (2.0 * event.offsetX) / gl.canvas.clientWidth - 1.0; 
          let y = 1.0 - (2.0 * event.offsetY) / gl.canvas.clientHeight; 
          let z = 1.0; 
          his_x = x;
          let invertedProjectionMatrix = mat4.create();
          mat4.invert(invertedProjectionMatrix, projectionMatrix);

          let ray_eye = vec4.fromValues(
            invertedProjectionMatrix[0] * x + invertedProjectionMatrix[4] * y + invertedProjectionMatrix[8]  * -1.0 + invertedProjectionMatrix[12], 
            invertedProjectionMatrix[1] * x + invertedProjectionMatrix[5] * y + invertedProjectionMatrix[9]  * -1.0 + invertedProjectionMatrix[13], 
            -1.0, 
            0.0);

          let invertedViewMatrix = mat4.create();
          mat4.invert(invertedViewMatrix, viewMatrix);
          
          let ray_world = vec3.fromValues(
            invertedViewMatrix[0] * ray_eye[0] + invertedViewMatrix[4] * ray_eye[1] + invertedViewMatrix[8]  * -1.0, 
            invertedViewMatrix[1] * ray_eye[0] + invertedViewMatrix[5] * ray_eye[1] + invertedViewMatrix[9]  * -1.0, 
            invertedViewMatrix[2] * ray_eye[0] + invertedViewMatrix[6] * ray_eye[1] + invertedViewMatrix[10] * -1.0
          ); 
          //Dhattesttwo = ray_wort;
          vec3.normalize(ray_world, ray_world);
          Dhat = ray_world;
        }
              //testing snap point hits
        {
          let camsubpoint = vec3.create();
          let point = vec3.create();
          vec4.transformMat4(point, vec4.fromValues(79,0,0,1), trains[0].children[0].getTransformationMatrix());
          vec3.subtract(camsubpoint, vec3.fromValues(point[0],point[1],point[2]), camera_position);
          let b = vec3.dot(Dhat, camsubpoint);
          let c = vec3.dot(camsubpoint, camsubpoint);
          c = c-20*20;
          //if(b*b-c>0) console.log("hit");
          //else console.log("miss");
        }
      }


      xyz_select_previous = [xyz_select[0], xyz_select[1], xyz_select[2]];
      vec3.add(xyz_select, camera_position, ray_wor);

   
    }
  }

  if(mouseRightDown)
  {
    let deltaHeading = event.clientX - mousePos.x;
    let deltaPitch = event.clientY - mousePos.y
    mousePos = {x:event.clientX, y:event.clientY};
    if (deltaHeading != 0.0) {
      deltaHeading*=speed_turn;
      let deltaquat = quat.create();
      let T = mat4.create();
      let R = mat4.create();
      quat.setAxisAngle(deltaquat, [0.0,1.0,0.0], degToRad(deltaHeading));
      quat.multiply(camera_orientation, camera_orientation, deltaquat);
      mat4.fromQuat(R, camera_orientation);
      mat4.translate(T, mat4.create(), [-camera_position[0], -camera_position[1], -camera_position[2]]);
      mat4.multiply(viewMatrix, R, T);
    }
    if (deltaPitch != 0.0) { 
      deltaPitch*=speed_turn;
      let deltaquat = quat.create();
      let T = mat4.create();
      let R = mat4.create();
      let rightvector = vec3.create();
      vec3.normalize(rightvector, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);
      quat.setAxisAngle(deltaquat, rightvector, degToRad(deltaPitch));
      quat.multiply(camera_orientation, camera_orientation, deltaquat);
      mat4.fromQuat(R, camera_orientation);
      mat4.translate(T, mat4.create(), [-camera_position[0], -camera_position[1], -camera_position[2]]);
      mat4.multiply(viewMatrix, R, T);
    }
  }  

 //document.getElementById("t4").firstChild.nodeValue = `${camera_position[0].toFixed(2)}, ${camera_position[1].toFixed(2)}, ${camera_position[2].toFixed(2)}, ${0}`;//"" + viewMatrix[2].toFixed(2) + "" + 2;


}

function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseDown = false;
    }

function keyDown(event)
{
  let keyPressed = event.code;
  if (keyPressed == 'KeyW') camera_movement = camera_movement | actuated_movement.Forward;
  if (keyPressed == 'KeyS') camera_movement = camera_movement | actuated_movement.Backward;
  if (keyPressed == 'KeyA') camera_movement = camera_movement | actuated_movement.Left;
  if (keyPressed == 'KeyD') camera_movement = camera_movement | actuated_movement.Right;
  if (keyPressed == 'KeyF') camera_movement = camera_movement | actuated_movement.Down;
  if (keyPressed == 'KeyR') camera_movement = camera_movement | actuated_movement.Up;
  if (keyPressed == 'Space') camera_movement = camera_movement | actuated_movement.Up;
  
}
function keyUp(event){
  let keyPressed = event.code;
  if (keyPressed == 'KeyW') camera_movement = camera_movement & ~(actuated_movement.Forward);
  if (keyPressed == 'KeyS') camera_movement = camera_movement & ~(actuated_movement.Backward);
  if (keyPressed == 'KeyA') camera_movement = camera_movement & ~(actuated_movement.Left);
  if (keyPressed == 'KeyD') camera_movement = camera_movement & ~(actuated_movement.Right);
  if (keyPressed == 'KeyF') camera_movement = camera_movement & ~(actuated_movement.Down);
  if (keyPressed == 'KeyR') camera_movement = camera_movement & ~(actuated_movement.Up);
  if (keyPressed == 'Space') 
  {
    event.preventDefault();
    camera_movement = camera_movement & ~(actuated_movement.Up);
  }
}

function handleKeyPress(e) 
{
/*  Legacy code not used
let keyPressed = e.code;
  let cam_moved = 0;
  let movement_direction = vec3.create();
  let speed_move_vector = vec3.create();
  if (keyPressed == 'KeyA' && false)//a
  {
    vec3.normalize(movement_direction, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);
    vec3.scale(movement_direction,movement_direction,speed_move*-1);
    vec3.add(camera_position, camera_position, movement_direction);
    cam_moved = true;
  }
  else if (keyPressed == 'KeyD' && false)//d
  {
    vec3.normalize(movement_direction, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);//, viewMatrix[fourth]]);
    vec3.scale(movement_direction,movement_direction,speed_move);
    vec3.add(camera_position, camera_position, movement_direction);
    cam_moved = true;
  }
  else if (keyPressed == 'KeyW' && false)//w
  {
    vec3.normalize(movement_direction, [viewMatrix[2], viewMatrix[6], viewMatrix[10]]);
    vec3.scale(movement_direction,movement_direction,speed_move*-1);
    vec3.add(camera_position, camera_position, movement_direction);
    cam_moved = true;
  }  
  else if (keyPressed == 'KeyS' && false)//s
  {
    vec3.normalize(movement_direction, [viewMatrix[2], viewMatrix[6], viewMatrix[10]]);//, viewMatrix[fourth]]);
    vec3.scale(movement_direction,movement_direction,speed_move*1);
    vec3.add(camera_position, camera_position, movement_direction);
    cam_moved = true;
  }
  else if (keyPressed == 'KeyR' && false)//r
  {
    vec3.normalize(movement_direction, [viewMatrix[1], viewMatrix[5], viewMatrix[9]]);
    vec3.scale(movement_direction,movement_direction,speed_move);
    vec3.add(camera_position, camera_position, movement_direction);
    cam_moved = true;
  }
  else if (keyPressed == 'KeyF' && false)//f
  {
    vec3.normalize(movement_direction, [viewMatrix[1], viewMatrix[5], viewMatrix[9]]);
    vec3.scale(movement_direction,movement_direction,speed_move);
    vec3.subtract(camera_position, camera_position, movement_direction);
    cam_moved = true;
  }
  if (cam_moved) 
  { 
    let T = mat4.create();
    let R = mat4.create();
    mat4.translate(T, mat4.create(), [-camera_position[0], -camera_position[1], -camera_position[2]]);
    mat4.fromQuat(R, camera_orientation);
    mat4.multiply(viewMatrix, R, T);
   // let det = mat4.determinant(viewMatrix);
    //mat4.multiplyScalar(viewMatrix, viewMatrix, 1/mat4.determinant(viewMatrix));
    //mat4.normalize(viewMatrix, viewMatrix);
  }
*/
}

    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;
        var heading = newX - lastMouseX;
        var pitch = newY - lastMouseY;

        if (heading != 0.0) {
            var rot = quat.create();
            quat.setAxisAngle(rot, WORLD_YAXIS, degToRad(heading));
            rot = [rot[3], rot[0], rot[1], rot[2]];
            m_orientation = quat.product(rot, m_orientation);
        }
        if (pitch != 0.0) {
            var rot = quat.create();
            quat.setAxisAngle(rot, WORLD_XAXIS, degToRad(pitch));
            rot = [rot[3], rot[0], rot[1], rot[2]];
            m_orientation = quat.product(m_orientation, rot);
        }

        //BEGIN UPDATE VIEW MATRIX//
        mat4.fromQuat(Matrix_View, [m_orientation[1], m_orientation[2], m_orientation[3], m_orientation[0]]);
        m_xAxis = [Matrix_View[0], Matrix_View[4], Matrix_View[8]];
        m_yAxis = [Matrix_View[1], Matrix_View[5], Matrix_View[9]];
        m_zAxis = [Matrix_View[2], Matrix_View[6], Matrix_View[10]];
        m_viewDir = -m_zAxis;
        Matrix_View[12] = -vec3.dot(m_xAxis, m_eye);
        Matrix_View[13] = -vec3.dot(m_yAxis, m_eye);
        Matrix_View[14] = -vec3.dot(m_zAxis, m_eye);
        //END UPDATE VIEW MATRIX//
        //mouse.move to lastMouseX, lastMouseY instead of below stuff

        lastMouseX = newX
        lastMouseY = newY;

    }


    
function clicktest(gl, event)
{
  return;

  let pixels = new Uint8Array(1 * 1 * 4,);
  gl.readPixels (event.offsetX, gl.canvas.clientHeight-event.offsetY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  let index = pixels[0]*1+pixels[1]*256+pixels[2]*256*256;
  document.getElementById("t3").firstChild.nodeValue = `Index ${pixels[0]*1+pixels[1]*256+pixels[2]*256*256} Selected`;
  for(let i = 0; i<components.length ; i++)
    components[i].Kd = defaultColor;
  //if(index>0)
   // components[index-1].Kd = [0.0,1.0,0.0];
  //for(let i = 0; i<trains.length ; i++)
  //{ 
  //  trains[i].setColor(defaultColor);
    //trains[i].selected = false;
  //}
  if(false)
  {
    for(let i = 0; i<trains.length; i++)
    {
      for(let j =0; j<trains[i].children.length;j++)
      {
        if((index)==trains[i].children[j].uid)
        {
          trains[i].children[j].selected = true;
          trains[i].children[j].Kd = [0.0,1.0,0.0];
        }
        else
        {
          trains[i].children[j].selected = false;
          trains[i].children[j].Kd = defaultColor;//[0.0,1.0,0.0];
        }
      }
    }
  }

  



    
      
}

 