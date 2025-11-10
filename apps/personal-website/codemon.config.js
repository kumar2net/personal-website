module.exports = {
  // Root directory to analyze
  root: '.',
  
  // Files to include in analysis
  include: [
    'src/**/*.{js,jsx,ts,tsx}',
    'scripts/**/*.{js,mjs}',
    'netlify/functions/**/*.js'
  ],
  
  // Files to exclude from analysis
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '*.min.js',
    '*.bundle.js',
    'public/**',
    'docs/**',
    '*.config.js',
    '*.config.mjs'
  ],
  
  // Analysis options
  analysis: {
    // Detect unused exports
    unusedExports: true,
    
    // Detect unused imports
    unusedImports: true,
    
    // Detect dead code (unreachable code)
    deadCode: true,
    
    // Detect unused variables
    unusedVariables: true,
    
    // Detect unused functions
    unusedFunctions: true,
    
    // Detect unused dependencies
    unusedDependencies: true,
    
    // Detect duplicate code
    duplicateCode: true,
    
    // Detect large files
    largeFiles: {
      enabled: true,
      threshold: 1000 // lines
    },
    
    // Detect complex functions
    complexFunctions: {
      enabled: true,
      threshold: 20 // cyclomatic complexity
    }
  },
  
  // Bundle analysis
  bundle: {
    // Analyze bundle size
    analyze: true,
    
    // Detect unused chunks
    unusedChunks: true,
    
    // Detect large dependencies
    largeDependencies: {
      enabled: true,
      threshold: 100 // KB
    }
  },
  
  // Performance analysis
  performance: {
    // Detect slow operations
    slowOperations: true,
    
    // Detect memory leaks
    memoryLeaks: true,
    
    // Detect expensive operations
    expensiveOperations: true
  },
  
  // Security analysis
  security: {
    // Detect security vulnerabilities
    vulnerabilities: true,
    
    // Detect unsafe patterns
    unsafePatterns: true,
    
    // Detect deprecated APIs
    deprecatedAPIs: true
  },
  
  // Output options
  output: {
    // Generate detailed report
    report: true,
    
    // Generate JSON report
    json: true,
    
    // Generate HTML report
    html: true,
    
    // Console output
    console: true,
    
    // Exit with error code if issues found
    exitOnError: false
  },
  
  // Custom rules
  rules: {
    // Custom unused code patterns
    customPatterns: [
      // Detect console.log statements in production
      {
        pattern: /console\.log\(/g,
        message: 'Console.log statements should be removed in production',
        severity: 'warning'
      },
      
      // Detect TODO comments
      {
        pattern: /\/\/\s*TODO:/g,
        message: 'TODO comments should be addressed',
        severity: 'info'
      },
      
      // Detect FIXME comments
      {
        pattern: /\/\/\s*FIXME:/g,
        message: 'FIXME comments should be addressed',
        severity: 'warning'
      },
      
      // Detect hardcoded URLs
      {
        pattern: /https?:\/\/[^\s'"]+/g,
        message: 'Consider using environment variables for URLs',
        severity: 'info'
      }
    ]
  }
};
