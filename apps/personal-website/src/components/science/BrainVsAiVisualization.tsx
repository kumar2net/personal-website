import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type RendererInfo = "webgpu" | "webgl2" | "";

export default function BrainVsAiVisualization() {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rendererInfo, setRendererInfo] = useState<RendererInfo>("");

  const palette = useMemo(() => {
    const paletteVars = (theme.vars?.palette ?? {}) as Record<string, string | undefined>;
    return {
      surfaceContainer:
        paletteVars.surfaceContainer ?? theme.palette.background.paper,
      primaryContainer:
        paletteVars.primaryContainer ?? theme.palette.primary.main,
      secondaryContainer:
        paletteVars.secondaryContainer ?? theme.palette.secondary.main,
      onSurface: paletteVars.onSurface ?? theme.palette.text.primary,
      outlineVariant: paletteVars.outlineVariant ?? theme.palette.divider,
    };
  }, [theme]);

  useEffect(() => {
    let cleanup = () => {};
    let stopped = false;

    const init = async () => {
      if (typeof window === "undefined" || !containerRef.current) return;

      const [
        THREE,
        { OrbitControls },
        { WebGPURenderer },
      ] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("three/webgpu"),
      ]);

      const {
        Scene,
        PerspectiveCamera,
        Color,
        AmbientLight,
        DirectionalLight,
        Group,
        Vector3,
        SphereGeometry,
        MeshPhysicalMaterial,
        InstancedMesh,
        Matrix4,
        BufferGeometry,
        Float32BufferAttribute,
        LineSegments,
        LineBasicMaterial,
        CatmullRomCurve3,
        TubeGeometry,
        Mesh,
        PointsMaterial,
        Points,
        Clock,
        AdditiveBlending,
      } = THREE;

      const canvasWidth = containerRef.current.clientWidth || 1;
      const canvasHeight = containerRef.current.clientHeight || 1;

      const scene = new Scene();
      scene.background = new Color(palette.surfaceContainer);

      const camera = new PerspectiveCamera(52, canvasWidth / canvasHeight, 0.1, 50);
      camera.position.set(1.4, 1.1, 7.2);

      const isWebGPUAvailable = typeof navigator !== "undefined" && "gpu" in navigator;
      type RendererType = InstanceType<typeof WebGPURenderer> | import("three").WebGLRenderer | null;
      let renderer: RendererType = null;

      if (isWebGPUAvailable) {
        try {
          renderer = new WebGPURenderer({ antialias: true, alpha: true });
          await renderer.init();
          setRendererInfo("webgpu");
        } catch (error) {
          console.warn("WebGPU init failed, falling back to WebGL2", error);
        }
      }

      if (!renderer) {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2", { antialias: true, preserveDrawingBuffer: false });
        renderer = new THREE.WebGLRenderer({
          canvas,
          context: gl ?? undefined,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        setRendererInfo("webgl2");
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(renderer.domElement);

      const ambient = new AmbientLight(palette.onSurface, 0.36);
      const keyLight = new DirectionalLight(palette.primaryContainer, 1.15);
      keyLight.position.set(4, 6, 8);
      const rimLight = new DirectionalLight(palette.secondaryContainer, 0.82);
      rimLight.position.set(-3, 2.5, -4);
      scene.add(ambient, keyLight, rimLight);

      const brainGroup = new Group();
      const aiGroup = new Group();
      const bridgeGroup = new Group();

      // Brain hemisphere nodes
      const neuronCount = 82;
      const neuronGeometry = new SphereGeometry(0.06, 20, 20);
      const neuronMaterial = new MeshPhysicalMaterial({
        color: new Color(palette.primaryContainer),
        emissive: new Color(palette.primaryContainer),
        emissiveIntensity: 0.35,
        roughness: 0.35,
        transmission: 0.28,
        thickness: 0.55,
        transparent: true,
        opacity: 0.92,
      });
      const neuronMesh = new InstancedMesh(neuronGeometry, neuronMaterial, neuronCount);
      const neuronPositions: Vector3[] = [];
      const neuronMatrix = new Matrix4();
      for (let i = 0; i < neuronCount; i += 1) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = 1 + Math.random() * 0.45;
        const position = new Vector3(
          Math.cos(phi) * Math.sin(theta) * r - 2.1,
          Math.sin(phi) * Math.sin(theta) * r * 0.7 + 0.4,
          Math.cos(theta) * r,
        );
        neuronPositions.push(position);
        neuronMatrix.makeTranslation(position.x, position.y, position.z);
        neuronMesh.setMatrixAt(i, neuronMatrix);
      }
      neuronMesh.instanceMatrix.needsUpdate = true;
      brainGroup.add(neuronMesh);

      // Brain synapse lines
      const connectionPositions: number[] = [];
      neuronPositions.forEach((source, i) => {
        for (let j = i + 1; j < neuronPositions.length; j += 1) {
          const target = neuronPositions[j];
          const dist = source.distanceTo(target);
          if (dist < 1.35 && Math.random() > 0.6) {
            connectionPositions.push(
              source.x,
              source.y,
              source.z,
              target.x,
              target.y,
              target.z,
            );
          }
        }
      });
      const connectionGeometry = new BufferGeometry();
      connectionGeometry.setAttribute(
        "position",
        new Float32BufferAttribute(connectionPositions, 3),
      );
      const connectionMaterial = new LineBasicMaterial({
        color: new Color(palette.primaryContainer),
        opacity: 0.45,
        transparent: true,
      });
      const connections = new LineSegments(connectionGeometry, connectionMaterial);
      brainGroup.add(connections);

      // AI layers (input → transformer → output)
      const layerX = [1.2, 2.35, 3.5];
      const layerHeights = [0.9, 1.6, 0.7];
      const layerCounts = [10, 18, 6];
      const aiNodeGeometry = new SphereGeometry(0.055, 16, 16);
      const aiNodeMaterial = new MeshPhysicalMaterial({
        color: new Color(palette.secondaryContainer),
        emissive: new Color(palette.secondaryContainer),
        emissiveIntensity: 0.32,
        roughness: 0.3,
        transmission: 0.18,
        thickness: 0.5,
        transparent: true,
        opacity: 0.94,
      });

      const aiLayerNodes: Vector3[][] = [];
      layerX.forEach((x, idx) => {
        const count = layerCounts[idx];
        const verticalSpan = layerHeights[idx];
        const instancedMesh = new InstancedMesh(aiNodeGeometry, aiNodeMaterial, count);
        const layerPositions: Vector3[] = [];
        for (let i = 0; i < count; i += 1) {
          const y = (i / (count - 1 || 1)) * verticalSpan - verticalSpan / 2 + 0.5;
          const z = Math.sin((i / (count - 1 || 1)) * Math.PI * 2) * 0.8 * (idx === 1 ? 1.1 : 0.7);
          const pos = new Vector3(x, y, z);
          layerPositions.push(pos);
          neuronMatrix.makeTranslation(pos.x, pos.y, pos.z);
          instancedMesh.setMatrixAt(i, neuronMatrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        aiLayerNodes.push(layerPositions);
        aiGroup.add(instancedMesh);
      });

      // AI edges
      const aiEdgePositions: number[] = [];
      const aiEdgeGeometry = new BufferGeometry();
      for (let l = 0; l < aiLayerNodes.length - 1; l += 1) {
        const current = aiLayerNodes[l];
        const next = aiLayerNodes[l + 1];
        current.forEach((from) => {
          next.forEach((to) => {
            aiEdgePositions.push(from.x, from.y, from.z, to.x, to.y, to.z);
          });
        });
      }
      aiEdgeGeometry.setAttribute("position", new Float32BufferAttribute(aiEdgePositions, 3));
      const aiEdgeMaterial = new LineBasicMaterial({
        color: new Color(palette.onSurface),
        opacity: 0.25,
        transparent: true,
      });
      const aiEdges = new LineSegments(aiEdgeGeometry, aiEdgeMaterial);
      aiGroup.add(aiEdges);

      // Bridge arcs between biological and artificial networks
      const bridgeMaterial = new MeshPhysicalMaterial({
        color: new Color(palette.onSurface),
        emissive: new Color(palette.onSurface),
        emissiveIntensity: 0.12,
        roughness: 0.4,
        transmission: 0.06,
        transparent: true,
        opacity: 0.4,
      });
      const bridgeAnchors: [Vector3, Vector3][] = [
        [new Vector3(-1.2, 1.1, 0.4), new Vector3(1.6, 1.2, 0.5)],
        [new Vector3(-1.6, 0.2, -0.2), new Vector3(1.5, 0.1, -0.3)],
        [new Vector3(-1.1, -0.7, 0.3), new Vector3(1.6, -0.6, 0.35)],
      ];
      bridgeAnchors.forEach(([start, end]) => {
        const mid = start.clone().add(end).multiplyScalar(0.5).add(new Vector3(0, 0.45, 0));
        const curve = new CatmullRomCurve3([start, mid, end]);
        const tube = new Mesh(new TubeGeometry(curve, 40, 0.02, 8, false), bridgeMaterial);
        bridgeGroup.add(tube);
      });

      // Ambient particle field
      const particleGeometry = new BufferGeometry();
      const particleCount = 320;
      const particlePositions = new Float32BufferAttribute(particleCount * 3, 3);
      for (let i = 0; i < particleCount; i += 1) {
        const radius = 3 + Math.random() * 1.2;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        particlePositions.setXYZ(
          i,
          radius * Math.cos(phi) * Math.sin(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(theta),
        );
      }
      particleGeometry.setAttribute("position", particlePositions);
      const particleMaterial = new PointsMaterial({
        color: new Color(palette.secondaryContainer),
        size: 0.035,
        transparent: true,
        opacity: 0.5,
        blending: AdditiveBlending,
      });
      const particles = new Points(particleGeometry, particleMaterial);

      brainGroup.position.x = -0.4;
      aiGroup.position.x = 0.2;
      bridgeGroup.position.x = 0.1;
      scene.add(brainGroup, aiGroup, bridgeGroup, particles);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableDamping = true;
      controls.minDistance = 4;
      controls.maxDistance = 12;

      const clock = new Clock();
      let frameId = 0;

      const animate = () => {
        if (stopped) return;
        const t = clock.getElapsedTime();

        // Pulse brain emissive + sway
        const pulse = 0.6 + Math.sin(t * 1.3) * 0.2;
        neuronMaterial.emissiveIntensity = 0.25 + pulse * 0.25;
        neuronMesh.rotation.y = Math.sin(t * 0.25) * 0.08;

        // Flow edges to mimic attention refresh
        aiEdgeMaterial.opacity = 0.18 + Math.sin(t * 0.9) * 0.06;
        aiGroup.rotation.y = Math.sin(t * 0.18) * 0.05;

        bridgeGroup.children.forEach((child, idx) => {
          child.position.y = Math.sin(t * 0.9 + idx) * 0.05;
          child.rotation.z = Math.sin(t * 0.5 + idx) * 0.04;
        });

        particles.rotation.y = t * 0.05;
        particles.position.y = Math.sin(t * 0.6) * 0.04;

        controls.update();
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth || 1;
        const height = containerRef.current.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        stopped = true;
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
        controls.dispose();
        neuronGeometry.dispose();
        neuronMaterial.dispose();
        connectionGeometry.dispose();
        connectionMaterial.dispose();
        aiNodeGeometry.dispose();
        aiNodeMaterial.dispose();
        aiEdgeGeometry.dispose();
        aiEdgeMaterial.dispose();
        bridgeMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
        containerRef.current?.replaceChildren();
      };
    };

    init();
    return () => cleanup();
  }, [palette]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 360, md: 520 },
        borderRadius: 3,
        overflow: "hidden",
        background: `radial-gradient(circle at 28% 22%, ${alpha(palette.primaryContainer, 0.18)}, transparent 45%), radial-gradient(circle at 78% 26%, ${alpha(palette.secondaryContainer, 0.16)}, transparent 48%), linear-gradient(135deg, ${alpha(palette.surfaceContainer, 1)}, ${alpha(palette.surfaceContainer, 0.85)})`,
        border: `1px solid ${alpha(palette.outlineVariant, 0.8)}`,
        boxShadow: `0 32px 90px ${alpha(palette.onSurface, 0.16)}`,
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          "& canvas": { display: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 99,
          backgroundColor: alpha(palette.surfaceContainer, 0.72),
          border: `1px solid ${alpha(palette.outlineVariant, 0.9)}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: rendererInfo === "webgpu" ? palette.primaryContainer : palette.secondaryContainer,
            boxShadow: `0 0 0 6px ${alpha(rendererInfo === "webgpu" ? palette.primaryContainer : palette.secondaryContainer, 0.35)}`,
          }}
        />
        <Typography variant="labelMedium" sx={{ color: palette.onSurface }}>
          {rendererInfo === "webgpu"
            ? "WebGPU pipeline active"
            : rendererInfo === "webgl2"
              ? "WebGL2 fallback active"
              : "Initializing visualization"}
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          px: 1.25,
          py: 0.65,
          borderRadius: 12,
          backgroundColor: alpha(palette.surfaceContainer, 0.8),
          border: `1px solid ${alpha(palette.outlineVariant, 0.9)}`,
          color: palette.onSurface,
          fontSize: 12,
          letterSpacing: 0.4,
        }}
      >
        Brain mesh → Attention stack → Output tokens
      </Box>
    </Box>
  );
}
