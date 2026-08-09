import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import {
  createLeatherTexture,
  createLaceTexture,
  createPerforatedToeTexture,
  createCarbonFiberTexture,
  createRubberOutsoleTexture,
  createStudioEnvMap
} from '../utils/textures';
import { playClickSound, playSwitchSound, playExplodeSound } from '../utils/audio';

export default function HeroStage({
  activeProduct,
  isPackaged,
  onSelectProduct,
  viewAngle = 'hero',
  isExploded = false,
  isAutoRotate = false,
  lightMode = 'studio',
  activeHotspot,
  setActiveHotspot
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  
  // References for shoes and categorized layer mesh groups
  const shoesRefs = useRef([]); 
  const currentShoeGroupRef = useRef(null);
  const holoGroupRef = useRef(null);
  const rotatingRingsRef = useRef([]);
  
  // Dragging & Orbit Interaction Refs
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const activeRotationRef = useRef({ x: 0.12, y: -0.55 });
  const targetRotationRef = useRef({ x: 0.12, y: -0.55 });

  // Packaging Box Refs
  const boxGroupRef = useRef(null);
  const boxLidRef = useRef(null);

  // Hotspots Screen Projection Refs
  const hotspotElementsRef = useRef({});
  const svgPathRef = useRef(null);
  const infoCardRef = useRef(null);

  // Lighting References
  const lightsRef = useRef({});

  // Product configurations mapping
  const productIndices = {
    'aero-01': 0,
    'quantum-mocha': 1,
    'ignite-solar': 2,
    'stratos-unc': 3,
    'apex-emerald': 4,
    'phantom-stealth': 5,
    'terra-dune': 6,
    'cyber-2099': 7
  };

  const activeProductRef = useRef(activeProduct);
  const onSelectProductRef = useRef(onSelectProduct);
  const activeHotspotRef = useRef(activeHotspot);
  const isExplodedRef = useRef(isExploded);
  const isAutoRotateRef = useRef(isAutoRotate);
  const viewAngleRef = useRef(viewAngle);

  useEffect(() => {
    activeProductRef.current = activeProduct;
  }, [activeProduct]);

  useEffect(() => {
    onSelectProductRef.current = onSelectProduct;
  }, [onSelectProduct]);

  useEffect(() => {
    activeHotspotRef.current = activeHotspot;
    if (!activeHotspot && svgPathRef.current) {
      svgPathRef.current.setAttribute('d', '');
    }
  }, [activeHotspot]);

  useEffect(() => {
    isExplodedRef.current = isExploded;
    animateExplodedView(isExploded);
  }, [isExploded]);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    viewAngleRef.current = viewAngle;
    animateViewAngle(viewAngle);
  }, [viewAngle]);

  useEffect(() => {
    updateLightingMode(lightMode);
  }, [lightMode]);

  // 8 Precision Hotspots Anchored directly to 3D Shoe Geometry
  const HOTSPOTS_DEF = [
    { id: 'toe', title: 'Perforated Toe Box', localPos: new THREE.Vector3(0.0, 0.06, 0.72), label: '01 // AIRFLOW' },
    { id: 'mudguard', title: 'Reinforced Mudguard', localPos: new THREE.Vector3(0.35, -0.06, 0.58), label: '02 // SHIELD' },
    { id: 'laces', title: 'Tensile Nylon Lacing', localPos: new THREE.Vector3(0.0, 0.32, 0.22), label: '03 // LOCKDOWN' },
    { id: 'tongue', title: 'Padded Mesh Tongue', localPos: new THREE.Vector3(0.0, 0.52, -0.02), label: '04 // INSTEP' },
    { id: 'swoosh', title: 'Precision Leather Swoosh', localPos: new THREE.Vector3(0.48, 0.14, -0.22), label: '05 // LATERAL' },
    { id: 'midsole', title: 'Encapsulated Air-Sole', localPos: new THREE.Vector3(-0.42, -0.16, -0.22), label: '06 // NITROGEN' },
    { id: 'outsole', title: 'Pivot Waffle Outsole', localPos: new THREE.Vector3(0.0, -0.28, 0.32), label: '07 // TRACTION' },
    { id: 'heel', title: 'Molded TPU Heel Counter', localPos: new THREE.Vector3(0.0, 0.28, -0.74), label: '08 // HEEL CRADLE' }
  ];

  // Camera preset view transitions
  const animateViewAngle = (angle) => {
    if (!cameraRef.current || isPackaged) return;

    let targetRot = { x: 0.12, y: -0.55 };
    let camPos = { x: 0, y: 0.25, z: 3.8 };

    switch (angle) {
      case 'hero':
        targetRot = { x: 0.12, y: -0.55 };
        camPos = { x: 0, y: 0.25, z: 3.8 };
        break;
      case 'side':
        targetRot = { x: 0.02, y: -Math.PI / 2 };
        camPos = { x: 0, y: 0.1, z: 3.6 };
        break;
      case 'top':
        targetRot = { x: 1.35, y: 0 };
        camPos = { x: 0, y: 0.9, z: 3.2 };
        break;
      case 'sole':
        targetRot = { x: -1.35, y: Math.PI };
        camPos = { x: 0, y: -0.6, z: 3.4 };
        break;
      case 'heel':
        targetRot = { x: 0.15, y: Math.PI - 0.25 };
        camPos = { x: 0, y: 0.25, z: 3.6 };
        break;
      default:
        break;
    }

    gsap.to(targetRotationRef.current, {
      x: targetRot.x,
      y: targetRot.y,
      duration: 1.0,
      ease: 'power3.out'
    });

    gsap.to(cameraRef.current.position, {
      x: camPos.x,
      y: camPos.y,
      z: camPos.z,
      duration: 1.0,
      ease: 'power3.out'
    });
  };

  // Apple-Grade Pure Vertical Column Exploded View Animation with Perfect Architectural Spacing
  // All components are aligned in a straight vertical column (x: 0, z: 0) strictly ABOVE the base circle (STAGE_BASE_Y = -0.45)
  // Generous, uniform 0.30 unit vertical separation between each layer for zero overlap and pristine CAD clarity
  const animateExplodedView = (exploded) => {
    const activeIdx = productIndices[activeProductRef.current.id] ?? 0;
    const currentShoe = shoesRefs.current[activeIdx];
    if (!currentShoe || !currentShoe.layerGroups) return;

    playExplodeSound();

    const lg = currentShoe.layerGroups;
    const duration = 0.95;
    const ease = exploded ? 'back.out(1.35)' : 'power3.inOut';

    if (exploded) {
      // 1. Center camera to frame the full vertical column stack
      gsap.to(targetRotationRef.current, {
        x: 0.14,
        y: -0.65,
        duration: 1.0,
        ease: 'power3.out'
      });

      if (cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: 0,
          y: 0.85,
          z: 5.4,
          duration: 1.0,
          ease: 'power3.out'
        });
      }

      // 2. Strict, generous, equidistant vertical hierarchy (All x: 0, z: 0)
      // Level 1: Outsole (y = -0.15, floats cleanly above STAGE_BASE_Y = -0.45)
      lg.outsole.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: -0.15, z: 0, duration, ease });
      });

      // Level 2: Midsole EVA stack (y = +0.16)
      lg.midsole.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 0.16, z: 0, duration, ease });
      });

      // Level 3: Precision Swoosh Overlays (y = +0.46)
      lg.swooshLateral.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 0.46, z: 0, duration, ease });
      });
      lg.swooshMedial.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 0.46, z: 0, duration, ease });
      });

      // Level 4: Quarter Upper Body Chassis (y = +0.76)
      lg.body.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 0.76, z: 0, duration, ease });
      });

      // Level 5: Perforated Toe Box Vamp (y = +1.06)
      lg.toe.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 1.06, z: 0, duration, ease });
      });

      // Level 6: Molded TPU Heel Counter & Achilles Collar (y = +1.36)
      lg.heel.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 1.36, z: 0, duration, ease });
      });

      // Level 7: Anodized Eyestays & Tongue Lining (y = +1.66)
      lg.eyestays.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 1.66, z: 0, duration, ease });
      });

      // Level 8: High-Density Braided Laces (y = +1.96)
      lg.laces.forEach(mesh => {
        gsap.to(mesh.position, { x: 0, y: 1.96, z: 0, duration, ease });
      });
    } else {
      // Reassemble all parts back to their ORIGINAL positions (stored in userData._origPos)
      Object.values(lg).forEach(meshArray => {
        meshArray.forEach(mesh => {
          const orig = mesh.userData._origPos || { x: 0, y: 0, z: 0 };
          gsap.to(mesh.position, {
            x: orig.x,
            y: orig.y,
            z: orig.z,
            duration: 0.75,
            ease: 'power3.inOut'
          });
        });
      });

      // Return camera to default hero perspective
      if (cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: 0,
          y: 0.25,
          z: 3.8,
          duration: 0.85,
          ease: 'power3.out'
        });
      }

      gsap.to(targetRotationRef.current, {
        x: 0.12,
        y: -0.55,
        duration: 0.85,
        ease: 'power3.out'
      });
    }
  };

  // Lighting Mode update
  const updateLightingMode = (mode) => {
    if (!sceneRef.current || !lightsRef.current.key) return;

    const { ambient, key, fill, rim, topSpot, cyberCyan, cyberPink } = lightsRef.current;

    if (mode === 'cyberpunk') {
      gsap.to(ambient, { intensity: 0.75, duration: 0.6 });
      gsap.to(key, { intensity: 2.2, duration: 0.6 });
      key.color.set(0x00f0ff);
      fill.color.set(0x220066);
      rim.color.set(0xff0077);
      if (topSpot) gsap.to(topSpot, { intensity: 2.5, duration: 0.6 });
      if (cyberCyan) gsap.to(cyberCyan, { intensity: 5.5, duration: 0.6 });
      if (cyberPink) gsap.to(cyberPink, { intensity: 5.5, duration: 0.6 });
    } else if (mode === 'noir') {
      gsap.to(ambient, { intensity: 0.45, duration: 0.6 });
      gsap.to(key, { intensity: 3.8, duration: 0.6 });
      key.color.set(0xffffff);
      fill.color.set(0x888899);
      rim.color.set(0xaaaaaa);
      if (topSpot) gsap.to(topSpot, { intensity: 3.0, duration: 0.6 });
      if (cyberCyan) gsap.to(cyberCyan, { intensity: 0, duration: 0.6 });
      if (cyberPink) gsap.to(cyberPink, { intensity: 0, duration: 0.6 });
    } else {
      // Warm Studio Brown Mode
      gsap.to(ambient, { intensity: 1.15, duration: 0.6 });
      gsap.to(key, { intensity: 3.2, duration: 0.6 });
      key.color.set(0xfff8f2);
      fill.color.set(0xf0f4ff);
      rim.color.set(0xffffff);
      if (topSpot) gsap.to(topSpot, { intensity: 2.4, duration: 0.6 });
      if (cyberCyan) gsap.to(cyberCyan, { intensity: 0, duration: 0.6 });
      if (cyberPink) gsap.to(cyberPink, { intensity: 0, duration: 0.6 });
    }
  };

  // Main Canvas & ThreeJS Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Scene with warm brownish studio clear background
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Centered on the shoe with Apple-style framing
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 3.8);
    camera.lookAt(0, -0.05, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with Full sRGB Color Accuracy & ACES Film Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Map for Specular Gleams
    const envMap = createStudioEnvMap(renderer);
    scene.environment = envMap;

    // 5. Studio 4-Point High-Fidelity Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f2, 3.2);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0f4ff, 1.6);
    fillLight.position.set(-6, 3, 3);
    scene.add(fillLight);

    const topSpotLight = new THREE.DirectionalLight(0xffffff, 2.4);
    topSpotLight.position.set(0, 8, 2);
    scene.add(topSpotLight);

    const rimLight = new THREE.PointLight(0xffffff, 3.0, 15);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const cyberCyanLight = new THREE.PointLight(0x00f0ff, 0, 10);
    cyberCyanLight.position.set(-4, 2, 2);
    scene.add(cyberCyanLight);

    const cyberPinkLight = new THREE.PointLight(0xff0077, 0, 10);
    cyberPinkLight.position.set(4, 2, 2);
    scene.add(cyberPinkLight);

    lightsRef.current = {
      ambient: ambientLight,
      key: keyLight,
      fill: fillLight,
      topSpot: topSpotLight,
      rim: rimLight,
      cyberCyan: cyberCyanLight,
      cyberPink: cyberPinkLight
    };

    // 6. ENHANCED HOLOGRAPHIC STAGE BASE (y = -0.45)
    const STAGE_BASE_Y = -0.45;
    const holoGroup = new THREE.Group();
    holoGroup.position.set(0, STAGE_BASE_Y, 0);
    scene.add(holoGroup);
    holoGroupRef.current = holoGroup;

    // Ring 1: Outer glowing holographic accent ring
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.55
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.014, 16, 80), ringMat1);
    ring1.rotation.x = Math.PI / 2;
    holoGroup.add(ring1);

    // Ring 2: Segmented Cyber Ticks ring (counter-rotating)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x3d2e22,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.02, 36, 1, true), ringMat2);
    holoGroup.add(ring2);

    // Ring 3: Fine Laser Core Ring
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.35
    });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.008, 16, 64), ringMat3);
    ring3.rotation.x = Math.PI / 2;
    holoGroup.add(ring3);

    // Ring 4: Inner Tech Ring
    const ringMat4 = new THREE.MeshBasicMaterial({
      color: 0x4a382c,
      transparent: true,
      opacity: 0.18
    });
    const ring4 = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.006, 16, 48), ringMat4);
    ring4.rotation.x = Math.PI / 2;
    holoGroup.add(ring4);

    // 4 Corner Laser Notch Markers on the circumference
    const notchGeo = new THREE.BoxGeometry(0.08, 0.01, 0.02);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.75 });
    for (let i = 0; i < 4; i++) {
      const notch = new THREE.Mesh(notchGeo, notchMat);
      const angle = (i * Math.PI) / 2;
      notch.position.set(Math.cos(angle) * 1.65, 0, Math.sin(angle) * 1.65);
      notch.rotation.y = -angle;
      holoGroup.add(notch);
    }

    rotatingRingsRef.current = [ring1, ring2, ring3];

    // Translucent Frosted Glass Halo Disc
    const haloDiscMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const haloDisc = new THREE.Mesh(new THREE.CircleGeometry(1.35, 64), haloDiscMat);
    haloDisc.rotation.x = -Math.PI / 2;
    haloDisc.position.y = 0.001;
    holoGroup.add(haloDisc);

    // 7. Ambient Micro Dust Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 55;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 8;
      pPositions[i + 1] = (Math.random() - 0.5) * 4;
      pPositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xf6efe6,
      transparent: true,
      opacity: 0.18
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Shoes Group
    const shoesGroup = new THREE.Group();
    scene.add(shoesGroup);
    currentShoeGroupRef.current = shoesGroup;

    // 9. 3D Packaging Acrylic Specimen Box
    const boxGroup = new THREE.Group();
    boxGroup.scale.set(0, 0, 0); 
    scene.add(boxGroup);
    boxGroupRef.current = boxGroup;

    const boxMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.95,
      thickness: 0.9,
      ior: 1.52,
      side: THREE.DoubleSide
    });

    const boxBodyGeo = new THREE.BoxGeometry(2.3, 1.15, 1.35);
    const boxBody = new THREE.Mesh(boxBodyGeo, boxMat);
    boxBody.position.y = 0.05;
    boxGroup.add(boxBody);

    const boxLidGeo = new THREE.BoxGeometry(2.34, 0.14, 1.39);
    const boxLid = new THREE.Mesh(boxLidGeo, boxMat);
    boxLid.position.y = 0.65;
    boxGroup.add(boxLid);
    boxLidRef.current = boxLid;

    // 10. Load GLB Model and Instantiate 8 Custom Shoe Editions with Full Exploded Layer Group Mapping
    const loader = new GLTFLoader();
    loader.load('/jordan.glb?v=jordan-low-v2', (gltf) => {
      const originalModel = gltf.scene;

      // Filter out stray outlier debug nodes
      const excludeNodes = ['stitches', 'air_max_logo_1', 'air_max_logo_2', 'camera', 'point', 'point001'];
      originalModel.traverse((child) => {
        const lowerName = child.name.toLowerCase();
        if (excludeNodes.some(ex => lowerName.includes(ex))) {
          child.visible = false;
        }
      });

      // High-Definition Multi-Channel Procedural Textures
      const leatherBump = createLeatherTexture();
      const laceBump = createLaceTexture();
      const perforatedToeBump = createPerforatedToeTexture();
      const carbonFiber = createCarbonFiberTexture();
      const rubberTread = createRubberOutsoleTexture();

      // 8 Authentic, Vibrant, Full-Spectrum Colorways with Zero Plain Plastic Components
      const shoeConfigs = [
        {
          id: 'aero-01',
          name: 'AERO 01 // PULSE RED',
          accent: 0xc8102e,
          body: 0x1c1c20,
          toe: 0xc8102e,
          swoosh: 0xdedede,
          sole: 0xb80c26,
          laces: 0x111111,
          lining: 0x18181a,
          midsole: 0xf5ecd7,
          isSuede: false,
          isPatent: false,
          isCarbon: false
        },
        {
          id: 'quantum-mocha',
          name: 'QUANTUM // REVERSE MOCHA',
          accent: 0x483221,
          body: 0xf2e7ce,
          toe: 0x483221,
          swoosh: 0xf8efe2,
          sole: 0x3d281a,
          laces: 0xf63e26,
          lining: 0x38261a,
          midsole: 0xe6d4b2,
          isSuede: true,
          isPatent: false,
          isCarbon: false
        },
        {
          id: 'ignite-solar',
          name: 'IGNITE // SOLAR ORANGE',
          accent: 0xff5900,
          body: 0x141418,
          toe: 0xff5900,
          swoosh: 0xff5900,
          sole: 0xf55000,
          laces: 0x111111,
          lining: 0x1a1a1c,
          midsole: 0x222228,
          isSuede: false,
          isPatent: true,
          isCarbon: false
        },
        {
          id: 'stratos-unc',
          name: 'STRATOS // SKY VELOCITY',
          accent: 0x469ce8,
          body: 0x121a28,
          toe: 0x469ce8,
          swoosh: 0x469ce8,
          sole: 0x3a8dd6,
          laces: 0x469ce8,
          lining: 0x0f1828,
          midsole: 0x182436,
          isSuede: false,
          isPatent: false,
          isCarbon: false
        },
        {
          id: 'apex-emerald',
          name: 'APEX // EMERALD MATRIX',
          accent: 0x0d7838,
          body: 0x141c16,
          toe: 0x0d7838,
          swoosh: 0x00e575,
          sole: 0x0a6830,
          laces: 0x0d7838,
          lining: 0x101812,
          midsole: 0x18261c,
          isSuede: false,
          isPatent: false,
          isCarbon: false
        },
        {
          id: 'phantom-stealth',
          name: 'PHANTOM // STEALTH OBSIDIAN',
          accent: 0x282830,
          body: 0x121215,
          toe: 0x1a1a20,
          swoosh: 0xff2840,
          sole: 0x161618,
          laces: 0x202024,
          lining: 0x0e0e10,
          midsole: 0x24242c,
          isSuede: false,
          isPatent: false,
          isCarbon: false
        },
        {
          id: 'terra-dune',
          name: 'TERRA // DUNE ECO',
          accent: 0x8e5734,
          body: 0xd4bfab,
          toe: 0x8e5734,
          swoosh: 0x5c361c,
          sole: 0xb87d46,
          laces: 0xf6ede0,
          lining: 0x6e4326,
          midsole: 0xe2d0b8,
          isSuede: true,
          isPatent: false,
          isCarbon: false
        },
        {
          id: 'cyber-2099',
          name: 'CYBER // NEON KINETIC 2099',
          accent: 0x00e5ff,
          body: 0x14141a,
          toe: 0xff0066,
          swoosh: 0xff0066,
          sole: 0x00d4ee,
          laces: 0x00e5ff,
          lining: 0xff0066,
          midsole: 0x251630,
          isSuede: false,
          isPatent: false,
          isCarbon: true
        }
      ];

      shoesRefs.current = shoeConfigs.map((config, index) => {
        const wrapper = new THREE.Group();
        const shoeClone = originalModel.clone();
        
        // Categorized layer groups for pure vertical column explosion
        const layerGroups = {
          outsole: [],
          midsole: [],
          laces: [],
          eyestays: [],
          swooshLateral: [],
          swooshMedial: [],
          heel: [],
          toe: [],
          body: []
        };

        shoeClone.traverse((child) => {
          const lowerName = child.name.toLowerCase();
          if (excludeNodes.some(ex => lowerName.includes(ex))) {
            child.visible = false;
            return;
          }

          if (child.isMesh && child.material) {
            child.material = child.material.clone();
            const matName = child.material.name.toLowerCase();
            const nodeName = child.name.toLowerCase();

            child.material.envMapIntensity = 1.45;

            // 1. Midsole Layer (High-density EVA resin cushion stack with calibrated color)
            if (matName.includes('middle sole') || matName.includes('midsole') || nodeName.includes('middle sole')) {
              child.material.color.set(config.midsole);
              child.material.roughness = 0.38;
              child.material.metalness = 0.01;
              layerGroups.midsole.push(child);
            } 
            // 2. Outsole Layer (High-traction colored rubber waffle tread)
            else if (matName.includes('bottum sole') || matName.includes('very_bottum') || nodeName.includes('bottum') || nodeName.includes('sole')) {
              child.material.color.set(config.sole);
              child.material.roughness = 0.52;
              child.material.metalness = 0.0;
              child.material.bumpMap = rubberTread;
              child.material.bumpScale = 0.032;
              layerGroups.outsole.push(child);
            } 
            // 3. Collar Lining / Inside Trim
            else if (matName.includes('bottumback.001') || matName.includes('lining')) {
              child.material.color.set(config.lining);
              child.material.roughness = 0.85;
              child.material.metalness = 0.0;
              layerGroups.heel.push(child);
            }
            // 4. Swoosh / Logos (Clearcoat shine & vibrant contrast)
            else if (matName.includes('sidedesign') || matName.includes('swoosh') || matName.includes('logo') || nodeName.includes('nikelogo')) {
              child.material.color.set(config.swoosh);
              if (config.isCarbon) {
                child.material.metalness = 0.85;
                child.material.roughness = 0.15;
                child.material.emissive.set(config.swoosh);
                child.material.emissiveIntensity = 0.55;
              } else if (config.isPatent) {
                child.material.roughness = 0.12;
                child.material.metalness = 0.1;
                child.material.clearcoat = 0.95;
                child.material.clearcoatRoughness = 0.06;
              } else {
                child.material.roughness = 0.22;
                child.material.metalness = 0.06;
                child.material.clearcoat = 0.65;
                child.material.clearcoatRoughness = 0.1;
              }

              if (nodeName.includes('1') || nodeName.includes('right') || layerGroups.swooshLateral.length === 0) {
                layerGroups.swooshLateral.push(child);
              } else {
                layerGroups.swooshMedial.push(child);
              }
            } 
            // 5. Shoelaces (High-density braided criss-cross weave)
            else if (matName.includes('upper.001') || matName.includes('laces') || nodeName.includes('laces')) {
              child.material.color.set(config.laces);
              child.material.roughness = 0.88;
              child.material.metalness = 0.0;
              child.material.bumpMap = laceBump;
              child.material.bumpScale = 0.035;
              layerGroups.laces.push(child);
            }
            // 6. Eyestays & Lace Loops / Tongue
            else if (nodeName.includes('plane') || nodeName.includes('ring') || nodeName.includes('hook') || nodeName.includes('tongue')) {
              child.material.color.set(config.accent);
              child.material.roughness = 0.42;
              child.material.clearcoat = 0.35;
              layerGroups.eyestays.push(child);
            }
            // 7. Heel Counter / Rear Wings / Achilles Collar
            else if (
              matName.includes('bottumback') || 
              matName.includes('brick') || 
              matName.includes('upper.002') ||
              nodeName.includes('back') ||
              nodeName.includes('flap')
            ) {
              child.material.color.set(config.accent);
              if (config.isSuede) {
                child.material.roughness = 0.94;
                child.material.metalness = 0.0;
                child.material.sheen = 0.9;
                child.material.sheenColor = new THREE.Color(config.accent);
                child.material.sheenRoughness = 0.45;
              } else if (config.isCarbon) {
                child.material.roughness = 0.22;
                child.material.metalness = 0.55;
                child.material.bumpMap = carbonFiber;
                child.material.bumpScale = 0.045;
                child.material.emissive.set(config.accent);
                child.material.emissiveIntensity = 0.35;
              } else if (config.isPatent) {
                child.material.roughness = 0.14;
                child.material.metalness = 0.08;
                child.material.clearcoat = 0.85;
                child.material.clearcoatRoughness = 0.08;
              } else {
                child.material.roughness = 0.34;
                child.material.metalness = 0.04;
                child.material.clearcoat = 0.45;
                child.material.bumpMap = leatherBump;
                child.material.bumpScale = 0.016;
              }
              layerGroups.heel.push(child);
            } 
            // 8. Toe Box Vamp (Laser-perforated airflow matrix with dedicated toe color)
            else if (nodeName.includes('front') || matName.includes('front')) {
              child.material.color.set(config.toe);
              if (config.isSuede) {
                child.material.roughness = 0.92;
                child.material.metalness = 0.0;
                child.material.sheen = 0.85;
                child.material.sheenColor = new THREE.Color(config.toe);
              } else if (config.isCarbon) {
                child.material.roughness = 0.25;
                child.material.metalness = 0.45;
                child.material.bumpMap = carbonFiber;
                child.material.bumpScale = 0.04;
              } else {
                child.material.roughness = 0.32;
                child.material.metalness = 0.04;
                child.material.clearcoat = 0.4;
                child.material.bumpMap = perforatedToeBump;
                child.material.bumpScale = 0.025;
              }
              layerGroups.toe.push(child);
            }
            // 9. Side Quarters / Upper Body Chassis (Full-grain tumbled leather with dedicated quarter color)
            else {
              child.material.color.set(config.body);
              if (config.isSuede) {
                child.material.roughness = 0.92;
                child.material.sheen = 0.85;
                child.material.sheenColor = new THREE.Color(config.body);
              } else if (config.isCarbon) {
                child.material.roughness = 0.25;
                child.material.metalness = 0.45;
                child.material.bumpMap = carbonFiber;
                child.material.bumpScale = 0.04;
              } else {
                child.material.roughness = 0.32;
                child.material.metalness = 0.04;
                child.material.clearcoat = 0.45;
                child.material.bumpMap = leatherBump;
                child.material.bumpScale = 0.016;
              }
              layerGroups.body.push(child);
            }
          }
        });

        // Store each mesh's original local position so we can restore it after exploded view
        Object.values(layerGroups).forEach(meshArray => {
          meshArray.forEach(mesh => {
            mesh.userData._origPos = {
              x: mesh.position.x,
              y: mesh.position.y,
              z: mesh.position.z
            };
          });
        });

        // Compute clean bounding box ONLY from visible shoe geometry
        const cleanBox = new THREE.Box3();
        shoeClone.traverse((child) => {
          if (child.isMesh && child.visible) {
            cleanBox.expandByObject(child);
          }
        });

        const center = cleanBox.getCenter(new THREE.Vector3());
        const size = cleanBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Scale sneaker to 1.95 units so it hovers squarely and heroically above the stage
        const scaleFactor = 1.95 / (maxDim || 1.0);
        shoeClone.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        // Calculate bottom vertex of scaled shoe
        const scaledMinY = cleanBox.min.y * scaleFactor;
        
        // Place the bottom of the shoe sole EXACTLY at y = STAGE_BASE_Y
        shoeClone.position.set(
          -center.x * scaleFactor,
          STAGE_BASE_Y - scaledMinY,
          -center.z * scaleFactor
        );

        // Attach dedicated 3D hotspot beacon anchors inside the shoe's local space
        HOTSPOTS_DEF.forEach(spot => {
          const anchorObj = new THREE.Object3D();
          anchorObj.position.copy(spot.localPos);
          anchorObj.name = `anchor_${spot.id}`;
          shoeClone.add(anchorObj);
        });

        wrapper.add(shoeClone);
        wrapper.position.set(0, 0, 0);

        shoesGroup.add(wrapper);
        return {
          id: config.id,
          mesh: wrapper,
          shoeClone: shoeClone,
          layerGroups: layerGroups,
          index: index
        };
      });

      // Switch to active shoe on load
      transitionActiveShoe(activeProductRef.current.id, false);

      // If initially exploded, trigger pure vertical column explosion
      if (isExplodedRef.current) {
        animateExplodedView(true);
      }
    });

    // 11. Animation Loop & Hotspots Projection
    let animationFrameId;
    let lastTime = performance.now();
    const tempV = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      const elapsedTime = now * 0.001;
      lastTime = now;

      // Subtle particle float
      particles.rotation.y = elapsedTime * 0.01;
      particles.rotation.x = elapsedTime * 0.003;

      // Subtle dynamic counter-rotation for holographic stage rings
      if (rotatingRingsRef.current[0]) rotatingRingsRef.current[0].rotation.z = elapsedTime * 0.15;
      if (rotatingRingsRef.current[1]) rotatingRingsRef.current[1].rotation.y = -elapsedTime * 0.25;
      if (rotatingRingsRef.current[2]) rotatingRingsRef.current[2].rotation.z = elapsedTime * 0.35;

      const activeIdx = productIndices[activeProductRef.current.id] ?? 0;
      const currentWidth = containerRef.current?.clientWidth || window.innerWidth;
      const currentHeight = containerRef.current?.clientHeight || window.innerHeight;

      // Auto-Rotate turntable mode
      if (isAutoRotateRef.current && !isDraggingRef.current && !activeHotspotRef.current) {
        targetRotationRef.current.y += delta * 0.45;
      }

      // Smooth inertia damping for shoe rotation
      activeRotationRef.current.x += (targetRotationRef.current.x - activeRotationRef.current.x) * 0.08;
      activeRotationRef.current.y += (targetRotationRef.current.y - activeRotationRef.current.y) * 0.08;

      // Rotate holographic stage rings in sync with shoe yaw
      if (holoGroupRef.current) {
        holoGroupRef.current.rotation.y = activeRotationRef.current.y;
      }

      shoesRefs.current.forEach((shoe, idx) => {
        const isActive = idx === activeIdx;

        if (isActive) {
          const currentHotspot = activeHotspotRef.current;
          
          shoe.mesh.rotation.x = activeRotationRef.current.x;
          shoe.mesh.rotation.y = activeRotationRef.current.y;
          shoe.mesh.rotation.z = 0;

          // Track and project 8 Hotspot 3D Anchors attached directly to the shoe
          const isBoxVisible = boxGroupRef.current && boxGroupRef.current.scale.x > 0.1;
          const isExplodedActive = isExplodedRef.current;

          HOTSPOTS_DEF.forEach((hotspot) => {
            const el = hotspotElementsRef.current[hotspot.id];
            if (!el) return;

            // In exploded view or packaged mode, hide beacon dots so the clean architectural column is pristine
            if (!isBoxVisible && !isExplodedActive && shoe.shoeClone) {
              const anchor = shoe.shoeClone.getObjectByName(`anchor_${hotspot.id}`);
              if (anchor) {
                anchor.getWorldPosition(tempV);
                tempV.project(camera);

                // Check if point is in front of camera
                if (tempV.z < 1) {
                  const screenX = (tempV.x * 0.5 + 0.5) * currentWidth;
                  const screenY = (tempV.y * -0.5 + 0.5) * currentHeight;

                  el.style.left = `${screenX}px`;
                  el.style.top = `${screenY}px`;
                  el.style.display = (!currentHotspot || currentHotspot === hotspot.id) ? 'flex' : 'none';

                  // Connect dynamic SVG bezier line to open card
                  if (currentHotspot === hotspot.id && svgPathRef.current && infoCardRef.current) {
                    const cardRect = infoCardRef.current.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    const startX = cardRect.left - containerRect.left;
                    const startY = cardRect.top + cardRect.height / 2 - containerRect.top;

                    const cp1X = startX - (startX - screenX) * 0.45;
                    const cp1Y = startY;
                    const cp2X = startX - (startX - screenX) * 0.55;
                    const cp2Y = screenY;

                    const pathD = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${screenX} ${screenY}`;
                    svgPathRef.current.setAttribute('d', pathD);
                  }
                } else {
                  el.style.display = 'none';
                }
              }
            } else {
              el.style.display = 'none';
            }
          });
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 12. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync state transitions when active product changes
  useEffect(() => {
    setActiveHotspot(null);
    transitionActiveShoe(activeProduct.id, true);
  }, [activeProduct]);

  // Watch isPackaged state changes (Acrylic Container)
  useEffect(() => {
    if (shoesRefs.current.length === 0 || !boxGroupRef.current || !boxLidRef.current) return;

    const activeIdx = productIndices[activeProduct.id] ?? 0;
    const activeShoe = shoesRefs.current[activeIdx]?.mesh;
    if (!activeShoe) return;

    if (isPackaged) {
      setActiveHotspot(null);

      // 1. Move active shoe inside box
      gsap.to(activeShoe.position, {
        x: 0,
        y: 0.05, 
        z: 0.4,
        duration: 0.85,
        ease: 'power3.inOut'
      });

      gsap.to(targetRotationRef.current, {
        x: 0.05,
        y: -0.4,
        duration: 0.85,
        ease: 'power3.inOut'
      });

      // 2. Scale up box
      boxGroupRef.current.position.set(0, 0.05, 0.4);
      gsap.to(boxGroupRef.current.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 0.85,
        ease: 'back.out(1.2)'
      });

      // 3. Close the lid
      gsap.to(boxLidRef.current.position, {
        y: 0.65, 
        duration: 0.95,
        delay: 0.2,
        ease: 'bounce.out' 
      });
    } else {
      // 1. Open the lid
      gsap.to(boxLidRef.current.position, {
        y: 1.2, 
        duration: 0.45,
        ease: 'power2.out'
      });

      // 2. Dissolve the box
      gsap.to(boxGroupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        delay: 0.15,
        ease: 'power3.inOut'
      });

      // 3. Ground shoe back firmly on stage
      gsap.to(activeShoe.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.85,
        delay: 0.15,
        ease: 'power3.out'
      });
    }
  }, [isPackaged, activeProduct]);

  // Clean, fluid 3D Carousel Transition for Shoe Switching
  const transitionActiveShoe = (productId, animate = true) => {
    if (shoesRefs.current.length === 0) return;

    const activeIdx = productIndices[productId] ?? 0;
    playSwitchSound();

    shoesRefs.current.forEach((shoe, idx) => {
      const isActive = idx === activeIdx;

      if (isActive) {
        shoe.mesh.visible = true;
        if (animate) {
          gsap.fromTo(shoe.mesh.scale, 
            { x: 0.6, y: 0.6, z: 0.6 },
            { x: 1.0, y: 1.0, z: 1.0, duration: 0.65, ease: 'back.out(1.4)' }
          );
        } else {
          shoe.mesh.scale.set(1.0, 1.0, 1.0);
        }
        shoe.mesh.position.set(0, 0, 0);

        // If currently in exploded mode, immediately apply vertical column explosion to new shoe
        if (isExplodedRef.current) {
          animateExplodedView(true);
        }
      } else {
        if (animate) {
          gsap.to(shoe.mesh.scale, {
            x: 0.01,
            y: 0.01,
            z: 0.01,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              if (idx !== (productIndices[activeProductRef.current.id] ?? 0)) {
                shoe.mesh.visible = false;
              }
            }
          });
        } else {
          shoe.mesh.visible = false;
          shoe.mesh.scale.set(0.01, 0.01, 0.01);
        }
      }
    });
  };

  // Hotspot Click & Camera Focus Transition
  const handleHotspotClick = (type) => {
    playClickSound();

    if (activeHotspot === type) {
      handleCloseHotspot();
      return;
    }
    
    setActiveHotspot(type);

    let rotX = 0.12;
    let rotY = -0.55;

    switch (type) {
      case 'toe':
        rotX = 0.55;
        rotY = -0.25;
        break;
      case 'mudguard':
        rotX = 0.3;
        rotY = -0.8;
        break;
      case 'laces':
        rotX = 0.65;
        rotY = -0.4;
        break;
      case 'tongue':
        rotX = 0.45;
        rotY = -0.15;
        break;
      case 'swoosh':
        rotX = 0.05;
        rotY = -Math.PI / 2;
        break;
      case 'midsole':
        rotX = 0.12;
        rotY = Math.PI / 2;
        break;
      case 'outsole':
        rotX = -1.15;
        rotY = Math.PI;
        break;
      case 'heel':
        rotX = 0.15;
        rotY = Math.PI - 0.3;
        break;
      default:
        break;
    }

    gsap.to(targetRotationRef.current, {
      x: rotX,
      y: rotY,
      duration: 0.9,
      ease: 'power3.out'
    });
  };

  const handleCloseHotspot = () => {
    setActiveHotspot(null);
    gsap.to(targetRotationRef.current, {
      x: 0.12,
      y: -0.55,
      duration: 0.85,
      ease: 'power3.out'
    });
  };

  // Fluid Mouse & Touch Dragging Orbit Rotation with Momentum
  const handleMouseDown = (e) => {
    if (activeHotspot || isPackaged) return;

    isDraggingRef.current = false;
    previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    
    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - previousMousePosRef.current.x;
      const deltaY = moveEvent.clientY - previousMousePosRef.current.y;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        isDraggingRef.current = true;
      }

      targetRotationRef.current.y += deltaX * 0.0075;
      targetRotationRef.current.x += deltaY * 0.0075;

      // Restrict pitch angle so shoe stays upright
      targetRotationRef.current.x = Math.max(-0.65, Math.min(0.85, targetRotationRef.current.x));

      previousMousePosRef.current = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      className="hero-stage-container"
      onMouseDown={handleMouseDown}
      style={{ cursor: (activeHotspot || isPackaged) ? 'default' : 'grab', width: '100%', height: '100%' }}
    >
      {/* 3D Canvas */}
      <div ref={containerRef} className="three-canvas-container" style={{ width: '100%', height: '100%' }}></div>
      
      {/* Dynamic 8 Holographic Feature Hotspot Triggers directly tracking shoe anchors */}
      {HOTSPOTS_DEF.map((spot) => (
        <button 
          key={spot.id}
          ref={(el) => (hotspotElementsRef.current[spot.id] = el)}
          className={`hotspot-trigger ${activeHotspot === spot.id ? 'hotspot-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleHotspotClick(spot.id);
          }}
          title={`Inspect ${spot.title}`}
        >
          <span className="hotspot-beacon-core"></span>
          <span className="hotspot-ring"></span>
          <span className="hotspot-pulse"></span>
          <span className="hotspot-label">{spot.label}</span>
        </button>
      ))}

      {/* SVG Connecting Overlay Line */}
      <svg className="hotspots-svg-overlay">
        <path 
          ref={svgPathRef} 
          className="hotspot-connector-path" 
          d="" 
          fill="none" 
          stroke="rgba(255, 85, 0, 0.75)" 
          strokeWidth="1.5" 
          strokeDasharray="4,4" 
        />
      </svg>

      {/* Glassmorphic Hotspot Information Card (Top Right) */}
      {activeHotspot && activeProduct?.features?.[activeHotspot] && (
        <div ref={infoCardRef} className="hotspot-info-card glass-panel fade-in">
          <button className="info-card-close" onClick={handleCloseHotspot}>×</button>
          
          <div className="info-card-header">
            <span className="info-card-num">{activeProduct.features[activeHotspot].number}</span>
            <span className="info-card-badge">// COMPONENT ARCHITECTURE</span>
          </div>
          
          <h3 className="info-card-title">{activeProduct.features[activeHotspot].title}</h3>
          
          <p className="info-card-text">
            {activeProduct.features[activeHotspot].text}
          </p>

          <div className="feature-metrics-grid">
            <div className="metric-item">
              <span className="metric-name">DURABILITY</span>
              <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${activeProduct.features[activeHotspot].durability || 92}%` }}></div>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-name">FLEXIBILITY</span>
              <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${activeProduct.features[activeHotspot].flexibility || 88}%` }}></div>
              </div>
            </div>
          </div>

          <div className="info-card-footer">
            <span className="spec-verified-tag">✓ APPLE LAB CERTIFIED</span>
            <button className="info-next-btn" onClick={() => {
              const allIds = HOTSPOTS_DEF.map(h => h.id);
              const curIdx = allIds.indexOf(activeHotspot);
              const nextId = allIds[(curIdx + 1) % allIds.length];
              handleHotspotClick(nextId);
            }}>
              NEXT PART →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
