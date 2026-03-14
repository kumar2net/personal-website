from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 720
HEIGHT = 1280
FPS = 25
OUT_DIR = Path("/Users/kumara/personal-website/generate/ytshorts/crude-oil-lpg-india-sora2")
FRAMES_DIR = OUT_DIR / "frames"
SEGMENTS_DIR = OUT_DIR / "segments"

FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

BG_TOP = (10, 24, 54)
BG_BOTTOM = (7, 12, 22)
GRID = (255, 255, 255, 18)
WHITE = (245, 247, 250)
MUTED = (198, 208, 224)
YELLOW = (255, 196, 61)
RED = (227, 76, 54)
BLUE = (82, 182, 255)
SILVER = (170, 178, 189)
CARD = (17, 27, 46, 228)
CARD_SOFT = (20, 34, 58, 214)
INK = (7, 12, 22)

SCENES = [
    {"slug": "01-hook", "duration": 5},
    {"slug": "02-breakdown", "duration": 8},
    {"slug": "03-lpg", "duration": 7},
    {"slug": "04-uses", "duration": 7},
    {"slug": "05-system", "duration": 7},
    {"slug": "06-endcard", "duration": 6},
]

TITLE = "From 1 Barrel of Crude Oil to LPG in Indian Kitchens"
DESCRIPTION = """What do we actually get from 1 barrel of crude oil?

This Short shows how one crude oil barrel becomes multiple fuels, with a special focus on LPG and why it matters in Indian kitchens.

Crude oil is not one product. It becomes a connected energy system that powers cooking, transport, freight, and flights.

#CrudeOil #LPG #India #Petrol #Diesel #JetFuel #EnergyExplained #OilRefinery #YouTubeShorts
"""
TAGS = "#CrudeOil #LPG #India #Petrol #Diesel #JetFuel #EnergyExplained #OilRefinery #CookingGas #YouTubeShorts"
PINNED_COMMENT = 'Want Part 2 on how refineries split crude into different fuels? Comment "REFINERY".'
VOICEOVER = """One barrel of crude oil means one hundred and fifty nine litres.

But it does not become just one fuel.

From a single barrel, a refinery can produce roughly five to eight litres of LPG, sixty five to seventy two litres of petrol, forty to forty eight litres of diesel, and thirteen to sixteen litres of jet fuel.

In India, the most familiar product in this chain is often LPG cooking gas.

Petrol powers cars and bikes.
Diesel powers trucks, buses, and generators.
Jet fuel powers aircraft.
And LPG powers everyday cooking in millions of homes.

That is the real story of crude oil.
One source, many fuels, and a direct link from refinery towers to the Indian kitchen.
"""

SRT = """1
00:00:00,000 --> 00:00:05,000
1 barrel of crude oil = 159 litres.

2
00:00:05,000 --> 00:00:13,000
From one barrel, refineries produce LPG, petrol, diesel, and jet fuel.

3
00:00:13,000 --> 00:00:20,000
In India, LPG matters because it powers everyday cooking in millions of homes.

4
00:00:20,000 --> 00:00:27,000
Petrol powers cars and bikes.
Diesel powers trucks, buses, and generators.

5
00:00:27,000 --> 00:00:34,000
Jet fuel powers aircraft.
Crude oil is one source feeding many daily-life fuels.

6
00:00:34,000 --> 00:00:40,000
From refinery towers to the Indian kitchen, energy is a whole system.
"""


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def ensure_dirs() -> None:
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    SEGMENTS_DIR.mkdir(parents=True, exist_ok=True)


def draw_gradient(image: Image.Image, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> None:
    draw = ImageDraw.Draw(image, "RGBA")
    for y in range(HEIGHT):
        ratio = y / max(HEIGHT - 1, 1)
        color = tuple(int(top[i] + (bottom[i] - top[i]) * ratio) for i in range(3))
        draw.line((0, y, WIDTH, y), fill=color + (255,), width=1)


def draw_background(image: Image.Image) -> ImageDraw.ImageDraw:
    draw_gradient(image, BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(image, "RGBA")

    for x in range(40, WIDTH, 56):
        draw.line((x, 0, x, HEIGHT), fill=GRID, width=1)
    for y in range(80, HEIGHT, 56):
        draw.line((0, y, WIDTH, y), fill=GRID, width=1)

    draw.ellipse((440, -100, 860, 320), fill=(82, 182, 255, 36))
    draw.ellipse((-160, 760, 260, 1180), fill=(255, 196, 61, 34))
    draw.ellipse((480, 890, 860, 1270), fill=(227, 76, 54, 28))

    return draw


def wrap_text(draw: ImageDraw.ImageDraw, text: str, use_font: ImageFont.FreeTypeFont, max_width: int) -> str:
    words = text.split()
    lines: list[str] = []
    current = ""

    for word in words:
        proposal = word if not current else f"{current} {word}"
        if draw.textlength(proposal, font=use_font) <= max_width:
            current = proposal
        else:
            if current:
                lines.append(current)
            current = word

    if current:
        lines.append(current)

    return "\n".join(lines)


def text_block(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    use_font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    max_width: int,
    spacing: int = 6,
) -> tuple[int, int]:
    wrapped = wrap_text(draw, text, use_font, max_width)
    draw.multiline_text(xy, wrapped, font=use_font, fill=fill, spacing=spacing)
    bbox = draw.multiline_textbbox(xy, wrapped, font=use_font, spacing=spacing)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def pill(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, fill: tuple[int, int, int], text_fill: tuple[int, int, int]) -> None:
    use_font = font(FONT_BOLD, 28)
    tw = draw.textlength(text, font=use_font)
    w = int(tw) + 44
    draw.rounded_rectangle((x, y, x + w, y + 54), radius=27, fill=fill)
    draw.text((x + 22, y + 11), text, font=use_font, fill=text_fill)


def barrel_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    w = int(170 * scale)
    h = int(250 * scale)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=int(28 * scale), fill=(36, 45, 62, 255), outline=SILVER + (255,), width=int(5 * scale))
    draw.ellipse((x, y - 18 * scale, x + w, y + 26 * scale), fill=(63, 73, 91, 255), outline=SILVER + (255,), width=int(5 * scale))
    draw.ellipse((x, y + h - 26 * scale, x + w, y + h + 18 * scale), fill=(23, 31, 45, 255), outline=SILVER + (255,), width=int(5 * scale))
    for pct in (0.22, 0.5, 0.78):
        yy = y + int(h * pct)
        draw.line((x + 12, yy, x + w - 12, yy), fill=SILVER + (190,), width=int(5 * scale))


def cylinder_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    w = int(170 * scale)
    h = int(220 * scale)
    neck_pad = max(int(46 * scale), 18)
    valve_pad = max(int(60 * scale), 26)
    draw.rounded_rectangle((x, y + 24, x + w, y + h), radius=int(24 * scale), fill=RED + (255,), outline=(255, 225, 225, 210), width=int(4 * scale))
    draw.rounded_rectangle((x + neck_pad, y, x + w - neck_pad, y + max(int(44 * scale), 22)), radius=max(int(14 * scale), 10), fill=RED + (255,), outline=(255, 225, 225, 210), width=max(int(4 * scale), 2))
    draw.rounded_rectangle((x + valve_pad, y + max(int(10 * scale), 6), x + w - valve_pad, y + max(int(28 * scale), 18)), radius=max(int(8 * scale), 6), fill=(177, 43, 29, 255))
    draw.line((x + 26, y + 126, x + w - 26, y + 126), fill=(255, 208, 201, 210), width=int(4 * scale))


def flame_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    outer = [
        (x, y + 72 * scale),
        (x + 24 * scale, y + 20 * scale),
        (x + 54 * scale, y),
        (x + 78 * scale, y + 38 * scale),
        (x + 62 * scale, y + 92 * scale),
        (x + 26 * scale, y + 108 * scale),
    ]
    inner = [
        (x + 24 * scale, y + 76 * scale),
        (x + 40 * scale, y + 38 * scale),
        (x + 52 * scale, y + 58 * scale),
        (x + 46 * scale, y + 88 * scale),
    ]
    draw.polygon(outer, fill=BLUE + (255,))
    draw.polygon(inner, fill=(186, 237, 255, 255))


def car_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0, fill: tuple[int, int, int] = YELLOW) -> None:
    w = int(110 * scale)
    h = int(50 * scale)
    draw.rounded_rectangle((x, y + 22, x + w, y + h + 22), radius=int(12 * scale), fill=fill + (255,))
    draw.polygon([(x + 18 * scale, y + 22), (x + 42 * scale, y), (x + 82 * scale, y), (x + 98 * scale, y + 22)], fill=fill + (255,))
    draw.ellipse((x + 18 * scale, y + 54, x + 42 * scale, y + 78), fill=INK + (255,))
    draw.ellipse((x + 72 * scale, y + 54, x + 96 * scale, y + 78), fill=INK + (255,))


def truck_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0, fill: tuple[int, int, int] = SILVER) -> None:
    draw.rounded_rectangle((x, y + 18 * scale, x + 92 * scale, y + 68 * scale), radius=int(10 * scale), fill=fill + (255,))
    draw.rounded_rectangle((x + 94 * scale, y + 30 * scale, x + 142 * scale, y + 68 * scale), radius=int(10 * scale), fill=fill + (255,))
    for xx in (x + 24 * scale, x + 72 * scale, x + 110 * scale):
        draw.ellipse((xx, y + 56 * scale, xx + 22 * scale, y + 78 * scale), fill=INK + (255,))


def plane_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0, fill: tuple[int, int, int] = BLUE) -> None:
    body = [
        (x, y + 18 * scale),
        (x + 78 * scale, y + 10 * scale),
        (x + 136 * scale, y),
        (x + 145 * scale, y + 12 * scale),
        (x + 90 * scale, y + 22 * scale),
        (x + 74 * scale, y + 40 * scale),
        (x + 18 * scale, y + 52 * scale),
    ]
    wing = [(x + 50 * scale, y + 24 * scale), (x + 74 * scale, y - 16 * scale), (x + 92 * scale, y - 8 * scale), (x + 78 * scale, y + 28 * scale)]
    tail = [(x + 26 * scale, y + 22 * scale), (x + 8 * scale, y - 6 * scale), (x + 20 * scale, y - 4 * scale), (x + 38 * scale, y + 18 * scale)]
    draw.polygon(body, fill=fill + (255,))
    draw.polygon(wing, fill=fill + (255,))
    draw.polygon(tail, fill=fill + (255,))


def stove_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    draw.rounded_rectangle((x, y + 54 * scale, x + 170 * scale, y + 130 * scale), radius=int(18 * scale), fill=(33, 45, 65, 255))
    draw.ellipse((x + 26 * scale, y + 68 * scale, x + 72 * scale, y + 114 * scale), outline=SILVER + (255,), width=int(4 * scale))
    draw.ellipse((x + 96 * scale, y + 68 * scale, x + 142 * scale, y + 114 * scale), outline=SILVER + (255,), width=int(4 * scale))
    draw.rounded_rectangle((x + 18 * scale, y, x + 152 * scale, y + 36 * scale), radius=int(12 * scale), fill=SILVER + (220,))


def refinery_icon(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    draw.rounded_rectangle((x, y + 90 * scale, x + 230 * scale, y + 210 * scale), radius=int(18 * scale), fill=CARD_SOFT, outline=SILVER + (180,), width=int(4 * scale))
    for idx, offset in enumerate((0, 58, 126)):
        tower_h = (180, 240, 210)[idx]
        draw.rounded_rectangle(
            (x + 26 * scale + offset * scale, y + (210 - tower_h) * scale, x + 66 * scale + offset * scale, y + 210 * scale),
            radius=int(14 * scale),
            fill=(34, 46, 66, 255),
            outline=SILVER + (190,),
            width=int(4 * scale),
        )
    draw.line((x + 18 * scale, y + 178 * scale, x + 210 * scale, y + 178 * scale), fill=YELLOW + (220,), width=int(6 * scale))
    draw.line((x + 164 * scale, y + 98 * scale, x + 184 * scale, y + 60 * scale), fill=RED + (210,), width=int(5 * scale))
    draw.ellipse((x + 176 * scale, y + 40 * scale, x + 198 * scale, y + 62 * scale), fill=(255, 196, 61, 210))


def section_card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: tuple[int, int, int], title: str, value: str, body: str) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=28, fill=CARD, outline=accent + (220,), width=3)
    draw.rounded_rectangle((x0 + 22, y0 + 18, x0 + 122, y0 + 32), radius=7, fill=accent + (255,))
    label_font = font(FONT_BOLD, 28)
    value_font = font(FONT_BLACK, 44)
    body_font = font(FONT_REG, 28)
    draw.text((x0 + 22, y0 + 50), title, font=label_font, fill=WHITE)
    draw.text((x0 + 22, y0 + 92), value, font=value_font, fill=accent)
    text_block(draw, body, (x0 + 22, y0 + 156), body_font, MUTED, x1 - x0 - 44)


def scene_01() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = draw_background(image)

    pill(draw, 44, 42, "INDIA ENERGY EXPLAINER", YELLOW, INK)
    title_font = font(FONT_BLACK, 72)
    sub_font = font(FONT_REG, 34)
    big_font = font(FONT_BLACK, 120)

    draw.multiline_text((48, 146), "1 BARREL OF\nCRUDE OIL", font=title_font, fill=WHITE, spacing=6)
    draw.text((52, 365), "= 159 LITRES", font=big_font, fill=YELLOW)
    draw.rounded_rectangle((48, 520, 360, 690), radius=34, fill=CARD_SOFT)
    text_block(draw, "One barrel is a starting point, not a single finished fuel.", (76, 560), sub_font, MUTED, 250, spacing=8)

    draw.ellipse((402, 232, 686, 516), outline=BLUE + (140,), width=6)
    draw.ellipse((426, 256, 662, 492), outline=BLUE + (60,), width=2)
    barrel_icon(draw, 460, 252, 1.1)
    draw.line((528, 512, 528, 690), fill=YELLOW + (255,), width=4)
    draw.rounded_rectangle((426, 698, 636, 778), radius=18, fill=(11, 18, 31, 230))
    draw.text((468, 720), "REFINERY IN", font=font(FONT_BOLD, 24), fill=MUTED)
    draw.text((470, 748), "MULTIPLE FUELS OUT", font=font(FONT_BOLD, 24), fill=WHITE)

    text_block(draw, "Crude oil gets split into several everyday fuels.", (48, 1128), sub_font, WHITE, 620)
    return image


def scene_02() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = draw_background(image)

    pill(draw, 44, 42, "WHAT COMES OUT?", RED, WHITE)
    draw.text((44, 130), "TYPICAL OUTPUT RANGE", font=font(FONT_BLACK, 60), fill=WHITE)
    barrel_icon(draw, 44, 242, 0.62)
    draw.line((160, 362, 248, 362), fill=SILVER + (200,), width=4)

    section_card(draw, (244, 238, 654, 420), RED, "LPG", "5-8 L", "Cooking gas, petrochemical feed, and smaller share by volume.")
    section_card(draw, (44, 456, 344, 698), YELLOW, "PETROL", "65-72 L", "Powers cars and bikes in daily transport.")
    section_card(draw, (376, 456, 676, 698), SILVER, "DIESEL", "40-48 L", "Used in trucks, buses, and generators.")
    section_card(draw, (112, 736, 608, 962), BLUE, "JET FUEL", "13-16 L", "Keeps aircraft moving across long distances.")

    text_block(draw, "Volumes vary by crude type and refinery configuration, but the mix shows why oil powers many different systems.", (46, 1046), font(FONT_REG, 32), MUTED, 628, spacing=8)
    return image


def scene_03() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = draw_background(image)

    pill(draw, 44, 42, "WHY LPG MATTERS", YELLOW, INK)
    draw.text((44, 128), "INDIAN KITCHENS", font=font(FONT_BLACK, 74), fill=WHITE)
    text_block(draw, "In India, the most familiar product in this chain is often LPG cooking gas.", (48, 234), font(FONT_REG, 34), MUTED, 600, spacing=8)

    draw.rounded_rectangle((42, 396, 330, 964), radius=40, fill=CARD)
    cylinder_icon(draw, 100, 518, 1.0)
    draw.text((98, 804), "LPG", font=font(FONT_BLACK, 54), fill=WHITE)
    draw.text((98, 864), "5-8 L", font=font(FONT_BLACK, 78), fill=RED)

    draw.rounded_rectangle((372, 396, 678, 964), radius=40, fill=CARD_SOFT)
    stove_icon(draw, 436, 610, 1.0)
    flame_icon(draw, 484, 470, 1.2)
    draw.rounded_rectangle((440, 520, 612, 566), radius=18, fill=SILVER + (220,))
    draw.text((454, 528), "BLUE FLAME", font=font(FONT_BOLD, 24), fill=INK)
    text_block(draw, "Delivered as cylinders and turned into an everyday cooking flame.", (404, 814), font(FONT_REG, 30), WHITE, 238, spacing=8)

    draw.line((330, 678, 372, 678), fill=YELLOW + (255,), width=4)
    return image


def scene_04() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = draw_background(image)

    pill(draw, 44, 42, "ONE BARREL, MANY USES", BLUE, INK)
    draw.text((44, 128), "WHERE THE FUELS GO", font=font(FONT_BLACK, 62), fill=WHITE)

    lanes = [
        ("LPG", "household cooking", RED, "cylinder"),
        ("PETROL", "cars and bikes", YELLOW, "car"),
        ("DIESEL", "trucks, buses, generators", SILVER, "truck"),
        ("JET FUEL", "aircraft", BLUE, "plane"),
    ]

    y = 290
    for label, body, color, icon in lanes:
        draw.rounded_rectangle((46, y, 674, y + 170), radius=34, fill=CARD if icon != "plane" else CARD_SOFT)
        draw.rounded_rectangle((68, y + 28, 206, y + 46), radius=8, fill=color + (255,))
        draw.text((68, y + 58), label, font=font(FONT_BLACK, 42), fill=color)
        draw.text((68, y + 108), body, font=font(FONT_REG, 30), fill=WHITE)
        draw.line((314, y + 84, 468, y + 84), fill=color + (200,), width=4)
        if icon == "cylinder":
            cylinder_icon(draw, 510, y + 22, 0.56)
        elif icon == "car":
            car_icon(draw, 510, y + 46, 1.2)
        elif icon == "truck":
            truck_icon(draw, 492, y + 40, 1.16)
        else:
            plane_icon(draw, 486, y + 60, 1.16)
        y += 198

    return image


def scene_05() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = draw_background(image)

    pill(draw, 44, 42, "SYSTEM VIEW", RED, WHITE)
    draw.text((44, 126), "ONE SOURCE. MANY FUELS.", font=font(FONT_BLACK, 62), fill=WHITE)
    text_block(draw, "Crude enters a refinery, gets separated, and then moves into cooking, transport, freight, and aviation.", (46, 214), font(FONT_REG, 32), MUTED, 620, spacing=8)

    refinery_icon(draw, 44, 416, 1.25)
    draw.text((88, 720), "REFINERY", font=font(FONT_BLACK, 36), fill=WHITE)

    house_box = (454, 354, 654, 492)
    car_box = (454, 534, 654, 672)
    truck_box = (454, 714, 654, 852)
    plane_box = (454, 894, 654, 1032)
    for box in (house_box, car_box, truck_box, plane_box):
        draw.rounded_rectangle(box, radius=28, fill=CARD)

    draw.line((340, 510, 454, 422), fill=RED + (255,), width=6)
    draw.line((340, 562, 454, 602), fill=YELLOW + (255,), width=6)
    draw.line((340, 610, 454, 782), fill=SILVER + (255,), width=6)
    draw.line((340, 650, 454, 962), fill=BLUE + (255,), width=6)

    cylinder_icon(draw, 506, 374, 0.46)
    draw.text((468, 454), "KITCHEN", font=font(FONT_BOLD, 24), fill=WHITE)
    car_icon(draw, 490, 566, 0.95)
    draw.text((476, 640), "CARS & BIKES", font=font(FONT_BOLD, 24), fill=WHITE)
    truck_icon(draw, 486, 752, 0.92)
    draw.text((478, 824), "FREIGHT", font=font(FONT_BOLD, 24), fill=WHITE)
    plane_icon(draw, 476, 930, 0.92)
    draw.text((490, 1002), "FLIGHTS", font=font(FONT_BOLD, 24), fill=WHITE)

    return image


def scene_06() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = draw_background(image)

    draw.rounded_rectangle((44, 112, 676, 862), radius=44, fill=(8, 14, 28, 210), outline=YELLOW + (160,), width=2)
    pill(draw, 214, 72, "ENERGY IS A SYSTEM", YELLOW, INK)
    title_font = font(FONT_BLACK, 64)
    body_font = font(FONT_REG, 34)

    draw.multiline_text((86, 214), "FROM CRUDE OIL\nTO YOUR\nKITCHEN, CAR,\nTRUCK, AND FLIGHT", font=title_font, fill=WHITE, spacing=10)
    draw.rounded_rectangle((88, 694, 632, 802), radius=26, fill=CARD_SOFT)
    text_block(draw, "One source becomes many fuels. That is why LPG is only one part of a much larger refinery story.", (116, 724), body_font, MUTED, 492, spacing=8)

    draw.rounded_rectangle((112, 952, 608, 1038), radius=38, fill=RED + (255,))
    draw.text((160, 978), "FOLLOW FOR SIMPLE ENERGY EXPLAINERS", font=font(FONT_BOLD, 24), fill=WHITE)
    draw.text((196, 1116), "Crude oil -> refinery -> daily life", font=font(FONT_BOLD, 30), fill=YELLOW)

    return image


def render_frames() -> list[Path]:
    scenes = [scene_01(), scene_02(), scene_03(), scene_04(), scene_05(), scene_06()]
    frame_paths: list[Path] = []

    for info, image in zip(SCENES, scenes, strict=True):
        out_path = FRAMES_DIR / f"{info['slug']}.png"
        image.save(out_path)
        frame_paths.append(out_path)

    scenes[0].convert("RGB").save(OUT_DIR / "thumbnail.jpg", quality=95)
    return frame_paths


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def probe_duration(path: Path) -> float:
    output = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(output)


def render_segments(frame_paths: list[Path]) -> list[Path]:
    video_paths: list[Path] = []
    scale_w = int(WIDTH * 1.08)
    scale_h = int(HEIGHT * 1.08)

    for index, (scene, frame_path) in enumerate(zip(SCENES, frame_paths, strict=True)):
        duration = scene["duration"]
        dx = "(in_w-out_w)*0.22*(t/{dur})".format(dur=duration)
        dy = "(in_h-out_h)*0.12*(t/{dur})".format(dur=duration)
        if index % 2 == 0:
            crop = f"crop={WIDTH}:{HEIGHT}:x='(in_w-out_w)/2-{dx}':y='(in_h-out_h)/2+{dy}'"
        else:
            crop = f"crop={WIDTH}:{HEIGHT}:x='(in_w-out_w)/2+{dx}':y='(in_h-out_h)/2-{dy}'"
        vf = f"scale={scale_w}:{scale_h},{crop},format=yuv420p"
        out_path = SEGMENTS_DIR / f"{scene['slug']}.mp4"
        run(
            [
                "ffmpeg",
                "-y",
                "-loop",
                "1",
                "-framerate",
                str(FPS),
                "-t",
                str(duration),
                "-i",
                str(frame_path),
                "-vf",
                vf,
                "-an",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-r",
                str(FPS),
                str(out_path),
            ]
        )
        video_paths.append(out_path)

    return video_paths


def build_video(video_paths: list[Path]) -> Path:
    concat_list = OUT_DIR / "concat-list.txt"
    concat_list.write_text("\n".join(f"file '{path}'" for path in video_paths) + "\n", encoding="utf-8")
    master_video = OUT_DIR / "master-no-audio.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(master_video)])
    return master_video


def build_voiceover() -> Path:
    voice_txt = OUT_DIR / "voiceover.txt"
    voice_txt.write_text(VOICEOVER.strip() + "\n", encoding="utf-8")

    aiff_path = OUT_DIR / "voiceover.aiff"
    m4a_path = OUT_DIR / "voiceover.m4a"

    run(["say", "-v", "Aman", "-r", "170", "-f", str(voice_txt), "-o", str(aiff_path)])
    run(["ffmpeg", "-y", "-i", str(aiff_path), "-c:a", "aac", "-b:a", "160k", str(m4a_path)])
    return m4a_path


def build_final(master_video: Path, narration: Path) -> Path:
    final_video = OUT_DIR / "final.mp4"
    narration_duration = probe_duration(narration)
    audio_filter = "apad"
    if narration_duration > 40:
        audio_filter = f"atempo={narration_duration / 40:.5f},apad"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(master_video),
            "-i",
            str(narration),
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-af",
            audio_filter,
            "-t",
            "40",
            "-movflags",
            "+faststart",
            str(final_video),
        ]
    )
    return final_video


def write_metadata() -> None:
    (OUT_DIR / "title.txt").write_text(TITLE + "\n", encoding="utf-8")
    (OUT_DIR / "description.txt").write_text(DESCRIPTION.strip() + "\n", encoding="utf-8")
    (OUT_DIR / "tags.txt").write_text(TAGS + "\n", encoding="utf-8")
    (OUT_DIR / "pinned-comment.txt").write_text(PINNED_COMMENT + "\n", encoding="utf-8")
    (OUT_DIR / "final.srt").write_text(SRT.strip() + "\n", encoding="utf-8")

    storyboard = """# Storyboard

- 01 hook (5s): single barrel + 159 litres reveal.
- 02 breakdown (8s): LPG, petrol, diesel, jet fuel output cards.
- 03 LPG focus (7s): cylinder + blue flame + kitchen story.
- 04 uses (7s): where each fuel goes.
- 05 system (7s): refinery splitting into daily-life outputs.
- 06 endcard (6s): one source, many fuels, CTA.
"""
    (OUT_DIR / "storyboard.md").write_text(storyboard, encoding="utf-8")


def write_manifest(final_video: Path, master_video: Path, narration: Path) -> None:
    manifest = {
        "project": "crude-oil-lpg-india-local-short",
        "created_at": subprocess.check_output(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"], text=True).strip(),
        "format": {
            "aspect_ratio": "9:16",
            "size": f"{WIDTH}x{HEIGHT}",
            "duration_seconds": 40,
            "fps": FPS,
        },
        "outputs": {
            "final_video": final_video.name,
            "master_video": master_video.name,
            "voiceover_audio": narration.name,
            "captions": "final.srt",
            "thumbnail": "thumbnail.jpg",
            "title": "title.txt",
            "description": "description.txt",
            "tags": "tags.txt",
            "pinned_comment": "pinned-comment.txt",
            "storyboard": "storyboard.md",
        },
        "notes": {
            "render_mode": "local infographic fallback",
            "sora_attempt": "blocked by billing hard limit",
            "voice": "Aman via macOS say",
        },
    }
    (OUT_DIR / "upload-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    ensure_dirs()
    frame_paths = render_frames()
    video_paths = render_segments(frame_paths)
    master_video = build_video(video_paths)
    narration = build_voiceover()
    final_video = build_final(master_video, narration)
    write_metadata()
    write_manifest(final_video, master_video, narration)


if __name__ == "__main__":
    main()
