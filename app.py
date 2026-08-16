"""
Mache Yogann — Backend Flask
------------------------------
Sèvè sa a jere:
- Kreyasyon kont vandè (enskripsyon) ak modpas kripte
- Koneksyon (login) ak sesyon
- Estokaj pwodwi nan yon baz done SQLite
- API senp pou paj yo chèche pwodwi yo

Pou lanse l lokalman:
  pip install -r requirements.txt
  python app.py
Epi ale sou http://127.0.0.1:5000
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
import uuid

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "chanje-kle-sa-a-pou-pwodiksyon")

DB_PATH = os.path.join(os.path.dirname(__file__), "mache_yogann.db")

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "img", "pwodwi")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------
# Baz done
# ---------------------------------------------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS vendors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            business TEXT,
            phone TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            location TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            original_price REAL,
            quantity INTEGER DEFAULT 1,
            free_shipping INTEGER DEFAULT 0,
            category TEXT NOT NULL,
            image_path TEXT,
            rating REAL DEFAULT 4.5,
            review_count INTEGER DEFAULT 0,
            badge TEXT,
            badge_class TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(vendor_id) REFERENCES vendors(id)
        );
    """)
    conn.commit()

    # Si pa gen okenn vandè ankò, kreye yon vandè "demo" ak kèk pwodwi
    # senpleman pou paj la pa parèt vid lè w louvri l pou premye fwa.
    existing = conn.execute("SELECT COUNT(*) AS c FROM vendors").fetchone()
    if existing["c"] == 0:
        conn.execute(
            "INSERT INTO vendors (fullname, business, phone, email, password_hash, location) VALUES (?, ?, ?, ?, ?, ?)",
            ("Vandè Demo", "Mache Yogann", "+50900000000", "demo@macheyogann.com",
             generate_password_hash("demo123"), "Leyogàn"),
        )
        demo_id = conn.execute("SELECT id FROM vendors WHERE email = ?", ("demo@macheyogann.com",)).fetchone()["id"]
        demo_products = [
            ("Panye Mango Fransik", "Mango fransik byen mi, keyi jodi a nan jaden lokal.", 250, None, 20, 1, "Manje", 4.8, 12, "Nouvo", "new"),
            ("Chemiz Kolonn Broder", "Chemiz kolonn tradisyonèl, bwode alamen.", 900, 1100, 8, 0, "Rad", 4.5, 8, "-20%", "discount"),
            ("Chodyè Fè 3 Litr", "Chodyè fè solid, bon pou tout kwit manje.", 1450, None, 5, 0, "Kay", 4.6, 15, "Popilè", "popular"),
            ("Jus Kowosòl Natirèl", "Jus kowosòl fre, san sik ajoute.", 300, None, 30, 1, "Bwason", 4.9, 9, "Top", "top"),
            ("Panyen Twal Tise", "Panyen tise alamen ak twal kolore.", 600, None, 12, 0, "Atizana", 4.4, 7, None, None),
            ("Sandal Kwi Alamen", "Sandal kwi natirèl, fèt pa atizan Leyogàn.", 750, 880, 10, 1, "Rad", 4.7, 11, "-15%", "discount"),
        ]
        conn.executemany(
            "INSERT INTO products (vendor_id, title, description, price, original_price, quantity, free_shipping, category, rating, review_count, badge, badge_class) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [(demo_id, *p) for p in demo_products],
        )
        conn.commit()

    conn.close()


# ---------------------------------------------------------
# Paj yo
# ---------------------------------------------------------
@app.route("/")
def home():
    conn = get_db()
    products = conn.execute("""
        SELECT products.*, vendors.fullname AS vendor_name, vendors.business AS vendor_business
        FROM products JOIN vendors ON products.vendor_id = vendors.id
        ORDER BY products.created_at DESC
    """).fetchall()
    conn.close()
    return render_template("index.html", products=products)


@app.route("/vandè", methods=["GET", "POST"])
def vandè():
    if request.method == "POST":
        fullname = request.form.get("fullname", "").strip()
        business = request.form.get("business", "").strip()
        phone = request.form.get("phone", "").strip()
        email = request.form.get("email", "").strip().lower()
        location = request.form.get("location", "").strip()
        password = request.form.get("password", "")

        if not (fullname and phone and email and location and password):
            flash("Tanpri ranpli tout jaden obligatwa yo.", "error")
            return redirect(url_for("vandè"))

        conn = get_db()
        existing = conn.execute("SELECT id FROM vendors WHERE email = ?", (email,)).fetchone()
        if existing:
            flash("Gen yon kont ki deja itilize imèl sa a.", "error")
            conn.close()
            return redirect(url_for("vandè"))

        conn.execute(
            "INSERT INTO vendors (fullname, business, phone, email, password_hash, location) VALUES (?, ?, ?, ?, ?, ?)",
            (fullname, business, phone, email, generate_password_hash(password), location),
        )
        conn.commit()
        conn.close()

        flash("Kont vandè a kreye avèk siksè! Ou ka konekte kounye a.", "success")
        return redirect(url_for("login"))

    return render_template("vande.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        conn = get_db()
        vendor = conn.execute("SELECT * FROM vendors WHERE email = ?", (email,)).fetchone()
        conn.close()

        if vendor and check_password_hash(vendor["password_hash"], password):
            session["vendor_id"] = vendor["id"]
            session["vendor_name"] = vendor["fullname"]
            flash(f"Byenveni, {vendor['fullname']}!", "success")
            return redirect(url_for("dashboard"))

        flash("Imèl oswa modpas pa kòrèk.", "error")
        return redirect(url_for("login"))

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    if "vendor_id" not in session:
        flash("Tanpri konekte anvan.", "error")
        return redirect(url_for("login"))

    conn = get_db()
    products = conn.execute(
        "SELECT * FROM products WHERE vendor_id = ? ORDER BY created_at DESC",
        (session["vendor_id"],),
    ).fetchall()
    conn.close()
    return render_template("dashboard.html", products=products)


@app.route("/dashboard/poste", methods=["POST"])
def poste_pwodwi():
    if "vendor_id" not in session:
        return redirect(url_for("login"))

    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()
    price = request.form.get("price", "0")
    quantity = request.form.get("quantity", "1")
    free_shipping = 1 if request.form.get("free_shipping") == "on" else 0
    category = request.form.get("category", "Manje")

    if not title:
        flash("Tanpri antre non pwodwi a.", "error")
        return redirect(url_for("dashboard"))

    # Jere foto a (si vandè a chwazi younn)
    image_path = None
    photo = request.files.get("photo")
    if photo and photo.filename and allowed_file(photo.filename):
        ext = photo.filename.rsplit(".", 1)[1].lower()
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        photo.save(os.path.join(UPLOAD_FOLDER, secure_filename(unique_name)))
        image_path = f"img/pwodwi/{unique_name}"

    conn = get_db()
    conn.execute(
        """INSERT INTO products
           (vendor_id, title, description, price, quantity, free_shipping, category, image_path)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (session["vendor_id"], title, description, float(price), int(quantity), free_shipping, category, image_path),
    )
    conn.commit()
    conn.close()

    flash("Pwodwi a poste avèk siksè!", "success")
    return redirect(url_for("dashboard"))


@app.route("/logout")
def logout():
    session.clear()
    flash("Ou dekonekte.", "success")
    return redirect(url_for("home"))


# ---------------------------------------------------------
# API senp (pou itilizasyon JS pita si nesesè)
# ---------------------------------------------------------
@app.route("/api/pwodwi")
def api_products():
    conn = get_db()
    products = conn.execute("SELECT * FROM products ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(p) for p in products])


# Kreye tab yo (si yo poko egziste) chak fwa modil sa a chaje —
# sa asire baz done a pare kit ou lanse "python app.py" lokalman,
# kit sèvè pwodiksyon an (gunicorn) chaje aplikasyon an.
init_db()


if __name__ == "__main__":
    app.run(debug=True)
