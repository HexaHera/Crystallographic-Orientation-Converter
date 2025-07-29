# Crystallographic Orientation Converter

A modern web application for converting between different crystallographic orientation formats using Next.js, TypeScript, and Three.js.

## Features

- **Input Formats**: Miller Indices, Rotation Matrix, Angle-Axis, Euler Angles
- **Output Formats**: All formats with real-time conversion
- **3D Visualization**: Interactive 3D plots using Three.js
- **Validation**: Weiss Zone Law validation for Miller Indices
- **Responsive Design**: Modern UI with Tailwind CSS

## Supported Conversions

- Miller Indices ↔ Rotation Matrix
- Rotation Matrix ↔ Euler Angles (Bunge ZXZ convention)
- Rotation Matrix ↔ Angle-Axis (Rodrigues' formula)
- Euler Angles ↔ Miller Indices
- Angle-Axis ↔ All other formats

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Select Input Format**: Choose from Miller Indices, Rotation Matrix, Angle-Axis, or Euler Angles
2. **Enter Values**: Input your crystallographic data in the selected format
3. **Convert**: Click "Convert & Visualize" to see all format conversions
4. **Visualize**: View 3D representation of Miller Indices (when applicable)

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **Three.js**: 3D visualization
- **React Three Fiber**: React integration for Three.js

## Deployment

This application can be easily deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages** (with static export)

## Contributing

Feel free to contribute by improving the conversion algorithms, adding new features, or enhancing the 3D visualization.
