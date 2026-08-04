// Ramayana Web Audio Synthesizer & Soundscape Engine
window.RamayanaSynth = (function() {
  let audioCtx = null;
  let tanpuraInterval = null;
  let fluteInterval = null;
  
  // Nodes
  let masterGain = null;
  let tanpuraGain = null;
  let fluteGain = null;
  let delayNode = null;
  let delayGain = null;

  // Active sources
  let activeOscillators = [];
  let isMuted = false;
  let isTanpuraRunning = false;
  let isFluteRunning = false;

  // Indian Classical Scale: Raga Bhupali (C major pentatonic scale)
  // Base frequency: C4 (261.63 Hz)
  const baseFreq = 261.63;
  const ragaBhupaliNotes = [
    1.0,      // Sa (C4)
    1.125,    // Re (D4)
    1.25,     // Ga (E4)
    1.5,      // Pa (G4)
    1.6875,   // Dha (A4)
    2.0,      // Sa (C5)
    2.25,     // Re (D5)
    2.5       // Ga (E5)
  ];
  
  let currentFluteNoteIndex = 0;
  let lastFluteFreq = baseFreq;

  function init() {
    if (audioCtx) return;
    
    // Create Audio Context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Master volume control
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
    
    // Tanpura sub-mix
    tanpuraGain = audioCtx.createGain();
    tanpuraGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    tanpuraGain.connect(masterGain);
    
    // Flute sub-mix
    fluteGain = audioCtx.createGain();
    fluteGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    fluteGain.connect(masterGain);

    // Create a space echo delay for the flute
    delayNode = audioCtx.createDelay(2.0);
    delayNode.delayTime.setValueAtTime(0.6, audioCtx.currentTime);
    
    delayGain = audioCtx.createGain();
    delayGain.gain.setValueAtTime(0.4, audioCtx.currentTime); // feedback volume
    
    // Flute -> Delay -> DelayGain -> Master
    // DelayGain -> Delay (feedback loop)
    fluteGain.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(masterGain);
    delayGain.connect(delayNode); // feedback loop
  }

  // --- TANPURA SYNTHESIS (Indian String Drone) ---
  // A Tanpura plucks 4 strings in a rhythmic cycle (usually Pa - Sa - Sa - Sa)
  function pluckTanpuraString(stringNum, pitchFactor) {
    if (!audioCtx || isMuted) return;
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const subOsc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Base pitch for Tanpura drone: C3 (130.81 Hz)
    const fundamental = 130.81 * pitchFactor;
    
    // Triangle wave gives a hollow string-like timbre
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(fundamental, now);
    
    // Add subtle detuned saw-tooth node for rich string harmonics
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(fundamental + 0.8, now);
    
    // Simple pluck envelope: sudden attack, long decay
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(stringNum === 0 ? 0.35 : 0.25, now + 0.05); // Pa is slightly louder
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
    
    // Lowpass filter to soften the harshness of the sawtooth wave
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(stringNum === 0 ? 550 : 450, now);
    
    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(tanpuraGain);
    
    osc.start(now);
    subOsc.start(now);
    
    // Clean up nodes after string ring-out
    osc.stop(now + 5.0);
    subOsc.stop(now + 5.0);
  }

  function startTanpura() {
    init();
    if (isTanpuraRunning) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    isTanpuraRunning = true;
    let stringIndex = 0;
    
    // Drone cycle: 
    // String 0: Pa (G3) -> factor 1.5
    // String 1: Sa (C4) -> factor 2.0 (higher octave)
    // String 2: Sa (C4) -> factor 2.0 (higher octave)
    // String 3: Sa (C3) -> factor 1.0 (fundamental)
    const pitches = [1.5, 2.0, 2.0, 1.0];
    
    function triggerNextPluck() {
      if (!isTanpuraRunning) return;
      pluckTanpuraString(stringIndex, pitches[stringIndex]);
      stringIndex = (stringIndex + 1) % 4;
    }
    
    triggerNextPluck();
    // Pluck a string every 1.25 seconds
    tanpuraInterval = setInterval(triggerNextPluck, 1250);
  }

  function stopTanpura() {
    isTanpuraRunning = false;
    if (tanpuraInterval) {
      clearInterval(tanpuraInterval);
      tanpuraInterval = null;
    }
  }

  // --- BANSURI FLUTE SYNTHESIS ---
  // Procedural melody generation using a triangle oscillator with lowpass filtering and vibrato.
  function playFluteNote(frequency, duration) {
    if (!audioCtx || isMuted) return;
    
    const now = audioCtx.currentTime;
    
    // Principal sound oscillator
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    
    // Indian flute slides between notes (Meend)
    osc.frequency.setValueAtTime(lastFluteFreq, now);
    osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.3); // 300ms slide time
    lastFluteFreq = frequency;
    
    // Add custom Vibrato (LFO)
    const vibrato = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibrato.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
    vibratoGain.gain.setValueAtTime(frequency * 0.015, now); // Vibrato depth (1.5% of pitch)
    
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(now);
    
    // Breath noise simulation using a bandpass filter over white noise
    const noiseNode = createBreathNoise();
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.0, now);
    
    // Envelope for notes: soft attack and slow decay release
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.25); // Soft attack
    gainNode.gain.setValueAtTime(0.4, now + duration - 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    if (noiseNode) {
      noiseGain.gain.setValueAtTime(0.0, now);
      noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.1);
      noiseNode.connect(noiseGain);
      noiseGain.connect(gainNode);
    }
    
    // Warm lowpass filter to emulate the bamboo chamber
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(fluteGain);
    
    osc.start(now);
    
    // Clean up
    osc.stop(now + duration);
    vibrato.stop(now + duration);
    if (noiseNode) {
      try { noiseNode.stop(now + duration); } catch (e) {}
    }
  }

  // Generates white noise for breath sounds
  function createBreathNoise() {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 2.0; // 2 seconds buffer
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    // Bandpass filter to make noise sound like wind blowing through bamboo
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.0, audioCtx.currentTime);
    
    noise.connect(filter);
    return noise;
  }

  function startFluteMelody() {
    init();
    if (isFluteRunning) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    isFluteRunning = true;
    
    function playRandomRagaPhrase() {
      if (!isFluteRunning) return;
      
      // Decides next note based on Markov-like stepping (moving up, down, or repeating)
      const decision = Math.random();
      if (decision < 0.4) {
        // Move one step up or down
        const step = Math.random() > 0.5 ? 1 : -1;
        currentFluteNoteIndex = (currentFluteNoteIndex + step + ragaBhupaliNotes.length) % ragaBhupaliNotes.length;
      } else if (decision < 0.7) {
        // Jump to a random note in the raga
        currentFluteNoteIndex = Math.floor(Math.random() * ragaBhupaliNotes.length);
      } // otherwise repeat the current note
      
      const factor = ragaBhupaliNotes[currentFluteNoteIndex];
      const pitch = baseFreq * factor;
      
      // Notes range from 1.5 to 3.0 seconds
      const noteLength = 1.5 + Math.random() * 1.5;
      playFluteNote(pitch, noteLength);
      
      // Schedule next note with a small gap (0.2s to 1s of silence/breath)
      const pause = 200 + Math.random() * 800;
      fluteInterval = setTimeout(playRandomRagaPhrase, (noteLength * 1000) + pause);
    }
    
    playRandomRagaPhrase();
  }

  function stopFluteMelody() {
    isFluteRunning = false;
    if (fluteInterval) {
      clearTimeout(fluteInterval);
      fluteInterval = null;
    }
  }

  // --- AUDIO CONTROLLER UTILS ---
  function toggleAmbientSound() {
    init();
    if (isTanpuraRunning || isFluteRunning) {
      stopTanpura();
      stopFluteMelody();
      return false;
    } else {
      startTanpura();
      startFluteMelody();
      return true;
    }
  }

  function setVolume(type, value) {
    init();
    // value expected between 0 and 1
    if (type === 'master' && masterGain) {
      masterGain.gain.setValueAtTime(value, audioCtx.currentTime);
    } else if (type === 'tanpura' && tanpuraGain) {
      tanpuraGain.gain.setValueAtTime(value * 0.5, audioCtx.currentTime);
    } else if (type === 'flute' && fluteGain) {
      fluteGain.gain.setValueAtTime(value * 0.4, audioCtx.currentTime);
    }
  }

  // Text-To-Speech Chanting voice engine
  function speakSloka(sanskritText, englishTranslation) {
    if ('speechSynthesis' in window) {
      // Cancel active speech
      window.speechSynthesis.cancel();
      
      // Speak Sanskrit text
      const chantUtterance = new SpeechSynthesisUtterance(sanskritText);
      chantUtterance.rate = 0.75; // Slower chanting speed
      chantUtterance.pitch = 0.85; // Deeper spiritual tone
      
      // Look for a suitable Hindi/Sanskrit voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
      if (hindiVoice) {
        chantUtterance.voice = hindiVoice;
      }
      
      // Speak translation after a short pause
      chantUtterance.onend = function() {
        const transUtterance = new SpeechSynthesisUtterance(englishTranslation);
        transUtterance.rate = 0.9;
        transUtterance.pitch = 1.0;
        window.speechSynthesis.speak(transUtterance);
      };
      
      window.speechSynthesis.speak(chantUtterance);
    } else {
      alert("Text-to-Speech is not supported in this browser. Please copy and read the verses.");
    }
  }

  function stopChanting() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- AMBIENT CHANT LAYERING ---
  let bellInterval = null;
  let isBellRunning = false;
  let bellGain = null;

  function initBells() {
    if (bellGain) return;
    bellGain = audioCtx.createGain();
    bellGain.gain.setValueAtTime(0.06, audioCtx.currentTime); // soft bell sound
    bellGain.connect(masterGain);
  }

  function startBells() {
    init();
    initBells();
    if (isBellRunning) return;
    isBellRunning = true;

    function playBellChime() {
      if (!isBellRunning) return;
      const now = audioCtx.currentTime;
      // High-pitched chime chord: E5, G5, C6 detuned
      const frequencies = [659.25, 783.99, 1046.50];
      frequencies.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + (idx * 2.5), now);
        
        // Bell envelope: instant rise, exponential decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        osc.connect(gainNode);
        gainNode.connect(bellGain);
        
        osc.start(now);
        osc.stop(now + 1.5);
      });
    }

    playBellChime();
    bellInterval = setInterval(playBellChime, 3750); // every 3 plucks of Tanpura
  }

  function stopBells() {
    isBellRunning = false;
    if (bellInterval) {
      clearInterval(bellInterval);
      bellInterval = null;
    }
  }

  function toggleBells() {
    if (isBellRunning) {
      stopBells();
      return false;
    } else {
      startBells();
      return true;
    }
  }

  // SARAYU RIVER WAVES GENERATOR
  let waveNoiseNode = null;
  let waveModulator = null;
  let waveGain = null;
  let isWaveRunning = false;

  function startWaves() {
    init();
    if (isWaveRunning) return;
    isWaveRunning = true;

    // Create White Noise Buffer for waves
    const bufferSize = audioCtx.sampleRate * 4.0; // 4 seconds of loopable noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    waveNoiseNode = audioCtx.createBufferSource();
    waveNoiseNode.buffer = buffer;
    waveNoiseNode.loop = true;

    // Lowpass filter to convert white noise to deep rumble/waves
    const waveFilter = audioCtx.createBiquadFilter();
    waveFilter.type = "lowpass";
    waveFilter.frequency.setValueAtTime(250, audioCtx.currentTime); // deep rumble

    // Gain node for waves
    waveGain = audioCtx.createGain();
    waveGain.gain.setValueAtTime(0.02, audioCtx.currentTime); // base level

    // LFO modulator to simulate waves washing in and out
    waveModulator = audioCtx.createOscillator();
    waveModulator.type = "sine";
    waveModulator.frequency.setValueAtTime(0.12, audioCtx.currentTime); // 8-second wave cycle

    // Modulate waveGain.gain between 0.01 and 0.06
    const waveGainLfoDepth = audioCtx.createGain();
    waveGainLfoDepth.gain.setValueAtTime(0.04, audioCtx.currentTime);

    waveModulator.connect(waveGainLfoDepth);
    waveGainLfoDepth.connect(waveGain.gain); // modulates the volume dynamically!

    // Connections
    waveNoiseNode.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(masterGain);

    // Start nodes
    waveNoiseNode.start(0);
    waveModulator.start(0);
  }

  function stopWaves() {
    isWaveRunning = false;
    if (waveNoiseNode) {
      try { waveNoiseNode.stop(); } catch(e) {}
      waveNoiseNode = null;
    }
    if (waveModulator) {
      try { waveModulator.stop(); } catch(e) {}
      waveModulator = null;
    }
    waveGain = null;
  }

  function toggleWaves() {
    if (isWaveRunning) {
      stopWaves();
      return false;
    } else {
      startWaves();
      return true;
    }
  }

  function playPluck(noteIndex = 0) {
    if (!audioCtx) {
      init();
    }
    if (!audioCtx || isMuted) return;
    
    // Resume context if suspended (browser security)
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    // Raga scale note
    const factor = ragaBhupaliNotes[noteIndex % ragaBhupaliNotes.length];
    const freq = baseFreq * factor * 1.5; // octave shift for high sweet string plucks
    
    // Create oscillator
    const osc = audioCtx.createOscillator();
    const subOsc = audioCtx.createOscillator(); // add subharmonic for string body resonance
    const pluckGain = audioCtx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    // Add rapid buzz modulation
    osc.frequency.setValueAtTime(freq + 5, now + 0.02);
    osc.frequency.linearRampToValueAtTime(freq, now + 0.08);

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(freq * 0.5, now);
    
    pluckGain.gain.setValueAtTime(0, now);
    pluckGain.gain.linearRampToValueAtTime(0.08, now + 0.008); // rapid pluck transient
    pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8); // slow string ring decay
    
    osc.connect(pluckGain);
    subOsc.connect(pluckGain);
    pluckGain.connect(masterGain);
    
    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.85);
    subOsc.stop(now + 0.85);
  }

  return {
    init: init,
    startTanpura: startTanpura,
    stopTanpura: stopTanpura,
    startFluteMelody: startFluteMelody,
    stopFluteMelody: stopFluteMelody,
    toggleAmbientSound: toggleAmbientSound,
    toggleBells: toggleBells,
    toggleWaves: toggleWaves,
    isBellRunning: function() { return isBellRunning; },
    isWaveRunning: function() { return isWaveRunning; },
    setVolume: setVolume,
    speakSloka: speakSloka,
    stopChanting: stopChanting,
    playPluck: playPluck,
    isAmbientRunning: function() { return isTanpuraRunning || isFluteRunning; }
  };
})();
