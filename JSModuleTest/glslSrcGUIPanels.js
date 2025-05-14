
export const my_gui_vs_str = `
    
    #version 100
    in vec2 vp; 
    out vec2 st; 
    void main () 
    { 
        st = (vp + 1.0) * 0.5; 
        gl_Position = vec4 (vp.x, vp.y, 0.0, 1.0); 
        gl_Position.xy *= 0.5; 
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