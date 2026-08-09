import * as THREE from 'three';

// 1. High-Resolution Procedural Tumbled Leather Normal & Bump Map (1024x1024)
export function createLeatherTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Neutral 50% normal/height base
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);

  // Generate multi-octave organic Voronoi cellular wrinkles for genuine tumbled leather
  const numCells = 3600;
  const points = [];
  for (let i = 0; i < numCells; i++) {
    points.push({
      x: Math.random() * 1024,
      y: Math.random() * 1024,
      radius: 3.5 + Math.random() * 4.5,
      shade: 115 + Math.floor(Math.random() * 32)
    });
  }

  // Draw fine leather cells with creased borders
  for (let i = 0; i < numCells; i++) {
    const p = points[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${p.shade}, ${p.shade}, ${p.shade})`;
    ctx.fill();

    ctx.strokeStyle = 'rgba(60, 60, 60, 0.45)';
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }

  // Multi-frequency micro-grain noise for authentic pores
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// 2. High-Density Braided Shoelace Weave Normal Texture
export function createLaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // 45-degree diagonal criss-cross fabric weave
  ctx.strokeStyle = 'rgba(40, 40, 40, 0.6)';
  ctx.lineWidth = 3;
  for (let d = -256; d < 512; d += 8) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + 256, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(d + 256, 0);
    ctx.lineTo(d, 256);
    ctx.stroke();
  }

  // Micro highlight cords
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
  ctx.lineWidth = 1.5;
  for (let d = -256; d < 512; d += 8) {
    ctx.beginPath();
    ctx.moveTo(d + 2, 0);
    ctx.lineTo(d + 258, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// 3. Precision Laser-Cut Perforated Toe Box Ventilation Pattern
export function createPerforatedToeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 1024);

  const cx = 512;
  const cy = 512;
  const rows = 9;
  
  for (let r = 1; r <= rows; r++) {
    const count = r * 6;
    const radius = r * 48;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const hx = cx + Math.cos(angle) * radius;
      const hy = cy + Math.sin(angle) * (radius * 0.82);

      if (hy > 180 && hy < 860 && hx > 160 && hx < 864) {
        // Outer beveled ring shadow
        ctx.beginPath();
        ctx.arc(hx, hy, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#666666';
        ctx.fill();

        // Inner laser-cut airflow cavity
        ctx.beginPath();
        ctx.arc(hx, hy, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#111111';
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  return texture;
}

// 4. High-Tech 2x2 Twill Carbon Fiber Weave Texture
export function createCarbonFiberTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#18181a';
  ctx.fillRect(0, 0, 256, 256);

  const size = 16;
  for (let y = 0; y < 256; y += size) {
    for (let x = 0; x < 256; x += size) {
      const isAlt = ((x / size) + (y / size)) % 2 === 0;
      
      const grad = ctx.createLinearGradient(x, y, x + size, y + size);
      if (isAlt) {
        grad.addColorStop(0, '#36363c');
        grad.addColorStop(0.5, '#585864');
        grad.addColorStop(1, '#222226');
      } else {
        grad.addColorStop(0, '#141416');
        grad.addColorStop(0.5, '#3a3a42');
        grad.addColorStop(1, '#101012');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, size, size);

      // Fine carbon thread micro-lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1;
      for (let k = 0; k < size; k += 4) {
        ctx.beginPath();
        ctx.moveTo(x + k, y);
        ctx.lineTo(x + k, y + size);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return texture;
}

// 5. Basketball Rubber Outsole Pivot Tread & Herringbone Texture
export function createRubberOutsoleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);

  // Concentric forefoot pivot circle grooves
  const px = 360;
  const py = 320;
  for (let r = 20; r < 400; r += 26) {
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, r - 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // Heel waffle traction blocks
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#383838';
  for (let y = 600; y < 1000; y += 36) {
    ctx.beginPath();
    ctx.moveTo(160, y);
    ctx.lineTo(864, y);
    ctx.stroke();
  }
  for (let x = 160; x < 880; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 2.5);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// 6. High-End Studio HDR Environment Reflection Map
export function createStudioEnvMap(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x241d18);

  const keyCardGeo = new THREE.PlaneGeometry(12, 12);
  const keyCardMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  
  // Overhead Softbox
  const topLight = new THREE.Mesh(keyCardGeo, keyCardMat);
  topLight.position.set(0, 14, 0);
  topLight.rotation.x = Math.PI / 2;
  scene.add(topLight);

  // Front-Left Key Softbox
  const keyLight = new THREE.Mesh(keyCardGeo, keyCardMat);
  keyLight.position.set(-9, 7, 9);
  keyLight.lookAt(0, 0, 0);
  scene.add(keyLight);

  // Fill Right Warm Softbox
  const fillMat = new THREE.MeshBasicMaterial({ color: 0xf5ecd7, side: THREE.DoubleSide });
  const fillLight = new THREE.Mesh(keyCardGeo, fillMat);
  fillLight.position.set(9, 6, 7);
  fillLight.lookAt(0, 0, 0);
  scene.add(fillLight);

  // Back Rim Light Card
  const rimLight = new THREE.Mesh(keyCardGeo, keyCardMat);
  rimLight.position.set(0, 5, -10);
  rimLight.lookAt(0, 0, 0);
  scene.add(rimLight);

  const renderTarget = pmremGenerator.fromScene(scene, 0.04);
  return renderTarget.texture;
}
