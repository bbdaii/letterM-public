import Three from './three';

// Custom cursor
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('DOMContentLoaded', () => { });

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas');

  if (canvas) {
    const THREE = new Three(document.querySelector('#canvas'));
    window.THREE = THREE;
    window.addEventListener('resize', () => {
      THREE.resize();
    });
  }
});


window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

