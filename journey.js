// Ramayana Journey Data
window.RamayanaJourney = [
  {
    id: "bala",
    name: "Bala Kanda",
    title: "The Book of Childhood",
    description: "Begins the epic story of Sri Rama. It chronicles his birth in Ayodhya, his education under Sage Viswamitra, his protection of sacred yagnas from demons, the breaking of the divine Shiva Dhanush (bow) in Mithila, and his marriage to Sita Devi.",
    milestones: [
      { name: "Ayodhya Birth", details: "Rama is born as the eldest son of King Dasaratha and Queen Kausalya." },
      { name: "Siddhashrama", details: "Protects Sage Viswamitra's sacrificial fire from demons Tadaka and Subahu." },
      { name: "Mithila", details: "Sri Rama lifts and breaks the heavy Shiva Dhanush, winning Sita's hand in marriage." }
    ],
    coordinates: { x: 190, y: 150 }, // For map plotting
    color: "#ff8c00",
    moral: {
      lesson: "Dedication to duty (Dharma) from an early age, respect for elders, and mastering one's senses to prepare for future life challenges.",
      prompts: [
        "How do you prepare yourself mentally and educationally for the battles of your daily life?",
        "Recall a time you respected an elder or mentor's guidance over your own comfort. What did you learn?"
      ]
    },
    characters: [
      { name: "Sri Rama", role: "Avatar of Lord Vishnu, embodiment of Dharma, truth, and ideal conduct." },
      { name: "Sita Devi", role: "Avatar of Lakshmi, daughter of King Janaka, representing devotion, virtue, and resilience." },
      { name: "Sage Viswamitra", role: "A powerful sage who trains Rama in spiritual and martial wisdom." },
      { name: "King Dasaratha", role: "Rama's father, King of Ayodhya, who values keeping his vows above all." }
    ],
    animationType: "dhanush" // Custom bow animation
  },
  {
    id: "ayodhya",
    name: "Ayodhya Kanda",
    title: "The Book of Ayodhya",
    description: "Focuses on the preparation for Rama's coronation, which is disrupted by Kaikeyi's demand for Rama's 14-year exile and Bharata's installation as king. Rama accepts this with total calm and departs for the forest with Sita and Lakshmana.",
    milestones: [
      { name: "The Exile Order", details: "Rama accepts his father's exile order without anger or resentment." },
      { name: "Ganga Crossing", details: "Guha, the chief of boatmen, helps them cross the Ganges river." },
      { name: "Chitrakoot", details: "They set up a hermitage; Bharata arrives to beg Rama to return, taking Rama's sandals (Padukas) as symbols of authority." }
    ],
    coordinates: { x: 230, y: 220 },
    color: "#e65c00",
    moral: {
      lesson: "Maintaining peace of mind in adversity (Samatvam). Duty towards parents and vows should outweigh personal desire and ambition.",
      prompts: [
        "When things don't go according to your plan, how do you manage anger or disappointment?",
        "How can you prioritize long-term duties over immediate desires in your career or relationships?"
      ]
    },
    characters: [
      { name: "Lakshmana", role: "Rama's loyal brother, who chooses exile to serve Rama and Sita." },
      { name: "Bharata", role: "Rama's brother, who refuses the crown out of deep devotion and rules in Rama's name." },
      { name: "Queen Kaikeyi", role: "Dasaratha's queen, influenced by maid Manthara, who demands Rama's exile." },
      { name: "Guha", role: "The tribal boatman king, who showcases pure and simple devotion." }
    ],
    animationType: "paduka"
  },
  {
    id: "aranya",
    name: "Aranya Kanda",
    title: "The Book of Forest",
    description: "Describes the forest life of Rama, Sita, and Lakshmana in Panchavati. It covers their encounters with sages and demons, the mutilation of Surpanakha, the temptation of the golden deer (Maricha), the abduction of Sita by Ravana, and Jatayu's heroic but fatal sacrifice.",
    milestones: [
      { name: "Panchavati Hermitage", details: "Living in harmony with nature and receiving spiritual instruction from sages." },
      { name: "Golden Deer", details: "Ravana sends Maricha in disguise as a golden deer to lure Rama away." },
      { name: "Sita's Abduction", details: "Ravana abducts Sita; Jatayu fights valiantly but is mortally wounded." }
    ],
    coordinates: { x: 260, y: 310 },
    color: "#cc0000",
    moral: {
      lesson: "Beware of external, superficial temptations (like the golden deer). Protect the vulnerable, and speak out/fight against injustice even when victory seems impossible (Jatayu).",
      prompts: [
        "What are the 'golden deers' (distractions, greed, false promises) in your modern life?",
        "Have you ever stood up for a right cause knowing you might fail? How did that shape your integrity?"
      ]
    },
    characters: [
      { name: "Jatayu", role: "The divine king of vultures, who sacrificed his life trying to rescue Sita." },
      { name: "Ravana", role: "The powerful king of Lanka, highly knowledgeable but blinded by ego and lust." },
      { name: "Surpanakha", role: "Ravana's sister whose nose is cut by Lakshmana after she attempts to kill Sita." }
    ],
    animationType: "deer"
  },
  {
    id: "kishkindha",
    name: "Kishkindha Kanda",
    title: "The Book of the Monkey Kingdom",
    description: "Rama journeys south, meeting Hanuman and forming an alliance with Sugriva. Rama helps Sugriva defeat his tyrannical brother Vali, and Sugriva mobilizes the Vanara (monkey) army to search for Sita across the four directions.",
    milestones: [
      { name: "Meeting Hanuman", details: "Hanuman approaches Rama in disguise, forming an eternal bond of devotion." },
      { name: "Alliance with Sugriva", details: "Rama and Sugriva pledge mutual help over a sacred fire." },
      { name: "Slaying of Vali", details: "Rama shoots Vali from concealment, restoring the throne to Sugriva." }
    ],
    coordinates: { x: 240, y: 440 },
    color: "#d4af37",
    moral: {
      lesson: "True friendship is built on mutual support and values, not self-interest. True power comes with humility, as shown by Hanuman.",
      prompts: [
        "What qualities do you look for in your closest companions? Do they align with your morals?",
        "How do you channel your inner strengths? Do you remain humble when you achieve great power?"
      ]
    },
    characters: [
      { name: "Hanuman", role: "The ideal devotee, possessing immense strength, wisdom, humility, and celibacy." },
      { name: "Sugriva", role: "Exiled Vanara king who secures Rama's help to defeat Vali and regain his kingdom." },
      { name: "Vali", role: "Sugriva's elder brother, possessed of near-invincible strength but corrupted by anger." }
    ],
    animationType: "bridge"
  },
  {
    id: "sundara",
    name: "Sundara Kanda",
    title: "The Book of Beauty",
    description: "Focuses on Hanuman's heroic deeds. He expands his size, flies across the ocean to Lanka, finds Sita in the Ashoka Vatika, gives her Rama's ring, reassures her, defeats Ravana's soldiers, allows himself to be captured, and burns Lanka before returning with news.",
    milestones: [
      { name: "Ocean Leap", details: "Hanuman overcomes various obstacles in the air to reach Lanka." },
      { name: "Ashoka Vatika", details: "Finds Sita, delivers Rama's signet ring, and gives her hope of rescue." },
      { name: "Lanka Dahan", details: "Using his burning tail, Hanuman sets fire to Ravana's golden capital." }
    ],
    coordinates: { x: 270, y: 550 },
    color: "#ff4500",
    moral: {
      lesson: "Unshakeable faith and single-minded focus can conquer the widest oceans of doubt. Be a selfless agent of good.",
      prompts: [
        "What is the 'ocean' of doubt or fear you must leap over right now?",
        "How can you develop the focus and determination that Hanuman demonstrated in finding Sita?"
      ]
    },
    characters: [
      { name: "Hanuman (Sundara)", role: "Demonstrates that intellect, loyalty, and faith can overcome physical limits." },
      { name: "Sita (In Captivity)", role: "Stands firm in her values, refusing Ravana's luxuries, waiting only for Rama." }
    ],
    animationType: "lanka"
  },
  {
    id: "yuddha",
    name: "Yuddha Kanda",
    title: "The Book of War",
    description: "Describes the epic campaign to rescue Sita. The Vanaras construct the Ram Setu bridge across the sea. Rama's army marches into Lanka. A colossal war ensues, culminating in the death of Indrajit, Kumbhakarna, and Ravana. Sita is rescued, and they return in the Pushpaka Vimana.",
    milestones: [
      { name: "Ram Setu", details: "Stones inscribed with 'Sri Rama' float, building a miraculous sea bridge." },
      { name: "Battle of Lanka", details: "Fierce fighting where Lakshmana is revived by Sanjeevani, and Kumbhakarna falls." },
      { name: "Slaying of Ravana", details: "Rama defeats Ravana with the Brahmastra. Sita passes the fire ordeal (Agni Pariksha)." }
    ],
    coordinates: { x: 280, y: 640 },
    color: "#990000",
    moral: {
      lesson: "No matter how strong, wealthy, or knowledgeable evil (Ravana) is, it will fall if it lacks character (Dharma). Righteousness always prevails.",
      prompts: [
        "In your life, does your 'ego' ever get in the way of admitting errors? How can you cultivate humility?",
        "How do you build bridges (connections, reconciliations) with others in times of division?"
      ]
    },
    characters: [
      { name: "Sri Rama (Warrior)", role: "Fights with honor, offering peace terms to Ravana even on the battlefield." },
      { name: "Vibhishana", role: "Ravana's righteous brother who joins Rama, choosing righteousness over family loyalty." },
      { name: "Kumbhakarna", role: "Ravana's giant brother, who knows Ravana is wrong but fights out of fraternal duty." }
    ],
    animationType: "arrow"
  },
  {
    id: "uttara",
    name: "Uttara Kanda",
    title: "The Book of the Aftermath",
    description: "Covers the return of Rama to Ayodhya, his coronation, the peace and prosperity of Ramrajya, the birth of Luv and Kush to Sita in Valmiki's ashram, and the eventual departure of Rama and his associates to their eternal abode.",
    milestones: [
      { name: "Coronation", details: "Sri Rama is crowned King of Ayodhya, initiating a golden era of justice." },
      { name: "Luv & Kush", details: "The twin sons of Rama grow up singing the Ramayana, taught by Sage Valmiki." },
      { name: "Mahaprasthan", details: "The divine characters return to their spiritual forms, leaving an eternal path of Dharma." }
    ],
    coordinates: { x: 190, y: 150 }, // Return to Ayodhya
    color: "#8a2be2",
    moral: {
      lesson: "Leadership requires sacrifice. Our legacy is not defined by our possessions, but by the righteousness of our actions and the wisdom we pass to the next generation.",
      prompts: [
        "What kind of legacy do you wish to leave behind in your community or family?",
        "Are you willing to make personal sacrifices to stand by the truth or serve a larger group?"
      ]
    },
    characters: [
      { name: "Luv & Kush", role: "Rama's twin sons who represent the youthful carriers of tradition and art." },
      { name: "Sage Valmiki", role: "The adi-kavi (first poet) who recorded the Ramayana and gave shelter to Sita." }
    ],
    animationType: "coronation"
  }
];
