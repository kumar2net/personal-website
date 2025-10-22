#!/usr/bin/env python3
"""
Kumar's Life - Free AI Video Generation Script
For AI enthusiasts learning video generation on a budget

This script helps you create Kumar's Life teaser using free AI video tools.
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path

class FreeAIVideoGenerator:
    def __init__(self):
        self.project_dir = Path("kumar_life_teaser")
        self.project_dir.mkdir(exist_ok=True)
        
        # Create subdirectories
        (self.project_dir / "prompts").mkdir(exist_ok=True)
        (self.project_dir / "videos").mkdir(exist_ok=True)
        (self.project_dir / "logs").mkdir(exist_ok=True)
        
        self.log_file = self.project_dir / "logs" / f"generation_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
    def log(self, message):
        """Log messages to file and console"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        
        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(log_message + "\n")
    
    def create_prompts(self):
        """Create optimized prompts for different free AI video tools"""
        
        prompts = {
            "runway_ml": {
                "segment_1": "A young boy with determined eyes holding a cricket bat in a golden field, Satyajit Ray cinematic style, natural lighting, warm earth tones, contemplative mood, 4 seconds",
                "segment_2": "Wide shot of cricket field with coconut trees, then close-up of grandfather teaching ball badminton, Satyajit Ray style, natural lighting, warm nostalgic tones, 4 seconds",
                "segment_3": "Train departing from station with emotional farewell, then transition to busy Delhi street, Satyajit Ray style, dramatic natural lighting, warm urban tones, 4 seconds",
                "segment_4": "Montage of iconic landmarks: Statue of Liberty, Singapore skyline, Dubai desert, Satyajit Ray style, natural lighting, warm international tones, 4 seconds",
                "segment_5": "Quick cuts of technology evolution: photocopiers, computers, networks, Satyajit Ray style, natural lighting, warm professional tones, 4 seconds",
                "segment_6": "Kumar reading philosophical books, then teaching young people about AI, Satyajit Ray style, natural lighting, contemplative warm tones, 4 seconds",
                "segment_7": "Extreme close-up of hands helping a beetle with water droplets, Satyajit Ray style, natural lighting, warm earth tones, contemplative mood, 4 seconds",
                "segment_8": "Kumar in garden with compass, contemplative expression, Satyajit Ray style, golden hour natural lighting, warm contemplative tones, 4 seconds"
            },
            
            "fliki": {
                "narrated_script": """In a small village in Tamil Nadu, a boy with a cricket bat and insatiable curiosity began his journey. Top student, champion cricketer, technical genius in the making. One day, opportunity called. From village to the capital, from photocopiers to 5G networks. The world became his playground. 35 years of innovation, from India to the world. But life had other lessons. When a simple act of kindness changed everything. Sometimes the smallest creatures teach us the biggest lessons. Kumar's Life - A True Story of Curiosity and Compassion."""
            },
            
            "elai": {
                "avatar_script": """Meet Kumar, a brilliant boy from Tirunelveli who became a global technology pioneer. His journey from cricket fields to international boardrooms shows how curiosity can change the world. But his greatest lesson came from helping a small beetle - teaching us that compassion is life's true compass."""
            },
            
            "pika_labs": {
                "segment_1": "A young boy with determined eyes holding a cricket bat in a golden field, warm lighting, cinematic style, high quality",
                "segment_2": "Wide shot of cricket field with coconut trees, then close-up of grandfather teaching ball badminton, warm nostalgic lighting, cinematic",
                "segment_3": "Train departing from station with emotional farewell, then transition to busy Delhi street, dramatic lighting, professional",
                "segment_4": "Montage of iconic landmarks: Statue of Liberty, Singapore skyline, Dubai desert, epic cinematic style, high quality",
                "segment_5": "Quick cuts of technology evolution: photocopiers, computers, networks, modern professional lighting, cinematic",
                "segment_6": "Kumar reading philosophical books, then teaching young people about AI, contemplative lighting, professional",
                "segment_7": "Extreme close-up of hands helping a beetle with water droplets, macro photography style, natural lighting, cinematic",
                "segment_8": "Kumar in garden with compass, contemplative expression, golden hour lighting, cinematic style, high quality"
            },
            
            "heygen": {
                "avatar_script": """Meet Kumar, a brilliant boy from Tirunelveli who became a global technology pioneer. His journey from cricket fields to international boardrooms shows how curiosity can change the world. But his greatest lesson came from helping a small beetle - teaching us that compassion is life's true compass. This is Kumar's Life - A True Story of Curiosity and Compassion."""
            }
        }
        
        # Save prompts to JSON file
        prompts_file = self.project_dir / "prompts" / "kumar_life_prompts.json"
        with open(prompts_file, "w", encoding="utf-8") as f:
            json.dump(prompts, f, indent=2, ensure_ascii=False)
        
        self.log(f"Prompts saved to {prompts_file}")
        return prompts
    
    def create_instructions(self):
        """Create step-by-step instructions for each platform"""
        
        instructions = {
            "runway_ml": {
                "setup": [
                    "1. Go to runwayml.com and create a free account",
                    "2. Verify your email address",
                    "3. You'll get 125 free credits (enough for ~25-30 videos)",
                    "4. Navigate to the 'Generate' section"
                ],
                "generation": [
                    "1. Select 'Text to Video' option",
                    "2. Copy the prompt from the generated prompts file",
                    "3. Paste it into the text input field",
                    "4. Click 'Generate' and wait 2-5 minutes",
                    "5. Download the generated video",
                    "6. Save it with the segment number (e.g., segment_1.mp4)"
                ],
                "tips": [
                    "Start with simple prompts to understand the tool",
                    "Use cinematic terms like 'wide shot', 'close-up', 'golden hour'",
                    "Be specific about lighting and style",
                    "Test different variations of the same prompt"
                ]
            },
            
            "fliki": {
                "setup": [
                    "1. Go to fliki.ai and create a free account",
                    "2. You get 5 minutes of video per month for free",
                    "3. Navigate to 'Create Video' section"
                ],
                "generation": [
                    "1. Select 'Text to Video' option",
                    "2. Copy the narrated script from prompts file",
                    "3. Choose a suitable AI voice (try different options)",
                    "4. Select background music (optional)",
                    "5. Click 'Generate' and wait 5-10 minutes",
                    "6. Download the complete video"
                ],
                "tips": [
                    "Try different AI voices to find the best fit",
                    "Keep the script under 1 minute for free tier",
                    "Use punctuation to control speech rhythm",
                    "Add background music for better engagement"
                ]
            },
            
            "elai": {
                "setup": [
                    "1. Go to elai.io and create a free account",
                    "2. Explore the free tier features",
                    "3. Navigate to 'Create Video' section"
                ],
                "generation": [
                    "1. Select 'AI Avatar' option",
                    "2. Choose or create a Kumar-like avatar",
                    "3. Copy the avatar script from prompts file",
                    "4. Select voice and language settings",
                    "5. Generate and download the video"
                ],
                "tips": [
                    "Create a custom avatar that resembles Kumar",
                    "Use appropriate voice settings for the character",
                    "Keep scripts concise for free tier limits",
                    "Experiment with different avatar styles"
                ]
            }
        }
        
        # Save instructions to JSON file
        instructions_file = self.project_dir / "instructions.json"
        with open(instructions_file, "w", encoding="utf-8") as f:
            json.dump(instructions, f, indent=2, ensure_ascii=False)
        
        self.log(f"Instructions saved to {instructions_file}")
        return instructions
    
    def create_cost_tracker(self):
        """Create a cost tracking system"""
        
        cost_tracker = {
            "free_tools": {
                "runway_ml": {
                    "free_credits": 125,
                    "credits_used": 0,
                    "cost_per_credit": 0,
                    "total_cost": 0
                },
                "fliki": {
                    "free_minutes": 5,
                    "minutes_used": 0,
                    "cost_per_minute": 0,
                    "total_cost": 0
                },
                "elai": {
                    "free_videos": "limited",
                    "videos_used": 0,
                    "cost_per_video": 0,
                    "total_cost": 0
                },
                "pika_labs": {
                    "free_generations": "limited",
                    "generations_used": 0,
                    "cost_per_generation": 0,
                    "total_cost": 0
                },
                "heygen": {
                    "free_minutes": 1,
                    "minutes_used": 0,
                    "cost_per_minute": 0,
                    "total_cost": 0
                }
            },
            "upgrade_options": {
                "runway_ml": {
                    "standard": "$12/month",
                    "pro": "$28/month",
                    "unlimited": "$76/month"
                },
                "fliki": {
                    "basic": "$24/month",
                    "standard": "$48/month",
                    "premium": "$96/month"
                },
                "elai": {
                    "starter": "$29/month",
                    "advanced": "$59/month",
                    "enterprise": "custom"
                },
                "pika_labs": {
                    "pro": "$10/month",
                    "premium": "$20/month",
                    "enterprise": "custom"
                },
                "heygen": {
                    "starter": "$30/month",
                    "professional": "$60/month",
                    "enterprise": "custom"
                }
            }
        }
        
        # Save cost tracker to JSON file
        cost_file = self.project_dir / "cost_tracker.json"
        with open(cost_file, "w", encoding="utf-8") as f:
            json.dump(cost_tracker, f, indent=2, ensure_ascii=False)
        
        self.log(f"Cost tracker saved to {cost_file}")
        return cost_tracker
    
    def create_learning_checklist(self):
        """Create a learning progress checklist"""
        
        checklist = {
            "week_1": {
                "day_1_2": [
                    "Create Runway ML account",
                    "Watch platform tutorials",
                    "Generate first test video",
                    "Understand prompt engineering basics"
                ],
                "day_3_4": [
                    "Create Fliki account",
                    "Test text-to-video conversion",
                    "Try different AI voices",
                    "Export first narrated video"
                ],
                "day_5_7": [
                    "Create Elai.io account",
                    "Design Kumar avatar",
                    "Create avatar-based video",
                    "Compare all three platforms"
                ]
            },
            "week_2": {
                "day_1_3": [
                    "Generate all 8 Runway ML segments",
                    "Optimize prompts based on results",
                    "Download all video segments",
                    "Create video montage"
                ],
                "day_4_5": [
                    "Create Fliki narrated version",
                    "Choose best voice for Kumar",
                    "Add background music",
                    "Export complete teaser"
                ],
                "day_6_7": [
                    "Post-production with free editor",
                    "Combine all segments",
                    "Add transitions and music",
                    "Export final versions"
                ]
            },
            "learning_outcomes": [
                "Understand AI video generation prompts",
                "Learn different platform capabilities",
                "Master prompt engineering techniques",
                "Understand cost-quality trade-offs",
                "Develop personal workflow",
                "Create professional-looking content"
            ]
        }
        
        # Save checklist to JSON file
        checklist_file = self.project_dir / "learning_checklist.json"
        with open(checklist_file, "w", encoding="utf-8") as f:
            json.dump(checklist, f, indent=2, ensure_ascii=False)
        
        self.log(f"Learning checklist saved to {checklist_file}")
        return checklist
    
    def create_readme(self):
        """Create a comprehensive README file"""
        
        readme_content = """# Kumar's Life - Free AI Video Generation Project

## 🎯 Project Overview
This project helps you create a teaser for "Kumar's Life" using free AI video generation tools. Perfect for AI enthusiasts learning video generation on a budget.

## 📁 Project Structure
```
kumar_life_teaser/
├── prompts/           # Generated prompts for different platforms
├── videos/           # Downloaded video files
├── logs/             # Generation logs
├── instructions.json # Step-by-step instructions
├── cost_tracker.json # Cost tracking and upgrade options
├── learning_checklist.json # Learning progress tracker
└── README.md         # This file
```

## 🚀 Getting Started

### Step 1: Choose Your Platform
Start with **Runway ML** (recommended for learning):
- Free: 125 credits
- Best for: Learning prompt engineering
- Quality: Good with watermark

### Step 2: Generate Your First Video
1. Go to runwayml.com
2. Create free account
3. Use prompts from `prompts/kumar_life_prompts.json`
4. Start with "segment_1" prompt

### Step 3: Track Your Progress
- Use `learning_checklist.json` to track progress
- Update `cost_tracker.json` as you use credits
- Check `logs/` for generation history

## 🎬 Available Prompts

### Runway ML (4-second segments)
- **segment_1**: Opening hook with cricket bat
- **segment_2**: Foundation with grandfather
- **segment_3**: Journey begins with train
- **segment_4**: Global adventures montage
- **segment_5**: Technology career evolution
- **segment_6**: Wisdom phase with books
- **segment_7**: Beetle scene (climax)
- **segment_8**: Final reflection with compass

### Fliki (1-minute narrated)
- Complete narrated script for text-to-video
- Optimized for AI voice generation
- Includes all key story elements

### Elai.io (Avatar-based)
- Avatar script for character-based storytelling
- Focused on Kumar's journey highlights
- Suitable for avatar presentation

## 💰 Cost Management

### Free Tier Limits
- **Runway ML**: 125 credits (≈25-30 videos)
- **Fliki**: 5 minutes per month
- **Elai.io**: Limited free videos

### Upgrade Options (When Ready)
- **Runway ML**: $12/month for longer videos
- **Fliki**: $24/month for more minutes
- **Elai.io**: $29/month for advanced features

## 📚 Learning Resources

### Prompt Engineering Tips
1. Be specific about lighting and style
2. Use cinematic terms (wide shot, close-up, golden hour)
3. Include mood and atmosphere descriptions
4. Test different variations

### Quality Improvement
1. Iterate on prompts based on results
2. Combine multiple platforms for different aspects
3. Use free video editors for post-production
4. Learn from community examples

## 🎯 Success Metrics

### Week 1 Goals
- [ ] Generate videos on 3 different platforms
- [ ] Understand basic prompt engineering
- [ ] Create at least 5 test videos
- [ ] Document platform differences

### Week 2 Goals
- [ ] Create complete Kumar's Life teaser
- [ ] Master prompt optimization
- [ ] Understand cost-quality trade-offs
- [ ] Develop personal workflow

## 🆘 Troubleshooting

### Common Issues
1. **Poor quality results**: Refine prompts, try different variations
2. **Credits running out**: Switch to another free platform
3. **Watermarks**: Acceptable for learning, upgrade for final version
4. **Generation failures**: Check prompt length, try simpler versions

### Getting Help
- Check platform documentation
- Join AI video generation communities
- Share results for feedback
- Learn from other users' prompts

## 🎉 Next Steps

After mastering free tools:
1. **Upgrade gradually**: Start with one paid platform
2. **Invest in quality**: Pay for better results when needed
3. **Build portfolio**: Create more content
4. **Share knowledge**: Help other learners

## 📞 Support

For questions or issues:
- Check the logs in `logs/` directory
- Review platform-specific instructions
- Join AI video generation communities
- Document your learning journey

Happy creating! 🎬
"""
        
        readme_file = self.project_dir / "README.md"
        with open(readme_file, "w", encoding="utf-8") as f:
            f.write(readme_content)
        
        self.log(f"README created at {readme_file}")
    
    def run_setup(self):
        """Run the complete setup process"""
        self.log("Starting Kumar's Life Free AI Video Generation Setup")
        
        # Create all necessary files
        self.create_prompts()
        self.create_instructions()
        self.create_cost_tracker()
        self.create_learning_checklist()
        self.create_readme()
        
        self.log("Setup complete! Check the 'kumar_life_teaser' directory for all files.")
        self.log("Start with Runway ML for the best learning experience.")
        
        return True

def main():
    """Main function to run the setup"""
    print("🎬 Kumar's Life - Free AI Video Generation Setup")
    print("=" * 50)
    
    generator = FreeAIVideoGenerator()
    generator.run_setup()
    
    print("\n✅ Setup Complete!")
    print("📁 Check the 'kumar_life_teaser' directory for all files")
    print("🚀 Start with Runway ML: runwayml.com")
    print("📚 Read the README.md for detailed instructions")
    print("🎯 Use the learning checklist to track your progress")

if __name__ == "__main__":
    main()
