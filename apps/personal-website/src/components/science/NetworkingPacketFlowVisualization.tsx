import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Chip, Divider, Slider, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

type RendererInfo = "webgpu" | "webgl2" | "unavailable" | "";
type Rgb = [number, number, number];
type Rgba = [number, number, number, number];

type FlowControls = {
  rate: number;
  loss: number;
  jitter: number;
};

type FlowMetrics = {
  activePackets: number;
  deliveredPackets: number;
  droppedPackets: number;
  averagePathMs: number;
};

type NodeDefinition = {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
  color: Rgb;
};

type NodePoint = NodeDefinition & {
  px: number;
  py: number;
};

type Packet = {
  segmentIndex: number;
  progress: number;
  speed: number;
  sway: number;
  swayPhase: number;
  bornAt: number;
  radius: number;
  tint: number;
};

type Burst = {
  x: number;
  y: number;
  radius: number;
  growth: number;
  alpha: number;
  color: Rgb;
};

type TriangleRenderer = {
  kind: Exclude<RendererInfo, "" | "unavailable">;
  render: (vertices: Float32Array, clearColor: Rgb) => void;
  destroy: () => void;
};

const DEFAULT_CONTROLS: FlowControls = {
  rate: 60,
  loss: 0,
  jitter: 8,
};

const DEFAULT_METRICS: FlowMetrics = {
  activePackets: 0,
  deliveredPackets: 0,
  droppedPackets: 0,
  averagePathMs: 720,
};

const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    id: "client",
    label: "Client",
    subtitle: "Phone or laptop",
    description: "Origin of the request. Packets leave here first.",
    x: 0.04,
    y: 0.72,
    labelDx: 18,
    labelDy: 58,
    color: [110, 231, 255],
  },
  {
    id: "wifi",
    label: "Wi-Fi AP",
    subtitle: "2.4 / 5 / 6 GHz",
    description: "The radio hop. Congestion and interference usually show up here.",
    x: 0.28,
    y: 0.28,
    labelDx: 0,
    labelDy: -56,
    color: [123, 246, 176],
  },
  {
    id: "router",
    label: "Router",
    subtitle: "NAT + LAN edge",
    description: "Moves traffic from your local network out to the ISP path.",
    x: 0.5,
    y: 0.62,
    labelDx: 0,
    labelDy: 54,
    color: [255, 131, 117],
  },
  {
    id: "dns",
    label: "DNS",
    subtitle: "Resolver lookup",
    description: "Translates a human name like google.com into an IP address.",
    x: 0.72,
    y: 0.24,
    labelDx: 0,
    labelDy: -58,
    color: [180, 152, 255],
  },
  {
    id: "internet",
    label: "Internet",
    subtitle: "Upstream services",
    description: "Destination network. The request exits your home network here.",
    x: 0.94,
    y: 0.52,
    labelDx: -24,
    labelDy: 52,
    color: [255, 196, 93],
  },
];

const SCENE_CLEAR: Rgb = [8, 14, 24];
const MAX_PACKETS = 520;
const BASE_SEGMENTS_PER_SECOND = 3.7;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

function rgba(color: Rgb, alphaValue = 1): Rgba {
  return [color[0] / 255, color[1] / 255, color[2] / 255, alphaValue];
}

function rgbCss(color: Rgb, alphaValue = 1) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alphaValue})`;
}

function toClipX(x: number, width: number) {
  return (x / width) * 2 - 1;
}

function toClipY(y: number, height: number) {
  return 1 - (y / height) * 2;
}

function pushVertex(
  list: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  color: Rgba,
) {
  list.push(toClipX(x, width), toClipY(y, height), ...color);
}

function pushTriangle(
  list: number[],
  width: number,
  height: number,
  a: [number, number],
  b: [number, number],
  c: [number, number],
  color: Rgba,
) {
  pushVertex(list, a[0], a[1], width, height, color);
  pushVertex(list, b[0], b[1], width, height, color);
  pushVertex(list, c[0], c[1], width, height, color);
}

function pushCircle(
  list: number[],
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
  color: Rgba,
  segments = 18,
) {
  for (let index = 0; index < segments; index += 1) {
    const startAngle = (index / segments) * Math.PI * 2;
    const endAngle = ((index + 1) / segments) * Math.PI * 2;
    const p1: [number, number] = [
      x + Math.cos(startAngle) * radius,
      y + Math.sin(startAngle) * radius,
    ];
    const p2: [number, number] = [
      x + Math.cos(endAngle) * radius,
      y + Math.sin(endAngle) * radius,
    ];
    pushTriangle(list, width, height, [x, y], p1, p2, color);
  }
}

function pushQuad(
  list: number[],
  ax: number,
  ay: number,
  bx: number,
  by: number,
  thickness: number,
  width: number,
  height: number,
  color: Rgba,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy) || 1;
  const nx = (-dy / length) * thickness * 0.5;
  const ny = (dx / length) * thickness * 0.5;
  const p1: [number, number] = [ax + nx, ay + ny];
  const p2: [number, number] = [ax - nx, ay - ny];
  const p3: [number, number] = [bx - nx, by - ny];
  const p4: [number, number] = [bx + nx, by + ny];
  pushTriangle(list, width, height, p1, p2, p3, color);
  pushTriangle(list, width, height, p1, p3, p4, color);
}

function sampleSegmentPoint(start: NodePoint, end: NodePoint, t: number, offset = 0) {
  const x = lerp(start.px, end.px, t);
  const y = lerp(start.py, end.py, t);
  const dx = end.px - start.px;
  const dy = end.py - start.py;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  return {
    x: x + nx * offset,
    y: y + ny * offset,
  };
}

function createNodePoints(width: number, height: number): NodePoint[] {
  const padX = width * 0.08;
  const padY = height * 0.16;
  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;

  return NODE_DEFINITIONS.map((node) => ({
    ...node,
    px: padX + node.x * usableWidth,
    py: padY + node.y * usableHeight,
  }));
}

function buildSceneVertices(
  nodePoints: NodePoint[],
  packets: Packet[],
  bursts: Burst[],
  width: number,
  height: number,
  dpr: number,
  timeSeconds: number,
) {
  const vertices: number[] = [];
  const packetDensity = clamp(packets.length / 190, 0, 1);
  const laneThickness = 22 * dpr;

  for (let index = 0; index < nodePoints.length - 1; index += 1) {
    const start = nodePoints[index];
    const end = nodePoints[index + 1];
    const blend = mixRgb(start.color, end.color, 0.5);

    pushQuad(
      vertices,
      start.px,
      start.py,
      end.px,
      end.py,
      laneThickness * 1.5,
      width,
      height,
      rgba(blend, 0.08),
    );
    pushQuad(
      vertices,
      start.px,
      start.py,
      end.px,
      end.py,
      laneThickness * 0.58,
      width,
      height,
      rgba(blend, 0.22 + packetDensity * 0.06),
    );

    const pulseCount = 3;
    for (let pulseIndex = 0; pulseIndex < pulseCount; pulseIndex += 1) {
      const travel =
        (timeSeconds * (0.18 + packetDensity * 0.12) + pulseIndex / pulseCount + index * 0.17) %
        1;
      const pulsePoint = sampleSegmentPoint(
        start,
        end,
        travel,
        Math.sin(timeSeconds * 4 + pulseIndex + index) * 5 * dpr,
      );
      const pulseColor = mixRgb(blend, [255, 255, 255], 0.12);
      pushCircle(
        vertices,
        pulsePoint.x,
        pulsePoint.y,
        (12 + packetDensity * 8) * dpr,
        width,
        height,
        rgba(pulseColor, 0.05 + packetDensity * 0.07),
        18,
      );
    }
  }

  bursts.forEach((burst) => {
    pushCircle(
      vertices,
      burst.x,
      burst.y,
      burst.radius,
      width,
      height,
      rgba(burst.color, burst.alpha * 0.45),
      20,
    );
    pushCircle(
      vertices,
      burst.x,
      burst.y,
      burst.radius * 0.45,
      width,
      height,
      rgba(mixRgb(burst.color, [255, 255, 255], 0.2), burst.alpha),
      18,
    );
  });

  packets.forEach((packet) => {
    const start = nodePoints[packet.segmentIndex];
    const end = nodePoints[packet.segmentIndex + 1];
    const wobble =
      Math.sin(timeSeconds * 6 + packet.swayPhase + packet.progress * 15) * packet.sway;
    const point = sampleSegmentPoint(start, end, packet.progress, wobble);
    const packetColor = mixRgb(start.color, end.color, packet.tint);

    pushCircle(
      vertices,
      point.x,
      point.y,
      (packet.radius + 4) * dpr,
      width,
      height,
      rgba(packetColor, 0.16),
      18,
    );
    pushCircle(
      vertices,
      point.x,
      point.y,
      packet.radius * dpr,
      width,
      height,
      rgba(mixRgb(packetColor, [255, 255, 255], 0.2), 0.96),
      16,
    );
  });

  nodePoints.forEach((node) => {
    pushCircle(
      vertices,
      node.px,
      node.py,
      34 * dpr,
      width,
      height,
      rgba(node.color, 0.12),
      24,
    );
    pushCircle(
      vertices,
      node.px,
      node.py,
      17 * dpr,
      width,
      height,
      rgba(node.color, 0.86),
      24,
    );
    pushCircle(
      vertices,
      node.px,
      node.py,
      8 * dpr,
      width,
      height,
      rgba(mixRgb(node.color, [255, 255, 255], 0.35), 1),
      20,
    );
  });

  return new Float32Array(vertices);
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create WebGL shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) || "Unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(error);
  }

  return shader;
}

function createWebGlRenderer(canvas: HTMLCanvasElement): TriangleRenderer | null {
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
  });

  if (!gl) {
    return null;
  }

  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    `#version 300 es
    layout(location = 0) in vec2 aPosition;
    layout(location = 1) in vec4 aColor;
    out vec4 vColor;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vColor = aColor;
    }`,
  );
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 outColor;
    void main() {
      outColor = vColor;
    }`,
  );

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) || "Unknown program link error";
    gl.deleteProgram(program);
    throw new Error(error);
  }

  const buffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  if (!buffer || !vao) {
    gl.deleteBuffer(buffer);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
    return null;
  }

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 8);
  gl.bindVertexArray(null);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA,
    gl.ONE,
    gl.ONE_MINUS_SRC_ALPHA,
  );

  return {
    kind: "webgl2",
    render(vertices, clearColor) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(
        clearColor[0] / 255,
        clearColor[1] / 255,
        clearColor[2] / 255,
        1,
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 6);
      gl.bindVertexArray(null);
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}

async function createWebGpuRenderer(
  canvas: HTMLCanvasElement,
): Promise<TriangleRenderer | null> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return null;
  }

  const gpu = (navigator as Navigator & { gpu?: any }).gpu;
  if (!gpu?.requestAdapter || !gpu.getPreferredCanvasFormat) {
    return null;
  }

  const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter?.requestDevice) {
    return null;
  }

  const device = await adapter.requestDevice();
  const format = gpu.getPreferredCanvasFormat();

  const shaderModule = device.createShaderModule({
    code: `
      struct VertexOut {
        @builtin(position) position: vec4f,
        @location(0) color: vec4f,
      };

      @vertex
      fn vs(@location(0) position: vec2f, @location(1) color: vec4f) -> VertexOut {
        var out: VertexOut;
        out.position = vec4f(position, 0.0, 1.0);
        out.color = color;
        return out;
      }

      @fragment
      fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
        return color;
      }
    `,
  });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs",
      buffers: [
        {
          arrayStride: 24,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" },
            { shaderLocation: 1, offset: 8, format: "float32x4" },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs",
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: "src-alpha",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: { topology: "triangle-list" },
  });

  const context = canvas.getContext("webgpu") as
    | {
        configure: (options: Record<string, unknown>) => void;
        getCurrentTexture: () => { createView: () => unknown };
      }
    | null;
  if (!context) {
    return null;
  }

  context.configure({
    device,
    format,
    alphaMode: "premultiplied",
  });

  const gpuBufferUsage = (
    globalThis as typeof globalThis & {
      GPUBufferUsage?: { VERTEX: number; COPY_DST: number };
    }
  ).GPUBufferUsage;
  const vertexBufferUsage =
    (gpuBufferUsage?.VERTEX ?? 0x20) | (gpuBufferUsage?.COPY_DST ?? 0x08);

  let vertexBuffer: { destroy?: () => void } | null = null;
  let vertexCapacity = 0;

  const ensureBuffer = (requiredSize: number) => {
    if (requiredSize <= vertexCapacity && vertexBuffer) {
      return;
    }

    vertexBuffer?.destroy?.();
    vertexCapacity = Math.max(requiredSize, 24 * 2048);
    vertexBuffer = device.createBuffer({
      size: vertexCapacity,
      usage: vertexBufferUsage,
    });
  };

  return {
    kind: "webgpu",
    render(vertices, clearColor) {
      ensureBuffer(Math.max(vertices.byteLength, 24));
      device.queue.writeBuffer(vertexBuffer as object, 0, vertices);

      const encoder = device.createCommandEncoder();
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: {
              r: clearColor[0] / 255,
              g: clearColor[1] / 255,
              b: clearColor[2] / 255,
              a: 1,
            },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });

      renderPass.setPipeline(pipeline);
      renderPass.setVertexBuffer(0, vertexBuffer as object);
      renderPass.draw(vertices.length / 6);
      renderPass.end();
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      vertexBuffer?.destroy?.();
    },
  };
}

export default function NetworkingPacketFlowVisualization() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef({ width: 1, height: 1, dpr: 1 });
  const [controls, setControls] = useState<FlowControls>(DEFAULT_CONTROLS);
  const controlsRef = useRef<FlowControls>(DEFAULT_CONTROLS);
  const [rendererInfo, setRendererInfo] = useState<RendererInfo>("");
  const [metrics, setMetrics] = useState<FlowMetrics>(DEFAULT_METRICS);

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
    controlsRef.current = controls;
  }, [controls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return undefined;
    }

    let stopped = false;
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let renderer: TriangleRenderer | null = null;
    let nodePoints = createNodePoints(1, 1);
    let spawnBudget = 0;
    let lastTime = 0;
    let lastHudUpdate = 0;
    let smoothedPathMs = DEFAULT_METRICS.averagePathMs;
    let deliveredPackets = 0;
    let droppedPackets = 0;

    const packets: Packet[] = [];
    const bursts: Burst[] = [];

    const resize = () => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const width = Math.max(1, Math.floor((parent?.clientWidth || 1) * nextDpr));
      const height = Math.max(1, Math.floor((parent?.clientHeight || 1) * nextDpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      viewportRef.current = { width, height, dpr: nextDpr };
      nodePoints = createNodePoints(width, height);
    };

    const emitBurst = (x: number, y: number, color: Rgb, alpha = 0.9) => {
      bursts.push({
        x,
        y,
        radius: 10 * viewportRef.current.dpr,
        growth: 32 * viewportRef.current.dpr,
        alpha,
        color,
      });
    };

    const spawnPackets = (dt: number, nowSeconds: number) => {
      const { rate } = controlsRef.current;
      spawnBudget += rate * dt;

      while (spawnBudget >= 1 && packets.length < MAX_PACKETS) {
        spawnBudget -= 1;
        packets.push({
          segmentIndex: 0,
          progress: Math.random() * 0.08,
          speed: BASE_SEGMENTS_PER_SECOND * (0.88 + Math.random() * 0.34),
          sway: (2 + Math.random() * 4) * viewportRef.current.dpr,
          swayPhase: Math.random() * Math.PI * 2,
          bornAt: nowSeconds,
          radius: 2.8 + Math.random() * 1.5,
          tint: 0.28 + Math.random() * 0.22,
        });
      }
    };

    const advancePackets = (dt: number, nowSeconds: number) => {
      const { jitter, loss } = controlsRef.current;
      const congestion = clamp(packets.length / (MAX_PACKETS * 0.72), 0, 1);
      const slowdown = 1 - congestion * 0.38;

      for (let index = packets.length - 1; index >= 0; index -= 1) {
        const packet = packets[index];
        const jitterWave =
          1 + Math.sin(nowSeconds * 5.2 + packet.swayPhase) * (jitter / 85);
        const progressDelta =
          packet.speed * slowdown * Math.max(0.34, jitterWave) * dt;

        packet.progress += progressDelta;

        if (packet.progress < 1) {
          continue;
        }

        const segmentStart = nodePoints[packet.segmentIndex];
        const segmentEnd = nodePoints[packet.segmentIndex + 1];

        if (Math.random() < loss / 100) {
          const dropPoint = sampleSegmentPoint(segmentStart, segmentEnd, 0.92);
          emitBurst(dropPoint.x, dropPoint.y, [255, 93, 117], 0.92);
          packets.splice(index, 1);
          droppedPackets += 1;
          continue;
        }

        packet.progress -= 1;
        packet.segmentIndex += 1;
        packet.swayPhase += 0.45 + Math.random() * 0.4;

        if (packet.segmentIndex >= NODE_DEFINITIONS.length - 1) {
          emitBurst(segmentEnd.px, segmentEnd.py, segmentEnd.color, 0.88);
          smoothedPathMs =
            smoothedPathMs * 0.88 + (nowSeconds - packet.bornAt) * 1000 * 0.12;
          packets.splice(index, 1);
          deliveredPackets += 1;
        }
      }

      for (let index = bursts.length - 1; index >= 0; index -= 1) {
        const burst = bursts[index];
        burst.radius += burst.growth * dt;
        burst.alpha -= dt * 1.4;

        if (burst.alpha <= 0) {
          bursts.splice(index, 1);
        }
      }
    };

    const renderFrame = async () => {
      try {
        renderer = await createWebGpuRenderer(canvas);
        if (!renderer) {
          renderer = createWebGlRenderer(canvas);
        }
      } catch (error) {
        console.warn("Networking packet flow renderer init failed", error);
      }

      if (stopped) {
        renderer?.destroy();
        return;
      }

      setRendererInfo(renderer?.kind ?? "unavailable");
      resize();

      if (canvas.parentElement) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas.parentElement);
      }

      const tick = (timestamp: number) => {
        if (stopped) {
          return;
        }

        const nowSeconds = timestamp / 1000;
        if (!lastTime) {
          lastTime = nowSeconds;
        }

        const dt = Math.min(0.05, nowSeconds - lastTime);
        lastTime = nowSeconds;

        spawnPackets(dt, nowSeconds);
        advancePackets(dt, nowSeconds);

        const { width, height, dpr } = viewportRef.current;
        const vertices = buildSceneVertices(
          nodePoints,
          packets,
          bursts,
          width,
          height,
          dpr,
          nowSeconds,
        );

        renderer?.render(vertices, SCENE_CLEAR);

        if (nowSeconds - lastHudUpdate > 0.14) {
          lastHudUpdate = nowSeconds;
          setMetrics({
            activePackets: packets.length,
            deliveredPackets,
            droppedPackets,
            averagePathMs: Math.round(smoothedPathMs),
          });
        }

        frameId = window.requestAnimationFrame(tick);
      };

      frameId = window.requestAnimationFrame(tick);
    };

    renderFrame();

    return () => {
      stopped = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      renderer?.destroy();
    };
  }, [palette]);

  const handleSliderChange =
    (key: keyof FlowControls) => (_event: Event, value: number | number[]) => {
      const nextValue = Array.isArray(value) ? value[0] : value;
      setControls((current) => ({
        ...current,
        [key]: nextValue,
      }));
    };

  const successRate =
    metrics.deliveredPackets + metrics.droppedPackets > 0
      ? Math.round(
          (metrics.deliveredPackets /
            (metrics.deliveredPackets + metrics.droppedPackets)) *
            100,
        )
      : 100;

  return (
    <Stack gap={2.5}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "320px minmax(0, 1fr)",
          },
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${alpha(palette.outlineVariant, 0.8)}`,
          background: `linear-gradient(145deg, ${alpha(palette.surfaceContainer, 0.98)}, ${alpha(
            palette.surfaceContainer,
            0.92,
          )})`,
          boxShadow: `0 32px 96px ${alpha(palette.onSurface, 0.16)}`,
        }}
      >
        <Stack
          gap={2.5}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRight: {
              md: `1px solid ${alpha(palette.outlineVariant, 0.55)}`,
            },
            background: `linear-gradient(180deg, ${rgbCss(SCENE_CLEAR, 0)} 0%, ${alpha(
              palette.surfaceContainer,
              0.68,
            )} 100%)`,
          }}
        >
          <Stack gap={1.4}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip
                label={
                  rendererInfo === "webgpu"
                    ? "WebGPU active"
                    : rendererInfo === "webgl2"
                      ? "WebGL2 fallback"
                      : rendererInfo === "unavailable"
                        ? "Renderer unavailable"
                        : "Initializing"
                }
                size="small"
                sx={{
                  bgcolor:
                    rendererInfo === "webgpu"
                      ? alpha(palette.primaryContainer, 0.18)
                      : alpha(palette.secondaryContainer, 0.18),
                  color: palette.onSurface,
                  fontWeight: 700,
                }}
              />
              <Chip
                label="Client → Wi-Fi → Router → DNS → Internet"
                size="small"
                sx={{
                  bgcolor: alpha(palette.onSurface, 0.08),
                  color: alpha(palette.onSurface, 0.86),
                  fontWeight: 600,
                }}
              />
            </Stack>
            <Box>
              <Typography variant="titleLarge" sx={{ color: palette.onSurface }}>
                Packet Flow
              </Typography>
              <Typography
                variant="bodySmall"
                sx={{ color: alpha(palette.onSurface, 0.78), mt: 0.4 }}
              >
                Turn the knobs to feel congestion. More rate raises queue pressure,
                loss drops packets at hand-offs, and jitter warps travel time.
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {[
              {
                label: "Active",
                value: metrics.activePackets.toString(),
              },
              {
                label: "Avg path",
                value: `${metrics.averagePathMs} ms`,
              },
              {
                label: "Delivered",
                value: metrics.deliveredPackets.toString(),
              },
              {
                label: "Success",
                value: `${successRate}%`,
              },
            ].map((metric) => (
              <Box
                key={metric.label}
                sx={{
                  borderRadius: 2.5,
                  p: 1.5,
                  border: `1px solid ${alpha(palette.outlineVariant, 0.45)}`,
                  backgroundColor: alpha(palette.onSurface, 0.03),
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{ color: alpha(palette.onSurface, 0.68) }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="titleMedium"
                  sx={{ color: palette.onSurface, mt: 0.2 }}
                >
                  {metric.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor: alpha(palette.outlineVariant, 0.6) }} />

          <Stack gap={2.25}>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
              >
                <Typography variant="labelLarge" sx={{ color: palette.onSurface }}>
                  Packet rate
                </Typography>
                <Typography
                  variant="labelMedium"
                  sx={{ color: alpha(palette.onSurface, 0.72) }}
                >
                  {controls.rate} pps
                </Typography>
              </Stack>
              <Slider
                value={controls.rate}
                onChange={handleSliderChange("rate")}
                min={10}
                max={240}
                step={10}
                aria-label="Packet rate"
                sx={{ mt: 1 }}
              />
              <Typography
                variant="labelSmall"
                sx={{ color: alpha(palette.onSurface, 0.68) }}
              >
                Higher rates crowd the path and make the queue feel heavier.
              </Typography>
            </Box>

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
              >
                <Typography variant="labelLarge" sx={{ color: palette.onSurface }}>
                  Loss
                </Typography>
                <Typography
                  variant="labelMedium"
                  sx={{ color: alpha(palette.onSurface, 0.72) }}
                >
                  {controls.loss}%
                </Typography>
              </Stack>
              <Slider
                value={controls.loss}
                onChange={handleSliderChange("loss")}
                min={0}
                max={20}
                step={1}
                aria-label="Packet loss"
                sx={{ mt: 1 }}
              />
              <Typography
                variant="labelSmall"
                sx={{ color: alpha(palette.onSurface, 0.68) }}
              >
                Drops are decided at node hand-offs, just like flaky links feel in real life.
              </Typography>
            </Box>

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
              >
                <Typography variant="labelLarge" sx={{ color: palette.onSurface }}>
                  Latency jitter
                </Typography>
                <Typography
                  variant="labelMedium"
                  sx={{ color: alpha(palette.onSurface, 0.72) }}
                >
                  {controls.jitter} ms
                </Typography>
              </Stack>
              <Slider
                value={controls.jitter}
                onChange={handleSliderChange("jitter")}
                min={0}
                max={60}
                step={2}
                aria-label="Latency jitter"
                sx={{ mt: 1 }}
              />
              <Typography
                variant="labelSmall"
                sx={{ color: alpha(palette.onSurface, 0.68) }}
              >
                Jitter bends packet pacing, which makes the path feel inconsistent.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: alpha(palette.outlineVariant, 0.6) }} />

          <Stack gap={1}>
            {NODE_DEFINITIONS.map((node) => (
              <Stack key={node.id} direction="row" spacing={1.25} alignItems="flex-start">
                <Box
                  sx={{
                    mt: 0.45,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    flexShrink: 0,
                    backgroundColor: rgbCss(node.color),
                    boxShadow: `0 0 0 6px ${rgbCss(node.color, 0.18)}`,
                  }}
                />
                <Box>
                  <Typography variant="labelLarge" sx={{ color: palette.onSurface }}>
                    {node.label}
                  </Typography>
                  <Typography
                    variant="labelSmall"
                    sx={{ color: alpha(palette.onSurface, 0.68) }}
                  >
                    {node.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 420, md: 600 },
            background: `
              radial-gradient(circle at 18% 20%, ${rgbCss([33, 96, 174], 0.18)}, transparent 28%),
              radial-gradient(circle at 82% 18%, ${rgbCss([118, 77, 255], 0.14)}, transparent 24%),
              radial-gradient(circle at 76% 80%, ${rgbCss([255, 129, 117], 0.14)}, transparent 24%),
              linear-gradient(160deg, ${rgbCss([11, 18, 29], 1)}, ${rgbCss(SCENE_CLEAR, 1)})
            `,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(${alpha("#ffffff", 0.05)} 1px, transparent 1px),
                linear-gradient(90deg, ${alpha("#ffffff", 0.05)} 1px, transparent 1px)
              `,
              backgroundSize: "56px 56px",
              maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.35))",
            }}
          />
          <canvas
            ref={canvasRef}
            aria-label="Interactive network packet flow visualization"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              top: 18,
              left: 18,
              flexWrap: "wrap",
              maxWidth: { xs: "70%", md: "unset" },
            }}
          >
            <Chip
              label={
                rendererInfo === "webgpu"
                  ? "WebGPU"
                  : rendererInfo === "webgl2"
                    ? "WebGL2"
                    : rendererInfo === "unavailable"
                      ? "GPU unavailable"
                      : "Starting"
              }
              size="small"
              sx={{
                bgcolor: alpha("#08101a", 0.76),
                color: "#f8fafc",
                border: `1px solid ${alpha("#ffffff", 0.12)}`,
                backdropFilter: "blur(10px)",
              }}
            />
            <Chip
              label="Client to internet"
              size="small"
              sx={{
                bgcolor: alpha("#08101a", 0.58),
                color: alpha("#f8fafc", 0.88),
                border: `1px solid ${alpha("#ffffff", 0.08)}`,
                backdropFilter: "blur(10px)",
              }}
            />
          </Stack>

          {NODE_DEFINITIONS.map((node) => (
            <Box
              key={`${node.id}-label`}
              sx={{
                position: "absolute",
                left: `calc(8% + ${node.x * 84}%)`,
                top: `calc(16% + ${node.y * 68}%)`,
                transform: "translate(-50%, -50%)",
                ml: `${node.labelDx}px`,
                mt: `${node.labelDy}px`,
                pointerEvents: "none",
              }}
            >
              <Box
                sx={{
                  px: 1.2,
                  py: 0.8,
                  borderRadius: 2,
                  backgroundColor: alpha("#07111d", 0.72),
                  border: `1px solid ${alpha(node.id === "internet" ? "#ffd27c" : "#ffffff", 0.14)}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  variant="labelMedium"
                  sx={{
                    color: "#f8fafc",
                    lineHeight: 1.1,
                    letterSpacing: 0.2,
                  }}
                >
                  {node.label}
                </Typography>
                <Typography
                  variant="labelSmall"
                  sx={{
                    color: alpha("#f8fafc", 0.74),
                    lineHeight: 1.1,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {node.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}

          <Box
            sx={{
              position: "absolute",
              right: 18,
              bottom: 18,
              px: 1.4,
              py: 1,
              borderRadius: 2.5,
              maxWidth: 280,
              backgroundColor: alpha("#07111d", 0.72),
              border: `1px solid ${alpha("#ffffff", 0.1)}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography variant="labelLarge" sx={{ color: "#f8fafc" }}>
              What the motion means
            </Typography>
            <Typography
              variant="labelSmall"
              sx={{ color: alpha("#f8fafc", 0.76), mt: 0.4 }}
            >
              Fast, even motion feels healthy. Uneven trails and red bursts mean
              jitter and loss are winning.
            </Typography>
          </Box>

          {rendererInfo === "unavailable" ? (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                p: 3,
                backgroundColor: alpha("#04070d", 0.72),
              }}
            >
              <Box
                sx={{
                  maxWidth: 380,
                  borderRadius: 3,
                  p: 2.5,
                  backgroundColor: alpha("#08101a", 0.9),
                  border: `1px solid ${alpha("#ffffff", 0.1)}`,
                }}
              >
                <Typography variant="titleMedium" sx={{ color: "#f8fafc" }}>
                  No GPU path exposed here
                </Typography>
                <Typography
                  variant="bodySmall"
                  sx={{ color: alpha("#f8fafc", 0.78), mt: 0.8 }}
                >
                  This page prefers WebGPU and falls back to WebGL2. The explanatory
                  notes still map the route, but the live render needs a browser that
                  exposes one of those graphics APIs.
                </Typography>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: `1px solid ${alpha(palette.outlineVariant, 0.55)}`,
          backgroundColor: alpha(palette.surfaceContainer, 0.75),
        }}
      >
        <Typography variant="labelLarge" sx={{ color: palette.onSurface }}>
          Quick read
        </Typography>
        <Typography
          variant="bodySmall"
          sx={{ color: alpha(palette.onSurface, 0.8), maxWidth: 900 }}
        >
          Rate pressures the queue. Loss kills packets at the hand-off. Jitter keeps
          timings uneven. Together they explain why one home Wi-Fi setup feels snappy
          and another feels chaotic even when “bars” look fine.
        </Typography>
      </Stack>
    </Stack>
  );
}
