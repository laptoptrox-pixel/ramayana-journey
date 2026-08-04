# 🪔 Sri Rama Journey & Ramayana Wisdom Portal

An immersive, cinematic, single-page web application tracing the sacred journey of Sri Rama across the 7 books (Kandas) of the Ramayana. This portal features an interactive geographical route map, real-time synthesized classical Indian music (Tanpura & Bansuri flute), Sanskrit slokas recitations, self-reflection virtue tracking, mini-games for children, and an offline/online AI Chatbot of Sage Valmiki.

---

## 🌟 Key Features

1. **🗺️ Google-Maps-Style Chronicle Map**: Interactive SVG vector landmasses showing Rama's path from Ayodhya to Lanka. Dotted route lines dynamically highlight segments matching the explored Kanda, complete with a spring-loaded `RAMA 🏹` traveler chariot.
2. **🪔 Floating Lotus Sound Console**: An audio mixer console represented by a glowing oil lamp (diya). Uses the **Web Audio API** to procedurally synthesize a real-time Tanpura string drone, Bansuri flute melodies, temple chimes, and ocean waves. Includes sequence sitar/veena plucks triggered on hovering SVG nodes.
3. **📖 Sloka Sanctuary**: Sanskrit verses for all 7 books of the Ramayana in Devanagari script, complete with English transliterations, literal translations, moral life applications, and spoken recitations.
4. **🧠 Sage Valmiki AI Altar**: A conversational NLP chatbot. Operates in an offline local wisdom matching mode by default, or connects to the live **Google Gemini API** (using `gemini-2.0-flash`) via secure user-supplied local storage keys.
5. **📓 Dharma Journal & Virtue Score Audit**: A self-reflection tool where users write reflections on Kanda prompts, rate their virtue alignment, and watch their virtue balance bars update in real time. Completing all 7 reflections triggers a dynamic Diwali firework celebration.
6. **✨ Kids Corner & Arcade**: A child-friendly section containing playful hero tales and 5 mini-games: *Hanuman Leap*, *Rama's Bow*, *Build Setu*, *Virtue Match*, and *Herb Catcher*.

---

## 🛠️ Technology Stack

* **Frontend**: Vanilla HTML5, Custom CSS3, and Javascript (ES6).
* **Serving & Build Tooling**: Vite 5.
* **Audio Synthesis**: Native Web Audio API (procedural oscillator soundscapes).
* **Styling**: Glassmorphism, custom linear gradients, CSS custom variables, and keyframe animations.
* **AI Engine**: Google Gemini API (`gemini-2.0-flash` endpoint).

---

## 🚀 Running Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Installation
Clone this repository and install the dependencies:
```bash
git clone https://github.com/laptoptrox-pixel/ramayana-journey.git
cd ramayana-journey
npm install
```

### 3. Configure Gemini API Key (Optional)
Create a `.env` file in the root folder and add your Gemini API Key:
```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
*(Note: Create your API key for free at [Google AI Studio](https://aistudio.google.com/) for instant access).*

### 4. Start the Dev Server
Run the development server:
```bash
npm run dev
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### 5. Build for Production
To package the app for deployment (e.g., Hostinger Shared Hosting):
```bash
npm run build
```
Upload the contents of the generated `dist/` directory to your web hosting root.

---

## 🔒 Security & Privacy
* **Secret Concealment**: Your Gemini API keys are never stored on external databases or sent to proxy servers. They are kept securely inside your local `.env` configuration or browser's private local storage.
* **Open Source Media**: Media streams use public-domain, direct-linked, secure H.264/MP3 transcodes to ensure wide device compatibility (Safari/iOS) without tracking scripts.

---

## ☸️ License
This project is dedicated to the preservation and dissemination of Dharma. Built with love towards Dharma.
