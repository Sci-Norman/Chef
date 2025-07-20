Live website link: https://norman-kitchen.vercel.app/

# 👨‍🍳 Chef's Friend – AI Recipe Assistant

**Chef's Friend** is an AI-powered cooking assistant built with React + Vite. Just type in ingredients you have, and the app will suggest a full recipe and even embed a related YouTube video!

---

## 🚀 Features

- ✅ Add ingredients and get a full AI-generated recipe
- 🎥 Embedded YouTube cooking video from AI suggestions
- 📝 Markdown rendering of AI text using `react-markdown`
- 💨 Fast dev server with Vite
- 🎨 Styled with Tailwind CSS

---

## 📦 Tech Stack

- React
- Vite
- Tailwind CSS
- React Markdown + Rehype Raw
- OpenAI (or Mistral AI for recipe generation)

---

## 🛠️ Setup Instructions

1. **Clone the project**

```bash
git clone https://github.com/your-username/chefs-friend.git
cd chefs-friend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root:

```env
VITE_API_KEY=your-api-key-here
```

4. **Run the development server**

```bash
pnpm run dev
```

Visit: `http://localhost:5173`

---

## 🔧 Project Structure

```
src/
│
├── components/
│   ├── IngredientsList.jsx
│   ├── ChefRecipe.jsx
│
├── ai.js  ← handles AI call to Mistral/OpenAI
├── Body.jsx
├── App.jsx
```

---

## 🛡️ .env File

Make sure `.env` is **not committed to Git**. Add this to your `.gitignore`:

```
.env
```

---

## ✨ Demo (Example Output)

```
Ingredients: rice, chicken, kale

AI Recipe:
Cook the rice...
Add the chicken...

[Embedded YouTube video]
```

---

## 💡 Credits

- AI Recipe by [Mistral AI](https://mistral.ai) / OpenAI
- UI by Norman 🙌

---

## 📃 License

MIT
