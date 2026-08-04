// Ramayana Kids Corner - Stories & Interactive Mini-Game Arcade
(function() {
  function initKids() {

    // --- KIDS STORIES DATA ---
    const kidsStories = [
      {
        title: "Baby Rama and the Mirror Moon",
        text: "When Sri Rama was a little baby prince in Ayodhya, he saw the beautiful glowing moon in the night sky and cried: 'I want to play with the moon!' The King Dasaratha tried everything, but the moon was too far away. Then, a wise minister placed a shiny mirror in front of Rama. Baby Rama looked into the mirror, saw the moon's reflection, and laughed happily, holding the moon in his hands!",
        cartoon: "🌙",
        virtue: "Finding happiness in simple, creative ways!"
      },
      {
        title: "The Big Golden Bow Contest",
        text: "In the kingdom of Mithila, there was a heavy golden bow belonging to Lord Shiva. Strong kings from all over the world tried to lift it, but they couldn't move it even an inch! Prince Rama stepped forward with a smile. He lifted the heavy bow with just one hand, and as he pulled the string to aim, SNAP! The bow broke into two pieces! Everyone cheered, and Rama married the brave princess Sita.",
        cartoon: "🏹",
        virtue: "Humility and inner strength can break the heaviest egos."
      },
      {
        title: "Meeting Hanuman the Super Monkey",
        text: "In the southern forests, Rama met Hanuman, a powerful monkey who could grow as big as a mountain or as small as a bug! When Hanuman first saw Rama, he bowed down with deep love and friendship. Hanuman promised to help Rama find Sita. He showed us that the greatest superpower of all is not flying or strength—it is having a helpful, loving heart!",
        cartoon: "🤝",
        virtue: "Devotion, love, and helping your friends."
      },
      {
        title: "The Magic Floating Bridge",
        text: "To cross the wide ocean to Lanka, the monkey army needed a bridge. They took heavy stones, wrote the name 'RAMA' on them, and threw them into the sea. Magically, the heavy stones floated like corks! Even a tiny squirrel rolled in the sand to help fill the cracks. Rama hugged the squirrel, showing that every small helper is important when we work together!",
        cartoon: "🐿️",
        virtue: "Teamwork and appreciating every small effort."
      },
      {
        title: "The Festival of Lights (Diwali)",
        text: "After defeating the demon king Ravana, Rama, Sita, and Lakshmana returned to Ayodhya. The people were so happy that they lit thousands of clay lamps (diyas) to welcome them home, turning the dark night into a glittering sea of lights! This victory of light over darkness is celebrated even today as Diwali, reminding us to always choose goodness and truth.",
        cartoon: "🪔",
        virtue: "Righteousness always triumphs over darkness."
      }
    ];

    let currentStoryIndex = 0;

    // --- INITIALIZE STORIES ---
    const titleEl = document.getElementById("kids-story-title");
    const textEl = document.getElementById("kids-story-text");
    const cartoonEl = document.getElementById("kids-story-cartoon");
    const counterEl = document.getElementById("kids-story-counter");
    
    const prevBtn = document.getElementById("kids-story-prev");
    const nextBtn = document.getElementById("kids-story-next");

    if (titleEl) {
      function renderStory() {
        const story = kidsStories[currentStoryIndex];
        titleEl.textContent = story.title;
        textEl.innerHTML = `${story.text}<br><br><strong style="color: #ffd700;">🌟 Lesson:</strong> ${story.virtue}`;
        cartoonEl.textContent = story.cartoon;
        counterEl.textContent = `${currentStoryIndex + 1} / ${kidsStories.length}`;
      }

      renderStory();

      prevBtn.addEventListener("click", function() {
        currentStoryIndex = (currentStoryIndex - 1 + kidsStories.length) % kidsStories.length;
        renderStory();
        playBeep(440, "sine", 0.08);
      });

      nextBtn.addEventListener("click", function() {
        currentStoryIndex = (currentStoryIndex + 1) % kidsStories.length;
        renderStory();
        playBeep(480, "sine", 0.08);
      });
    }

    // --- GAME AUDIO SYNTHESIZER ---
    let gameAudioCtx = null;
    function playBeep(freq, type, duration) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!gameAudioCtx) gameAudioCtx = new AudioContextClass();
        if (gameAudioCtx.state === 'suspended') gameAudioCtx.resume();
        
        const osc = gameAudioCtx.createOscillator();
        const gain = gameAudioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, gameAudioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, gameAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, gameAudioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(gameAudioCtx.destination);
        osc.start();
        osc.stop(gameAudioCtx.currentTime + duration);
      } catch (e) {}
    }

    // --- ARCADE STATE & MANAGERS ---
    const canvas = document.getElementById("kids-game-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const overlay = document.getElementById("kids-game-overlay");
    const startBtn = document.getElementById("start-game-btn");
    const overlayTitle = document.getElementById("game-overlay-title");
    const overlayDesc = document.getElementById("game-overlay-desc");
    const scoreText = document.getElementById("kids-game-score");
    const instructionText = document.getElementById("kids-game-instruction");

    let width = canvas.width = 400;
    let height = canvas.height = 260;

    let activeGameMode = "leap"; // leap, arrow, setu, match, catcher
    let gameState = "idle"; // idle, playing, gameover, win
    let score = 0;
    let particles = [];

    // Hanuman Sprite Image (Global)
    const hanumanImg = new Image();
    hanumanImg.src = "hanuman.jpg";

    // Game Descriptions
    const gameData = {
      leap: {
        title: "Hanuman's Epic Flight",
        desc: "Dodge storm clouds and collect 10 stars of values. Tap/Click to flap upward!",
        btn: "Fly Hanuman! 🐒",
        target: 10
      },
      arrow: {
        title: "Rama's Target Bow",
        desc: "Click and drag back from Rama's bow. Release to shoot arrows at demon targets! Hit 5 demons.",
        btn: "Draw Bow! 🏹",
        target: 5
      },
      setu: {
        title: "Build the Ram Setu",
        desc: "Stone blocks move at the top. Tap/Click to drop them. Stack 5 blocks safely to cross the sea!",
        btn: "Build Bridge! 🧱",
        target: 5
      },
      match: {
        title: "Virtue Card Match",
        desc: "Click cards to find matching pairs of Ramayana heroes. Match all 6 pairs!",
        btn: "Flip Cards! 🎴",
        target: 6
      },
      catcher: {
        title: "Sanjeevani Catcher",
        desc: "Move mouse or finger left/right to slide Hanuman. Catch 10 falling herbs. Avoid fireballs!",
        btn: "Catch Herbs! 🌿",
        target: 10
      }
    };

    // --- GAME MODULE DEFINITIONS ---

    // 1. Hanuman Leap Variables
    const hanuman = { x: 80, y: 130, vy: 0, radius: 16, gravity: 0.28, jumpForce: -4.8 };
    let obstacles = [];
    let stars = [];
    let obstacleTimer = 0;
    let starTimer = 0;
    let bgScrollX = 0;

    // 2. Rama's Bow Variables
    const bow = { x: 40, y: 130, radius: 25 };
    let arrowObj = { x: 40, y: 130, vx: 0, vy: 0, active: false, length: 30 };
    let arrowTargets = [];
    let isAiming = false;
    let dragStart = { x: 0, y: 0 };
    let dragCurrent = { x: 0, y: 0 };

    // 3. Stack Ram Setu Variables
    let bridgeBlocks = [];
    let activeBlock = { x: 50, y: 30, w: 60, h: 20, vx: 2 };
    let stackHeight = height - 30;

    // 4. Card Memory Match Variables
    let matchCards = [];
    let flippedCards = [];
    let blockFlipping = false;

    // 5. Catcher Variables
    const catcherPlayer = { x: 200, y: height - 42, radius: 18 };
    let fallingItems = [];
    let catcherTimer = 0;
    let playerLives = 3;

    // --- INPUT CONTROLLER ---
    canvas.addEventListener("mousedown", onCanvasClick);
    canvas.addEventListener("mousemove", onCanvasMove);
    canvas.addEventListener("mouseup", onCanvasRelease);
    
    canvas.addEventListener("touchstart", function(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const clickEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(clickEvent);
    });

    canvas.addEventListener("touchmove", function(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const mEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mEvent);
    });

    canvas.addEventListener("touchend", function(e) {
      const mEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mEvent);
    });

    startBtn.addEventListener("click", startSelectedGame);

    // Setup Game Selector Tab Events
    const selectorButtons = document.querySelectorAll(".arcade-selector button");
    selectorButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        selectorButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        
        const mode = this.getAttribute("data-game");
        switchGameMode(mode);
      });
    });

    function switchGameMode(mode) {
      activeGameMode = mode;
      gameState = "idle";
      score = 0;
      scoreText.textContent = "0";
      particles = [];

      // Update instructions
      instructionText.textContent = gameData[mode].desc;

      // Update overlay UI
      overlayTitle.textContent = gameData[mode].title;
      overlayDesc.textContent = gameData[mode].desc;
      startBtn.textContent = gameData[mode].btn;
      overlay.style.display = "flex";
      
      playBeep(330, "sine", 0.1);
    }

    function startSelectedGame() {
      gameState = "playing";
      score = 0;
      scoreText.textContent = "0";
      particles = [];
      overlay.style.display = "none";
      playBeep(523.25, "square", 0.3);

      if (activeGameMode === "leap") {
        hanuman.y = 130;
        hanuman.vy = 0;
        obstacles = [];
        stars = [];
        obstacleTimer = 0;
      } 
      else if (activeGameMode === "arrow") {
        arrowObj.active = false;
        arrowTargets = [
          { x: width - 80, y: 60, vy: 1.5, radius: 15, emoji: "👹" },
          { x: width - 50, y: 180, vy: -1.2, radius: 15, emoji: "👿" }
        ];
      }
      else if (activeGameMode === "setu") {
        bridgeBlocks = [];
        stackHeight = height - 30;
        spawnSetuBlock();
      }
      else if (activeGameMode === "match") {
        initMatchGameCards();
      }
      else if (activeGameMode === "catcher") {
        catcherPlayer.x = 200;
        fallingItems = [];
        catcherTimer = 0;
        playerLives = 3;
      }
    }

    function onCanvasClick(e) {
      if (gameState !== "playing") return;
      const pos = getMousePos(e);

      if (activeGameMode === "leap") {
        hanuman.vy = hanuman.jumpForce;
        playBeep(392.00, "triangle", 0.12);
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: hanuman.x - 5, y: hanuman.y + 5,
            vx: -Math.random() * 2 - 1, vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 1, color: "rgba(255, 215, 0, 0.4)", life: 1.0, decay: 0.05
          });
        }
      }
      else if (activeGameMode === "arrow") {
        if (Math.abs(pos.x - bow.x) < 40 && Math.abs(pos.y - bow.y) < 40) {
          isAiming = true;
          dragStart = pos;
          dragCurrent = pos;
        }
      }
      else if (activeGameMode === "setu") {
        // Drop block
        if (activeBlock.vy === 0) {
          activeBlock.vy = 4.5; // start falling down
          playBeep(260, "sawtooth", 0.08);
        }
      }
      else if (activeGameMode === "match") {
        if (blockFlipping) return;
        
        matchCards.forEach(card => {
          if (!card.isFlipped && !card.isMatched &&
              pos.x > card.x && pos.x < card.x + card.w &&
              pos.y > card.y && pos.y < card.y + card.h) {
            
            card.isFlipped = true;
            flippedCards.push(card);
            playBeep(440, "sine", 0.1);

            if (flippedCards.length === 2) {
              checkCardMatch();
            }
          }
        });
      }
    }

    function onCanvasMove(e) {
      if (gameState !== "playing") return;
      const pos = getMousePos(e);

      if (activeGameMode === "arrow" && isAiming) {
        dragCurrent = pos;
      }
      else if (activeGameMode === "catcher") {
        catcherPlayer.x = Math.max(20, Math.min(width - 20, pos.x));
      }
    }

    function onCanvasRelease() {
      if (activeGameMode === "arrow" && isAiming) {
        isAiming = false;
        
        const dx = dragStart.x - dragCurrent.x;
        const dy = dragStart.y - dragCurrent.y;
        
        if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
          arrowObj.x = bow.x;
          arrowObj.y = bow.y;
          arrowObj.vx = dx * 0.12;
          arrowObj.vy = dy * 0.12;
          arrowObj.active = true;
          playBeep(587.33, "triangle", 0.15); // snap bow sound (D5)
        }
      }
    }

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (width / rect.width),
        y: (e.clientY - rect.top) * (height / rect.height)
      };
    }

    // --- GAME OVER / WIN TRIGGERS ---
    function triggerGameOver(msg) {
      gameState = "gameover";
      overlayTitle.textContent = "Try Again! 🐒";
      overlayDesc.textContent = msg || "Dharma rewards patience. Let's try once more!";
      startBtn.textContent = "Start Again";
      overlay.style.display = "flex";
      playBeep(180, "sawtooth", 0.45);
    }

    function triggerWin(msg) {
      gameState = "win";
      overlayTitle.textContent = "🏆 Victory Unlocked! 🏆";
      overlayDesc.textContent = msg || "Excellent job! You are a true helper of Dharma.";
      startBtn.textContent = "Play Again";
      overlay.style.display = "flex";
      
      playBeep(523, "sine", 0.12);
      setTimeout(() => playBeep(659, "sine", 0.12), 80);
      setTimeout(() => playBeep(784, "sine", 0.12), 160);
      setTimeout(() => playBeep(1046, "sine", 0.25), 240);
    }

    // --- STACK SETU HELPERS ---
    function spawnSetuBlock() {
      activeBlock = {
        x: Math.random() * (width - 120) + 30,
        y: 20,
        w: 55,
        h: 18,
        vx: (score + 1) * 0.5 + 1.2, // speed increases with score
        vy: 0
      };
      if (Math.random() > 0.5) activeBlock.vx *= -1;
    }

    // --- CARD MATCH HELPERS ---
    function initMatchGameCards() {
      const emojis = ["🐒", "🏹", "🌸", "👹", "🦅", "🧱"];
      const deck = [...emojis, ...emojis];
      
      // Shuffle deck
      deck.sort(() => Math.random() - 0.5);

      matchCards = [];
      flippedCards = [];
      blockFlipping = false;

      const cardW = 55;
      const cardH = 65;
      const gapX = 12;
      const gapY = 10;
      const startX = (width - (4 * cardW + 3 * gapX)) / 2;
      const startY = 40;

      for (let i = 0; i < 12; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        matchCards.push({
          id: i,
          symbol: deck[i],
          isFlipped: false,
          isMatched: false,
          x: startX + col * (cardW + gapX),
          y: startY + row * (cardH + gapY),
          w: cardW,
          h: cardH
        });
      }
    }

    function checkCardMatch() {
      blockFlipping = true;
      const [card1, card2] = flippedCards;

      if (card1.symbol === card2.symbol) {
        // Match found
        card1.isMatched = true;
        card2.isMatched = true;
        score++;
        scoreText.textContent = score;
        flippedCards = [];
        blockFlipping = false;
        playBeep(659.25, "sine", 0.2); // collect ring sound

        // Star bursts on card matches
        for (let i = 0; i < 8; i++) {
          particles.push({
            x: (card1.x + card2.x) / 2 + 25, y: (card1.y + card2.y) / 2 + 30,
            vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
            radius: Math.random() * 3 + 1, color: "#ffd700", life: 1.0, decay: 0.05
          });
        }

        if (score >= gameData.match.target) {
          setTimeout(() => triggerWin("You matched all cards and learned all virtues!"), 500);
        }
      } else {
        // No match, flip back
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          flippedCards = [];
          blockFlipping = false;
          playBeep(220, "triangle", 0.15); // fail beep
        }, 800);
      }
    }

    // --- MASTER UPDATE ENGINE ---
    function update() {
      if (gameState !== "playing") return;

      // 1. HANUMAN LEAP UPDATE
      if (activeGameMode === "leap") {
        hanuman.vy += hanuman.gravity;
        hanuman.y += hanuman.vy;

        if (hanuman.y - hanuman.radius <= 0) {
          hanuman.y = hanuman.radius;
          hanuman.vy = 0;
        }
        if (hanuman.y + hanuman.radius >= height - 30) {
          triggerGameOver("Hanuman splashed in the sea. Leap again!");
        }

        obstacleTimer++;
        if (obstacleTimer > 120) {
          obstacleTimer = 0;
          const cloudHeight = 45 + Math.random() * 65;
          obstacles.push({
            x: width + 20, y: Math.random() * (height - cloudHeight - 150) + 30,
            width: 32, height: cloudHeight
          });
        }

        obstacles.forEach((cloud, idx) => {
          cloud.x -= 1.8;
          if (
            hanuman.x + hanuman.radius > cloud.x && 
            hanuman.x - hanuman.radius < cloud.x + cloud.width &&
            (hanuman.y - hanuman.radius < cloud.y || hanuman.y + hanuman.radius > cloud.y + 90)
          ) {
            triggerGameOver("Oh no! Hanuman hit a storm cloud.");
          }
          if (cloud.x + cloud.width < 0) obstacles.splice(idx, 1);
        });

        starTimer++;
        if (starTimer > 150) {
          starTimer = 0;
          stars.push({ x: width + 20, y: 40 + Math.random() * (height - 90), radius: 8 });
        }

        stars.forEach((star, idx) => {
          star.x -= 1.8;
          const dist = Math.hypot(hanuman.x - star.x, hanuman.y - star.y);
          if (dist < hanuman.radius + star.radius) {
            stars.splice(idx, 1);
            score++;
            scoreText.textContent = score;
            playBeep(659.25, "sine", 0.15);
            for (let i = 0; i < 8; i++) {
              particles.push({
                x: star.x, y: star.y,
                vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                radius: Math.random() * 3 + 1, color: "#ffd700", life: 1.0, decay: 0.05
              });
            }
            if (score >= gameData.leap.target) {
              triggerWin("Hanuman collected all stars and reached Lanka!");
            }
          }
          if (star.x + 20 < 0) stars.splice(idx, 1);
        });

        bgScrollX -= 0.6;
        if (bgScrollX <= -width) bgScrollX = 0;
      }

      // 2. RAMA'S BOW UPDATE
      else if (activeGameMode === "arrow") {
        if (arrowObj.active) {
          arrowObj.x += arrowObj.vx;
          arrowObj.y += arrowObj.vy;
          arrowObj.vy += 0.05; // gravity curve

          particles.push({
            x: arrowObj.x, y: arrowObj.y,
            color: "rgba(255, 215, 0, 0.6)", size: Math.random() * 2 + 1, life: 1.0, decay: 0.08
          });

          // Check hit
          arrowTargets.forEach((target, idx) => {
            const dist = Math.hypot(arrowObj.x - target.x, arrowObj.y - target.y);
            if (dist < target.radius + 8) {
              // Hit target!
              arrowTargets.splice(idx, 1);
              arrowObj.active = false;
              score++;
              scoreText.textContent = score;
              playBeep(880, "sine", 0.2); // victory ring sound

              // Target explosion particles
              for (let i = 0; i < 15; i++) {
                particles.push({
                  x: target.x, y: target.y,
                  vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7,
                  radius: Math.random() * 4 + 1.5, color: "#ff8c00", life: 1.0, decay: 0.04
                });
              }

              // Spawn new target
              arrowTargets.push({
                x: width - 60 - Math.random() * 40,
                y: Math.random() * (height - 80) + 40,
                vy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1.5 + 0.8),
                radius: 15,
                emoji: Math.random() > 0.5 ? "👹" : "👿"
              });

              if (score >= gameData.arrow.target) {
                triggerWin("Dharma restored! You popped all bad thoughts.");
              }
            }
          });

          // Bounds reset
          if (arrowObj.x > width || arrowObj.x < 0 || arrowObj.y > height || arrowObj.y < 0) {
            arrowObj.active = false;
          }
        }

        // Move targets
        arrowTargets.forEach(target => {
          target.y += target.vy;
          if (target.y - target.radius < 20 || target.y + target.radius > height - 40) {
            target.vy *= -1; // bounce
          }
        });
      }

      // 3. BUILD SETU UPDATE
      else if (activeGameMode === "setu") {
        if (activeBlock.vy === 0) {
          // Horizontal scanning
          activeBlock.x += activeBlock.vx;
          if (activeBlock.x < 10 || activeBlock.x + activeBlock.w > width - 10) {
            activeBlock.vx *= -1;
          }
        } else {
          // Falling physics
          activeBlock.y += activeBlock.vy;
          
          // Check collision with the stack
          if (activeBlock.y + activeBlock.h >= stackHeight) {
            const landingY = stackHeight - activeBlock.h;
            
            // Check alignment (within stack block bounds)
            // First block can align anywhere on the bottom sea
            let isSafe = false;
            
            if (bridgeBlocks.length === 0) {
              isSafe = true; // landing on base sea floor is safe
            } else {
              const topStack = bridgeBlocks[bridgeBlocks.length - 1];
              // Must overlap at least 25% of top block
              const overlap = Math.min(activeBlock.x + activeBlock.w, topStack.x + topStack.w) - Math.max(activeBlock.x, topStack.x);
              if (overlap > 12) {
                isSafe = true;
              }
            }

            if (isSafe) {
              activeBlock.y = landingY;
              activeBlock.vy = 0;
              bridgeBlocks.push(activeBlock);
              
              stackHeight = landingY;
              score++;
              scoreText.textContent = score;
              playBeep(523, "sine", 0.15); // positive stack sound

              // Splash sand particles
              for (let i = 0; i < 8; i++) {
                particles.push({
                  x: activeBlock.x + activeBlock.w/2, y: landingY,
                  vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3 - 1,
                  radius: Math.random() * 3 + 1, color: "#93c5fd", life: 1.0, decay: 0.05
                });
              }

              if (score >= gameData.setu.target) {
                triggerWin("Bridge complete! The army can now cross.");
              } else {
                spawnSetuBlock();
              }
            } else {
              // Missed and slipped off!
              activeBlock.vy = 5.0; // keep falling to ocean
              if (activeBlock.y > height) {
                triggerGameOver("The stone slipped into the sea. Drop carefully!");
              }
            }
          }
        }
      }

      // 4. MEMORY MATCH CARDS UPDATE (No tick calculations needed)
      
      // 5. HERB CATCHER UPDATE
      else if (activeGameMode === "catcher") {
        catcherTimer++;
        if (catcherTimer > 60) {
          catcherTimer = 0;
          
          const isHerb = Math.random() > 0.35;
          fallingItems.push({
            x: Math.random() * (width - 40) + 20,
            y: -15,
            radius: isHerb ? 8 : 10,
            type: isHerb ? "herb" : "fireball",
            speed: Math.random() * 1.5 + (score * 0.1) + 2.0,
            symbol: isHerb ? "🌿" : "🔥"
          });
        }

        fallingItems.forEach((item, idx) => {
          item.y += item.speed;

          // Catch collision check
          const dist = Math.hypot(catcherPlayer.x - item.x, catcherPlayer.y - item.y);
          if (dist < catcherPlayer.radius + item.radius) {
            fallingItems.splice(idx, 1);
            
            if (item.type === "herb") {
              score++;
              scoreText.textContent = score;
              playBeep(659.25, "sine", 0.12);
              
              // green herb sparkles
              for (let i = 0; i < 6; i++) {
                particles.push({
                  x: item.x, y: item.y,
                  vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                  radius: Math.random() * 2 + 1, color: "#86efac", life: 1.0, decay: 0.05
                });
              }

              if (score >= gameData.catcher.target) {
                triggerWin("Success! Hanuman brought the herbs to save Lakshmana!");
              }
            } else {
              // Hit by fireball!
              playerLives--;
              playBeep(150, "triangle", 0.3);
              
              // red explosion
              for (let i = 0; i < 12; i++) {
                particles.push({
                  x: item.x, y: item.y,
                  vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                  radius: Math.random() * 3 + 1, color: "#ef4444", life: 1.0, decay: 0.05
                });
              }

              if (playerLives <= 0) {
                triggerGameOver("Too many fireballs. Dodge carefully!");
              }
            }
          }

          // Off screen removal
          if (item.y - 20 > height) {
            fallingItems.splice(idx, 1);
          }
        });
      }

      // Update globally shared particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) particles.splice(idx, 1);
      });
    }

    // --- MASTER DRAW ENGINE ---
    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Gradient sky background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#080b18");
      skyGrad.addColorStop(1, "#141c3a");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 1. DRAW HANUMAN LEAP ---
      if (activeGameMode === "leap") {
        // Draw scrolling mountain peaks
        ctx.fillStyle = "#0c0e1e";
        ctx.beginPath();
        ctx.moveTo(bgScrollX, height - 30);
        ctx.lineTo(bgScrollX + 100, height - 100);
        ctx.lineTo(bgScrollX + 200, height - 30);
        ctx.lineTo(bgScrollX + 300, height - 80);
        ctx.lineTo(bgScrollX + 400, height - 30);
        ctx.lineTo(bgScrollX + width, height - 30);
        ctx.lineTo(bgScrollX + width + 100, height - 100);
        ctx.lineTo(bgScrollX + width + 200, height - 30);
        ctx.lineTo(bgScrollX + width + 300, height - 80);
        ctx.lineTo(bgScrollX + width + 400, height - 30);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Draw Water/Sea at bottom
        ctx.fillStyle = "#1e40af";
        ctx.fillRect(0, height - 30, width, 30);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < width; i += 20) {
          const offset = Math.sin(Date.now() * 0.005 + i) * 3;
          if (i === 0) ctx.moveTo(i, height - 20 + offset);
          else ctx.lineTo(i, height - 20 + offset);
        }
        ctx.stroke();

        // Draw Obstacles (Clouds)
        obstacles.forEach(cloud => {
          ctx.fillStyle = "rgba(90, 100, 130, 0.9)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1.5;
          ctx.fillRect(cloud.x, 0, cloud.width, cloud.y);
          ctx.strokeRect(cloud.x, 0, cloud.width, cloud.y);
          
          const bHeight = height - (cloud.y + 90) - 30;
          ctx.fillRect(cloud.x, cloud.y + 90, cloud.width, bHeight);
          ctx.strokeRect(cloud.x, cloud.y + 90, cloud.width, bHeight);
        });

        // Draw Stars (Gold diamonds)
        stars.forEach(star => {
          ctx.save();
          ctx.translate(star.x, star.y);
          ctx.fillStyle = "#ffd700";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#ffd700";
          ctx.beginPath();
          ctx.moveTo(0, -star.radius);
          ctx.lineTo(star.radius * 0.7, 0);
          ctx.lineTo(0, star.radius);
          ctx.lineTo(-star.radius * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });

        // Draw Hanuman Medallion
        ctx.save();
        ctx.translate(hanuman.x, hanuman.y);
        ctx.rotate(hanuman.vy * 0.04);
        ctx.fillStyle = "rgba(255, 215, 0, 0.25)";
        ctx.beginPath();
        ctx.arc(0, 0, hanuman.radius + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2.5;
        ctx.fillStyle = "#0c122b";
        ctx.beginPath();
        ctx.arc(0, 0, hanuman.radius + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, hanuman.radius + 0.5, 0, Math.PI * 2);
        ctx.clip();
        const size = (hanuman.radius + 0.5) * 2;
        ctx.drawImage(hanumanImg, -size / 2, -size / 2, size, size);
        ctx.restore();
        ctx.restore();
      }

      // --- 2. DRAW RAMA'S BOW ---
      else if (activeGameMode === "arrow") {
        // Draw decorative archery targets in background
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bow.x, bow.y, 70, -Math.PI/2, Math.PI/2);
        ctx.stroke();

        // Draw Targets (Demon Emojis)
        arrowTargets.forEach(target => {
          ctx.save();
          ctx.font = `${target.radius * 2}px 'Montserrat'`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(target.emoji, target.x, target.y);
          ctx.restore();
        });

        // Draw Bow & Drag elastic string
        ctx.save();
        ctx.translate(bow.x, bow.y);
        
        let rotation = 0;
        let pullX = 0;
        
        if (isAiming) {
          rotation = Math.atan2(dragStart.y - dragCurrent.y, dragStart.x - dragCurrent.x);
          const dist = Math.hypot(dragStart.x - dragCurrent.x, dragStart.y - dragCurrent.y);
          pullX = -Math.min(30, dist * 0.6);
        }

        ctx.rotate(rotation);

        // Draw Bow Stave
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(10, 0, bow.radius, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        // Draw Bowstring
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, -bow.radius);
        ctx.lineTo(pullX, 0);
        ctx.lineTo(10, bow.radius);
        ctx.stroke();

        // Draw Arrow resting on string
        if (!arrowObj.active) {
          ctx.strokeStyle = "#ffd700";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pullX, 0);
          ctx.lineTo(pullX + 35, 0);
          ctx.stroke();
          
          // Arrow tip
          ctx.fillStyle = "#ffd700";
          ctx.beginPath();
          ctx.moveTo(pullX + 35, -5);
          ctx.lineTo(pullX + 42, 0);
          ctx.lineTo(pullX + 35, 5);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();

        // Draw flying arrow
        if (arrowObj.active) {
          ctx.save();
          ctx.translate(arrowObj.x, arrowObj.y);
          const angle = Math.atan2(arrowObj.vy, arrowObj.vx);
          ctx.rotate(angle);
          
          ctx.strokeStyle = "#ffd700";
          ctx.lineWidth = 3;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#ffd700";
          
          ctx.beginPath();
          ctx.moveTo(-15, 0);
          ctx.lineTo(15, 0);
          ctx.stroke();
          
          ctx.fillStyle = "#ffd700";
          ctx.beginPath();
          ctx.moveTo(15, -4);
          ctx.lineTo(22, 0);
          ctx.lineTo(15, 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // --- 3. DRAW BUILD SETU ---
      else if (activeGameMode === "setu") {
        // Draw shoreline hills
        ctx.fillStyle = "#0c0d1c";
        ctx.fillRect(0, height - 30, width, 30);

        // Draw sea floor lines
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(0, height - 25, width, 25);

        // Draw Placed stacked blocks
        bridgeBlocks.forEach((block) => {
          ctx.fillStyle = "#475569";
          ctx.strokeStyle = "#ffd700";
          ctx.lineWidth = 1.5;
          ctx.fillRect(block.x, block.y, block.w, block.h);
          ctx.strokeRect(block.x, block.y, block.w, block.h);

          // Glowing text: "राम"
          ctx.fillStyle = "#ffd700";
          ctx.font = "bold 9px 'Cinzel'";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("राम", block.x + block.w/2, block.y + block.h/2);
        });

        // Draw Active falling block
        if (gameState === "playing") {
          ctx.fillStyle = "#64748b";
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 1.5;
          ctx.fillRect(activeBlock.x, activeBlock.y, activeBlock.w, activeBlock.h);
          ctx.strokeRect(activeBlock.x, activeBlock.y, activeBlock.w, activeBlock.h);

          ctx.fillStyle = "#fff";
          ctx.font = "bold 9px 'Cinzel'";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("राम", activeBlock.x + activeBlock.w/2, activeBlock.y + activeBlock.h/2);
        }
      }

      // --- 4. DRAW MEMORY MATCH CARDS ---
      else if (activeGameMode === "match") {
        matchCards.forEach(card => {
          if (card.isMatched) return; // matched cards disappear

          ctx.save();
          ctx.translate(card.x, card.y);

          // Card shadow/glowing box
          ctx.shadowBlur = 5;
          ctx.shadowColor = card.isFlipped ? "var(--primary-saffron)" : "rgba(0,0,0,0.5)";

          // Card background
          ctx.fillStyle = card.isFlipped ? "rgba(255, 140, 0, 0.15)" : "#0f172a";
          ctx.strokeStyle = card.isFlipped ? "var(--primary-saffron)" : "rgba(255,255,255,0.1)";
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.roundRect(0, 0, card.w, card.h, 6);
          ctx.fill();
          ctx.stroke();

          // Card contents
          if (card.isFlipped) {
            // Draw emoji symbol
            ctx.font = "24px 'Montserrat'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(card.symbol, card.w/2, card.h/2);
          } else {
            // Draw glowing question mark
            ctx.fillStyle = "rgba(255, 215, 0, 0.35)";
            ctx.font = "bold 20px 'Cinzel'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", card.w/2, card.h/2);
          }

          ctx.restore();
        });
      }

      // --- 5. DRAW HERB CATCHER ---
      else if (activeGameMode === "catcher") {
        // Draw ground sea line
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(0, height - 12, width, 12);

        // Draw Player lives in corner
        ctx.fillStyle = "#ef4444";
        ctx.font = "11px 'Montserrat'";
        ctx.textAlign = "right";
        ctx.fillText("Lives: " + "❤️".repeat(playerLives), width - 15, 20);

        // Draw Falling Items
        fallingItems.forEach(item => {
          ctx.save();
          ctx.font = `${item.radius * 2}px 'Montserrat'`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.symbol, item.x, item.y);
          ctx.restore();
        });

        // Draw Catcher Hanuman Token
        ctx.save();
        ctx.translate(catcherPlayer.x, catcherPlayer.y);
        
        ctx.fillStyle = "rgba(255, 215, 0, 0.25)";
        ctx.beginPath();
        ctx.arc(0, 0, catcherPlayer.radius + 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2.5;
        ctx.fillStyle = "#0c122b";
        ctx.beginPath();
        ctx.arc(0, 0, catcherPlayer.radius + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, catcherPlayer.radius, 0, Math.PI * 2);
        ctx.clip();
        const size = catcherPlayer.radius * 2;
        ctx.drawImage(hanumanImg, -size / 2, -size / 2, size, size);
        ctx.restore();
        
        ctx.restore();
      }

      // Draw active particles globally
      particles.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
      ctx.globalAlpha = 1.0;
    }

    // --- GAME LOOP TIMER ---
    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  }

  // Ready State Loader
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKids);
  } else {
    initKids();
  }
})();
