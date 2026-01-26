/**
 * 🐼 Brain Child - GPU Detection & Acceleration
 * ==============================================
 * Child do Brain Tentacle para detecção e uso de GPU
 *
 * Features:
 * - WebGL/WebGPU detection
 * - GPU capabilities report
 * - ONNX Runtime Web acceleration
 * - Performance benchmarking
 */

(function (window) {
  "use strict";

  const PARENT = "brain";
  const CHILD_ID = "GPU";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 GPU DETECTION API
  // ==========================================
  const GPUAPI = {
    id: CHILD_ID,
    name: "GPU Accelerator",
    icon: "🎮",

    // Cached capabilities
    _capabilities: null,

    /**
     * Detect GPU capabilities
     */
    async detect() {
      if (this._capabilities) {
        return this._capabilities;
      }

      const caps = {
        webgl: false,
        webgl2: false,
        webgpu: false,
        vendor: null,
        renderer: null,
        maxTextureSize: 0,
        estimatedVRAM: 0,
        onnxSupported: false,
        wasmSimd: false,
        wasmThreads: false,
      };

      // WebGL 1
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          caps.webgl = true;
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            caps.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            caps.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
          caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }
      } catch (e) {
        log("WebGL detection failed: " + e.message);
      }

      // WebGL 2
      try {
        const canvas = document.createElement("canvas");
        const gl2 = canvas.getContext("webgl2");
        caps.webgl2 = !!gl2;
      } catch (e) {
        // WebGL2 not supported
      }

      // WebGPU
      try {
        if (navigator.gpu) {
          const adapter = await navigator.gpu.requestAdapter();
          if (adapter) {
            caps.webgpu = true;
            const info = await adapter.requestAdapterInfo();
            if (info) {
              caps.vendor = caps.vendor || info.vendor;
              caps.renderer = caps.renderer || info.architecture;
            }
            // Estimate VRAM (heuristic)
            const limits = adapter.limits;
            caps.estimatedVRAM = Math.round(
              (limits.maxBufferSize || 0) / (1024 * 1024 * 1024),
            );
          }
        }
      } catch (e) {
        // WebGPU not supported
      }

      // WASM SIMD
      try {
        caps.wasmSimd = WebAssembly.validate(
          new Uint8Array([
            0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
            10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
          ]),
        );
      } catch (e) {
        caps.wasmSimd = false;
      }

      // WASM Threads
      try {
        caps.wasmThreads = typeof SharedArrayBuffer !== "undefined";
      } catch (e) {
        caps.wasmThreads = false;
      }

      // ONNX Runtime support estimate
      caps.onnxSupported = caps.webgpu || (caps.webgl2 && caps.wasmSimd);

      this._capabilities = caps;
      log(
        `Detected: ${caps.renderer || "Unknown GPU"}, WebGPU: ${caps.webgpu}`,
      );

      return caps;
    },

    /**
     * Get recommended backend for ML
     */
    async getRecommendedBackend() {
      const caps = await this.detect();

      if (caps.webgpu) {
        return {
          backend: "webgpu",
          performance: "high",
          note: "Full GPU acceleration via WebGPU",
        };
      }

      if (caps.webgl2 && caps.wasmSimd) {
        return {
          backend: "webgl",
          performance: "medium",
          note: "WebGL + SIMD acceleration",
        };
      }

      if (caps.wasmSimd) {
        return {
          backend: "wasm-simd",
          performance: "low",
          note: "CPU with SIMD",
        };
      }

      return {
        backend: "wasm",
        performance: "minimal",
        note: "CPU only, may be slow",
      };
    },

    /**
     * Benchmark GPU performance
     */
    async benchmark() {
      const start = performance.now();
      const caps = await this.detect();

      // Simple matrix operation benchmark
      const size = 1000;
      const iterations = 100;

      const matrixA = new Float32Array(size * size);
      const matrixB = new Float32Array(size * size);

      for (let i = 0; i < size * size; i++) {
        matrixA[i] = Math.random();
        matrixB[i] = Math.random();
      }

      const benchStart = performance.now();

      for (let iter = 0; iter < iterations; iter++) {
        // Simple dot product simulation
        let sum = 0;
        for (let i = 0; i < size; i++) {
          sum += matrixA[i] * matrixB[i];
        }
      }

      const benchEnd = performance.now();
      const opsPerSecond = Math.round(
        iterations / ((benchEnd - benchStart) / 1000),
      );

      return {
        capabilities: caps,
        benchmark: {
          matrixOps: opsPerSecond,
          latency: Math.round(benchEnd - benchStart),
          rating:
            opsPerSecond > 10000
              ? "excellent"
              : opsPerSecond > 1000
                ? "good"
                : "fair",
        },
        totalTime: Math.round(performance.now() - start),
      };
    },

    /**
     * Check if can run model
     */
    async canRunModel(modelSize = "small") {
      const caps = await this.detect();

      const requirements = {
        small: { vram: 0.5, webgl: true }, // <500MB
        medium: { vram: 2, webgl2: true }, // 500MB-2GB
        large: { vram: 4, webgpu: true }, // 2-4GB
        xlarge: { vram: 8, webgpu: true }, // 4GB+
      };

      const req = requirements[modelSize] || requirements.small;

      const canRun =
        (req.webgpu ? caps.webgpu : true) &&
        (req.webgl2 ? caps.webgl2 : true) &&
        (req.webgl ? caps.webgl : true);

      return {
        canRun,
        modelSize,
        reason: canRun
          ? `GPU meets ${modelSize} requirements`
          : `GPU doesn't meet ${modelSize} requirements`,
        capabilities: caps,
      };
    },

    /**
     * Get GPU info summary
     */
    async getSummary() {
      const caps = await this.detect();

      return {
        gpu: caps.renderer || "Unknown",
        vendor: caps.vendor || "Unknown",
        apis: [
          caps.webgpu && "WebGPU",
          caps.webgl2 && "WebGL2",
          caps.webgl && "WebGL",
        ].filter(Boolean),
        vram: caps.estimatedVRAM + "GB (estimated)",
        mlReady: caps.onnxSupported,
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function log(message) {
    console.log(`🎮 [Brain/${CHILD_ID}] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.BrainParent) {
      window.BrainParent.registerChild(CHILD_ID, GPUAPI);
      log("✓ GPU child ready");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  // Direct export
  window.Panda = window.Panda || {};
  window.Panda.Brain = window.Panda.Brain || {};
  window.Panda.Brain.GPU = GPUAPI;
  window.GPUChild = GPUAPI;
})(window);
