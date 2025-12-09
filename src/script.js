import Three from './three';

document.addEventListener('DOMContentLoaded', () => {});

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas');

  if (canvas) {
    const THREE = new Three(document.querySelector('#canvas'));
    window.addEventListener('resize', () => {
        THREE.resize();
    });
  }
});