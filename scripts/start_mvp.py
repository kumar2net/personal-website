#!/usr/bin/env python3
"""
Kumar's Life - MVP Quick Start
Guides you through starting the MVP for Section 1
"""

import webbrowser
import time
from pathlib import Path

def main():
    print("🎬 Kumar's Life - MVP Quick Start")
    print("=" * 50)
    
    print("\n🎯 MVP Objective:")
    print("Create Section 1 of Kumar's Life teaser using Runway ML")
    print("Segment: Young Kumar with cricket bat in golden field")
    print("Style: Satyajit Ray cinematic aesthetic")
    print("Duration: 4 seconds")
    
    print("\n📋 Pre-Flight Checklist:")
    print("✅ MVP guide created")
    print("✅ Progress tracker ready")
    print("✅ Prompt prepared")
    print("✅ Success criteria defined")
    
    print("\n🚀 Ready to Start MVP!")
    
    # Show the prompt
    print("\n📝 Your Prompt (copy this):")
    print("-" * 60)
    prompt = "A young boy with determined eyes holding a cricket bat in a golden field, Satyajit Ray cinematic style, natural lighting, warm earth tones, contemplative mood, 4 seconds"
    print(prompt)
    print("-" * 60)
    
    # Ask if ready to proceed
    ready = input("\n🤔 Are you ready to start the MVP? (y/n): ").lower().strip()
    
    if ready == 'y':
        print("\n🚀 Starting MVP Process...")
        
        # Open Runway ML
        print("🌐 Opening Runway ML...")
        webbrowser.open("https://runwayml.com")
        
        print("\n📋 Next Steps:")
        print("1. Create Runway ML account (if you don't have one)")
        print("2. Navigate to 'Generate' or 'Create Video'")
        print("3. Select 'Text to Video' option")
        print("4. Paste the prompt above")
        print("5. Set duration to 4 seconds")
        print("6. Click 'Generate'")
        print("7. Wait 2-5 minutes for processing")
        print("8. Download the video")
        
        print("\n📊 Track Your Progress:")
        print("Run: python3 scripts/mvp_tracker.py")
        print("Select option 1 to start tracking")
        
        print("\n📚 Full Guide Available:")
        print("Check: docs/MVP_SECTION_1_GUIDE.md")
        
        print("\n🎯 Success Criteria:")
        print("✅ Video generated successfully")
        print("✅ Shows young boy with cricket bat")
        print("✅ Golden field background")
        print("✅ Satyajit Ray style aesthetic")
        print("✅ 4-second duration")
        print("✅ Good quality (not blurry)")
        
        print("\n⏰ Expected Time: 10-15 minutes")
        print("💰 Cost: $0 (free credits)")
        print("🎬 Result: First segment of Kumar's Life teaser")
        
        print("\n🎉 Good luck with your MVP!")
        print("Use the tracker to monitor your progress.")
        
    else:
        print("\n⏳ No problem! Take your time.")
        print("📚 Review the MVP guide: docs/MVP_SECTION_1_GUIDE.md")
        print("🚀 Run this script again when you're ready!")

if __name__ == "__main__":
    main()









