from moviepy.editor import ImageSequenceClip, AudioFileClip
from gtts import gTTS
import os

# --- Configuration ---
image_folder = '/Users/kumara/personal-website/docs/dentist'
output_video_path = '/Users/kumara/personal-website/docs/dentist/output_video.mp4'
narration_text = "இறுதி ஆண்டு பிடிஎஸ் இன்டர்ன்ஷிப்பில் இருக்கும் என் மகள், தமிழ்நாடு அரசு ஏற்பாடு செய்துள்ள சமூக சேவை முகாம்களில் நோயாளிகளுக்கு சிகிச்சை அளித்து வருகிறார். இந்த தருணங்களை உங்களுடன் பகிர்ந்து கொள்வதில் பெருமை கொள்கிறேன்."
narration_audio_path = '/Users/kumara/personal-website/docs/dentist/narration.mp3'
image_duration = 5  # seconds per image

# --- Get Image Files ---
image_files = sorted([os.path.join(image_folder, f) for f in os.listdir(image_folder) if f.endswith(('.jpeg', '.jpg', '.png'))])

if not image_files:
    print("No images found in the specified folder.")
else:
    # --- Generate Narration ---
    try:
        tts = gTTS(text=narration_text, lang='ta')
        tts.save(narration_audio_path)
        print(f"Narration audio saved to {narration_audio_path}")

        # --- Create Video Clip ---
        video_clip = ImageSequenceClip(image_files, durations=[image_duration] * len(image_files))

        # --- Create Audio Clip ---
        narration_clip = AudioFileClip(narration_audio_path)

        # If the narration is longer, trim it to the video's duration.
        if narration_clip.duration > video_clip.duration:
            narration_clip = narration_clip.subclip(0, video_clip.duration)

        # --- Set Audio on Video ---
        final_clip = video_clip.set_audio(narration_clip)

        # --- Write Video File ---
        final_clip.write_videofile(output_video_path, codec='libx264', fps=24)
        print(f"Video created successfully: {output_video_path}")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please ensure you have 'moviepy' and 'gTTS' installed (`pip install moviepy gtts`).")
        print("You may also need to have ffmpeg installed on your system.")

    finally:
        # --- Cleanup ---
        if os.path.exists(narration_audio_path):
            os.remove(narration_audio_path)
            print(f"Cleaned up temporary audio file: {narration_audio_path}")
