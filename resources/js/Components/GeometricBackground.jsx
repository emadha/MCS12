import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const nodesRef = useRef([]);
    const mouseRef = useRef({
        x: undefined,
        y: undefined,
        radius: 200,
        active: false
    });
    const animationFrameRef = useRef(null);
    const gradientRef = useRef(null);

    // Configuration
    const config = {
        nodeCount: 8,
        colors: {
            primary: [59, 130, 246], // Blue
            secondary: [236, 72, 153], // Pink
            tertiary: [139, 92, 246], // Purple
            background: [15, 23, 42, 0.2] // Dark blue with transparency
        },
        lineWidth: 0.3,
        baseRadius: 15,
        elasticity: 0.3,
        nodeSpeed: 0.7,
        pulseSpeed: 0.003,
        flowFactor: 0.5,
        colorChangeSpeed: 0.01,
        noiseScale: 0.004
    };

    // Initialize Perlin noise function (for fluid motion)
    const noise = (x, y) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = fade(xf);
        const v = fade(yf);
        const A = (perm[X] + Y) & 255;
        const B = (perm[X + 1] + Y) & 255;
        return lerp(v, lerp(u, grad(perm[A], xf, yf), grad(perm[B], xf - 1, yf)),
            lerp(u, grad(perm[(A + 1)], xf, yf - 1), grad(perm[(B + 1)], xf - 1, yf - 1)));
    };

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t, a, b) => a + t * (b - a);
    const grad = (hash, x, y) => {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    // Create permutation table for noise function
    const p = Array.from({length: 256}, () => Math.floor(Math.random() * 256));
    const perm = [...p, ...p];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true });
        contextRef.current = ctx;

        // Create gradient object once
        const createRadialGradient = () => {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.8
            );

            // Add color stops
            const { primary, secondary, tertiary } = config.colors;
            gradient.addColorStop(0, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.05)`);
            gradient.addColorStop(0.5, `rgba(${secondary[0]}, ${secondary[1]}, ${secondary[2]}, 0.03)`);
            gradient.addColorStop(1, `rgba(${tertiary[0]}, ${tertiary[1]}, ${tertiary[2]}, 0.01)`);

            return gradient;
        };

        // Set canvas size and initialize animation
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.parentElement.offsetWidth * dpr;
            canvas.height = canvas.parentElement.offsetHeight * dpr;

            // Scale the context to ensure correct drawing operations
            ctx.scale(dpr, dpr);

            // Make the canvas visually fill the positioned parent
            canvas.style.width = '100%';
            canvas.style.height = '100%';

            // Create new gradient
            gradientRef.current = createRadialGradient();

            // Initialize nodes with new dimensions
            initNodes();
        };

        // Handle mouse movement
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
            mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));
            mouseRef.current.active = true;
        };

        // Handle mouse leaving
        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        // Handle mouse click
        const handleClick = () => {
            // Generate a pulse effect
            if (mouseRef.current.active) {
                // Add a temporary node at click position
                nodesRef.current.push(createNode(
                    mouseRef.current.x,
                    mouseRef.current.y,
                    config.baseRadius * 3,
                    true
                ));

                // Remove the temporary node after animation
                setTimeout(() => {
                    if (nodesRef.current.length > config.nodeCount) {
                        nodesRef.current.pop();
                    }
                }, 2000);
            }
        };

        // Add event listeners
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('click', handleClick);

        // Initial setup
        handleResize();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Create a node object
    const createNode = (x, y, radius, isTemporary = false) => {
        const hue = Math.random() * 360;
        return {
            x: x || Math.random() * canvasRef.current.width,
            y: y || Math.random() * canvasRef.current.height,
            radius: radius || config.baseRadius + Math.random() * config.baseRadius,
            baseRadius: radius || config.baseRadius + Math.random() * config.baseRadius,
            lastX: 0,
            lastY: 0,
            color: {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255),
                a: 0.7
            },
            targetColor: {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255)
            },
            angle: Math.random() * Math.PI * 2,
            speed: config.nodeSpeed * (0.5 + Math.random()),
            pulse: 0,
            pulseDirection: 1,
            isTemporary: isTemporary,
            // Add unique flow fields for each node
            flowOffset: {
                x: Math.random() * 10000,
                y: Math.random() * 10000
            }
        };
    };

    // Initialize nodes
    const initNodes = () => {
        nodesRef.current = [];
        for (let i = 0; i < config.nodeCount; i++) {
            nodesRef.current.push(createNode());
        }
    };

    // Update node positions and properties
    const updateNodes = () => {
        const canvas = canvasRef.current;
        const mouse = mouseRef.current;
        const nodes = nodesRef.current;
        const time = Date.now() * 0.001; // Current time in seconds

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // Store last position for trail effect
            node.lastX = node.x;
            node.lastY = node.y;

            // Calculate movement based on flow field (noise)
            const noiseX = noise((node.x * config.noiseScale) + node.flowOffset.x,
                (node.y * config.noiseScale) + node.flowOffset.y + time * 0.2) * 2 - 1;
            const noiseY = noise((node.x * config.noiseScale) + node.flowOffset.x + 1000,
                (node.y * config.noiseScale) + node.flowOffset.y + time * 0.2 + 1000) * 2 - 1;

            // Update position based on flow field
            node.x += noiseX * node.speed * config.flowFactor;
            node.y += noiseY * node.speed * config.flowFactor;

            // Mouse interaction (attraction or repulsion)
            if (mouse.active) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Calculate force based on distance (stronger when closer)
                    const force = (1 - distance / mouse.radius) * config.elasticity;

                    // Apply force (attraction)
                    node.x += dx * force;
                    node.y += dy * force;

                    // Increase node size when close to mouse
                    node.radius = node.baseRadius * (1 + (1 - distance / mouse.radius) * 0.5);
                } else {
                    // Gradually return to base radius
                    node.radius += (node.baseRadius - node.radius) * 0.1;
                }
            } else {
                // Gradually return to base radius
                node.radius += (node.baseRadius - node.radius) * 0.1;
            }

            // Pulsing effect
            node.pulse += config.pulseSpeed * node.pulseDirection;
            if (node.pulse > 1 || node.pulse < 0) {
                node.pulseDirection *= -1;
            }

            // Smooth color transition
            if (Math.random() < config.colorChangeSpeed) {
                node.targetColor = {
                    r: Math.floor(Math.random() * 255),
                    g: Math.floor(Math.random() * 255),
                    b: Math.floor(Math.random() * 255)
                };
            }

            // Interpolate color
            node.color.r += (node.targetColor.r - node.color.r) * 0.01;
            node.color.g += (node.targetColor.g - node.color.g) * 0.01;
            node.color.b += (node.targetColor.b - node.color.b) * 0.01;

            // Handle boundary collision with smooth bounce
            if (node.x < 0) {
                node.x = 0;
                node.lastX = -node.lastX * 0.5; // Reverse direction with damping
            } else if (node.x > canvas.width / (window.devicePixelRatio || 1)) {
                node.x = canvas.width / (window.devicePixelRatio || 1);
                node.lastX = node.x + (node.x - node.lastX) * 0.5; // Reverse direction with damping
            }

            if (node.y < 0) {
                node.y = 0;
                node.lastY = -node.lastY * 0.5; // Reverse direction with damping
            } else if (node.y > canvas.height / (window.devicePixelRatio || 1)) {
                node.y = canvas.height / (window.devicePixelRatio || 1);
                node.lastY = node.y + (node.y - node.lastY) * 0.5; // Reverse direction with damping
            }
        }
    };

    // Draw connections between nodes
    const drawConnections = () => {
        const ctx = contextRef.current;
        const nodes = nodesRef.current;

        ctx.save();

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Only connect nodes within certain distance
                const maxDistance = (nodeA.radius + nodeB.radius) * 6;

                if (distance < maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 1 - (distance / maxDistance);

                    // Create gradient between nodes
                    const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
                    gradient.addColorStop(0, `rgba(${nodeA.color.r}, ${nodeA.color.g}, ${nodeA.color.b}, ${opacity * 0.5})`);
                    gradient.addColorStop(1, `rgba(${nodeB.color.r}, ${nodeB.color.g}, ${nodeB.color.b}, ${opacity * 0.5})`);

                    ctx.beginPath();
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = config.lineWidth + opacity * 2;
                    ctx.moveTo(nodeA.x, nodeA.y);

                    // Create a curved line between nodes
                    const controlPoint = {
                        x: (nodeA.x + nodeB.x) / 2 + (Math.random() - 0.5) * 50 * opacity,
                        y: (nodeA.y + nodeB.y) / 2 + (Math.random() - 0.5) * 50 * opacity
                    };

                    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, nodeB.x, nodeB.y);
                    ctx.stroke();
                }
            }
        }

        ctx.restore();
    };

    // Draw nodes
    const drawNodes = () => {
        const ctx = contextRef.current;
        const nodes = nodesRef.current;

        ctx.save();

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // Calculate current radius with pulse effect
            const currentRadius = node.radius * (1 + node.pulse * 0.2);

            // Create gradient for each node
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, currentRadius * 2
            );

            // Add glow effect
            gradient.addColorStop(0, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${node.color.a})`);
            gradient.addColorStop(1, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0)`);

            // Draw the node
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            // Add inner highlight
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * node.pulse})`;
            ctx.arc(node.x - currentRadius * 0.2, node.y - currentRadius * 0.2, currentRadius * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    };

    // Main animation loop
    const animate = () => {
        const ctx = contextRef.current;
        const canvas = canvasRef.current;

        // Clear canvas with semi-transparent background for trail effect
        ctx.fillStyle = `rgba(${config.colors.background[0]}, ${config.colors.background[1]}, ${config.colors.background[2]}, ${config.colors.background[3]})`;
        ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

        // Draw gradient background effect
        if (gradientRef.current) {
            ctx.fillStyle = gradientRef.current;
            ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
        }

        // Update and draw
        updateNodes();
        drawConnections();
        drawNodes();

        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-0 pointer-events-auto"
            style={{ filter: 'blur(1px)' }} // Slight blur for more fluid appearance
        />
    );
};

export default FluidBackground;
