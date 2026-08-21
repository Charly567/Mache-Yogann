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

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash, abort
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
import uuid
import secrets
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "chanje-kle-sa-a-pou-pwodiksyon")
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB max pou telechajman


def get_csrf_token():
    """Kreye (yon sèl fwa pa sesyon) epi retounen yon jeton pou pwoteje fòm yo."""
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(16)
    return session["csrf_token"]


app.jinja_env.globals["csrf_token"] = get_csrf_token


@app.before_request
def verify_csrf():
    """Verifye chak fòm (POST) gen bon jeton anvan l trete — anpeche
    lòt sit voye rekèt kache nan non yon itilizatè konekte (CSRF)."""
    if request.method == "POST":
        token_form = request.form.get("csrf_token", "")
        token_session = session.get("csrf_token", "")
        if not token_form or token_form != token_session:
            abort(400, description="Rekèt la pa valab (jeton sekirite pa bon). Retounen epi eseye ankò.")

DB_PATH = os.path.join(os.path.dirname(__file__), "mache_yogann.db")

# Nimewo pou resevwa peman — klyan yo voye lajan sou nimewo sa yo,
# epi ekip Mache Yogann konfime tranzaksyon an manyèlman.
MONCASH_NUMBER = os.environ.get("MONCASH_NUMBER", "4770-3814")
NATCASH_NUMBER = os.environ.get("NATCASH_NUMBER", "3510-0438")

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

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            vendor_id INTEGER NOT NULL,
            buyer_name TEXT NOT NULL,
            buyer_phone TEXT NOT NULL,
            buyer_address TEXT,
            quantity INTEGER DEFAULT 1,
            total_price REAL NOT NULL,
            payment_method TEXT NOT NULL,
            transaction_ref TEXT,
            status TEXT DEFAULT 'an_tann',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(vendor_id) REFERENCES vendors(id)
        );

        CREATE TABLE IF NOT EXISTS reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0,
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
            ("Diri Konplè 5 Liv", "Diri Ayisyen konplè, sache 5 liv.", 250, None, 20, 1, "Maket", 4.8, 12, "Nouvo", "new"),
            ("Chemiz Kolonn Broder", "Chemiz kolonn tradisyonèl, bwode alamen.", 900, 1100, 8, 0, "Fason", 4.5, 8, "-20%", "discount"),
            ("Chodyè Fè 3 Litr", "Chodyè fè solid, bon pou tout kwit manje.", 1450, None, 5, 0, "Kay", 4.6, 15, "Popilè", "popular"),
            ("Chajè Telefòn Rapid", "Chajè USB-C rapid, konpatib ak pifò telefòn.", 300, None, 30, 1, "Teknoloji", 4.9, 9, "Top", "top"),
            ("Pafen Fanm 50ml", "Pafen dous, dire tout jounen.", 600, None, 12, 0, "Bote", 4.4, 7, None, None),
            ("Sandal Kwi Alamen", "Sandal kwi natirèl, fèt pa atizan Leyogàn.", 750, 880, 10, 1, "Pwomosyon", 4.7, 11, "-15%", "discount"),
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
    original_price = request.form.get("original_price", "").strip()
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
           (vendor_id, title, description, price, original_price, quantity, free_shipping, category, image_path)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (session["vendor_id"], title, description, float(price),
         float(original_price) if original_price else None,
         int(quantity), free_shipping, category, image_path),
    )
    conn.commit()
    conn.close()

    flash("Pwodwi a poste avèk siksè!", "success")
    return redirect(url_for("dashboard"))


@app.route("/dashboard/modifye/<int:product_id>", methods=["GET", "POST"])
def modifye_pwodwi(product_id):
    if "vendor_id" not in session:
        return redirect(url_for("login"))

    conn = get_db()
    product = conn.execute(
        "SELECT * FROM products WHERE id = ? AND vendor_id = ?",
        (product_id, session["vendor_id"]),
    ).fetchone()

    if not product:
        conn.close()
        flash("Pwodwi sa a pa disponib.", "error")
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        price = request.form.get("price", "0")
        original_price = request.form.get("original_price", "").strip()
        quantity = request.form.get("quantity", "1")
        free_shipping = 1 if request.form.get("free_shipping") == "on" else 0
        category = request.form.get("category", "Manje")

        image_path = product["image_path"]
        photo = request.files.get("photo")
        if photo and photo.filename and allowed_file(photo.filename):
            ext = photo.filename.rsplit(".", 1)[1].lower()
            unique_name = f"{uuid.uuid4().hex}.{ext}"
            photo.save(os.path.join(UPLOAD_FOLDER, secure_filename(unique_name)))
            image_path = f"img/pwodwi/{unique_name}"

        conn.execute(
            """UPDATE products SET title=?, description=?, price=?, original_price=?,
               quantity=?, free_shipping=?, category=?, image_path=? WHERE id=?""",
            (title, description, float(price),
             float(original_price) if original_price else None,
             int(quantity), free_shipping, category, image_path, product_id),
        )
        conn.commit()
        conn.close()
        flash("Pwodwi a mete ajou!", "success")
        return redirect(url_for("dashboard"))

    conn.close()
    return render_template("modifye.html", product=product)


@app.route("/dashboard/siprime/<int:product_id>", methods=["POST"])
def siprime_pwodwi(product_id):
    if "vendor_id" not in session:
        return redirect(url_for("login"))

    conn = get_db()
    conn.execute(
        "DELETE FROM products WHERE id = ? AND vendor_id = ?",
        (product_id, session["vendor_id"]),
    )
    conn.commit()
    conn.close()

    flash("Pwodwi a siprime.", "success")
    return redirect(url_for("dashboard"))


@app.route("/logout")
def logout():
    session.clear()
    flash("Ou dekonekte.", "success")
    return redirect(url_for("home"))


# ---------------------------------------------------------
# Swiv kòmand (pou klyan, san yo pa bezwen kont)
# ---------------------------------------------------------
@app.route("/swiv-kòmand", methods=["GET", "POST"])
def swiv_kòmand():
    orders = None
    if request.method == "POST":
        phone = request.form.get("phone", "").strip()
        conn = get_db()
        orders = conn.execute(
            "SELECT orders.*, products.title AS product_title FROM orders "
            "JOIN products ON orders.product_id = products.id "
            "WHERE orders.buyer_phone = ? ORDER BY orders.created_at DESC",
            (phone,),
        ).fetchall()
        conn.close()
        if not orders:
            flash("Nou pa jwenn okenn kòmand ak nimewo sa a.", "error")

    return render_template("swiv_kòmand.html", orders=orders)


# ---------------------------------------------------------
# Bliye modpas
# ---------------------------------------------------------
@app.route("/modpas-bliye", methods=["GET", "POST"])
def modpas_bliye():
    reset_link = None
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        conn = get_db()
        vendor = conn.execute("SELECT id FROM vendors WHERE email = ?", (email,)).fetchone()

        if vendor:
            token = uuid.uuid4().hex
            expires_at = (datetime.utcnow() + timedelta(hours=1)).isoformat()
            conn.execute(
                "INSERT INTO reset_tokens (vendor_id, token, expires_at) VALUES (?, ?, ?)",
                (vendor["id"], token, expires_at),
            )
            conn.commit()
            reset_link = url_for("modpas_reset", token=token, _external=True)
        else:
            flash("Pa gen kont ak imèl sa a.", "error")

        conn.close()

    return render_template("modpas_bliye.html", reset_link=reset_link)


@app.route("/modpas-reset/<token>", methods=["GET", "POST"])
def modpas_reset(token):
    conn = get_db()
    reset = conn.execute(
        "SELECT * FROM reset_tokens WHERE token = ? AND used = 0",
        (token,),
    ).fetchone()

    if not reset or datetime.fromisoformat(reset["expires_at"]) < datetime.utcnow():
        conn.close()
        flash("Lyen sa a pa valab ankò. Mande yon nouvo.", "error")
        return redirect(url_for("modpas_bliye"))

    if request.method == "POST":
        password = request.form.get("password", "")
        if len(password) < 6:
            flash("Modpas la dwe gen omwen 6 karaktè.", "error")
            conn.close()
            return redirect(url_for("modpas_reset", token=token))

        conn.execute(
            "UPDATE vendors SET password_hash = ? WHERE id = ?",
            (generate_password_hash(password), reset["vendor_id"]),
        )
        conn.execute("UPDATE reset_tokens SET used = 1 WHERE id = ?", (reset["id"],))
        conn.commit()
        conn.close()

        flash("Modpas ou chanje! Ou ka konekte kounye a.", "success")
        return redirect(url_for("login"))

    conn.close()
    return render_template("modpas_reset.html", token=token)


# ---------------------------------------------------------
# Achte yon pwodwi (kòmand + peman manyèl)
# ---------------------------------------------------------
@app.route("/pwodwi/<int:product_id>/achte", methods=["GET", "POST"])
def achte_pwodwi(product_id):
    conn = get_db()
    product = conn.execute(
        "SELECT products.*, vendors.business AS vendor_business, vendors.fullname AS vendor_name "
        "FROM products JOIN vendors ON products.vendor_id = vendors.id WHERE products.id = ?",
        (product_id,),
    ).fetchone()

    if not product:
        conn.close()
        flash("Pwodwi sa a pa disponib ankò.", "error")
        return redirect(url_for("home"))

    if request.method == "POST":
        buyer_name = request.form.get("buyer_name", "").strip()
        buyer_phone = request.form.get("buyer_phone", "").strip()
        buyer_address = request.form.get("buyer_address", "").strip()
        quantity = int(request.form.get("quantity", "1") or 1)
        payment_method = request.form.get("payment_method", "MonCash")

        if not (buyer_name and buyer_phone):
            flash("Tanpri antre non ak nimewo telefòn ou.", "error")
            conn.close()
            return redirect(url_for("achte_pwodwi", product_id=product_id))

        if quantity < 1 or quantity > product["quantity"]:
            flash("Kantite w mande a pa disponib.", "error")
            conn.close()
            return redirect(url_for("achte_pwodwi", product_id=product_id))

        total_price = product["price"] * quantity

        cur = conn.execute(
            """INSERT INTO orders
               (product_id, vendor_id, buyer_name, buyer_phone, buyer_address, quantity, total_price, payment_method)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (product_id, product["vendor_id"], buyer_name, buyer_phone, buyer_address,
             quantity, total_price, payment_method),
        )
        conn.commit()
        order_id = cur.lastrowid
        conn.close()
        return redirect(url_for("konfime_peman", order_id=order_id))

    conn.close()
    return render_template("achte.html", product=product)


@app.route("/kòmand/<int:order_id>/peman", methods=["GET", "POST"])
def konfime_peman(order_id):
    conn = get_db()
    order = conn.execute(
        "SELECT orders.*, products.title AS product_title FROM orders "
        "JOIN products ON orders.product_id = products.id WHERE orders.id = ?",
        (order_id,),
    ).fetchone()

    if not order:
        conn.close()
        flash("Kòmand sa a pa jwenn.", "error")
        return redirect(url_for("home"))

    if request.method == "POST":
        transaction_ref = request.form.get("transaction_ref", "").strip()
        conn.execute(
            "UPDATE orders SET transaction_ref = ? WHERE id = ?",
            (transaction_ref, order_id),
        )
        conn.commit()
        conn.close()
        flash("Mèsi! Nou resevwa referans tranzaksyon an, n ap verifye l talè.", "success")
        return redirect(url_for("home"))

    conn.close()
    return render_template(
        "peman.html", order=order,
        moncash_number=MONCASH_NUMBER, natcash_number=NATCASH_NUMBER,
    )


@app.route("/dashboard/kòmand")
def dashboard_kòmand():
    if "vendor_id" not in session:
        flash("Tanpri konekte anvan.", "error")
        return redirect(url_for("login"))

    conn = get_db()
    orders = conn.execute(
        "SELECT orders.*, products.title AS product_title FROM orders "
        "JOIN products ON orders.product_id = products.id "
        "WHERE orders.vendor_id = ? ORDER BY orders.created_at DESC",
        (session["vendor_id"],),
    ).fetchall()
    conn.close()
    return render_template("kòmand.html", orders=orders)


@app.route("/dashboard/kòmand/<int:order_id>/konfime", methods=["POST"])
def konfime_kòmand(order_id):
    if "vendor_id" not in session:
        return redirect(url_for("login"))

    conn = get_db()
    order = conn.execute(
        "SELECT * FROM orders WHERE id = ? AND vendor_id = ?",
        (order_id, session["vendor_id"]),
    ).fetchone()

    if order and order["status"] != "konfime":
        conn.execute(
            "UPDATE orders SET status = 'konfime' WHERE id = ?",
            (order_id,),
        )
        # Diminye kantite ki rete a — jamè desann pi ba pase 0.
        conn.execute(
            "UPDATE products SET quantity = MAX(0, quantity - ?) WHERE id = ?",
            (order["quantity"], order["product_id"]),
        )
        conn.commit()

    conn.close()

    flash("Kòmand lan konfime!", "success")
    return redirect(url_for("dashboard_kòmand"))


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
