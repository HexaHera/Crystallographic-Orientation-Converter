"use client";

import Image from "next/image";
import { useState } from "react";
import OrientationInput from "../components/OrientationInput";
import OrientationOutputs from "../components/OrientationOutputs";
import OrientationVisualizer from "../components/OrientationVisualizer";
import {
  millerToMatrix,
  matrixToEuler,
  matrixToAngleAxis,
  eulerToMiller,
  makeAnglesPositive,
  normalizeToIntegerVector,
  angleAxisToMatrix,
  eulerToMatrix,
} from "../utils/orientation";

const inputFormats = [
  { value: "miller", label: "Miller Indices {hkl}<uvw>" },
  { value: "matrix", label: "Rotation Matrix (3×3)" },
  { value: "angleAxis", label: "Angle-Axis (θ, axis as x, y, z)" },
  { value: "euler", label: "Euler Angles (ϕ1, Φ, ϕ2)" },
];

export default function Home() {
  const [format, setFormat] = useState("miller");
  const [input, setInput] = useState<any>({});
  const [outputs, setOutputs] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value);
    setInput({});
    setOutputs(null);
    setError(null);
  };

  const handleInputChange = (data: any) => {
    setInput(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      let result: any = {};
      if (format === "miller") {
        const { h, k, l, u, v, w } = input;
        const hkluvw = [h, k, l, u, v, w].map(Number);
        const matrix = millerToMatrix(...hkluvw);
        const euler = matrixToEuler(matrix);
        const angleAxis = matrixToAngleAxis(matrix);
        result = {
          miller: { h, k, l, u, v, w },
          matrix,
          euler: { phi1: euler.phi1, PHI: euler.PHI, phi2: euler.phi2 },
          angleAxis: { ...angleAxis, theta: Math.abs(angleAxis.theta) },
        };
      } else if (format === "matrix") {
        const m = [
          [Number(input.m11), Number(input.m12), Number(input.m13)],
          [Number(input.m21), Number(input.m22), Number(input.m23)],
          [Number(input.m31), Number(input.m32), Number(input.m33)],
        ];
        const euler = matrixToEuler(m);
        const angleAxis = matrixToAngleAxis(m);
        const miller = eulerToMiller(euler.phi1, euler.PHI, euler.phi2);
        result = {
          matrix: m,
          euler: { phi1: euler.phi1, PHI: euler.PHI, phi2: euler.phi2 },
          angleAxis: { ...angleAxis, theta: Math.abs(angleAxis.theta) },
          miller,
        };
      } else if (format === "angleAxis") {
        if (input.theta === undefined || input.x === undefined || input.y === undefined || input.z === undefined) throw new Error("All fields required");
        const theta = Number(input.theta);
        const axis = [Number(input.x), Number(input.y), Number(input.z)];
        const matrix = angleAxisToMatrix(theta, axis[0], axis[1], axis[2]);
        const euler = matrixToEuler(matrix);
        const miller = eulerToMiller(euler.phi1, euler.PHI, euler.phi2);
        result = {
          angleAxis: { theta, x: axis[0], y: axis[1], z: axis[2] },
          matrix,
          euler: { phi1: euler.phi1, PHI: euler.PHI, phi2: euler.phi2 },
          miller,
        };
      } else if (format === "euler") {
        const phi1 = Number(input.phi1);
        const PHI = Number(input.PHI);
        const phi2 = Number(input.phi2);
        const matrix = eulerToMatrix(phi1, PHI, phi2);
        const angleAxis = matrixToAngleAxis(matrix);
        const miller = eulerToMiller(phi1, PHI, phi2);
        result = {
          euler: { phi1, PHI, phi2 },
          matrix,
          angleAxis: { ...angleAxis, theta: Math.abs(angleAxis.theta) },
          miller,
        };
      }
      setOutputs(result);
    } catch (err: any) {
      setError(err.message || "Invalid input");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-blue-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-tight drop-shadow">Crystallographic Orientation Converter</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-blue-800">Input Format</label>
            <select
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium shadow-sm"
              value={format}
              onChange={handleFormatChange}
            >
              {inputFormats.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <OrientationInput format={format} value={input} onChange={handleInputChange} />
          {error && <div className="text-red-600 mt-2 font-semibold">{error}</div>}
          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-2 rounded-lg font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-600 transition"
          >
            Convert & Visualize
          </button>
        </form>
      </div>
      {outputs && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <OrientationOutputs outputs={outputs} />
        </div>
      )}
      {/* Only show 3D visualization if outputs exist and format is miller */}
      {outputs && format === "miller" && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">3D Visualization</h2>
          <div className="h-96 bg-purple-50 rounded-xl border border-purple-100 shadow-inner">
            <OrientationVisualizer format={format} input={input} outputs={outputs} />
          </div>
        </div>
      )}
    </main>
  );
}
