# Insightful Wallet Pro

Tolong baca dan teruskan aplikasi dari repository GitHub ini:

https://github.com/dianchris213/NewAPP-REV001

dan lakukan perintah atau permintaan  ini:
[STRICT AUDIT MODE: PRESERVE CORE DATA & ENSURE NO BREAKING CHANGES]

Please implement the following functional upgrades to transform the UI mockup into a fully interactive state-based prototype. Maintain all horizontal swipe/touch-friendly behaviors and ARIA labels.

1. GLOBAL DESIGN CONSISTENCY:

- Replicate the exact design pattern across all main views (Home, Dompet, Analitik, Pengaturan).

- Ensure every view consistently utilizes the hero gradient backgrounds, sleek glassmorphism panels (glass-card), and a unified top bar header.

2. AUTHENTICATION FLOW (Login & Signup):

- Create dedicated "Login" and "Signup" screens.

- Add a primary "Login with Telegram" button to simulate the Telegram Mini App initialization.

- Include a fully functional "Login via Google" button as an alternative authentication method.

- Simulate the auth flow: Upon clicking the login button, show a brief loading state, simulate the app authorization, and seamlessly redirect the user to the Home (Beranda) view.

3. ROUTING & NAVIGATION SIMULATION:

- Implement state-based navigation (or React Router) connected to the Bottom Navigation Bar.

- Ensure the user can smoothly click and transition between Beranda, Analitik, Dompet, and Pengaturan views without page reloads. The active tab must visually update.

4. INTERACTIVE FEATURES & OPTIMISTIC UI:

- Dompet (Wallet): Create a functional "Add Transaction" form/modal with corrected input handling for both "Pemasukan" (Income) and "Pengeluaran" (Expense). Apply an optimistic UI update so the balance and transaction list update instantly upon submission.

- Analitik (Analytics): Implement functional time-frame filters (e.g., 1D, 1W, 1M, 1Y) that dynamically toggle the visible chart data and summary metrics.

- Pengaturan (Settings): Make the setting toggles (e.g., Theme switch, Push Notifications, Biometric Lock) stateful and interactive.


jika diatas sudah ada lewatkan dan perbaiki yang belum sempurna dan perlu di fix

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e5169a46-95de-47aa-b790-ee5b5b72ffb0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
