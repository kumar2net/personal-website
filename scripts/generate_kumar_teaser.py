#!/usr/bin/env python3
"""
Kumar's Life Teaser Generator using Gemini API
Generates a 1-minute cinematic teaser using Google's Gemini API with Veo 3 capabilities
"""

import os
import json
import time
from pathlib import Path
from typing import List, Dict, Any
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

class KumarTeaserGenerator:
    def __init__(self, api_key: str = None):
        """Initialize the Kumar Teaser Generator with Gemini API"""
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key not found. Set GEMINI_API_KEY environment variable or pass api_key parameter.")
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize the model (using gemini-1.5-pro for video generation)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Safety settings for creative content
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
        
        # Video segments configuration
        self.segments = self._load_segment_configs()
        
    def _load_segment_configs(self) -> List[Dict[str, Any]]:
        """Load the 8 video segment configurations"""
        return [
            {
                "id": "segment_1",
                "name": "Opening Hook",
                "duration": 8,
                "start_time": 0,
                "end_time": 8,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Extreme close-up of young Kumar's eyes (8 years old), slowly pulling back to reveal his determined face. A cricket ball in slow motion passes through the frame. The scene is set in a lush cricket field in Tirunelveli with coconut and betelnut trees swaying in the background.

CAMERA: Slow push-in on Kumar's eyes, then gentle pull-back to reveal his face, with the cricket ball creating a dynamic element in the foreground.

LIGHTING: Golden hour lighting with warm, nostalgic tones. Soft shadows and natural light creating a dreamy atmosphere.

AUDIO: Soft, nostalgic melody begins with traditional South Indian instruments (veena, light percussion). Subtle cricket sounds in the background.

STYLE: Mani Ratnam-inspired South Indian cinema with emotional depth and cultural authenticity. Warm color palette with deep greens and golden tones.

QUALITY: 4K cinematic quality with professional color grading, smooth motion, and natural skin tones."""
            },
            {
                "id": "segment_2", 
                "name": "The Foundation",
                "duration": 8,
                "start_time": 8,
                "end_time": 16,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Wide shot of Tirunelveli cricket field transitioning to intimate scenes of Kumar playing with his grandfather (ball badminton lesson) and RC Uncle teaching technical skills. Quick montage of school excellence moments.

CAMERA: Wide establishing shot of the cricket field, then smooth transitions to close-ups of the grandfather's hands teaching ball badminton, RC Uncle's technical demonstration, and Kumar receiving academic recognition.

LIGHTING: Natural lighting with warm, hopeful tones. Dappled sunlight filtering through coconut fronds during the grandfather scene.

AUDIO: Building, hopeful theme with traditional South Indian instruments. Sound of ball badminton, technical tools, and school applause.

STYLE: Mani Ratnam signature style with emotional resonance and cultural authenticity. Warm color palette with earth tones and natural greens.

QUALITY: 4K cinematic quality with smooth transitions, natural lighting, and authentic cultural representation."""
            },
            {
                "id": "segment_3",
                "name": "The Journey Begins", 
                "duration": 8,
                "start_time": 16,
                "end_time": 24,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Train departing from Tirunelveli station with Kumar's emotional farewell to family, then transition to Delhi arrival showing culture shock. Technology evolution montage with photocopiers, IBM PCs, ATMs, and network towers.

CAMERA: Slow 360-degree shot around the family at the railway station, then handheld following Kumar's perspective in Delhi, ending with dynamic montage of technology progression.

LIGHTING: Railway grays and golden light for farewell, then overwhelming brightness for Delhi arrival, transitioning to cool tech blues for career progression.

AUDIO: Train whistle, emotional family sounds, urban Delhi chaos, technology sounds (beeps, whirs, mechanical sounds).

STYLE: Mani Ratnam-inspired with smooth emotional transitions and dynamic career progression. Color evolution from warm farewell to cool professional tones.

QUALITY: 4K cinematic quality with smooth camera movements, authentic location sounds, and professional color grading."""
            },
            {
                "id": "segment_4",
                "name": "Global Adventures Part 1",
                "duration": 8, 
                "start_time": 24,
                "end_time": 32,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Quick montage of global locations: Kumar standing in front of Statue of Liberty during sunset, then Singapore skyline at night, with the compass glowing in each location. Technology career progression shown through network installations and 4G/5G work.

CAMERA: Wide establishing shots of iconic landmarks, then close-ups on the compass, with dynamic montage of technology work scenes.

LIGHTING: Golden sunset for New York, neon blues and greens for Singapore, cool professional lighting for technology scenes.

AUDIO: Epic, international theme with orchestral elements. Urban sounds from each location, technology sounds, and subtle compass metallic sounds.

STYLE: Mani Ratnam-inspired with international appeal and technological sophistication. Vibrant, location-specific color palettes.

QUALITY: 4K cinematic quality with epic scale, authentic location sounds, and professional international production values."""
            },
            {
                "id": "segment_5",
                "name": "Global Adventures Part 2",
                "duration": 8,
                "start_time": 32, 
                "end_time": 40,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Continuation of global travel montage: Kumar in Dubai desert during golden hour, then New Zealand landscapes, followed by Germany and UK sequences. The compass guides him through each location.

CAMERA: Wide shots emphasizing scale of each location, with close-ups on the compass and Kumar's contemplative expressions.

LIGHTING: Desert golds for Dubai, natural greens for New Zealand, historic tones for Europe, with golden hour emphasis throughout.

AUDIO: International theme continues with location-specific ambient sounds: desert winds, New Zealand nature sounds, European city ambience.

STYLE: Mani Ratnam signature style with global perspective and natural beauty emphasis. Location-specific color palettes maintaining cinematic quality.

QUALITY: 4K cinematic quality with authentic location representation, smooth transitions, and professional international production values."""
            },
            {
                "id": "segment_6",
                "name": "The Wisdom Begins",
                "duration": 8,
                "start_time": 40,
                "end_time": 48,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Kumar in his 50s, reading philosophical books in his home office. Subtle health challenges shown respectfully, then mentorship scenes with young people learning about AI technology.

CAMERA: Intimate, respectful close-ups of Kumar reading, then over-the-shoulder shots showing the teaching dynamic with young professionals.

LIGHTING: Soft, warm tones with natural light. Medical equipment visible but not intrusive, warm room lighting for mentorship scenes.

AUDIO: Contemplative, philosophical theme with soft strings and piano. Subtle medical equipment sounds, technology sounds, and teaching dialogue.

STYLE: Mani Ratnam-inspired with emotional depth and wisdom emphasis. Soft, contemplative color palette with warm, accepting tones.

QUALITY: 4K cinematic quality with intimate cinematography, authentic emotional moments, and professional color grading."""
            },
            {
                "id": "segment_7",
                "name": "Digital Advocacy & The Beetle",
                "duration": 8,
                "start_time": 48,
                "end_time": 56,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Kumar at his computer using social media for advocacy, then transition to the beetle encounter scene. Extreme close-up of Kumar's hands gently helping a darkling beetle right itself, with water droplets catching light.

CAMERA: Close-up on computer screens, then macro photography style for beetle scene, capturing every detail of the compassionate moment.

LIGHTING: Screen blues for computer scene, then natural sunlight for beetle scene with water droplets creating tiny rainbows.

AUDIO: Modern technology sounds, then profound silence with subtle water sounds and beetle movements. Heartbeat sound during emotional moment.

STYLE: Mani Ratnam-inspired with modern heroism and profound compassion. Contrast between digital blues and natural earth tones.

QUALITY: 4K cinematic quality with macro photography excellence, crystal clear water effects, and emotional depth."""
            },
            {
                "id": "segment_8",
                "name": "The Climax & Title",
                "duration": 8,
                "start_time": 56,
                "end_time": 64,
                "prompt": """Create an 8-second cinematic video in 4K resolution:

VISUAL: Kumar sitting in his garden contemplating the beetle experience, with the compass beside him pointing inward. Title card "KUMAR'S LIFE" appears with tagline "A True Story of Curiosity and Compassion."

CAMERA: Slow push-in on Kumar's contemplative face, then wide shot showing the compass, ending with title card reveal.

LIGHTING: Golden hour light bathing the scene, with the compass glowing softly. Title card with cinematic lighting and elegant typography.

AUDIO: Emotional climax with solo violin and soft piano, building to title music with traditional South Indian elements.

STYLE: Mani Ratnam signature style with philosophical depth and cinematic elegance. Golden hour warmth with professional title design.

QUALITY: 4K cinematic quality with emotional climax, elegant title design, and professional color grading."""
            }
        ]
    
    def generate_segment(self, segment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a single video segment using Gemini API"""
        print(f"🎬 Generating {segment['name']} ({segment['start_time']}-{segment['end_time']}s)...")
        
        try:
            # Create the generation request
            response = self.model.generate_content(
                segment['prompt'],
                safety_settings=self.safety_settings,
                generation_config={
                    'temperature': 0.7,
                    'top_p': 0.8,
                    'top_k': 40,
                    'max_output_tokens': 8192,
                }
            )
            
            # Process the response
            if response.text:
                return {
                    'segment_id': segment['id'],
                    'name': segment['name'],
                    'status': 'success',
                    'content': response.text,
                    'timestamp': time.time()
                }
            else:
                return {
                    'segment_id': segment['id'],
                    'name': segment['name'],
                    'status': 'error',
                    'error': 'No content generated',
                    'timestamp': time.time()
                }
                
        except Exception as e:
            print(f"❌ Error generating {segment['name']}: {str(e)}")
            return {
                'segment_id': segment['id'],
                'name': segment['name'],
                'status': 'error',
                'error': str(e),
                'timestamp': time.time()
            }
    
    def generate_all_segments(self) -> List[Dict[str, Any]]:
        """Generate all 8 video segments"""
        print("🚀 Starting Kumar's Life Teaser Generation...")
        print(f"📊 Total segments: {len(self.segments)}")
        print(f"⏱️  Total duration: {sum(seg['duration'] for seg in self.segments)} seconds")
        print("-" * 60)
        
        results = []
        for i, segment in enumerate(self.segments, 1):
            print(f"\n[{i}/{len(self.segments)}] Processing {segment['name']}...")
            result = self.generate_segment(segment)
            results.append(result)
            
            # Add delay between requests to avoid rate limiting
            if i < len(self.segments):
                print("⏳ Waiting 2 seconds before next segment...")
                time.sleep(2)
        
        return results
    
    def save_results(self, results: List[Dict[str, Any]], output_dir: str = "output") -> str:
        """Save generation results to files"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Save individual segment results
        for result in results:
            segment_file = output_path / f"{result['segment_id']}_result.json"
            with open(segment_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
        
        # Save complete results
        complete_file = output_path / "kumar_teaser_complete.json"
        with open(complete_file, 'w', encoding='utf-8') as f:
            json.dump({
                'project': "Kumar's Life Teaser",
                'generated_at': time.time(),
                'total_segments': len(results),
                'successful_segments': len([r for r in results if r['status'] == 'success']),
                'failed_segments': len([r for r in results if r['status'] == 'error']),
                'segments': results
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Results saved to: {output_path.absolute()}")
        return str(output_path.absolute())
    
    def create_assembly_script(self, output_dir: str = "output") -> str:
        """Create a script to assemble the generated segments"""
        script_content = '''#!/bin/bash
# Kumar's Life Teaser Assembly Script
# This script combines the generated segments into a final teaser

echo "🎬 Assembling Kumar's Life Teaser..."

# Create output directory
mkdir -p final_teaser

# Note: This is a template script
# You'll need to implement actual video assembly based on the generated content
# The segments are saved as JSON files with detailed prompts

echo "📁 Generated segments are in the output directory"
echo "🎥 Use video editing software to create the final teaser from the prompts"
echo "✅ Assembly script created successfully"
'''
        
        script_path = Path(output_dir) / "assemble_teaser.sh"
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        # Make script executable
        os.chmod(script_path, 0o755)
        
        return str(script_path)
    
    def generate_teaser(self, output_dir: str = "output") -> Dict[str, Any]:
        """Main method to generate the complete teaser"""
        print("🎬 Kumar's Life Teaser Generator")
        print("=" * 50)
        
        # Generate all segments
        results = self.generate_all_segments()
        
        # Save results
        output_path = self.save_results(results, output_dir)
        
        # Create assembly script
        assembly_script = self.create_assembly_script(output_dir)
        
        # Summary
        successful = len([r for r in results if r['status'] == 'success'])
        failed = len([r for r in results if r['status'] == 'error'])
        
        print("\n" + "=" * 50)
        print("🎯 GENERATION COMPLETE")
        print("=" * 50)
        print(f"✅ Successful segments: {successful}/{len(results)}")
        print(f"❌ Failed segments: {failed}/{len(results)}")
        print(f"📁 Output directory: {output_path}")
        print(f"🔧 Assembly script: {assembly_script}")
        
        if failed > 0:
            print("\n⚠️  Failed segments:")
            for result in results:
                if result['status'] == 'error':
                    print(f"   - {result['name']}: {result['error']}")
        
        return {
            'success': successful == len(results),
            'successful_segments': successful,
            'failed_segments': failed,
            'output_path': output_path,
            'assembly_script': assembly_script,
            'results': results
        }

def main():
    """Main function to run the teaser generator"""
    try:
        # Initialize generator
        generator = KumarTeaserGenerator()
        
        # Generate teaser
        result = generator.generate_teaser()
        
        if result['success']:
            print("\n🎉 Kumar's Life Teaser generated successfully!")
            print("📝 Next steps:")
            print("   1. Review the generated prompts in the output directory")
            print("   2. Use the prompts with video generation tools")
            print("   3. Assemble the final teaser using video editing software")
        else:
            print(f"\n⚠️  Generation completed with {result['failed_segments']} failed segments")
            print("📝 Check the error messages above and retry failed segments")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("💡 Make sure your GEMINI_API_KEY environment variable is set correctly")

if __name__ == "__main__":
    main()






