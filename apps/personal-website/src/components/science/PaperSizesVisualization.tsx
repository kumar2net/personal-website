import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type RendererInfo = "webgpu" | "webgl2" | "";

const paperSizes = [
  { name: "A0", width: 0.841, height: 1.189, label: "841 x 1189 mm" },
  { name: "A1", width: 0.594, height: 0.841, label: "594 x 841 mm" },
  { name: "A2", width: 0.42, height: 0.594, label: "420 x 594 mm" },
  { name: "A3", width: 0.297, height: 0.42, label: "297 x 420 mm" },
  { name: "A4", width: 0.21, height: 0.297, label: "210 x 297 mm" },
];

export default function PaperSizesVisualization() {
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
        AmbientLight,
        Color,
        DirectionalLight,
        EdgesGeometry,
        Group,
        Line,
        LineBasicMaterial,
        LineSegments,
        Mesh,
        MeshPhysicalMaterial,
        PerspectiveCamera,
        PlaneGeometry,
        Scene,
        Clock,
        Vector3,
        RingGeometry,
        BufferGeometry,
        Float32BufferAttribute,
      } = THREE;

      const canvasWidth = containerRef.current.clientWidth || 1;
      const canvasHeight = containerRef.current.clientHeight || 1;

      const scene = new Scene();
      scene.background = new Color(palette.surfaceContainer);

      const camera = new PerspectiveCamera(46, canvasWidth / canvasHeight, 0.1, 100);
      camera.position.set(0.1, 1.25, 6.2);

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

      const ambient = new AmbientLight(palette.onSurface, 0.26);
      const keyLight = new DirectionalLight(palette.primaryContainer, 1.1);
      keyLight.position.set(2.8, 4.2, 3);
      const rimLight = new DirectionalLight(palette.secondaryContainer, 0.8);
      rimLight.position.set(-3, 2, -2);
      scene.add(ambient, keyLight, rimLight);

      const sceneGroup = new Group();
      const paperGroup = new Group();
      const goldenGroup = new Group();
      const piGroup = new Group();
      sceneGroup.add(paperGroup, goldenGroup, piGroup);
      scene.add(sceneGroup);

      const planeGeometry = new PlaneGeometry(1, 1);
      const edgeGeometry = new EdgesGeometry(planeGeometry);
      const geometries: Array<import("three").BufferGeometry> = [planeGeometry, edgeGeometry];
      const materials: Array<import("three").Material> = [];

      const baseColor = new Color(palette.primaryContainer);
      const accentColor = new Color(palette.secondaryContainer);
      const outlineColor = new Color(palette.onSurface);

      const stackScale = 2.4 / paperSizes[0].height;
      const sheets: Array<{
        mesh: import("three").Mesh;
        outline: import("three").LineSegments;
        anchor: import("three").Vector3;
      }> = [];

      paperSizes.forEach((size, index) => {
        const blend = index / Math.max(paperSizes.length - 1, 1);
        const tint = baseColor.clone().lerp(accentColor, blend);
        const material = new MeshPhysicalMaterial({
          color: tint,
          emissive: tint.clone().multiplyScalar(0.38),
          emissiveIntensity: 0.12,
          roughness: 0.3,
          metalness: 0.08,
          transparent: true,
          opacity: 0.88,
          transmission: 0.1,
          thickness: 0.35,
        });
        materials.push(material);
        const mesh = new Mesh(planeGeometry, material);
        mesh.scale.set(size.width * stackScale, size.height * stackScale, 1);
        mesh.position.set(0, index * 0.03, -index * 0.22);

        const outlineMaterial = new LineBasicMaterial({
          color: outlineColor,
          transparent: true,
          opacity: 0.45,
        });
        materials.push(outlineMaterial);
        const outline = new LineSegments(edgeGeometry, outlineMaterial);
        outline.scale.copy(mesh.scale);
        outline.position.copy(mesh.position);

        paperGroup.add(mesh, outline);
        sheets.push({
          mesh,
          outline,
          anchor: mesh.position.clone(),
        });
      });

      paperGroup.position.set(-2.0, 0, 0.3);
      paperGroup.rotation.x = -0.14;
      paperGroup.rotation.y = 0.06;

      const phi = (1 + Math.sqrt(5)) / 2;
      const goldenMaterial = new MeshPhysicalMaterial({
        color: accentColor.clone().lerp(baseColor, 0.35),
        emissive: accentColor.clone().multiplyScalar(0.35),
        emissiveIntensity: 0.16,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
        transmission: 0.12,
        thickness: 0.4,
      });
      materials.push(goldenMaterial);
      const goldenMesh = new Mesh(planeGeometry, goldenMaterial);
      goldenMesh.scale.set(1.7, 1.7 * phi, 1);
      goldenMesh.position.set(0, 0.08, 0);

      const goldenOutlineMaterial = new LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0.5,
      });
      materials.push(goldenOutlineMaterial);
      const goldenOutline = new LineSegments(edgeGeometry, goldenOutlineMaterial);
      goldenOutline.scale.copy(goldenMesh.scale);
      goldenOutline.position.copy(goldenMesh.position);

      const spiralPoints: Vector3[] = [];
      const spiralTurns = 3.4 * Math.PI;
      const spiralScale = 0.06;
      for (let t = 0; t <= spiralTurns; t += spiralTurns / 140) {
        const radius = spiralScale * Math.pow(phi, t / (Math.PI / 2));
        spiralPoints.push(new Vector3(
          radius * Math.cos(t),
          radius * Math.sin(t),
          0.02,
        ));
      }
      const spiralGeometry = new BufferGeometry();
      spiralGeometry.setAttribute(
        "position",
        new Float32BufferAttribute(
          spiralPoints.flatMap((point) => [point.x, point.y, point.z]),
          3,
        ),
      );
      geometries.push(spiralGeometry);
      const spiralMaterial = new LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.7,
      });
      materials.push(spiralMaterial);
      const spiral = new Line(spiralGeometry, spiralMaterial);
      goldenGroup.add(goldenMesh, goldenOutline, spiral);
      goldenGroup.position.set(0, -0.05, 0);
      goldenGroup.rotation.x = -0.08;
      goldenGroup.rotation.y = -0.08;

      const piRingGeometry = new RingGeometry(0.48, 0.52, 80);
      geometries.push(piRingGeometry);
      const piRingMaterial = new MeshPhysicalMaterial({
        color: baseColor.clone().lerp(accentColor, 0.6),
        emissive: baseColor.clone().multiplyScalar(0.35),
        emissiveIntensity: 0.2,
        roughness: 0.2,
        metalness: 0.12,
        transparent: true,
        opacity: 0.85,
        transmission: 0.08,
      });
      materials.push(piRingMaterial);
      const piRing = new Mesh(piRingGeometry, piRingMaterial);

      const piStripGeometry = new PlaneGeometry(Math.PI * 0.95, 0.18);
      geometries.push(piStripGeometry);
      const piStripMaterial = new MeshPhysicalMaterial({
        color: accentColor,
        emissive: accentColor.clone().multiplyScalar(0.3),
        emissiveIntensity: 0.14,
        roughness: 0.25,
        metalness: 0.05,
        transparent: true,
        opacity: 0.85,
        transmission: 0.1,
      });
      materials.push(piStripMaterial);
      const piStrip = new Mesh(piStripGeometry, piStripMaterial);
      piStrip.position.set(0, -0.9, 0);

      const piOutlineMaterial = new LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0.45,
      });
      materials.push(piOutlineMaterial);
      const ringOutline = new LineSegments(new EdgesGeometry(piRingGeometry), piOutlineMaterial);
      const stripOutline = new LineSegments(new EdgesGeometry(piStripGeometry), piOutlineMaterial);
      geometries.push(ringOutline.geometry, stripOutline.geometry);

      piGroup.add(piRing, piStrip, ringOutline, stripOutline);
      piGroup.position.set(2.0, 0.2, 0.1);
      piGroup.rotation.x = -0.12;
      piGroup.rotation.y = 0.12;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 3.4;
      controls.maxDistance = 8;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI * 0.6;

      const clock = new Clock();
      let frameId = 0;

      const animate = () => {
        if (stopped) return;
        const t = clock.getElapsedTime();

        sceneGroup.rotation.y = t * 0.12;
        sceneGroup.rotation.x = -0.04 + Math.sin(t * 0.14) * 0.04;

        sheets.forEach((sheet, index) => {
          const drift = Math.sin(t * 0.9 + index) * 0.03;
          sheet.mesh.position.y = sheet.anchor.y + drift;
          sheet.outline.position.y = sheet.anchor.y + drift;
        });

        goldenGroup.rotation.z = Math.sin(t * 0.3) * 0.08;
        piGroup.rotation.z = Math.sin(t * 0.28 + 0.8) * 0.06;

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
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
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
        background: `radial-gradient(circle at 25% 25%, ${alpha(palette.primaryContainer, 0.16)}, transparent 45%), radial-gradient(circle at 78% 22%, ${alpha(palette.secondaryContainer, 0.14)}, transparent 48%), linear-gradient(140deg, ${alpha(palette.surfaceContainer, 1)}, ${alpha(palette.surfaceContainer, 0.86)})`,
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
          top: 14,
          left: 14,
          px: 1.4,
          py: 0.8,
          borderRadius: 2,
          backgroundColor: alpha(palette.surfaceContainer, 0.82),
          border: `1px solid ${alpha(palette.outlineVariant, 0.9)}`,
          backdropFilter: "blur(10px)",
          maxWidth: 260,
        }}
      >
        <Typography variant="labelLarge" sx={{ color: palette.onSurface }}>
          Ratios that keep a shape
        </Typography>
        <Typography variant="bodySmall" sx={{ color: alpha(palette.onSurface, 0.8) }}>
          A-series uses sqrt(2). Golden rectangles use phi. Circles whisper pi.
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          px: 1.25,
          py: 0.8,
          borderRadius: 2,
          backgroundColor: alpha(palette.surfaceContainer, 0.82),
          border: `1px solid ${alpha(palette.outlineVariant, 0.9)}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={0.6}>
          <Typography variant="labelSmall" sx={{ color: palette.onSurface }}>
            A-series sizes
          </Typography>
          {paperSizes.map((size) => (
            <Typography
              key={size.name}
              variant="labelSmall"
              sx={{ color: palette.onSurface, letterSpacing: 0.2 }}
            >
              {size.name}: {size.label}
            </Typography>
          ))}
          <Typography
            variant="labelSmall"
            sx={{ color: alpha(palette.onSurface, 0.8) }}
          >
            phi ≈ 1.618 | pi ≈ 3.1416
          </Typography>
        </Stack>
      </Box>
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
          bottom: 12,
          right: 16,
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
        Drag to orbit the trio
      </Box>
    </Box>
  );
}
