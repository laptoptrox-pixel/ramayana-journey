(function() {
  function initApp() {
  
  // App State
  let currentKandaIndex = 0;
  let activeTab = "journey-tab";
  let activeAnimationReset = null;

  // Initialize all elements
  initTabs();
  initAmbientController();
  initCustomPlayers();
  initJourneyView();
  initChatView();
  initSlokasView();
  initJournalView();
  initAnimationModal();
  initDailyQuote();
  initCodexView();
  initDharmaQuiz();
  initSessionTimer();
  
  // Triggers immediate render of virtue bars and trail progress
  updateVirtueBars();
  updateTrailProgress();

  // --- 1. TABS SYSTEM ---
  function initTabs() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const targetTab = this.getAttribute("data-tab");
        if (targetTab === activeTab) return;

        // Update Nav Menu UI
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        // Toggle Visibility of Sections
        document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
        const activeSection = document.getElementById(targetTab);
        if (activeSection) {
          activeSection.classList.add("active");
        }

        activeTab = targetTab;
        
        // Stop any running animations if switching tabs
        if (window.RamayanaGraphics) {
          window.RamayanaGraphics.stopActive();
        }
      });
    });
  }

  // --- 2. AMBIENT AUDIO SYSTEM ---
  function initAmbientController() {
    // Toggle Lotus Sound Panel
    const lotusToggle = document.getElementById("lotus-toggle-btn");
    const soundConsole = document.getElementById("lotus-sound-console");
    if (lotusToggle && soundConsole) {
      lotusToggle.addEventListener("click", () => {
        soundConsole.classList.toggle("expanded");
      });
    }

    const toggleBtn = document.getElementById("toggle-ambient-btn");
    const statusTxt = document.getElementById("ambient-status");
    const masterSlider = document.getElementById("volume-master");
    const tanpuraSlider = document.getElementById("volume-tanpura");
    const fluteSlider = document.getElementById("volume-flute");
    
    // Play button in Media Tab
    const mediaPlayBtn = document.getElementById("media-ambient-play-btn");

    function updateAudioUI(isRunning) {
      if (isRunning) {
        statusTxt.textContent = "On";
        statusTxt.style.color = "#ff8c00";
        toggleBtn.querySelector("span").textContent = "Pause Music";
        if (mediaPlayBtn) mediaPlayBtn.textContent = "⏸";
      } else {
        statusTxt.textContent = "Off";
        statusTxt.style.color = "#666";
        toggleBtn.querySelector("span").textContent = "Play Flute / Drone";
        if (mediaPlayBtn) mediaPlayBtn.textContent = "▶";
      }
    }

    function toggleAudio() {
      if (window.RamayanaSynth) {
        const isPlaying = window.RamayanaSynth.toggleAmbientSound();
        updateAudioUI(isPlaying);
      }
    }

    toggleBtn.addEventListener("click", toggleAudio);
    if (mediaPlayBtn) {
      mediaPlayBtn.addEventListener("click", toggleAudio);
    }

    // Set up volume slider change handlers
    masterSlider.addEventListener("input", function() {
      if (window.RamayanaSynth) window.RamayanaSynth.setVolume("master", parseFloat(this.value));
    });
    tanpuraSlider.addEventListener("input", function() {
      if (window.RamayanaSynth) window.RamayanaSynth.setVolume("tanpura", parseFloat(this.value));
    });
    fluteSlider.addEventListener("input", function() {
      if (window.RamayanaSynth) window.RamayanaSynth.setVolume("flute", parseFloat(this.value));
    });

    // Secondary Layer Mixer Toggles
    const bellsBtn = document.getElementById("toggle-bells-btn");
    const wavesBtn = document.getElementById("toggle-waves-btn");

    if (bellsBtn) {
      bellsBtn.addEventListener("click", function() {
        if (window.RamayanaSynth) {
          const active = window.RamayanaSynth.toggleBells();
          if (active) {
            bellsBtn.style.background = "rgba(255, 140, 0, 0.2)";
            bellsBtn.style.borderColor = "var(--primary-saffron)";
            bellsBtn.style.color = "var(--gold-glow)";
          } else {
            bellsBtn.style.background = "rgba(0,0,0,0.3)";
            bellsBtn.style.borderColor = "rgba(255, 215, 0, 0.15)";
            bellsBtn.style.color = "";
          }
        }
      });
    }

    if (wavesBtn) {
      wavesBtn.addEventListener("click", function() {
        if (window.RamayanaSynth) {
          const active = window.RamayanaSynth.toggleWaves();
          if (active) {
            wavesBtn.style.background = "rgba(255, 140, 0, 0.2)";
            wavesBtn.style.borderColor = "var(--primary-saffron)";
            wavesBtn.style.color = "var(--gold-glow)";
          } else {
            wavesBtn.style.background = "rgba(0,0,0,0.3)";
            wavesBtn.style.borderColor = "rgba(255, 215, 0, 0.15)";
            wavesBtn.style.color = "";
          }
        }
      });
    }
  }

  // --- CUSTOM AUDIO PLAYERS ---
  function initCustomPlayers() {
    const audioEl = document.getElementById("custom-media-audio");
    if (!audioEl) return;

    const playBtn1 = document.getElementById("custom-play-1");
    const playBtn2 = document.getElementById("custom-play-2");
    const bar1 = document.getElementById("custom-bar-1");
    const bar2 = document.getElementById("custom-bar-2");

    const track1 = "https://ia800803.us.archive.org/21/items/Valmiki-Ramayana-Sanskrit-Samhita/01_Balakanda_Sarg_1.mp3";
    const track2 = "https://archive.org/download/Valmiki-Ramayana-Samhita-Ayodhyakanda/VR-Ayodhyakanda-001.mp3";

    let activeTrack = null; // 1 or 2

    audioEl.addEventListener("error", function() {
      console.warn("External audio stream failed to load:", audioEl.error);
      alert("Notice: The external audio stream could not be loaded due to network limits. You can still enjoy the real-time synthesized Bansuri Flute & Tanpura drone at the bottom-right.");
      if (playBtn1) playBtn1.textContent = "▶";
      if (playBtn2) playBtn2.textContent = "▶";
      activeTrack = null;
    });

    function playTrack(trackNum, url, btn, bar, otherBtn, otherBar) {
      // Pause TTS speech if running
      if (window.RamayanaSynth) {
        window.RamayanaSynth.stopChanting();
      }

      if (activeTrack === trackNum) {
        if (audioEl.paused) {
          audioEl.play();
          btn.textContent = "⏸";
        } else {
          audioEl.pause();
          btn.textContent = "▶";
        }
      } else {
        audioEl.src = url;
        audioEl.play();
        activeTrack = trackNum;

        btn.textContent = "⏸";
        otherBtn.textContent = "▶";
        otherBar.style.width = "0%";
      }
    }

    if (playBtn1 && playBtn2) {
      playBtn1.addEventListener("click", function() {
        playTrack(1, track1, playBtn1, bar1, playBtn2, bar2);
      });

      playBtn2.addEventListener("click", function() {
        playTrack(2, track2, playBtn2, bar2, playBtn1, bar1);
      });
    }

    // Time update progress bar
    audioEl.addEventListener("timeupdate", function() {
      if (!audioEl.duration) return;
      const pct = (audioEl.currentTime / audioEl.duration) * 100;
      if (activeTrack === 1 && bar1) {
        bar1.style.width = `${pct}%`;
      } else if (activeTrack === 2 && bar2) {
        bar2.style.width = `${pct}%`;
      }
    });

    audioEl.addEventListener("ended", function() {
      if (playBtn1) playBtn1.textContent = "▶";
      if (playBtn2) playBtn2.textContent = "▶";
      if (bar1) bar1.style.width = "0%";
      if (bar2) bar2.style.width = "0%";
      activeTrack = null;
    });
  }

  // --- 3. RAMA'S PATH (JOURNEY MAP) VIEW ---
  function initJourneyView() {
    const mapNodes = document.querySelectorAll(".map-node");
    const badgesNav = document.getElementById("kanda-badges-nav");
    
    // Populate Badges Bar
    if (badgesNav && window.RamayanaJourney) {
      badgesNav.innerHTML = "";
      window.RamayanaJourney.forEach((kanda, idx) => {
        const btn = document.createElement("button");
        btn.className = "kanda-badge-btn";
        btn.setAttribute("data-index", idx);
        btn.textContent = `${idx + 1}. ${kanda.name.split(" ")[0]}`; // e.g. "1. Bala"
        
        btn.addEventListener("click", function() {
          selectKanda(idx);
        });
        btn.addEventListener("mouseenter", function() {
          if (window.RamayanaSynth) {
            window.RamayanaSynth.playPluck(idx);
          }
        });
        badgesNav.appendChild(btn);
      });
    }
    
    // Bind click events on SVG nodes
    mapNodes.forEach(node => {
      node.addEventListener("click", function() {
        const kandaId = this.getAttribute("data-kanda");
        const idx = window.RamayanaJourney.findIndex(k => k.id === kandaId);
        if (idx !== -1) {
          selectKanda(idx);
        }
      });
      node.addEventListener("mouseenter", function() {
        const kandaId = this.getAttribute("data-kanda");
        const idx = window.RamayanaJourney.findIndex(k => k.id === kandaId);
        if (idx !== -1 && window.RamayanaSynth) {
          window.RamayanaSynth.playPluck(idx);
        }
      });
    });

    // Select the first Kanda (Bala Kanda) by default
    if (window.RamayanaJourney && window.RamayanaJourney.length > 0) {
      selectKanda(0);
    }
  }

  function selectKanda(index) {
    currentKandaIndex = index;
    const kanda = window.RamayanaJourney[index];
    const panel = document.getElementById("journey-details-panel");
    if (!panel || !kanda) return;

    // Update trail percentage on timeline container
    const nav = document.getElementById("kanda-badges-nav");
    if (nav) {
      const pct = (index / 6) * 100;
      nav.style.setProperty("--trail-pct", `${pct}%`);
    }

    // Dynamic traveler path highlight and marker move
    const pathVertices = [
      { x: 190, y: 150 }, // Bala (Ayodhya)
      { x: 400, y: 140 }, // Mithila
      { x: 190, y: 150 }, // Ayodhya start
      { x: 230, y: 220 }, // Ayodhya exile
      { x: 260, y: 310 }, // Aranya
      { x: 240, y: 440 }, // Kishkindha
      { x: 270, y: 550 }, // Sundara
      { x: 280, y: 640 }, // Yuddha
      { x: 190, y: 150 }  // Uttara return
    ];

    const activeVertices = pathVertices.slice(0, index === 0 ? 2 : (index === 1 ? 4 : index + 3));
    const pathD = "M " + activeVertices.map(v => `${v.x},${v.y}`).join(" L ");
    const trailEl = document.getElementById("active-journey-trail");
    if (trailEl) {
      trailEl.setAttribute("d", pathD);
    }

    const activeCoords = [
      { x: 400, y: 140 }, // Bala (Mithila)
      { x: 230, y: 220 }, // Ayodhya Hermitage
      { x: 260, y: 310 }, // Aranya
      { x: 240, y: 440 }, // Kishkindha
      { x: 270, y: 550 }, // Sundara
      { x: 280, y: 640 }, // Yuddha
      { x: 190, y: 150 }  // Uttara return
    ];

    const target = activeCoords[index];
    const traveler = document.getElementById("map-traveler");
    if (traveler && target) {
      traveler.setAttribute("transform", `translate(${target.x}, ${target.y})`);
    }

    // Highlight map node
    document.querySelectorAll(".map-node").forEach(node => {
      const circle = node.querySelector("circle:nth-child(2)");
      if (circle) {
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("stroke", "#ffd700");
        circle.setAttribute("r", "6");
      }
      node.classList.remove("active-node");
    });
    
    const activeNode = document.querySelector(`.map-node[data-kanda="${kanda.id}"]`);
    if (activeNode) {
      const circle = activeNode.querySelector("circle:nth-child(2)");
      if (circle) {
        circle.setAttribute("stroke-width", "4");
        circle.setAttribute("stroke", "#ffffff"); // white ring for contrast
        circle.setAttribute("r", "8.5");
      }
      activeNode.classList.add("active-node");
    }

    // Highlight timeline badge
    document.querySelectorAll(".kanda-badge-btn").forEach(btn => {
      btn.classList.remove("active");
    });
    const activeBadge = document.querySelector(`.kanda-badge-btn[data-index="${index}"]`);
    if (activeBadge) {
      activeBadge.classList.add("active");
      activeBadge.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Load character chips with tooltips
    let characterChipsHTML = "";
    kanda.characters.forEach(char => {
      characterChipsHTML += `
        <span class="character-chip">
          ${char.name}
          <span class="tooltip">${char.role}</span>
        </span>
      `;
    });

    // Populate Kanda details panel
    panel.innerHTML = `
      <div class="chapter-details-card">
        <div>
          <span class="badge" style="background-color: ${kanda.color}1c; color: ${kanda.color}; border-color: ${kanda.color}44;">
            ${kanda.name}
          </span>
          <h3 class="title-font glow-text" style="font-size: 1.6rem; margin-top: 0.5rem; color: #fff;">
            ${kanda.title}
          </h3>
        </div>

        <p style="font-size: 0.9rem; color: var(--text-muted);">
          ${kanda.description}
        </p>

        <div>
          <h4 class="title-font" style="font-size: 0.85rem; color: var(--gold-glow); margin-bottom: 0.5rem;">Key Milestones</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
            ${kanda.milestones.map(m => `<li><strong>${m.name}</strong>: ${m.details}</li>`).join("")}
          </ul>
        </div>

        <div>
          <h4 class="title-font" style="font-size: 0.85rem; color: var(--gold-glow);">Characters Introduced</h4>
          <div class="character-chips">
            ${characterChipsHTML}
          </div>
        </div>

        <div>
          <h4 class="title-font" style="font-size: 0.85rem; color: var(--gold-glow); margin-bottom: 0.25rem;">Dharma Virtue</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
            ${kanda.moral.lesson}
          </p>
        </div>

        <button id="open-animation-btn" class="interactive-action-btn" style="margin-top: auto;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Open Interactive Meditation</span>
        </button>
      </div>
    `;

    // Bind event to open animation
    document.getElementById("open-animation-btn").addEventListener("click", function() {
      openAnimationModal(kanda);
    });
  }

  // --- 4. INTERACTIVE ANIMATION MODAL ---
  function initAnimationModal() {
    const modal = document.getElementById("animation-modal");
    const closeBtn = document.getElementById("close-modal-btn");
    const closeBtnSecondary = document.getElementById("close-animation-btn");
    const resetBtn = document.getElementById("reset-animation-btn");

    function closeModal() {
      modal.style.display = "none";
      if (window.RamayanaGraphics) {
        window.RamayanaGraphics.stopActive();
      }
      activeAnimationReset = null;
    }

    closeBtn.addEventListener("click", closeModal);
    closeBtnSecondary.addEventListener("click", closeModal);
    resetBtn.addEventListener("click", function() {
      if (activeAnimationReset) {
        activeAnimationReset();
      }
    });

    // Close on overlay click
    modal.addEventListener("click", function(e) {
      if (e.target === modal) closeModal();
    });
  }

  function openAnimationModal(kanda) {
    window.RamayanaActiveKandaId = kanda.id;
    const modal = document.getElementById("animation-modal");
    const title = document.getElementById("modal-animation-title");
    
    title.textContent = `${kanda.name} - Dynamic Meditation`;
    modal.style.display = "flex";

    // Trigger canvas load
    if (window.RamayanaGraphics) {
      if (kanda.id === "bala" || kanda.id === "ayodhya" || kanda.id === "uttara") {
        // Bow animations (Shiva Bow, Exile Vow, Coronation)
        activeAnimationReset = window.RamayanaGraphics.initBow("animation-canvas");
      } else if (kanda.id === "yuddha") {
        // Setu Bridge building
        activeAnimationReset = window.RamayanaGraphics.initBridge("animation-canvas");
      } else if (kanda.id === "aranya" || kanda.id === "kishkindha" || kanda.id === "sundara") {
        // Arrow shooting (Golden Deer, Slaying Vali, Lanka Dahan)
        activeAnimationReset = window.RamayanaGraphics.initArrow("animation-canvas");
      } else {
        activeAnimationReset = window.RamayanaGraphics.initBow("animation-canvas");
      }
    }
  }

  // --- 5. VALMIKI AI CHAT VIEW ---
  function initChatView() {
    // Developer Shortcut: double-click the Chat header to toggle API key configurations
    const chatHeader = document.querySelector("#chat-tab header");
    const apiConfigBar = document.querySelector(".api-config-bar");
    if (chatHeader && apiConfigBar) {
      chatHeader.addEventListener("dblclick", function() {
        apiConfigBar.classList.toggle("visible");
      });
    }

    const chatContainer = document.getElementById("chat-messages-container");
    const userInput = document.getElementById("chat-user-input");
    const sendBtn = document.getElementById("chat-send-btn");
    const saveKeyBtn = document.getElementById("save-key-btn");
    const apiKeyInput = document.getElementById("gemini-key-input");
    const suggestedBtns = document.querySelectorAll(".suggested-btn[data-query]");

    // Retrieve saved key from localStorage or .env file
    const savedKey = localStorage.getItem("valmiki_gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || "";
    if (savedKey) {
      apiKeyInput.value = savedKey;
    }

    // Save key trigger
    saveKeyBtn.addEventListener("click", function() {
      const key = apiKeyInput.value.trim();
      if (key !== "") {
        localStorage.setItem("valmiki_gemini_api_key", key);
        alert("API Key saved securely in local storage!");
      } else {
        localStorage.removeItem("valmiki_gemini_api_key");
        alert("API Key removed. Switched to local wisdom offline mode.");
      }
    });

    // Send Message trigger
    async function handleChatSubmit() {
      const query = userInput.value.trim();
      if (query === "") return;

      // Render User Message
      appendMessage("User", query, "user");
      userInput.value = "";

      // Render Sage thinking
      const thinkingDiv = appendMessage("Sage Valmiki", "Reflecting on ancient scripts...", "sage thinking");

      // Query AI
      let key = localStorage.getItem("valmiki_gemini_api_key") || "";
      if (!key) {
        key = import.meta.env.VITE_GEMINI_API_KEY || "";
      }

      if (window.ValmikiAI) {
        const result = await window.ValmikiAI.ask(query, key);
        thinkingDiv.remove();
        
        // Append response
        appendMessage(result.title, result.response, "sage");
      }
    }

    sendBtn.addEventListener("click", handleChatSubmit);
    userInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") handleChatSubmit();
    });

    // Suggested queries
    suggestedBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        userInput.value = this.getAttribute("data-query");
        handleChatSubmit();
      });
    });

    function appendMessage(senderName, text, type) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-message ${type}`;
      
      if (type.includes("sage")) {
        msgDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="sage-name">${senderName}</span>
            <button class="sloka-btn text-speech-btn" style="width: 24px; height: 24px; font-size: 0.6rem;">🔊</button>
          </div>
          <p class="chat-text" style="white-space: pre-line;">${text}</p>
        `;

        // Bind text to speech read out
        msgDiv.querySelector(".text-speech-btn").addEventListener("click", function() {
          if (window.RamayanaSynth) {
            window.RamayanaSynth.speakSloka(text, "");
          }
        });
      } else {
        msgDiv.innerHTML = `<p>${text}</p>`;
      }
      
      chatContainer.appendChild(msgDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return msgDiv;
    }
  }

  // --- 6. SLOKA SANCTUARY VIEW ---
  function initSlokasView() {
    const container = document.getElementById("slokas-list-container");
    if (!container || !window.RamayanaSlokas) return;

    container.innerHTML = "";
    window.RamayanaSlokas.forEach(sloka => {
      const card = document.createElement("div");
      card.className = "glass-card sloka-card";
      card.innerHTML = `
        <div class="sloka-meta">
          <span class="sloka-source">${sloka.source}</span>
          <div class="sloka-audio-controls">
            <button class="sloka-btn play-sloka-btn" data-id="${sloka.id}" title="Chant Sloka">🔊</button>
            <button class="sloka-btn stop-sloka-btn" data-id="${sloka.id}" title="Stop" style="display: none;">⏹</button>
          </div>
        </div>
        <h3 class="title-font glow-text" style="color: #fff; font-size: 1.15rem; margin-bottom: 0.5rem;">${sloka.title}</h3>
        
        <p class="sloka-sanskrit">${sloka.sanskrit}</p>
        <p class="sloka-transliteration">${sloka.transliteration}</p>
        
        <div class="sloka-meaning">
          <p class="sloka-meaning-title">Translation & Meaning</p>
          <p class="sloka-meaning-text">${sloka.translation}</p>
        </div>

        <div class="sloka-meaning" style="border-color: rgba(255, 140, 0, 0.1);">
          <p class="sloka-meaning-title" style="color: var(--primary-saffron);">Life Application</p>
          <p class="sloka-meaning-text" style="font-style: italic;">${sloka.moral}</p>
        </div>
      `;

      // Play Chant Button listener
      const playBtn = card.querySelector(".play-sloka-btn");
      const stopBtn = card.querySelector(".stop-sloka-btn");

      playBtn.addEventListener("click", function() {
        if (window.RamayanaSynth) {
          window.RamayanaSynth.speakSloka(sloka.sanskrit, sloka.translation);
          playBtn.style.display = "none";
          stopBtn.style.display = "flex";
        }
      });

      stopBtn.addEventListener("click", function() {
        if (window.RamayanaSynth) {
          window.RamayanaSynth.stopChanting();
          stopBtn.style.display = "none";
          playBtn.style.display = "flex";
        }
      });

      container.appendChild(card);
    });
  }

  // --- 7. DHARMA JOURNAL VIEW ---
  function initJournalView() {
    const kandaSelect = document.getElementById("journal-kanda-select");
    const promptText = document.getElementById("journal-prompt-text");
    const textarea = document.getElementById("journal-reflection-text");
    const ratingSlider = document.getElementById("journal-rating-slider");
    const ratingValTxt = document.getElementById("journal-rating-val");
    const saveBtn = document.getElementById("save-journal-btn");
    const resetBtn = document.getElementById("reset-journal-btn");
    const downloadBtn = document.getElementById("download-report-btn");

    // Populate dropdown with Kandas
    kandaSelect.innerHTML = "";
    window.RamayanaJourney.forEach((kanda, idx) => {
      const opt = document.createElement("option");
      opt.value = kanda.id;
      opt.textContent = `${kanda.name} (${kanda.title})`;
      kandaSelect.appendChild(opt);
    });

    // Populate initial prompt
    updateJournalPrompt();

    kandaSelect.addEventListener("change", function() {
      updateJournalPrompt();
      loadSavedReflectionForCurrent();
    });

    ratingSlider.addEventListener("input", function() {
      ratingValTxt.textContent = this.value;
    });

    // Save reflection click
    saveBtn.addEventListener("click", function() {
      const kandaId = kandaSelect.value;
      const text = textarea.value.trim();
      const rating = ratingSlider.value;

      if (text.length < 10) {
        alert("Please write a deeper reflection (minimum 10 characters) to help yourself grow and unlock the progress score.");
        return;
      }

      if (window.DharmaJournal) {
        const success = window.DharmaJournal.save(kandaId, 0, text, rating);
        if (success) {
          alert("Reflection saved successfully! Your Dharma virtue balance has been updated.");
          updateVirtueBars();
        } else {
          alert("Error saving reflection.");
        }
      }
    });

    // Reset journal database
    resetBtn.addEventListener("click", function() {
      if (confirm("Are you sure you want to reset your reflection journal? All saved reflections will be deleted.")) {
        if (window.DharmaJournal) {
          window.DharmaJournal.reset();
          textarea.value = "";
          ratingSlider.value = 3;
          ratingValTxt.textContent = 3;
          updateVirtueBars();
          alert("Journal entries reset.");
        }
      }
    });

    // Export markdown report download
    downloadBtn.addEventListener("click", function() {
      if (window.DharmaJournal) {
        const content = window.DharmaJournal.exportMarkdown();
        const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Ramayana_Dharma_Reflection_Report.md");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    function updateJournalPrompt() {
      const kandaId = kandaSelect.value;
      const kanda = window.RamayanaJourney.find(k => k.id === kandaId);
      if (kanda) {
        // We present the first prompt in this version
        promptText.innerHTML = `<strong>Virtue: ${window.DharmaJournal.getMapping()[kandaId].label}</strong><br><br>${kanda.moral.prompts[0]}`;
      }
    }

    function loadSavedReflectionForCurrent() {
      if (window.DharmaJournal) {
        const entries = window.DharmaJournal.load();
        const kandaId = kandaSelect.value;
        if (entries[kandaId] && entries[kandaId][0]) {
          textarea.value = entries[kandaId][0].text;
          ratingSlider.value = entries[kandaId][0].rating;
          ratingValTxt.textContent = entries[kandaId][0].rating;
        } else {
          textarea.value = "";
          ratingSlider.value = 3;
          ratingValTxt.textContent = 3;
        }
      }
    }

    // Load initial entry
    loadSavedReflectionForCurrent();
  }

  // --- 8. VIRTUE SCORE PROGRESS BARS ---
  function updateVirtueBars() {
    const container = document.getElementById("virtues-progress-bars");
    if (!container || !window.DharmaJournal) return;

    const scores = window.DharmaJournal.getScores();
    const mappings = window.DharmaJournal.getMapping();
    
    container.innerHTML = "";
    
    for (const key in mappings) {
      const mapInfo = mappings[key];
      const score = scores[mapInfo.virtue];
      
      const barDiv = document.createElement("div");
      barDiv.className = "virtue-progress";
      barDiv.style.marginBottom = "1rem";
      
      barDiv.innerHTML = `
        <div class="virtue-info">
          <span class="virtue-label">${mapInfo.label}</span>
          <span class="virtue-pct">${score}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar" style="width: ${score}%;"></div>
        </div>
      `;
      container.appendChild(barDiv);
    }
  }
  
  // Custom event listener for external updates
  window.addEventListener('dharma-journal-updated', function() {
    updateVirtueBars();
    const completedCount = updateTrailProgress();
    if (completedCount === 7) {
      setTimeout(triggerDiwaliCelebration, 600); // short delay to show last save alert first
    }
  });

  // --- 10. TRAIL PROGRESS BAR UPDATER ---
  function updateTrailProgress() {
    if (!window.DharmaJournal) return 0;
    const entries = window.DharmaJournal.load();
    
    const kandaIds = ["bala", "ayodhya", "aranya", "kishkindha", "sundara", "yuddha", "uttara"];
    let completedCount = 0;
    
    kandaIds.forEach(k => {
      if (entries[k] && entries[k][0] && entries[k][0].text.trim().length > 0) {
        completedCount++;
      }
    });

    const percent = Math.round((completedCount / 7) * 100);
    const fillEl = document.getElementById("trail-progress-fill");
    const textEl = document.getElementById("trail-progress-text");
    
    if (fillEl) fillEl.style.width = `${percent}%`;
    if (textEl) textEl.textContent = `${percent}% Completed (${completedCount} / 7 Kandas Reflected)`;

    return completedCount;
  }

  // --- 9. DAILY DHARMA WISDOM QUOTE ---
  function initDailyQuote() {
    const quotes = [
      "\"Ramo vigrahavan dharmah\" — Sri Rama is the living embodiment of righteousness and duty.",
      "\"Satyameveśvaro loke...\" — Truth is indeed the supreme God in this world. There is no status higher than truth.",
      "\"Janani Janmabhumishca...\" — One's mother and motherland are far superior even to heaven.",
      "Beware of superficial allurements (the Golden Deer). Distractions from duty can lead to heavy trials.",
      "Humility is the ornament of power. In serving a noble cause selflessly, one discovers infinite strength, as did Hanuman.",
      "A promise (Vachan) is a debt of character. Honor your vows even when it requires stepping out of your comfort zone.",
      "Ego is a fire that consumes all intellect and wealth. Even the golden empire of Lanka fell due to Ravana's pride.",
      "Struggle is not a curse. Rama's forest exile (Vanavas) was the crucible that forged his universal legacy of character."
    ];
    const textEl = document.getElementById("daily-dharma-quote-text");
    if (textEl) {
      const idx = Math.floor(Math.random() * quotes.length);
      textEl.textContent = quotes[idx];
    }
  }

  // --- 12. WEAPON OF VIRTUES QUIZ ---
  function initDharmaQuiz() {
    const startView = document.getElementById("quiz-start-view");
    const questionView = document.getElementById("quiz-question-view");
    const resultView = document.getElementById("quiz-result-view");
    
    const startBtn = document.getElementById("start-quiz-btn");
    const qNumEl = document.getElementById("quiz-q-num");
    const qTextEl = document.getElementById("quiz-q-text");
    const optionsEl = document.getElementById("quiz-options-list");
    
    const resultTitleEl = document.getElementById("quiz-result-title");
    const resultDescEl = document.getElementById("quiz-result-desc");
    const resultBadgeEl = document.getElementById("quiz-result-badge");
    const downloadBtn = document.getElementById("download-cert-btn");

    if (!startBtn) return;

    const quizQuestions = [
      {
        q: "If keeping a promise demands you sacrifice comfort, what do you do?",
        options: [
          { text: "I break it; my comfort and wealth are more important.", score: { ego: 2 } },
          { text: "I try to negotiate and postpone it.", score: { loyalty: 1, dharma: 1 } },
          { text: "I keep it fully, regardless of pressure.", score: { dharma: 3 } }
        ]
      },
      {
        q: "When you see a vulnerable person treated unfairly in public, you...",
        options: [
          { text: "Fight back to defend them (like Jatayu), even if it risks my safety.", score: { valor: 3 } },
          { text: "Report it and counsel the wrongdoer calmly (like Vibhishana).", score: { dharma: 2 } },
          { text: "Ignore it; I don't want to get involved.", score: { ego: 2 } }
        ]
      },
      {
        q: "How do you honor agreements with friends who helped you in hard times?",
        options: [
          { text: "I keep my word twice over and mobilize my full support (like Sugriva).", score: { friendship: 3 } },
          { text: "I thank them but wait to see if it fits my timeline.", score: { loyalty: 1 } },
          { text: "I cut ties or ignore them once my own needs are met.", score: { ego: 3 } }
        ]
      },
      {
        q: "When you successfully complete a great task, what is your mindset?",
        options: [
          { text: "I feel proud; it was entirely due to my intelligence.", score: { ego: 3 } },
          { text: "I remain humble, dedicating the success to the team (like Hanuman).", score: { humility: 3 } },
          { text: "I am pleased but immediately look to my next duty.", score: { dharma: 2 } }
        ]
      },
      {
        q: "If your brother or relative does something wrong, what do you choose?",
        options: [
          { text: "Stand by absolute truth and guide them, even if I must walk away.", score: { dharma: 3 } },
          { text: "Protect and defend them blindly because they are kin.", score: { loyalty: 2 } },
          { text: "Stay silent to avoid family drama.", score: { ego: 1 } }
        ]
      }
    ];

    let currentQ = 0;
    let scores = { dharma: 0, valor: 0, friendship: 0, humility: 0, loyalty: 0, ego: 0 };

    startBtn.addEventListener("click", function() {
      startView.style.display = "none";
      resultView.style.display = "none";
      questionView.style.display = "flex";
      currentQ = 0;
      scores = { dharma: 0, valor: 0, friendship: 0, humility: 0, loyalty: 0, ego: 0 };
      loadQuestion();
    });

    function loadQuestion() {
      const qData = quizQuestions[currentQ];
      qNumEl.textContent = `Question ${currentQ + 1} / ${quizQuestions.length}`;
      qTextEl.textContent = qData.q;
      optionsEl.innerHTML = "";

      qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "suggested-btn";
        btn.style.width = "100%";
        btn.style.textAlign = "left";
        btn.style.padding = "0.6rem 0.85rem";
        btn.style.fontSize = "0.8rem";
        btn.textContent = opt.text;
        
        btn.addEventListener("click", () => {
          // Add scores
          for (const key in opt.score) {
            scores[key] += opt.score[key];
          }

          // Next question or result
          currentQ++;
          if (currentQ < quizQuestions.length) {
            loadQuestion();
          } else {
            showResult();
          }
          
          // play soft click sweep
          try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            const tempCtx = new AudioCtxClass();
            const osc = tempCtx.createOscillator();
            const gain = tempCtx.createGain();
            osc.frequency.setValueAtTime(500, tempCtx.currentTime);
            gain.gain.setValueAtTime(0.015, tempCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, tempCtx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(tempCtx.destination);
            osc.start();
            osc.stop(tempCtx.currentTime + 0.1);
          } catch(err) {}
        });
        optionsEl.appendChild(btn);
      });
    }

    function showResult() {
      questionView.style.display = "none";
      resultView.style.display = "flex";

      let maxKey = "dharma";
      let maxVal = -1;
      
      const checkKeys = ["dharma", "valor", "friendship", "humility", "loyalty", "ego"];
      checkKeys.forEach(k => {
        if (scores[k] > maxVal) {
          maxVal = scores[k];
          maxKey = k;
        }
      });

      let title = "";
      let desc = "";
      let badge = "";
      
      if (maxKey === "dharma") {
        title = "The Shield of Dharma (Dharmic Warrior)";
        desc = "Your responses match the noble prince Sri Rama. You place duty, vow integrity, and truth above all personal comfort and attachments.";
        badge = "🏹";
      } else if (maxKey === "valor") {
        title = "The Wings of Valor (Jatayu's Heart)";
        desc = "You possess the brave soul of Jatayu. You are willing to stand up and fight against immense injustice, even when the odds are stacked against you.";
        badge = "🦅";
      } else if (maxKey === "friendship") {
        title = "The Crown of Sugriva (Sugriva's Pact)";
        desc = "You honor friendship and alliances like King Sugriva. You carry deep gratitude and go to great lengths to return support to those who stand by you.";
        badge = "🐵";
      } else if (maxKey === "humility") {
        title = "The Devoted Gada (Hanuman's Strength)";
        desc = "You hold the selfless energy of Hanuman. Blessed with capabilities, you remain humble and direct your strength toward helping others and higher goals.";
        badge = "🐒";
      } else if (maxKey === "loyalty") {
        title = "The Shield of Lakshmana (Lakshmana's Shadow)";
        desc = "You possess the absolute loyalty of Lakshmana. You act as a solid shield and supporter for those you love, standing guard in their darkest times.";
        badge = "🛡️";
      } else {
        title = "The Seeker of Wisdom";
        desc = "Your choices show a mix of human traits. You are on a path of seeking, learning to balance temptations (the Golden Deer) with inner truth.";
        badge = "🎯";
      }

      resultTitleEl.textContent = title;
      resultDescEl.textContent = desc;
      resultBadgeEl.textContent = badge;

      // Bind certificate generation
      downloadBtn.onclick = function() {
        generateCertificate(title, desc);
      };
    }

    function generateCertificate(archetype, description) {
      const docContent = `======================================
  SRI RAMAYANA WISDOM PORTAL
  CERTIFICATE OF SPIRITUAL ARCHETYPE
======================================

This is to certify that you have undergone
the Weapon of Virtues moral archery assessment.

Your choices have revealed your character weapon:
👉 ${archetype}

Archetype Description:
"${description}"

"Ramo vigrahavan dharmah -
 Rama is the living embodiment of Righteousness."
======================================
Issued by the Valmiki AI Sage Altar
Date: ${new Date().toLocaleDateString()}
======================================`;
      
      const blob = new Blob([docContent], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `Ramayana_Archetype_Certificate.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // --- 11. VIRTUE CODEX VIEW ---
  function initCodexView() {
    const container = document.getElementById("codex-cards-container");
    if (!container) return;

    const characters = [
      {
        name: "Sri Rama",
        role: "Prince of Ayodhya & Avatar of Vishnu",
        virtue: "Dharma & Duty (Righteousness)",
        emoji: "🏹",
        symbol: "Kodanda Golden Bow",
        bio: "The embodiment of righteousness. He gladly relinquishes his crown and undergoes 14 years of harsh forest exile to uphold the truth of his father's vow.",
        moral: "Always prioritize your moral responsibilities (Dharma) and honor your promises, regardless of the personal cost."
      },
      {
        name: "Sita Devi",
        role: "Princess of Mithila & Rama's Consort",
        virtue: "Resilience & Silent Strength",
        emoji: "🌸",
        symbol: "Lotus Blossom",
        bio: "The definition of loyalty and grace. She accompanies Rama into exile and maintains absolute spiritual strength and dignity during her captivity in Lanka.",
        moral: "Cultivate inner composure, faith, and patience. True strength lies in silent resilience when facing trials."
      },
      {
        name: "Hanuman",
        role: "Monkey Commander of Kishkindha",
        virtue: "Selfless Devotion & Humility",
        emoji: "🐒",
        symbol: "Golden Mace (Gada)",
        bio: "Gifted with wind-like speed, strength, and shape-shifting. He dedicates his colossal powers entirely to Rama without demanding any reward.",
        moral: "Use your powers, wealth, and skills to serve others. True greatness is reached when you combine strength with deep humility."
      },
      {
        name: "Lakshmana",
        role: "Prince of Ayodhya & Loyal Brother",
        virtue: "Unconditional Loyalty & Service",
        emoji: "🛡️",
        symbol: "Divine Arrow & Shield",
        bio: "Rama's shadow. He leaves behind royal comforts to guard Rama and Sita in the forests, staying awake for nights to protect them from harm.",
        moral: "Stand firmly by the side of those you love. Acting as a shield in their times of adversity is the highest form of loyalty."
      },
      {
        name: "Ravana",
        role: "Ten-Headed King of Lanka",
        virtue: "Warning: Ego & Unchecked Greed",
        emoji: "👹",
        symbol: "Ten Heads (Lust & Pride)",
        bio: "A brilliant scholar, veena player, and powerful warrior. Yet, his vanity, uncontrolled desires, and arrogance lead to the total ruin of his golden empire.",
        moral: "Arrogance and ego are fires that burn intellect. No amount of talent or wealth can save an individual blinded by pride."
      },
      {
        name: "Jatayu",
        role: "Noble Vulture King",
        virtue: "Valor & Moral Courage",
        emoji: "🦅",
        symbol: "Eagle Wings",
        bio: "An old king of birds who witnesses Sita being kidnapped. Despite knowing his age makes him no match for Ravana, he fights fiercely to defend her.",
        moral: "Stand up against injustice even when victory seems impossible. Fighting for what is right is a victory in itself."
      },
      {
        name: "Vibhishana",
        role: "Righteous Brother of Ravana",
        virtue: "Truth Over Blind Kinship",
        emoji: "👑",
        symbol: "Scepter of Justice",
        bio: "Tries repeatedly to guide Ravana. When exiled for his advice, he joins Rama, prioritizing righteousness (Dharma) over national or family loyalty.",
        moral: "Truth must transcend blind biological bonds. Follow righteousness even if it forces you to stand alone."
      },
      {
        name: "Sugriva",
        role: "King of the Vanara Army",
        virtue: "Friendship & Pact-keeping",
        emoji: "🐵",
        symbol: "Vanara Crown",
        bio: "Helped by Rama to regain his throne. He honors this pact by mobilizing his entire kingdom to build the bridge and locate Sita.",
        moral: "Never forget help received in your lowest moments. Honor your commitments and covenants with gratitude."
      },
      {
        name: "King Dasaratha",
        role: "Emperor of Ayodhya & Rama's Father",
        virtue: "Integrity of Word (Pratigya)",
        emoji: "👴",
        symbol: "Ayodhya Throne",
        bio: "Forced to exile his most beloved son Rama because of a binding promise made to Queen Kaikeyi, dying of a broken heart soon after.",
        moral: "Keep your word, for trust is the foundation of civilization. A promise made must be a promise kept, no matter how painful."
      }
    ];

    container.innerHTML = "";
    characters.forEach(char => {
      const card = document.createElement("div");
      card.className = "codex-card";
      
      card.innerHTML = `
        <div class="codex-card-inner">
          <!-- Front Face -->
          <div class="codex-card-front">
            <span class="codex-virtue-tag">${char.virtue}</span>
            <div class="codex-emoji-badge">${char.emoji}</div>
            <div>
              <h4 class="title-font" style="color: var(--primary-saffron); font-size: 1.25rem; margin: 0 0 0.25rem 0;">${char.name}</h4>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0; font-style: italic;">${char.role}</p>
            </div>
            <span style="font-size: 0.75rem; color: var(--gold-glow); font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Click to flip 🔄</span>
          </div>
          <!-- Back Face -->
          <div class="codex-card-back">
            <div>
              <h4 class="title-font" style="color: var(--gold-glow); font-size: 1.15rem; margin: 0 0 0.5rem 0;">${char.name}'s Wisdom</h4>
              <p style="font-size: 0.75rem; line-height: 1.4; color: #cbd5e1; text-align: justify; margin: 0 0 0.75rem 0;">${char.bio}</p>
              <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem;">
                <strong style="font-size: 0.75rem; color: var(--primary-saffron); text-transform: uppercase;">🌱 Modern Lesson:</strong>
                <p style="font-size: 0.75rem; line-height: 1.4; color: #f8fafc; margin: 0.25rem 0 0 0; text-align: justify;">${char.moral}</p>
              </div>
            </div>
            <span style="font-size: 0.7rem; color: var(--text-muted); font-style: italic;">Symbol: ${char.symbol}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", function() {
        this.classList.toggle("flipped");
        // play soft click sweep
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          const tempCtx = new AudioCtxClass();
          const osc = tempCtx.createOscillator();
          const gain = tempCtx.createGain();
          osc.frequency.setValueAtTime(450, tempCtx.currentTime);
          gain.gain.setValueAtTime(0.015, tempCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, tempCtx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(tempCtx.destination);
          osc.start();
          osc.stop(tempCtx.currentTime + 0.1);
        } catch(err) {}
      });

      container.appendChild(card);
    });
  }

  // --- 13. AYODHYA DIWALI CELEBRATION ENGINE ---
  let diwaliLoopActive = false;
  function triggerDiwaliCelebration() {
    const overlay = document.getElementById("diwali-celebration-overlay");
    const canvas = document.getElementById("diwali-canvas");
    const closeBtn = document.getElementById("close-diwali-btn");

    if (!overlay || !canvas || !closeBtn) return;

    overlay.style.display = "flex";
    diwaliLoopActive = true;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resizeHandler = function() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeHandler);

    let fireworks = [];
    let diyas = [];

    // Initialize 8 clay lamps (diyas) at the bottom
    const diyaCount = 8;
    const spacing = width / (diyaCount + 1);
    for (let i = 0; i < diyaCount; i++) {
      diyas.push({
        x: spacing * (i + 1),
        y: height - 40,
        flameSize: 8 + Math.random() * 4
      });
    }

    // Play initial double chimes
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const tCtx = new AudioCtxClass();
      const playTone = (freq, delay) => {
        setTimeout(() => {
          const osc = tCtx.createOscillator();
          const gain = tCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, tCtx.currentTime);
          gain.gain.setValueAtTime(0, tCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, tCtx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, tCtx.currentTime + 1.5);
          osc.connect(gain);
          gain.connect(tCtx.destination);
          osc.start();
          osc.stop(tCtx.currentTime + 1.6);
        }, delay);
      };
      playTone(523.25, 0);   // C5
      playTone(659.25, 180); // E5
      playTone(783.99, 360); // G5
      playTone(1046.50, 540); // C6
    } catch(err) {}

    // Click handler for fireworks
    canvas.onclick = function(e) {
      launchFirework(e.clientX, e.clientY);
    };

    function launchFirework(targetX, targetY) {
      // Sound beep
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        const tCtx = new AudioCtxClass();
        const osc = tCtx.createOscillator();
        const gain = tCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(250, tCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, tCtx.currentTime + 0.15); // rising whistle
        gain.gain.setValueAtTime(0.02, tCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, tCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(tCtx.destination);
        osc.start();
        osc.stop(tCtx.currentTime + 0.22);
      } catch(e) {}

      // Create burst particles after 150ms
      setTimeout(() => {
        // burst sound beep
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          const tCtx = new AudioCtxClass();
          const osc = tCtx.createOscillator();
          const gain = tCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(550 + Math.random() * 300, tCtx.currentTime);
          gain.gain.setValueAtTime(0.03, tCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, tCtx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(tCtx.destination);
          osc.start();
          osc.stop(tCtx.currentTime + 0.65);
        } catch(e) {}

        const colors = ["#ffd700", "#ff5500", "#ff007f", "#3b82f6", "#86efac"];
        const randColor = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.5 + 1.8;
          fireworks.push({
            x: targetX,
            y: targetY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 2.5 + 1,
            color: randColor,
            life: 1.0,
            decay: 0.025 + Math.random() * 0.02
          });
        }
      }, 150);
    }

    closeBtn.onclick = function() {
      diwaliLoopActive = false;
      window.removeEventListener("resize", resizeHandler);
      overlay.style.display = "none";
    };

    function updateDrawLoop() {
      if (!diwaliLoopActive) return;

      // Draw background
      ctx.fillStyle = "rgba(8, 10, 24, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Auto-spawn fireworks occasionally
      if (Math.random() < 0.012) {
        launchFirework(Math.random() * width, Math.random() * (height - 250) + 80);
      }

      // Draw diyas (clay lamps) at the bottom
      diyas.forEach(diya => {
        diya.flameSize = 8 + Math.sin(Date.now() * 0.018 + diya.x) * 2;
        
        // Clay lamp base
        ctx.fillStyle = "#78350f"; // brown
        ctx.beginPath();
        ctx.arc(diya.x, diya.y, 14, 0, Math.PI);
        ctx.closePath();
        ctx.fill();

        // Flame glow
        ctx.fillStyle = "rgba(255, 140, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(diya.x, diya.y - 4, diya.flameSize + 6, 0, Math.PI * 2);
        ctx.fill();

        // Flame core
        const flameGrad = ctx.createRadialGradient(diya.x, diya.y - 4, 1, diya.x, diya.y - 4, diya.flameSize);
        flameGrad.addColorStop(0, "#ffffff");
        flameGrad.addColorStop(0.3, "#ffbf00");
        flameGrad.addColorStop(1, "#ff3c00");
        ctx.fillStyle = flameGrad;
        
        ctx.beginPath();
        ctx.moveTo(diya.x - 5, diya.y - 4);
        ctx.quadraticCurveTo(diya.x, diya.y - 4 - diya.flameSize * 1.5, diya.x, diya.y - 4 - diya.flameSize * 2.2);
        ctx.quadraticCurveTo(diya.x, diya.y - 4 - diya.flameSize * 1.5, diya.x + 5, diya.y - 4);
        ctx.closePath();
        ctx.fill();
      });

      // Update and draw fireworks particles
      fireworks.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035; // gravity drift
        p.life -= p.decay;

        if (p.life <= 0) {
          fireworks.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(updateDrawLoop);
    }

    requestAnimationFrame(updateDrawLoop);
  }

  // --- 14. SESSION TIMER & ALTAR LOGIN MANAGER ---
  function initSessionTimer() {
    const overlay = document.getElementById("login-modal-overlay");
    const skipBtn = document.getElementById("skip-login-btn");
    const loginForm = document.getElementById("altar-login-form");
    const usernameInput = document.getElementById("login-username");
    const userBadge = document.getElementById("altar-user-badge");

    if (!overlay) return;

    // Check if user is already logged in
    const savedUser = localStorage.getItem("ramayana_altar_username");
    if (savedUser) {
      displayUserBadge(savedUser);
    } else {
      // Check if they skipped or are a guest in this tab session
      const hasSkipped = sessionStorage.getItem("ramayana_altar_skipped");
      if (!hasSkipped) {
        // Start 5-minute timer (300 seconds)
        setTimeout(function() {
          const logged = localStorage.getItem("ramayana_altar_username");
          const skipped = sessionStorage.getItem("ramayana_altar_skipped");
          if (!logged && !skipped) {
            overlay.style.display = "flex";
            // play double chimes alert
            try {
              const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
              const tCtx = new AudioCtxClass();
              const osc = tCtx.createOscillator();
              const gain = tCtx.createGain();
              osc.frequency.setValueAtTime(600, tCtx.currentTime);
              gain.gain.setValueAtTime(0.015, tCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, tCtx.currentTime + 0.15);
              osc.connect(gain);
              gain.connect(tCtx.destination);
              osc.start();
              osc.stop(tCtx.currentTime + 0.16);
            } catch(e) {}
          }
        }, 300000); // 300,000 milliseconds = 5 minutes
      }
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", function() {
        sessionStorage.setItem("ramayana_altar_skipped", "true");
        overlay.style.display = "none";
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
          localStorage.setItem("ramayana_altar_username", username);
          displayUserBadge(username);
          overlay.style.display = "none";
          alert(`Welcome to your Dharma Altar, ${username}! Your reflections are now saved under your spiritual altar.`);
          
          // play positive chime chord
          try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            const tCtx = new AudioCtxClass();
            const playChime = (f, d) => {
              setTimeout(() => {
                const osc = tCtx.createOscillator();
                const gain = tCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(f, tCtx.currentTime);
                gain.gain.setValueAtTime(0, tCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.06, tCtx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, tCtx.currentTime + 0.5);
                osc.connect(gain);
                gain.connect(tCtx.destination);
                osc.start();
                osc.stop(tCtx.currentTime + 0.6);
              }, d);
            };
            playChime(523.25, 0);
            playChime(659.25, 100);
            playChime(783.99, 200);
          } catch(err) {}
        }
      });
    }

    function displayUserBadge(name) {
      if (userBadge) {
        userBadge.textContent = `Altar: ${name}`;
        userBadge.style.display = "inline-block";
      }
    }
  }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
