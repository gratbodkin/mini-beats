// #extension GL_OES_standard_derivatives : enable

attribute float amplitude;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vUv = uv;
    vPosition = position;
    vPosition.y = amplitude * 100.0;
    vNormal = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

    // void main() {
    //     gl_Position = vec4( position, 1.0 );
    // }

