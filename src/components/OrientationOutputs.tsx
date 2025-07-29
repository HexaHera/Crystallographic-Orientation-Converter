import React from "react";

interface Props {
    outputs: any;
}

const formatMatrix = (matrix: number[][]) =>
    matrix.map((row) => row.map((v) => v.toFixed(3)).join("\t")).join("\n");

const OrientationOutputs: React.FC<Props> = ({ outputs }) => {
    if (!outputs) return null;
    return (
        <>
            {outputs.miller && (
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-5 shadow-lg border-l-4 border-blue-400 mb-4">
                    <h3 className="font-bold text-lg mb-2 text-blue-700">Miller Indices {'{hkl}<uvw>'}</h3>
                    <div className="font-mono text-blue-900">
                        Plane (h k l): ({outputs.miller.h} {outputs.miller.k} {outputs.miller.l})<br />
                        Direction [u v w]: [{outputs.miller.u} {outputs.miller.v} {outputs.miller.w}]
                    </div>
                </div>
            )}
            {outputs.matrix && (
                <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-5 shadow-lg border-l-4 border-green-400 mb-4">
                    <h3 className="font-bold text-lg mb-2 text-green-700">Rotation Matrix (3×3)</h3>
                    <pre className="font-mono whitespace-pre text-green-900">{formatMatrix(outputs.matrix)}</pre>
                </div>
            )}
            {outputs.angleAxis && (
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl p-5 shadow-lg border-l-4 border-yellow-400 mb-4">
                    <h3 className="font-bold text-lg mb-2 text-yellow-700">Angle-Axis (θ, x, y, z)</h3>
                    <div className="font-mono text-yellow-900">θ = {outputs.angleAxis.theta}°, axis = ({outputs.angleAxis.x}, {outputs.angleAxis.y}, {outputs.angleAxis.z})</div>
                </div>
            )}
            {outputs.euler && (
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-5 shadow-lg border-l-4 border-purple-400 mb-4">
                    <h3 className="font-bold text-lg mb-2 text-purple-700">Euler Angles (ϕ1, Φ, ϕ2)</h3>
                    <div className="font-mono text-purple-900">
                        ϕ1 = {outputs.euler.phi1.toFixed(2)}°, Φ = {outputs.euler.PHI.toFixed(2)}°, ϕ2 = {outputs.euler.phi2.toFixed(2)}°
                    </div>
                </div>
            )}
        </>
    );
};

export default OrientationOutputs; 