import {mat4, vec3, mat3} from './glMatrix/index.js';
export let GUIPanels = [];

export function naiveGUISetup(gl)
{
    let points = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0];

    let vp_vbo = gl.createBuffer(); 
        gl.bindBuffer (gl.ARRAY_BUFFER, vp_vbo); 
        gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW); 
        gl.bindBuffer (gl.ARRAY_BUFFER, null);//testing unbind 
    let vao = gl.createBuffer();
    //const texture = loadTexture(gl, "./test_image.png");
// Flip image pixels into the bottom-to-top order that WebGL expects.
    
   // const textureCoordBuffer = initTextureBuffer(gl);
    //glGenVertexArrays (1, &vao); 
    //glBindVertexArray (vao); // note: vertex buffer is already bound 
    //glVertexAttribPointer (0, 2, GL_FLOAT, GL_FALSE, 0, NULL); 
    //glEnableVertexAttribArray (0);

   // GLuint gui_sp; // shader programme 
    //GLuint gui_vs = glCreateShader (GL_VERTEX_SHADER); 
    //glShaderSource (gui_vs, 1, &gui_vs_str, NULL); 
    //glCompileShader (gui_vs); 
    //GLuint gui_fs = glCreateShader (GL_FRAGMENT_SHADER); 
    //glShaderSource (gui_fs, 1, &gui_fs_str, NULL); 
    //glCompileShader (gui_fs); 
    //gui_sp = glCreateProgram (); 
    //glAttachShader (gui_sp, gui_vs); 
    //glAttachShader (gui_sp, gui_fs); 
    //glLinkProgram (gui_sp);
    
}


