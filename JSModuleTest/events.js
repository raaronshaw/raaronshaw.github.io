import {viewMatrix} from './webgl-demo.js';
import {mat4, vec3, quat, vec4} from './glMatrix/index.js';
import {components, component} from './entity.js';
import {trains, loadTexture, defaultColor} from './webgl-demo.js';
import {projectionMatrix} from'./draw-scene.js';

let camera_position = vec3.fromValues(0.0, 0.0, 0.0);

let camera_orientation = quat.create();
let speed_turn = 0.5;
let speed_move = 0.5;
let mouseRightDown = false;
let mouseLeftDown = false;
let mouseMiddleDown = false;
let mousePos = {x:0,y:0};
let mouseLeftPos = {x:0,y:0};
let mouseRightPos = {x:0,y:0};
let mouseMiddlePos = {x:0,y:0};
export let debug_colours = 0;

function modifyText() {
    const t2 = document.getElementById("t2");
    const isNodeThree = t2.firstChild.nodeValue === "three";
    t2.firstChild.nodeValue = isNodeThree ? "two" : "three";
  }
  
  // Add event listener to table
 document.getElementById("outside").addEventListener("click", modifyText, false);
 
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
    document.addEventListener("keypress", handleKeyPress, false);
    document.getElementById("Layout").addEventListener("contextmenu", (event) => { event.preventDefault(); /*removes default right click menu may be used to show a custom context menu*/ });
    document.getElementById("Layout").addEventListener("mousedown", mouseDown, false);
    document.getElementById("Layout").addEventListener("mouseup", mouseUp, false);
    document.getElementById("Layout").addEventListener("mousemove", mouseMove, false);
    return fbb;
 }

 export let fb = 0;
export let fb_texture = 0;
 function initializeColorBasedMousePicking(gl)
 {
  // create framebuffer 
  fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
 
 /* Use if renderbuffer becomes depreciated
  let depth_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, depth_texture);
  const data = null;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                gl.canvas.clientWidth, gl.canvas.clientHeight, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depth_texture, 0);
*/
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

 function mouseDown(event)
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

  }
  else mouseLeftDown = false;
  if(event.button==1)
  {
    mouseMiddleDown = true;
    mouseMiddlePos = {x:event.clientX, y:event.clientY};
  }
  else mouseMiddleDown = false;

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
    
  }
  if(event.button==1)
  {
    mouseMiddleDown = false;
    mouseMiddlePos = {x:event.clientX, y:event.clientY};
  }
  //else mouseRightDown = false;
 }


function mouseMove(event)
{
  //let deltaHeading = event.clientX - mousePos.x;
  //let deltaPitch = event.clientY - mousePos.y
  //mousePos = {x:event.clientX, y:event.clientY};
if(mouseLeftDown)
  {
    let deltaX = event.clientX - mousePos.x;
    let deltaY = event.clientY - mousePos.y
    mousePos = {x:event.clientX, y:event.clientY};
    /*if (deltaHeading != 0.0) {
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
    }*/
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


    function handleKeyPress(e) 
    {
     
      let keyPressed = e.code;
      let cam_moved = 0;
      let movement_direction = vec3.create();
      if (keyPressed == 'KeyA')//a
      {
        vec3.normalize(movement_direction, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);
        vec3.scale(movement_direction,movement_direction,speed_move);
        vec3.subtract(camera_position, camera_position, movement_direction);
        cam_moved = true;
      }
      else if (keyPressed == 'KeyD')//d
      {
        vec3.normalize(movement_direction, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);//, viewMatrix[fourth]]);
        vec3.scale(movement_direction,movement_direction,speed_move);
        vec3.add(camera_position, camera_position, movement_direction);
        cam_moved = true;
      }
      else if (keyPressed == 'KeyS')//s
      {
        vec3.normalize(movement_direction, [viewMatrix[2], viewMatrix[6], viewMatrix[10]]);//, viewMatrix[fourth]]);
        vec3.scale(movement_direction,movement_direction,speed_move);
        vec3.add(camera_position, camera_position, movement_direction);
        cam_moved = true;
      }
      else if (keyPressed == 'KeyW')//w
      {
        vec3.normalize(movement_direction, [viewMatrix[2], viewMatrix[6], viewMatrix[10]]);
        vec3.scale(movement_direction,movement_direction,speed_move);
        vec3.subtract(camera_position, camera_position, movement_direction);
        cam_moved = true;
      }
      else if (keyPressed == 'KeyR')//r
      {
        vec3.normalize(movement_direction, [viewMatrix[1], viewMatrix[5], viewMatrix[9]]);
        vec3.scale(movement_direction,movement_direction,speed_move);
        vec3.add(camera_position, camera_position, movement_direction);
        cam_moved = true;
      }
      else if (keyPressed == 'KeyF')//f
      {
        vec3.normalize(movement_direction, [viewMatrix[1], viewMatrix[5], viewMatrix[9]]);
        vec3.scale(movement_direction,movement_direction,speed_move);
        vec3.subtract(camera_position, camera_position, movement_direction);
        cam_moved = true;
      }
      else if (keyPressed == 'KeyP')//p
      {
          if(debug_colours)
            debug_colours = 0;
          else debug_colours = 1;
      }
      if (cam_moved) 
      { 
        let T = mat4.create();
        let R = mat4.create();
        mat4.translate(T, mat4.create(), [-camera_position[0], -camera_position[1], -camera_position[2]]);
        mat4.fromQuat(R, camera_orientation);
        mat4.multiply(viewMatrix, R, T);
      }

      return;
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
  let pixels = new Uint8Array(1 * 1 * 4,);
  gl.readPixels (event.offsetX, gl.canvas.clientHeight-event.offsetY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  let index = pixels[0]*1+pixels[1]*256+pixels[2]*256*256;
  document.getElementById("t3").firstChild.nodeValue = `Index ${pixels[0]*1+pixels[1]*256+pixels[2]*256*256} Selected`;
  for(let i = 0; i<components.length ; i++)
    components[i].Kd = defaultColor;
  //if(index>0)
   // components[index-1].Kd = [0.0,1.0,0.0];
  for(let i = 0; i<trains.length ; i++)
    trains[i].setColor(defaultColor);
  if(index>0)
  {
    for(let i = 0; i<trains.length; i++)
    {
      for(let j =0; j<trains[i].children.length;j++)
      {
        if((index)==trains[i].children[j].uid)
          trains[i].setColor([0.0,1.0,0.0]);
      }

    }
  }

  //RAYCAST
  {
    let x = (2.0 * event.clientX) / gl.canvas.clientWidth - 1.0; 
    let y = 1.0 - (2.0 * event.clientY) / gl.canvas.clientHeight; 
    let z = 1.0; 
    let ray_nds = vec3.fromValues(x, y, z);
    //console.log(y);
    let ray_clip = vec4.fromValues(ray_nds[0], ray_nds[1], -1.0, 1.0);
    //console.log(ray_clip);
    let ray_eye = mat4.create();
    mat4.invert(ray_eye, projectionMatrix);// * ray_clip;
    let temp3 = vec4.create();
    temp3[0] = ray_eye[0] * ray_clip[0] + ray_eye[4] * ray_clip[1] + ray_eye[8]  * ray_clip[2] + ray_eye[12] * ray_clip[3];
    temp3[1] = ray_eye[1] * ray_clip[0] + ray_eye[5] * ray_clip[1] + ray_eye[9]  * ray_clip[2] + ray_eye[13] * ray_clip[3];
    temp3[2] = ray_eye[2] * ray_clip[0] + ray_eye[6] * ray_clip[1] + ray_eye[10] * ray_clip[2] + ray_eye[14] * ray_clip[3];
    temp3[3] = ray_eye[3] * ray_clip[0] + ray_eye[7] * ray_clip[1] + ray_eye[11] * ray_clip[2] + ray_eye[15] * ray_clip[3]; 
    ray_eye = vec4.fromValues(temp3[0], temp3[1], -1.0, 0.0);
    //console.log(ray_eye);
    let temp = mat4.create();
    mat4.invert(temp, viewMatrix);
    //console.log(temp);
    //console.log(viewMatrix);
    let temp2 = vec4.create();
    //temp = temp * ray_eye;
    
    temp2[0] = temp[0] * ray_eye[0] + temp[4] * ray_eye[1] + temp[8]  * ray_eye[2] + temp[12] * ray_eye[3];
    temp2[1] = temp[1] * ray_eye[0] + temp[5] * ray_eye[1] + temp[9]  * ray_eye[2] + temp[13] * ray_eye[3];
    temp2[2] = temp[2] * ray_eye[0] + temp[6] * ray_eye[1] + temp[10] * ray_eye[2] + temp[14] * ray_eye[3];
    temp2[3] = temp[3] * ray_eye[0] + temp[7] * ray_eye[1] + temp[11] * ray_eye[2] + temp[15] * ray_eye[3];

    
   // console.log(temp2);
    let ray_wor = vec3.fromValues(temp2[0], temp2[1], temp2[2]); // don't forget to normalise the vector at some point ray_wor = normalise (ray_wor);
    ray_wor = vec3.normalize(ray_wor, ray_wor);
    //console.log(ray_wor);
    //t = -camera_position dot normal of ground plane + length of ray / (ray_wor dot normal of ground plane); if zero miss perpendicular
    let t = -1.0 * vec3.dot(camera_position, vec3.fromValues(0,-1.0,0.0)) + 0.0;
    t = t / vec3.dot(ray_wor, vec3.fromValues(0,-1.0,0.0));// dot normal of ground plane); if zero miss perpendicular
    let xyz_select = vec3.create();
    vec3.add(xyz_select, camera_position, ray_wor);
    vec3.scale(xyz_select, xyz_select, t);////get xyz from camera_position + ray_wor * t;
    if(t<0) console.log('miss');
    else console.log(xyz_select);
  }



    
      
}
 function move()
 {

    console.log("clicked");
    console.log(viewMatrix);

 }
 