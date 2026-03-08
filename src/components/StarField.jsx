import React, { useRef, useEffect } from 'react';

const StarField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let mouseX = canvas.width / 2;
        let mouseY = canvas.height / 2;

        // --- STARS ---
        const stars = [];
        const STAR_COUNT = 120;

        // --- SHIPS ---
        const ships = [];
        const SHIP_COUNT = 5;
        const bullets = [];
        const explosions = [];
        const speechBubbles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight || window.innerHeight;
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY + window.scrollY;
        };

        // Pixel block helper
        const px = (x, y, w, h) => {
            ctx.fillRect(Math.round(x), Math.round(y), w, h);
        };

        // --- DETAILED PIXEL SHIP DRAWERS ---
        const shipTypes = [
            {
                name: 'Fighter',
                draw: (ctx, x, y, angle, color, s) => {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    const p = s; // pixel unit

                    // Main fuselage
                    ctx.fillStyle = color;
                    px(-3*p, -1*p, 6*p, 2*p);   // core body
                    px(-2*p, -2*p, 4*p, 1*p);   // upper hull
                    px(-2*p, 1*p, 4*p, 1*p);    // lower hull
                    
                    // Nose
                    ctx.fillStyle = lighten(color, 30);
                    px(3*p, -0.5*p, 2*p, 1*p);
                    px(5*p, -0.25*p, 1*p, 0.5*p);

                    // Cockpit window
                    ctx.fillStyle = '#00ffff';
                    px(1*p, -0.5*p, 1.5*p, 1*p);
                    ctx.fillStyle = '#88ffff';
                    px(1.5*p, -0.25*p, 0.5*p, 0.5*p);

                    // Wings
                    ctx.fillStyle = darken(color, 20);
                    px(-2*p, -4*p, 2*p, 2*p);   // top wing
                    px(-2*p, 2*p, 2*p, 2*p);    // bottom wing
                    px(-1*p, -3.5*p, 1*p, 1*p); // wing tip
                    px(-1*p, 2.5*p, 1*p, 1*p);

                    // Wing stripes
                    ctx.fillStyle = '#ffb300';
                    px(-2*p, -3*p, 2*p, 0.5*p);
                    px(-2*p, 2.5*p, 2*p, 0.5*p);

                    // Engine
                    ctx.fillStyle = '#444466';
                    px(-4*p, -1.5*p, 1*p, 3*p);

                    // Thruster flames (animated)
                    const flicker = Math.random();
                    ctx.fillStyle = flicker > 0.5 ? '#ff4400' : '#ff8800';
                    px(-5*p, -1*p, 1*p, 2*p);
                    ctx.fillStyle = flicker > 0.3 ? '#ffcc00' : '#ff6600';
                    const flameLen = 1 + Math.random() * 2;
                    px(-5*p - flameLen*p, -0.5*p, flameLen*p, 1*p);

                    ctx.restore();
                }
            },
            {
                name: 'Cruiser',
                draw: (ctx, x, y, angle, color, s) => {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    const p = s;

                    // Heavy hull
                    ctx.fillStyle = color;
                    px(-4*p, -2*p, 8*p, 4*p);
                    px(-3*p, -3*p, 6*p, 1*p);
                    px(-3*p, 2*p, 6*p, 1*p);

                    // Armored front
                    ctx.fillStyle = lighten(color, 20);
                    px(4*p, -1.5*p, 2*p, 3*p);
                    px(6*p, -0.5*p, 1*p, 1*p);

                    // Bridge
                    ctx.fillStyle = '#00e5ff';
                    px(2*p, -1*p, 1.5*p, 2*p);
                    ctx.fillStyle = '#66f0ff';
                    px(2.5*p, -0.5*p, 0.5*p, 1*p);

                    // Gun turrets
                    ctx.fillStyle = '#ffb300';
                    px(-1*p, -4*p, 1.5*p, 1*p);
                    px(-1*p, 3*p, 1.5*p, 1*p);
                    ctx.fillStyle = '#ff8c00';
                    px(-0.5*p, -5*p, 0.5*p, 1*p); // barrel
                    px(-0.5*p, 4*p, 0.5*p, 1*p);

                    // Engine block
                    ctx.fillStyle = '#333355';
                    px(-5*p, -2.5*p, 1*p, 5*p);

                    // Dual thrusters
                    const fl = Math.random();
                    ctx.fillStyle = fl > 0.5 ? '#00ff87' : '#00cc66';
                    px(-6*p, -2*p, 1*p, 1.5*p);
                    px(-6*p, 0.5*p, 1*p, 1.5*p);
                    ctx.fillStyle = fl > 0.3 ? '#44ffaa' : '#00ff87';
                    const fLen = 0.5 + Math.random() * 1.5;
                    px(-6*p - fLen*p, -1.5*p, fLen*p, 0.5*p);
                    px(-6*p - fLen*p, 1*p, fLen*p, 0.5*p);

                    // Hull detail lines
                    ctx.fillStyle = darken(color, 15);
                    px(-2*p, -0.25*p, 4*p, 0.5*p);

                    ctx.restore();
                }
            },
            {
                name: 'Rocket',
                draw: (ctx, x, y, angle, color, s) => {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    const p = s;

                    // Cylindrical body
                    ctx.fillStyle = color;
                    px(-3*p, -1.5*p, 6*p, 3*p);
                    
                    // Nose cone (stepped pixel art)
                    ctx.fillStyle = lighten(color, 25);
                    px(3*p, -1*p, 1.5*p, 2*p);
                    px(4.5*p, -0.5*p, 1*p, 1*p);
                    // Red tip
                    ctx.fillStyle = '#ff4444';
                    px(5.5*p, -0.25*p, 0.75*p, 0.5*p);

                    // Fin stabilizers
                    ctx.fillStyle = darken(color, 25);
                    px(-3*p, -3*p, 1.5*p, 1.5*p);
                    px(-3*p, 1.5*p, 1.5*p, 1.5*p);
                    // Fin edge
                    ctx.fillStyle = '#ff6b6b';
                    px(-3*p, -3.5*p, 0.5*p, 0.5*p);
                    px(-3*p, 3*p, 0.5*p, 0.5*p);

                    // Portholes
                    ctx.fillStyle = '#ffdd00';
                    px(0*p, -0.5*p, 0.75*p, 1*p);
                    px(-1.5*p, -0.5*p, 0.75*p, 1*p);

                    // Engine bell
                    ctx.fillStyle = '#555577';
                    px(-4*p, -2*p, 1*p, 4*p);

                    // Big flame
                    const fl = Math.random();
                    ctx.fillStyle = fl > 0.5 ? '#ff4400' : '#ffaa00';
                    px(-5.5*p, -1.5*p, 1.5*p, 3*p);
                    ctx.fillStyle = fl > 0.3 ? '#ffcc00' : '#ff6600';
                    const fLen = 1 + Math.random() * 3;
                    px(-5.5*p - fLen*p, -1*p, fLen*p, 2*p);
                    ctx.fillStyle = '#ffffff';
                    px(-5*p, -0.25*p, 0.5*p, 0.5*p); // hot core

                    ctx.restore();
                }
            }
        ];

        // Color helpers
        function lighten(hex, amt) {
            let r = parseInt(hex.slice(1,3), 16);
            let g = parseInt(hex.slice(3,5), 16);
            let b = parseInt(hex.slice(5,7), 16);
            r = Math.min(255, r + amt);
            g = Math.min(255, g + amt);
            b = Math.min(255, b + amt);
            return `rgb(${r},${g},${b})`;
        }

        function darken(hex, amt) {
            let r = parseInt(hex.slice(1,3), 16);
            let g = parseInt(hex.slice(3,5), 16);
            let b = parseInt(hex.slice(5,7), 16);
            r = Math.max(0, r - amt);
            g = Math.max(0, g - amt);
            b = Math.max(0, b - amt);
            return `rgb(${r},${g},${b})`;
        }

        const shipColors = ['#00bfff', '#22cc77', '#e05555', '#ddaa22', '#8877ee'];
        const sorryMessages = [
            'SORRY!!',
            'MY BAD!',
            'OOPS!',
            'WATCH OUT!',
            'SORRY BRO!',
            'DIDN\'T MEAN TO!',
            'PARDON ME!',
            'WHOOPS!',
            'FORGIVE ME!',
            'SO SORRY LOL',
        ];

        const createStars = () => {
            stars.length = 0;
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() > 0.7 ? 3 : (Math.random() > 0.5 ? 2 : 1),
                    opacity: Math.random() * 0.7 + 0.3,
                    speed: Math.random() * 0.003 + 0.001,
                    phase: Math.random() * Math.PI * 2,
                    color: Math.random() > 0.8
                        ? 'rgba(0, 229, 255,'
                        : Math.random() > 0.6
                            ? 'rgba(0, 255, 135,'
                            : 'rgba(255, 255, 255,',
                });
            }
        };

        const createShips = () => {
            ships.length = 0;
            for (let i = 0; i < SHIP_COUNT; i++) {
                const typeIndex = Math.floor(Math.random() * shipTypes.length);
                ships.push({
                    x: Math.random() * canvas.width,
                    y: 100 + Math.random() * (canvas.height - 200),
                    vx: (Math.random() - 0.5) * 1,
                    vy: (Math.random() - 0.5) * 1,
                    angle: Math.random() * Math.PI * 2,
                    targetAngle: Math.random() * Math.PI * 2,
                    type: typeIndex,
                    color: shipColors[i % shipColors.length],
                    size: 4,  // pixel unit size — ships are about 40-60px now
                    shootCooldown: Math.random() * 150,
                    shootInterval: 90 + Math.random() * 120,
                    targetShip: null,
                    turnTimer: 0,
                    turnInterval: 80 + Math.random() * 120,
                    hp: 3,
                    respawnTimer: 0,
                    alive: true,
                    userShootCooldown: 0,
                    userShootInterval: 400 + Math.random() * 600,
                });
            }
        };

        const spawnBullet = (ship, targetX, targetY, isUserShot = false) => {
            const angle = Math.atan2(targetY - ship.y, targetX - ship.x);
            const speed = isUserShot ? 2.5 : 3.5;
            const noseOffset = ship.size * 5;
            bullets.push({
                x: ship.x + Math.cos(ship.angle) * noseOffset,
                y: ship.y + Math.sin(ship.angle) * noseOffset,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: isUserShot ? 120 : 80,
                color: isUserShot ? '#ff4444' : ship.color,
                owner: ship,
                isUserShot,
                size: isUserShot ? 4 : 3,
            });

            if (isUserShot) {
                const msg = sorryMessages[Math.floor(Math.random() * sorryMessages.length)];
                speechBubbles.push({
                    x: ship.x,
                    y: ship.y - ship.size * 6,
                    text: msg,
                    life: 120,
                    maxLife: 120,
                    ship,
                });
            }
        };

        const spawnExplosion = (x, y, color) => {
            const particleCount = 12 + Math.floor(Math.random() * 8);
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
                const speed = 1.5 + Math.random() * 3;
                explosions.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 25 + Math.random() * 20,
                    maxLife: 45,
                    size: 3 + Math.random() * 3,
                    color,
                });
            }
        };

        const updateShips = () => {
            ships.forEach((ship) => {
                if (!ship.alive) {
                    ship.respawnTimer--;
                    if (ship.respawnTimer <= 0) {
                        ship.alive = true;
                        ship.hp = 3;
                        ship.x = Math.random() * canvas.width;
                        ship.y = 100 + Math.random() * (canvas.height - 200);
                    }
                    return;
                }

                // Steering
                ship.turnTimer--;
                if (ship.turnTimer <= 0) {
                    ship.turnTimer = ship.turnInterval;
                    const otherShips = ships.filter(s => s !== ship && s.alive);
                    if (otherShips.length > 0) {
                        ship.targetShip = otherShips[Math.floor(Math.random() * otherShips.length)];
                    }
                    if (ship.targetShip && ship.targetShip.alive) {
                        ship.targetAngle = Math.atan2(
                            ship.targetShip.y - ship.y,
                            ship.targetShip.x - ship.x
                        );
                    } else {
                        ship.targetAngle = ship.angle + (Math.random() - 0.5) * 1.5;
                    }
                }

                // Smooth rotation
                let angleDiff = ship.targetAngle - ship.angle;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                ship.angle += angleDiff * 0.03;

                // Movement
                ship.vx += Math.cos(ship.angle) * 0.015;
                ship.vy += Math.sin(ship.angle) * 0.015;
                ship.vx *= 0.994;
                ship.vy *= 0.994;
                const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
                if (speed > 0.9) {
                    ship.vx = (ship.vx / speed) * 0.9;
                    ship.vy = (ship.vy / speed) * 0.9;
                }
                ship.x += ship.vx;
                ship.y += ship.vy;

                // Wrap
                if (ship.x < -80) ship.x = canvas.width + 60;
                if (ship.x > canvas.width + 80) ship.x = -60;
                if (ship.y < -80) ship.y = canvas.height + 60;
                if (ship.y > canvas.height + 80) ship.y = -60;

                // Shoot at other ships
                ship.shootCooldown--;
                if (ship.shootCooldown <= 0 && ship.targetShip && ship.targetShip.alive) {
                    const dx = ship.targetShip.x - ship.x;
                    const dy = ship.targetShip.y - ship.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 400) {
                        spawnBullet(ship, ship.targetShip.x, ship.targetShip.y, false);
                        ship.shootCooldown = ship.shootInterval;
                    }
                }

                // Occasionally shoot at user's cursor!
                ship.userShootCooldown--;
                if (ship.userShootCooldown <= 0) {
                    const dx = mouseX - ship.x;
                    const dy = mouseY - ship.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 500 && dist > 50) {
                        spawnBullet(ship, mouseX, mouseY, true);
                    }
                    ship.userShootCooldown = ship.userShootInterval;
                }
            });
        };

        const updateBullets = () => {
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.x += b.vx;
                b.y += b.vy;
                b.life--;

                if (b.life <= 0) {
                    bullets.splice(i, 1);
                    continue;
                }

                // Bullet-ship collision (not for user shots)
                if (!b.isUserShot) {
                    for (const ship of ships) {
                        if (!ship.alive || ship === b.owner) continue;
                        const dx = ship.x - b.x;
                        const dy = ship.y - b.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < ship.size * 4) {
                            ship.hp--;
                            spawnExplosion(b.x, b.y, b.color);
                            bullets.splice(i, 1);
                            if (ship.hp <= 0) {
                                ship.alive = false;
                                ship.respawnTimer = 180 + Math.random() * 120;
                                spawnExplosion(ship.x, ship.y, ship.color);
                                spawnExplosion(ship.x, ship.y, '#ffb300');
                            }
                            break;
                        }
                    }
                }
                // User-targeted bullets just fly and expire (cosmetic)
            }
        };

        const updateExplosions = () => {
            for (let i = explosions.length - 1; i >= 0; i--) {
                const p = explosions[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.life--;
                if (p.life <= 0) explosions.splice(i, 1);
            }
        };

        const updateSpeechBubbles = () => {
            for (let i = speechBubbles.length - 1; i >= 0; i--) {
                const sb = speechBubbles[i];
                sb.life--;
                // Follow the ship
                if (sb.ship && sb.ship.alive) {
                    sb.x = sb.ship.x;
                    sb.y = sb.ship.y - sb.ship.size * 7;
                }
                if (sb.life <= 0) speechBubbles.splice(i, 1);
            }
        };

        // --- DRAWING ---
        const drawStars = (time) => {
            stars.forEach((star) => {
                const twinkle = 0.3 + 0.7 * Math.sin(time * star.speed + star.phase);
                const alpha = twinkle * star.opacity;
                ctx.fillStyle = star.color + alpha + ')';
                ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
            });
        };

        const drawShips = () => {
            ships.forEach((ship) => {
                if (!ship.alive) return;
                shipTypes[ship.type].draw(ctx, Math.round(ship.x), Math.round(ship.y), ship.angle, ship.color, ship.size);
            });
        };

        const drawBullets = () => {
            bullets.forEach((b) => {
                ctx.save();
                ctx.shadowColor = b.color;
                ctx.shadowBlur = b.isUserShot ? 10 : 6;
                ctx.fillStyle = b.color;
                // Pixel laser bolt
                const angle = Math.atan2(b.vy, b.vx);
                ctx.translate(Math.round(b.x), Math.round(b.y));
                ctx.rotate(angle);
                ctx.fillRect(-b.size, -1, b.size * 2, 2);
                if (b.isUserShot) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(-1, -0.5, 2, 1);
                }
                ctx.restore();
                ctx.shadowBlur = 0;
            });
        };

        const drawExplosions = () => {
            explosions.forEach((p) => {
                const alpha = p.life / p.maxLife;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(
                    Math.round(p.x) - p.size / 2,
                    Math.round(p.y) - p.size / 2,
                    p.size,
                    p.size
                );
                ctx.globalAlpha = 1;
            });
        };

        const drawSpeechBubbles = () => {
            speechBubbles.forEach((sb) => {
                const alpha = Math.min(1, sb.life / 30);
                ctx.save();
                ctx.globalAlpha = alpha;

                ctx.font = 'bold 11px "Press Start 2P", monospace';
                const textWidth = ctx.measureText(sb.text).width;
                const padX = 10;
                const padY = 6;
                const bw = textWidth + padX * 2;
                const bh = 22;
                const bx = sb.x - bw / 2;
                const by = sb.y - bh;

                // Bubble background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(bx, by, bw, bh);
                // Border
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 2;
                ctx.strokeRect(bx, by, bw, bh);
                // Pointer triangle (pixel style)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(sb.x - 3, by + bh, 6, 4);
                ctx.fillRect(sb.x - 1.5, by + bh + 4, 3, 3);

                // Text
                ctx.fillStyle = '#cc0000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(sb.text, sb.x, by + bh / 2 + 1);

                ctx.globalAlpha = 1;
                ctx.restore();
            });
        };

        const animate = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStars(time);
            updateShips();
            updateBullets();
            updateExplosions();
            updateSpeechBubbles();
            drawShips();
            drawBullets();
            drawExplosions();
            drawSpeechBubbles();
            animationId = requestAnimationFrame(animate);
        };

        resize();
        createStars();
        createShips();
        animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            resize();
            createStars();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="star-field-canvas" />;
};

export default StarField;
