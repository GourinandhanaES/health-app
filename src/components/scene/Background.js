'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { useRef } from 'react';

function Sphere(props) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.2;
            mesh.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh {...props} ref={mesh}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={props.color || '#4facfe'}
                    roughness={0.1}
                    metalness={0.5}
                    wireframe
                />
            </mesh>
        </Float>
    );
}

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 bg-zinc-950">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <color attach="background" args={['#09090b']} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Sphere position={[-2, 1, 0]} color="#00f2fe" />
                <Sphere position={[2, -1, -2]} color="#4facfe" />
                <Sphere position={[0, 0, -5]} scale={2} color="#ffffff" opacity={0.1} transparent />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
        </div>
    );
}
