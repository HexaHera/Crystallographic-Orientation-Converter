import React, { useState, useEffect, useCallback } from "react";

interface InputData {
    [key: string]: string;
}

interface Props {
    format: string;
    value: InputData;
    onChange: (data: InputData) => void;
}

const defaultInputs: Record<string, InputData> = {
    miller: { h: "", k: "", l: "", u: "", v: "", w: "" },
    matrix: { m11: "", m12: "", m13: "", m21: "", m22: "", m23: "", m31: "", m32: "", m33: "" },
    angleAxis: { theta: "", x: "", y: "", z: "" },
    euler: { phi1: "", PHI: "", phi2: "" },
};

function weissZoneLaw(h: number, k: number, l: number, u: number, v: number, w: number) {
    return h * u + k * v + l * w === 0;
}

const OrientationInput: React.FC<Props> = ({ format, onChange }) => {
    const [input, setInput] = useState<InputData>(defaultInputs[format] || {});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setInput(defaultInputs[format] || {});
        setError(null);
    }, [format]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev: InputData) => ({ ...prev, [name]: value }));
    }, []);

    useEffect(() => {
        onChange(input);
    }, [input, onChange]);

    useEffect(() => {
        if (format === "miller") {
            const { h, k, l, u, v, w } = input;
            if ([h, k, l, u, v, w].every((x: string) => x !== "")) {
                if (!weissZoneLaw(Number(h), Number(k), Number(l), Number(u), Number(v), Number(w))) {
                    setError("Weiss zone law not satisfied: hu + kv + lw = 0");
                } else {
                    setError(null);
                }
            } else {
                setError(null);
            }
        }
    }, [input, format]);

    return (
        <div className="space-y-2 bg-blue-50/60 rounded-xl p-4 border border-blue-100 shadow-inner mb-2">
            {format === "miller" && (
                <div className="grid grid-cols-3 gap-2">
                    {["h", "k", "l", "u", "v", "w"].map((key) => (
                        <input
                            key={key}
                            name={key}
                            type="number"
                            value={input[key] ?? ""}
                            onChange={handleChange}
                            placeholder={key}
                            className="border-2 border-blue-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 font-semibold shadow-sm hover:border-blue-400 transition"
                            required
                        />
                    ))}
                </div>
            )}
            {format === "matrix" && (
                <div className="grid grid-cols-3 gap-2">
                    {["m11", "m12", "m13", "m21", "m22", "m23", "m31", "m32", "m33"].map((key) => (
                        <input
                            key={key}
                            name={key}
                            type="number"
                            value={input[key] ?? ""}
                            onChange={handleChange}
                            placeholder={key}
                            className="border-2 border-green-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-green-900 font-semibold shadow-sm hover:border-green-400 transition"
                            required
                        />
                    ))}
                </div>
            )}
            {format === "angleAxis" && (
                <div className="grid grid-cols-4 gap-2">
                    <input
                        name="theta"
                        type="number"
                        value={input.theta ?? ""}
                        onChange={handleChange}
                        placeholder="θ (deg)"
                        className="border-2 border-yellow-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-yellow-900 font-semibold shadow-sm hover:border-yellow-400 transition"
                        required
                    />
                    <input
                        name="x"
                        type="number"
                        value={input.x ?? ""}
                        onChange={handleChange}
                        placeholder="x"
                        className="border-2 border-yellow-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-yellow-900 font-semibold shadow-sm hover:border-yellow-400 transition"
                        required
                    />
                    <input
                        name="y"
                        type="number"
                        value={input.y ?? ""}
                        onChange={handleChange}
                        placeholder="y"
                        className="border-2 border-yellow-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-yellow-900 font-semibold shadow-sm hover:border-yellow-400 transition"
                        required
                    />
                    <input
                        name="z"
                        type="number"
                        value={input.z ?? ""}
                        onChange={handleChange}
                        placeholder="z"
                        className="border-2 border-yellow-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-yellow-900 font-semibold shadow-sm hover:border-yellow-400 transition"
                        required
                    />
                </div>
            )}
            {format === "euler" && (
                <div className="grid grid-cols-3 gap-2">
                    <input
                        name="phi1"
                        type="number"
                        value={input.phi1 ?? ""}
                        onChange={handleChange}
                        placeholder="ϕ1 (deg)"
                        className="border-2 border-purple-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-purple-900 font-semibold shadow-sm hover:border-purple-400 transition"
                        required
                    />
                    <input
                        name="PHI"
                        type="number"
                        value={input.PHI ?? ""}
                        onChange={handleChange}
                        placeholder="Φ (deg)"
                        className="border-2 border-purple-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-purple-900 font-semibold shadow-sm hover:border-purple-400 transition"
                        required
                    />
                    <input
                        name="phi2"
                        type="number"
                        value={input.phi2 ?? ""}
                        onChange={handleChange}
                        placeholder="ϕ2 (deg)"
                        className="border-2 border-purple-200 rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-purple-900 font-semibold shadow-sm hover:border-purple-400 transition"
                        required
                    />
                </div>
            )}
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
        </div>
    );
};

export default OrientationInput; 