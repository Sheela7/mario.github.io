export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    //activating image download
    image.src = url;
  });
}

export function loadJSON(url) {
  return fetch(url).then((r) => r.json());
}
