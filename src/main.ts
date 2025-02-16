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
  });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const quadGeometry = new Geometry({
    attributes: {
      aPosition: [
        -100,
        -100, // x, y
        100,
        -100, // x, y
        100,
        100, // x, y,
        -100,
        100, // x, y,
      ],
      aUV: [0, 0, 1, 0, 1, 1, 0, 1],
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
  });

  const shader = Shader.from({
    gl: {
      vertex,
      fragment,
    },
    resources: {
      uTexture: (
        await Assets.load({
          src: "https://i.scdn.co/image/ab67616d0000b27308da36b621d12bb2087cf56c",
          loadParser: "loadTextures",
        })
      ).source,
    },
  });

  const quad = new Mesh({
    geometry: quadGeometry,
    shader,
  });

  quad.position.set(400, 300);

  app.stage.addChild(quad);
})();
