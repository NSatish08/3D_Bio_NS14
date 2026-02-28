/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Trophy, Zap, GraduationCap, User } from 'lucide-react';

// --- DATA ---
const PROJECTS = [
  { title: "Anomaly System Analyser", desc: "Python full-stack platform monitoring Instagram user behavior for security threats.", tags: ["Python", "Cybersecurity"] },
  { title: "3D Portfolio World", desc: "Interactive Three.js environment with procedural terrain and car physics.", tags: ["Three.js", "React"] },
  { title: "Housing Market Trends", desc: "Data Science pipeline analyzing real estate via Python and Power BI.", tags: ["Data Science", "Power BI"] },
  { title: "South Indian Board Game", desc: "Digital conversion of traditional rules into algorithmic JS logic.", tags: ["JavaScript", "Algorithms"] },
  { title: "Health & Nutrition App", desc: "Comprehensive health tracker with personalized diet planning.", tags: ["Full Stack", "HealthTech"] },
  { title: "Credit Score Prediction", desc: "ML pipeline with optimized feature engineering and class balancing.", tags: ["Machine Learning", "Python"] },
  { title: "Tech Startup Web Hosting", desc: "Managed AWS EC2 instances for high-performance client-server models.", tags: ["AWS", "DevOps"] }
];

const SKILLS = ["Python", "Java", "JavaScript", "AWS", "MySQL", "React", "Next.js", "Tailwind", "Power BI", "Tableau", "Machine Learning", "Three.js"];

const SECTORS = [
  { id: 'bio', name: 'BIO VILLAGE', x: 300, z: 300, color: '#00f2ff', icon: <User className="w-6 h-6" /> },
  { id: 'skills', name: 'SKILLS CITY', x: -300, z: -300, color: '#00ff00', icon: <Zap className="w-6 h-6" /> },
  { id: 'projects', name: 'PROJECTS HUB', x: -300, z: 300, color: '#ff00ff', icon: <Trophy className="w-6 h-6" /> },
  { id: 'education', name: 'EDUCATION PEAK', x: 300, z: -300, color: '#ffff00', icon: <GraduationCap className="w-6 h-6" /> },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [carPos, setCarPos] = useState({ x: 0, z: 0 });
  const [showHotspot, setShowHotspot] = useState<{ title: string, content: string } | null>(null);
  const [npcMessage, setNpcMessage] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameInput, setGameInput] = useState("");
  const [gameFeedback, setGameFeedback] = useState("");

  const handleGameSubmit = () => {
    if (gameInput === "2026") {
      setGameScore(100);
      setGameComplete(true);
      setGameFeedback("Access Granted! Badge Awarded: Data Master");
    } else {
      setGameFeedback("Access Denied. Hint: The year Satish graduates.");
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);
    scene.fog = new THREE.Fog(0x020205, 100, 1500);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // --- AUDIO SYSTEM (Procedural Engine) ---
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const engineOsc = audioCtx.createOscillator();
    const engineGain = audioCtx.createGain();
    engineOsc.type = 'sawtooth';
    engineOsc.frequency.setValueAtTime(50, audioCtx.currentTime);
    engineGain.gain.setValueAtTime(0, audioCtx.currentTime);
    engineOsc.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOsc.start();

    const updateEngineSound = (vel: number) => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const freq = 50 + Math.abs(vel) * 100;
      const vol = Math.min(0.1, Math.abs(vel) * 0.05);
      engineOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
      engineGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.1);
    };
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(200, 500, 200);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -500;
    sun.shadow.camera.right = 500;
    sun.shadow.camera.top = 500;
    sun.shadow.camera.bottom = -500;
    scene.add(sun);

    // Add Point Lights for atmosphere
    const blueLight = new THREE.PointLight(0x00f2ff, 2, 200);
    blueLight.position.set(100, 50, 100);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xff00ff, 2, 200);
    pinkLight.position.set(-100, 50, -100);
    scene.add(pinkLight);

    // --- WORLD BUILDING ---
    // Realistic Ground (Flat Brown/Green Mix)
    const groundGeo = new THREE.PlaneGeometry(3000, 3000, 128, 128);
    const posAttr = groundGeo.attributes.position;
    const colors = [];
    const color = new THREE.Color();
    
    for (let i = 0; i < posAttr.count; i++) {
      // Flat ground
      posAttr.setZ(i, 0);

      // Color based on randomness
      const mix = Math.random();
      if (mix > 0.5) {
        color.setHex(0x228B22); // Green
      } else {
        color.setHex(0x3d2b1f); // Dark Brown
      }
      colors.push(color.r, color.g, color.b);
    }
    posAttr.needsUpdate = true;
    groundGeo.computeVertexNormals();
    groundGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const groundMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- LAKE ---
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0077be, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.5 });
    const lakeGeo = new THREE.CircleGeometry(400, 32);
    const lake = new THREE.Mesh(lakeGeo, waterMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(0, -1.5, -800);
    scene.add(lake);

    // --- 3D NAME TEXT (Billboard Style) ---
    const createNameText = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024; canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0, 0, 1024, 256);
      ctx.font = 'bold 140px "Space Grotesk"';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f2ff'; ctx.shadowBlur = 30;
      ctx.fillText('N SATISH KUMAR', 512, 160);
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(400, 100), mat);
      mesh.position.set(0, 250, 0); // Higher up
      return mesh;
    };
    scene.add(createNameText());

    // Tech Grid Overlay
    const grid = new THREE.GridHelper(3000, 100, 0x00f2ff, 0x111111);
    grid.position.y = 0.1;
    scene.add(grid);

    // Road Texture
    const createRoadTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, 64, 256);
      ctx.fillStyle = '#fff';
      ctx.fillRect(28, 50, 8, 156); // Dashed line
      return new THREE.CanvasTexture(canvas);
    };
    const roadTex = createRoadTexture();
    roadTex.wrapS = THREE.RepeatWrapping;
    roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(1, 10);

    // --- CENTRAL HUB: INDIA FLAG & BANNER ---
    const flagGroup = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 3, 100, 16),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 })
    );
    pole.position.y = 50;
    flagGroup.add(pole);

    // Banner on Left
    const bannerTex = new THREE.TextureLoader().load('https://tse2.mm.bing.net/th/id/OIP.XkWNuXJeF6l6PB8WpLK5XwHaEK?pid=Api&P=0&h=180');
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 45),
      new THREE.MeshStandardMaterial({ map: bannerTex, side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0.2 })
    );
    banner.position.set(-45, 70, 0);
    flagGroup.add(banner);

    // 3D Text on Right
    const flagTextCanvas = document.createElement('canvas');
    flagTextCanvas.width = 512; flagTextCanvas.height = 128;
    const ftCtx = flagTextCanvas.getContext('2d')!;
    ftCtx.font = 'bold 60px "Space Grotesk"';
    ftCtx.fillStyle = '#00f2ff';
    ftCtx.textAlign = 'center';
    ftCtx.fillText('N SATISH KUMAR', 256, 80);
    const ftTex = new THREE.CanvasTexture(flagTextCanvas);
    const ftMesh = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), new THREE.MeshBasicMaterial({ map: ftTex, transparent: true, side: THREE.DoubleSide }));
    ftMesh.position.set(50, 50, 0);
    flagGroup.add(ftMesh);

    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 512; flagCanvas.height = 340;
    const fCtx = flagCanvas.getContext('2d')!;
    fCtx.fillStyle = '#FF9933'; fCtx.fillRect(0, 0, 512, 113);
    fCtx.fillStyle = '#FFFFFF'; fCtx.fillRect(0, 113, 512, 113);
    fCtx.fillStyle = '#128807'; fCtx.fillRect(0, 226, 512, 114);
    fCtx.strokeStyle = '#000080'; fCtx.lineWidth = 4;
    fCtx.beginPath(); fCtx.arc(256, 170, 45, 0, Math.PI*2); fCtx.stroke();
    for(let i=0; i<24; i++) {
        fCtx.moveTo(256, 170);
        fCtx.lineTo(256 + Math.cos(i*Math.PI/12)*45, 170 + Math.sin(i*Math.PI/12)*45);
    }
    fCtx.stroke();

    const flagTex = new THREE.CanvasTexture(flagCanvas);
    const flagGeo = new THREE.PlaneGeometry(80, 50, 20, 20);
    const flagMat = new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0.1 });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(40, 85, 0);
    flagGroup.add(flagMesh);

    // Dedicated Lighting for Central Hub
    const hubLight = new THREE.PointLight(0xffffff, 20, 200);
    hubLight.position.set(0, 80, 50);
    flagGroup.add(hubLight);

    const hubLightBack = new THREE.PointLight(0xffffff, 20, 200);
    hubLightBack.position.set(0, 80, -50);
    flagGroup.add(hubLightBack);

    // Ground Spotlight for "Focus Zone"
    const groundSpot = new THREE.SpotLight(0xffffff, 50, 300, Math.PI/6, 0.3);
    groundSpot.position.set(0, 0, 100);
    groundSpot.target.position.set(0, 50, 0);
    scene.add(groundSpot);
    scene.add(groundSpot.target);

    scene.add(flagGroup);

    // --- THAR VEHICLE MODEL (REMODELED) ---
    const thar = new THREE.Group();
    
    // Chassis (Detailed) - Changed to Cyber Gold
    const body = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 16), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 }));
    body.position.y = 3;
    body.castShadow = true;
    thar.add(body);

    // Cabin with Roll Cage - Changed to Matte Black
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 8), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8 }));
    cabin.position.set(0, 6, -2);
    thar.add(cabin);

    const cageGeo = new THREE.TorusGeometry(4, 0.3, 8, 16, Math.PI);
    const cage = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    cage.position.set(0, 8, -2);
    cage.rotation.x = Math.PI / 2;
    thar.add(cage);

    // Spare Tire
    const spareTire = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1.5, 16), new THREE.MeshStandardMaterial({ color: 0x000000 }));
    spareTire.rotation.x = Math.PI / 2;
    spareTire.position.set(0, 5, -8.5);
    thar.add(spareTire);

    // Windows
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.4, emissive: 0x00f2ff, emissiveIntensity: 0.5 });
    const frontWind = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), windowMat);
    frontWind.position.set(0, 6, 2.1);
    thar.add(frontWind);

    // Wheels (Detailed Rims)
    const wheelGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const rimGeo = new THREE.CircleGeometry(1.5, 8);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1, roughness: 0.1 });

    const wheelPos = [[4.5, 2.5, 5], [-4.5, 2.5, 5], [4.5, 2.5, -5], [-4.5, 2.5, -5]];
    wheelPos.forEach(p => {
      const wGroup = new THREE.Group();
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      wGroup.add(w);
      const r = new THREE.Mesh(rimGeo, rimMat);
      r.position.x = p[0] > 0 ? 1.1 : -1.1;
      r.rotation.y = p[0] > 0 ? Math.PI / 2 : -Math.PI / 2;
      wGroup.add(r);
      wGroup.position.set(p[0], p[1], p[2]);
      thar.add(wGroup);
    });

    // Underglow
    const underglow = new THREE.PointLight(0x00f2ff, 5, 20);
    underglow.position.y = 1;
    thar.add(underglow);

    // Headlights
    const lightGeo = new THREE.CircleGeometry(0.8, 16);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftLight = new THREE.Mesh(lightGeo, lightMat);
    leftLight.position.set(-2.5, 3.5, 8.1);
    const rightLight = leftLight.clone();
    rightLight.position.set(2.5, 3.5, 8.1);
    thar.add(leftLight, rightLight);

    thar.position.set(50, 0, 50);
    scene.add(thar);

    // --- ENVIRONMENTAL PROPS ---
    const createTree = (x: number, z: number) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 10), new THREE.MeshStandardMaterial({ color: 0x4d2902 }));
      trunk.position.y = 5;
      tree.add(trunk);
      const leaves = new THREE.Mesh(new THREE.ConeGeometry(8, 20, 8), new THREE.MeshStandardMaterial({ color: 0x0a3d0a }));
      leaves.position.y = 15;
      tree.add(leaves);
      tree.position.set(x, 0, z);
      scene.add(tree);
    };

    const createStreetLight = (x: number, z: number) => {
      const light = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 25), new THREE.MeshStandardMaterial({ color: 0x333333 }));
      pole.position.y = 12.5;
      light.add(pole);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({ color: 0xffffaa }));
      lamp.position.y = 25;
      light.add(lamp);
      const spot = new THREE.SpotLight(0xffffaa, 10, 100, Math.PI/4, 0.5);
      spot.position.set(0, 25, 0);
      spot.target.position.set(0, 0, 0);
      light.add(spot);
      light.add(spot.target);
      light.position.set(x, 0, z);
      scene.add(light);
    };

    const createMangoTree = (x: number, z: number) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 12), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
      trunk.position.y = 6;
      tree.add(trunk);
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(10, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1a4d1a }));
      canopy.position.y = 18;
      tree.add(canopy);
      
      // Add Mangoes
      for(let i=0; i<12; i++) {
        const mango = new THREE.Mesh(new THREE.SphereGeometry(0.8), new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        mango.position.set(
          Math.sin(theta) * Math.cos(phi) * 9,
          18 + Math.sin(theta) * Math.sin(phi) * 9,
          Math.cos(theta) * 9
        );
        tree.add(mango);
      }
      tree.position.set(x, 0, z);
      scene.add(tree);
    };

    const createModernHouse = (x: number, z: number) => {
      const house = new THREE.Group();
      // Main block
      const base = new THREE.Mesh(new THREE.BoxGeometry(15, 12, 15), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      base.position.y = 6;
      house.add(base);
      // Glass windows
      const windowMat = new THREE.MeshStandardMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.4, metalness: 1 });
      const win = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), windowMat);
      win.position.set(0, 7, 7.6);
      house.add(win);
      // Flat roof with neon edge
      const roof = new THREE.Mesh(new THREE.BoxGeometry(16, 1, 16), new THREE.MeshStandardMaterial({ color: 0x333333 }));
      roof.position.y = 12.5;
      house.add(roof);
      const ring = new THREE.LineSegments(new THREE.EdgesGeometry(roof.geometry), new THREE.LineBasicMaterial({ color: 0x00f2ff }));
      ring.position.copy(roof.position);
      house.add(ring);
      
      house.position.set(x, 0, z);
      scene.add(house);
    };

    const createModernStreetLight = (x: number, z: number) => {
      const light = new THREE.Group();
      const poleGeo = new THREE.CylinderGeometry(0.3, 0.6, 30, 8);
      const pole = new THREE.Mesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1 }));
      pole.position.y = 15;
      light.add(pole);
      
      const arm = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      arm.position.set(4, 30, 0);
      light.add(arm);
      
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 2), new THREE.MeshBasicMaterial({ color: 0x00f2ff }));
      lamp.position.set(8, 30, 0);
      light.add(lamp);
      
      const spot = new THREE.SpotLight(0x00f2ff, 15, 120, Math.PI/3, 0.5);
      spot.position.set(8, 30, 0);
      spot.target.position.set(8, 0, 0);
      light.add(spot);
      light.add(spot.target);
      
      light.position.set(x, 0, z);
      scene.add(light);
    };

    const createTraditionalHouse = (x: number, z: number) => {
      const house = new THREE.Group();
      // Mud walls
      const walls = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 12), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
      walls.position.y = 4;
      house.add(walls);
      // Thatched roof
      const roof = new THREE.Mesh(new THREE.ConeGeometry(10, 8, 4), new THREE.MeshStandardMaterial({ color: 0xcd853f }));
      roof.position.y = 12;
      roof.rotation.y = Math.PI / 4;
      house.add(roof);
      // Wood door
      const door = new THREE.Mesh(new THREE.PlaneGeometry(3, 5), new THREE.MeshStandardMaterial({ color: 0x4d2902 }));
      door.position.set(0, 2.5, 6.1);
      house.add(door);
      
      house.position.set(x, 0, z);
      scene.add(house);
    };

    // Scatter props & houses
    for(let i=0; i<60; i++) {
      if(i % 2 === 0) createTree((Math.random()-0.5)*1500, (Math.random()-0.5)*1500);
      else createMangoTree((Math.random()-0.5)*1500, (Math.random()-0.5)*1500);
      
      if(i < 15) createModernHouse((Math.random()-0.5)*1200, (Math.random()-0.5)*1200);
      else if(i < 30) createTraditionalHouse((Math.random()-0.5)*1200, (Math.random()-0.5)*1200);
      
      if(i < 15) createStreetLight((Math.random()-0.5)*800, (Math.random()-0.5)*800);
      else if(i < 30) createModernStreetLight((Math.random()-0.5)*800, (Math.random()-0.5)*800);
    }

    // --- NPC: BIO VILLAGE GUIDE ---
    const npc = new THREE.Group();
    const npcBody = new THREE.Mesh(new THREE.CapsuleGeometry(2, 4, 4, 8), new THREE.MeshStandardMaterial({ color: 0xffae00 }));
    npcBody.position.y = 4;
    npc.add(npcBody);
    const npcHead = new THREE.Mesh(new THREE.SphereGeometry(1.5), new THREE.MeshStandardMaterial({ color: 0xffdbac }));
    npcHead.position.y = 7.5;
    npc.add(npcHead);
    npc.position.set(280, 0, 280);
    scene.add(npc);

    // --- HOTSPOTS ---
    const hotspots: THREE.Mesh[] = [];
    const createHotspot = (x: number, z: number, color: number, data: any) => {
      const geo = new THREE.IcosahedronGeometry(3, 0);
      const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 15, z);
      mesh.userData = data;
      scene.add(mesh);
      hotspots.push(mesh);
    };

    createHotspot(320, 320, 0x00f2ff, { title: "Bio Secret", content: "Satish loves exploring new tech stacks and off-roading in the weekends!" });
    createHotspot(-320, -320, 0x00ff00, { title: "Skill Master", content: "Satish has completed over 50+ projects in Python and Data Science." });

    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspots);
      if (intersects.length > 0) {
        setShowHotspot(intersects[0].object.userData as any);
      }
    };
    window.addEventListener('click', onMouseClick);
    const createSupplyDrop = (x: number, z: number) => {
      const drop = new THREE.Group();
      const crate = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: 0x8b0000 }));
      crate.position.y = 5;
      drop.add(crate);
      
      // Yellow Smoke (Particles)
      const smokeGeo = new THREE.BufferGeometry();
      const smokeCount = 50;
      const smokePos = new Float32Array(smokeCount * 3);
      for(let i=0; i<smokeCount; i++) {
        smokePos[i*3] = (Math.random()-0.5)*5;
        smokePos[i*3+1] = Math.random()*30;
        smokePos[i*3+2] = (Math.random()-0.5)*5;
      }
      smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
      const smokeMat = new THREE.PointsMaterial({ color: 0xffff00, size: 2, transparent: true, opacity: 0.6 });
      const smoke = new THREE.Points(smokeGeo, smokeMat);
      drop.add(smoke);

      drop.position.set(x, 0, z);
      scene.add(drop);
    };

    createSupplyDrop(150, -150);
    createSupplyDrop(-200, 100);

    // --- SECTORS ---
    SECTORS.forEach(s => {
      // Road to Sector
      const dist = Math.sqrt(s.x*s.x + s.z*s.z);
      const roadGeo = new THREE.PlaneGeometry(30, dist);
      const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, color: 0x444444 });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.position.set(s.x/2, 0.3, s.z/2);
      road.lookAt(s.x, 0.3, s.z);
      road.rotation.x = -Math.PI / 2;
      scene.add(road);

      // Sector Name Label
      const sCanvas = document.createElement('canvas');
      sCanvas.width = 512; sCanvas.height = 128;
      const sCtx = sCanvas.getContext('2d')!;
      sCtx.font = 'bold 80px "Space Grotesk"';
      sCtx.fillStyle = s.color;
      sCtx.textAlign = 'center';
      sCtx.fillText(s.name, 256, 80);
      const sTex = new THREE.CanvasTexture(sCanvas);
      const sLabel = new THREE.Mesh(new THREE.PlaneGeometry(60, 15), new THREE.MeshBasicMaterial({ map: sTex, transparent: true, side: THREE.DoubleSide }));
      sLabel.position.set(s.x, 60, s.z);
      scene.add(sLabel);

      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(40, 45, 2, 32), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      base.position.set(s.x, 0.5, s.z);
      scene.add(base);

      // Neon Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(42, 0.5, 16, 100), new THREE.MeshBasicMaterial({ color: s.color }));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(s.x, 1, s.z);
      scene.add(ring);

      // Buildings
      for(let i=0; i<5; i++) {
        const h = 20 + Math.random()*60;
        const b = new THREE.Mesh(new THREE.BoxGeometry(12, h, 12), new THREE.MeshStandardMaterial({ color: 0x050505 }));
        b.position.set(s.x + (Math.random()-0.5)*50, h/2, s.z + (Math.random()-0.5)*50);
        scene.add(b);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color: s.color }));
        edge.position.copy(b.position);
        scene.add(edge);
      }
    });

    // --- CONTROLS & ANIMATION ---
    const keys: { [key: string]: boolean } = {};
    window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

    let velocity = 0;
    let rotation = 0;
    const accel = 0.2;
    const friction = 0.95;

    const animate = () => {
      requestAnimationFrame(animate);

      // Thar Physics
      if (keys['w']) velocity += accel;
      if (keys['s']) velocity -= accel;
      if (keys['a']) rotation += 0.04;
      if (keys['d']) rotation -= 0.04;

      velocity *= friction;
      rotation *= 0.8;

      thar.rotateY(rotation);
      thar.translateZ(velocity);

      // Sound Update
      updateEngineSound(velocity);

      // Camera Follow
      const camOffset = new THREE.Vector3(0, 25, -50).applyQuaternion(thar.quaternion);
      camera.position.lerp(thar.position.clone().add(camOffset), 0.1);
      camera.lookAt(thar.position);

      // Flag Wave
      const pos = flagMesh.geometry.attributes.position;
      const time = Date.now() * 0.005;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        pos.setZ(i, Math.sin(x * 0.15 + time) * 3);
      }
      pos.needsUpdate = true;

      // Sector Detection
      let near: string | null = null;
      SECTORS.forEach(s => {
        const dist = thar.position.distanceTo(new THREE.Vector3(s.x, 0, s.z));
        if (dist < 80) near = s.id;
      });
      setActiveSector(near);
      setCarPos({ x: thar.position.x, z: thar.position.z });

      // NPC Interaction
      const distToNpc = thar.position.distanceTo(npc.position);
      if(distToNpc < 30) {
        setNpcMessage("Welcome to Bio Village, Commander Satish! Explore the sectors to learn more.");
      } else {
        setNpcMessage(null);
      }

      // Hotspot Animation
      hotspots.forEach(h => {
        h.rotation.y += 0.02;
        h.position.y = 15 + Math.sin(Date.now() * 0.002) * 2;
      });

      // 3D Text Animation
      const nameText = scene.children.find(c => c instanceof THREE.Mesh && c.geometry instanceof THREE.PlaneGeometry && c.position.y === 180);
      if (nameText) {
        nameText.rotation.y += 0.01;
        nameText.position.y = 180 + Math.sin(Date.now() * 0.002) * 5;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    setLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      engineOsc.stop();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen font-sans text-white overflow-hidden bg-black">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <h1 className="text-6xl font-display font-bold text-[#00f2ff] tracking-tighter mb-4">N SATISH KUMAR</h1>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00f2ff] animate-[shimmer_2s_infinite]" style={{ width: '60%' }} />
          </div>
          <p className="mt-4 text-white/50 font-mono text-sm uppercase tracking-widest">Initializing 3D World...</p>
        </div>
      )}

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex justify-end items-start">
          {/* Mini Map */}
          <div className="w-48 h-48 bg-black/80 backdrop-blur-xl border border-[#00f2ff]/30 rounded-2xl p-2 pointer-events-auto relative">
            <div className="w-full h-full relative border border-white/5 rounded-lg overflow-hidden">
              {/* Lake on Mini Map */}
              <div 
                className="absolute bg-blue-500/60 rounded-full"
                style={{ 
                  left: `${(0 + 1500) / 3000 * 100 - 15}%`, 
                  top: `${(-800 + 1500) / 3000 * 100 - 15}%`,
                  width: '30%',
                  height: '30%'
                }}
              />
              {SECTORS.map(s => (
                <div 
                  key={s.id}
                  className="absolute w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]"
                  style={{ 
                    left: `${(s.x + 1500) / 3000 * 100}%`, 
                    top: `${(s.z + 1500) / 3000 * 100}%`,
                    backgroundColor: s.color,
                    color: s.color
                  }}
                />
              ))}
              {/* Player Dot */}
              <div 
                className="absolute w-3 h-3 bg-white border-2 border-red-500 rounded-full z-10 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                style={{ 
                  left: `${(carPos.x + 1500) / 3000 * 100}%`, 
                  top: `${(carPos.z + 1500) / 3000 * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
            <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-mono text-white/40 uppercase">Satellite Feed Active</div>
          </div>
        </div>

        {/* NPC Message */}
        {npcMessage && (
          <div className="self-center max-w-md bg-black/80 backdrop-blur-xl border border-[#ffae00] p-6 rounded-2xl animate-float pointer-events-auto">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-[#ffae00] rounded-full flex items-center justify-center text-black font-bold">NPC</div>
              <p className="text-[#ffae00] font-display font-bold uppercase">Bio Guide</p>
            </div>
            <p className="text-white/80 leading-relaxed">{npcMessage}</p>
          </div>
        )}

        {/* Hotspot Pop-up */}
        {showHotspot && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 pointer-events-auto">
            <div className="bg-black/90 border border-[#00f2ff] p-8 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(0,242,255,0.3)]">
              <h2 className="text-2xl font-display font-bold text-[#00f2ff] mb-4 uppercase tracking-widest">{showHotspot.title}</h2>
              <p className="text-white/70 mb-8 leading-relaxed">{showHotspot.content}</p>
              <button 
                onClick={() => setShowHotspot(null)}
                className="w-full py-3 bg-[#00f2ff] text-black font-display font-bold rounded-xl hover:scale-105 transition-transform"
              >
                CLOSE ENCRYPTED FILE
              </button>
            </div>
          </div>
        )}

        {/* Bottom Sector Card */}
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.17,0.84,0.44,1)] ${activeSector ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="max-w-2xl mx-auto bg-black/90 backdrop-blur-2xl border border-[#00f2ff] rounded-[2rem] p-8 pointer-events-auto shadow-[0_0_50px_rgba(0,242,255,0.15)]">
            {activeSector === 'bio' && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#00f2ff] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img 
                    src="https://image2url.com/r2/default/images/1770611636663-21ddcba8-ff19-4d14-96af-7ce2976b4bf0.jpeg" 
                    className="w-32 h-32 rounded-full border-4 border-[#00f2ff] relative z-10 object-cover"
                    alt="Profile"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-display font-bold text-[#00f2ff] mb-2">NARUBOINA SATISH KUMAR</h2>
                  <p className="text-white/70 mb-6 leading-relaxed">AI & Data Science enthusiast with a passion for building interactive 3D experiences and scalable full-stack applications.</p>
                  
                  <div className="flex justify-center md:justify-start gap-6">
                    {[
                      { icon: <Linkedin />, label: 'LinkedIn', url: 'https://www.linkedin.com/in/n-satish' },
                      { icon: <Github />, label: 'GitHub', url: 'https://github.com/NSatish08' },
                      { icon: <Mail />, label: 'Email', url: 'mailto:nsxy09@gmail.com' }
                    ].map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-12 h-12 group"
                      >
                        <div className="absolute inset-0 bg-white/5 rounded-full border border-white/10 transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:bg-[#00f2ff] group-hover:text-black group-hover:shadow-[-4px_4px_0_#00f2ff] flex items-center justify-center">
                          {React.cloneElement(link.icon as React.ReactElement, { size: 20 })}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSector === 'skills' && (
              <div>
                <h2 className="text-3xl font-display font-bold text-[#00ff00] mb-6 flex items-center gap-3">
                  <Zap className="text-[#00ff00]" /> TECHNICAL ARSENAL
                </h2>
                <div className="overflow-hidden bg-white/5 border border-white/10 rounded-2xl py-6">
                  <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {[...SKILLS, ...SKILLS].map((skill, idx) => (
                      <span key={idx} className="text-[#00ff00] font-display font-bold text-xl uppercase tracking-tighter px-6 py-2 border border-[#00ff00]/20 rounded-lg bg-black/40">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSector === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-display font-bold text-[#ff00ff] flex items-center gap-3">
                    <Trophy className="text-[#ff00ff]" /> MISSION LOGS
                  </h2>
                  <button 
                    onClick={() => setGameActive(!gameActive)}
                    className="px-4 py-2 bg-[#ff00ff]/20 border border-[#ff00ff] rounded-lg text-[#ff00ff] font-mono text-xs hover:bg-[#ff00ff] hover:text-white transition-all"
                  >
                    {gameActive ? "VIEW LOGS" : "START MINI-GAME"}
                  </button>
                </div>

                {gameActive ? (
                  <div className="bg-white/5 border border-[#ff00ff]/30 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-display font-bold mb-4">CODE BREAKER: DATA ACCESS</h3>
                    {gameComplete ? (
                      <div className="animate-bounce">
                        <div className="inline-block p-4 bg-[#00ff00]/20 border border-[#00ff00] rounded-2xl text-[#00ff00] font-bold mb-4">
                          BADGE UNLOCKED: DATA MASTER 🏆
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          maxLength={4}
                          value={gameInput}
                          onChange={(e) => setGameInput(e.target.value)}
                          placeholder="0000"
                          className="bg-black/50 border border-white/20 rounded-xl px-6 py-3 text-2xl font-mono text-center focus:border-[#ff00ff] outline-none w-32"
                        />
                        <button 
                          onClick={handleGameSubmit}
                          className="w-full py-3 bg-[#ff00ff] text-white font-display font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                          INITIALIZE DECRYPTION
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-4">
                    {PROJECTS.map((project, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border-l-4 border-[#ff00ff] rounded-r-xl hover:bg-white/10 transition-colors group">
                        <h3 className="font-display font-bold text-lg group-hover:text-[#ff00ff] transition-colors">{project.title}</h3>
                        <p className="text-xs text-white/60 mb-2">{project.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSector === 'education' && (
              <div>
                <h2 className="text-3xl font-display font-bold text-[#ffff00] mb-8 flex items-center gap-3">
                  <GraduationCap className="text-[#ffff00]" /> ACADEMIC PEAK
                </h2>
                <div className="space-y-6">
                  <div className="relative pl-8 border-l-2 border-[#ffff00]/30">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#ffff00] rounded-full shadow-[0_0_15px_#ffff00]" />
                    <h3 className="text-xl font-display font-bold">B.Tech in AI & DS</h3>
                    <p className="text-white/60">KORMCE, Kadapa (2023-2026)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-end">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl pointer-events-auto flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <div className="font-mono text-[10px] uppercase">
                <p className="text-white/40">Status</p>
                <p className="text-white">Live Exploration</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="font-mono text-[10px] uppercase">
              <p className="text-white/40">Location</p>
              <p className="text-white">Kadapa, India</p>
            </div>
          </div>

          <div className="flex gap-4 pointer-events-auto">
            <button className="px-6 py-4 bg-[#00f2ff] text-black font-display font-bold rounded-2xl hover:scale-105 transition-transform">
              CONTACT COMMAND
            </button>
          </div>
        </div>
      </div>

      {/* Background Ambience (Free Fire Style) */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent opacity-80" />
        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
      </div>
    </div>
  );
}
