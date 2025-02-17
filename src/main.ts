import { Application, Assets, Geometry, Mesh, Shader } from "pixi.js";
import fragment from "./shader.frag";
import vertex from "./shader.vert";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    resizeTo: window,
    preference: "webgl",
    background: "#222222",
  });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const quadGeometry = new Geometry({
    attributes: {
      aPosition: [
        -200,
        -200, // x, y
        200,
        -200, // x, y
        200,
        200, // x, y,
        -200,
        200, // x, y,
      ],
      aUV: [0, 0, 1, 0, 1, 1, 0, 1],
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
  });

  const oklou =
    "https://i.scdn.co/image/ab67616d0000b27308da36b621d12bb2087cf56c";
  const sza =
    "https://i.scdn.co/image/ab67616d0000b2737f5a318e3ff35defa8d0e4af";
  const woozy =
    "https://i.scdn.co/image/ab67616d0000b27338e2ac6ca22c8d1f4d781137";

  const art = await Assets.load({
    src: woozy,
    loadParser: "loadTextures",
  });

  const shader = Shader.from({
    gl: {
      vertex,
      fragment,
    },
    resources: {
      uTexture: art.source,
      timeUniforms: {
        uTime: { value: 0.0, type: "f32" },
      },
    },
  });

  const quad = new Mesh({
    geometry: quadGeometry,
    shader,
  });

  quad.position.set(400, 300);

  app.stage.addChild(quad);

  app.ticker.add(({ deltaTime }) => {
    shader.resources.timeUniforms.uniforms.uTime += 0.01 * deltaTime;
  });
})();
