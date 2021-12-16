document.addEventListener("DOMContentLoaded", function () {
  var elems = document.getElementsByTagName("img");

  for (let i = elems.length - 1; i >= 0; i--) {
    const elem = elems[i];
    elem.style.top = elem.offsetTop + "px";
    elem.style.left = elem.offsetLeft + "px";
    elem.style.position = "absolute";
    elem.onmousedown = imgMouseDown;
    elem.onmouseup = imgMouseUp;
  }

  let pict;
  let dounShiftCoordX, dounShiftCoordY;

  function imgMouseDown(e) {
    e.preventDefault();

    dounShiftCoordX = e.pageX - e.target.offsetLeft;
    dounShiftCoordY = e.pageY - e.target.offsetTop;

    pict = e.target;
    pict.onmousemove = imgMouseMove;
  }

  function imgMouseMove(e) {
    e.preventDefault();

    pict.style.top = e.pageY - dounShiftCoordY + "px";
    pict.style.left = e.pageX - dounShiftCoordX + "px";
    pict.style.zIndex = 1000;
    pict.style.cursor = "pointer";
  }

  function imgMouseUp(e) {
    e.preventDefault();

    pict.style.zIndex = 0;
    pict.style.cursor = "default";
    pict.onmousemove = null;
  }
});
