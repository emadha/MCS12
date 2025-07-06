import { useEffect, useRef } from 'react';
import { useAppContext } from '@/AppContext';

export default function AnimatedBackground() {
    const canvasRef = useRef(null);
    const { darkMode } = useAppContext() || {};

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 120; // Adjusted particle count
        let animationFrameId;

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Initialize canvas size
        setCanvasDimensions();

        // Handle window resize
        window.addEventListener('resize', setCanvasDimensions);

        // Purple to red/violet color palette
        const colorPalettes = {
            dark: [
                'rgba(103, 58, 183, 0.85)',   // Deep Purple
                'rgba(156, 39, 176, 0.85)',   // Purple
                'rgba(186, 104, 200, 0.85)',  // Light Purple
                'rgba(224, 64, 251, 0.85)',   // Pink/Purple
                'rgba(233, 30, 99, 0.85)',    // Pink
                'rgba(244, 67, 54, 0.85)',    // Red
                'rgba(171, 71, 188, 0.85)',   // Light Violet
                'rgba(123, 31, 162, 0.85)'    // Deep Violet
            ],
            light: [
                'rgba(103, 58, 183, 0.6)',    // Deep Purple
                'rgba(156, 39, 176, 0.6)',    // Purple
                'rgba(186, 104, 200, 0.6)',   // Light Purple
                'rgba(224, 64, 251, 0.6)',    // Pink/Purple
                'rgba(233, 30, 99, 0.6)',     // Pink
                'rgba(244, 67, 54, 0.6)',     // Red
                'rgba(171, 71, 188, 0.6)',    // Light Violet
                'rgba(123, 31, 162, 0.6)'     // Deep Violet
            ]
        };

        // Create particles
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Much larger and more varied particle sizes
                this.size = Math.random() * 10 + 3;
                this.speedX = Math.random() * 0.6 - 0.3; // Adjusted speed for bigger particles
                this.speedY = Math.random() * 0.6 - 0.3;
                const palette = darkMode ? colorPalettes.dark : colorPalettes.light;
                this.color = palette[Math.floor(Math.random() * palette.length)];
                // Enhanced pulse effect
                this.pulseSpeed = 0.01 + Math.random() * 0.03;
                this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
                this.pulseSize = 0;
                // Add opacity variation
                this.baseOpacity = 0.7 + Math.random() * 0.3;
                // Add blur variation for depth effect
                this.blur = Math.random() * 5;
                // Random rotation and rotation speed
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() * 0.02 - 0.01) * (Math.random() > 0.5 ? 1 : -1);
                // Assign a random shape type
                this.shapeType = Math.floor(Math.random() * 5); // 0: star, 1: polygon, 2: square, 3: triangle, 4: custom shape
                // Number of sides/points (for polygons and stars)
                this.sides = Math.floor(Math.random() * 4) + 3; // 3 to 6 sides
                this.innerRadius = this.size * 0.4; // For star shape
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Enhanced pulse effect with larger range
                this.pulseSize += this.pulseSpeed * this.pulseDirection;
                if (this.pulseSize > 1.5 || this.pulseSize < -1) {
                    this.pulseDirection *= -1;
                }

                // Update rotation
                this.rotation += this.rotationSpeed;

                // Boundary check with wrap-around
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Create radial gradient for each particle
                const currentSize = this.size + this.pulseSize;
                const gradient = ctx.createRadialGradient(
                    0, 0, 0,
                    0, 0, currentSize
                );

                // Extract base color without opacity
                const colorBase = this.color.substring(0, this.color.lastIndexOf(','));

                // Create gradient with opacity fade-out
                gradient.addColorStop(0, colorBase + ', ' + this.baseOpacity + ')');
                gradient.addColorStop(0.6, colorBase + ', ' + (this.baseOpacity * 0.6) + ')');
                gradient.addColorStop(1, colorBase + ', 0)');

                ctx.fillStyle = gradient;
                ctx.shadowBlur = 15 + this.blur;
                ctx.shadowColor = this.color;

                // Draw different shapes based on shapeType
                switch(this.shapeType) {
                    case 0: // Star
                        this.drawStar(currentSize, this.sides, this.innerRadius);
                        break;
                    case 1: // Regular polygon
                        this.drawPolygon(currentSize, this.sides);
                        break;
                    case 2: // Square/Rectangle with rounded corners
                        this.drawRoundedRect(currentSize);
                        break;
                    case 3: // Triangle
                        this.drawPolygon(currentSize, 3);
                        break;
                    case 4: // Custom shape (flower-like)
                        this.drawCustomShape(currentSize);
                        break;
                }

                ctx.restore();
            }

            // Draw a star shape
            drawStar(size, points, innerRadius) {
                ctx.beginPath();
                for (let i = 0; i < points * 2; i++) {
                    const radius = i % 2 === 0 ? size : innerRadius;
                    const angle = (Math.PI * 2 * i) / (points * 2);
                    const x = radius * Math.sin(angle);
                    const y = radius * Math.cos(angle);
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
            }

            // Draw a regular polygon
            drawPolygon(size, sides) {
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const angle = (Math.PI * 2 * i) / sides;
                    const x = size * Math.sin(angle);
                    const y = size * Math.cos(angle);
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
            }

            // Draw a rounded rectangle
            drawRoundedRect(size) {
                const width = size * 1.5;
                const height = size;
                const radius = size * 0.2;

                ctx.beginPath();
                ctx.moveTo(-width/2 + radius, -height/2);
                ctx.lineTo(width/2 - radius, -height/2);
                ctx.arcTo(width/2, -height/2, width/2, -height/2 + radius, radius);
                ctx.lineTo(width/2, height/2 - radius);
                ctx.arcTo(width/2, height/2, width/2 - radius, height/2, radius);
                ctx.lineTo(-width/2 + radius, height/2);
                ctx.arcTo(-width/2, height/2, -width/2, height/2 - radius, radius);
                ctx.lineTo(-width/2, -height/2 + radius);
                ctx.arcTo(-width/2, -height/2, -width/2 + radius, -height/2, radius);
                ctx.closePath();
                ctx.fill();
            }

            // Draw a custom flower-like shape
            drawCustomShape(size) {
                const petals = this.sides;
                ctx.beginPath();

                for (let i = 0; i < petals * 2; i++) {
                    const angle = (Math.PI * 2 * i) / (petals * 2);
                    const radius = i % 2 === 0 ? size : size * 0.5;
                    const x = radius * Math.sin(angle);
                    const y = radius * Math.cos(angle);

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        // Use quadratic curves for smoother shapes
                        const prevAngle = (Math.PI * 2 * (i - 1)) / (petals * 2);
                        const prevRadius = (i - 1) % 2 === 0 ? size : size * 0.5;
                        const prevX = prevRadius * Math.sin(prevAngle);
                        const prevY = prevRadius * Math.cos(prevAngle);

                        const cpAngle = (prevAngle + angle) / 2;
                        const cpRadius = size * 1.2;
                        const cpX = cpRadius * Math.sin(cpAngle);
                        const cpY = cpRadius * Math.cos(cpAngle);

                        ctx.quadraticCurveTo(cpX, cpY, x, y);
                    }
                }

                ctx.closePath();
                ctx.fill();
            }
        }

        // Initialize particles
        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // Connect particles with lines
        function connectParticles() {
            const maxDistance = 160; // Slightly increased for shapes

            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Calculate opacity based on distance and particle sizes
                        const opacity = (1 - distance/maxDistance) * 0.7;

                        // Extract color components for gradient lines
                        const colorI = particles[i].color.substring(0, particles[i].color.lastIndexOf(',')) + ', ' + opacity + ')';
                        const colorJ = particles[j].color.substring(0, particles[j].color.lastIndexOf(',')) + ', ' + opacity + ')';

                        // Create gradient for the line
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, colorI);
                        gradient.addColorStop(1, colorJ);

                        // Make line width proportional to particle sizes
                        const avgSize = (particles[i].size + particles[j].size) / 2;
                        const lineWidth = (0.15 + (avgSize * 0.05)) * (1 - distance/maxDistance);

                        // Draw connecting line
                        ctx.beginPath();
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = lineWidth;

                        // Add slight curve to some connections for more interesting visuals
                        if ((particles[i].shapeType + particles[j].shapeType) % 3 === 0) {
                            // Create a curved path
                            const midX = (particles[i].x + particles[j].x) / 2;
                            const midY = (particles[i].y + particles[j].y) / 2;
                            const offset = (particles[i].size * particles[j].size) * 0.01;

                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.quadraticCurveTo(
                                midX + (Math.random() > 0.5 ? offset : -offset),
                                midY + (Math.random() > 0.5 ? offset : -offset),
                                particles[j].x, particles[j].y
                            );
                        } else {
                            // Create a straight line
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                        }

                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.shadowBlur = 0; // Reset shadow before drawing

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        // Start animation
        initParticles();
        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            cancelAnimationFrame(animationFrameId);
        };
    }, [darkMode]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{
                opacity: 0.9,
                backgroundColor: 'transparent',
                mixBlendMode: darkMode ? 'screen' : 'multiply'
            }}
        />
    );
}
