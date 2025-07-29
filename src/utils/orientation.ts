// Placeholder conversion functions for crystallographic orientation formats

// Miller Indices {hkl}<uvw> to Rotation Matrix (reference: b, t, n as columns)
export function millerToMatrix(h: number, k: number, l: number, u: number, v: number, w: number): number[][] {
    // Normalize plane normal and direction
    let n = [h, k, l];
    let b = [u, v, w];
    const nNorm = Math.sqrt(h * h + k * k + l * l) || 1;
    const bNorm = Math.sqrt(u * u + v * v + w * w) || 1;
    n = n.map((x) => x / nNorm);
    b = b.map((x) => x / bNorm);
    // t = n x b
    let t = [
        n[1] * b[2] - n[2] * b[1],
        n[2] * b[0] - n[0] * b[2],
        n[0] * b[1] - n[1] * b[0],
    ];
    // Normalize t
    const tNorm = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]) || 1;
    t = t.map((x) => x / tNorm);
    // Return as columns: [b t n] (sample frame)
    return [b, t, n];
}

// Rotation Matrix to Euler Angles (Bunge ZXZ convention, reference)
export function matrixToEuler(matrix: number[][]): { phi1: number; PHI: number; phi2: number } {
    // Bunge ZXZ convention
    const g = matrix;
    let PHI = Math.acos(Math.max(-1, Math.min(1, g[2][2]))); // Clamp for safety
    let phi1 = 0;
    let phi2 = 0;
    if (Math.abs(Math.sin(PHI)) > 1e-6) {
        phi1 = Math.atan2(g[2][0], -g[2][1]);
        phi2 = Math.atan2(g[0][2], g[1][2]);
    } else {
        // Gimbal lock
        phi1 = Math.atan2(-g[0][1], g[0][0]);
        phi2 = 0;
    }
    // Convert to degrees and ensure phi2 is in the correct range
    phi1 = (phi1 * 180) / Math.PI;
    PHI = (PHI * 180) / Math.PI;
    phi2 = (phi2 * 180) / Math.PI;
    // Ensure phi2 is in the range [-180, 180] to match reference
    if (phi2 > 180) phi2 -= 360;
    if (phi2 < -180) phi2 += 360;
    return { phi1, PHI, phi2 };
}

// Rotation Matrix to Angle-Axis (θ, x, y, z)
export function matrixToAngleAxis(matrix: number[][]): { theta: number; x: number; y: number; z: number } {
    // TODO: Implement actual conversion
    return { theta: 0, x: 0, y: 0, z: 1 };
}

// Euler Angles (ϕ1, Φ, ϕ2) to Rotation Matrix (reference)
export function eulerToMatrix(phi1: number, PHI: number, phi2: number): number[][] {
    // Convert degrees to radians
    const p1 = (phi1 * Math.PI) / 180;
    const P = (PHI * Math.PI) / 180;
    const p2 = (phi2 * Math.PI) / 180;
    // Reference formula (see image)
    return [
        [Math.cos(p1) * Math.cos(p2) - Math.sin(p1) * Math.sin(p2) * Math.cos(P),
        Math.sin(p1) * Math.cos(p2) + Math.cos(p1) * Math.sin(p2) * Math.cos(P),
        Math.sin(P) * Math.sin(p2)],
        [-Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(P),
        -Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(P),
        Math.sin(P) * Math.cos(p2)],
        [Math.sin(p1) * Math.sin(P), -Math.cos(p1) * Math.sin(P), Math.cos(P)]
    ];
}

// Euler Angles (phi1, PHI, phi2) to Miller Indices (debug approach)
export function eulerToMiller(phi1: number, PHI: number, phi2: number): { h: number; k: number; l: number; u: number; v: number; w: number } {
    // Convert degrees to radians
    const p1 = (phi1 * Math.PI) / 180;
    const P = (PHI * Math.PI) / 180;
    const p2 = (phi2 * Math.PI) / 180;

    // Get the rotation matrix
    const matrix = eulerToMatrix(phi1, PHI, phi2);

    // Extract from matrix
    let nvec = [matrix[0][2], matrix[1][2], matrix[2][2]]; // Third column (plane normal)
    let bvec = [matrix[0][0], matrix[1][0], matrix[2][0]]; // First column (direction)

    // Debug: log the raw values
    console.log("Raw plane normal:", nvec);
    console.log("Raw direction:", bvec);

    // Threshold small values to zero
    nvec = nvec.map((x) => Math.abs(x) < 1e-6 ? 0 : x);
    bvec = bvec.map((x) => Math.abs(x) < 1e-6 ? 0 : x);

    // Try without normalization first
    // nvec = normalizeToSmallestIntegerVector(nvec);
    // bvec = normalizeToSmallestIntegerVector(bvec);

    // Round to integers directly
    nvec = nvec.map(x => Math.round(x));
    bvec = bvec.map(x => Math.round(x));

    return { h: nvec[0], k: nvec[1], l: nvec[2], u: bvec[0], v: bvec[1], w: bvec[2] };
}

// Add other conversion functions as needed...

// Weiss zone law check: hu + kv + lw = 0
export function weissZoneLaw(h: number, k: number, l: number, u: number, v: number, w: number): boolean {
    return h * u + k * v + l * w === 0;
}

// Make all angles positive (0 <= angle < 360)
export function makeAnglesPositive(angles: number[]): number[] {
    return angles.map((a) => ((a % 360) + 360) % 360);
}

// Normalize a vector to integer form (e.g., [0.5, 1, 1.5] -> [1, 2, 3])
export function normalizeToIntegerVector(vec: number[]): number[] {
    const scale = lcmOfDenominators(vec);
    return vec.map((v) => Math.round(v * scale));
}

// Helper: Normalize a vector to smallest integer values, with sign convention
function normalizeToSmallestIntegerVector(vec: number[]): number[] {
    // Find the max absolute value
    const maxAbs = Math.max(...vec.map((v) => Math.abs(v)));
    if (maxAbs === 0) return vec.map(() => 0);
    // Scale so the largest absolute value is 1 or -1
    const scaled = vec.map((v) => v / maxAbs);
    // Round to nearest integer
    return scaled.map((v) => Math.round(v));
}

// Helper: Find LCM of denominators for rational numbers
function lcmOfDenominators(vec: number[]): number {
    const denoms = vec.map((v) => {
        const frac = v.toString().split(".")[1];
        return frac ? Math.pow(10, frac.length) : 1;
    });
    return denoms.reduce(lcm, 1);
}

function lcm(a: number, b: number): number {
    return (!a || !b) ? 0 : Math.abs((a * b) / gcd(a, b));
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

// Angle-Axis (θ, x, y, z) to Rotation Matrix (reference, blue box)
export function angleAxisToMatrix(theta: number, x: number, y: number, z: number): number[][] {
    // Normalize axis
    const norm = Math.sqrt(x * x + y * y + z * z) || 1;
    x /= norm; y /= norm; z /= norm;
    const t = 1 - Math.cos((theta * Math.PI) / 180);
    const c = Math.cos((theta * Math.PI) / 180);
    const s = Math.sin((theta * Math.PI) / 180);
    return [
        [x * x * t + c, x * y * t - z * s, x * z * t + y * s],
        [y * x * t + z * s, y * y * t + c, y * z * t - x * s],
        [z * x * t - y * s, z * y * t + x * s, z * z * t + c],
    ];
}

// Angle-Axis to Euler Angles (Bunge ZXZ convention)
export function angleAxisToEuler(theta: number, x: number, y: number, z: number): { phi1: number; PHI: number; phi2: number } {
    // First convert to rotation matrix
    const matrix = angleAxisToMatrix(theta, x, y, z);

    // Then convert matrix to Euler angles
    return matrixToEuler(matrix);
}

// Debug function to test conversion chain
export function debugConversion(theta: number, x: number, y: number, z: number) {
    console.log("Input Angle-Axis:", theta, x, y, z);

    // Convert to matrix
    const matrix = angleAxisToMatrix(theta, x, y, z);
    console.log("Rotation Matrix:", matrix);

    // Convert to Euler
    const euler = matrixToEuler(matrix);
    console.log("Euler Angles:", euler);

    // Convert to Miller
    const miller = eulerToMiller(euler.phi1, euler.PHI, euler.phi2);
    console.log("Miller Indices:", miller);

    return { matrix, euler, miller };
} 