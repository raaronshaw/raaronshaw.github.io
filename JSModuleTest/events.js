import {entities, viewMatrix} from './webgl-demo.js';
import {mat4, vec3} from './glMatrix/index.js';
let m_orientation = [1.0, 0.0, 0.0, 0.0];
let m_eye = [0.0, 0.0, 0.0];
let WORLD_YAXIS = [0.0, 1.0, 0.0];
let m_xAxis = [1.0, 0.0, 0.0];
let m_yAxis = [0.0, 1.0, 0.0];
let m_zAxis = [0.0, 0.0, 1.0];
let m_viewDir = [0.0, 0.0, -1.0];

function modifyText() {
    const t2 = document.getElementById("t2");
    const isNodeThree = t2.firstChild.nodeValue === "three";
    t2.firstChild.nodeValue = isNodeThree ? "two" : "three";
  }
  
  // Add event listener to table
 document.getElementById("outside").addEventListener("click", modifyText, false);
 
 export function startCanvasEvents(entities)
 {
  document.getElementById("Layout").addEventListener("click", move, false);
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
 