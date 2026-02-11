Live website link: https://norman-kitchen.vercel.app/

# 👨‍🍳 Chef's Friend – AI Recipe Assistant

**Chef's Friend** is an AI-powered cooking assistant built with React + Vite. Add ingredients you already have, and the app generates a full recipe in markdown with optional cuisine and dietary preferences.

---

## 🚀 Features

- ✅ Add ingredients and generate an AI recipe
- 🧭 Choose dietary preferences and cuisine style
- 📝 Markdown recipe rendering via `react-markdown`
- 🕘 Recipe history with favorites and star ratings
- 🌓 Dark mode support with persisted preferences

---

## 📦 Tech Stack

- React
- Vite
- Plain CSS (custom theme variables)
- React Markdown + Remark GFM
- Hugging Face Inference API

---

## 🛠️ Setup Instructions

1. **Clone the project**

```bash
git clone https://github.com/your-username/chefs-friend.git
cd chefs-friend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root:

```env
VITE_HF_ACCESS_TOKEN=your-access-token-here
```

4. **Run the development server**

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔧 Project Structure

```text
src/
├── components/
│   ├── ChefRecipe.jsx
│   ├── Header.jsx
│   ├── RecipeHistory.jsx
├── ai.js
├── Body.jsx
└── App.jsx
```

---

## 🛡️ .env File

Make sure `.env` is **not committed to Git**. Add this to your `.gitignore`:

```text
.env
```

---

## 💡 Credits

- AI recipe generation powered by [Hugging Face](https://huggingface.co/)
- UI by Norman 🙌

---

## 📃 License

MIT
