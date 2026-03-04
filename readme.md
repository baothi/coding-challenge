# Code Challenge Solutions

Three coding problems demonstrating React, TypeScript, and problem-solving skills.

---

## 📁 Project Structure
```
coding-challenge/
├── src/
│   ├── problem-1/              # JavaScript algorithms
│   ├── problem-2-fancy-form/   # Currency swap app (React + Vite)
│   └── problem-3-messy-react/  # Code review & refactoring
└── README.md
```

---

## 🚀 Quick Start

### Problem 1: Three Ways to Sum to N
```bash
cd src/problem-1
node solution.js
```

### Problem 2: Currency Swap Form
```bash
cd src/problem-2-fancy-form
npm install
npm run dev
# Open http://localhost:5173
```

### Problem 3: Messy React Analysis
```bash
cd src/problem-3-messy-react
# Review REFACTORING-EXPLANATION.md for detailed analysis
```

---

## 📋 Problem Summaries

### Problem 1: Three Ways to Sum to N
**Challenge:** Provide 3 unique implementations of summing 1 to n

**Solutions:**
- **Method A:** Mathematical formula `n(n+1)/2` - O(1)
- **Method B:** For loop - O(n)
- **Method C:** Array.reduce() - O(n)



---

### Problem 2: Fancy Form - Currency Swap
**Challenge:** Build an interactive currency exchange form

**Features:**
- ✅ Real-time conversion with 6 currencies
- ✅ Bidirectional swap with animation
- ✅ Input validation & error handling
- ✅ Glass morphism design inspired by 99tech
- ✅ Currency flags & modern gradient UI
- ✅ Loading states & responsive design

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS



---

### Problem 3: Messy React - Code Review
**Challenge:** Identify issues and refactor a buggy React component

**Issues Found:** 18 total
- 🚨 5 Critical bugs (undefined variables, inverted logic, type mismatch)
- ⚡ 4 Performance issues (function recreations, multiple iterations, wrong dependencies)
- 🎯 9 Best practice violations (index keys, any types, magic numbers, poor formatting)

**Improvements:**
- Fixed all runtime errors and logical bugs
- Reduced array iterations from 3 to 2
- Eliminated function recreations per render
- Added full TypeScript type safety
- Implemented proper React keys and memoization
- Used Intl.NumberFormat for better i18n support

**Key Refactoring:**
- Moved pure functions outside component
- Used object lookup O(1) instead of switch
- Combined filter + map + format into single pipeline
- Added null safety and edge case handling
- Proper useMemo dependencies



---

## 🛠️ Technologies

- **Languages:** TypeScript, JavaScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useMemo, useCallback)

---

## 📝 Author

**Nguyen Bao**
Date: March 2026

---

## 📄 License

This project is created as part of a technical assessment.
