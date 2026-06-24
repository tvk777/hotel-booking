# Hotel Room Search – Next.js App

## 📌 Overview

A small hotel room search and booking interface built with **Next.js, TypeScript, and Tailwind CSS**.

The app allows users to configure search parameters and view available rooms based on selected filters.

---

## 🚀 Features

* Search by check-in / check-out dates
* Select number of rooms, adults, and children (with age input)
* URL sync with search state (shareable and restorable links)
* Validation of booking rules (date limits, required fields, etc.)
* Mock data-based room results

---

## 🏨 Room Information

Each room displays:

* Name
* Total price for selected stay
* Cancellation policy
* Meal plan (if available)
* “Reserve” action button

---

## 🛠 Tech Stack

* Next.js
* TypeScript
* Tailwind CSS

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

---

## 🌐 Live Demo

[(https://hotel-booking-coral-ten.vercel.app/)]

---

## 💡 Notes

* Search state is fully synchronized with URL
* Business rules are validated before search execution
* UI is responsive for mobile and desktop
