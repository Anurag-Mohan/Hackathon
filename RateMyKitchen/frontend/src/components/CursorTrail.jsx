import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const cursor = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (e) => {
            cursor.current = { x: e.clientX, y: e.clientY };

            // Create particles based on distance moved (interpolation)
            const dx = cursor.current.x - lastPos.current.x;
            const dy = cursor.current.y - lastPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 2) {
                createParticle(cursor.current.x, cursor.current.y);
                lastPos.current = { x: cursor.current.x, y: cursor.current.y };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const createParticle = (x, y) => {
            const size = Math.random() * 4 + 1; // Random size 1-5px
            particles.current.push({
                x,
                y,
                size,
                speedX: (Math.random() - 0.5) * 1.5, // Random horizontal drift
                speedY: Math.random() * -1.5 - 0.5, // Float upwards
                life: 1.0, // Opacity/Life
                decay: Math.random() * 0.02 + 0.01,
                color: Math.random() > 0.5 ? '20, 184, 166' : '59, 130, 246' // Teal or Blue
            });

            // Limit particles for performance
            if (particles.current.length > 100) {
                particles.current.shift();
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach((p, index) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.life -= p.decay;

                if (p.life <= 0) {
                    particles.current.splice(index, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
                    // Add a subtle shine/glow
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = `rgba(${p.color}, ${p.life * 0.5})`;
                    ctx.fill();
                    ctx.shadowBlur = 0; // Reset
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

export default CursorTrail;
