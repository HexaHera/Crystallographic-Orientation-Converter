import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";

interface Props {
    format: string;
    input: any;
    outputs: any;
}

function AxesLabels() {
    return (
        <>
            <Text position={[1.2, 0, 0]} fontSize={0.15} color="red">X</Text>
            <Text position={[0, 1.2, 0]} fontSize={0.15} color="green">Y</Text>
            <Text position={[0, 0, 1.2]} fontSize={0.15} color="blue">Z</Text>
        </>
    );
}

function Axes() {
    return (
        <>
            {/* X axis - red */}
            <mesh>
                <cylinderGeometry args={[0.01, 0.01, 2, 16]} />
                <meshStandardMaterial color="red" />
                <mesh position={[1, 0, 0]}>
                    <coneGeometry args={[0.04, 0.12, 16]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </mesh>
            {/* Y axis - green */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.01, 0.01, 2, 16]} />
                <meshStandardMaterial color="green" />
                <mesh position={[1, 0, 0]}>
                    <coneGeometry args={[0.04, 0.12, 16]} />
                    <meshStandardMaterial color="green" />
                </mesh>
            </mesh>
            {/* Z axis - blue */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 2, 16]} />
                <meshStandardMaterial color="blue" />
                <mesh position={[1, 0, 0]}>
                    <coneGeometry args={[0.04, 0.12, 16]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </mesh>
            <AxesLabels />
            {/* (0,0,0) label */}
            <Text position={[0, 0, 0]} fontSize={0.13} color="#333">(0,0,0)</Text>
        </>
    );
}

function MillerPlane({ h, k, l }: { h: number; k: number; l: number }) {
    // Find three intercepts for the plane
    let points: [number, number, number][] = [];
    if (h !== 0) points.push([1 / h, 0, 0]);
    if (k !== 0) points.push([0, 1 / k, 0]);
    if (l !== 0) points.push([0, 0, 1 / l]);
    // If not enough points, use default
    if (points.length < 3) points = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    // Make a triangle for the plane
    return (
        <>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        array={new Float32Array(points.flat())}
                        itemSize={3}
                    />
                </bufferGeometry>
                <meshStandardMaterial color="#00bcd4" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
            {/* Mark the three points with their coordinates */}
            {points.map((pt, i) => (
                <Text
                    key={i}
                    position={[pt[0], pt[1], pt[2]]}
                    fontSize={0.12}
                    color="#00796b"
                    anchorX="center"
                    anchorY="bottom"
                >
                    {`P${i + 1} (${pt.map((v) => v.toFixed(2)).join(",")})`}
                </Text>
            ))}
            {/* Label for the plane */}
            <Text
                position={points.reduce((acc, pt) => [acc[0] + pt[0], acc[1] + pt[1], acc[2] + pt[2]], [0, 0, 0]).map((v) => v / 3 as number) as [number, number, number]}
                fontSize={0.15}
                color="#00bcd4"
                anchorX="center"
                anchorY="middle"
            >
                {`(${h}${k}${l}) plane`}
            </Text>
        </>
    );
}

function OrientationArrow({ dir }: { dir: [number, number, number] }) {
    // Arrow from origin in direction of [uvw]
    const length = 1.2;
    const norm = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2) || 1;
    const d = dir.map((v) => v / norm) as [number, number, number];
    const arrowDir = new THREE.Vector3(...d);
    const arrowHelper = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), length, 0xff5722, 0.22, 0.12);
    // Label at the tip
    const tip = d.map((v) => v * length) as [number, number, number];
    return (
        <>
            <primitive object={arrowHelper} />
            <Text position={tip} fontSize={0.13} color="#ff5722" anchorX="center" anchorY="bottom">
                [uvw] {`(${dir.map((v) => v.toFixed(2)).join(",")})`}
            </Text>
        </>
    );
}

const OrientationVisualizer: React.FC<Props> = ({ format, input, outputs }) => {
    // Use Miller indices if available
    const h = Number(input.h), k = Number(input.k), l = Number(input.l);
    const u = Number(input.u), v = Number(input.v), w = Number(input.w);
    const showPlane = !isNaN(h) && !isNaN(k) && !isNaN(l) && (h !== 0 || k !== 0 || l !== 0);
    const showArrow = !isNaN(u) && !isNaN(v) && !isNaN(w) && (u !== 0 || v !== 0 || w !== 0);
    return (
        <Canvas camera={{ position: [2.5, 2.5, 2.5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <Grid args={[4, 4]} cellColor="#e0e0e0" sectionColor="#bdbdbd" fadeDistance={20} position={[0, 0, 0]} />
            <Axes />
            {showPlane && <MillerPlane h={h} k={k} l={l} />}
            {showArrow && <OrientationArrow dir={[u, v, w]} />}
            <OrbitControls />
        </Canvas>
    );
};

export default OrientationVisualizer; 