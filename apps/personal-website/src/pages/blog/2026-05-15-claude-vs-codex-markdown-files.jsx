import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-05-15-claude-vs-codex-markdown-files",
  title: "Claude Code vs Codex: The Markdown Files That Matter",
  description:
    "A practical comparison of Claude Code and Codex customization through Markdown files: AGENTS.md, CLAUDE.md, skills, agents, commands, projects, hooks, MCP, and plugins.",
  excerpt:
    "Claude Code and Codex both use plain Markdown as the control surface for agent behavior, but they organize it differently. Here is where AGENTS.md, CLAUDE.md, skills, agents, projects, hooks, MCP, and plugins fit.",
  tags: ["AI", "Claude Code", "Codex", "Markdown", "Agents", "Skills"],
  datePublished: "2026-05-15",
  dateModified: "2026-05-15",
  image: "/media/blogwordcloud.png",
  readingTime: "~6 min",
};

const title = "Claude Code vs Codex: The Markdown Files That Matter";

const tags = ["AI", "Claude Code", "Codex", "Markdown", "Agents", "Skills"];

const rows = [
  {
    layer: "Project memory",
    claude: "`CLAUDE.md` at repo, parent, user, or managed scope.",
    codex: "`AGENTS.md` at global, repo, and nested directory scope.",
    take: "This is the durable project constitution.",
  },
  {
    layer: "Reusable workflows",
    claude: "`.claude/skills/<name>/SKILL.md` and legacy `.claude/commands/*.md`.",
    codex: "`.agents/skills/<name>/SKILL.md` or user-level skills.",
    take: "Use skills when instructions become a repeatable procedure.",
  },
  {
    layer: "Specialized agents",
    claude: "`.claude/agents/*.md` with YAML frontmatter and a Markdown prompt.",
    codex: "Subagents configured as roles for delegated parallel work.",
    take: "Use agents for bounded roles, not for every checklist.",
  },
  {
    layer: "Commands",
    claude: "Slash commands and skills are invoked with `/name`.",
    codex: "Slash commands control the app; skills can be invoked explicitly with `$` in the app.",
    take: "Commands are user interface shortcuts; skills are workflow packaging.",
  },
  {
    layer: "External systems",
    claude: "Model Context Protocol servers, hooks, settings, plugins.",
    codex: "Model Context Protocol, plugins, app connectors, automations, browser/computer tools.",
    take: "Markdown should point to tools; it should not become a fake integration layer.",
  },
];

const principles = [
  "Keep project guidance short and stable.",
  "Move long procedures into skills.",
  "Move role-specific behavior into agents or subagents.",
  "Move deterministic checks into scripts, hooks, linters, or CI.",
  "Use Model Context Protocol when the agent needs live systems outside the repository.",
];

const migrationMap = [
  {
    claude: "Root `CLAUDE.md`",
    codex: "Root `AGENTS.md`",
    note: "Translate durable repo rules, commands, test expectations, and architecture notes.",
  },
  {
    claude: "Nested `CLAUDE.md`",
    codex: "Nested `AGENTS.md` or `AGENTS.override.md`",
    note: "Use this for package-specific rules in monorepos.",
  },
  {
    claude: "`.claude/skills/foo/SKILL.md`",
    codex: "`.agents/skills/foo/SKILL.md`",
    note: "Usually portable if the skill is mostly Markdown and references local scripts clearly.",
  },
  {
    claude: "`.claude/agents/reviewer.md`",
    codex: "Codex subagent definition or explicit parallel-agent prompt",
    note: "Preserve the role, tools, output contract, and when to use it.",
  },
  {
    claude: "`.claude/settings.json` and hooks",
    codex: "Codex config, hooks/rules where available, or repository scripts",
    note: "Do not blindly convert JSON settings. Re-check permissions and lifecycle events.",
  },
];

const sourceLinks = [
  {
    label: "OpenAI Codex: Custom instructions with AGENTS.md",
    href: "https://developers.openai.com/codex/guides/agents-md",
  },
  {
    label: "OpenAI Codex: Customization",
    href: "https://developers.openai.com/codex/concepts/customization",
  },
  {
    label: "OpenAI Codex: Subagents",
    href: "https://developers.openai.com/codex/concepts/subagents",
  },
  {
    label: "Anthropic Claude Code: Memory",
    href: "https://docs.anthropic.com/en/docs/claude-code/memory",
  },
  {
    label: "Claude Code Docs: Skills",
    href: "https://code.claude.com/docs/en/skills",
  },
  {
    label: "Claude Code Docs: Subagents",
    href: "https://code.claude.com/docs/en/sub-agents",
  },
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.85,
  color: "var(--mui-palette-text-primary)",
};

const mutedTextSx = {
  fontSize: "1.05rem",
  lineHeight: 1.75,
  color: "var(--mui-palette-text-secondary)",
};

const headingSx = {
  fontSize: { xs: "1.55rem", md: "2rem" },
  fontWeight: 700,
  color: "var(--mui-palette-text-primary)",
};

const codeSx = {
  px: 0.6,
  py: 0.2,
  borderRadius: 1,
  backgroundColor: "var(--mui-palette-action-hover)",
  fontFamily: "var(--mui-fontFamily-mono, monospace)",
  fontSize: "0.95em",
};

function InlineCode({ children }) {
  return (
    <Box component="code" sx={codeSx}>
      {children}
    </Box>
  );
}

function Section({ title: sectionTitle, children }) {
  return (
    <Box component="section" sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h2" sx={headingSx}>
        {sectionTitle}
      </Typography>
      {children}
    </Box>
  );
}

function List({ items }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 3, display: "grid", gap: 1.25 }}>
      {items.map((item) => (
        <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
          {item}
        </Typography>
      ))}
    </Box>
  );
}

function ComparisonTable() {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box
        component="table"
        sx={{
          width: "100%",
          minWidth: 760,
          borderCollapse: "collapse",
          border: "1px solid var(--mui-palette-divider)",
        }}
      >
        <Box component="thead" sx={{ backgroundColor: "var(--mui-palette-action-hover)" }}>
          <Box component="tr">
            {["Layer", "Claude Code", "Codex", "Practical take"].map((heading) => (
              <Box
                key={heading}
                component="th"
                sx={{
                  p: 1.5,
                  textAlign: "left",
                  borderBottom: "1px solid var(--mui-palette-divider)",
                  color: "var(--mui-palette-text-primary)",
                  fontWeight: 700,
                }}
              >
                {heading}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row) => (
            <Box component="tr" key={row.layer}>
              <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid var(--mui-palette-divider)", verticalAlign: "top", fontWeight: 700 }}>
                {row.layer}
              </Box>
              <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid var(--mui-palette-divider)", verticalAlign: "top" }}>
                {row.claude.split(/(`[^`]+`)/g).map((part) =>
                  part.startsWith("`") ? <InlineCode key={part}>{part.slice(1, -1)}</InlineCode> : part,
                )}
              </Box>
              <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid var(--mui-palette-divider)", verticalAlign: "top" }}>
                {row.codex.split(/(`[^`]+`)/g).map((part) =>
                  part.startsWith("`") ? <InlineCode key={part}>{part.slice(1, -1)}</InlineCode> : part,
                )}
              </Box>
              <Box component="td" sx={{ p: 1.5, borderBottom: "1px solid var(--mui-palette-divider)", verticalAlign: "top" }}>
                {row.take}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function MigrationTable() {
  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      {migrationMap.map((item) => (
        <Box
          key={item.claude}
          sx={{
            p: 2,
            border: "1px solid var(--mui-palette-divider)",
            borderRadius: 1,
            backgroundColor: "var(--mui-palette-background-paper)",
            display: "grid",
            gap: 1,
          }}
        >
          <Typography variant="body1" sx={bodyTextSx}>
            <InlineCode>{item.claude}</InlineCode> to <InlineCode>{item.codex}</InlineCode>
          </Typography>
          <Typography variant="body2" sx={mutedTextSx}>
            {item.note}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tags.map((tag) => (
          <Box
            key={tag}
            component="img"
            src={`https://img.shields.io/badge/${encodeURIComponent(
              tag.replace(/\s+/g, "_"),
            )}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
            alt={`${tag} badge`}
            loading="lazy"
            decoding="async"
            sx={{ height: 28, width: "auto" }}
          />
        ))}
      </Box>

      <Box component="section" sx={{ display: "grid", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.95rem", md: "2.7rem" },
            fontWeight: 800,
            lineHeight: 1.15,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The real user interface for coding agents is not the chat box. It is the little pile of
          Markdown files sitting in and around the repository.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Claude Code and Codex both understand this. They just name the layers differently. Claude
          starts with <InlineCode>CLAUDE.md</InlineCode>. Codex starts with{" "}
          <InlineCode>AGENTS.md</InlineCode>. Both then add skills, agents, settings, commands, and
          tool connections around that center.
        </Typography>
        <Box
          sx={{
            borderLeft: "4px solid var(--mui-palette-primary-main)",
            pl: 2,
            py: 1.5,
            backgroundColor: "var(--mui-palette-action-hover)",
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={bodyTextSx}>
            My rule of thumb: <InlineCode>AGENTS.md</InlineCode> or{" "}
            <InlineCode>CLAUDE.md</InlineCode> is for standing policy.{" "}
            <InlineCode>SKILL.md</InlineCode> is for repeatable work. Agent files are for specialist
            roles. Settings and hooks are for enforcement.
          </Typography>
        </Box>
      </Box>

      <Section title="The Short Version">
        <ComparisonTable />
      </Section>

      <Section title="Project Files">
        <Typography variant="body1" sx={bodyTextSx}>
          In Claude Code, <InlineCode>CLAUDE.md</InlineCode> is memory. It can live at project,
          user, and enterprise scope. Claude also supports imports using{" "}
          <InlineCode>@path/to/file</InlineCode>, so a small top-level memory file can point to more
          detailed docs without copying everything into one place.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          In Codex, <InlineCode>AGENTS.md</InlineCode> is the equivalent durable guidance layer.
          Codex reads global guidance from the Codex home directory and then walks from the project
          root down to the current working directory. Files closer to the current directory win
          because they appear later in the instruction chain.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          That makes <InlineCode>AGENTS.md</InlineCode> slightly more natural for monorepos. Put
          broad rules at the root. Put package rules closer to the package. Do not make the root
          file carry every team&apos;s local weirdness.
        </Typography>
      </Section>

      <Section title="Skills">
        <Typography variant="body1" sx={bodyTextSx}>
          Skills are where both tools are converging. A skill is a folder with a{" "}
          <InlineCode>SKILL.md</InlineCode> file and, optionally, scripts, references, examples, or
          assets. The important design idea is progressive disclosure: the agent sees enough
          metadata to know the skill exists, but the full instructions and references load only when
          the skill is used.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          In Claude Code, skills live under <InlineCode>~/.claude/skills</InlineCode> or{" "}
          <InlineCode>.claude/skills</InlineCode>. Existing{" "}
          <InlineCode>.claude/commands</InlineCode> Markdown files still work, but skills are the
          richer form because they can bundle supporting files and invocation controls.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          In Codex, repository skills live under <InlineCode>.agents/skills</InlineCode>, while
          user-level skills live in the user skills directory. Codex can pick skills implicitly from
          their description, and in the app you can also invoke skills explicitly.
        </Typography>
      </Section>

      <Section title="Agents">
        <Typography variant="body1" sx={bodyTextSx}>
          Claude Code has first-class subagent files under <InlineCode>.claude/agents</InlineCode>{" "}
          and <InlineCode>~/.claude/agents</InlineCode>. They are Markdown files with YAML
          frontmatter: name, description, allowed tools, model, permission mode, memory, and then a
          role prompt in the body. That is neat because it makes a reviewer, debugger, researcher,
          or release manager visible as a versioned artifact.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Codex also supports subagent workflows, but the mental model is a little different. The
          main agent can delegate bounded work to specialized agents, often in parallel, then merge
          the summaries back into the main thread. That is useful for read-heavy work: security
          review, test gap analysis, log triage, or documentation sweeps.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Do not overuse agents. If the task is a checklist, make a skill. If the task is a
          recurring role with its own tools, output format, and judgment, make an agent.
        </Typography>
      </Section>

      <Section title="Projects, Commands, Hooks">
        <Typography variant="body1" sx={bodyTextSx}>
          The word &quot;project&quot; hides several layers. There is the repository. There is the
          agent&apos;s current working directory. There are user-level defaults. There are managed or
          enterprise defaults. Both Claude and Codex merge these layers, so location matters.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Claude&apos;s command story grew from Markdown slash commands into skills. A file such as{" "}
          <InlineCode>.claude/commands/deploy.md</InlineCode> and a skill such as{" "}
          <InlineCode>.claude/skills/deploy/SKILL.md</InlineCode> both create a command-like entry,
          but the skill can carry more structure.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Claude also has hooks: shell commands, HTTP endpoints, or prompt hooks that run at points
          in the lifecycle. This is where deterministic behavior belongs. If you need to block
          destructive shell commands, run a formatter, inspect a prompt, or trigger validation, a
          hook or script is better than another paragraph of pleading in a Markdown file.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Codex has its own command, config, rules, plugin, and automation layers. The same
          principle applies: use Markdown for guidance, tools for action, and CI for proof.
        </Typography>
      </Section>

      <Section title="Migration Map">
        <Typography variant="body1" sx={bodyTextSx}>
          If you are moving a repo between Claude Code and Codex, do not start by copying every file.
          Translate intent layer by layer.
        </Typography>
        <MigrationTable />
      </Section>

      <Section title="What To Put Where">
        <List items={principles} />
        <Typography variant="body1" sx={bodyTextSx}>
          The worst version of this setup is one enormous Markdown file that tries to be a style
          guide, onboarding document, release checklist, security policy, prompt library, and test
          runner. The best version is boring: short project rules, small skills, clear specialist
          agents, and executable checks.
        </Typography>
      </Section>

      <Section title="Source Notes">
        <Typography variant="body1" sx={mutedTextSx}>
          Checked against official docs on May 15, 2026. These products move quickly, so treat file
          names and invocation details as current implementation notes, not eternal law.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "grid", gap: 1 }}>
          {sourceLinks.map((source) => (
            <Typography key={source.href} component="li" variant="body2" sx={mutedTextSx}>
              <Box
                component="a"
                href={source.href}
                target="_blank"
                rel="noreferrer noopener"
                sx={{ color: "inherit" }}
              >
                {source.label}
              </Box>
            </Typography>
          ))}
        </Box>
      </Section>

      <Box
        component="section"
        sx={{
          p: 2.5,
          borderRadius: 1,
          backgroundColor: "var(--mui-palette-action-hover)",
        }}
      >
        <Typography variant="body1" sx={bodyTextSx}>
          Markdown is the agent&apos;s map. Scripts, tests, and tools are the road. Confuse the two,
          and the agent will politely drive into the ditch.
        </Typography>
      </Box>
    </Box>
  );
}
