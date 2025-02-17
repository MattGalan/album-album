in vec2 aPosition;
in vec2 aUV;

out vec2 vUV;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;
uniform float uTime;

#include "snoise.frag"

float WOBBLE_STRENGTH = 8.0;
float WOBBLE_SPEED = 0.5;

void main() {
    vec2 wobble = vec2(
        snoise(vec3(aPosition, uTime * WOBBLE_SPEED)),
        snoise(vec3(aPosition + 50.0, uTime * WOBBLE_SPEED))) * WOBBLE_STRENGTH;

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition + wobble, 1.0)).xy, 0.0, 1.0);
    vUV = aUV;
}