# QA Checklist - Audit Application

## Phase Overview
This document provides a comprehensive QA checklist for manual testing of the refactored audit application. All features should be tested across desktop and mobile devices, in both light and dark modes.

---

## Pre-Testing Setup

- [ ] Clear browser cache and cookies (or use incognito/private mode)
- [ ] Test on desktop browser (Chrome/Safari/Firefox)
- [ ] Test on mobile device or responsive mode
- [ ] Enable dark mode testing
- [ ] Test in multiple languages (EN, NL, RU, TR)
- [ ] Test with different currencies (EUR, USD, GBP, RUB, TRY)

---

## 1. Landing Page (/)

### Page Load
- [ ] Page loads without errors
- [ ] Monkey icon appears correctly
- [ ] All 4 tool tiles are visible (Debt, Tax, Benchmark, FIRE)
- [ ] Language selector works and shows all 4 languages

### Dark Mode Toggle
- [ ] Dark mode button toggles background color
- [ ] Dark mode persists on page reload
- [ ] Auto mode detects system preference on first load
- [ ] Toggle between manual and auto mode works

### Theme Switching
- [ ] Language toggle changes all visible text
- [ ] Currency selector doesn't appear on landing (correct UX)
- [ ] Mobile: hamburger menu appears on small screens
- [ ] Desktop: sidebar navigation visible on large screens

### Navigation
- [ ] Clicking each tool tile navigates to correct page
- [ ] Desktop auto-redirects to /overview after 1s
- [ ] Mobile stays on landing page (manual selection)

---

## 2. Dashboard (/dashboard) - CRITICAL

### Shared Mode (Default)

#### Income Management
- [ ] Add Income button creates new income row
- [ ] Income source field accepts text input
- [ ] Amount field accepts numeric input only
- [ ] Delete button removes income row
- [ ] Multiple income sources display correctly
- [ ] Empty income list shows "No income sources" message

#### Savings
- [ ] Savings amount accepts numeric input
- [ ] "Include in calculations" checkbox toggles
- [ ] Unchecking savings removes it from pie chart

#### Expenses
- [ ] All expense categories display with correct icons
- [ ] Each category accepts numeric input
- [ ] Categories with 0 are hidden in pie chart
- [ ] Currency symbol displays next to amount fields

#### Calculations & Display
- [ ] Total Income card shows sum of all incomes
- [ ] Total Expenses card shows sum of all categories
- [ ] Remaining amount = Income - Savings - Expenses
- [ ] Remaining amount color: green if positive, red if negative
- [ ] Pie chart displays only non-zero categories + Savings (if enabled) + Remaining
- [ ] Pie chart labels show category name, amount, and percentage

#### Data Persistence
- [ ] Data persists on page reload
- [ ] Currency change updates all displayed amounts
- [ ] Language change updates all labels and categories

### Separate Mode (Two-Person)

#### Person Section (Both People)
- [ ] Person name is editable
- [ ] Changes to person name persist
- [ ] Income management works (add/edit/delete)
- [ ] Savings field accepts numeric input
- [ ] Expense categories are personal (not shared)
- [ ] Summary shows: Total Income, Expenses, Savings, Balance
- [ ] Balance = Personal Income - Personal Savings - Personal Expenses - Shared Contribution
- [ ] Personal Balance color coding works (green/red)

#### Shared Account Section
- [ ] Shared expense categories display correctly
- [ ] Income ratio shows correct percentages
- [ ] Income ratios sum to 100%
- [ ] Contributions show correct amounts split by ratio
- [ ] Sum of contributions = Total shared expenses
- [ ] Three pie charts display (Person 1, Person 2, Shared Account)

#### Data Persistence Separate Mode
- [ ] All data persists for both people
- [ ] Person names persist
- [ ] Switching between modes retains all data
- [ ] Switching back to shared mode and back preserves separate data

### Mode Switching
- [ ] Toggle button is always visible
- [ ] Switching from Shared → Separate loads separate data
- [ ] Switching from Separate → Shared loads shared data
- [ ] No data loss on mode switch
- [ ] Appropriate UI renders for each mode

### Mobile Responsiveness
- [ ] Income/expense inputs stack vertically
- [ ] Pie charts display at readable size
- [ ] Summary cards stack on small screens
- [ ] Text remains readable at all breakpoints
- [ ] Buttons are touchable (minimum 44x44px)

---

## 3. Overview (/overview)

### Data Loading
- [ ] Page loads combined dashboard + retirement data
- [ ] Shows current month's financial summary
- [ ] Retirement metrics display correctly

### Calculations
- [ ] Total income matches dashboard
- [ ] Total expenses matches dashboard
- [ ] Retirement projection displays with correct calculations
- [ ] Monthly investment requirement shows (if in backward mode)

### Charts
- [ ] Pie chart displays expense breakdown
- [ ] All categories with data appear
- [ ] Labels show amounts and percentages
- [ ] Dark mode colors apply correctly

### Data Sync
- [ ] Changes in dashboard reflect in overview
- [ ] Changes in retirement calculator reflect here
- [ ] Refresh page: all data persists

---

## 4. Retirement (/retirement)

### Forward Calculation Mode
- [ ] "Forward" radio button selectable
- [ ] Current age accepts numeric input
- [ ] Retirement age accepts numeric input
- [ ] Monthly investment accepts numeric input
- [ ] Annual return accepts numeric input with decimals
- [ ] Table displays projection by year
- [ ] Balance increases over time
- [ ] Gains are calculated (balance - contributions)
- [ ] Export/chart visualization works

### Backward Calculation Mode
- [ ] "Backward" radio button selectable
- [ ] Goal balance accepts numeric input
- [ ] Required monthly investment auto-calculates
- [ ] Table shows required monthly amount
- [ ] Switching modes preserves data

### Calculations
- [ ] Age validation: retirement age ≥ current age
- [ ] Negative value guards work (no negative balance)
- [ ] 0% return rate calculates correctly (simple division)
- [ ] High return rates don't crash (validation caps rate)

### Data Persistence
- [ ] Mode preference persists
- [ ] Calculation results persist
- [ ] Changing inputs updates projection
- [ ] Page reload restores last calculation

### Mobile
- [ ] Input fields are appropriate size for touch
- [ ] Table scrolls horizontally on small screens
- [ ] Chart displays at readable size

---

## 5. Tax Calculator (/tax)

### Basic Functionality
- [ ] Gross income input accepts numeric values
- [ ] Calculates net income correctly
- [ ] Shows income tax breakdown by bracket
- [ ] Displays general tax credit
- [ ] Displays earned income credit
- [ ] Shows effective tax rate

### Edge Cases
- [ ] Zero income: shows 0 tax
- [ ] Negative income: defaults to 0
- [ ] Very large income: calculates without overflow
- [ ] Very small income: calculates correctly

### Tax Bracket Display
- [ ] Each bracket shows min, max, rate
- [ ] Income amount in bracket calculates correctly
- [ ] Tax in bracket calculates correctly
- [ ] Cumulative tax is accurate
- [ ] All brackets sum to total tax

### Credits
- [ ] General tax credit applies correctly
- [ ] Earned income credit applies correctly
- [ ] Credits don't exceed tax owed
- [ ] Phase-out calculations are correct

### Data Persistence
- [ ] Gross income persists on reload
- [ ] Calculation results persist
- [ ] Currency symbol updates all amounts

---

## 6. Debt Calculator (/debt)

### Basic Functionality
- [ ] Add debt button creates new debt entry
- [ ] Debt name field accepts text
- [ ] Principal amount accepts numeric input
- [ ] Interest rate accepts decimal input
- [ ] Monthly payment input or calculation works
- [ ] Delete debt button removes entry

### Calculations
- [ ] Interest expense calculates correctly
- [ ] Remaining balance decreases with payments
- [ ] Payoff date shows correctly
- [ ] Total interest over life of debt calculates

### Data Persistence
- [ ] Debt list persists on reload
- [ ] Payment history updates persist

---

## 7. Fire Calculator (/fire-calculator)

### Calculation
- [ ] Desired withdrawal amount accepts numeric input
- [ ] Current investments accepts numeric input
- [ ] Category overrides display
- [ ] FIRE number calculates using 4% rule
- [ ] FIRE number = Desired Annual Withdrawal / 0.04
- [ ] Progress bar shows % of goal achieved
- [ ] Time to FIRE estimates based on savings rate

### Data Persistence
- [ ] Inputs persist on reload
- [ ] Category overrides persist
- [ ] Calculation results update when inputs change

---

## 8. Benchmark (/benchmark)

### Wealth Comparison
- [ ] Net income field accepts numeric input
- [ ] Total assets accepts numeric input
- [ ] Total debts accepts numeric input
- [ ] Age group selector shows all options
- [ ] Education level selector shows all options
- [ ] Calculate/Compare button triggers comparison

### Comparison Data
- [ ] Shows national median for selected group
- [ ] Shows international comparison (if available)
- [ ] Displays user's position relative to median
- [ ] Color coding: green if above median, red if below

### Data Persistence
- [ ] Inputs persist on reload
- [ ] Selected group persists
- [ ] Comparison results persist

---

## 9. Settings (/settings)

### Language Settings
- [ ] All 4 languages selectable (EN, NL, RU, TR)
- [ ] Language change applies to entire app
- [ ] Language preference persists
- [ ] Language icons/labels correct

### Currency Settings
- [ ] All 5 currencies selectable (EUR, USD, GBP, RUB, TRY)
- [ ] Currency symbol updates everywhere
- [ ] Currency preference persists
- [ ] Currency name displays correctly

### Theme Settings
- [ ] Dark mode toggle works
- [ ] Auto mode detects system preference
- [ ] Manual mode overrides system preference
- [ ] Theme persists on reload

### Advanced Settings (if present)
- [ ] Secret settings modal opens/closes
- [ ] All toggles/options function correctly
- [ ] Advanced settings persist

### Reset Data
- [ ] Reset button clears all user data (with confirmation)
- [ ] After reset, default values appear
- [ ] All pages show empty/default state

---

## 10. Sidebar Navigation (Desktop)

### Visibility
- [ ] Visible on desktop (width ≥ 1024px)
- [ ] Hidden on mobile (width < 1024px)
- [ ] Current page highlighted in sidebar
- [ ] All 9 pages listed and navigable

### Links
- [ ] Dashboard link navigates to /dashboard
- [ ] Overview link navigates to /overview
- [ ] Retirement link navigates to /retirement
- [ ] Tax link navigates to /tax
- [ ] Debt link navigates to /debt
- [ ] FIRE link navigates to /fire-calculator
- [ ] Benchmark link navigates to /benchmark
- [ ] Settings link navigates to /settings
- [ ] Home link navigates to /

### Functionality
- [ ] Sidebar closes automatically on mobile when navigating
- [ ] Sidebar close button works
- [ ] Links have proper hover states
- [ ] Active page is clearly highlighted

---

## 11. Mobile Navigation

### Hamburger Menu
- [ ] Visible on mobile (width < 1024px)
- [ ] Hidden on desktop (width ≥ 1024px)
- [ ] Menu icon appears in header
- [ ] Click menu icon opens navigation
- [ ] Click menu icon again closes navigation
- [ ] All navigation links present

### Mobile Transitions
- [ ] Auto-closes menu when navigating to new page
- [ ] Menu position doesn't interfere with content
- [ ] Menu overlay is visually distinct

---

## 12. Global Features

### Dark Mode (All Pages)
- [ ] Background colors change
- [ ] Text colors have sufficient contrast
- [ ] Input fields visible in dark mode
- [ ] Cards and borders visible
- [ ] Charts readable in dark mode
- [ ] Buttons visible and clickable
- [ ] Dark mode applies to sidebar and mobile menu

### Language Switching (All Pages)
- [ ] All page titles translate correctly
- [ ] All form labels translate correctly
- [ ] All button labels translate correctly
- [ ] All category names translate correctly
- [ ] Number format appropriate for language (if applicable)
- [ ] Language persists across page navigation

### Currency Conversion (Relevant Pages)
- [ ] Symbol displays before or after amount correctly
- [ ] Amount values update when currency changes
- [ ] Historical calculations maintain accuracy

### Accessibility
- [ ] Tab navigation works through all interactive elements
- [ ] Form inputs have associated labels
- [ ] Buttons have clear hover states
- [ ] Color not the only indicator of status

---

## 13. Error Handling & Edge Cases

### Invalid Inputs
- [ ] Negative numbers handled gracefully (or rejected)
- [ ] Non-numeric text in numeric fields handled
- [ ] Empty required fields show validation message
- [ ] Very large numbers don't overflow

### Calculation Edge Cases
- [ ] Division by zero prevented (e.g., all incomes = 0)
- [ ] Age validation (retirement age ≥ current age)
- [ ] Expense total never negative
- [ ] Tax never negative

### Data Corruption
- [ ] Corrupted cookie data doesn't crash app
- [ ] Missing localStorage data defaults gracefully
- [ ] Invalid data types convert to safe defaults

### Browser Compatibility
- [ ] App works in Chrome
- [ ] App works in Firefox
- [ ] App works in Safari
- [ ] App works in Edge

---

## 14. Performance & Bundle Size

### Load Time
- [ ] Landing page loads in < 3s
- [ ] Dashboard page loads in < 2s
- [ ] Other pages load in < 2s
- [ ] No jank or stuttering during interactions

### Bundle Size
- [ ] Total shared bundle ≤ 120 kB
- [ ] No page exceeds 8 kB
- [ ] Images optimized (if any)

### Responsiveness
- [ ] Input fields respond immediately to typing
- [ ] Calculations update without lag
- [ ] Page transitions smooth
- [ ] No blocked interactions

---

## 15. Commit & Version Control

### Git History
- [ ] Phase 1 commit: Remove unused imports
- [ ] Phase 2 commit: Extract duplicate logic
- [ ] Phase 3 commit: Create reusable hooks
- [ ] Phase 4 commit: Consolidate contexts
- [ ] Phase 5 commit: Split dashboard
- [ ] Phase 6 commit: Add validation/error handling
- [ ] Phase 7 commit: Tests & QA

### Cleanup Branch
- [ ] Cleanup branch separate from main
- [ ] All commits are logical and descriptive
- [ ] Code review ready

---

## Test Results Summary

| Test Area | Status | Notes |
|-----------|--------|-------|
| Landing Page | PASS/FAIL | |
| Dashboard (Shared) | PASS/FAIL | |
| Dashboard (Separate) | PASS/FAIL | |
| Overview | PASS/FAIL | |
| Retirement | PASS/FAIL | |
| Tax | PASS/FAIL | |
| Debt | PASS/FAIL | |
| FIRE | PASS/FAIL | |
| Benchmark | PASS/FAIL | |
| Settings | PASS/FAIL | |
| Navigation | PASS/FAIL | |
| Dark Mode | PASS/FAIL | |
| Language | PASS/FAIL | |
| Currency | PASS/FAIL | |
| Error Handling | PASS/FAIL | |
| Performance | PASS/FAIL | |

---

## Notes for QA Tester

1. **Data Persistence**: After each major interaction, reload the page to verify data persists
2. **Visual Consistency**: Compare light and dark mode appearances side-by-side
3. **Mobile Testing**: Use Chrome DevTools device emulation and test on real devices if possible
4. **Cross-Browser**: Test in at least 2 different browsers (Chrome and Firefox recommended)
5. **Language Testing**: Change language mid-use to ensure proper switching
6. **Currency Testing**: Change currency and verify all amounts update across all pages

---

## Sign-Off

- [ ] All tests passed
- [ ] No critical bugs remaining
- [ ] Code ready for merge to main branch
- [ ] QA Date: _______________
- [ ] QA Tester Name: _______________

