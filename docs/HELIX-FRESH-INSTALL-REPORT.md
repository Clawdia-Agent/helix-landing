# Helix Fresh Install Report

## Executive Summary

Analysis of all Helix documentation to identify gaps for a seamless fresh installation experience.

---

## 1. What's Already Implemented (Working)

| Component | Location | Status |
|-----------|----------|--------|
| GitHub repo creation | `lib/github.js` | ✅ Works |
| Auto-collaborator invite | `lib/github.js` | ✅ Works |
| Workspace/worktree creation | `lib/workspace-manager.js` | ✅ Works |
| Agent Account mode | `condos-handlers.js` | ✅ Works |
| Services Settings UI | Dashboard Settings | ✅ Works |
| `config.setService` RPC | `config-handlers.js` | ✅ Works |

---

## 2. Documentation Gaps

### 2.1 `docs/skill.md`

**Missing:**
- No mention of GitHub integration
- No explanation that condos auto-create repos when GitHub is configured
- No PM-as-agent workflow (only UI-based workflow described)
- "Click Create Tasks" and "Start Goal" references UI, not agent tools

**Add:**
```markdown
## PM Agent Workflow

When the PM is an agent (not human in UI):

1. Create condo via `condos.create` RPC
   - If GitHub agent account configured → repo auto-created
   - Manager auto-invited as collaborator

2. Create goals with `condo_create_goal` tool
3. Add tasks with `condo_add_task`
4. Spawn workers with `condo_spawn_task`
```

### 2.2 `docs/SKILL-PM.md`

**Missing:**
- No mention of `condo_create_goal`, `condo_spawn_task` tools
- Only describes markdown plan proposals
- No autonomous PM execution flow

**Add:**
```markdown
## Autonomous PM Mode

When operating autonomously (not waiting for UI approval):

1. Use `condo_create_goal` to create goals with initial tasks
2. Use `condo_spawn_task` to spawn worker sessions
3. Monitor via `goal_update` reports from workers
4. Use `team.send` for inter-agent communication
```

### 2.3 `docs/SETUP.md`

**Missing:**
- No "First Run Configuration" wizard section
- GitHub agent account setup scattered, not step-by-step
- No pre-flight checklist

**Add:**
```markdown
## First Run Checklist

After installation, configure in Settings:

1. [ ] Gateway Connection (gatewayWsUrl, token)
2. [ ] Agent Roles (Settings → Roles → Auto-detect or manual)
3. [ ] GitHub Integration (Settings → Services → GitHub)
   - Choose "Agent Account" mode for autonomous work
   - Fill in agentUsername, agentToken, managerUsername
   - Enable autoCollaborator
4. [ ] Workspaces Directory (CLAWCONDOS_WORKSPACES_DIR env var)
5. [ ] Optional: Vercel, Claude API, other services
```

### 2.4 `config.example.json`

**Missing:**
- No services configuration example
- Only has gateway + branding

**Add:**
```json
{
  "services": {
    "github": {
      "authMode": "account",
      "agentUsername": "your-agent-bot",
      "agentToken": "ghp_...",
      "managerUsername": "your-username",
      "autoCollaborator": true,
      "autoTransfer": false
    },
    "vercel": {
      "token": "your-vercel-token",
      "team": "optional-team-slug"
    }
  }
}
```

---

## 3. Gap: PM-as-Agent vs PM-in-UI

### Current State
The docs assume PM is a human using the UI:
- "Click Create Tasks" → "Start Goal" → Workers spawned

### Missing State
When PM is an agent (like Claudia), the workflow is different:
- PM receives request via chat
- PM must use RPC/tools to create condos, goals, spawn workers
- No UI clicks involved

### Solution
Create `docs/SKILL-PM-AGENT.md` or add section to SKILL-PM.md:

```markdown
## Agent-Based PM Workflow

When you ARE the PM (not assisting a human PM):

### Creating a New Project
1. Call `condos.create` via RPC with name and description
2. GitHub repo auto-created if agent account configured
3. Workspace initialized with git

### Planning Work
1. Use `condo_create_goal` with tasks array
2. Each goal gets its own worktree branch
3. Tasks are ready for spawning

### Executing Work
1. Use `condo_spawn_task` to assign agents to tasks
2. Workers receive SKILL-WORKER.md context
3. Workers report via `goal_update`

### Monitoring
- Check goal status via goals.list
- Receive worker updates via session events
- Handle blockers by reassigning or clarifying
```

---

## 4. Recommended Changes Checklist

### High Priority
- [ ] `docs/skill.md` - Add "GitHub Auto-Provisioning" section
- [ ] `docs/skill.md` - Add "PM Agent Workflow" section
- [ ] `docs/SKILL-PM.md` - Add autonomous tools section
- [ ] `docs/SETUP.md` - Add "First Run Checklist"
- [ ] `config.example.json` - Add services.github example

### Medium Priority
- [ ] Create `docs/SKILL-PM-AGENT.md` - Dedicated agent PM doc
- [ ] Add validation warning in UI when creating condo without GitHub config
- [ ] Add onboarding wizard to dashboard (multi-step setup)

### Nice to Have
- [ ] CLI command: `helix setup` - interactive configuration
- [ ] Health check endpoint showing config status
- [ ] Auto-detect unconfigured services and prompt

---

## 5. File Locations for Changes

| File | Path | Change Type |
|------|------|-------------|
| skill.md | `docs/skill.md` | Add sections |
| SKILL-PM.md | `docs/SKILL-PM.md` | Add tools section |
| SETUP.md | `docs/SETUP.md` | Add checklist |
| config.example.json | `./config.example.json` | Add services |
| SKILL-PM-AGENT.md | `docs/SKILL-PM-AGENT.md` | Create new |

---

## 6. Summary

The core functionality EXISTS and WORKS. The gap is documentation that explains:

1. **How GitHub integration triggers** (on condo creation with agent account)
2. **What tools PM agents should use** (not just UI workflows)
3. **First-run configuration checklist** (step-by-step setup)

Once these docs are added, fresh installs will be seamless.
