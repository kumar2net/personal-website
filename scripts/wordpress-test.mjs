#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressTestExtractor {
  async extractBlogContent(jsxFilePath) {
    try {
      const content = await fs.readFile(jsxFilePath, 'utf-8');
      
      // Extract title
      const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (!titleMatch) {
        throw new Error('Could not extract title from JSX file');
      }
      const title = titleMatch[1].replace(/📄\s*/, '').trim();

      // Extract date
      const dateMatch = content.match(/Date:\s*([^<]+)/);
      const date = dateMatch ? new Date(dateMatch[1].trim()) : new Date();

      // Extract tags/badges
      const badgeMatches = content.match(/className="[^"]*bg-[^"]*[^"]*">([^<]+)<\/span>/g);
      const tags = badgeMatches ? badgeMatches.map(tag => tag.match(/>([^<]+)</)[1]) : [];

      // Extract main content - try multiple patterns
      let contentMatch = content.match(/<div[^>]*prose[^>]*>([\s\S]*?)<\/div>/);
      
      if (!contentMatch) {
        // Try to find content in the main component div
        contentMatch = content.match(/<div[^>]*max-w-[^>]*>([\s\S]*?)<\/div>/);
      }
      
      if (!contentMatch) {
        // Try to find content after the h1 tag
        const h1Match = content.match(/<h1[^>]*>.*?<\/h1>/);
        if (h1Match) {
          const afterH1 = content.substring(content.indexOf(h1Match[0]) + h1Match[0].length);
          contentMatch = [null, afterH1];
        }
      }
      
      if (!contentMatch) {
        throw new Error('Could not extract content from JSX file');
      }

      // Convert JSX to HTML
      const htmlContent = this.convertJSXToHTML(contentMatch[1]);
      
      return {
        title,
        content: htmlContent,
        date,
        tags,
        status: 'publish'
      };
    } catch (error) {
      console.error('Error extracting content:', error);
      throw error;
    }
  }

  convertJSXToHTML(jsxContent) {
    let html = jsxContent
      // Convert JSX attributes
      .replace(/className=/g, 'class=')
      .replace(/<svg[^>]*>.*?<\/svg>/gs, '') // Remove SVG icons
      .replace(/<button[^>]*>.*?<\/button>/gs, '') // Remove buttons
      .replace(/<div[^>]*ref=[^>]*>/g, '<div>') // Remove ref attributes
      .replace(/<motion\.div[^>]*>/g, '<div>') // Convert motion.div to div
      .replace(/<\/motion\.div>/g, '</div>')
      // Handle images - convert to WordPress.com URLs
      .replace(/<img[^>]*src="\/media\/([^"]*)"[^>]*>/g, '<img src="https://kumar2net.files.wordpress.com/$1" alt="$1" />')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return html;
  }

  async testExtraction(jsxFilePath) {
    try {
      console.log(`📝 Testing extraction from: ${jsxFilePath}`);
      console.log('='.repeat(60));
      
      const postData = await this.extractBlogContent(jsxFilePath);
      
      console.log(`📋 Title: ${postData.title}`);
      console.log(`📅 Date: ${postData.date}`);
      console.log(`🏷️  Tags: ${postData.tags.join(', ')}`);
      console.log(`📄 Status: ${postData.status}`);
      console.log('\n📝 Content Preview (first 500 chars):');
      console.log('-'.repeat(40));
      console.log(postData.content.substring(0, 500) + '...');
      console.log('-'.repeat(40));
      console.log(`📊 Content length: ${postData.content.length} characters`);
      console.log('='.repeat(60));
      
      return postData;
    } catch (error) {
      console.error(`❌ Failed to extract from ${jsxFilePath}:`, error);
      throw error;
    }
  }

  async testAllBlogs() {
    const blogDir = path.join(__dirname, '../src/pages/blog');
    
    try {
      const files = await fs.readdir(blogDir);
      const jsxFiles = files.filter(file => 
        file.endsWith('.jsx') && 
        file !== 'PostDynamic.jsx' &&
        !file.startsWith('.')
      );
      
      console.log(`📚 Found ${jsxFiles.length} blog posts to test`);
      console.log('');
      
      for (const file of jsxFiles) {
        const filePath = path.join(blogDir, file);
        await this.testExtraction(filePath);
        console.log('');
      }
      
    } catch (error) {
      console.error('❌ Error in batch testing:', error);
    }
  }
}

// CLI usage
const testExtractor = new WordPressTestExtractor();

if (process.argv[2] === '--all') {
  testExtractor.testAllBlogs();
} else if (process.argv[2]) {
  testExtractor.testExtraction(process.argv[2]);
} else {
  console.log('WordPress Content Extraction Test Tool');
  console.log('=====================================');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/wordpress-test.mjs --all                    # Test all blogs');
  console.log('  node scripts/wordpress-test.mjs path/to/blog.jsx        # Test specific blog');
  console.log('');
  console.log('This tool extracts content from your JSX files and shows what would be posted to WordPress.com');
}
