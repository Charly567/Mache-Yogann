# Mache Yogann — Gid konplè

Sit la kounye a se yon **vrè aplikasyon** (Flask + baz done SQLite): kont vandè
kreye pou vre, koneksyon verifye pou vre, epi pwodwi vandè yo poste rete
anrejistre.

## Etap 1 — Enstale zouti yo
1. Telechaje **VS Code**: https://code.visualstudio.com
2. Telechaje **Python** (si w poko genyen l): https://www.python.org/downloads
   (pandan enstalasyon an, koche "Add Python to PATH")
3. Nan VS Code, enstale ekstansyon **Python** (Microsoft).

## Etap 2 — Ouvri pwojè a
1. Dekonprese dosye `mache-yogann` a yon kote (ex: `Documents/mache-yogann`).
2. VS Code → **File → Open Folder…** → chwazi `mache-yogann`.
3. Ouvri yon tèminal nan VS Code: **Terminal → New Terminal**.

## Etap 3 — Enstale depandans yo (yon sèl fwa)
Nan tèminal la, tape:
```
pip install -r requirements.txt
```

## Etap 4 — Lanse sit la lokalman
```
python app.py
```
Ou ap wè yon mesaj tankou `Running on http://127.0.0.1:5000`.
Ouvri lyen sa a nan navigatè w — sit la ap la, ak kont vandè, koneksyon,
ak pwodwi ki fonksyone pou vre.

Chak fwa w chanje kòd la, sispann sèvè a (Ctrl+C nan tèminal la) epi
relanse `python app.py`.

## Estrikti pwojè a
```
mache-yogann/
├── app.py                → Backend: wout yo, baz done, verifikasyon kont
├── requirements.txt       → Lis depandans Python
├── mache_yogann.db        → Baz done (kreye otomatikman lè w lanse app.py)
├── templates/
│   ├── base.html           → Antèt/footer pataje pou tout paj
│   ├── index.html          → Paj prensipal (mache a)
│   ├── vande.html          → Enskripsyon vandè + kondisyon
│   ├── login.html          → Koneksyon
│   └── dashboard.html      → Espas vandè pou poste pwodwi
└── static/
    ├── css/style.css        → Koulè, fon, layout
    ├── css/pages.css        → Estil fòm/paj sekondè
    └── js/app.js             → Ti lojik jeneral (mesaj flash)
```

## Modifye sit la
- **Koulè**: `static/css/style.css`, anba `:root{ }` — chanje `--sea`, `--mango`, `--leaf`, `--hibiscus`.
- **Tèks/kontni**: nan fichye `templates/*.html` — se HTML nòmal, men ak ti kòd `{{ }}` ki soti nan baz done a, pa touche moso sa yo.
- **Kondisyon sèvis / komisyon**: `templates/vande.html`, seksyon `#kondisyon`.
- **Lojik kont/baz done**: `app.py`.

## Etap 5 — Mete l sou entènèt (Render, gratis pou kòmanse)
Kontrèman ak yon sit HTML senp, sit sa a bezwen fè Python mache — Netlify
pa ka fè sa. **Render** ka fè l gratis:

1. Kreye yon kont sou https://render.com (ka konekte ak Gmail).
2. Mete pwojè a sou **GitHub** dabò (Render pran l soti la):
   - Kreye yon kont GitHub si w poko genyen (github.com)
   - Nan VS Code, tèminal la: `git init`, `git add .`, `git commit -m "premye vèsyon"`
   - Kreye yon "New repository" sou GitHub, epi swiv enstriksyon "push an existing repository" yo
3. Sou Render: **New → Web Service** → konekte repo GitHub ou a.
4. Ranpli:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Klike **Create Web Service** — Render ap bay ou yon lyen (ex: `mache-yogann.onrender.com`).

## Pwochenn etap yo
1. Peman MonCash/NatCash (API peman) — konekte sou bouton "Achte" a
2. Kalkil kòmisyon 5–10% otomatikman sou chak vant
3. Foto pwodwi vre (ranplase plasholder SVG yo)
4. Kontra/kondisyon otomatik pou chak nouvo vandè (imèl otomatik)
5. Notifikasyon Gmail + WhatsApp chak vant
