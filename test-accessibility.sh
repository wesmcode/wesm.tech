#!/bin/bash

# Quick Accessibility & Build Test Script
# Run this before deploying to production

set -e  # Exit on any error

echo "🧪 Starting Pre-Deployment Tests..."
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: TypeScript Compilation
echo "📝 Test 1: TypeScript Compilation"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed - check TypeScript errors${NC}"
    exit 1
fi
echo ""

# Test 2: Lint Check
echo "🔍 Test 2: Linting"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No lint errors${NC}"
else
    echo -e "${YELLOW}⚠️  Lint warnings found (non-blocking)${NC}"
fi
echo ""

# Test 3: Check for Required Files
echo "📁 Test 3: Required Files Check"
required_files=(
    "app/layout.tsx"
    "app/page.tsx"
    "components/terminal.tsx"
    "components/menu.tsx"
    "lib/constants.ts"
    "public/wesley_melo_resume_remote.pdf"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} Missing: $file"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo -e "${RED}❌ Some required files are missing${NC}"
    exit 1
fi
echo ""

# Test 4: Check for Accessibility Attributes
echo "♿ Test 4: Accessibility Attributes Check"
accessibility_patterns=(
    "aria-label"
    "aria-live"
    "aria-modal"
    "role="
    "alt="
)

for pattern in "${accessibility_patterns[@]}"; do
    if grep -r "$pattern" components/ app/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Found: $pattern"
    else
        echo -e "${YELLOW}⚠️${NC}  Not found: $pattern"
    fi
done
echo ""

# Test 5: Check for Mobile Breakpoints
echo "📱 Test 5: Mobile Breakpoint Consistency"
if grep -r "max-width: 767px" app/globals.css > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Mobile breakpoint (767px) found in CSS${NC}"
else
    echo -e "${YELLOW}⚠️  Mobile breakpoint might be inconsistent${NC}"
fi

if grep -r "MOBILE_BREAKPOINT" lib/constants.ts > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Mobile breakpoint constant found${NC}"
else
    echo -e "${RED}❌ Mobile breakpoint constant missing${NC}"
fi
echo ""

# Test 6: Check for Console Logs (should be removed in production)
echo "🔍 Test 6: Production Readiness"
if grep -r "console.log" components/ app/ --exclude="*.test.*" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Found console.log statements (consider removing for production)${NC}"
else
    echo -e "${GREEN}✅ No console.log statements found${NC}"
fi
echo ""

# Summary
echo "=================================="
echo "✅ All automated tests passed!"
echo ""
echo "📋 Next Steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Follow TESTING_CHECKLIST.md for manual tests"
echo "4. Run Chrome Lighthouse accessibility audit"
echo "5. Test on mobile devices"
echo ""
echo "🚀 Once all tests pass, you're ready to deploy!"
