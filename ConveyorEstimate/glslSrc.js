

export const my_glsl_vs_str = `
    
    #version 100
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals; \
    attribute vec2 aTextureCoord;
    uniform mat4 Matrix_Projection; \
    uniform vec3 uKd; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \

    varying vec3 out_Kd; \
    varying vec3 position_eye, normal_eye; \
    varying mat4 out_Matrix_View; \
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    float mydeterminant(mat4);
    mat4 myidentity();
    mat4 myinverse(mat4);
    mat4 mytranspose(mat4);
    void main(void) { \
        out_Matrix_View = Matrix_View; \
        position_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexPosition,1.0)); \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
        vTextureCoord = aTextureCoord;
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition, 1.0); \
        out_Kd = uKd; \

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));  
        highp vec4 transformedNormal = mytranspose(myinverse(Matrix_View)) * vec4(aVertexNormals, 1.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
    
    mat4 myinverse(mat4 a)
    {
        float b00 = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        float b01 = a[0][0] * a[1][2] - a[0][2] * a[1][0];
        float b02 = a[0][0] * a[1][3] - a[0][3] * a[1][0];
        float b03 = a[0][1] * a[1][2] - a[0][2] * a[1][1];
        float b04 = a[0][1] * a[1][3] - a[0][3] * a[1][1];
        float b05 = a[0][2] * a[1][3] - a[0][3] * a[1][2];
        float b06 = a[2][0] * a[3][1] - a[2][1] * a[3][0];
        float b07 = a[2][0] * a[3][2] - a[2][2] * a[3][0];
        float b08 = a[2][0] * a[3][3] - a[2][3] * a[3][0];
        float b09 = a[2][1] * a[3][2] - a[2][2] * a[3][1];
        float b10 = a[2][1] * a[3][3] - a[2][3] * a[3][1];
        float b11 = a[2][2] * a[3][3] - a[2][3] * a[3][2];
        float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (det==0.0) {
            return myidentity();
        }
        det = 1.0 / det;
        return mat4(
        (a[1][1] * b11 - a[1][2] * b10 + a[1][3] * b09) * det,
        (a[0][2] * b10 - a[0][1] * b11 - a[0][3] * b09) * det,
        (a[3][1] * b05 - a[3][2] * b04 + a[3][3] * b03) * det,
        (a[2][2] * b04 - a[2][1] * b05 - a[2][3] * b03) * det,
        (a[1][2] * b08 - a[1][0] * b11 - a[1][3] * b07) * det,
        (a[0][0] * b11 - a[0][2] * b08 + a[0][3] * b07) * det,
        (a[3][2] * b02 - a[3][0] * b05 - a[3][3] * b01) * det,
        (a[2][0] * b05 - a[2][2] * b02 + a[2][3] * b01) * det,
        (a[1][0] * b10 - a[1][1] * b08 + a[1][3] * b06) * det,
        (a[0][1] * b08 - a[0][0] * b10 - a[0][3] * b06) * det,
        (a[3][0] * b04 - a[3][1] * b02 + a[3][3] * b00) * det,
        (a[2][1] * b02 - a[2][0] * b04 - a[2][3] * b00) * det,
        (a[1][1] * b07 - a[1][0] * b09 - a[1][2] * b06) * det,
        (a[0][0] * b09 - a[0][1] * b07 + a[0][2] * b06) * det,
        (a[3][1] * b01 - a[3][0] * b03 - a[3][2] * b00) * det,
        (a[2][0] * b03 - a[2][1] * b01 + a[2][2] * b00) * det);
    }
    mat4 mytranspose(mat4 a)
    {
        return mat4(a[0][0], a[1][0], a[2][0], a[3][0], a[0][1], a[1][1], a[2][1], a[3][1], a[0][2], a[1][2], a[2][2], a[3][2], a[0][3], a[1][3], a[2][3], a[3][3]);
    }
    mat4 myidentity() { return mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0); }
    float mydeterminant(mat4 a)
    {
        float b0 = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        float b1 = a[0][0] * a[1][2] - a[0][2] * a[1][0];
        float b2 = a[0][1] * a[1][2] - a[0][2] * a[1][1];
        float b3 = a[2][0] * a[3][1] - a[2][1] * a[3][0];
        float b4 = a[2][0] * a[3][2] - a[2][2] * a[3][0];
        float b5 = a[2][1] * a[3][2] - a[2][2] * a[3][1];
        float b6 = a[0][0] * b5 - a[0][1] * b4 + a[0][2] * b3;
        float b7 = a[1][0] * b5 - a[1][1] * b4 + a[1][2] * b3;
        float b8 = a[2][0] * b2 - a[2][1] * b1 + a[2][2] * b0;
        float b9 = a[3][0] * b2 - a[3][1] * b1 + a[3][2] * b0;

        // Calculate the determinant
        return a[1][3] * b6 - a[0][3] * b7 + a[3][3] * b8 - a[2][3] * b9;

    }

`;

        

    export const my_glsl_vsSource = `
    #version 100
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;

        // Apply lighting effect

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
    `;
    
    //glsl fragment shader
    export const my_glsl_fsSource = `
    #version 100
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    
    uniform sampler2D uSampler;
    
    void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
    `;
//vec3(0.2, 0.2, 0.2); \
    export const my_glsl_fs_str = `
    #version 100
    precision mediump float; \
    uniform sampler2D uSampler;


    varying vec3 position_eye, normal_eye, out_Kd;	\
    varying mat4 out_Matrix_View; \
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    void main(void) { \
        vec4 test = texture2D(uSampler, vTextureCoord);
        vec3 light_position_world = vec3(1.0, 0.0, 2.0); \
        vec3 Ls = vec3(1.0, 1.0, 1.0); \
        vec3 Ld = vec3(0.2, 0.2, 0.2);
        vec3 La = vec3(test.x, test.y, test.z);
        vec3 Ks = vec3(1.0, 1.0, 1.0); \
        vec3 Kd = vec3(0.2, 0.2, 0.2); \
        vec3 Ka = vec3(1.0, 1.0, 1.0); \
        float specular_exponent = 100.0;\
        vec3 Ia = La * Ka; \
        vec3 light_position_eye = vec3(out_Matrix_View * vec4(light_position_world, 1.0)); \
        vec3 distance_to_light_eye = light_position_eye - position_eye; \
        vec3 direction_to_light_eye = normalize(distance_to_light_eye);\
        float dot_prod = dot(direction_to_light_eye, normal_eye); \
        dot_prod = max(dot_prod, 0.0); \
        vec3 Id = Ld * Kd * dot_prod; \
        vec3 reflection_eye = reflect (-direction_to_light_eye, normal_eye); \
        vec3 surface_to_viewer_eye = normalize (-position_eye); \
        float dot_prod_specular = dot (reflection_eye, surface_to_viewer_eye); \
        dot_prod_specular = max (dot_prod_specular, 0.0); \
        float specular_factor = pow (dot_prod_specular, specular_exponent); \
        vec3 Is = Ls * Ks * specular_factor; \
        
       // if(textured)
          //  gl_FragColor = texture2D(uSampler, vTextureCoord);
       // else
            gl_FragColor = vec4( (Is + Id + Ia)*vLighting , 1.0); \
        
    }	\
    `;
    //gl_FragColor = texture2D(uSampler, vTextureCoord);












   

        
    //glsl vertex shader
    export const xmy_glsl_vsSource = `
    #version 100
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;

        // Apply lighting effect

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
    `;
    
    //glsl fragment shader
    export const xmy_glsl_fsSource = `
    #version 100
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    
    uniform sampler2D uSampler;
    
    void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
    `;





/*
in vec2 vp; out vec2 st; void main () {   st = (vp + 1.0) * 0.5;   gl_Position = vec4 (vp.x, vp.y, 0.0, 1.0);   gl_Position.xy *= 0.5; }
*/

 export const my_GUI_glsl_vs_str = `
    
    #version 100
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals; \
    attribute vec2 aTextureCoord;
    uniform mat4 Matrix_Projection; \
    uniform vec3 uKd; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \
    varying vec2 st;
    varying vec3 out_Kd; \
    varying vec3 position_eye, normal_eye; \
    varying mat4 out_Matrix_View; \
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    float mydeterminant(mat4);
    mat4 myidentity();
    mat4 myinverse(mat4);
    mat4 mytranspose(mat4);
    void main(void) { \
        st = vec2((aVertexPosition.x + 1.0) * 0.5, (aVertexPosition.y + 1.0) * 0.5);
        out_Matrix_View = Matrix_View; \
        position_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexPosition,1.0)); \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
        vTextureCoord = aTextureCoord;
        gl_Position = vec4 (aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);
        gl_Position.xy *= 0.5;
        Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition, 1.0); \
        out_Kd = uKd; \

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));  
        highp vec4 transformedNormal = mytranspose(myinverse(Matrix_View)) * vec4(aVertexNormals, 1.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
    
    mat4 myinverse(mat4 a)
    {
        float b00 = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        float b01 = a[0][0] * a[1][2] - a[0][2] * a[1][0];
        float b02 = a[0][0] * a[1][3] - a[0][3] * a[1][0];
        float b03 = a[0][1] * a[1][2] - a[0][2] * a[1][1];
        float b04 = a[0][1] * a[1][3] - a[0][3] * a[1][1];
        float b05 = a[0][2] * a[1][3] - a[0][3] * a[1][2];
        float b06 = a[2][0] * a[3][1] - a[2][1] * a[3][0];
        float b07 = a[2][0] * a[3][2] - a[2][2] * a[3][0];
        float b08 = a[2][0] * a[3][3] - a[2][3] * a[3][0];
        float b09 = a[2][1] * a[3][2] - a[2][2] * a[3][1];
        float b10 = a[2][1] * a[3][3] - a[2][3] * a[3][1];
        float b11 = a[2][2] * a[3][3] - a[2][3] * a[3][2];
        float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (det==0.0) {
            return myidentity();
        }
        det = 1.0 / det;
        return mat4(
        (a[1][1] * b11 - a[1][2] * b10 + a[1][3] * b09) * det,
        (a[0][2] * b10 - a[0][1] * b11 - a[0][3] * b09) * det,
        (a[3][1] * b05 - a[3][2] * b04 + a[3][3] * b03) * det,
        (a[2][2] * b04 - a[2][1] * b05 - a[2][3] * b03) * det,
        (a[1][2] * b08 - a[1][0] * b11 - a[1][3] * b07) * det,
        (a[0][0] * b11 - a[0][2] * b08 + a[0][3] * b07) * det,
        (a[3][2] * b02 - a[3][0] * b05 - a[3][3] * b01) * det,
        (a[2][0] * b05 - a[2][2] * b02 + a[2][3] * b01) * det,
        (a[1][0] * b10 - a[1][1] * b08 + a[1][3] * b06) * det,
        (a[0][1] * b08 - a[0][0] * b10 - a[0][3] * b06) * det,
        (a[3][0] * b04 - a[3][1] * b02 + a[3][3] * b00) * det,
        (a[2][1] * b02 - a[2][0] * b04 - a[2][3] * b00) * det,
        (a[1][1] * b07 - a[1][0] * b09 - a[1][2] * b06) * det,
        (a[0][0] * b09 - a[0][1] * b07 + a[0][2] * b06) * det,
        (a[3][1] * b01 - a[3][0] * b03 - a[3][2] * b00) * det,
        (a[2][0] * b03 - a[2][1] * b01 + a[2][2] * b00) * det);
    }
    mat4 mytranspose(mat4 a)
    {
        return mat4(a[0][0], a[1][0], a[2][0], a[3][0], a[0][1], a[1][1], a[2][1], a[3][1], a[0][2], a[1][2], a[2][2], a[3][2], a[0][3], a[1][3], a[2][3], a[3][3]);
    }
    mat4 myidentity() { return mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0); }
    float mydeterminant(mat4 a)
    {
        float b0 = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        float b1 = a[0][0] * a[1][2] - a[0][2] * a[1][0];
        float b2 = a[0][1] * a[1][2] - a[0][2] * a[1][1];
        float b3 = a[2][0] * a[3][1] - a[2][1] * a[3][0];
        float b4 = a[2][0] * a[3][2] - a[2][2] * a[3][0];
        float b5 = a[2][1] * a[3][2] - a[2][2] * a[3][1];
        float b6 = a[0][0] * b5 - a[0][1] * b4 + a[0][2] * b3;
        float b7 = a[1][0] * b5 - a[1][1] * b4 + a[1][2] * b3;
        float b8 = a[2][0] * b2 - a[2][1] * b1 + a[2][2] * b0;
        float b9 = a[3][0] * b2 - a[3][1] * b1 + a[3][2] * b0;

        // Calculate the determinant
        return a[1][3] * b6 - a[0][3] * b7 + a[3][3] * b8 - a[2][3] * b9;

    }

`;

//in vec2 texture_coordinates; uniform sampler2D basic_texture; out vec4 frag_colour; 
//void main () {   vec4 texel = texture (basic_texture, texture_coordinates);   frag_colour = texel; }

    export const my_GUI_glsl_fs_str = `
    #version 100
    precision mediump float; \
    uniform sampler2D uSampler;
    //varying vec4 frag_colour;
    varying vec2 st;

    varying vec3 position_eye, normal_eye, out_Kd;	\
    varying mat4 out_Matrix_View; \
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    void main(void) { \
        vec4 texel = texture2D(uSampler, st);
        gl_FragColor = texel;        
    }	\
    `;
    //gl_FragColor = texture2D(uSampler, vTextureCoord);




export const my_Mouse_Pick_glsl_vs_str = `
    

 #version 100
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals; \
    attribute vec2 aTextureCoord;
    uniform mat4 Matrix_Projection; \
    uniform vec3 uKd; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \

    varying vec3 out_Kd; \
    varying vec3 normal_eye; \

    void main(void) { \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4 (aVertexPosition, 1.0);
        out_Kd = uKd; \
    }
 
`;
/*
    #version 100
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals;
    attribute vec2 aTextureCoord;

    uniform vec3 uKd; \
    uniform mat4 Matrix_Projection; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \

    void main(void) { \
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition, 1.0); \
    }

*/
export const my_Mouse_Pick_glsl_fs_str = `#version 100//300 es
    precision mediump float; 
    uniform sampler2D uSampler;
    varying vec3 out_Kd;	
    void main(void) { 
        gl_FragColor = vec4(out_Kd, 1.0);       
    }	
    `;








export const my_temp_glsl_vs_str = `
    
    #version 100
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals; \
    attribute vec2 aTextureCoord;
    uniform mat4 Matrix_Projection; \
    uniform vec3 uKd; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \

    varying vec3 out_Kd; \
    varying vec3 position_eye, normal_eye; \
    varying mat4 out_Matrix_View; \
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    float mydeterminant(mat4);
    mat4 myidentity();
    mat4 myinverse(mat4);
    mat4 mytranspose(mat4);
    void main(void) { \
        out_Matrix_View = Matrix_View; \
        position_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexPosition,1.0)); \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
        vTextureCoord = aTextureCoord;
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition, 1.0); \
        out_Kd = uKd; \

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));  
        highp vec4 transformedNormal = mytranspose(myinverse(Matrix_View)) * vec4(aVertexNormals, 1.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
    
    mat4 myinverse(mat4 a)
    {
        float b00 = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        float b01 = a[0][0] * a[1][2] - a[0][2] * a[1][0];
        float b02 = a[0][0] * a[1][3] - a[0][3] * a[1][0];
        float b03 = a[0][1] * a[1][2] - a[0][2] * a[1][1];
        float b04 = a[0][1] * a[1][3] - a[0][3] * a[1][1];
        float b05 = a[0][2] * a[1][3] - a[0][3] * a[1][2];
        float b06 = a[2][0] * a[3][1] - a[2][1] * a[3][0];
        float b07 = a[2][0] * a[3][2] - a[2][2] * a[3][0];
        float b08 = a[2][0] * a[3][3] - a[2][3] * a[3][0];
        float b09 = a[2][1] * a[3][2] - a[2][2] * a[3][1];
        float b10 = a[2][1] * a[3][3] - a[2][3] * a[3][1];
        float b11 = a[2][2] * a[3][3] - a[2][3] * a[3][2];
        float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (det==0.0) {
            return myidentity();
        }
        det = 1.0 / det;
        return mat4(
        (a[1][1] * b11 - a[1][2] * b10 + a[1][3] * b09) * det,
        (a[0][2] * b10 - a[0][1] * b11 - a[0][3] * b09) * det,
        (a[3][1] * b05 - a[3][2] * b04 + a[3][3] * b03) * det,
        (a[2][2] * b04 - a[2][1] * b05 - a[2][3] * b03) * det,
        (a[1][2] * b08 - a[1][0] * b11 - a[1][3] * b07) * det,
        (a[0][0] * b11 - a[0][2] * b08 + a[0][3] * b07) * det,
        (a[3][2] * b02 - a[3][0] * b05 - a[3][3] * b01) * det,
        (a[2][0] * b05 - a[2][2] * b02 + a[2][3] * b01) * det,
        (a[1][0] * b10 - a[1][1] * b08 + a[1][3] * b06) * det,
        (a[0][1] * b08 - a[0][0] * b10 - a[0][3] * b06) * det,
        (a[3][0] * b04 - a[3][1] * b02 + a[3][3] * b00) * det,
        (a[2][1] * b02 - a[2][0] * b04 - a[2][3] * b00) * det,
        (a[1][1] * b07 - a[1][0] * b09 - a[1][2] * b06) * det,
        (a[0][0] * b09 - a[0][1] * b07 + a[0][2] * b06) * det,
        (a[3][1] * b01 - a[3][0] * b03 - a[3][2] * b00) * det,
        (a[2][0] * b03 - a[2][1] * b01 + a[2][2] * b00) * det);
    }
    mat4 mytranspose(mat4 a)
    {
        return mat4(a[0][0], a[1][0], a[2][0], a[3][0], a[0][1], a[1][1], a[2][1], a[3][1], a[0][2], a[1][2], a[2][2], a[3][2], a[0][3], a[1][3], a[2][3], a[3][3]);
    }
    mat4 myidentity() { return mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0); }
    float mydeterminant(mat4 a)
    {
        float b0 = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        float b1 = a[0][0] * a[1][2] - a[0][2] * a[1][0];
        float b2 = a[0][1] * a[1][2] - a[0][2] * a[1][1];
        float b3 = a[2][0] * a[3][1] - a[2][1] * a[3][0];
        float b4 = a[2][0] * a[3][2] - a[2][2] * a[3][0];
        float b5 = a[2][1] * a[3][2] - a[2][2] * a[3][1];
        float b6 = a[0][0] * b5 - a[0][1] * b4 + a[0][2] * b3;
        float b7 = a[1][0] * b5 - a[1][1] * b4 + a[1][2] * b3;
        float b8 = a[2][0] * b2 - a[2][1] * b1 + a[2][2] * b0;
        float b9 = a[3][0] * b2 - a[3][1] * b1 + a[3][2] * b0;

        // Calculate the determinant
        return a[1][3] * b6 - a[0][3] * b7 + a[3][3] * b8 - a[2][3] * b9;

    }

`;

        


    export const my_temp_glsl_fs_str = `
    #version 100
    precision mediump float; \
    uniform sampler2D uSampler;


    varying vec3 position_eye, normal_eye, out_Kd;	\
    varying mat4 out_Matrix_View; \
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    void main(void) { \
        vec4 test = texture2D(uSampler, vTextureCoord);
        vec3 light_position_world = vec3(1.0, 0.0, 2.0); \
        vec3 Ls = vec3(1.0, 1.0, 1.0); \
        vec3 Ld = vec3(0.2, 0.2, 0.2);
        vec3 La = out_Kd;//vec3(test.x, test.y, test.z);
        vec3 Ks = vec3(1.0, 1.0, 1.0); \
        vec3 Kd = vec3(0.2, 0.2, 0.2); \
        vec3 Ka = vec3(1.0, 1.0, 1.0); \
        float specular_exponent = 100.0;\
        vec3 Ia = La * Ka; \
        vec3 light_position_eye = vec3(out_Matrix_View * vec4(light_position_world, 1.0)); \
        vec3 distance_to_light_eye = light_position_eye - position_eye; \
        vec3 direction_to_light_eye = normalize(distance_to_light_eye);\
        float dot_prod = dot(direction_to_light_eye, normal_eye); \
        dot_prod = max(dot_prod, 0.0); \
        vec3 Id = Ld * Kd * dot_prod; \
        vec3 reflection_eye = reflect (-direction_to_light_eye, normal_eye); \
        vec3 surface_to_viewer_eye = normalize (-position_eye); \
        float dot_prod_specular = dot (reflection_eye, surface_to_viewer_eye); \
        dot_prod_specular = max (dot_prod_specular, 0.0); \
        float specular_factor = pow (dot_prod_specular, specular_exponent); \
        vec3 Is = Ls * Ks * specular_factor; \
        
       // if(textured)
          //  gl_FragColor = texture2D(uSampler, vTextureCoord);
       // else
            gl_FragColor = vec4( (Is + Id + Ia)*vLighting , 1.0); \
        
    }	\
    `;



  


