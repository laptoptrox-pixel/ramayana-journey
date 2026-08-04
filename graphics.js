// Ramayana Interactive Graphics & Canvas Animations
window.RamayanaGraphics = (function() {
  let activeAnimationId = null;
  let canvas = null;
  let ctx = null;
  let isDrawing = false;

  // Cleanup helper
  function stopActive() {
    isDrawing = false;
    if (activeAnimationId) {
      cancelAnimationFrame(activeAnimationId);
      activeAnimationId = null;
    }
    if (canvas) {
      // Remove all event listeners by cloning the node
      const newCanvas = canvas.cloneNode(true);
      if (canvas.parentNode) {
        canvas.parentNode.replaceChild(newCanvas, canvas);
      }
      canvas = null;
      ctx = null;
    }
  }

  // --- 1. SHIVA DHANUSH BOW ANIMATION ---
  function initBow(canvasId) {
    stopActive();
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    isDrawing = true;

    // Resize canvas based on client rect
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 400;

    const width = canvas.width;
    const height = canvas.height;
    
    // Bow properties
    const bowX = width / 2;
    const bowTopY = 50;
    const bowBottomY = height - 50;
    const centerBowY = height / 2;
    
    let isPulling = false;
    let pullX = bowX; // How far back string is pulled
    let maxPull = 120;
    let pullTension = 0;
    let isBroken = false;
    let particles = [];
    let screenShake = 0;

    // Listeners
    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const mEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mEvent);
    });
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const mEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mEvent);
    });
    canvas.addEventListener('touchend', () => {
      const mEvent = new MouseEvent('mouseup', {});
      canvas.dispatchEvent(mEvent);
    });

    function getMousePos(e) {
      const cRect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - cRect.left,
        y: e.clientY - cRect.top
      };
    }

    function onStart(e) {
      if (isBroken) return;
      const pos = getMousePos(e);
      // Can click near the center of the string to pull
      if (Math.abs(pos.x - bowX) < 40 && Math.abs(pos.y - centerBowY) < 100) {
        isPulling = true;
      }
    }

    function onMove(e) {
      if (!isPulling || isBroken) return;
      const pos = getMousePos(e);
      // We pull string to the left (drawing it back)
      if (pos.x < bowX) {
        pullX = Math.max(bowX - maxPull, pos.x);
      } else {
        pullX = bowX; // Cannot push string forward
      }
      pullTension = (bowX - pullX) / maxPull;
    }

    function onEnd() {
      if (!isPulling || isBroken) return;
      isPulling = false;
      
      // If tension is high enough (> 85%), it breaks!
      if (pullTension >= 0.85) {
        breakBow();
      } else {
        // Snap back animation
        snapBack();
      }
    }

    function snapBack() {
      if (pullX < bowX) {
        pullX += (bowX - pullX) * 0.4;
        if (bowX - pullX < 1) {
          pullX = bowX;
          pullTension = 0;
        } else {
          requestAnimationFrame(snapBack);
        }
      }
    }

    function breakBow() {
      isBroken = true;
      pullTension = 0;
      screenShake = 15;
      
      // Synthesize cracking sound
      try {
        if (window.RamayanaSynth) {
          window.RamayanaSynth.init();
          // Simulate low crack frequency burst
          // Custom pluck with low pitch factor
          window.RamayanaSynth.startTanpura();
          setTimeout(window.RamayanaSynth.stopTanpura, 500);
        }
      } catch(err) {}

      // Create splinters/spark particles
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: bowX,
          y: centerBowY + (Math.random() * 80 - 40),
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 2,
          radius: Math.random() * 4 + 1,
          color: Math.random() > 0.3 ? "#FFD700" : "#FF9933",
          life: 1.0,
          decay: Math.random() * 0.03 + 0.015
        });
      }
    }

    function animate() {
      if (!isDrawing) return;
      
      ctx.clearRect(0, 0, width, height);

      // Handle Screen Shake
      if (screenShake > 0.1) {
        ctx.save();
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
        screenShake *= 0.9; // decay shake
      }

      // Draw background decorations (simple glowing mandala)
      ctx.strokeStyle = "rgba(255, 215, 0, 0.05)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 120, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Instructions
      ctx.fillStyle = "rgba(244, 239, 235, 0.7)";
      ctx.font = "italic 14px 'Montserrat', sans-serif";
      ctx.textAlign = "center";
      const kandaId = window.RamayanaActiveKandaId || "bala";
      if (!isBroken) {
        if (kandaId === "bala") {
          ctx.fillText("Prince Rama's Childhood: Drag the bowstring to break Shiva's Dhanush in Mithila!", width / 2, 35);
        } else if (kandaId === "ayodhya") {
          ctx.fillText("Click and drag the bowstring left to reflect on Rama's exile vow of duty!", width / 2, 35);
        } else if (kandaId === "uttara") {
          ctx.fillText("Click and drag the bowstring left to seal the coronation vow of justice!", width / 2, 35);
        } else {
          ctx.fillText("Click and drag the bowstring left to bend and break the Shiva Dhanush", width / 2, 35);
        }
      } else {
        ctx.fillStyle = "#FFD700";
        if (kandaId === "bala") {
          ctx.fillText("Sacred Bow Broken! Sri Rama marries Sita Devi in his youth.", width / 2, 35);
        } else if (kandaId === "ayodhya") {
          ctx.fillText("Vow Honored! Sri Rama accepts forest exile with total peace of mind.", width / 2, 35);
        } else if (kandaId === "uttara") {
          ctx.fillText("Ayodhya Crowned! A new era of Ramrajya begins.", width / 2, 35);
        } else {
          ctx.fillText("The Sacred Bow is Broken! Sri Rama marries Sita Devi.", width / 2, 35);
        }
        ctx.font = "12px 'Montserrat'";
        ctx.fillStyle = "rgba(244, 239, 235, 0.5)";
        ctx.fillText("Click Reset to try again", width / 2, height - 20);
      }

      // Draw Bow Tension Bar
      if (!isBroken) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(width/2 - 100, height - 30, 200, 10);
        ctx.fillStyle = `hsl(${120 - pullTension * 120}, 80%, 50%)`;
        ctx.fillRect(width/2 - 100, height - 30, 200 * pullTension, 10);
        ctx.fillStyle = "#F4EFEB";
        ctx.font = "10px 'Montserrat'";
        ctx.fillText("TENSION", width/2, height - 35);
      }

      // Draw Bow Stave (Wooden curved part)
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.strokeStyle = isBroken ? "rgba(180, 140, 70, 0.4)" : "#d4af37";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#FF9933";

      if (!isBroken) {
        // Draw the curved bow stave that bends based on tension
        ctx.beginPath();
        ctx.moveTo(bowX, bowTopY);
        // Curve control point pulls back slightly with tension
        const ctrlX = bowX + 70 + (pullTension * 40);
        ctx.quadraticCurveTo(ctrlX, centerBowY, bowX, bowBottomY);
        ctx.stroke();
        
        // Golden metallic decorations on bow
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FFF";
        ctx.stroke();
      } else {
        // Broken Bow - Draw top half
        ctx.save();
        ctx.translate(bowX, bowTopY);
        ctx.rotate(-Math.PI / 8);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(60, centerBowY/2, 10, centerBowY - 30);
        ctx.stroke();
        ctx.restore();

        // Broken Bow - Draw bottom half
        ctx.save();
        ctx.translate(bowX, bowBottomY);
        ctx.rotate(Math.PI / 8);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(60, -centerBowY/2, 10, -centerBowY + 30);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Bowstring
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.shadowBlur = 0;
      if (!isBroken) {
        ctx.beginPath();
        ctx.moveTo(bowX, bowTopY);
        ctx.lineTo(pullX, centerBowY); // strings meets pulled point
        ctx.lineTo(bowX, bowBottomY);
        ctx.stroke();

        // Draw small arrow resting on the string
        ctx.fillStyle = "#FFD700";
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pullX - 5, centerBowY);
        ctx.lineTo(pullX + 60, centerBowY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(pullX + 60, centerBowY - 6);
        ctx.lineTo(pullX + 70, centerBowY);
        ctx.lineTo(pullX + 60, centerBowY + 6);
        ctx.fill();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.life -= p.decay;
        
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        if (p.life <= 0) {
          particles.splice(idx, 1);
        }
      });

      if (screenShake > 0.1) {
        ctx.restore();
      }

      activeAnimationId = requestAnimationFrame(animate);
    }

    animate();
    
    // Return a reset hook
    return function() {
      isBroken = false;
      pullX = bowX;
      pullTension = 0;
      particles = [];
      screenShake = 0;
    };
  }

  // --- 2. RAM SETU BRIDGE BUILDING ANIMATION ---
  function initBridge(canvasId) {
    stopActive();
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    isDrawing = true;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 400;

    const width = canvas.width;
    const height = canvas.height;
    
    const waterY = height - 120;
    let stones = [];
    let count = 0;
    let waterSplashes = [];

    canvas.addEventListener('click', dropStone);
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const cRect = canvas.getBoundingClientRect();
      const clickEvent = new MouseEvent('click', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(clickEvent);
    });

    function dropStone(e) {
      const cRect = canvas.getBoundingClientRect();
      const clickX = e.clientX - cRect.left;
      
      // Calculate stone landing spot in water
      // If we already have stones, place it in a line from left to right,
      // or at the clicked X coordinate
      const targetX = clickX;
      
      // Placed stone object
      const stone = {
        x: targetX,
        y: -40, // starts above screen
        targetY: waterY + (Math.random() * 15 - 7),
        size: 35 + Math.random() * 15,
        rotation: (Math.random() - 0.5) * 0.4,
        vy: 2,
        gravity: 0.25,
        isPlaced: false,
        text: "श्री राम"
      };
      
      stones.push(stone);
      count++;
    }

    function createSplash(x, y) {
      for (let i = 0; i < 15; i++) {
        waterSplashes.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 5 - 2,
          radius: Math.random() * 3 + 1,
          color: "rgba(100, 200, 255, 0.7)",
          life: 1.0,
          decay: Math.random() * 0.05 + 0.03
        });
      }
    }

    function animate() {
      if (!isDrawing) return;

      // Draw Sky & Water Background Gradients
      const skyGrad = ctx.createLinearGradient(0, 0, 0, waterY);
      skyGrad.addColorStop(0, '#0a1128');
      skyGrad.addColorStop(1, '#1c2d5a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, waterY);

      const waterGrad = ctx.createLinearGradient(0, waterY, 0, height);
      waterGrad.addColorStop(0, '#005b8a');
      waterGrad.addColorStop(1, '#002d54');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterY, width, height - waterY);

      // Draw Stars in Sky
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for(let i=0; i<15; i++) {
        const sx = (Math.sin(i * 300) + 1) * width / 2;
        const sy = (Math.cos(i * 50) + 1) * (waterY - 30) / 2;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Draw shoreline silhouettes
      ctx.fillStyle = "#050b1a";
      ctx.beginPath();
      ctx.moveTo(0, waterY);
      ctx.quadraticCurveTo(60, waterY - 20, 100, waterY + 40);
      ctx.lineTo(0, height);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width, waterY);
      ctx.quadraticCurveTo(width - 60, waterY - 10, width - 80, waterY + 50);
      ctx.lineTo(width, height);
      ctx.fill();

      // Text Instructions
      const kandaId = window.RamayanaActiveKandaId || "yuddha";
      ctx.fillStyle = "#FFD700";
      ctx.font = "14px 'Montserrat'";
      ctx.textAlign = "center";
      if (kandaId === "kishkindha") {
        ctx.fillText("Click on the water to place alliance marker stones and coordinate the search paths!", width/2, 35);
      } else {
        ctx.fillText("Click on the sea water to drop floating stones inscribed with Rama's name", width/2, 35);
      }
      ctx.fillStyle = "rgba(244, 239, 235, 0.6)";
      ctx.font = "12px 'Montserrat'";
      ctx.fillText(`Stones Placed: ${count} / 10`, width/2, 60);

      // Draw Stones
      stones.forEach((stone) => {
        if (!stone.isPlaced) {
          stone.vy += stone.gravity;
          stone.y += stone.vy;
          
          if (stone.y >= stone.targetY) {
            stone.y = stone.targetY;
            stone.isPlaced = true;
            createSplash(stone.x, stone.y);
            // Gentle splash audio click
            try {
              if (window.RamayanaSynth) {
                window.RamayanaSynth.init();
              }
            } catch(e){}
          }
        } else {
          // Bobbing effect in water
          stone.y = stone.targetY + Math.sin(Date.now() * 0.003 + stone.x) * 2;
        }

        // Draw Stone
        ctx.save();
        ctx.translate(stone.x, stone.y);
        ctx.rotate(stone.rotation);
        
        // Stone Shape
        ctx.fillStyle = "#4a5568";
        ctx.strokeStyle = "#cbd5e0";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Hexagonal rough rock
        const r = stone.size / 2;
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.9, -r * 0.4);
        ctx.lineTo(r * 0.8, r * 0.6);
        ctx.lineTo(0, r * 0.95);
        ctx.lineTo(-r * 0.85, r * 0.55);
        ctx.lineTo(-r * 0.9, -r * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing text: "श्री राम"
        ctx.fillStyle = "#FFD700";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FF9933";
        ctx.font = `bold ${stone.size * 0.28}px 'Cinzel', serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(stone.text, 0, 0);

        ctx.restore();
      });

      // Update Splashes
      waterSplashes.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // heavy gravity
        p.life -= p.decay;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fill();

        if (p.life <= 0) {
          waterSplashes.splice(idx, 1);
        }
      });

      // Complete bridge connection visual
      if (count >= 10) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 215, 0, 0.25)";
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 10]);
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#FFD700";
        ctx.beginPath();
        ctx.moveTo(80, waterY + 10);
        ctx.lineTo(width - 80, waterY + 10);
        ctx.stroke();
        ctx.restore();
        
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 13px 'Montserrat'";
        if (kandaId === "kishkindha") {
          ctx.fillText("✨ MONKEY ARMY ALLIED! PATH TO FIND SITA IS OPENED! ✨", width/2, height - 30);
        } else {
          ctx.fillText("✨ THE BRIDGE TO LANKA IS SECURED! ✨", width/2, height - 30);
        }
      }

      activeAnimationId = requestAnimationFrame(animate);
    }

    animate();

    return function() {
      stones = [];
      count = 0;
      waterSplashes = [];
    };
  }

  // --- 3. BRAHMASTRA GLOWING ARROW OF LIGHT ---
  function initArrow(canvasId) {
    stopActive();
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    isDrawing = true;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 400;

    const width = canvas.width;
    const height = canvas.height;

    let isAiming = false;
    let dragStart = { x: 0, y: 0 };
    let dragCurrent = { x: 0, y: 0 };
    let arrowState = "idle"; // idle, shooting, hit, explode
    let arrowPos = { x: 100, y: height - 100 };
    let arrowVelocity = { vx: 0, vy: 0 };
    let particles = [];
    let explosions = [];
    
    const targetPos = { x: width - 120, y: 120 };
    const targetRadius = 55;

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const mEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mEvent);
    });
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const mEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mEvent);
    });
    canvas.addEventListener('touchend', () => {
      const mEvent = new MouseEvent('mouseup', {});
      canvas.dispatchEvent(mEvent);
    });

    function getMousePos(e) {
      const cRect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - cRect.left,
        y: e.clientY - cRect.top
      };
    }

    function onStart(e) {
      if (arrowState !== "idle") return;
      const pos = getMousePos(e);
      // Can click near arrow tail to pull
      if (Math.abs(pos.x - arrowPos.x) < 40 && Math.abs(pos.y - arrowPos.y) < 40) {
        isAiming = true;
        dragStart = pos;
        dragCurrent = pos;
      }
    }

    function onMove(e) {
      if (!isAiming) return;
      dragCurrent = getMousePos(e);
    }

    function onEnd() {
      if (!isAiming) return;
      isAiming = false;
      
      // Calculate velocity vector based on drag vector
      const dx = dragStart.x - dragCurrent.x;
      const dy = dragStart.y - dragCurrent.y;
      const strength = 0.15; // tuning
      
      arrowVelocity.vx = dx * strength;
      arrowVelocity.vy = dy * strength;
      
      // Require minimal launch pull
      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        arrowState = "shooting";
      }
    }

    function triggerExplosion(x, y) {
      // Create spectacular firework particle explosion
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        explosions.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 5 + 1.5,
          color: Math.random() > 0.4 ? "#FFD700" : (Math.random() > 0.5 ? "#FF4500" : "#FF9933"),
          life: 1.0,
          decay: Math.random() * 0.02 + 0.01
        });
      }
      
      // Synthesize explosion sound
      try {
        if (window.RamayanaSynth) {
          window.RamayanaSynth.init();
        }
      } catch(e) {}
    }

    function animate() {
      if (!isDrawing) return;

      // Dark celestial battlefield background
      const sky = ctx.createLinearGradient(0, 0, width, height);
      sky.addColorStop(0, "#08071a");
      sky.addColorStop(1, "#180c10");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Draw starry galaxy rings
      ctx.strokeStyle = "rgba(255, 140, 0, 0.03)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 200, 0, Math.PI*2);
      ctx.stroke();

      // Draw instructions
      const kandaId = window.RamayanaActiveKandaId || "yuddha";
      ctx.fillStyle = "#FF9933";
      ctx.font = "14px 'Montserrat'";
      ctx.textAlign = "center";
      if (arrowState === "idle") {
        if (kandaId === "aranya") {
          ctx.fillText("Pull the arrow back, aim at Maricha (the Golden Deer), and release to shoot!", width/2, 35);
        } else if (kandaId === "kishkindha") {
          ctx.fillText("Aim through trees, shoot Vali's tyranny, and help Sugriva and Hanuman!", width/2, 35);
        } else if (kandaId === "sundara") {
          ctx.fillText("Aim and launch the arrow to light up Hanuman's sparklers over Lanka's fortifications!", width/2, 35);
        } else {
          ctx.fillText("Pull the arrow tail back, aim at Ravana's dark shield, and release to shoot!", width/2, 35);
        }
      } else if (arrowState === "shooting") {
        ctx.fillText("The arrow flies with divine speed...", width/2, 35);
      } else {
        ctx.fillStyle = "#FFD700";
        if (kandaId === "aranya") {
          ctx.fillText("Illusion Shattered! You aimed through the Golden Deer disguise.", width/2, 35);
        } else if (kandaId === "kishkindha") {
          ctx.fillText("Vali Slayed! Throne restored to Sugriva; Vanara search army is mobilized.", width/2, 35);
        } else if (kandaId === "sundara") {
          ctx.fillText("Lanka Illuminated! Ashoka Vatika is found, bringing hope to Sita.", width/2, 35);
        } else {
          ctx.fillText("Dharma Restored! Ravana Slayed.", width/2, 35);
        }
      }

      // Draw Target (Ravana's Shield or Golden Deer or Lanka Tower or Vali's Shield)
      ctx.save();
      ctx.shadowBlur = 20;
      
      if (kandaId === "aranya") {
        ctx.shadowColor = "#FFD700";
        ctx.fillStyle = "rgba(212, 175, 55, 0.85)"; // gold
        ctx.strokeStyle = "#805c00";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius - 20, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = "#FFF";
        ctx.font = "12px 'Cinzel'";
        ctx.fillText("GOLDEN DEER", targetPos.x, targetPos.y + 4);
      } else if (kandaId === "kishkindha") {
        ctx.shadowColor = "#cc0000";
        ctx.fillStyle = "rgba(60, 20, 20, 0.85)"; // dark red
        ctx.strokeStyle = "#800000";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 100, 100, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius - 20, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = "#FFF";
        ctx.font = "12px 'Cinzel'";
        ctx.fillText("VALI'S TYRANNY", targetPos.x, targetPos.y + 4);
      } else if (kandaId === "sundara") {
        ctx.shadowColor = "#ff5500";
        ctx.fillStyle = "rgba(100, 30, 0, 0.85)"; // dark orange
        ctx.strokeStyle = "#4a1200";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 200, 0, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius - 20, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = "#FFF";
        ctx.font = "12px 'Cinzel'";
        ctx.fillText("LANKA FORTS", targetPos.x, targetPos.y + 4);
      } else {
        ctx.shadowColor = "#FF0000";
        ctx.fillStyle = "rgba(40, 10, 10, 0.85)";
        ctx.strokeStyle = "#800000";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetPos.x, targetPos.y, targetRadius - 20, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = "#FFF";
        ctx.font = "12px 'Cinzel'";
        ctx.fillText("EGO SHIELD", targetPos.x, targetPos.y + 4);
      }
      ctx.restore();

      // Aiming elastic line
      if (isAiming) {
        ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Show launch projection line
        const dx = dragStart.x - dragCurrent.x;
        const dy = dragStart.y - dragCurrent.y;
        ctx.strokeStyle = "rgba(255, 150, 0, 0.25)";
        ctx.beginPath();
        ctx.moveTo(arrowPos.x, arrowPos.y);
        ctx.lineTo(arrowPos.x + dx * 3, arrowPos.y + dy * 3);
        ctx.stroke();
      }

      // Update Arrow physics
      if (arrowState === "shooting") {
        // Track trail particles
        particles.push({
          x: arrowPos.x,
          y: arrowPos.y,
          color: "rgba(255, 215, 0, 0.8)",
          size: Math.random() * 3 + 1,
          life: 1.0,
          decay: 0.04
        });

        arrowPos.x += arrowVelocity.vx;
        arrowPos.y += arrowVelocity.vy;
        
        // Gravity slightly curves flight
        arrowVelocity.vy += 0.05;

        // Angle of flight based on velocity
        const angle = Math.atan2(arrowVelocity.vy, arrowVelocity.vx);

        // Check boundary limits
        if (arrowPos.x > width || arrowPos.x < 0 || arrowPos.y > height || arrowPos.y < 0) {
          // Reset
          arrowPos = { x: 100, y: height - 100 };
          arrowState = "idle";
        }

        // Check collision with target shield
        const distance = Math.hypot(arrowPos.x - targetPos.x, arrowPos.y - targetPos.y);
        if (distance <= targetRadius) {
          arrowState = "hit";
          triggerExplosion(arrowPos.x, arrowPos.y);
        }
      }

      // Draw Arrow
      if (arrowState === "idle" || arrowState === "shooting") {
        ctx.save();
        ctx.translate(arrowPos.x, arrowPos.y);
        
        let rotation = 0;
        if (isAiming) {
          rotation = Math.atan2(dragStart.y - dragCurrent.y, dragStart.x - dragCurrent.x);
        } else if (arrowState === "shooting") {
          rotation = Math.atan2(arrowVelocity.vy, arrowVelocity.vx);
        } else {
          rotation = -Math.PI / 6; // resting pointing up-right
        }
        ctx.rotate(rotation);

        // Glowing effects
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#FFD700";
        ctx.strokeStyle = "#FFD700";
        ctx.fillStyle = "#FF8C00";
        ctx.lineWidth = 4;

        // Arrow Shaft
        ctx.beginPath();
        ctx.moveTo(-50, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();

        // Arrow Head
        ctx.beginPath();
        ctx.moveTo(30, -8);
        ctx.lineTo(48, 0);
        ctx.lineTo(30, 8);
        ctx.closePath();
        ctx.fill();

        // Arrow Fletching (feathers)
        ctx.fillStyle = "#FF9933";
        ctx.beginPath();
        ctx.moveTo(-50, 0);
        ctx.lineTo(-65, -8);
        ctx.lineTo(-58, 0);
        ctx.lineTo(-65, 8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Draw trail particles
      particles.forEach((p, idx) => {
        p.life -= p.decay;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        if (p.life <= 0) particles.splice(idx, 1);
      });

      // Draw explosions particles
      explosions.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        if (p.life <= 0) explosions.splice(idx, 1);
      });

      if (arrowState === "hit" && explosions.length === 0) {
        // finished explosion, reset
        arrowPos = { x: 100, y: height - 100 };
        arrowState = "idle";
      }

      activeAnimationId = requestAnimationFrame(animate);
    }

    animate();

    return function() {
      isAiming = false;
      arrowState = "idle";
      arrowPos = { x: 100, y: height - 100 };
      particles = [];
      explosions = [];
    };
  }

  return {
    initBow: initBow,
    initBridge: initBridge,
    initArrow: initArrow,
    stopActive: stopActive
  };
})();
