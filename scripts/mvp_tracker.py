#!/usr/bin/env python3
"""
Kumar's Life - MVP Section 1 Progress Tracker
Tracks your progress through the MVP implementation
"""

import json
import os
from datetime import datetime
from pathlib import Path

class MVPTracker:
    def __init__(self):
        self.mvp_dir = Path("kumar_life_mvp")
        self.mvp_dir.mkdir(exist_ok=True)
        
        self.tracker_file = self.mvp_dir / "mvp_progress.json"
        self.load_progress()
    
    def load_progress(self):
        """Load existing progress or create new"""
        if self.tracker_file.exists():
            with open(self.tracker_file, 'r') as f:
                self.progress = json.load(f)
        else:
            self.progress = {
                "mvp_started": False,
                "runway_account_created": False,
                "prompt_ready": False,
                "video_generated": False,
                "success_criteria_met": False,
                "ready_for_full_project": False,
                "notes": [],
                "generation_attempts": 0,
                "credits_used": 0,
                "start_time": None,
                "completion_time": None
            }
    
    def save_progress(self):
        """Save progress to file"""
        with open(self.tracker_file, 'w') as f:
            json.dump(self.progress, f, indent=2)
    
    def update_status(self, status_key, value=True, note=""):
        """Update a status item"""
        self.progress[status_key] = value
        if note:
            self.progress["notes"].append({
                "timestamp": datetime.now().isoformat(),
                "note": note
            })
        self.save_progress()
        print(f"✅ {status_key}: {value}")
        if note:
            print(f"   Note: {note}")
    
    def add_attempt(self, credits_used=5, note=""):
        """Record a generation attempt"""
        self.progress["generation_attempts"] += 1
        self.progress["credits_used"] += credits_used
        if note:
            self.progress["notes"].append({
                "timestamp": datetime.now().isoformat(),
                "note": f"Attempt {self.progress['generation_attempts']}: {note}"
            })
        self.save_progress()
        print(f"📊 Attempt {self.progress['generation_attempts']} recorded")
        print(f"   Credits used: {credits_used}")
        print(f"   Total credits used: {self.progress['credits_used']}")
    
    def check_success_criteria(self):
        """Check if MVP success criteria are met"""
        criteria = {
            "Video Generated": self.progress["video_generated"],
            "Runway Account": self.progress["runway_account_created"],
            "Prompt Ready": self.progress["prompt_ready"]
        }
        
        print("\n🎯 MVP Success Criteria Check:")
        print("=" * 40)
        
        all_met = True
        for criterion, met in criteria.items():
            status = "✅ PASS" if met else "❌ FAIL"
            print(f"{criterion}: {status}")
            if not met:
                all_met = False
        
        if all_met:
            self.update_status("success_criteria_met", True, "All MVP criteria met!")
            print("\n🎉 MVP SUCCESS! Ready to proceed with full project.")
        else:
            print("\n⚠️  MVP not yet complete. Continue with remaining steps.")
        
        return all_met
    
    def show_progress(self):
        """Display current progress"""
        print("\n📊 Kumar's Life MVP Progress")
        print("=" * 40)
        
        status_items = [
            ("MVP Started", "mvp_started"),
            ("Runway Account Created", "runway_account_created"),
            ("Prompt Ready", "prompt_ready"),
            ("Video Generated", "video_generated"),
            ("Success Criteria Met", "success_criteria_met"),
            ("Ready for Full Project", "ready_for_full_project")
        ]
        
        for label, key in status_items:
            status = "✅" if self.progress[key] else "⏳"
            print(f"{status} {label}")
        
        print(f"\n📈 Statistics:")
        print(f"   Generation Attempts: {self.progress['generation_attempts']}")
        print(f"   Credits Used: {self.progress['credits_used']}/125")
        print(f"   Credits Remaining: {125 - self.progress['credits_used']}")
        
        if self.progress["notes"]:
            print(f"\n📝 Recent Notes:")
            for note in self.progress["notes"][-3:]:  # Show last 3 notes
                timestamp = note["timestamp"][:19]  # Remove microseconds
                print(f"   [{timestamp}] {note['note']}")
    
    def start_mvp(self):
        """Start the MVP process"""
        self.update_status("mvp_started", True, "MVP process started")
        print("🚀 Kumar's Life MVP Started!")
        print("📋 Follow the MVP_SECTION_1_GUIDE.md for step-by-step instructions")
    
    def complete_mvp(self):
        """Mark MVP as complete"""
        self.update_status("ready_for_full_project", True, "MVP completed successfully")
        self.progress["completion_time"] = datetime.now().isoformat()
        self.save_progress()
        print("🎉 MVP COMPLETED! Ready to proceed with full Kumar's Life teaser project.")

def main():
    """Main function"""
    print("🎬 Kumar's Life - MVP Progress Tracker")
    print("=" * 50)
    
    tracker = MVPTracker()
    
    while True:
        print("\n📋 MVP Tracker Menu:")
        print("1. Start MVP")
        print("2. Update Status")
        print("3. Record Generation Attempt")
        print("4. Check Success Criteria")
        print("5. Show Progress")
        print("6. Complete MVP")
        print("7. Exit")
        
        choice = input("\nSelect option (1-7): ").strip()
        
        if choice == "1":
            tracker.start_mvp()
        elif choice == "2":
            print("\n📝 Available status updates:")
            print("1. runway_account_created")
            print("2. prompt_ready")
            print("3. video_generated")
            print("4. success_criteria_met")
            
            status = input("Enter status key: ").strip()
            note = input("Enter note (optional): ").strip()
            tracker.update_status(status, True, note)
        elif choice == "3":
            credits = int(input("Credits used (default 5): ") or "5")
            note = input("Enter note about attempt: ").strip()
            tracker.add_attempt(credits, note)
        elif choice == "4":
            tracker.check_success_criteria()
        elif choice == "5":
            tracker.show_progress()
        elif choice == "6":
            tracker.complete_mvp()
        elif choice == "7":
            print("👋 Goodbye! Good luck with your MVP!")
            break
        else:
            print("❌ Invalid choice. Please select 1-7.")

if __name__ == "__main__":
    main()






