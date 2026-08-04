// AI Sage Valmiki Chatbot Engine
window.ValmikiAI = (function() {
  
  // Custom response database for offline mode
  const localKnowledgeBase = {
    dharma: {
      tags: ["dharma", "righteousness", "duty", "virtue", "goodness"],
      title: "The Path of Dharma",
      response: "My child, Dharma is the foundational pillar of the cosmos. In the Ramayana, Sri Rama embodies 'Maryada Purushottama'—the supreme man of boundaries and duty. Dharma is not always simple; it is the path of sacrifice. Rama sacrificed his throne for his father's honor. Lakshmana sacrificed comfort to protect his brother. Sita chose the forest over royal palaces. Remember, when you are faced with a choice between short-term pleasure and long-term duty, choosing duty is the true path of Dharma that elevates you from good to great."
    },
    sita: {
      tags: ["sita", "janaki", "devi", "wife", "vaidehi"],
      title: "Sita Devi - The Embodiment of Resilience",
      response: "Sita is not merely a princess in distress; she is the core strength (Shakti) of the Ramayana. Born of the Earth, she demonstrates supreme patience, absolute purity, and unshakeable courage. In Ashoka Vatika, surrounded by terrifying demons, she rejected all of Ravana's golden treasures and stayed loyal to her virtues, protected only by a single blade of grass. She teaches us that internal strength and integrity are far superior to any external wealth or hostile environment."
    },
    ravana: {
      tags: ["ravana", "lanka", "demon", "king", "ego", "arrogance", "pride"],
      title: "Ravana - The Tragedy of Uncontrolled Ego",
      response: "Ravana was a master of ten sciences (symbolized by his ten heads), a great musician, a scholar of the Vedas, and a powerful king. Yet, he is the antagonist. Why? Because all his immense knowledge and strength were consumed by his uncontrolled ego, lust, and arrogance. He represents the danger of intellect without character. When ego rules, even the greatest of kingdoms (the golden Lanka) falls into ruin. Master your desires, or they will master you."
    },
    hanuman: {
      tags: ["hanuman", "bajrangbali", "maruti", "anjaneya", "devotion", "strength"],
      title: "Hanuman - The Master of Devotion and Humility",
      response: "Hanuman is the synthesis of three great paths: Bhakti (devotion), Gnana (wisdom), and Karma (action). Although he possessed the power to fly, lift mountains, and change shapes, he introduced himself simply as: 'Dāsoham Kosalendrasya' (I am the servant of Sri Rama). His humility was his greatest ornament. He teaches us that when we align our talents and strength with a noble, selfless cause, we discover latent powers within ourselves that can cross oceans."
    },
    lakshmana: {
      tags: ["lakshmana", "brother", "loyalty", "vigilance", "anger"],
      title: "Lakshmana - Unwavering Loyalty and Vigilance",
      response: "Lakshmana represents the active, protective principle. For fourteen years in the forest, he gave up sleep to guard Rama and Sita, conquering physical desires. While his fierce loyalty is legendary, his quick temper sometimes required Rama's calm intervention. Lakshmana teaches us the beauty of selfless brotherhood and how to channel our intense energy and anger into constructive protection of what is righteous."
    },
    deer: {
      tags: ["deer", "golden", "maricha", "illusion", "temptation", "maya"],
      title: "The Golden Deer - The Illusion of Maya",
      response: "The golden deer (Maricha) represents the sensory illusions of this world (Maya). It looked beautiful, golden, and harmless, yet it was a trap that drew Sri Rama away and led to Sita's abduction. In our modern lives, we are surrounded by 'golden deers'—false advertisements, greed, superficial trends, and short-term distractions. Always look beyond the shiny surface; do not let momentary illusions drive you away from your true goals."
    },
    dhanush: {
      tags: ["dhanush", "bow", "shiva", "mithila", "breaking"],
      title: "The Shiva Dhanush - Breaking the Ego",
      response: "The heavy bow of Lord Shiva in Mithila could not be lifted by kings of immense muscle and pride. Sri Rama, with deep humility and focus, lifted it with ease and strung it, breaking it in the process. The Shiva Dhanush represents the heavy burden of worldly pride and ego. Only a mind that is humble, pure, and aligned with the divine can lift and break this ego, paving the way to unite with the supreme soul (represented by Rama's marriage to Sita)."
    },
    bridge: {
      tags: ["bridge", "setu", "ram setu", "ocean", "stones", "squirrel"],
      title: "Ram Setu - The Power of Unity and Tiny Efforts",
      response: "To cross the ocean to Lanka, the monkey army threw heavy stones, which floated because they were inscribed with the name of Rama. Even a tiny squirrel contributed by rolling in the sand and shaking it onto the bridge. Rama blessed the squirrel, showing that no effort in a good cause is too small. Ram Setu teaches us that massive obstacles can be bridged through teamwork, faith, and acknowledging every contribution, no matter how small."
    },
    exile: {
      tags: ["exile", "forest", "vanavas", "forest life", "comfort"],
      title: "The Forest Exile - Stepping Out of Comfort Zones",
      response: "Rama's exile (Vanavas) turned a royal prince into an ascetic. But it was in the forest that he met sages, protected the oppressed, gathered his army, and fulfilled his life's mission of defeating Ravana. Had he stayed in Ayodhya, he would have been a great king, but not the universal symbol of Dharma. Do not fear difficult phases or exiles in your life. Your periods of struggle are often the crucibles that refine your character and shape your true greatness."
    },
    valmiki: {
      tags: ["valmiki", "author", "sage", "writer", "ratnakar", "transformation"],
      title: "Valmiki - The Power of Transformation",
      response: "Before I became a Rishi, I was Ratnakar, a robber who brought harm to others to support my family. Through the grace of Sage Narada and chanting the name of Rama (even starting backward as 'Mara'), my mind was purified, and I transformed into Valmiki, the poet of the Ramayana. This teaches you that no matter your past mistakes, you possess the capacity to change. Transformation is always possible when you dedicate your heart to truth and constants."
    },
    moral: {
      tags: ["moral", "life lesson", "habit", "become great", "growth"],
      title: "Becoming Good to Great",
      response: "To rise from good to great, adopt the core virtues of Ramayana: 1. Keep your promises even at personal cost (Satya). 2. Control your ego when you gain knowledge or power (Vinaya). 3. Stand up for the weak (Karuna). 4. Build bridges instead of walls in times of conflict (Milaap). Reflect on these virtues daily, write down your thoughts in the reflection journal, and let your actions speak your character."
    }
  };

  // Simulated AI response generator when keyword fails
  function generateWisdomResponse(userQuery) {
    const wisdomQuotes = [
      "In the tapestry of life, action (Karma) is the thread, and intent (Dharma) is the needle. Let your intent be pure, my child.",
      "Just as gold is purified by fire, the human spirit is refined through trials. Do not fear your current struggles; endure them with patience.",
      "Strength is not in muscles, nor in weapons. True strength resides in a calm mind that refuses to compromise on truth.",
      "A tree yields sweet fruits even when stoned. Similarly, respond to hostility with grace and forgiveness. That is the mark of noble souls.",
      "Ego is a mirror covered in dust. Wipe it clean with humility (Seva), and you will see the divine within everyone."
    ];
    
    const randomQuote = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];
    return {
      title: "Spiritual Guidance",
      response: `I hear your query: "${userQuery}". ${randomQuote} I encourage you to read the chapters (Kandas) of Sri Rama's journey, or ask me directly about Sita, Hanuman, Ravana, or the golden deer to uncover deeper meanings.`
    };
  }

  // Local Chatbot responder
  function respondLocally(query) {
    const cleanQuery = query.toLowerCase().trim();
    
    // Check keyword database
    for (const key in localKnowledgeBase) {
      const info = localKnowledgeBase[key];
      if (info.tags.some(tag => cleanQuery.includes(tag))) {
        return info;
      }
    }
    
    // Fallback response
    return generateWisdomResponse(query);
  }

  // Multi-Provider AI responder (Supports Gemini, Groq, OpenRouter, OpenAI)
  async function respondViaAI(query, apiKey) {
    const systemPrompt = `You are Sage Valmiki, the legendary author of the epic Ramayana.
Your tone is wise, serene, compassionate, and spiritual. You refer to the user as "seeker", "my child", or "noble soul".
Answer questions about the Ramayana story, its characters (Rama, Sita, Hanuman, Lakshmana, Ravana, etc.), slokas, or moral values.
Provide deep, practical advice on how the user can apply these lessons to their modern life to grow from 'good to great'.
Keep the response structured, clear, and under 220 words. If the question is completely unrelated to the Ramayana or spirituality, gently guide them back to the epic's teachings.`;

    let url = "";
    let headers = { "Content-Type": "application/json" };
    let body = {};
    const key = apiKey.trim();
    const isOpenAIFormat = key.startsWith("gsk_") || key.startsWith("sk-or-") || (key.startsWith("sk-") && !key.startsWith("sk-or-"));

    // 1. Detect provider based on key format
    if (key.startsWith("gsk_")) {
      // Groq Key (Generous Free Tier!)
      url = "https://api.groq.com/openai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      body = {
        model: "llama-3.3-70b-specdec",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 400
      };
    } else if (key.startsWith("sk-or-")) {
      // OpenRouter Key (calling openai/gpt-4o model)
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      body = {
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7
      };
    } else if (key.startsWith("sk-")) {
      // Standard OpenAI Key
      url = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      body = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 400
      };
    } else {
      // Default to Google Gemini API
      url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;
      body = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${query}`
          }]
        }]
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        let errorText = `HTTP Status ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson && errJson.error) {
            errorText = errJson.error.message || JSON.stringify(errJson.error);
          }
        } catch (e) {}
        throw new Error(errorText);
      }
      
      const data = await response.json();
      let generatedText = "";

      // Parse response based on OpenAI format vs Gemini format
      if (isOpenAIFormat) {
        generatedText = data.choices[0].message.content;
      } else {
        generatedText = data.candidates[0].content.parts[0].text;
      }
      
      return {
        title: "Sage Valmiki (AI)",
        response: generatedText
      };
    } catch (error) {
      console.error("AI API Error:", error);
      return {
        title: "API Connection Failed",
        response: `Alas, my child! My spiritual connection with the digital clouds was interrupted. The server responded with:\n\n"${error.message}"\n\nLet me answer you with my local wisdom instead:\n\n` + respondLocally(query).response
      };
    }
  }

  return {
    ask: async function(query, apiKey = "") {
      if (apiKey && apiKey.trim() !== "") {
        return await respondViaAI(query, apiKey);
      } else {
        // Return resolved promise immediately for offline feel
        return respondLocally(query);
      }
    }
  };
})();
