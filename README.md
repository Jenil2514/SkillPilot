# 🚀 SkillPilot – Curated Educational Resource Hub  

[![Made with MERN](https://img.shields.io/badge/Made%20With-MERN-green?logo=mongodb&logoColor=white)]()  
[![TypeScript](https://img.shields.io/badge/Frontend-TypeScript-blue?logo=typescript)]()  
[![JWT Secured](https://img.shields.io/badge/Security-JWT-orange?logo=jsonwebtokens)]()  
[![AI Powered](https://img.shields.io/badge/AI-Agent%20Moderation-red?logo=robotframework)]()  
[![License](https://img.shields.io/badge/License-MIT-lightgrey)]()  

SkillPilot is a **MERN-stack** platform that helps students and professionals discover **curated educational resources** without the noise. It uses an **AI Agent (Make.com)** for content moderation, ensuring that only **relevant, secure, and high-quality resources** are shared.  

🔗 **Repository**: [SkillPilot GitHub](https://github.com/Jenil2514/SkillPilot)  

---

## 🌟 About the Website  

In today’s digital age, learners rely heavily on platforms like YouTube, GeeksforGeeks, and online documentation. While these platforms are valuable, the **overwhelming amount of content often makes it difficult to find high-quality, relevant resources**.  

SkillPilot was created to solve this problem by:  
- ✅ **Centralizing** the best open-source educational resources.  
- ✅ **Filtering malicious or irrelevant content** using an AI-powered agent.  
- ✅ **Enabling collaboration** through community-driven contributions, likes, and discussions.  

The goal is to **bridge the learning gap** by providing learners with a trusted hub for verified, organized, and useful educational materials.  

---

## 📌 Table of Contents  
- [✨ Features](#-features)  
- [🛠 Tech Stack](#-tech-stack)  
- [⚙️ Architecture](#️-architecture)  
- [⚔️ Competitive Edge](#️-competitive-edge)  
- [🚀 Getting Started](#-getting-started)  
- [📸 Screenshots](#-screenshots)  
- [📬 Contact](#-contact)  

---

## ✨ Features  

- 📚 **Categorized Learning Paths** – structured courses with progress tracking.  
- 🎓 **University-Specific Curricula** – resources mapped to academic syllabi.  
- 📰 **Community Feed** – Q&A, problem-solving, and discussions.  
- 🔒 **AI-Powered Security** – suspicious links flagged via **email alerts**, irrelevant ones auto-rejected.  
- 💾 **Save & Revisit** – bookmark courses for later.  
- 🏆 **Recognition & Rewards** – contributor spotlight & achievement badges.  

---

## 🛠 Tech Stack  

**Frontend**: React + TypeScript, TailwindCSS  
**Backend**: Node.js, Express, MongoDB  
**Authentication**: JWT  
**AI/Automation**: Make.com AI Agent (for content verification)  

---

## ⚙️ Architecture  

```mermaid
graph TD
  A[User] -->|Submit Resource| B[Frontend - React + TS]
  B --> C[Backend - Node.js/Express]
  C --> D[(MongoDB Database)]
  C --> E[JWT Auth Service]
  C --> F[AI Agent - Make.com]
  F -->|Flag/Approve| C
  C --> B
  B --> A
