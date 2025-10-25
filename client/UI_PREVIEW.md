# 🎨 UI Preview - DAO Voting Dashboards

## 🌈 Color Themes

Each role has a unique color theme for easy identification:

- **💼 Freelancer:** Green theme (`from-green-50 to-emerald-100`)
- **👔 Client:** Blue theme (`from-blue-50 to-cyan-100`)
- **⚖️ Arbitrator:** Purple theme (`from-purple-50 to-indigo-100`)

---

## 💼 Freelancer Dashboard

### Header Section:
```
┌─────────────────────────────────────────────────────────┐
│  💼 Freelancer Dashboard                  Total Earned  │
│  Manage your gigs and earnings            125.50 XLM    │
└─────────────────────────────────────────────────────────┘
```

### Stats Cards (4 columns):
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Active Jobs  │ │ Pending      │ │ Completed    │ │ Disputes     │
│     🚀       │ │ Review ⏳    │ │     ✅       │ │     ⚖️      │
│      3       │ │      1       │ │      8       │ │      0       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Active Jobs Section:
```
┌─────────────────────────────────────────────────────────┐
│ Build Website                              50 XLM       │
│ Job #a3f8b2c1                         [IN PROGRESS]     │
│                                                          │
│ [✅ Mark as Completed]                                  │
└─────────────────────────────────────────────────────────┘
```

### Pending Review Section:
```
┌─────────────────────────────────────────────────────────┐
│ Logo Design                                25 XLM       │
│ Waiting for client approval...        [UNDER REVIEW]    │
│                                                          │
│ If client doesn't approve, raise a dispute:             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Provide evidence (screenshots, messages...)         │ │
│ └─────────────────────────────────────────────────────┘ │
│ [⚖️ Raise Dispute]                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 👔 Client Dashboard

### Header Section:
```
┌─────────────────────────────────────────────────────────┐
│  👔 Client Dashboard                      Total Spent   │
│  Manage your projects and payments        250.00 XLM    │
└─────────────────────────────────────────────────────────┘
```

### Stats Cards (4 columns):
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Active       │ │ Pending      │ │ Locked       │ │ Disputes     │
│ Projects 📋  │ │ Review 👀    │ │ Funds 🔒     │ │     ⚖️      │
│      2       │ │      1       │ │   75.00 XLM  │ │      0       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Pending Review Section:
```
┌─────────────────────────────────────────────────────────┐
│ Build Website                              50 XLM       │
│ ⏳ Freelancer marked as completed     [REVIEW NEEDED]   │
│                                                          │
│ [✅ Approve & Release Funds]                            │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Not satisfied? Provide evidence and raise dispute:  │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Explain why work is unsatisfactory...           │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │ [⚖️ Reject & Raise Dispute]                         │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## ⚖️ Arbitrator Dashboard

### Header Section:
```
┌─────────────────────────────────────────────────────────┐
│  ⚖️ Arbitrator DAO                    Voting Power      │
│  Vote on disputes and earn rewards           5          │
└─────────────────────────────────────────────────────────┘
```

### Stats Cards (3 columns):
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Wallet Balance   │ │ Total Staked     │ │ Total Votes      │
│      💰          │ │      🔒          │ │      🗳️         │
│   150.50 XLM     │ │    50.00 XLM     │ │        12        │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Staking Section (Purple Gradient):
```
┌─────────────────────────────────────────────────────────┐
│  🏦 Stake to Become Arbitrator                          │
│                                                          │
│  Stake XLM to gain voting power. Each 10 XLM = 1       │
│  voting power. Earn rewards for correct votes!          │
│                                                          │
│  ┌──────────────────────────┐  [🔒 Stake Now]          │
│  │ Amount (min 10 XLM): 20  │                           │
│  └──────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

### Active Disputes Section:
```
┌─────────────────────────────────────────────────────────┐
│  Dispute #f3a8c2d1                          [2/3 VOTES] │
│                                                          │
│  Job: Build website                                     │
│  Amount: 50 XLM                                         │
│                                                          │
│  ┌──────────────────────────┐ ┌──────────────────────┐ │
│  │ 👔 Client Evidence:      │ │ 💼 Freelancer        │ │
│  │                          │ │    Evidence:         │ │
│  │ Website doesn't work     │ │ All features done    │ │
│  │ Missing features         │ │ Screenshots attached │ │
│  └──────────────────────────┘ └──────────────────────┘ │
│                                                          │
│  Vote Progress:                                         │
│  Client: 1 vote          Freelancer: 1 vote            │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                          │
│  Your vote stake (min 10 XLM):                          │
│  ┌──────────────────────────┐                           │
│  │ 10                       │                           │
│  └──────────────────────────┘                           │
│                                                          │
│  [👔 Vote Client]  [💼 Vote Freelancer]                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Role Switcher (Top-Right)

```
┌─────────────────────────────────────┐
│ Select Role:                        │
│                                     │
│ [💼 Freelancer] [👔 Client] [⚖️ Arbitrator] │
└─────────────────────────────────────┘
```

Active role is highlighted in its theme color:
- Freelancer: Green background
- Client: Blue background
- Arbitrator: Purple background

---

## 📱 Responsive Design

All dashboards are fully responsive:
- Desktop: Full-width cards with grid layouts
- Tablet: Stacked cards with 2-column grids
- Mobile: Single column, full-width buttons

---

## 🎨 Design Elements

### Cards:
- White background
- Rounded corners (`rounded-xl`)
- Shadow (`shadow-lg`)
- Hover effects (`hover:shadow-xl`)

### Buttons:
- Large, prominent CTAs
- Role-specific colors
- Hover transitions
- Disabled states for loading

### Stats:
- Large numbers (3xl font)
- Emoji icons (4xl)
- Color-coded by role
- Clear labels

### Forms:
- Rounded inputs
- Focus rings
- Placeholder text
- Validation feedback

### Progress Bars:
- Dual-color (client vs freelancer)
- Smooth animations
- Percentage-based widths
- Clear labels

---

## 🌟 Special Effects

### Gradients:
```css
/* Freelancer */
bg-gradient-to-br from-green-50 to-emerald-100

/* Client */
bg-gradient-to-br from-blue-50 to-cyan-100

/* Arbitrator */
bg-gradient-to-br from-purple-50 to-indigo-100

/* Staking Section */
bg-gradient-to-r from-purple-600 to-indigo-600
```

### Shadows:
```css
/* Cards */
shadow-lg hover:shadow-xl

/* Header */
shadow-xl

/* Buttons */
hover:shadow-md
```

### Transitions:
```css
/* All interactive elements */
transition

/* Smooth color changes */
transition-colors

/* Transform effects */
transition-transform
```

---

## 🎯 Status Badges

### Job Status:
- `PENDING` → Yellow badge
- `COMPLETED` → Blue badge
- `APPROVED` → Green badge
- `DISPUTED` → Red badge
- `RESOLVED` → Purple badge

### Dispute Status:
- `ACTIVE` → Purple badge with vote count
- `RESOLVED` → Green badge with winner

---

## 💡 User Experience

### Clear Hierarchy:
1. Header with role and main stat
2. Stats cards for quick overview
3. Action sections with CTAs
4. Evidence/details in expandable areas

### Intuitive Actions:
- Big, colorful buttons
- Clear labels with emojis
- Confirmation dialogs
- Success/error alerts

### Real-time Feedback:
- Loading states
- Transaction confirmations
- Vote progress updates
- Balance changes

---

**The UI is production-ready and looks amazing!** 🎨✨
