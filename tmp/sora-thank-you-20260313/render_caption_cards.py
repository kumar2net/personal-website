from pathlib import Path
import textwrap

from PIL import Image, ImageDraw, ImageFont


OUT_DIR = Path("/Users/kumara/personal-website/output/sora-thank-you-20260313/caption_cards")
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
WIDTH = 720
HEIGHT = 1280
BOX_WIDTH = 600
BOX_HEIGHT = 170
BOX_Y = 980
TEXT_COLOR = (246, 246, 246, 255)
BOX_COLOR = (18, 18, 20, 180)
ACCENT_COLOR = (255, 110, 84, 220)

CAPTIONS = [
    "Same medium. Same love.",
    "For the ones who made time.",
    "Chennai still feels like home.",
    "Sweater, laughter, small things that stay.",
    "Singapore said think bigger.",
    "Plan boldly. Live fully.",
    "Orlando kept the thread alive.",
    "Even from far away, still close.",
    "Trust like this changes everything.",
    "Be bold. Live a full life.",
    "This one is for all of you.",
    "Thank you for making it together. Ciao.",
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype(FONT_PATH, 40)

    for index, caption in enumerate(CAPTIONS, start=1):
        image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)

        box_x = (WIDTH - BOX_WIDTH) // 2
        box_xy = (box_x, BOX_Y, box_x + BOX_WIDTH, BOX_Y + BOX_HEIGHT)
        draw.rounded_rectangle(box_xy, radius=34, fill=BOX_COLOR)
        draw.rounded_rectangle((box_x + 24, BOX_Y + 24, box_x + 136, BOX_Y + 38), radius=7, fill=ACCENT_COLOR)

        wrapped = textwrap.fill(caption, width=28)
        text_bbox = draw.multiline_textbbox((0, 0), wrapped, font=font, spacing=10, align="center")
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        text_x = (WIDTH - text_width) / 2
        text_y = BOX_Y + ((BOX_HEIGHT - text_height) / 2) + 18

        draw.multiline_text(
            (text_x, text_y),
            wrapped,
            font=font,
            fill=TEXT_COLOR,
            spacing=10,
            align="center",
        )

        out_path = OUT_DIR / f"{index:02d}.png"
        image.save(out_path)


if __name__ == "__main__":
    main()
