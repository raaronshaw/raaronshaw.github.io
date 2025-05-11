import {entities, viewMatrix} from './webgl-demo.js';
import {mat4, vec3, quat, vec4} from './glMatrix/index.js';
let m_orientation = [1.0, 0.0, 0.0, 0.0];
let m_eye = [0.0, 0.0, 0.0];
let WORLD_YAXIS = [0.0, 1.0, 0.0];
var WORLD_XAXIS = [1.0, 0.0, 0.0];
let m_xAxis = [1.0, 0.0, 0.0];
let m_yAxis = [0.0, 1.0, 0.0];
let m_zAxis = [0.0, 0.0, 1.0];
let m_viewDir = [0.0, 0.0, -1.0];
let cam_yaw = 0;
let test_orientation = quat.create();

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
 export function startCanvasEvents(entities)
 {
  //quat q (angle, x, y, z);
  //quat(test_orientation= quat(0.0, 0.0, 0.0, 0.0);
  document.getElementById("Layout").addEventListener("click", move, false);
  document.addEventListener("keypress", handleKeyPress, false);
  document.getElementById("Layout").addEventListener("contextmenu", (event) => { event.preventDefault(); /* show a custom context menu*/ });
  document.getElementById("Layout").addEventListener("mousedown", mouseDown, false);
   document.getElementById("Layout").addEventListener("mouseup", mouseUp, false);
  document.getElementById("Layout").addEventListener("mousemove", mouseMove, false);
 }
  /*element.onmousedown = function(eventData) {
  if (eventData.button === 0) {
      alert("From JS: the (left?) button is down!")
  }
}*/
   // document.addEventListener("keypress", (Event) => {
    //  console.log("keypressed");
   // });
        //document.onmouseup = handleMouseUp;
        //document.aonmousemove = handleMouseMove;
        //document.onkeypress = handleKeyPress;
 let mouseRightDown = false;
 //let mousePos = [0,0];
 let mousePos = {x:0,y:0};
 function mouseDown(event)
 {
  if(event.button==2)
  {
    mouseRightDown = true;
    mousePos = {x:event.clientX, y:event.clientY};
    //vewMatrix
  }
  else mouseRightDown = false;

  

 }
function mouseUp(event)
 {
  if(event.button==2)
  {
    mouseRightDown = false;
    mousePos = {x:event.clientX, y:event.clientY};
  }
  //else mouseRightDown = false;
 }

  let first = 2;
  let second = 6;
  let third = 10;
  let fourth = 14;

function mouseMove(event)
{
  let deltaX = event.clientX - mousePos.x;
  let deltaY = event.clientY - mousePos.y
  mousePos = {x:event.clientX, y:event.clientY};

  if(mouseRightDown)
  {
    let heading = deltaX;
    let pitch = deltaY;
    if (heading != 0.0) {
      let deltaquat = quat.create();
      quat.setAxisAngle(deltaquat, [0.0,1.0,0.0], degToRad(heading));
      quat.multiply(test_orientation, test_orientation, deltaquat);
      let T = mat4.create();
      let R = mat4.create();
      mat4.translate(T, mat4.create(), [-m_eye[0], -m_eye[1], -m_eye[2]]);
      mat4.fromQuat(R, test_orientation);
      mat4.multiply(viewMatrix, T, R);
      
    }
    if (pitch != 0.0) {
      let deltaquat = quat.create();
      quat.setAxisAngle(deltaquat, [1.0,0.0,0.0], degToRad(pitch));
      quat.multiply(test_orientation, test_orientation, deltaquat);
      let T = mat4.create();
      let R = mat4.create();
      mat4.translate(T, mat4.create(), [-m_eye[0], -m_eye[1], -m_eye[2]]);
      mat4.fromQuat(R, test_orientation);
      mat4.multiply(viewMatrix, T, R);
    }
  }  


  //const mat4 inverted = glm::inverse(transformationMatrix);
//const vec3 forward = normalize(glm::vec3(inverted[2]));

//normalize(glm::vec3(camera.GetViewMatrix()[2]))*vec3(1 , 1 ,-1)
  let testdirection = vec4.create();

  vec4.normalize(testdirection, [viewMatrix[first], viewMatrix[second], viewMatrix[third], viewMatrix[fourth]]);
  
  document.getElementById("t3").firstChild.nodeValue = `${testdirection[0].toFixed(2)}, ${testdirection[1].toFixed(2)}, ${testdirection[2].toFixed(2)}, ${testdirection[3].toFixed(2)}`;//"" + viewMatrix[2].toFixed(2) + "" + 2;
  document.getElementById("t3").firstChild.nodeValue = `${viewMatrix[first].toFixed(2)}, ${viewMatrix[second].toFixed(2)}, ${viewMatrix[third].toFixed(2)}, ${viewMatrix[fourth].toFixed(2)}`;//"" + viewMatrix[2].toFixed(2) + "" + 2;


}

function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseDown = false;
    }

    var direction = vec3.create();
    function handleKeyPress(e) 
    {
      var keyPressed = e.code;
      let cam_speed = 1;//deltaDirection = 0.1;
      let cam_moved = 0;
      let movement_direction = vec3.create();
      if (keyPressed == 'KeyA')//a
      {
        vec3.normalize(movement_direction, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);//, viewMatrix[fourth]]);
        m_eye[0] -= movement_direction[0]; 
        m_eye[1] -= movement_direction[1]; 
        m_eye[2] += movement_direction[2]; 
        cam_moved = true;
      }
      else if (keyPressed == 'KeyD')//d
      {
        vec3.normalize(movement_direction, [viewMatrix[0], viewMatrix[4], viewMatrix[8]]);//, viewMatrix[fourth]]);
        m_eye[0] += movement_direction[0]; 
        m_eye[1] += movement_direction[1]; 
        m_eye[2] -= movement_direction[2]; 
        cam_moved = true;
      }
      else if (keyPressed == 'KeyS')//s
      {
        vec3.normalize(movement_direction, [viewMatrix[first], viewMatrix[second], viewMatrix[third]]);//, viewMatrix[fourth]]);
        m_eye[0] -= movement_direction[0]; 
        m_eye[1] -= movement_direction[1]; 
        m_eye[2] += movement_direction[2]; 
        cam_moved = true;
          // direction = [0, 0, -10];
      }
      else if (keyPressed == 'KeyW')//w
      {
        //let forwmovement_directionard = vec3.create();
        vec3.normalize(movement_direction, [viewMatrix[first], viewMatrix[second], viewMatrix[third]]);//, viewMatrix[fourth]]);
        m_eye[0] += movement_direction[0]; 
        m_eye[1] += movement_direction[1]; 
        m_eye[2] -= movement_direction[2]; 
        //m_eye[2] -= cam_speed * 0.1;//elapsed_seconds;
        cam_moved = true;
      }
      else if (keyPressed == 'KeyR')//r
      {
          // direction = [0, 10, 0];
      }
      else if (keyPressed == 'KeyF')//f
      {
          //direction = [0, -10, 0];
      }
      else if (keyPressed == 'KeyZ')//z
      {
          // vec3.copy(z_eye, m_eye);
          // direction = [0, 0, 0];
      }
      // else direction = [0, 0, 0];
      if (cam_moved) 
      { 
        let T = mat4.create();
        let R = mat4.create();
        mat4.translate(T, mat4.create(), [-m_eye[0], -m_eye[1], -m_eye[2]]);
        mat4.fromQuat(R, test_orientation);
        mat4.multiply(viewMatrix, T, R);
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

 function move()
 {

      let direction = [0, 0, 0.1];
      var forwards = vec3.create();
      forwards = vec3.cross(forwards, WORLD_YAXIS, m_xAxis);
      vec3.normalize(forwards, forwards);
      var eye = vec3.create();
      vec3.copy(eye, m_eye);
      vec3.scaleAndAdd(eye, eye, m_xAxis, direction[0]);
      vec3.scaleAndAdd(eye, eye, WORLD_YAXIS, direction[1]);
      vec3.scaleAndAdd(eye, eye, forwards, direction[2]);
      vec3.copy(m_eye, eye);

      //BEGIN UPDATE VIEW MATRIX//
      mat4.fromQuat(viewMatrix, [m_orientation[1], m_orientation[2], m_orientation[3], m_orientation[0]]);
      m_xAxis = [viewMatrix[0], viewMatrix[4], viewMatrix[8]];
      m_yAxis = [viewMatrix[1], viewMatrix[5], viewMatrix[9]];
      m_zAxis = [viewMatrix[2], viewMatrix[6], viewMatrix[10]];
      m_viewDir = -m_zAxis;
      viewMatrix[12] = -vec3.dot(m_xAxis, m_eye);
      viewMatrix[13] = -vec3.dot(m_yAxis, m_eye);
      viewMatrix[14] = -vec3.dot(m_zAxis, m_eye);
      //END UPDATE VIEW MATRIX//
    console.log("clicked");
    console.log(viewMatrix);

 }
 