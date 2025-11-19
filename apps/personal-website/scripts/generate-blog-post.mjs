#!/usr/bin/env node
/**
 * Agentic workflow that watches docs/FrontierLabs.md and turns it into a blog post.
 * Uses OpenAI's Agentic Toolkit (Responses API + JSON schema) to normalize metadata,
 * render markdown that matches /blog styling.
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..', '..');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(repoRoot, '.env') });
const blogDir = path.join(
    repoRoot,
    'apps',
    'personal-website',
    'src',
    'pages',
    'blog'
);

const defaultModel =
    process.env.BLOGHINT_AGENT_MODEL ||
    'gpt-4.1-mini';
const openaiApiKey = process.env.OPENAI_API_KEY;
const client = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

function log(message) {
    console.log(`[blog-agentic] ${message}`);
}

function warn(message) {
    console.warn(`[blog-agentic] ${message}`);
}

function slugify(input, fallback = 'blog-post') {
    const slug = input
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || fallback;
}

function formatIsoDate(date = new Date()) {
    return date.toISOString().split('T')[0];
}

function parseResponseJSON(response) {
    const chunks = response?.output || response?.choices || [];
    for (const chunk of chunks) {
        const content = chunk?.content || chunk?.message?.content;
        if (!content) continue;
        const parts = Array.isArray(content) ? content : [content];
        for (const part of parts) {
            if (part.type === 'output_text' && part.text) {
                try {
                    return JSON.parse(part.text);
                } catch (error) {
                    continue;
                }
            }
            if (typeof part === 'string') {
                try {
                    return JSON.parse(part);
                } catch (error) {
                    continue;
                }
            }
            if (part.type === 'text' && part.text) {
                try {
                    return JSON.parse(part.text);
                } catch (error) {
                    continue;
                }
            }
        }
    }
    return null;
}

async function generateImage(prompt) {
    if (!client) return null;
    try {
        const response = await client.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        return response.data[0].url;
    } catch (error) {
        warn(`Image generation failed: ${error.message}`);
        return null;
    }
}

async function agenticBlog(content, fileName) {
    if (!client) {
        return null;
    }

    const instructions = [
        'You are the Agentic Blog Producer for kumar2net.com.',
        'Convert raw notes into a polished, sectioned blog post format used on the /blog route.',
        'Keep the tone thoughtful, concise, and in first-person.',
        'Return JSON only. Do not emit markdown or explanations.',
        'If an image generation request is present, include a prompt for it.',
    ].join(' ');

    const schema = {
        name: 'blog_blueprint',
        schema: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'slug', 'description', 'tags', 'sections'],
            properties: {
                title: { type: 'string' },
                slug: { type: 'string' },
                description: { type: 'string' },
                tags: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 6,
                    items: { type: 'string' },
                },
                sections: {
                    type: 'array',
                    minItems: 2,
                    items: {
                        type: 'object',
                        required: ['heading', 'content'],
                        additionalProperties: false,
                        properties: {
                            heading: { type: 'string' },
                            content: { type: 'string' },
                        },
                    },
                },
                imagePrompt: { type: 'string' },
            },
        },
    };

    const response = await client.chat.completions.create({
        model: defaultModel,
        temperature: 0.7,
        messages: [
            {
                role: 'system',
                content: instructions,
            },
            {
                role: 'user',
                content: `Filename: ${fileName}\n\nContent:\n${content}`,
            },
        ],
        response_format: {
            type: 'json_schema',
            json_schema: schema,
        },
    });

    const parsed = parseResponseJSON(response);
    if (!parsed) {
        throw new Error('Agentic response did not include valid JSON payload.');
    }
    return parsed;
}

function buildBlogJSX(meta, sections, imageUrl) {
    const date = formatIsoDate();
    const slug = meta.slug || slugify(meta.title);

    let contentJSX = '';
    sections.forEach((section, index) => {
        contentJSX += `
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 !text-white font-bold text-lg shadow-lg">
            ${index + 1}
          </span>
          ${section.heading}
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed">
            ${section.content}
          </p>
        </div>
      </section>
`;
    });

    if (imageUrl) {
        contentJSX += `
      <section className="mb-12">
        <img 
          src="${imageUrl}" 
          alt="AI Generated Illustration" 
          className="rounded-lg shadow-lg w-full" 
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          AI Generated Illustration
        </p>
      </section>
`;
    }

    return `export default function BlogPost() {
  return (
    <div className="space-y-8">
      ${contentJSX}
    </div>
  );
}
`;
}

async function main() {
    const inputFile = path.join(repoRoot, 'docs', 'bloghints', 'FrontierLabs.md');
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file missing: ${inputFile}`);
    }

    if (!client) {
        warn('OPENAI_API_KEY is not set.');
        return;
    }

    const rawContent = await fsp.readFile(inputFile, 'utf8');
    log(`Reading ${inputFile}...`);

    try {
        const plan = await agenticBlog(rawContent, 'FrontierLabs.md');
        log(`Agentic plan generated for ${plan.title}`);

        let imageUrl = null;
        if (plan.imagePrompt) {
            log(`Generating image with prompt: ${plan.imagePrompt}`);
            imageUrl = await generateImage(plan.imagePrompt);
            // imageUrl = "https://placehold.co/1024x1024?text=AI+Generated+Image"; // Placeholder
        }

        const jsxContent = buildBlogJSX(plan, plan.sections, imageUrl);
        const slug = plan.slug || slugify(plan.title);
        const date = formatIsoDate();
        const targetFile = path.join(blogDir, `${date}-${slug}.jsx`);

        await fsp.writeFile(targetFile, jsxContent, 'utf8');
        log(`Generated blog post: ${targetFile}`);

    } catch (error) {
        console.error('Error generating blog post:', error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
