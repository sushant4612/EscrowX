# Role-Based User Interface Guide

## Overview

The application now features separate, optimized dashboards for Clients and Freelancers, providing a tailored experience for each user type.

## Features

### Role Selector
- Located in the top-right header
- Toggle between "Client" and "Freelancer" views
- Your selection is saved and persists across sessions
- Switch roles anytime to see different perspectives

## Client Dashboard 💼

### What Clients See:

#### Header
- Blue gradient header with "Client Dashboard" title
- Clear indication of your role

#### Statistics Cards
1. **Total Jobs** - All jobs you've created
2. **Pending** - Jobs in progress with locked XLM amount
3. **Awaiting Approval** - Completed jobs waiting for your review
4. **Total Spent** - Total XLM paid to freelancers

#### Main Features

**Create New Job Button**
- Prominent "+ Create New Job" button
- Click to show/hide the job creation form
- Form appears inline for quick access

**Jobs Awaiting Your Approval** (Priority Section)
- Shows completed jobs that need your review
- Pulsing indicator for urgent attention
- Quick approve or dispute actions

**In Progress Jobs**
- Jobs currently being worked on
- Track freelancer progress

**Disputed Jobs**
- Jobs with active disputes
- Red highlight for visibility

**Completed Jobs**
- Successfully completed and paid jobs
- Shows last 3, with count of additional jobs

**Empty State**
- Friendly message with briefcase icon
- "Create Your First Job" call-to-action
- Guides new clients to get started

### Client Actions:
- ✅ Create new jobs
- ✅ Approve completed work
- ✅ Raise disputes
- ✅ View all job statuses

## Freelancer Dashboard 🎯

### What Freelancers See:

#### Header
- Green gradient header with "Freelancer Dashboard" title
- Professional freelancer branding

#### Statistics Cards
1. **Total Jobs** - All jobs assigned to you
2. **Active Jobs** - Jobs currently in progress
3. **Pending Earnings** - XLM waiting to be released
4. **Total Earned** - Total XLM received

#### Main Features

**Active Jobs** (Priority Section)
- Jobs you need to work on
- Pulsing yellow indicator
- "Mark Completed" action available

**Awaiting Client Approval**
- Jobs you've completed
- Waiting for client to approve
- Pulsing blue indicator

**Disputed Jobs**
- Jobs with active disputes
- Red highlight for visibility

**Completed & Paid**
- Successfully completed jobs
- Shows payment received
- Shows last 3, with count of additional jobs

**Empty State**
- Target icon with friendly message
- Shows your Stellar address
- Instructions to share address with clients
- Copy-friendly address display

**Tips Section**
- Helpful tips for freelancers
- Best practices
- Process guidance

### Freelancer Actions:
- ✅ Mark jobs as completed
- ✅ Raise disputes
- ✅ View earnings
- ✅ Track job progress

## Navigation Tabs

### 1. Dashboard Tab
- Shows role-specific dashboard
- Icon changes based on role:
  - 💼 for Client
  - 🎯 for Freelancer
- Color-coded:
  - Blue for Client
  - Green for Freelancer

### 2. History Tab 📊
- View all transactions
- Same for both roles
- Shows complete job history

### 3. Disputes Tab ⚖️
- DAO voting interface
- Arbitrator functions
- Same for both roles

## Visual Design

### Color Coding
- **Client**: Blue theme (#2563eb)
- **Freelancer**: Green theme (#16a34a)
- **Pending**: Yellow (#eab308)
- **Completed**: Blue (#3b82f6)
- **Approved**: Green (#22c55e)
- **Disputed**: Red (#ef4444)

### Status Indicators
- Pulsing dots for urgent items
- Color-coded cards for different statuses
- Clear visual hierarchy

### Animations
- Smooth fade-in for forms
- Pulsing indicators for attention
- Hover effects on buttons

## Usage Examples

### As a Client:

1. **Connect Wallet**
   - Click "Connect Wallet" in header
   - Approve in Freighter

2. **Select Client Role**
   - Click "Client" in role selector
   - Dashboard shows client view

3. **Create a Job**
   - Click "+ Create New Job"
   - Fill in freelancer address, amount, description
   - Submit

4. **Approve Work**
   - Job appears in "Awaiting Your Approval"
   - Review the work
   - Click "Approve & Release Funds"

### As a Freelancer:

1. **Connect Wallet**
   - Click "Connect Wallet" in header
   - Approve in Freighter

2. **Select Freelancer Role**
   - Click "Freelancer" in role selector
   - Dashboard shows freelancer view

3. **View Your Address**
   - See your address in empty state
   - Share with clients

4. **Complete Work**
   - Job appears in "Active Jobs"
   - Do the work
   - Click "Mark Completed"

5. **Get Paid**
   - Wait for client approval
   - Funds automatically released
   - Job moves to "Completed & Paid"

## Testing Both Roles

### Single Wallet Testing:
1. Connect wallet as Client
2. Create a job with your own address as freelancer
3. Switch to Freelancer role
4. See the same job from freelancer perspective
5. Mark as completed
6. Switch back to Client role
7. Approve the job

### Two Wallet Testing:
1. **Wallet A (Client)**:
   - Connect as client
   - Create job with Wallet B address

2. **Wallet B (Freelancer)**:
   - Disconnect Wallet A
   - Connect Wallet B
   - Switch to Freelancer role
   - See assigned job
   - Mark completed

3. **Back to Wallet A**:
   - Disconnect Wallet B
   - Connect Wallet A
   - Switch to Client role
   - Approve job

## Benefits of Role-Based UI

### For Clients:
- ✅ Focus on hiring and approvals
- ✅ Clear overview of spending
- ✅ Easy job creation
- ✅ Priority on pending approvals

### For Freelancers:
- ✅ Focus on work and earnings
- ✅ Clear active job list
- ✅ Easy completion workflow
- ✅ Earnings tracking

### For Both:
- ✅ Reduced clutter
- ✅ Role-appropriate actions
- ✅ Better organization
- ✅ Clearer workflow

## Keyboard Shortcuts (Future)

- `C` - Switch to Client view
- `F` - Switch to Freelancer view
- `N` - New job (Client only)
- `H` - History tab
- `D` - Disputes tab

## Mobile Responsive

Both dashboards are fully responsive:
- Stats cards stack on mobile
- Buttons remain accessible
- Forms adapt to screen size
- Touch-friendly interface

## Accessibility

- Clear role indicators
- Color-blind friendly (not relying only on color)
- Keyboard navigation support
- Screen reader friendly labels
- High contrast text

## Tips

1. **Use the right role** - Switch to the appropriate role for your current task
2. **Check both views** - See how your actions appear to the other party
3. **Role persists** - Your selection is saved, no need to switch every time
4. **Clear indicators** - Look for pulsing dots for urgent items
5. **Empty states help** - Read the empty state messages for guidance

## Troubleshooting

### Jobs not showing?
- Check you're in the correct role
- Verify wallet is connected
- Check the debug info (if enabled)

### Can't create jobs?
- Switch to Client role
- Make sure wallet is connected
- Check you have sufficient balance

### Can't mark completed?
- Switch to Freelancer role
- Verify job is assigned to your address
- Check job status is PENDING

## Future Enhancements

- [ ] Role-based notifications
- [ ] Separate transaction history per role
- [ ] Role-specific analytics
- [ ] Custom role preferences
- [ ] Multi-role support (be both client and freelancer)
- [ ] Role-based filters
- [ ] Quick role switching with keyboard

---

**Enjoy the new role-based interface!** 🎉
