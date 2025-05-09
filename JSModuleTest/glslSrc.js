
export const my_glsl_vs_str = `
    
    #version 100
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals; \
    uniform mat4 Matrix_Projection; \
    uniform vec3 Kd; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \

    varying vec3 out_Kd; \
    varying vec3 position_eye, normal_eye; \
    varying mat4 out_Matrix_View; \
    varying highp vec3 vLighting;
    float mydeterminant(mat4);
    mat4 myidentity();
    mat4 myinverse(mat4);
    mat4 mytranspose(mat4);
    void main(void) { \
        out_Matrix_View = Matrix_View; \
        position_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexPosition,1.0)); \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
    
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition, 1.0); \
        out_Kd = Kd; \
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

/*
export function determinant(a) {
  let a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  let a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  let a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  let a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];

  let b0 = a00 * a11 - a01 * a10;
  let b1 = a00 * a12 - a02 * a10;
  let b2 = a01 * a12 - a02 * a11;
  let b3 = a20 * a31 - a21 * a30;
  let b4 = a20 * a32 - a22 * a30;
  let b5 = a21 * a32 - a22 * a31;
  let b6 = a00 * b5 - a01 * b4 + a02 * b3;
  let b7 = a10 * b5 - a11 * b4 + a12 * b3;
  let b8 = a20 * b2 - a21 * b1 + a22 * b0;
  let b9 = a30 * b2 - a31 * b1 + a32 * b0;

  // Calculate the determinant
  return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
}

*/
        

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
    varying vec3 position_eye, normal_eye, out_Kd;	\
    varying mat4 out_Matrix_View; \
    varying highp vec3 vLighting;
    void main(void) { \
        vec3 light_position_world = vec3(1.0, 0.0, 2.0); \
        vec3 Ls = vec3(1.0,1.0,1.0); \
        vec3 Ld = out_Kd;
        vec3 La = vec3(0.9, 0.2, 0.2);
        vec3 Ks = vec3(1.0, 1.0, 1.0); \
        vec3 Kd = out_Kd; \
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
        gl_FragColor = vec4( (Is + Id + Ia)*vLighting , 1.0); \
    }	\
    `;