# Phase 9A QA Checklist

## Module-by-Module Manual Tests

### Core Navigation & Functionality
- [ ] Hero page routes correctly to each module
- [ ] No console errors across any page

### Strategy Module
- [ ] Strategy generates on valid inputs
- [ ] Unauthorized users are redirected from `/strategy` if not on trial/subscribed

### Journal Module
- [ ] Journal form saves to Supabase
- [ ] AI reflections return insights for journal entries
- [ ] Unauthorized users are redirected from `/journal` if not on trial/subscribed

### Wallet Module
- [ ] Wallet screen renders token cards by chain
- [ ] TX verification works w/ dummy hash

### Academy Module
- [ ] Academy loads lessons + tracks completion
- [ ] Quiz gives feedback + renders badge
- [ ] Non-subscribed users are blocked from starting quizzes

### Vision Module
- [ ] Vision overlay renders correctly
- [ ] Unauthorized users are redirected from `/vision`

### Backtest Module
- [ ] Backtest runs with valid inputs
- [ ] Unauthorized users are redirected from `/backtest`

### Admin Panel
- [ ] Admin panel shows accurate KPIs
- [ ] Role editor updates user privileges
- [ ] Non-admin users are redirected from `/admin` 