'use client';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './DotGrid.css';

const throttle = (func, limit) => {
    let lastCall = 0;
    return function (...args) {
        const now = performance.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
};

function hexToRgb(hex) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
}

const DotGrid = ({
    dotSize = 16,
    gap = 32,
    baseColor = '#e5e7eb', // Default to gray-200
    activeColor = '#000000', // Default to black
    proximity = 150,
    speedTrigger = 100,
    shockRadius = 250,
    shockStrength = 5,
    maxSpeed = 5000,
    resistance = 750,
    returnDuration = 1.5,
    className = '',
    style
}) => {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const dotsRef = useRef([]);
    const pointerRef = useRef({
        x: -10000,
        y: -10000,
        vx: 0,
        vy: 0,
        speed: 0,
        lastTime: 0,
        lastX: 0,
        lastY: 0
    });

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const circlePath = useMemo(() => {
        if (typeof window === 'undefined' || !window.Path2D) return null;

        const p = new window.Path2D();
        p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
        return p;
    }, [dotSize]);

    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        const cols = Math.floor((width + gap) / (dotSize + gap));
        const rows = Math.floor((height + gap) / (dotSize + gap));
        const cell = dotSize + gap;

        const gridW = cell * cols - gap;
        const gridH = cell * rows - gap;

        const extraX = width - gridW;
        const extraY = height - gridH;

        const startX = extraX / 2 + dotSize / 2;
        const startY = extraY / 2 + dotSize / 2;

        const dots = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
            }
        }
        dotsRef.current = dots;
    }, [dotSize, gap]);

    useEffect(() => {
        if (!circlePath) return;

        let rafId;
        const proxSq = proximity * proximity;

        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: px, y: py } = pointerRef.current;

            for (const dot of dotsRef.current) {
                const ox = dot.cx + dot.xOffset;
                const oy = dot.cy + dot.yOffset;
                const dx = dot.cx - px;
                const dy = dot.cy - py;
                const dsq = dx * dx + dy * dy;

                let style = baseColor;
                let scale = 1;

                if (dsq <= proxSq) {
                    const dist = Math.sqrt(dsq);
                    const t = 1 - dist / proximity;

                    // Color blending
                    const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                    const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                    const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                    style = `rgb(${r},${g},${b})`;

                    // Scale calculation (grow up to 2.5x at center)
                    scale = 1 + (t * 1.5);

                    // Add Glow Effect
                    ctx.shadowBlur = t * 15; // Glow intensity based on proximity
                    ctx.shadowColor = style;
                } else {
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                }

                ctx.save();
                ctx.translate(ox, oy);
                ctx.scale(scale, scale); // Apply growth
                ctx.fillStyle = style;
                ctx.fill(circlePath);
                ctx.restore();
            }

            rafId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafId);
    }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

    useEffect(() => {
        buildGrid();
        let ro = null;
        if ('ResizeObserver' in window) {
            ro = new ResizeObserver(buildGrid);
            wrapperRef.current && ro.observe(wrapperRef.current);
        } else {
            window.addEventListener('resize', buildGrid);
        }
        return () => {
            if (ro) ro.disconnect();
            else window.removeEventListener('resize', buildGrid);
        };
    }, [buildGrid]);

    useEffect(() => {
        const onMove = e => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Update pointerRef for the draw loop (color/scale/glow)
            pointerRef.current.x = mouseX;
            pointerRef.current.y = mouseY;

            for (const dot of dotsRef.current) {
                // Calculate distance from mouse to dot center
                const dx = dot.cx - mouseX;
                const dy = dot.cy - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // If within proximity, repel based on distance (not speed)
                if (dist < proximity) {
                    const force = (proximity - dist) / proximity; // 0 to 1
                    const angle = Math.atan2(dy, dx);

                    // New target position: push away by a factor of shockStrength
                    // This is a static displacement based on current mouse position, 
                    // not an impulsive force, creating a smooth "magnetic" repulsion.
                    const pushX = Math.cos(angle) * (force * shockStrength * 20); // Multiplier for pixel distance
                    const pushY = Math.sin(angle) * (force * shockStrength * 20);

                    // Smoothly animate to this new offset
                    gsap.to(dot, {
                        xOffset: pushX,
                        yOffset: pushY,
                        duration: 0.3,
                        ease: "power1.out",
                        overwrite: "auto"
                    });
                } else {
                    // If moving out of range, return to 0
                    if (dot.xOffset !== 0 || dot.yOffset !== 0) {
                        gsap.to(dot, {
                            xOffset: 0,
                            yOffset: 0,
                            duration: returnDuration,
                            ease: "elastic.out(1, 0.3)",
                            overwrite: "auto"
                        });
                    }
                }
            }
        };

        const onClick = e => {
            // Optional: Keep a small ripple on click, or remove if requested.
            // User said "remove initial spreading", so let's keep click subtle or minimal.
            // We'll leave it out to be safe and purely minimal as requested.
        };

        const onLeave = () => {
            // Move pointer far away to trigger the "out of proximity" return logic
            pointerRef.current.x = -10000;
            pointerRef.current.y = -10000;
        };

        const throttledMove = throttle(onMove, 16); // Run smoother (approx 60fps)
        window.addEventListener('mousemove', throttledMove, { passive: true });
        window.addEventListener('mouseout', onLeave);

        return () => {
            window.removeEventListener('mousemove', throttledMove);
            window.removeEventListener('mouseout', onLeave);
        };
    }, [proximity, returnDuration, shockStrength]);

    return (
        <section className={`dot-grid ${className}`} style={style}>
            <div ref={wrapperRef} className="dot-grid__wrap">
                <canvas ref={canvasRef} className="dot-grid__canvas" />
            </div>
        </section>
    );
};

export default DotGrid;
