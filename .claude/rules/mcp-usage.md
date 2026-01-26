# MCP Server Usage Guidelines

## Available MCP Servers

### 1. Context7 MCP Server
**Purpose**: Fetch up-to-date, version-specific documentation for libraries and frameworks.

**When to Use**:
- Implementing new Next.js 15 App Router features
- Using React 19 APIs
- Working with Framer Motion animations
- Implementing GSAP ScrollTrigger patterns
- Checking Tailwind CSS utility classes
- Verifying next-intl API usage

**How to Use**:
Query Context7 before implementing features to get current API documentation:
```
"Get me the latest Next.js 15 App Router metadata API documentation"
"Show me React 19 useTransition hook syntax"
"Fetch GSAP ScrollTrigger trigger options documentation"
```

**Benefits**:
- Avoids hallucinated APIs that don't exist
- Ensures version-specific syntax (Next.js 15, not 13 or 14)
- Provides official examples from documentation
- Reduces debugging time from outdated patterns

### 2. shadcn MCP Server
**Purpose**: Browse, search, and install shadcn/ui components.

**When to Use**:
- Adding new UI components (dialog, dropdown, accordion, etc.)
- Exploring available component variants
- Getting installation commands
- Viewing component implementation examples

**How to Use**:
```
"Search shadcn components for dialog"
"Get installation command for accordion component"
"Show me examples of dropdown menu usage"
```

**Project Integration**:
Check if shadcn is already configured:
```bash
# Check for components.json
ls components.json

# Check for ui components
ls components/ui
```

If not configured, initialize:
```bash
npx shadcn@latest init
```

### 3. GSAP Master MCP Server
**Purpose**: Expert-level GSAP animation implementation and debugging.

**When to Use**:
- Creating complex scroll-triggered animations
- Implementing parallax effects
- Debugging animation performance issues
- Optimizing GSAP code for 60fps
- Understanding advanced ScrollTrigger options

**Available Commands**:
- `understand_and_create_animation`: Natural language animation requests
- `get_gsap_api_expert`: Deep dive into GSAP methods/plugins
- `generate_complete_setup`: Generate GSAP environment setup
- `debug_animation_issue`: Expert debugging assistance
- `optimize_for_performance`: 60fps optimization
- `create_production_pattern`: Battle-tested patterns

**How to Use**:
```
"Create a staggered fade-in animation for course cards on scroll"
"Debug why my ScrollTrigger animations are janky"
"Optimize this GSAP code for mobile performance"
"Generate a hero entrance animation with text reveal"
```

**Project Context**:
Current GSAP usage in project:
- Hero section: Parallax effects on scroll
- Should use: ScrollTrigger, smooth scrubbing
- Performance target: 60fps on desktop, 30fps minimum on mobile

### 4. Magic UI MCP Server
**Purpose**: Access to React component library with animations.

**When to Use**:
- Need pre-built animated components
- Looking for modern UI patterns
- Want production-ready component code

**How to Use**:
```
"Search Magic UI for animated card components"
"Show me hero section templates"
"Get installation for animated counter component"
```

### 5. Claude in Chrome MCP Server
**Purpose**: Browser automation, testing, and visual verification.

**When to Use**:
- Testing the deployed site visually
- Verifying responsive design at different breakpoints
- Testing form submissions
- Checking cross-browser compatibility
- Taking screenshots of the site

**How to Use**:
```
"Navigate to localhost:3000 and take a screenshot"
"Test the contact form submission"
"Resize window to mobile and check header layout"
"Verify all 4 language options work in the switcher"
```

**Important**: Always get tab context first:
```
tabs_context_mcp()  # Get available tabs
```

## MCP Best Practices

### 1. Query Before Implementing
Don't guess API syntax - query Context7 first:
```
❌ BAD: Implement next-intl routing based on memory
✅ GOOD: Query Context7 for Next.js 15 + next-intl routing docs
```

### 2. Use Specific Version Numbers
Always specify versions when querying:
```
❌ BAD: "How does Next.js routing work?"
✅ GOOD: "Next.js 15.5.9 App Router dynamic routes documentation"
```

### 3. Combine MCP Servers
Use multiple servers together for better results:
```
1. Context7 → Get official GSAP ScrollTrigger docs
2. GSAP Master MCP → Generate optimized animation code
3. Claude in Chrome → Test animation in live browser
```

### 4. Minimize Context Bloat
- Don't query documentation you don't immediately need
- Use specific queries, not broad requests
- Reference MCP results, then dismiss to free context

### 5. Verify with Official Docs
After getting MCP results, cross-reference with official docs if something seems off.

## Project-Specific MCP Workflows

### Adding New UI Component
```
1. Search shadcn MCP for component
2. View component examples
3. Get installation command
4. Install component
5. Query Context7 for latest API if using new features
6. Implement with project design system overrides
7. Test with Claude in Chrome MCP
```

### Creating New Animation
```
1. Query GSAP Master MCP with natural language description
2. Get generated GSAP code
3. Query Context7 for ScrollTrigger options documentation
4. Integrate into component
5. Test performance with browser
6. Optimize if needed with GSAP Master MCP
```

### Implementing New Feature
```
1. Query Context7 for relevant framework/library docs
2. Review current API syntax and best practices
3. Check if shadcn/Magic UI has pre-built components
4. Implement feature using up-to-date patterns
5. Test functionality with Claude in Chrome
```

### Debugging Issues
```
1. Query Context7 for official error documentation
2. If animation issue, use GSAP Master MCP debug tool
3. Test live in browser with Chrome MCP
4. Iterate based on findings
```

## MCP Server Configuration

### Checking Configured Servers
```bash
# View MCP configuration
cat ~/.config/claude-code/mcp.json

# Or check project-specific config
cat .mcp.json
```

### Adding New MCP Server
If an MCP server isn't available:
1. Find the server on npmjs.com or GitHub
2. Add to MCP configuration
3. Restart Claude Code
4. Verify server is available

## Context7 Quick Reference

### Supported Libraries (Project-Relevant)
- next (Next.js)
- react
- next-intl
- framer-motion
- gsap
- tailwindcss
- typescript
- react-hook-form (if adding forms)

### Query Patterns
```
"Context7: next@15.5.9 metadata API"
"Context7: next-intl server vs client usage"
"Context7: gsap ScrollTrigger markers option"
"Context7: framer-motion animate prop types"
```

## GSAP Master MCP Quick Reference

### Common Animation Requests
```
"Fade in hero title with letter-by-letter reveal"
"Parallax background on scroll with image zoom"
"Staggered card entrance animation"
"Smooth scroll to section on button click"
"Horizontal scroll gallery with ScrollTrigger"
```

### Performance Optimization
```
"Optimize this animation for mobile devices"
"Reduce jank in scroll-triggered animations"
"Convert CSS animation to GSAP for better performance"
```

## Integration with frontend-design Skill

When using frontend-design skill:
1. **Context7**: Query for latest component patterns
2. **shadcn/Magic UI**: Find pre-built components to enhance
3. **GSAP Master**: Generate animations for design
4. **Claude in Chrome**: Test visual output

### Example Workflow
```
User: "Use frontend-design to create an AWWWARDS-level hero"

1. Query Context7: "Next.js 15 Image component optimization"
2. Query GSAP Master: "Hero entrance animation with text reveal"
3. Search shadcn: "Button component with variants"
4. Generate design with frontend-design skill
5. Test with Chrome MCP: Visual verification
```

## Troubleshooting MCP Issues

### MCP Server Not Responding
```bash
# Restart Claude Code
# Check MCP server logs
# Verify network connectivity
```

### Context7 Returns Outdated Info
```
# Be more specific with version numbers
# Clear cache if available
# Query official docs directly as fallback
```

### GSAP Master MCP Generates Complex Code
```
# Request "simple" or "minimal" version
# Ask for step-by-step breakdown
# Request performance-optimized version
```

## MCP Security Notes

- MCP servers have access to specified resources only
- Context7: Read-only documentation access
- Chrome MCP: Browser automation with user permission
- Never expose sensitive data to MCP servers
- Review generated code before applying

## Future MCP Integrations

Consider adding:
- **Figma MCP**: Import designs directly
- **GitHub MCP**: PR review and issue management
- **Vercel MCP**: Deployment automation
- **Notion MCP**: Content management integration
