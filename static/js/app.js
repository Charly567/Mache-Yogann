// app.js
// Lojik jeneral sit la. Filtè kategori ak achte pwodwi jere dirèkteman
// nan chak paj (gade block "extra_js" nan templates/index.html).

// Ti otomasyon pou mesaj flash yo disparèt apre 4 segonn.
document.addEventListener("DOMContentLoaded", () => {
  const flashes = document.querySelectorAll(".flash");
  flashes.forEach(f => {
    setTimeout(() => { f.style.transition = "opacity .4s"; f.style.opacity = "0"; }, 4000);
  });

  // Meni mobil (bouton ☰)
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navlinks = document.getElementById("navlinks");
  if (menuBtn && navlinks) {
    menuBtn.addEventListener("click", () => {
      navlinks.classList.toggle("open");
    });
  }
});
