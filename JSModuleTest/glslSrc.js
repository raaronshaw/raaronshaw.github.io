
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
    mat4 myinverse(mat4);
    mat4 mytranspose(mat4);
    void main(void) { \
        out_Matrix_View = Matrix_View; \
        position_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexPosition,1.0)); \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
        gl_PointSize = 2.0; \
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z, 1.0); \
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
        float a00 = a[0][0];
        float a01 = a[0][1];
        float a02 = a[0][2];
        float a03 = a[0][3];
        float a10 = a[1][0];
        float a11 = a[1][1];
        float a12 = a[1][2];
        float a13 = a[1][3];
        float a20 = a[2][0];
        float a21 = a[2][1];
        float a22 = a[2][2];
        float a23 = a[2][3];
        float a30 = a[3][0];
        float a31 = a[3][1];
        float a32 = a[3][2];
        float a33 = a[3][3];
        float b00 = a00 * a11 - a01 * a10;
        float b01 = a00 * a12 - a02 * a10;
        float b02 = a00 * a13 - a03 * a10;
        float b03 = a01 * a12 - a02 * a11;
        float b04 = a01 * a13 - a03 * a11;
        float b05 = a02 * a13 - a03 * a12;
        float b06 = a20 * a31 - a21 * a30;
        float b07 = a20 * a32 - a22 * a30;
        float b08 = a20 * a33 - a23 * a30;
        float b09 = a21 * a32 - a22 * a31;
        float b10 = a21 * a33 - a23 * a31;
        float b11 = a22 * a33 - a23 * a32; 
        float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        //if (!det) {
        //    return null;
        //}
        det = 1.0 / det;
        mat4 result;
        result[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        result[0][1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        result[0][2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        result[0][3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        result[1][0] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        result[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        result[1][2] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        result[1][3] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        result[2][0] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        result[2][1] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        result[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        result[2][3] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        result[3][0] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        result[3][1] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        result[3][2] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        result[3][3] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return result;
    }
    mat4 mytranspose(mat4 a)
    {
        mat4 result;
        result[0][0] = a[0][0];
        result[0][1] = a[1][0];
        result[0][2] = a[2][0];
        result[0][3] = a[3][0];
        result[1][0] = a[0][1];
        result[1][1] = a[1][1];
        result[1][2] = a[2][1];
        result[1][3] = a[3][1];
        result[2][0] = a[0][2];
        result[2][1] = a[1][2];
        result[2][2] = a[2][2];
        result[2][3] = a[3][2];
        result[3][0] = a[0][3];
        result[3][1] = a[1][3];
        result[3][2] = a[2][3];
        result[3][3] = a[3][3];
        return result;

    }

`;

        

    export const my_glsl_vsSource = `
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