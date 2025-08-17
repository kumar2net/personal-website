#!/usr/bin/env node

/**
 * Show GA4 Configuration
 * 
 * Simple script to display all GA4 configuration details.
 */

import { 
  GA4_CONFIG, 
  getConfigSummary, 
  printConfig, 
  validateConfig 
} from './ga4-config.mjs';

function showGA4Config() {
  console.log('🔧 Google Analytics 4 Configuration Details\n');
  
  try {
    // Validate configuration
    validateConfig();
    console.log('✅ Configuration is valid\n');
  } catch (error) {
    console.log('❌ Configuration validation failed:', error.message, '\n');
  }
  
  // Print detailed configuration
  printConfig();
  
  console.log('\n📋 Configuration Summary:');
  const summary = getConfigSummary();
  Object.entries(summary).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n📁 Output Files:');
  Object.entries(GA4_CONFIG.output.files).forEach(([key, value]) => {
    console.log(`  ${key}: ${GA4_CONFIG.output.directory}/${value}`);
  });
  
  console.log('\n📊 Available Metrics:');
  Object.entries(GA4_CONFIG.metrics).forEach(([category, metrics]) => {
    console.log(`  ${category}: ${metrics.map(m => m.name).join(', ')}`);
  });
  
  console.log('\n📏 Available Dimensions:');
  Object.entries(GA4_CONFIG.dimensions).forEach(([category, dimensions]) => {
    console.log(`  ${category}: ${dimensions.map(d => d.name).join(', ')}`);
  });
  
  console.log('\n📅 Date Ranges:');
  Object.entries(GA4_CONFIG.dateRanges).forEach(([name, range]) => {
    console.log(`  ${name}: ${range.startDate} to ${range.endDate}`);
  });
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  showGA4Config();
}

export { showGA4Config };
