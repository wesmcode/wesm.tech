# Testing Checklist - Accessibility & Mobile Improvements

## ✅ Pre-Deployment Testing Guide

### 1. Local Development Setup

```bash
# Get the latest code
git checkout claude/review-website-accessibility-011CUT1U8iPpK2PV7bLNwifq
git pull

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Open: http://localhost:3000
```

---

## 2. Basic Functionality Tests

- [ ] Website loads without errors (check browser console - F12)
- [ ] Terminal window displays correctly
- [ ] ASCII art renders properly
- [ ] Menu is interactive and visible
- [ ] **Contact Info** menu item works
- [ ] **Resume PDF** opens in new tab
- [ ] **Memoir** modal opens and closes
- [ ] **Exit** redirects to LinkedIn
- [ ] Typewriter animations display (or skip on mobile)
- [ ] No JavaScript errors in console

---

## 3. Keyboard Navigation Tests ⌨️

**Critical for Accessibility:**

- [ ] Press **Tab** → Skip link appears and is visible
- [ ] Press **Tab** again → Focuses on traffic light buttons
- [ ] **Arrow Up/Down** → Navigate menu items
- [ ] **Enter** → Select highlighted menu item
- [ ] **R key** → Returns to menu from any section
- [ ] **Escape** → Closes memoir modal
- [ ] Focus indicators visible on all buttons
- [ ] Tab order is logical throughout app
- [ ] Can reach all interactive elements via keyboard only

**Memoir Modal Focus Trap:**
- [ ] Open memoir → Tab cycles only within modal
- [ ] Can't tab to background content
- [ ] Close button is focusable
- [ ] Escape key closes modal

---

## 4. Mobile Responsiveness Tests 📱

### Test on Real Devices (if available):
- [ ] iPhone (any model)
- [ ] Android phone
- [ ] Tablet (iPad or Android)

### Browser DevTools Emulation:

**Chrome/Edge:**
1. Press `F12`
2. Click device toolbar icon (or `Ctrl+Shift+M`)
3. Test these screen sizes:

#### Phone Sizes:
- [ ] **iPhone SE** (375px) - Check mobile controls visible
- [ ] **iPhone 12 Pro** (390px) - Test touch targets
- [ ] **iPhone 14 Pro Max** (430px) - Verify safe area insets
- [ ] **Samsung Galaxy S20** (360px) - Smallest common size

#### Tablet:
- [ ] **iPad** (768px) - Check breakpoint transition
- [ ] **iPad Pro** (1024px) - Should show desktop view

### What to Check:
- [ ] No horizontal scrolling
- [ ] Mobile control buttons appear at bottom (< 768px)
- [ ] Mobile control buttons are **48px tall** (easy to tap)
- [ ] Touch targets don't overlap
- [ ] ASCII art doesn't overflow
- [ ] Menu items are tappable with finger
- [ ] Modal fits within viewport
- [ ] Text is readable without zooming

**iOS Safe Areas:**
- [ ] Content doesn't hide behind notch
- [ ] Content doesn't hide behind home indicator
- [ ] Padding appears top/bottom on iOS devices

---

## 5. Accessibility Audit 🔍

### Automated Testing:

**Chrome Lighthouse:**
```bash
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" only
4. Click "Generate report"
```

**Target Score: 95-100**

Common issues to check:
- [ ] All buttons have accessible names
- [ ] ARIA roles are valid
- [ ] Color contrast is sufficient (4.5:1 minimum)
- [ ] Form elements have labels
- [ ] Images have alt text
- [ ] Landmark regions are present

**axe DevTools Extension:**
```bash
# Install: https://www.deque.com/axe/devtools/
1. Install browser extension
2. Open DevTools → axe DevTools tab
3. Click "Scan ALL of my page"
```

- [ ] Zero violations
- [ ] Zero incomplete items (or review them)

---

## 6. Screen Reader Testing 🔊

### Windows (NVDA - Free):

**Download:** https://www.nvaccess.org/download/

**Basic Test:**
```bash
1. Start NVDA
2. Navigate with Arrow keys
3. Check announcements:
   - [ ] Menu items announced clearly
   - [ ] Button roles announced
   - [ ] Live regions update (typewriter text)
   - [ ] Modal opening/closing announced
   - [ ] Skip link works
```

### Mac (VoiceOver - Built-in):

**Enable:** `Cmd + F5`

```bash
1. Navigate with Ctrl+Option+Arrow keys
2. Use rotor: Ctrl+Option+U
3. Check:
   - [ ] Landmarks can be navigated (Headers, Links, etc.)
   - [ ] ARIA labels read correctly
   - [ ] Focus follows voice over
```

---

## 7. Browser Compatibility 🌐

### Test in Multiple Browsers:

- [ ] **Chrome** (latest)
  - Animations work
  - Focus styles visible
  - No console errors

- [ ] **Firefox** (latest)
  - CSS renders correctly
  - Modal works
  - Keyboard navigation works

- [ ] **Safari** (if on Mac/iOS)
  - Mobile view works
  - Safe areas respected
  - Transitions smooth

- [ ] **Edge** (latest)
  - Full functionality
  - Same as Chrome (Chromium-based)

**Check Console in Each:**
- [ ] No errors in browser console
- [ ] No ARIA warnings
- [ ] No deprecation notices

---

## 8. Performance Tests ⚡

### Lighthouse Performance:

```bash
1. F12 → Lighthouse
2. Select ALL categories
3. Run audit
```

**Target Scores:**
- [ ] Performance: **90+**
- [ ] Accessibility: **95+**
- [ ] Best Practices: **90+**
- [ ] SEO: **90+**

### Check for:
- [ ] Fast page load (< 3 seconds)
- [ ] Smooth animations
- [ ] No layout shift (CLS < 0.1)
- [ ] Interactive quickly (FID < 100ms)

---

## 9. Reduced Motion Testing ♿

**Enable Reduced Motion:**

**Windows:**
```
Settings → Accessibility → Display → Animation effects → Off
```

**Mac:**
```
System Preferences → Accessibility → Display → Reduce motion
```

**Test:**
- [ ] Typewriter animations are instant (no typing effect)
- [ ] Transitions are immediate
- [ ] No motion sickness triggers
- [ ] All content still accessible

---

## 10. Visual Regression Testing 📸

### Manual Visual Check:

- [ ] Colors are consistent
- [ ] Fonts render correctly
- [ ] Spacing looks good
- [ ] No broken layouts
- [ ] ASCII art aligns properly
- [ ] Menu items spaced correctly
- [ ] Modal centered on screen

### Compare Before/After:
- [ ] Take screenshots of old version
- [ ] Compare with new version
- [ ] Verify no unintended changes

---

## 11. Integration Tests 🔗

### External Links:
- [ ] LinkedIn link works (red button)
- [ ] LinkedIn link works (exit menu)
- [ ] Resume PDF loads correctly
- [ ] All links open in new tab
- [ ] Links have `noopener,noreferrer` (security)

### Modal Interactions:
- [ ] Modal overlay blocks background clicks
- [ ] Click outside closes modal
- [ ] Close button works
- [ ] Escape key closes modal
- [ ] Focus returns to trigger after close

---

## 12. Error Handling 🐛

### Test Error States:
- [ ] Resume PDF missing → Check behavior
- [ ] Slow network → Loading states work
- [ ] Popup blocked → User sees alert/message
- [ ] JavaScript disabled → Graceful degradation

---

## 🎯 Priority Issues to Catch

### Critical (Must Fix):
1. Site doesn't load
2. Keyboard navigation broken
3. Mobile controls don't work
4. Accessibility score < 90
5. Console errors present

### High Priority:
1. Screen reader issues
2. Focus trap not working
3. Touch targets too small
4. Horizontal scrolling on mobile
5. Missing ARIA labels

### Medium Priority:
1. Performance score < 90
2. Visual inconsistencies
3. Animation glitches
4. Browser-specific bugs

---

## ✅ Sign-Off Checklist

Before deploying to production:

- [ ] All critical tests passed
- [ ] Lighthouse accessibility score 95+
- [ ] Works on 3+ browsers
- [ ] Works on mobile (tested)
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Screen reader tested (at least one)
- [ ] Performance acceptable
- [ ] Visual review complete
- [ ] Code reviewed and merged

---

## 🚀 Deployment Commands

Once all tests pass:

```bash
# Merge to main branch
git checkout main
git merge claude/review-website-accessibility-011CUT1U8iPpK2PV7bLNwifq

# Push to production
git push origin main

# Or create PR for review first
gh pr create --base main --head claude/review-website-accessibility-011CUT1U8iPpK2PV7bLNwifq
```

---

## 📞 Support Resources

**Accessibility Testing Tools:**
- NVDA: https://www.nvaccess.org/
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/extension/
- Lighthouse: Built into Chrome DevTools

**Documentation:**
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

**Need Help?**
- Check console errors first
- Review commit messages for changes
- Test on clean browser (incognito mode)
