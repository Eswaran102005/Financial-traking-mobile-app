# FinTrack — Finance & Budget Tracker Mobile Application

A complete, production-grade mobile application built with **React Native** and **Expo** adhering to the college assignment specification. The app features role-based access control, rich financial dashboards, real-time analytics with custom SVG charts, month-wise transaction management, category budget tracking, and an integrated three-tier navigation architecture (Stack, Bottom Tab, and Drawer Navigation).

---

## 🚀 Setup & Run Instructions

### 1. Prerequisites
- Node.js (v18 or newer recommended, verified on v24)
- npm / yarn
- Expo Go on an Android or iOS device, or an Android Emulator

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Expo Development Server
```bash
npm start
# or
npx expo start
```

- **Run on Android device / Emulator:** Press `a` in the terminal or scan the displayed QR code with the **Expo Go** app on your Android device.
- **Run on iOS Simulator:** Press `i` in the terminal.
- **Run on Web:** Press `w` in the terminal (`npm run web`).

---

## 🔐 Demo Credentials & User Roles

Because no external backend is required, a local authentication system is implemented with pre-configured accounts:

| Role | Name | Email | Password | Allowed Access |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | System Administrator | `admin@budget.com` | `admin123` | Home Screen, Financial Analysis Screen (system-wide aggregates) |
| **Customer** | Alex Morgan | `alex@budget.com` | `customer123` | All 6 Screens (Home, Analysis, Profile, Transactions, Categories, Category Details) |

> 💡 **Quick 1-Click Fill:** On the **Sign In** screen, you can tap the **"Fill Customer"** or **"Fill Admin"** shortcut buttons to automatically test either role instantly. You can also switch roles on the fly using the **"Switch Mode"** button inside the side navigation drawer!

---

## 📱 Required Screens Implementation (Part I — 30 Marks)

### Screen 1: Home Screen — Admin and Customer (5 Marks)
- **Branding & Identity:** Custom FinTrack logo, role badge indicator, and navigation drawer toggle button.
- **Hero Balance Card:** Deep modern midnight-slate card displaying Net Balance, Total Income (+₹), and Total Expenses (-₹).
- **Interactive Period Selector:** Segmented toggle for **Daily**, **Weekly**, and **Monthly** reports. Tapping any period recalculates and updates the card values and statistics immediately from local transaction data.
- **Recent Transaction Summary:** Displays the 5 most recent transactions with categorized colored icons, dates, and amounts.
- **Auth Entry Points:** Quick Sign In / Sign Up shortcut banner and profile avatar navigation.

### Screen 2: Analysis Screen — Admin and Customer (5 Marks)
- **Financial KPIs:** Total Income, Total Expenses, Net Balance, and Savings Ratio percentage.
- **Cashflow Bar Chart:** Responsive dual-bar SVG chart comparing Income vs. Expenses across days (Weekly) or weeks (Monthly).
- **Category-Wise Spending Breakdown:** Interactive Donut / circular distribution SVG chart with center spend total and percentage badges per category.
- **Insights:** Highlights the top spending discipline and its share of overall expenditures.
- **Filters:** Period toggle (Daily, Weekly, Monthly) and type filter (All, Expenses, Income).
- **Role Differentiation:** Admins view system-wide demo data; Customers view their own personal records.

### Screen 3: Profile and Edit Profile — Customer Only (5 Marks)
- **Profile Screen:** Displays Customer avatar with initials, full name, email, phone number, monthly spending target, transaction counts, and membership date.
- **Edit Profile Screen:** Form with fields for Full Name, Email, Phone Number, and Monthly Budget.
- **Validation:** Enforces non-empty name, strict regex email formatting, valid phone number, and positive numeric budget.
- **Immediate State & Persistence:** Updates reflect immediately throughout all context consumers and persist to local AsyncStorage.

### Screen 4: Month-wise Transaction Screen — Customer Only (5 Marks)
- **Month & Year Selector:** Interactive carousel with `< Previous` and `Next >` navigation buttons to cycle through any month and year.
- **Monthly Summary Bar:** Displays monthly income, monthly expenses, and monthly net balance.
- **Search & Filter:** Search input by title/category and filters for **All**, **Income**, and **Expenses**.
- **Add / Edit / Delete Actions:** Full CRUD functionality. Deleting triggers a confirmation alert before proceeding and recalculates all affected month/period totals.

### Screen 5: Overall Categories Screen — Customer Only (5 Marks)
- **9 Standard Disciplines:**
  1. Food & Dining (`Utensils`)
  2. Transportation (`Car`)
  3. Shopping (`ShoppingBag`)
  4. Entertainment (`Film`)
  5. Bills & Utilities (`Receipt`)
  6. Healthcare (`HeartPulse`)
  7. Education (`GraduationCap`)
  8. Travel & Trips (`Plane`)
  9. General & Other (`CircleEllipsis`)
- **Category Cards:** Each category displays its custom icon, name, total spent, transaction count, allocated budget limit, and animated progress bar (% spent).
- **Over-Budget Warning:** Highlights in red with an "Over Budget" badge when spending exceeds the category limit.
- **Navigation:** Tapping any card navigates via Stack Navigation to the **Category Details Screen**.

### Screen 6: Category Details Screen — Customer (5 Marks)
- **Dynamic Content:** Adapts dynamically to whichever category is selected.
- **Category Hero:** Shows category icon, total spending, budget limit, and remaining budget balance.
- **Metrics:** Share of total expenses percentage and status badge ("Within Budget Limit" vs. "Budget Exceeded!").
- **Related Transactions:** Filtered list of transactions specific to the selected category, with dates, notes, amounts, and direct edit/delete actions.
- **Quick Action:** "Add Expense" button pre-configured with the active category.

---

## 🧭 React Navigation Architecture (Part II — 30 Marks)

All three required navigation types are integrated into a single, cohesive hierarchy:

```
NavigationContainer
└── GestureHandlerRootView
    └── Root Stack Navigator
        ├── "MainDrawer" (DrawerNavigator)
        │    └── "TabNavigator" (BottomTabNavigator)
        │         ├── HomeTab (HomeScreen)
        │         ├── AnalysisTab (AnalysisScreen)
        │         ├── TransactionsTab [Customer Only] (MonthWiseTransactionsScreen)
        │         ├── CategoriesTab [Customer Only] (OverallCategoriesScreen)
        │         └── ProfileTab [Customer Only] (ProfileScreen)
        ├── "SignIn" (SignInScreen)
        ├── "SignUp" (SignUpScreen)
        ├── "EditProfile" (EditProfileScreen)
        ├── "CategoryDetails" (CategoryDetailsScreen)
        └── "AddTransaction" (AddTransactionScreen)
```

1. **Stack Navigation (10 Marks):**
   - Seamless transitions and back-stack history for `Home -> SignIn`, `Home -> SignUp`, `Profile -> EditProfile`, `Categories -> CategoryDetails`, and `Transactions -> AddTransaction`.
2. **Bottom Tab Navigation (10 Marks):**
   - Customer tabs: `Home`, `Analysis`, `History`, `Categories`, `Profile`.
   - Admin tabs: `Home`, `Analysis`.
3. **Drawer Navigation (10 Marks):**
   - Side drawer with user profile header, role badge, quick role toggle, role-filtered menu items, reset demo data action, and sign-out button.

---

## 🔔 Personalized Transaction Alerts (Part III B — 5 Marks)

The application includes an in-app animated notification banner (`AlertBanner.tsx`) that addresses the user by first name:
- **Adding Transaction:** `"Hi Alex, your ₹500 Food expense has been added successfully."`
- **Editing Transaction:** `"Hi Alex, your transaction has been updated successfully."`
- **Deleting Transaction:** `"Hi Alex, your transaction has been deleted successfully."`
- **Budget Exceeded Warning:** `"Hi Alex, your Food expense of ₹1,200 has exceeded your budget limit of ₹8,000!"`

---

## 📊 Daily, Weekly, and Monthly Reports (Part III C — 5 Marks)

- **Daily Report:** Calculates income, expenses, and net balance for the current day.
- **Weekly Report:** Aggregates transactions from Monday through Sunday of the active week.
- **Monthly Report:** Aggregates transactions from day 1 to the end of the month.
- All reports recalculate automatically whenever a transaction is added, edited, or deleted.

---

## 🏗️ Project Architecture

```
sem-exam/
├── App.tsx                    # Application entry point with Providers & Navigators
├── src/
│   ├── components/            # Reusable components
│   │   ├── AlertBanner.tsx    # In-app personalized notification toast
│   │   ├── BalanceCard.tsx    # Hero financial balance card
│   │   ├── CategoryDonutChart.tsx # SVG Donut spending chart
│   │   ├── CategoryIcon.tsx   # Lucide category icon renderer
│   │   ├── CategoryProgressCard.tsx # Category progress item
│   │   ├── CustomDrawerContent.tsx  # Role-aware side drawer
│   │   ├── FinancialChart.tsx # Dual-bar cashflow SVG chart
│   │   ├── PeriodSelector.tsx # Segmented report period control
│   │   └── TransactionItem.tsx# Transaction list row with edit/delete
│   ├── constants/             # Design tokens & defaults
│   │   ├── categories.ts      # 9 standard categories configuration
│   │   └── theme.ts           # Fintech color palette, spacing, typography
│   ├── context/
│   │   └── AppContext.tsx     # React Context state, auth, and calculations
│   ├── navigation/            # Stack, Drawer, and Tab navigators
│   │   ├── DrawerNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/               # All 6 required application screens + Auth
│   │   ├── AddTransactionScreen.tsx
│   │   ├── AnalysisScreen.tsx
│   │   ├── CategoryDetailsScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MonthWiseTransactionsScreen.tsx
│   │   ├── OverallCategoriesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── services/
│   │   └── storage.ts         # AsyncStorage persistence wrapper
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces & navigation param types
│   └── utils/
│       ├── dateUtils.ts       # Period & range calculations
│       ├── demoData.ts        # Seed data with relative date anchors
│       └── formatters.ts      # Indian Rupee (₹) & date formatting
```

---

## 🧪 Testing Results

- **TypeScript Compilation:** `npx tsc --noEmit` exits with **0 errors**.
- **Expo Bundling:** `npx expo export --no-bytecode` bundles 3,492 modules cleanly for both **Android** and **iOS** without errors.
- **Role Guards:** Verified that Customer-only screens display appropriate restriction notices if accessed by an Admin.
- **Persistence:** Local storage persists updated profiles and transactions between sessions.
