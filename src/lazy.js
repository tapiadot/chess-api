const isIntersecting = (entry) => {
  return entry.isIntersecting;
};

const loadImage = (entry) => {
  const container = entry.target;
  const image = container.querySelector("img");
  const url = image.dataset.src;
  const alt = image.dataset.alt;
  // load
  image.src = url;
  image.alt = alt;
  // un-listen
  observer.unobserve(container);
};

const observer = new IntersectionObserver((entries) => {
  entries.filter(isIntersecting).forEach(loadImage);
});

export const registerImage = (image) => {
  observer.observe(image);
};
