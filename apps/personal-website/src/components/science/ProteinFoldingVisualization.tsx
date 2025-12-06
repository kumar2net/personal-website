import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type RendererInfo = "webgpu" | "webgl2" | "";

export default function ProteinFoldingVisualization() {
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
        CatmullRomCurve3,
        TubeGeometry,
        MeshPhysicalMaterial,
        Mesh,
        Clock,
        BufferGeometry,
        Float32BufferAttribute,
        PointsMaterial,
        Points,
        LineBasicMaterial,
        Line,
        AdditiveBlending,
      } = THREE;

      const canvasWidth = containerRef.current.clientWidth || 1;
      const canvasHeight = containerRef.current.clientHeight || 1;

      const scene = new Scene();
      scene.background = new Color(palette.surfaceContainer);

      const camera = new PerspectiveCamera(48, canvasWidth / canvasHeight, 0.1, 100);
      camera.position.set(0, 1.4, 4.2);

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

      const ambient = new AmbientLight(palette.onSurface, 0.35);
      const keyLight = new DirectionalLight(palette.primaryContainer, 1.1);
      keyLight.position.set(3, 4, 3);
      const rimLight = new DirectionalLight(palette.secondaryContainer, 0.8);
      rimLight.position.set(-2, 1.5, -2);
      scene.add(ambient, keyLight, rimLight);

      const chainGroup = new Group();
      const curveA = new CatmullRomCurve3(
        [
          new THREE.Vector3(-0.8, 0.3, 0.2),
          new THREE.Vector3(-0.4, 0.6, -0.5),
          new THREE.Vector3(0.1, 0.2, -0.3),
          new THREE.Vector3(0.45, 0.1, 0.35),
          new THREE.Vector3(0.8, 0.45, 0.1),
        ],
        false,
        "centripetal",
      );
      const curveB = new CatmullRomCurve3(
        [
          new THREE.Vector3(-0.9, -0.2, -0.1),
          new THREE.Vector3(-0.35, -0.55, 0.4),
          new THREE.Vector3(0.15, -0.35, 0.6),
          new THREE.Vector3(0.5, -0.4, -0.2),
          new THREE.Vector3(0.95, -0.1, -0.35),
        ],
        false,
        "centripetal",
      );

      const tubeMaterialA = new MeshPhysicalMaterial({
        color: new Color(palette.primaryContainer),
        emissive: new Color(palette.primaryContainer),
        emissiveIntensity: 0.24,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.18,
        thickness: 0.35,
        transparent: true,
        opacity: 0.9,
      });

      const tubeMaterialB = new MeshPhysicalMaterial({
        color: new Color(palette.secondaryContainer),
        emissive: new Color(palette.secondaryContainer),
        emissiveIntensity: 0.22,
        metalness: 0.08,
        roughness: 0.25,
        transmission: 0.12,
        thickness: 0.35,
        transparent: true,
        opacity: 0.88,
      });

      const tubeA = new Mesh(new TubeGeometry(curveA, 160, 0.06, 16, false), tubeMaterialA);
      const tubeB = new Mesh(new TubeGeometry(curveB, 160, 0.06, 16, false), tubeMaterialB);

      const bridges = new Group();
      const bridgeMaterial = new LineBasicMaterial({
        color: new Color(palette.onSurface),
        linewidth: 2,
        opacity: 0.85,
        transparent: true,
      });
      const bridgeAnchors = [
        [curveA.getPointAt(0.22), curveB.getPointAt(0.18)],
        [curveA.getPointAt(0.48), curveB.getPointAt(0.52)],
        [curveA.getPointAt(0.72), curveB.getPointAt(0.70)],
      ];
      bridgeAnchors.forEach(([start, end]) => {
        const geometry = new BufferGeometry().setFromPoints([start, end]);
        bridges.add(new Line(geometry, bridgeMaterial));
      });

      const energyFieldGeometry = new BufferGeometry();
      const particleCount = 240;
      const positions = new Float32BufferAttribute(particleCount * 3, 3);
      for (let i = 0; i < particleCount; i += 1) {
        const radius = 0.6 + Math.random() * 0.8;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        positions.setXYZ(
          i,
          radius * Math.cos(phi) * Math.sin(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(theta),
        );
      }
      energyFieldGeometry.setAttribute("position", positions);
      const energyMaterial = new PointsMaterial({
        color: new Color(palette.primaryContainer),
        size: 0.035,
        transparent: true,
        opacity: 0.6,
        blending: AdditiveBlending,
      });
      const energyField = new Points(energyFieldGeometry, energyMaterial);

      chainGroup.add(tubeA, tubeB, bridges, energyField);
      scene.add(chainGroup);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.minDistance = 2.2;
      controls.maxDistance = 5;

      const clock = new Clock();
      let frameId = 0;
      const animate = () => {
        if (stopped) return;
        const t = clock.getElapsedTime();

        tubeA.rotation.z = Math.sin(t * 0.4) * 0.12;
        tubeB.rotation.z = -Math.sin(t * 0.35) * 0.1;
        bridges.children.forEach((bridge, index) => {
          bridge.rotation.y = Math.sin(t * 0.6 + index) * 0.08;
        });
        energyField.rotation.y = Math.sin(t * 0.2) * 0.3;
        energyField.position.y = Math.sin(t * 0.45) * 0.05;

        const pulse = 0.9 + Math.sin(t * 0.8) * 0.08;
        tubeMaterialA.emissiveIntensity = 0.2 + THREE.MathUtils.clamp(pulse * 0.12, 0.18, 0.32);
        tubeMaterialB.emissiveIntensity = 0.2 + THREE.MathUtils.clamp(pulse * 0.1, 0.16, 0.3);

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
        tubeMaterialA.dispose();
        tubeMaterialB.dispose();
        bridgeMaterial.dispose();
        energyMaterial.dispose();
        energyFieldGeometry.dispose();
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
        height: { xs: 340, md: 440 },
        borderRadius: 3,
        overflow: "hidden",
        background: `radial-gradient(circle at 25% 20%, ${alpha(palette.primaryContainer, 0.18)}, transparent 45%), radial-gradient(circle at 80% 30%, ${alpha(palette.secondaryContainer, 0.16)}, transparent 48%), ${palette.surfaceContainer}`,
        border: `1px solid ${alpha(palette.outlineVariant, 0.8)}`,
        boxShadow: `0 30px 80px ${alpha(palette.onSurface, 0.14)}`,
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
            ? "Live WebGPU renderer"
            : rendererInfo === "webgl2"
              ? "WebGL2 fallback active"
              : "Initializing visualization"}
        </Typography>
      </Box>
    </Box>
  );
}
