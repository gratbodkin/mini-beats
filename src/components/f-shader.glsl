// #extension GL_OES_standard_derivatives : enable

varying vec3 vPosition;
varying vec2 vUv;
uniform vec3 color;
varying vec3 vNormal;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() 
{
    float vNormPosition = abs(vPosition.z) * vUv.x;
    gl_FragColor = vec4( vec3(vUv.x, 1.0 - vUv.y,  vNormPosition), 0.5 );

}

