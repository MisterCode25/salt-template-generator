import assert from "node:assert/strict";
import {
  annotationBounds,
  getContainedImageRect,
  getLimitedExportSize,
  imagePointToStagePoint,
  normalizeRectFromPoints,
  stagePointToImagePoint
} from "../src/utils/imageAnnotation.js";

{
  const rect = getContainedImageRect(4000, 2000, 1000, 1000);
  assert.equal(rect.width, 1000);
  assert.equal(rect.height, 500);
  assert.equal(rect.x, 0);
  assert.equal(rect.y, 250);
  assert.equal(rect.scale, 0.25);
}

{
  const rect = getContainedImageRect(1000, 2000, 1000, 500);
  assert.equal(rect.width, 250);
  assert.equal(rect.height, 500);
  assert.equal(rect.x, 375);
  assert.equal(rect.y, 0);
  assert.equal(rect.scale, 0.25);
}

{
  const imageRect = getContainedImageRect(4000, 2000, 1000, 1000);
  assert.deepEqual(stagePointToImagePoint({ x: 500, y: 500 }, imageRect), { x: 2000, y: 1000 });
  assert.equal(stagePointToImagePoint({ x: 500, y: 120 }, imageRect), null);
  assert.deepEqual(imagePointToStagePoint({ x: 2000, y: 1000 }, imageRect), { x: 500, y: 500 });
}

{
  const imageRect = {
    ...getContainedImageRect(400, 300, 800, 600),
    imageWidth: 1200,
    imageHeight: 900,
    sourceX: 300,
    sourceY: 200,
    sourceWidth: 400,
    sourceHeight: 300
  };
  assert.deepEqual(stagePointToImagePoint({ x: 400, y: 300 }, imageRect), { x: 500, y: 350 });
  assert.deepEqual(imagePointToStagePoint({ x: 500, y: 350 }, imageRect), { x: 400, y: 300 });
}

{
  assert.deepEqual(
    normalizeRectFromPoints({ x: 80, y: 50 }, { x: 10, y: 120 }),
    { x: 10, y: 50, width: 70, height: 70 }
  );
}

{
  assert.deepEqual(getLimitedExportSize(3200, 1800, 1600), {
    width: 1600,
    height: 900,
    scale: 0.5
  });
  assert.deepEqual(getLimitedExportSize(1200, 800, 1600), {
    width: 1200,
    height: 800,
    scale: 1
  });
}

{
  assert.deepEqual(annotationBounds({ type: "arrow", points: [90, 20, 10, 120] }), {
    x: 10,
    y: 20,
    width: 80,
    height: 100
  });
  assert.deepEqual(annotationBounds({ type: "arrow", points: [90, 20, 10, 120], control: { x: 130, y: 180 } }), {
    x: 10,
    y: 20,
    width: 120,
    height: 160
  });
  assert.deepEqual(annotationBounds({ type: "rect", x: 5, y: 6, width: -10, height: 12 }), {
    x: 5,
    y: 6,
    width: 10,
    height: 12
  });
}

console.log("imageAnnotation tests passed");
