//glsl vertex shader
export const shaderAttributesTest = {
  aVertexPosition : 0,
  aVertexNormals : 0,
  uKd : 0,
  uMatrixView : 0,
  uMatrixProjection : 0,
  uMatrixModel : 0
};

export var shaderCustom = 0;





const vsSource = `
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
const fsSource = `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;

//const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

function initShaderProgram(gl){//}, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    let shaderProgramme = gl.createProgram();
    gl.attachShader(shaderProgramme, vertexShader);
    gl.attachShader(shaderProgramme, fragmentShader);
    gl.linkProgram(shaderProgramme);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgramme, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgramme
        )}`
      );
      return null;
    }
    {
       // shaderProgramme.aVertexPosition = gl.getAttribLocation(shaderProgramme, "aVertexPosition");
        //gl.enableVertexAttribArray(shaderProgramme.vertexPositionAttribute);
        //shaderProgramme.aVertexNormals = gl.getAttribLocation(shaderProgramme, "aVertexNormals");
        //gl.enableVertexAttribArray(shaderProgramme.vertexNormalsAttribute);
        //shaderProgramme.aTextureCoord = gl.getAttribLocation(shaderProgramme, "aTextureCoord");

      //  shaderProgramme.Kd = gl.getUniformLocation(shaderProgramme, "Kd");
       // shaderProgramme.Matrix_View_Uniform = gl.getUniformLocation(shaderProgramme, "Matrix_View");
        //shaderProgramme.Matrix_Projection_Uniform = gl.getUniformLocation(shaderProgramme, "Matrix_Projection");
        //shaderProgramme.Matrix_Model_Uniform = gl.getUniformLocation(shaderProgramme, "Matrix_Model");


    }

    /*const programInfo = {
        program: shaderProgram[0],
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram[0], "aVertexPosition"),
          vertexNormal: gl.getAttribLocation(shaderProgram[0], "aVertexNormal"),
          textureCoord: gl.getAttribLocation(shaderProgram[0], "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram[0],"uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgram[0], "uModelViewMatrix"),
          normalMatrix: gl.getUniformLocation(shaderProgram[0], "uNormalMatrix"),
          uSampler: gl.getUniformLocation(shaderProgram[0], "uSampler"),
        },
      };  */  
    naiveShader(gl);
    const shaderProgram = [];
    shaderProgram.push(shaderProgramme);
    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }

function naiveShader (gl)
{
    var fragmentShader;//test triangle
    {
        var fs_str = " \
    precision mediump float; \
    varying vec3 position_eye, normal_eye, out_Kd;	\
    varying mat4 out_Matrix_View; \
    void main(void) { \
        vec3 light_position_world = vec3(0.0, 0.0, 2.0); \
        vec3 Ls = vec3(1.0,1.0,1.0); \
        vec3 Ld = vec3(0.7,0.7,0.7); \
        vec3 La = vec3(0.2, 0.2, 0.2); \
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
        gl_FragColor = vec4(Is + Id + Ia, 1.0); \
    }	\
    ";

        fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fs_str);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(fragmentShader));
            return null;
        }
    }//	
    var vertexShader;//test triangle
    {
        var vs_str = " \
    attribute vec3 aVertexPosition; \
    attribute vec3 aVertexNormals; \
    uniform mat4 Matrix_Projection; \
    uniform vec3 Kd; \
    uniform mat4 Matrix_View; \
    uniform mat4 Matrix_Model; \
    varying vec3 out_Kd; \
    varying vec3 position_eye, normal_eye; \
    varying mat4 out_Matrix_View; \
    void main(void) { \
        out_Matrix_View = Matrix_View; \
        position_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexPosition,1.0)); \
        normal_eye = vec3(Matrix_View * Matrix_Model * vec4(aVertexNormals,0.0)); \
        gl_PointSize = 2.0; \
        gl_Position = Matrix_Projection * Matrix_View * Matrix_Model * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z, 1.0); \
        out_Kd = Kd; \
    }	\
    ";
        vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vs_str);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert(gl03.getShaderInfoLog(vertexShader));
            return null;
        }
    }
    let shaderProgramme = 0;
    {//test triangle
        shaderProgramme = gl.createProgram();
        shaderCustom = gl.createProgram();
///////////////
        gl.attachShader(shaderProgramme, vertexShader);
        gl.attachShader(shaderProgramme, fragmentShader);
        gl.linkProgram(shaderProgramme);

        gl.attachShader(shaderCustom, vertexShader);
        gl.attachShader(shaderCustom, fragmentShader);
        gl.linkProgram(shaderCustom);
///////////
        if (!gl.getProgramParameter(shaderProgramme, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        if (!gl.getProgramParameter(shaderCustom, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
        }
///////////////
        //shaderProgramme.vertexPositionAttribute = gl.getAttribLocation(shaderProgramme, "aVertexPosition");
        shaderAttributesTest.aVertexPosition = gl.getAttribLocation(shaderCustom, "aVertexPosition");

        //gl.enableVertexAttribArray(shaderProgramme.vertexPosition);
        gl.enableVertexAttribArray(shaderAttributesTest.aVertexPosition);
//////////////////////
       // shaderProgramme.vertexNormalsAttribute = gl.getAttribLocation(shaderProgramme, "aVertexNormals");
        shaderAttributesTest.aVertexNormals = gl.getAttribLocation(shaderCustom, "aVertexNormals");

        gl.enableVertexAttribArray(shaderCustom.vertexNormalsAttribute);
        gl.enableVertexAttribArray(shaderAttributesTest.aVertexNormals);
//////////
        //shaderProgramme.Kd = gl.getUniformLocation(shaderProgramme, "Kd");
        shaderAttributesTest.uKd = gl.getUniformLocation(shaderCustom, "Kd");
        //shaderProgramme.Matrix_View_Uniform = gl.getUniformLocation(shaderProgramme, "Matrix_View");
        shaderAttributesTest.uMatrixView = gl.getUniformLocation(shaderCustom, "Matrix_View");
        //shaderProgramme.Matrix_Projection_Uniform = gl.getUniformLocation(shaderProgramme, "Matrix_Projection");
        shaderAttributesTest.uMatrixProjection = gl.getUniformLocation(shaderCustom, "Matrix_Projection");
        console.log(shaderAttributesTest.uMatrixProjection);
        //shaderProgramme.Matrix_Model_Uniform = gl.getUniformLocation(shaderProgramme, "Matrix_Model");
        shaderAttributesTest.uMatrixModel =  gl.getUniformLocation(shaderCustom, "Matrix_Model");
        
    }
    //console.log("shader.js");
    //console.log(shaderProgramme);
    //console.log(shaderCustom);
    //console.log(shaderAttributesTest);

    return shaderProgramme;

}

export {initShaderProgram};