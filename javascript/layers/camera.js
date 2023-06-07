export function createCameraLayer(cameraToDraw) {
  return function drawCameraRect(context, fromCamera) {
    // context.strokeStyle = 'purple';
    context.strokeStyle = "rgba(0,0,0,0)";
    context.beginPath();
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}
