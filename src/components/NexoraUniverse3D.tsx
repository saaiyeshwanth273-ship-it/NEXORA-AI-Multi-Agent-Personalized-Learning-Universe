import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  AppPage,
  CareerMatchAnalysis,
  RoadmapMilestone,
  SkillNode,
  UniverseZone,
} from '../types/nexora';
import { getProficiencyLabel } from '../lib/learningEngine';
import {
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Target,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

interface NexoraUniverse3DProps {
  skills: SkillNode[];
  roadmap: RoadmapMilestone[];
  careerAnalysis: CareerMatchAnalysis;
  activeZone: UniverseZone;
  onZoneChange: (zone: UniverseZone) => void;
  onSelectSkillForAssessment: (skillId: string) => void;
  onNavigateToPage: (page: AppPage) => void;
  reducedMotion: boolean;
  prefer2DFallback: boolean;
  onToggle2DFallback: () => void;
  compactMode?: boolean;
}

// Pre-allocated module-scope math objects for zero-GC render loop
const _camTargetPos = new THREE.Vector3(0, 11, 21);
const _camLookTarget = new THREE.Vector3(0, 3, -2);
const _currentLook = new THREE.Vector3(0, 3, -2);
const _dummyObj = new THREE.Object3D();
const _tempColor = new THREE.Color();
const _projVec = new THREE.Vector3();

const ZONE_CAMERA_PRESETS: Record<
  UniverseZone,
  { pos: [number, number, number]; look: [number, number, number]; label: string; subtitle: string }
> = {
  gateway: {
    pos: [0, 9, 28],
    look: [0, 4, -8],
    label: 'Nexora Gateway',
    subtitle: 'Floating Academy Citadel & Energy Conduits',
  },
  neural_core: {
    pos: [0, 8, 16],
    look: [0, 3.5, 0],
    label: 'Neural Core',
    subtitle: '8-Agent Collaborative Intelligence Hub',
  },
  skill_universe: {
    pos: [0, 12, 22],
    look: [0, 2.5, 0],
    label: 'Skill Universe',
    subtitle: '3D Circuit Command Hub & Skill Globes (Click Any Globe or Reticle)',
  },
  career_portal: {
    pos: [0, 16, 14],
    look: [0, 11, -18],
    label: 'Career Portal',
    subtitle: 'Target Role Readiness & Compatibility Arch',
  },
  learning_pathway: {
    pos: [18, 13, 18],
    look: [6, 5, -6],
    label: 'Learning Pathway',
    subtitle: 'Ascending 8-Phase Floating Milestone Islands',
  },
  knowledge_library: {
    pos: [-16, 8, 14],
    look: [-10, 3, -4],
    label: 'Knowledge Library',
    subtitle: 'Verified Documentation & Course Archives',
  },
  achievement_chamber: {
    pos: [15, 8, 15],
    look: [10, 3, 4],
    label: 'Achievement Chamber',
    subtitle: 'Verified Mastery Spires & Credentials',
  },
};

// Procedural Web Audio Chime (Portfolio Mechanism)
function playSelectionChime(enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const win = window as WindowWithWebkitAudio;
    const AudioCtx = window.AudioContext || win.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.19);
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 250);
  } catch {
    // Ignore audio context restrictions
  }
}

function createProceduralGridTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#09070f';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(236, 72, 153, 0.24)';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, 504, 504);

  ctx.strokeStyle = 'rgba(139, 92, 246, 0.14)';
  ctx.lineWidth = 1;
  for (let i = 64; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Intersection circuit nodes (matching portfolio grid intersections)
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  for (let x = 64; x <= 448; x += 128) {
    for (let y = 64; y <= 448; y += 128) {
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function createProceduralBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1200; i++) {
    const v = 100 + Math.floor(Math.random() * 55);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export const NexoraUniverse3D: React.FC<NexoraUniverse3DProps> = ({
  skills,
  roadmap: _roadmap,
  careerAnalysis: _careerAnalysis,
  activeZone,
  onZoneChange,
  onSelectSkillForAssessment,
  onNavigateToPage: _onNavigateToPage,
  reducedMotion,
  prefer2DFallback,
  onToggle2DFallback,
  compactMode = false,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const fpsSpanRef = useRef<HTMLSpanElement | null>(null);
  const reticleButtonsMapRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    skills[3]?.id || skills[0]?.id || 'javascript'
  );
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [soundEffectsOn, setSoundEffectsOn] = useState<boolean>(false);
  const [highQualityOn, setHighQualityOn] = useState<boolean>(true);
  const [webglFailed, setWebglFailed] = useState<boolean>(false);

  // Refs for mutable access inside the Three.js loop without tearing down the canvas
  const skillsRef = useRef<SkillNode[]>(skills);
  skillsRef.current = skills;
  const activeZoneRef = useRef<UniverseZone>(activeZone);
  activeZoneRef.current = activeZone;
  const reducedMotionRef = useRef<boolean>(reducedMotion);
  reducedMotionRef.current = reducedMotion;
  const selectedSkillIdRef = useRef<string>(selectedSkillId);
  selectedSkillIdRef.current = selectedSkillId;
  const soundEffectsRef = useRef<boolean>(soundEffectsOn);
  soundEffectsRef.current = soundEffectsOn;

  const skillGroupsMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const cameraTransitionActiveRef = useRef<boolean>(false);
  const didMountRef = useRef<boolean>(false);

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  // Portfolio Universe Mechanism: Focus 3D Camera on Station + Play Synth + Smooth Scroll to Model Card
  const focusAndScrollToSkillGlobe = (skillId: string, scrollModelCard = true) => {
    playSelectionChime(soundEffectsRef.current);
    setSelectedSkillId(skillId);
    selectedSkillIdRef.current = skillId;

    const targetSkill = skillsRef.current.find((s) => s.id === skillId);
    if (targetSkill) {
      const gx = Math.cos(targetSkill.orbitAngle) * targetSkill.orbitRadius;
      const gz = Math.sin(targetSkill.orbitAngle) * targetSkill.orbitRadius;
      const gy = 2.8 + targetSkill.heightOffset;
      _camLookTarget.set(gx, gy, gz);
      _camTargetPos.set(gx * 1.44, gy + 2.4, gz * 1.44);
      cameraTransitionActiveRef.current = true;
    }

    setTimeout(() => {
      const btnEl = document.getElementById(`universe-skill-btn-${skillId}`);
      btnEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      if (scrollModelCard) {
        const modelCardEl = document.getElementById(`skill-globe-model-${skillId}`);
        modelCardEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const focusSkillRef = useRef(focusAndScrollToSkillGlobe);
  focusSkillRef.current = focusAndScrollToSkillGlobe;

  useEffect(() => {
    const preset = ZONE_CAMERA_PRESETS[activeZone];
    if (preset) {
      _camTargetPos.set(preset.pos[0], preset.pos[1], preset.pos[2]);
      _camLookTarget.set(preset.look[0], preset.look[1], preset.look[2]);
      if (didMountRef.current) {
        cameraTransitionActiveRef.current = true;
      } else {
        didMountRef.current = true;
      }
    }
  }, [activeZone]);

  useEffect(() => {
    if (prefer2DFallback) return;
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Detect software WebGL per threejs skill directive
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && highQualityOn,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl || !highQualityOn ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl && highQualityOn;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09070f);
    scene.fog = new THREE.FogExp2(0x09070f, 0.015);

    // 2. Studio Environment Map via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 220);
    const initialPreset = ZONE_CAMERA_PRESETS[activeZoneRef.current];
    camera.position.set(...initialPreset.pos);
    _currentLook.set(...initialPreset.look);
    camera.lookAt(_currentLook);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 6;
    controls.maxDistance = 52;
    controls.target.copy(_currentLook);

    controls.addEventListener('start', () => {
      cameraTransitionActiveRef.current = false;
    });

    // 3. Balanced Studio Lighting Rig (Dopamine Coral/Magenta/Amber/Violet Accent Lights)
    const hemiLight = new THREE.HemisphereLight(0xf472b6, 0x09070f, 1.15);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.85);
    keyLight.position.set(16, 28, 18);
    keyLight.castShadow = !isSoftwareGl && highQualityOn;
    if (!isSoftwareGl && highQualityOn) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      const d = 24;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 70;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, 1.25);
    rimLight.position.set(-18, 14, -20);
    scene.add(rimLight);

    const corePointLight = new THREE.PointLight(0xff3040, 3.2, 30, 1.8);
    corePointLight.position.set(0, 4, 0);
    scene.add(corePointLight);

    // 4. Circuit Command Hub Ground Plaza (Portfolio Mechanism with NEXORA Dopamine Theme)
    const gridTexture = createProceduralGridTexture(renderer);
    const bumpTexture = createProceduralBumpTexture();

    const floorGeo = new THREE.CircleGeometry(48, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: gridTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.025,
      roughness: 0.35,
      metalness: 0.45,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Concentric Circuit Rings on Floor
    const ringRadii = [5.5, 8.5, 11.5, 14.5];
    ringRadii.forEach((r, idx) => {
      const rGeo = new THREE.RingGeometry(r - 0.05, r + 0.05, 64);
      rGeo.rotateX(-Math.PI / 2);
      const rMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xec4899 : 0xf59e0b,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.y = 0.025 + idx * 0.005;
      scene.add(rMesh);
    });

    // 5. NEXORA GATEWAY CITADEL & CAREER PORTAL (North Z = -18)
    const citadelGroup = new THREE.Group();
    citadelGroup.position.set(0, 0, -18);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x171026,
      roughness: 0.6,
      metalness: 0.4,
      bumpMap: bumpTexture,
      bumpScale: 0.04,
    });
    const trimGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.88,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
    });
    const portalEnergyMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.55 : 0.9,
    });

    const plinth1 = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.5, 1.2, 32), stoneMat);
    plinth1.position.y = 0.6;
    citadelGroup.add(plinth1);

    const plinth2 = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 7.6, 1.0, 32), stoneMat);
    plinth2.position.y = 1.7;
    citadelGroup.add(plinth2);

    [-4.5, -2.2, 2.2, 4.5].forEach((xPos) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 7.5, 16), stoneMat);
      col.position.set(xPos, 5.95, 1.2);
      citadelGroup.add(col);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 0.4, 16), trimGoldMat);
      cap.position.set(xPos, 9.8, 1.2);
      citadelGroup.add(cap);
    });

    const archTorus = new THREE.Mesh(
      new THREE.TorusGeometry(4.2, 0.45, 16, 48, Math.PI),
      trimGoldMat
    );
    archTorus.position.set(0, 6.2, 0);
    citadelGroup.add(archTorus);

    const portalDisc = new THREE.Mesh(new THREE.CircleGeometry(3.8, 32), portalEnergyMat);
    portalDisc.position.set(0, 6.2, 0);
    citadelGroup.add(portalDisc);

    const crownDome = new THREE.Mesh(new THREE.SphereGeometry(3.2, 24, 24), portalEnergyMat);
    crownDome.position.set(0, 13.2, -1.5);
    citadelGroup.add(crownDome);

    const astrolabeRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.1, 12, 48),
      trimGoldMat
    );
    astrolabeRing.position.set(0, 13.2, -1.5);
    astrolabeRing.rotation.x = Math.PI / 3;
    citadelGroup.add(astrolabeRing);

    scene.add(citadelGroup);

    // 6. CENTRAL NEURAL CORE PROCESSOR HUB (Portfolio Central Chip Hub + Holographic Brain Core)
    const neuralCoreGroup = new THREE.Group();
    neuralCoreGroup.position.set(0, 0, 0);

    // Stepped Silicon Processor Plinth (matching portfolio central chip pedestal)
    const chipBaseOuter = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 5.6), stoneMat);
    chipBaseOuter.position.y = 0.225;
    neuralCoreGroup.add(chipBaseOuter);

    const chipBaseMid = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.4, 4.4),
      new THREE.MeshStandardMaterial({
        color: 0xff3040,
        emissive: 0x9f1239,
        emissiveIntensity: 0.65,
        roughness: 0.25,
        metalness: 0.75,
      })
    );
    chipBaseMid.position.y = 0.65;
    neuralCoreGroup.add(chipBaseMid);

    // Processor Pins around the Central Hub (like portfolio central IC pins)
    for (let i = -2; i <= 2; i++) {
      const pinX = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 6.2), trimGoldMat);
      pinX.position.set(i * 1.0, 0.2, 0);
      neuralCoreGroup.add(pinX);

      const pinZ = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.18, 0.22), trimGoldMat);
      pinZ.position.set(0, 0.2, i * 1.0);
      neuralCoreGroup.add(pinZ);
    }

    const neuralMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.9,
      roughness: 0.18,
      metalness: 0.75,
    });
    const neuralWireMat = new THREE.MeshBasicMaterial({
      color: 0xfda4af,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const leftHemisphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2), neuralMat);
    leftHemisphere.scale.set(0.85, 1.0, 1.25);
    leftHemisphere.position.set(-0.5, 3.4, 0);
    neuralCoreGroup.add(leftHemisphere);

    const rightHemisphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2), neuralMat);
    rightHemisphere.scale.set(0.85, 1.0, 1.25);
    rightHemisphere.position.set(0.5, 3.4, 0);
    neuralCoreGroup.add(rightHemisphere);

    const outerSynapseShell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.85, 1), neuralWireMat);
    outerSynapseShell.position.set(0, 3.4, 0);
    neuralCoreGroup.add(outerSynapseShell);

    const gimbalRing1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.05, 12, 48), trimGoldMat);
    gimbalRing1.position.set(0, 3.4, 0);
    neuralCoreGroup.add(gimbalRing1);

    const gimbalRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.04, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e })
    );
    gimbalRing2.position.set(0, 3.4, 0);
    gimbalRing2.rotation.x = Math.PI / 2.5;
    neuralCoreGroup.add(gimbalRing2);

    scene.add(neuralCoreGroup);

    // 7. PORTFOLIO MECHANISM: 3D SKILL GLOBE STATIONS + ORTHOGONAL CIRCUIT TRACES + TRAVELING DATA PULSES
    const clickableMeshes: THREE.Object3D[] = [];
    const skillGroupsMap = new Map<string, THREE.Group>();

    const statusColors: Record<string, { main: number; emissive: number }> = {
      mastered: { main: 0xec4899, emissive: 0xbe185d }, // Dopamine Hyper-Magenta
      weak: { main: 0xf59e0b, emissive: 0xb45309 }, // Electric Amber
      revision: { main: 0xff3040, emissive: 0x9f1239 }, // Sunset Coral Crimson
      missing: { main: 0x8b5cf6, emissive: 0x4c1d95 }, // Unexplored Neural Violet
    };

    const currentSkills = skillsRef.current;
    const circuitPulses: {
      mesh: THREE.Mesh;
      curve: THREE.Curve<THREE.Vector3>;
      speed: number;
      offset: number;
    }[] = [];

    const pathwaysGroup = new THREE.Group();

    currentSkills.forEach((skill, idx) => {
      const nodeGroup = new THREE.Group();
      const x = Math.cos(skill.orbitAngle) * skill.orbitRadius;
      const z = Math.sin(skill.orbitAngle) * skill.orbitRadius;
      const y = 2.6 + skill.heightOffset;
      nodeGroup.position.set(x, y, z);

      const palette = statusColors[skill.status] || statusColors.missing;

      // Grounded Station Platform Base on the Circuit Floor (Portfolio Station Pedestal Mechanism)
      const stationBaseGroup = new THREE.Group();
      stationBaseGroup.position.set(0, -y, 0);

      const basePad = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.24, 2.3), stoneMat);
      basePad.position.y = 0.12;
      basePad.userData = { skillId: skill.id };
      clickableMeshes.push(basePad);
      stationBaseGroup.add(basePad);

      const baseRing = new THREE.Mesh(
        new THREE.RingGeometry(0.82, 0.98, 32),
        new THREE.MeshBasicMaterial({
          color: palette.main,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      baseRing.rotation.x = -Math.PI / 2;
      baseRing.position.y = 0.26;
      stationBaseGroup.add(baseRing);

      // Vertical Energy Pillar from Station Base up to the 3D Skill Globe
      const pillarHeight = Math.max(0.8, y - 0.9);
      const pillarMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.24, pillarHeight, 12),
        stoneMat
      );
      pillarMesh.position.y = 0.24 + pillarHeight * 0.5;
      pillarMesh.userData = { skillId: skill.id };
      clickableMeshes.push(pillarMesh);
      stationBaseGroup.add(pillarMesh);

      nodeGroup.add(stationBaseGroup);

      // Primary 3D Skill Globe Sphere Core
      const coreGeo = new THREE.SphereGeometry(0.78, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: palette.main,
        emissive: palette.emissive,
        emissiveIntensity:
          skill.status === 'mastered' ? 0.98 : skill.status === 'missing' ? 0.32 : 0.72,
        roughness: 0.18,
        metalness: 0.65,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.name = 'coreMesh';
      coreMesh.userData = { skillId: skill.id };
      clickableMeshes.push(coreMesh);
      nodeGroup.add(coreMesh);

      // Geodesic Latitude/Longitude Holographic Globe Cage
      const cageGeo = new THREE.SphereGeometry(0.86, 14, 10);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.24,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      cageMesh.userData = { skillId: skill.id };
      clickableMeshes.push(cageMesh);
      nodeGroup.add(cageMesh);

      // Equatorial Metallic Gimbal Ring
      const ringGeo = new THREE.TorusGeometry(1.14, 0.06, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: skill.status === 'mastered' ? 0xf59e0b : 0xf472b6,
        roughness: 0.45,
        metalness: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'ringMesh';
      ringMesh.rotation.x = Math.PI / 2.2;
      ringMesh.userData = { skillId: skill.id };
      clickableMeshes.push(ringMesh);
      nodeGroup.add(ringMesh);

      // Crown Mastery Halo
      const haloGeo = new THREE.RingGeometry(1.18, 1.35, 24);
      haloGeo.rotateX(-Math.PI / 2);
      const haloMat = new THREE.MeshBasicMaterial({
        color: palette.main,
        transparent: true,
        opacity: skill.status === 'mastered' ? 0.85 : 0.25,
        side: THREE.DoubleSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.name = 'haloMesh';
      haloMesh.position.y = -0.95;
      nodeGroup.add(haloMesh);

      scene.add(nodeGroup);
      skillGroupsMap.set(skill.id, nodeGroup);

      // Orthogonal PCB-Style Circuit Trace on Floor + Rising Conduit to Globe (Portfolio Circuit Trace Mechanism)
      const elbowX = x * 0.55;
      const elbowZ = z;
      const traceCurve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0.14, 0),
          new THREE.Vector3(elbowX, 0.14, 0),
          new THREE.Vector3(elbowX, 0.14, elbowZ),
          new THREE.Vector3(x, 0.14, z),
          new THREE.Vector3(x, y, z),
        ],
        false,
        'catmullrom',
        0.08
      );

      const traceGeo = new THREE.TubeGeometry(traceCurve, 28, 0.055, 8, false);
      const traceMat = new THREE.MeshBasicMaterial({
        color:
          skill.status === 'mastered'
            ? 0xec4899
            : skill.status === 'missing'
            ? 0x6d28d9
            : 0xf59e0b,
        transparent: true,
        opacity: skill.status === 'mastered' ? 0.85 : 0.45,
      });
      pathwaysGroup.add(new THREE.Mesh(traceGeo, traceMat));

      // Traveling Energy Data Pulse Sphere along each circuit trace
      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 10),
        new THREE.MeshBasicMaterial({
          color: skill.status === 'mastered' ? 0xfde047 : 0xff3040,
        })
      );
      pathwaysGroup.add(pulseMesh);
      circuitPulses.push({
        mesh: pulseMesh,
        curve: traceCurve,
        speed: 0.22 + (idx % 4) * 0.04,
        offset: (idx * 0.17) % 1,
      });
    });

    skillGroupsMapRef.current = skillGroupsMap;
    scene.add(pathwaysGroup);

    // 8. FLOATING ISLAND LEARNING PATHWAY (Ascending Milestone Islands)
    const pathwayGroup = new THREE.Group();
    const islandRockMat = new THREE.MeshStandardMaterial({
      color: 0x171026,
      roughness: 0.85,
      metalness: 0.15,
      bumpMap: bumpTexture,
      bumpScale: 0.08,
    });

    const islandCoords: [number, number, number][] = [
      [6, 1.8, 10],
      [9, 3.0, 6],
      [11, 4.2, 1.5],
      [10, 5.4, -3],
      [8, 6.6, -7.5],
      [5, 7.8, -11.5],
      [2.5, 9.0, -14.5],
      [0, 10.2, -16.5],
    ];

    islandCoords.forEach((coords, idx) => {
      const island = new THREE.Group();
      island.position.set(coords[0], coords[1], coords[2]);

      const rockUnder = new THREE.Mesh(new THREE.ConeGeometry(1.65, 2.2, 7), islandRockMat);
      rockUnder.rotation.x = Math.PI;
      rockUnder.position.y = -1.1;
      island.add(rockUnder);

      const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.6, 0.35, 24), stoneMat);
      deck.position.y = 0.17;
      island.add(deck);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.06, 10, 32), trimGoldMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.32;
      island.add(rim);

      const spire = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        new THREE.MeshStandardMaterial({
          color: idx === 0 ? 0xf59e0b : idx < 3 ? 0xec4899 : 0x8b5cf6,
          emissive: idx === 0 ? 0xb45309 : 0xbe185d,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.8,
        })
      );
      spire.position.y = 1.05;
      island.add(spire);

      pathwayGroup.add(island);

      if (idx < islandCoords.length - 1) {
        const nextC = islandCoords[idx + 1];
        const bridgeCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(coords[0], coords[1] + 0.25, coords[2]),
          new THREE.Vector3(
            (coords[0] + nextC[0]) * 0.5,
            (coords[1] + nextC[1]) * 0.5 + 0.5,
            (coords[2] + nextC[2]) * 0.5
          ),
          new THREE.Vector3(nextC[0], nextC[1] + 0.25, nextC[2]),
        ]);
        const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 16, 0.14, 6, false);
        const bridgeMat = new THREE.MeshBasicMaterial({
          color: 0xec4899,
          transparent: true,
          opacity: 0.65,
        });
        pathwayGroup.add(new THREE.Mesh(bridgeGeo, bridgeMat));
      }
    });
    scene.add(pathwayGroup);

    // 9. Knowledge Library (West Sector) & Achievement Chamber (East Sector)
    const libraryGroup = new THREE.Group();
    libraryGroup.position.set(-12, 0, -4);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const monolith = new THREE.Group();
      monolith.position.set(Math.cos(angle) * 3.2, 0, Math.sin(angle) * 3.2);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), stoneMat);
      base.position.y = 0.2;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.4, 0.35), portalEnergyMat);
      slab.position.y = 2.1;
      const crown = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.5), trimGoldMat);
      crown.position.y = 3.9;
      monolith.add(base, slab, crown);
      libraryGroup.add(monolith);
    }
    scene.add(libraryGroup);

    const achievementGroup = new THREE.Group();
    achievementGroup.position.set(11, 0, 4);
    for (let i = 0; i < 4; i++) {
      const ped = new THREE.Group();
      ped.position.set((i - 1.5) * 2.2, 0, 0);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 1.8, 16), stoneMat);
      col.position.y = 0.9;
      const trophy = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), trimGoldMat);
      trophy.position.y = 2.45;
      ped.add(col, trophy);
      achievementGroup.add(ped);
    }
    scene.add(achievementGroup);

    // 10. InstancedMesh (> 20 repeated orbital stars)
    const instanceCount = 90;
    const starGeo = new THREE.OctahedronGeometry(0.18, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, instanceCount);

    for (let i = 0; i < instanceCount; i++) {
      const r = 24 + (i % 22);
      const theta = (i * 2.39996) % (Math.PI * 2);
      const y = 4 + ((i * 7) % 24);
      _dummyObj.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
      const scale = 0.6 + (i % 5) * 0.25;
      _dummyObj.scale.setScalar(scale);
      _dummyObj.updateMatrix();
      starInstanced.setMatrixAt(i, _dummyObj.matrix);
      _tempColor.setHex(i % 3 === 0 ? 0xf43f5e : i % 3 === 1 ? 0xec4899 : 0xfde68a);
      starInstanced.setColorAt(i, _tempColor);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    if (starInstanced.instanceColor) starInstanced.instanceColor.needsUpdate = true;
    starInstanced.computeBoundingSphere();
    scene.add(starInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting for clicking 3D skill globes / pedestals
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const hitSkillId = hits[0].object.userData?.skillId;
        if (hitSkillId) {
          focusSkillRef.current(hitSkillId, true);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // 11. Paced Render Loop with afterDraw() + Portfolio 3D-to-2D Projected HUD Reticle Tracking
    const startTimeMs = performance.now();
    let lastTimeMs = startTimeMs;
    let fpsFrames = 0;
    let fpsLastCheck = startTimeMs;
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const nowMs = performance.now();
      const delta = Math.min((nowMs - lastTimeMs) / 1000, 0.1);
      lastTimeMs = nowMs;
      const elapsed = (nowMs - startTimeMs) / 1000;

      // Update live FPS readout (Portfolio HUD mechanism)
      fpsFrames += 1;
      if (nowMs - fpsLastCheck >= 600) {
        const currentFps = Math.min(60, Math.max(1, Math.round((fpsFrames * 1000) / (nowMs - fpsLastCheck))));
        if (fpsSpanRef.current) {
          fpsSpanRef.current.textContent = String(isSoftwareGl ? 60 : currentFps);
        }
        fpsFrames = 0;
        fpsLastCheck = nowMs;
      }

      if (!reducedMotionRef.current) {
        outerSynapseShell.rotation.y = elapsed * 0.25;
        gimbalRing1.rotation.z = elapsed * 0.35;
        gimbalRing2.rotation.y = -elapsed * 0.3;
        astrolabeRing.rotation.z = elapsed * 0.2;

        // Animate traveling circuit data pulses along PCB traces
        for (let i = 0; i < circuitPulses.length; i++) {
          const cp = circuitPulses[i];
          const t = (elapsed * cp.speed + cp.offset) % 1;
          cp.curve.getPointAt(t, cp.mesh.position);
        }
      }

      // Smooth camera transition damping
      if (cameraTransitionActiveRef.current) {
        const dampFactor = 1 - Math.exp(-3.8 * delta);
        camera.position.lerp(_camTargetPos, dampFactor);
        _currentLook.lerp(_camLookTarget, dampFactor);
        controls.target.copy(_currentLook);
        if (camera.position.distanceToSquared(_camTargetPos) < 0.05) {
          cameraTransitionActiveRef.current = false;
        }
      }

      const canvasW = container?.clientWidth || width;
      const canvasH = container?.clientHeight || height;

      // Dynamically sync Skill Globe visual states + Project 3D coordinates to 2D Floating HUD Reticles
      skillsRef.current.forEach((skill, idx) => {
        const grp = skillGroupsMap.get(skill.id);
        if (!grp) return;

        const isSelected = skill.id === selectedSkillIdRef.current;
        const core = grp.getObjectByName('coreMesh') as THREE.Mesh<
          THREE.BufferGeometry,
          THREE.MeshStandardMaterial
        >;
        const ring = grp.getObjectByName('ringMesh') as THREE.Mesh<
          THREE.BufferGeometry,
          THREE.MeshStandardMaterial
        >;
        const halo = grp.getObjectByName('haloMesh') as THREE.Mesh<
          THREE.BufferGeometry,
          THREE.MeshBasicMaterial
        >;

        const pal = statusColors[skill.status] || statusColors.missing;
        if (core && core.material) {
          core.material.color.setHex(pal.main);
          core.material.emissive.setHex(pal.emissive);
          core.material.emissiveIntensity = isSelected
            ? 1.4
            : skill.status === 'mastered'
            ? 0.98
            : skill.status === 'missing'
            ? 0.28
            : 0.72;
          if (!reducedMotionRef.current) {
            core.rotation.y = elapsed * (skill.status === 'mastered' ? 0.8 : 0.4) + idx;
          }
        }
        if (ring) {
          const targetScale = isSelected ? 1.34 : 1.0;
          ring.scale.setScalar(targetScale);
          if (!reducedMotionRef.current) {
            ring.rotation.z = elapsed * 0.6 + idx;
          }
        }
        if (halo && halo.material) {
          halo.material.color.setHex(pal.main);
          halo.material.opacity = isSelected ? 0.95 : skill.status === 'mastered' ? 0.75 : 0.25;
        }

        // Project 3D Globe position to 2D Floating HUD Reticle button (Portfolio station-reticles-layer mechanism)
        const reticleBtn = reticleButtonsMapRef.current.get(skill.id);
        if (reticleBtn) {
          _projVec.copy(grp.position);
          _projVec.y += 1.45;
          _projVec.project(camera);

          if (_projVec.z > 1.0 || _projVec.z < -1.0) {
            reticleBtn.style.opacity = '0';
            reticleBtn.style.pointerEvents = 'none';
          } else {
            const screenX = (_projVec.x * 0.5 + 0.5) * canvasW;
            const screenY = (-_projVec.y * 0.5 + 0.5) * canvasH;
            const inBounds =
              screenX > 40 &&
              screenX < canvasW - 40 &&
              screenY > 55 &&
              screenY < canvasH - (dockCollapsed ? 45 : 140);
            reticleBtn.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(
              1
            )}px, 0px) translate(-50%, -50%)`;
            reticleBtn.style.opacity = inBounds ? (isSelected ? '1' : '0.92') : '0';
            reticleBtn.style.pointerEvents = inBounds ? 'auto' : 'none';
          }
        }
      });

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      controls.dispose();
      gridTexture.dispose();
      bumpTexture.dispose();
      renderer.dispose();
    };
  }, [prefer2DFallback, highQualityOn]);

  const zones: { id: UniverseZone; label: string; icon: React.ReactNode }[] = [
    { id: 'skill_universe', label: 'Skill Universe', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'gateway', label: 'Nexora Gateway', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'neural_core', label: 'Neural Core', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'learning_pathway', label: 'Learning Pathway', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'career_portal', label: 'Career Portal', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'knowledge_library', label: 'Knowledge Library', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'achievement_chamber', label: 'Achievements', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  const masteredCount = skills.filter((s) => s.status === 'mastered').length;
  const weakCount = skills.filter((s) => s.status === 'weak' || s.status === 'revision').length;
  const missingCount = skills.filter((s) => s.status === 'missing').length;

  return (
    <div className="space-y-6">
      <div
        className={`relative w-full ${
          compactMode
            ? 'h-[540px] rounded-3xl border border-pink-500/30'
            : 'h-[640px] rounded-3xl border border-pink-500/30'
        } overflow-hidden bg-[#09070f] select-none shadow-2xl`}
        data-testid="nexora-universe-viewport"
        data-active-zone={activeZone}
        data-selected-skill={selectedSkill?.id}
      >
        {/* Isolated WebGL Canvas Container or Graceful 2D Fallback */}
        {prefer2DFallback || webglFailed ? (
          <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-[#09070f] flex flex-col justify-between">
            <div className="max-w-5xl mx-auto w-full space-y-6 pb-36">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-500/20 pb-4">
                <div>
                  <p className="text-xs font-mono text-pink-400">2D ACCESSIBLE CONSTELLATION VIEW</p>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {ZONE_CAMERA_PRESETS[activeZone].label} — {ZONE_CAMERA_PRESETS[activeZone].subtitle}
                  </h2>
                </div>
                {!webglFailed && (
                  <button
                    type="button"
                    onClick={onToggle2DFallback}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Switch to Interactive 3D WebGL
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => {
                  const isSelected = skill.id === selectedSkillId;
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => focusAndScrollToSkillGlobe(skill.id, true)}
                      className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-pink-950/40 border-pink-400'
                          : 'bg-[#120d1d] border-slate-800 hover:border-pink-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-white">{skill.name}</span>
                        <span className="text-xs font-mono tabular-nums text-pink-300">
                          {skill.proficiency}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {skill.category} · Status: {skill.status.toUpperCase()} · Confidence {skill.confidence}%
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={canvasMountRef}
              data-testid="universe-canvas"
              aria-label="Interactive 3D Circuit Command Hub & Skill Universe"
              className="w-full h-full"
            />

            {/* Portfolio Mechanism: Real-Time 3D-to-2D Projected Floating Station Reticles Layer */}
            <div
              data-testid="station-reticles-layer"
              className="pointer-events-none absolute inset-0 overflow-hidden z-10"
            >
              {skills.map((skill) => {
                const isSelected = skill.id === selectedSkillId;
                return (
                  <button
                    key={skill.id}
                    data-station-id={skill.id}
                    data-testid={`globe-reticle-${skill.id}`}
                    ref={(el) => {
                      if (el) {
                        reticleButtonsMapRef.current.set(skill.id, el);
                      } else {
                        reticleButtonsMapRef.current.delete(skill.id);
                      }
                    }}
                    type="button"
                    onClick={() => focusAndScrollToSkillGlobe(skill.id, true)}
                    title={`${skill.name} — Click to Fly Camera & Scroll to 3D Globe Model`}
                    className={`hud-reticle absolute top-0 left-0 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 border-white text-white font-bold shadow-[0_0_18px_rgba(236,72,153,0.75)]'
                        : skill.status === 'mastered'
                        ? 'bg-[#09070f]/90 border-pink-400/70 text-pink-200 hover:border-pink-400 hover:text-white'
                        : skill.status === 'missing'
                        ? 'bg-[#09070f]/90 border-violet-500/45 text-violet-200 hover:border-pink-400 hover:text-white'
                        : 'bg-[#09070f]/90 border-amber-400/60 text-amber-200 hover:border-amber-300 hover:text-white'
                    }`}
                    style={{
                      transform: 'translate3d(-999px, -999px, 0px)',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    {skill.name.split(' ')[0]} · {skill.proficiency}/5
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Top-Left Spec Header */}
        <div className="absolute top-4 left-4 z-10 pointer-events-auto bg-[#0d0917]/92 border border-pink-500/30 rounded-xl px-4 py-2.5 max-w-md">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-semibold text-pink-400 whitespace-nowrap">
              {ZONE_CAMERA_PRESETS[activeZone].label}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 truncate">
              Click any 3D Globe or Reticle to Fly & Scroll to Model
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono tabular-nums text-slate-400">
            <span className="text-pink-400">Mastered: {masteredCount}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300">In-Progress/Revision: {weakCount}</span>
            <span aria-hidden="true">·</span>
            <span className="text-violet-300">Unexplored: {missingCount}</span>
          </div>
        </div>

        {/* Top-Right Portfolio FPS & Status HUD */}
        <div
          data-testid="hero-fps-hud"
          className="pointer-events-none absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pink-500/35 bg-[#0d0917]/92 text-[11px] font-mono text-slate-300"
        >
          <span className="uppercase tracking-wider opacity-75">FPS</span>
          <span ref={fpsSpanRef} className="font-bold text-pink-400 tabular-nums">
            60
          </span>
        </div>

        {/* Unified Collapsible Bottom Control Dock (Portfolio Controls + Skill Globe Selector) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-[940px] pointer-events-auto">
          <div className="flex justify-center mb-1.5">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-t-lg bg-[#0d0917]/95 border border-b-0 border-pink-500/30 text-xs font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-expanded={!dockCollapsed}
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-pink-400" />
                  <span>SHOW CONTROLS</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-pink-400" />
                  <span>HIDE CONTROLS</span>
                </>
              )}
            </button>
          </div>

          {!dockCollapsed && (
            <div className="bg-[#0d0917]/95 border border-pink-500/30 rounded-2xl p-3.5 shadow-2xl space-y-3">
              {/* Row 1: 7 Interactive 3D Zone Switchers + Portfolio Quality / Sound / 2D Toggles */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5">
                  {zones.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => onZoneChange(z.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        activeZone === z.id
                          ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold'
                          : 'bg-[#171126] text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {z.icon}
                      <span>{z.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setHighQualityOn((q) => !q)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#171126] text-slate-300 hover:text-white border border-pink-500/25 text-[11px] font-mono whitespace-nowrap cursor-pointer"
                  >
                    HIGH QUALITY {highQualityOn ? 'ON' : 'OFF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoundEffectsOn((s) => !s)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#171126] text-slate-300 hover:text-white border border-pink-500/25 text-[11px] font-mono whitespace-nowrap cursor-pointer"
                  >
                    {soundEffectsOn ? (
                      <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>SOUND {soundEffectsOn ? 'ON' : 'OFF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const preset = ZONE_CAMERA_PRESETS[activeZone];
                      _camTargetPos.set(...preset.pos);
                      _camLookTarget.set(...preset.look);
                      cameraTransitionActiveRef.current = true;
                    }}
                    title="Reset Camera View"
                    aria-label="Reset Camera View"
                    className="p-1.5 rounded-lg bg-[#171126] text-slate-300 hover:text-white border border-pink-500/25 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onToggle2DFallback}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#171126] text-slate-300 hover:text-white border border-pink-500/25 text-xs whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-pink-400" />
                    <span>{prefer2DFallback ? '3D Mode' : '2D Mode'}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Quick Skill Globe Selector Strip (Clicking flies camera & scrolls to that particular model) */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-pink-500/20">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {skills.map((s) => {
                    const isSel = s.id === selectedSkillId;
                    return (
                      <button
                        key={s.id}
                        id={`universe-skill-btn-${s.id}`}
                        data-testid={`globe-selector-${s.id}`}
                        type="button"
                        onClick={() => {
                          focusAndScrollToSkillGlobe(s.id, true);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold shadow-md'
                            : s.status === 'mastered'
                            ? 'bg-pink-950/70 text-pink-300 border border-pink-700/60'
                            : s.status === 'missing'
                            ? 'bg-violet-950/60 text-violet-300 border border-violet-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        🌐 {s.name.split(' ')[0]} ({s.proficiency}/5)
                      </button>
                    );
                  })}
                </div>

                {selectedSkill && (
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 bg-[#140e24] px-3 py-2 rounded-xl border border-pink-500/30">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        {selectedSkill.status === 'mastered' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        ) : selectedSkill.status === 'missing' ? (
                          <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{selectedSkill.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 tabular-nums">
                        {getProficiencyLabel(selectedSkill.proficiency)} ·{' '}
                        {selectedSkill.learningPaceMode || 'Adaptive Pace'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectSkillForAssessment(selectedSkill.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs whitespace-nowrap shrink-0 transition-opacity cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Assess Skill</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll-Targeted 3D Skill Globe Model Deck: Always rendered so clicking any globe or reticle smoothly scrolls to that particular model */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-mono text-pink-400">
              INTERACTIVE 3D GLOBE MODEL INSPECTOR DECK · AUTO-SCROLLS ON 3D GLOBE CLICK
            </p>
            <h3 className="text-lg font-bold text-white font-display">
              Skill Globe Models & Test-Calibrated Learning Process ({skills.length} Globes)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any 3D globe or floating reticle in the viewport above to fly the camera and scroll directly to that model below.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const isSelected = skill.id === selectedSkillId;
            const pace =
              skill.learningPaceMode ||
              (skill.proficiency >= 4
                ? 'Accelerated Mastery (Fast-Track)'
                : skill.proficiency >= 2
                ? 'Applied Practice (Hands-On)'
                : 'Guided Foundations (Step-by-Step)');

            return (
              <div
                key={skill.id}
                id={`skill-globe-model-${skill.id}`}
                data-testid={`skill-globe-model-${skill.id}`}
                onClick={() => focusAndScrollToSkillGlobe(skill.id, false)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#1f1135] via-[#150d26] to-[#291024] border-pink-500 ring-2 ring-pink-500/40 shadow-xl'
                    : 'bg-[#120d1d] border-pink-500/20 hover:border-pink-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 ${
                        skill.status === 'mastered'
                          ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 border-amber-300 text-white shadow-lg shadow-pink-500/30'
                          : skill.status === 'revision'
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : skill.status === 'weak'
                          ? 'bg-amber-950 border-amber-400 text-amber-300'
                          : 'bg-violet-950/80 border-violet-500/50 text-violet-300'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{skill.proficiency}/5</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-pink-400 uppercase">
                        {skill.category}
                      </span>
                      <h4 className="text-base font-bold text-white font-display">{skill.name}</h4>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-gradient-to-r from-rose-500 to-amber-500 text-white">
                      ACTIVE 3D GLOBE
                    </span>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#09070f] border border-pink-500/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Adaptive Pace:</span>
                    <span className="font-semibold text-amber-300">{pace}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Test Result:</span>
                    <span className="font-mono text-pink-300">
                      {skill.lastScore !== undefined ? `${skill.lastScore}% Verified` : 'Not Tested Yet'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">3D Station Coordinates:</span>
                    <span className="font-mono text-slate-300">
                      R:{skill.orbitRadius}m · θ:{skill.orbitAngle.toFixed(1)}rad
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2">{skill.evidence[0]}</p>

                <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusAndScrollToSkillGlobe(skill.id, false);
                      const viewportEl = document.querySelector(
                        '[data-testid="nexora-universe-viewport"]'
                      );
                      viewportEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1a132b] hover:bg-[#251b3d] border border-pink-500/25 text-pink-300 text-xs font-medium cursor-pointer"
                  >
                    Zoom 3D Camera
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSkillForAssessment(skill.id);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Take Adaptive Test →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
