from PIL import Image
import json, os, zipfile

IN_FILE = "source.png"
OUT_DIR = "dist_madizi_assets"

os.makedirs(OUT_DIR, exist_ok=True)

img = Image.open(IN_FILE).convert("RGBA")

def save_png(size, name, pad_ratio=0.0):
    """
    pad_ratio: 0.0 = pas de padding
               0.2 = 20% de marge (utile pour maskable)
    """
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner = int(size * (1.0 - pad_ratio * 2))
    if inner < 1:
        inner = 1
    scaled = img.copy()
    scaled.thumbnail((inner, inner), Image.LANCZOS)
    x = (size - scaled.size[0]) // 2
    y = (size - scaled.size[1]) // 2
    canvas.paste(scaled, (x, y), scaled)
    canvas.save(os.path.join(OUT_DIR, name), "PNG", optimize=True)

# --- PWA icons ---
save_png(192, "icon-192x192.png", pad_ratio=0.0)
save_png(512, "icon-512x512.png", pad_ratio=0.0)

# Maskable: on ajoute une safe-zone (padding ~20%)
save_png(192, "maskable-icon-192x192.png", pad_ratio=0.20)
save_png(512, "maskable-icon-512x512.png", pad_ratio=0.20)

# Apple touch icon (iOS)
save_png(180, "apple-touch-icon.png", pad_ratio=0.0)

# Favicons png (optionnels)
save_png(16, "favicon-16x16.png", pad_ratio=0.0)
save_png(32, "favicon-32x32.png", pad_ratio=0.0)
save_png(48, "favicon-48x48.png", pad_ratio=0.0)

# favicon.ico multi-sizes
ico_path = os.path.join(OUT_DIR, "favicon.ico")
img_ico = img.copy()
img_ico.thumbnail((256, 256), Image.LANCZOS)
img_ico.save(ico_path, format="ICO", sizes=[(16,16),(32,32),(48,48),(64,64)])

# manifest.webmanifest
manifest = {
  "name": "Madizi",
  "short_name": "Madizi",
  "description": "Plateforme d'annonces de décès – familles et professionnels.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0b0d1a",
  "theme_color": "#0b0d1a",
  "icons": [
    {"src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png"},
    {"src": "/maskable-icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable"},
    {"src": "/maskable-icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
  ]
}
with open(os.path.join(OUT_DIR, "manifest.webmanifest"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

# ZIP final
zip_name = "madizi-logo-pack.zip"
with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
    for fn in os.listdir(OUT_DIR):
        z.write(os.path.join(OUT_DIR, fn), arcname=fn)

print("OK ✅ Généré :", zip_name)
print("Dossier :", OUT_DIR)
