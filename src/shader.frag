in vec2 vUV;

uniform highp float uTime;
uniform sampler2D uTexture;

#include "snoise.frag"

float NOISE_SCALE = 15.0;
float IMAGE_BORDER = 0.1;
float NOISE_BORDER = 0.2;
float DISTORT_SCALE = 5.0;
float DISTORT_STRENGTH = 0.003;

float mirror(float a) {
    if (a < 1.0) return abs(a);
    return 2.0 - a;
}

float blurryBox(float a) {
    if (a > NOISE_BORDER && a < 1.0 - NOISE_BORDER) return 1.0;
    return smoothstep(0.0, NOISE_BORDER, a) * smoothstep(0.0, NOISE_BORDER, 1.0 - a);
}

float remapSnoise(vec2 pos, float freq, float amp) {
    return amp * (snoise(vec3(pos * freq, uTime)) * 0.5 + 0.5);
}

void main() {
    float noiseVal =
        (remapSnoise(vUV, NOISE_SCALE, 1.0) +
        remapSnoise(vUV, NOISE_SCALE * 2.0, 0.5) +
        remapSnoise(vUV, NOISE_SCALE * 4.0, 0.25)) / 1.75;

    vec4 noiseColor = vec4(noiseVal);

    // mask noise
    vec4 mask = vec4(blurryBox(vUV.x) * blurryBox(vUV.y));
    vec4 influencedNoise = noiseColor * (1.0 - mask);
    vec4 finalMask = mask - influencedNoise;

    float distort = snoise(vec3(vUV * DISTORT_SCALE, uTime)) * DISTORT_STRENGTH;

    // sample image
    float imgWidth = 1.0 - IMAGE_BORDER * 2.0;
    float imgZoom = 1.0 / imgWidth;
    vec2 samplePt = imgZoom * (vUV - vec2(IMAGE_BORDER)) + vec2(distort);
    vec4 texel = texture2D(uTexture, vec2(mirror(samplePt.x), mirror(samplePt.y)));

    gl_FragColor = texel * finalMask;
}