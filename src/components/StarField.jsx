import React, { useRef, useEffect } from 'react';

/*
 * Scene-aware background canvas:
 * SPLASH:   Sunny pixelated city, Avengers Tower, Iron Man on helipad, Thor flying
 * WELCOME:  Same city but Doom arrives, destroying buildings, smoke & fire
 * LEVELS:   Avengers fighting Doom on the ground
 * BOSS:     Dark, ruined city
 * CREDITS:  Peaceful city, sun setting
 *
 * STRICT 6-color palette:
 * #cbcec4 Pearl Grey | #e2a449 Brass Mesh | #76908e Juniper
 * #1a7b86 Caribe     | #bf4723 Devil's Butterfly | #333c38 Rookwood
 */

const StarField = ({ doomHp = 100, gameState = 'splash' }) => {
    const canvasRef = useRef(null);
    const doomHpRef = useRef(doomHp);
    const gameStateRef = useRef(gameState);

    useEffect(() => { doomHpRef.current = doomHp; }, [doomHp]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;

        // Thor (splash scene)
        const thor = { x: 200, y: 150, vx: 1.2, vy: -0.5, size: 5, bobPhase: 0 };

        // Doom (welcome & level scenes)
        const doom = { x: 0, y: 0, vx: 0.3, floatPhase: 0, size: 5, hitFlash: 0 };

        // Avengers (level scenes)
        const avengers = [];

        // Clouds
        const clouds = [];

        // Projectiles & explosions (level scenes)
        const projectiles = [];
        const explosions = [];
        const speechBubbles = [];

        // Doom destruction debris (welcome scene)
        const fireParticles = [];

        let sunX = 0, sunY = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight || window.innerHeight;
            sunX = canvas.width * 0.2;
            sunY = canvas.height * 0.12;
            doom.x = canvas.width * 0.82;
            doom.y = canvas.height * 0.5;
            createClouds();
        };

        const px = (x, y, w, h) => ctx.fillRect(Math.round(x), Math.round(y), w, h);

        const createClouds = () => {
            clouds.length = 0;
            for (let i = 0; i < 7; i++) {
                clouds.push({
                    x: Math.random() * canvas.width * 1.5,
                    y: canvas.height * 0.05 + Math.random() * canvas.height * 0.22,
                    w: 60 + Math.random() * 100,
                    h: 15 + Math.random() * 20,
                    speed: 0.1 + Math.random() * 0.12,
                });
            }
        };

        const createAvengers = () => {
            avengers.length = 0;
            const gY = canvas.height * 0.55;
            const types = ['ironman', 'cap', 'thor', 'hulk', 'widow', 'hawkeye', 'strange'];
            for (let i = 0; i < 7; i++) {
                avengers.push({
                    x: 50 + i * (canvas.width * 0.06) + Math.random() * 30,
                    baseY: gY + Math.random() * (canvas.height * 0.12),
                    y: gY, vx: (Math.random()-0.3)*0.4, type: types[i],
                    size: 5, facing: 1, bobPhase: Math.random() * Math.PI * 2,
                    shootCooldown: 30 + Math.random() * 80,
                    shootInterval: 70 + Math.random() * 80,
                });
            }
        };

        // ========================================
        //  SKY
        // ========================================
        const drawSky = (darkMode) => {
            const w = canvas.width, h = canvas.height;
            const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
            if (darkMode) {
                // Doom mode
                skyGrad.addColorStop(0, '#333c38'); // Rookwood
                skyGrad.addColorStop(0.6, '#333c38'); 
                skyGrad.addColorStop(1, '#76908e'); // Juniper (Lighten the bottom)
            } else {
                skyGrad.addColorStop(0, '#1a7b86');
                skyGrad.addColorStop(0.4, '#76908e');
                skyGrad.addColorStop(1, '#cbcec4');
            }
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, w, h * 0.65);
        };

        const drawSun = () => {
            ctx.fillStyle = '#e2a449';
            const s = 8;
            [[-2,-3,4,1],[-3,-2,6,1],[-3,-1,6,1],[-3,0,6,1],[-3,1,6,1],[-2,2,4,1]].forEach(([ox,oy,w,h]) => {
                px(sunX+ox*s, sunY+oy*s, w*s, h*s);
            });
            ctx.fillStyle = 'rgba(226, 164, 73, 0.08)';
            ctx.beginPath(); ctx.arc(sunX, sunY, 120, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(226, 164, 73, 0.04)';
            ctx.beginPath(); ctx.arc(sunX, sunY, 200, 0, Math.PI*2); ctx.fill();
        };

        const drawClouds = (dark) => {
            clouds.forEach(c => {
                c.x += c.speed;
                if (c.x > canvas.width + 150) c.x = -c.w - 50;
                ctx.fillStyle = dark ? 'rgba(51, 60, 56, 0.5)' : 'rgba(203, 206, 196, 0.6)';
                px(c.x, c.y, c.w, c.h);
                px(c.x + c.w*0.15, c.y - c.h*0.6, c.w*0.3, c.h*0.6);
                px(c.x + c.w*0.45, c.y - c.h*0.8, c.w*0.35, c.h*0.8);
                px(c.x + c.w*0.7, c.y - c.h*0.4, c.w*0.2, c.h*0.4);
            });
        };

        // ========================================
        //  CITY BUILDINGS
        // ========================================
        const baseBuildingDefs = [
            {x:0.02,bw:0.04,bh:0.18},{x:0.07,bw:0.035,bh:0.28},{x:0.11,bw:0.05,bh:0.22},
            {x:0.17,bw:0.03,bh:0.32},{x:0.21,bw:0.04,bh:0.16},{x:0.26,bw:0.035,bh:0.26},
            {x:0.30,bw:0.045,bh:0.20},{x:0.35,bw:0.03,bh:0.30},{x:0.39,bw:0.04,bh:0.14},
            {x:0.44,bw:0.035,bh:0.24},{x:0.48,bw:0.04,bh:0.19},{x:0.53,bw:0.03,bh:0.28},
            {x:0.57,bw:0.04,bh:0.15},{x:0.62,bw:0.035,bh:0.22},{x:0.66,bw:0.03,bh:0.26},
        ];

        const drawBuildings = (destroyed) => {
            const w = canvas.width, h = canvas.height;
            const groundY = h * 0.65;

            // Ground
            ctx.fillStyle = '#333c38';
            ctx.fillRect(0, groundY, w, h * 0.35);

            // Ground texture
            ctx.fillStyle = 'rgba(118, 144, 142, 0.06)';
            for (let i = 0; i < 30; i++) {
                ctx.fillRect(Math.random()*w, groundY+10+Math.random()*(h*0.3), 2+Math.random()*6, 1);
            }

            // Buildings
            baseBuildingDefs.forEach((b, idx) => {
                const bx = b.x * w;
                const bw2 = b.bw * w;
                let bh2 = b.bh * h * 0.5;
                const isDestroyed = destroyed && (idx === 3 || idx === 7 || idx === 11);

                if (isDestroyed) bh2 *= 0.5; // Half height = destroyed

                const by = groundY - bh2;
                ctx.fillStyle = idx % 2 === 0 ? '#333c38' : '#76908e';
                ctx.fillRect(bx, by, bw2, bh2);

                // Windows (Brass Mesh)
                ctx.fillStyle = destroyed ? 'rgba(191, 71, 35, 0.15)' : 'rgba(226, 164, 73, 0.2)';
                for (let wy = by + 8; wy < by + bh2 - 6; wy += 10) {
                    for (let wx = bx + 4; wx < bx + bw2 - 4; wx += 8) {
                        if (Math.random() > 0.4) ctx.fillRect(wx, wy, 4, 4);
                    }
                }

                // Destruction effects - rubble, fire
                if (isDestroyed) {
                    // Rubble at base
                    ctx.fillStyle = '#76908e';
                    for (let r = 0; r < 5; r++) {
                        px(bx - 5 + Math.random()*bw2*1.5, groundY - 4 - Math.random()*8, 4+Math.random()*6, 3+Math.random()*4);
                    }
                    // Fire/smoke
                    ctx.fillStyle = 'rgba(191, 71, 35, 0.4)';
                    px(bx + bw2*0.2, by - 4, bw2*0.3, 6);
                    px(bx + bw2*0.5, by - 6, bw2*0.25, 8);
                    ctx.fillStyle = 'rgba(226, 164, 73, 0.3)';
                    px(bx + bw2*0.3, by - 8, bw2*0.2, 4);
                    // Smoke
                    ctx.fillStyle = 'rgba(51, 60, 56, 0.3)';
                    ctx.beginPath();
                    ctx.arc(bx + bw2/2, by - 15 - Math.random()*5, 12 + Math.random()*8, 0, Math.PI*2);
                    ctx.fill();
                }
            });
        };

        // ========================================
        //  AVENGERS TOWER
        // ========================================
        const drawAvengersT = (damaged) => {
            const w = canvas.width, h = canvas.height;
            const groundY = h * 0.65;
            const towerX = w * 0.72;
            const towerW = w * 0.09;
            const towerH = damaged ? h * 0.35 : h * 0.42;
            const towerY = groundY - towerH;

            // Main tower (Juniper)
            ctx.fillStyle = '#76908e';
            ctx.fillRect(towerX, towerY, towerW, towerH);

            // Upper section (Caribe)
            const upperW = towerW * 0.7;
            const upperX = towerX + (towerW - upperW) / 2;
            const upperH = towerH * 0.3;
            ctx.fillStyle = '#1a7b86';
            ctx.fillRect(upperX, towerY - upperH*0.5, upperW, upperH);

            // Antenna
            const peakW = towerW * 0.15;
            const peakX = towerX + (towerW - peakW) / 2;
            ctx.fillStyle = '#76908e';
            ctx.fillRect(peakX, towerY - upperH*0.5 - towerH*0.12, peakW, towerH*0.12);

            // "D" logo (Brass Mesh)
            ctx.fillStyle = '#e2a449';
            const ls = Math.max(8, towerW * 0.3);
            const lx = towerX + (towerW - ls) / 2;
            const ly = towerY + towerH * 0.25;
            px(lx, ly, ls*0.25, ls); // Left stem
            px(lx + ls*0.25, ly, ls*0.5, ls*0.15); // Top
            px(lx + ls*0.25, ly + ls*0.85, ls*0.5, ls*0.15); // Bottom
            px(lx + ls*0.75, ly + ls*0.15, ls*0.25, ls*0.7); // Right

            // Windows
            ctx.fillStyle = 'rgba(226, 164, 73, 0.25)';
            for (let wy = towerY + 10; wy < groundY - 10; wy += 12) {
                for (let wx = towerX + 6; wx < towerX + towerW - 6; wx += 10) {
                    ctx.fillRect(wx, wy, 5, 6);
                }
            }

            // Helipad
            const padY = towerY - upperH*0.5 - towerH*0.12 - 8;
            const padW = towerW * 0.6;
            const padX = towerX + (towerW - padW) / 2;
            ctx.fillStyle = '#333c38';
            ctx.fillRect(padX - 5, padY, padW + 10, 8);
            ctx.fillStyle = '#1a7b86';
            ctx.fillRect(padX + padW*0.3, padY + 1, padW*0.4, 6);

            // Damage effects on tower (welcome scene)
            if (damaged) {
                ctx.fillStyle = 'rgba(191, 71, 35, 0.4)';
                px(towerX + towerW*0.1, towerY + towerH*0.3, towerW*0.3, 8);
                px(towerX + towerW*0.5, towerY + towerH*0.5, towerW*0.25, 6);
                ctx.fillStyle = 'rgba(51, 60, 56, 0.4)';
                ctx.beginPath();
                ctx.arc(towerX + towerW*0.3, towerY + towerH*0.25, 15, 0, Math.PI*2);
                ctx.fill();
            }

            // More buildings behind tower
            ctx.fillStyle = '#333c38';
            ctx.fillRect(w*0.82, groundY-h*0.16, w*0.04, h*0.16);
            ctx.fillRect(w*0.87, groundY-h*0.22, w*0.035, h*0.22);
            ctx.fillRect(w*0.91, groundY-h*0.12, w*0.04, h*0.12);
            ctx.fillRect(w*0.96, groundY-h*0.18, w*0.04, h*0.18);

            return { padX: padX + padW/2, padY };
        };

        // ========================================
        //  CHARACTER DRAWERS (PALETTE ONLY)
        // ========================================
        // --- DETAILED CHARACTER DRAWERS ---
        const drawIronMan = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Helmet (Rust/Devil's Butterfly)
            ctx.fillStyle = '#bf4723'; px(-2.5*p, -7*p, 5*p, 4*p);
            // Faceplate (Gold/Brass Mesh)
            ctx.fillStyle = '#e2a449'; px(-1.5*p, -5.5*p, 3*p, 2.5*p);
            // Eyes (Pearl Grey)
            ctx.fillStyle = '#cbcec4'; px(-1*p, -5*p, 0.7*p, 0.5*p); px(0.3*p, -5*p, 0.7*p, 0.5*p);
            // Body
            ctx.fillStyle = '#bf4723'; px(-3.5*p, -3*p, 7*p, 6*p);
            // Reactor (Teal/Caribe)
            ctx.fillStyle = '#1a7b86'; px(-0.7*p, -1.5*p, 1.4*p, 1.4*p);
            // Detail: plating highlights
            ctx.fillStyle = '#e2a449'; px(-3*p, -2.5*p, 0.5*p, 2*p); px(2.5*p, -2.5*p, 0.5*p, 2*p);
            // Shoulders/Arms
            ctx.fillStyle = '#bf4723'; px(-5*p, -2.5*p, 2*p, 5*p); px(3*p, -2.5*p, 2*p, 5*p);
            // Legs
            px(-3*p, 3*p, 2.5*p, 5*p); px(0.5*p, 3*p, 2.5*p, 5*p);
            // Boots
            ctx.fillStyle = '#e2a449'; px(-3*p, 7.5*p, 2.5*p, 1*p); px(0.5*p, 7.5*p, 2.5*p, 1*p);
            ctx.restore();
        };

        const drawCap = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Helmet
            ctx.fillStyle = '#1a7b86'; px(-2.5*p, -7.5*p, 5*p, 4.5*p);
            // Face
            ctx.fillStyle = '#e2a449'; px(-1.5*p, -4.5*p, 3*p, 1.5*p);
            // Mask details (A and ears)
            ctx.fillStyle = '#cbcec4'; px(-0.5*p, -7*p, 1*p, 1*p); px(-2.5*p, -5*p, 0.5*p, 1*p); px(2*p, -5*p, 0.5*p, 1*p);
            // Body
            ctx.fillStyle = '#1a7b86'; px(-3.5*p, -3*p, 7*p, 6*p);
            // Star & Stripes (Simplified)
            ctx.fillStyle = '#cbcec4'; px(-0.6*p, -1.5*p, 1.2*p, 1.2*p);
            ctx.fillStyle = '#bf4723'; px(-2.5*p, 1*p, 5*p, 0.5*p);
            // Belt
            ctx.fillStyle = '#cbcec4'; px(-3.5*p, 2*p, 7*p, 1*p);
            // Shield (Outer Red)
            ctx.fillStyle = '#bf4723'; px(-7.5*p, -1.5*p, 4*p, 4*p);
            // Shield (Inner White)
            ctx.fillStyle = '#cbcec4'; px(-7*p, -1*p, 3*p, 3*p);
            // Shield (Blue Center)
            ctx.fillStyle = '#1a7b86'; px(-6*p, 0, 1*p, 1*p);
            // Legs
            ctx.fillStyle = '#1a7b86'; px(-3*p, 3*p, 2.5*p, 5*p); px(0.5*p, 3*p, 2.5*p, 5*p);
            // Boots
            ctx.fillStyle = '#bf4723'; px(-3*p, 7.5*p, 2.5*p, 1*p); px(0.5*p, 7.5*p, 2.5*p, 1*p);
            ctx.restore();
        };

        const drawThor = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Hair (texture details)
            ctx.fillStyle = '#e2a449'; px(-2.5*p, -8*p, 5*p, 3.5*p); px(-3.5*p, -5*p, 1.5*p, 3*p); px(2*p, -5*p, 1.5*p, 3*p);
            // Face
            px(-1.5*p, -4.5*p, 3*p, 2*p);
            // Cape (Devil's Butterfly) - flapping detail
            ctx.fillStyle = '#bf4723'; px(-5.5*p, -3.5*p, 3*p, 10*p); px(2.5*p, -3.5*p, 3*p, 10*p);
            // Armor (Rookwood)
            ctx.fillStyle = '#333c38'; px(-3.5*p, -3*p, 7*p, 6.5*p);
            // Armor circles (Juniper highlights)
            ctx.fillStyle = '#76908e'; px(-1.8*p, -1.2*p, 1.2*p, 1.2*p); px(0.6*p, -1.2*p, 1.2*p, 1.2*p);
            px(-1.8*p, 1.5*p, 1.2*p, 1.2*p); px(0.6*p, 1.5*p, 1.2*p, 1.2*p);
            // Mjolnir (Juniper/Grey)
            ctx.fillStyle = '#76908e'; px(4.5*p, -1.5*p, 4*p, 2.5*p);
            ctx.fillStyle = '#e2a449'; px(6*p, 1*p, 1*p, 4.5*p); // wrap
            // Legs
            ctx.fillStyle = '#333c38'; px(-3*p, 3.5*p, 2.5*p, 5*p); px(0.5*p, 3.5*p, 2.5*p, 5*p);
            // Boots (Rookwood)
            ctx.fillStyle = '#76908e'; px(-3.5*p, 8*p, 3*p, 1*p); px(0.5*p, 8*p, 3*p, 1*p);
            ctx.restore();
        };

        const drawHulk = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Jaw/Head
            ctx.fillStyle = '#76908e'; px(-3.5*p, -8*p, 7*p, 5.5*p);
            // Hair (Wilder)
            ctx.fillStyle = '#333c38'; px(-3.5*p, -9.5*p, 7*p, 2.5*p); px(-4*p, -8*p, 1*p, 2*p);
            // Body (Massive)
            ctx.fillStyle = '#76908e'; px(-6*p, -4*p, 12*p, 9*p);
            // Muscle definition
            ctx.fillStyle = 'rgba(51, 60, 56, 0.15)'; px(-3*p,-1*p,6*p,0.5*p); px(-5*p, 1*p, 2*p, 0.5*p); px(3*p, 1*p, 2*p, 0.5*p);
            // Pants (Tattered Look)
            ctx.fillStyle = '#bf4723'; px(-6.5*p, 5*p, 6*p, 6*p); px(0.5*p, 5*p, 6*p, 6*p);
            // Arms (Giant)
            ctx.fillStyle = '#76908e'; px(-9.5*p, -3*p, 4*p, 8*p); px(5.5*p, -3*p, 4*p, 8*p);
            ctx.restore();
        };

        const drawWidow = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Hair (Flame-red/Butterfly)
            ctx.fillStyle = '#bf4723'; px(-3*p, -8*p, 6*p, 4*p); px(-3.5*p, -5*p, 2*p, 3*p); px(1.5*p, -5*p, 2*p, 3*p);
            // Face
            ctx.fillStyle = '#e2a449'; px(-1.5*p, -4.5*p, 3*p, 2*p);
            // Body Suit (Sleek)
            ctx.fillStyle = '#333c38'; px(-2.5*p, -3*p, 5*p, 11*p);
            // Red Hourglass Detail
            ctx.fillStyle = '#bf4723'; px(-0.5*p, -1*p, 1*p, 2*p);
            // Belt & Holsters
            ctx.fillStyle = '#cbcec4'; px(-2.5*p, 2.5*p, 5*p, 1*p);
            ctx.fillStyle = '#333c38'; px(-3.5*p, 3*p, 1.5*p, 3*p); px(2*p, 3*p, 1.5*p, 3*p);
            // Gauntlets (Gold highlight)
            ctx.fillStyle = '#e2a449'; px(-4*p, -0.5*p, 1.5*p, 2.5*p); px(2.5*p, -0.5*p, 1.5*p, 2.5*p);
            ctx.restore();
        };

        const drawHawkeye = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Face
            ctx.fillStyle = '#e2a449'; px(-2*p, -7*p, 4*p, 3*p);
            // Hair
            ctx.fillStyle = '#333c38'; px(-2*p, -7.5*p, 4*p, 1.5*p);
            // Body Suit (Purple toned - Juniper blend)
            ctx.fillStyle = '#333c38'; px(-3*p, -4*p, 6*p, 9*p);
            ctx.fillStyle = '#76908e'; px(-3*p, -2*p, 1.5*p, 4*p); px(1.5*p, -2*p, 1.5*p, 4*p);
            // Quiver (Butterfly)
            ctx.fillStyle = '#bf4723'; px(-4.5*p, -5.5*p, 2*p, 6*p);
            // Bow (Rookwood)
            ctx.fillStyle = '#333c38'; px(3*p, -7*p, 1.2*p, 14*p);
            // String (Grey)
            ctx.fillStyle = '#cbcec4'; px(4*p, -7*p, 0.4*p, 14*p);
            ctx.restore();
        };

        const drawStrange = (x, y, s, facing) => {
            ctx.save(); ctx.translate(x, y);
            if (facing < 0) ctx.scale(-1, 1);
            const p = s;
            // Face
            ctx.fillStyle = '#e2a449'; px(-2*p, -7*p, 4*p, 3*p);
            // Hair (Sideburn details)
            ctx.fillStyle = '#333c38'; px(-2*p, -8.5*p, 4*p, 2.5*p); px(-2.5*p, -6.5*p, 1*p, 2*p); px(1.5*p, -6.5*p, 1*p, 2*p);
            // Cloak of Levitation (High detail)
            ctx.fillStyle = '#bf4723'; px(-5*p, -6*p, 10*p, 14*p); px(-5.5*p, -5*p, 11*p, 2*p); // high collar
            // Eye of Agamotto
            ctx.fillStyle = '#e2a449'; px(-0.8*p, -4.7*p, 1.6*p, 1.2*p);
            ctx.fillStyle = '#76908e'; px(-0.2*p, -4.3*p, 0.4*p, 0.4*p);
            // Tunic (Caribe Blue)
            ctx.fillStyle = '#1a7b86'; px(-3.5*p, -4*p, 7*p, 9*p);
            // Magic Circle (Animated)
            if (Math.random() > 0.5) {
                ctx.strokeStyle = '#e2a449'; ctx.lineWidth = s/3; ctx.beginPath(); ctx.arc(6*p, -1*p, 4*p, 0, Math.PI*2); ctx.stroke();
                ctx.fillStyle = 'rgba(226, 164, 73, 0.3)'; px(5*p, -2*p, 2*p, 2*p);
            }
            ctx.restore();
        };

        const drawDoomChar = (x, y, s, hpPct) => {
            ctx.save(); ctx.translate(x, y);
            const p = s;
            // Cape (Heavy Rookwood)
            ctx.fillStyle = '#333c38';
            px(-8*p, -5*p, 3*p, 16*p); px(5*p, -5*p, 3*p, 16*p);
            px(-7*p, 10*p, 14*p, 4*p);
            // Hood
            px(-5*p, -11*p, 10*p, 6*p);
            ctx.fillStyle = '#76908e'; px(-4*p, -10*p, 8*p, 4*p); // inner hood
            // Mask (Juniper/Grey mix)
            ctx.fillStyle = '#76908e'; px(-3.5*p, -7*p, 7*p, 5*p);
            // Rivets & Features
            ctx.fillStyle = '#cbcec4'; px(-3*p, -5*p, 0.6*p, 0.6*p); px(2.4*p, -5*p, 0.6*p, 0.6*p);
            // Eyes (Glowing Orange/Butterfly)
            const eyeC = hpPct > 40 ? '#bf4723' : '#e2a449';
            ctx.fillStyle = eyeC; ctx.shadowColor = eyeC; ctx.shadowBlur = 8;
            px(-2.3*p, -6.2*p, 1.6*p, 1*p); px(0.7*p, -6.2*p, 1.6*p, 1*p);
            ctx.shadowBlur = 0;
            // Body Armor
            ctx.fillStyle = '#333c38'; px(-5*p, -3*p, 10*p, 9*p);
            // Clasp/Medallions
            ctx.fillStyle = '#e2a449'; px(-3*p, -2*p, 1.5*p, 1.5*p); px(1.5*p, -2*p, 1.5*p, 1.5*p);
            // Belt
            ctx.fillStyle = '#bf4723'; px(-5*p, 5*p, 10*p, 1.2*p);
            // Arms
            ctx.fillStyle = '#76908e'; px(-8.5*p, -2.5*p, 3.5*p, 7*p); px(5*p, -2.5*p, 3.5*p, 7*p);
            // Energy Aura
            if (hpPct > 10 && Math.random() > 0.4) {
                ctx.fillStyle = 'rgba(191, 71, 35, 0.4)';
                px(-10*p, 2*p, 2.5*p, 2*p); px(8*p, 2*p, 2.5*p, 2*p);
            }
            // Legs
            ctx.fillStyle = '#76908e'; px(-4*p, 7*p, 3.5*p, 5*p); px(0.5*p, 7*p, 3.5*p, 5*p);
            ctx.restore();
        };

        const drawAvengerDetailed = (x, y, s, type, facing) => {
            switch(type) {
                case 'ironman': drawIronMan(x, y, s, facing); break;
                case 'cap': drawCap(x, y, s, facing); break;
                case 'thor': drawThor(x, y, s, facing); break;
                case 'hulk': drawHulk(x, y, s, facing); break;
                case 'widow': drawWidow(x, y, s, facing); break;
                case 'hawkeye': drawHawkeye(x, y, s, facing); break;
                case 'strange': drawStrange(x, y, s, facing); break;
                default: drawIronMan(x, y, s, facing);
            }
        };

        const avengerColors = {
            ironman: '#bf4723', cap: '#1a7b86', thor: '#e2a449',
            hulk: '#76908e', widow: '#333c38', hawkeye: '#76908e', strange: '#bf4723'
        };

        const drawIronManSmall = drawIronMan;
        const drawThorFlying = drawThor;

        // ========================================
        //  UPDATE FUNCTIONS
        // ========================================
        const updateThor = () => {
            thor.bobPhase += 0.02;
            thor.x += thor.vx;
            thor.y += thor.vy + Math.sin(thor.bobPhase) * 0.5;
            const skyLim = canvas.height * 0.55;
            if (thor.x < 40) { thor.x = 40; thor.vx = Math.abs(thor.vx)*(0.8+Math.random()*0.4); }
            if (thor.x > canvas.width-40) { thor.x = canvas.width-40; thor.vx = -Math.abs(thor.vx)*(0.8+Math.random()*0.4); }
            if (thor.y < 50) { thor.y = 50; thor.vy = Math.abs(thor.vy)*(0.8+Math.random()*0.4); }
            if (thor.y > skyLim-50) { thor.y = skyLim-50; thor.vy = -Math.abs(thor.vy)*(0.8+Math.random()*0.4); }
            if (Math.random() < 0.008) { thor.vx += (Math.random()-0.5)*0.8; thor.vy += (Math.random()-0.5)*0.6; }
            const sp = Math.sqrt(thor.vx**2 + thor.vy**2);
            if (sp > 1.8) { thor.vx = (thor.vx/sp)*1.8; thor.vy = (thor.vy/sp)*1.8; }
        };

        const updateDoom = () => {
            doom.hitFlash = Math.max(0, doom.hitFlash-1);
            // Doom is now stationary as requested. Only subtle breathing/floating if any.
            doom.y = canvas.height * 0.55 + canvas.height*0.08; 
            doom.x = canvas.width * 0.82;
        };

        const updateAvengers = () => {
            avengers.forEach(av => {
                av.bobPhase += 0.025;
                av.x += av.vx;
                if (av.x < 30) { av.x = 30; av.vx *= -1; }
                if (av.x > canvas.width*0.5) { av.x = canvas.width*0.5; av.vx *= -1; }
                av.y = av.baseY + Math.sin(av.bobPhase)*2;
                if (Math.random() < 0.004) av.vx = (Math.random()-0.3)*0.6;
                av.facing = doom.x > av.x ? 1 : -1;
                av.shootCooldown--;
                if (av.shootCooldown <= 0) {
                    const angle = Math.atan2(doom.y-av.y, doom.x-av.x);
                    const speed = 2.5+Math.random();
                    projectiles.push({ x:av.x+(av.facing*15), y:av.y-5,
                        vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
                        life:90, color:avengerColors[av.type]||'#76908e', size:3+Math.random()*2 });
                    av.shootCooldown = av.shootInterval;
                    if (Math.random() > 0.8) {
                        const quotes = ['DHAIRYA ASSEMBLE!','HULK SMASH!','FOR ASGARD!','I CAN DO THIS ALL DAY!','REPULSOR BLAST!','BY THE VISHANTI!','ARROW AWAY!'];
                        speechBubbles.push({x:av.x, y:av.y-55, text:quotes[Math.floor(Math.random()*quotes.length)], life:90, av});
                    }
                }
            });
        };

        const updateProjectiles = () => {
            for (let i = projectiles.length-1; i >= 0; i--) {
                const p = projectiles[i];
                p.x += p.vx; p.y += p.vy; p.life--;
                if (p.life <= 0) { projectiles.splice(i,1); continue; }
                const d = Math.sqrt((doom.x-p.x)**2+(doom.y-p.y)**2);
                if (d < 45) {
                    // Explosion
                    for (let j = 0; j < 8; j++) {
                        const a = (Math.PI*2*j)/8+(Math.random()-0.5)*0.5;
                        explosions.push({x:p.x,y:p.y,vx:Math.cos(a)*(1+Math.random()*2),vy:Math.sin(a)*(1+Math.random()*2),
                            life:20+Math.random()*15, maxLife:35, size:2+Math.random()*4, color:p.color});
                    }
                    doom.hitFlash = 8;
                    projectiles.splice(i,1);
                }
            }
        };

        const updateExplosions = () => {
            for (let i = explosions.length-1; i >= 0; i--) {
                const e = explosions[i];
                e.x += e.vx; e.y += e.vy; e.vx *= 0.94; e.vy *= 0.94; e.life--;
                if (e.life <= 0) explosions.splice(i,1);
            }
        };

        const updateBubbles = () => {
            for (let i = speechBubbles.length-1; i >= 0; i--) {
                const sb = speechBubbles[i];
                sb.life--;
                if (sb.av) { sb.x = sb.av.x; sb.y = sb.av.y - 55; }
                if (sb.life <= 0) speechBubbles.splice(i,1);
            }
        };

        // ========================================
        //  DRAW HELPERS
        // ========================================
        const drawProjectilesAll = () => {
            projectiles.forEach(p => {
                ctx.save();
                ctx.shadowColor = p.color; ctx.shadowBlur = 8;
                ctx.fillStyle = p.color;
                const angle = Math.atan2(p.vy, p.vx);
                ctx.translate(Math.round(p.x), Math.round(p.y));
                ctx.rotate(angle);
                ctx.fillRect(-p.size*1.5, -1.5, p.size*3, 3);
                ctx.fillStyle = '#cbcec4';
                ctx.fillRect(-1, -0.7, 2, 1.4);
                ctx.restore(); ctx.shadowBlur = 0;
            });
        };

        const drawExplosionsAll = () => {
            explosions.forEach(e => {
                ctx.globalAlpha = e.life / e.maxLife;
                ctx.fillStyle = e.color;
                ctx.fillRect(Math.round(e.x)-e.size/2, Math.round(e.y)-e.size/2, e.size, e.size);
                ctx.globalAlpha = 1;
            });
        };

        const drawBubblesAll = () => {
            speechBubbles.forEach(sb => {
                ctx.save();
                ctx.globalAlpha = Math.min(1, sb.life/20);
                ctx.font = 'bold 9px "Press Start 2P", monospace';
                const tw = ctx.measureText(sb.text).width;
                const bw = tw+16, bh = 20;
                const bx = sb.x-bw/2, by = sb.y-bh;
                ctx.fillStyle = '#cbcec4';
                ctx.fillRect(bx, by, bw, bh);
                ctx.strokeStyle = '#333c38'; ctx.lineWidth = 2;
                ctx.strokeRect(bx, by, bw, bh);
                ctx.fillStyle = '#cbcec4';
                ctx.fillRect(sb.x-3, by+bh, 6, 4);
                ctx.fillStyle = '#bf4723';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(sb.text, sb.x, by+bh/2+1);
                ctx.globalAlpha = 1; ctx.restore();
            });
        };

        const drawDoomHpBar = () => {
            const barW = 180, barH = 14;
            const barX = canvas.width-barW-30, barY = 25;
            const hpPct = doomHpRef.current;
            ctx.fillStyle = 'rgba(51, 60, 56, 0.85)';
            ctx.fillRect(barX-6, barY-6, barW+12, barH+22);
            ctx.strokeStyle = '#76908e'; ctx.lineWidth = 2;
            ctx.strokeRect(barX-6, barY-6, barW+12, barH+22);
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.fillStyle = '#cbcec4'; ctx.textAlign = 'center';
            ctx.fillText('DR. DOOM', barX+barW/2, barY+3);
            const trackY = barY+12;
            ctx.fillStyle = '#333c38';
            ctx.fillRect(barX, trackY, barW, barH);
            const fillW = (hpPct/100)*barW;
            const c = hpPct > 60 ? '#76908e' : hpPct > 30 ? '#e2a449' : '#bf4723';
            ctx.fillStyle = c;
            ctx.fillRect(barX, trackY, fillW, barH);
            ctx.strokeStyle = '#76908e';
            ctx.strokeRect(barX, trackY, barW, barH);
        };

        // ========================================
        //  SCENE RENDERERS
        // ========================================
        const renderSplash = () => {
            drawSky(false);
            drawSun();
            drawClouds(false);
            drawBuildings(false);
            const towerInfo = drawAvengersT(false);
            drawIronMan(towerInfo.padX, towerInfo.padY - 2, 3, 1);
            updateThor();
            drawThor(Math.round(thor.x), Math.round(thor.y), thor.size, thor.vx >= 0 ? 1 : -1);
        };

        const renderWelcome = () => {
            // Darker sky — Doom has arrived
            drawSky(true);
            drawClouds(true);
            drawBuildings(true); // destroyed buildings
            drawAvengersT(true); // damaged tower

            // Doom stationary menacingly
            const doomX = canvas.width * 0.4;
            const doomY = canvas.height * 0.35;
            drawDoomChar(Math.round(doomX), Math.round(doomY), 6, 100);

            // Energy blasts from Doom to buildings
            if (Math.random() > 0.85) {
                ctx.strokeStyle = 'rgba(191, 71, 35, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(doomX - 30, doomY + 10);
                const targetX = canvas.width * (0.17 + Math.random() * 0.4);
                ctx.lineTo(targetX, canvas.height * 0.65);
                ctx.stroke();
            }

            // Fire at destroyed building bases
            for (let i = 0; i < 3; i++) {
                if (Math.random() > 0.7) {
                    ctx.fillStyle = 'rgba(191, 71, 35, 0.3)';
                    const fx = canvas.width * (0.15 + Math.random() * 0.4);
                    const fy = canvas.height * 0.63 - Math.random() * 10;
                    px(fx, fy, 4 + Math.random() * 6, 3 + Math.random() * 4);
                }
            }
        };

        const renderLevels = () => {
            drawSky(true);
            drawClouds(true);
            drawBuildings(true);
            drawAvengersT(true);
            updateDoom();
            updateAvengers();
            updateProjectiles();
            updateExplosions();
            updateBubbles();
            if (!(doom.hitFlash > 0 && doom.hitFlash % 2 === 0)) {
                drawDoomChar(Math.round(doom.x), Math.round(doom.y), doom.size, doomHpRef.current);
            }
            avengers.forEach(av => drawAvengerDetailed(Math.round(av.x), Math.round(av.y), av.size, av.type, av.facing));
            drawProjectilesAll();
            drawExplosionsAll();
            drawBubblesAll();
        };

        const renderBoss = () => {
            drawSky(true);
            drawBuildings(true);
            drawAvengersT(true);
        };

        const renderCredits = () => {
            drawSky(false);
            drawSun();
            drawClouds(false);
            drawBuildings(false);
            drawAvengersT(false);
        };

        // ========================================
        //  MAIN LOOP
        // ========================================
        const animate = () => {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gs = gameStateRef.current;

            if (gs === 'splash') {
                renderSplash();
            } else if (gs === 'welcome') {
                renderWelcome();
            } else if (gs === 'boss') {
                renderBoss();
            } else if (gs === 'credits') {
                renderCredits();
            } else {
                // level1..level5
                renderLevels();
            }

            animationId = requestAnimationFrame(animate);
        };

        resize();
        createAvengers();
        animationId = requestAnimationFrame(animate);

        const handleResize = () => { resize(); createAvengers(); };
        window.addEventListener('resize', handleResize);
        return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize); };
    }, []);

    return <canvas ref={canvasRef} className="star-field-canvas" />;
};

export default StarField;
