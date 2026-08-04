// Dharma Reflection Journal & Virtues Engine
window.DharmaJournal = (function() {
  
  // Base configuration of virtues associated with Kandas
  const kandaVirtueMapping = {
    bala: { virtue: "discipline", label: "Discipline & Respect", weight: 1.0 },
    ayodhya: { virtue: "duty", label: "Duty & Acceptance", weight: 1.2 },
    aranya: { virtue: "detachment", label: "Resisting Temptation", weight: 1.0 },
    kishkindha: { virtue: "loyalty", label: "Loyal Friendship", weight: 1.1 },
    sundara: { virtue: "faith", label: "Faith & Action", weight: 1.3 },
    yuddha: { virtue: "righteousness", label: "Justice & Teamwork", weight: 1.4 },
    uttara: { virtue: "leadership", label: "Sacrifice & Legacy", weight: 1.0 }
  };

  const STORAGE_KEY = "ramayana_journal_reflections";

  // Load reflections from localStorage
  function loadEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error("Failed to load journal entries:", e);
      return {};
    }
  }

  // Save reflection entry
  function saveEntry(kandaId, promptIndex, text, selfRating) {
    const entries = loadEntries();
    
    if (!entries[kandaId]) {
      entries[kandaId] = {};
    }
    
    entries[kandaId][promptIndex] = {
      text: text,
      rating: parseFloat(selfRating) || 3, // Rating between 1 and 5
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      // Dispatch custom event to refresh UI components
      window.dispatchEvent(new Event('dharma-journal-updated'));
      return true;
    } catch (e) {
      console.error("Failed to save journal entry:", e);
      return false;
    }
  }

  // Calculate scores (1-100) for each virtue
  function getVirtueScores() {
    const entries = loadEntries();
    const scores = {
      discipline: 30, // Base starting value representing 'good'
      duty: 30,
      detachment: 30,
      loyalty: 30,
      faith: 30,
      righteousness: 30,
      leadership: 30
    };

    // Calculate score based on user reflections and self-ratings
    for (const kandaId in kandaVirtueMapping) {
      const mapping = kandaVirtueMapping[kandaId];
      const virtue = mapping.virtue;
      
      if (entries[kandaId]) {
        let kandaSum = 0;
        let kandaCount = 0;
        
        for (const promptIdx in entries[kandaId]) {
          const item = entries[kandaId][promptIdx];
          if (item && item.text.trim().length > 10) { // must have written a genuine reflection
            kandaSum += item.rating;
            kandaCount++;
          }
        }
        
        if (kandaCount > 0) {
          const avgRating = kandaSum / kandaCount;
          // Map a 1-5 rating into a progress score
          // If they complete it, we add a base boost + rating contribution
          const completedBoost = 30; // base points for completing the exercise
          const ratingContribution = (avgRating / 5) * 40; // up to 40 points based on their self-assessed virtue alignment
          
          scores[virtue] = Math.min(100, Math.round(30 + completedBoost + ratingContribution));
        }
      }
    }

    return scores;
  }

  // Clear journal
  function resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('dharma-journal-updated'));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Export report as plain text markdown
  function generateReportText() {
    const entries = loadEntries();
    const scores = getVirtueScores();
    let md = `# Path of Dharma - Spiritual Reflection Report\n`;
    md += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    md += `Below is a record of your self-reflection journey based on the teachings of Sri Rama.\n\n`;
    
    md += `## Virtue Alignment Scores\n`;
    for (const key in kandaVirtueMapping) {
      const mapping = kandaVirtueMapping[key];
      md += `- **${mapping.label}** (${mapping.code || mapping.virtue}): ${scores[mapping.virtue]} / 100\n`;
    }
    md += `\n`;
    
    md += `## Journal Reflections\n\n`;
    let hasReflections = false;
    
    window.RamayanaJourney.forEach(kanda => {
      const kandaEntries = entries[kanda.id];
      if (kandaEntries) {
        let hasKandaEntries = false;
        let tempMd = `### ${kanda.name} (${kanda.title})\n`;
        
        kanda.moral.prompts.forEach((prompt, index) => {
          if (kandaEntries[index]) {
            hasKandaEntries = true;
            hasReflections = true;
            const entry = kandaEntries[index];
            tempMd += `**Reflection Prompt ${index + 1}:** *${prompt}*\n`;
            tempMd += `**Self-Alignment Rating:** ${entry.rating}/5\n`;
            tempMd += `**Your Entry:**\n> ${entry.text}\n\n`;
          }
        });
        
        if (hasKandaEntries) {
          md += tempMd + `\n`;
        }
      }
    });

    if (!hasReflections) {
      md += `*No reflections have been completed yet. Continue your journey with Sri Rama and write reflections to generate your report!*`;
    }

    return md;
  }

  return {
    save: saveEntry,
    load: loadEntries,
    getScores: getVirtueScores,
    reset: resetAll,
    exportMarkdown: generateReportText,
    getMapping: function() { return kandaVirtueMapping; }
  };
})();
