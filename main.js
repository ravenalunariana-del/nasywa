/**
 * main.js - Skrip Interaktif Portofolio Bertema Orbit & Luar Angkasa
 * Mengelola: Navigasi Responsif, Mode Edit Teks, Upload Foto Lokal,
 * dan Sistem Kotak Masuk Pesan Real-Time (Inbox Dashboard).
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initPhotoUploader();
  initTextEditMode();
  initContactFormAndInbox();
});

/* ==========================================================
   1. Navigasi Responsif & Highlight Menu Aktif
   ========================================================== */
function initNavbar() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Highlight menu aktif sesuai halaman
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      (currentPath.endsWith(href) && href !== "") ||
      (currentPath.endsWith("/") && (href === "index.html" || href === "./" || href === "/"))
    ) {
      link.classList.add("bg-indigo-50", "text-indigo-600", "font-semibold");
      link.classList.remove("text-slate-600");
    }
  });
}

/* ==========================================================
   2. Fitur Unggah Foto Profil Asli dari Galeri
   ========================================================== */
function initPhotoUploader() {
  const profileContainer = document.getElementById("profile-photo-container");
  const photoInput = document.getElementById("profile-photo-input");
  const profileImg = document.getElementById("profile-photo-img");
  const resetBtn = document.getElementById("profile-photo-reset");

  // Muat foto dari localStorage jika sebelumnya pernah diunggah
  const savedPhoto = localStorage.getItem("orbit_portfolio_avatar");
  if (savedPhoto && profileImg) {
    profileImg.src = savedPhoto;
    if (resetBtn) resetBtn.classList.remove("hidden");
  }

  if (profileContainer && photoInput) {
    profileContainer.addEventListener("click", () => {
      photoInput.click();
    });

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          if (profileImg) {
            profileImg.src = result;
          }
          try {
            localStorage.setItem("orbit_portfolio_avatar", result);
          } catch (err) {
            console.warn("Storage quota limit reached for avatar");
          }
          if (resetBtn) resetBtn.classList.remove("hidden");
          showToast("Foto profil berhasil diperbarui!");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (resetBtn && profileImg) {
    resetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.removeItem("orbit_portfolio_avatar");
      profileImg.src = "assets/images/profile-placeholder.svg";
      resetBtn.classList.add("hidden");
      showToast("Foto profil dikembalikan ke placeholder bawaan.");
    });
  }
}

/* ==========================================================
   3. Mode Edit Teks Langsung di Layar (contentEditable)
   ========================================================== */
function initTextEditMode() {
  const toggleBtn = document.getElementById("toggle-edit-mode");
  const editBanner = document.getElementById("edit-mode-banner");
  const resetTextBtn = document.getElementById("reset-all-text");

  let isEditMode = false;
  const editableElements = document.querySelectorAll("[data-editable]");

  // Muat teks tersimpan dari localStorage
  editableElements.forEach((el) => {
    const key = "orbit_text_" + el.getAttribute("data-editable");
    const savedText = localStorage.getItem(key);
    if (savedText) {
      el.innerText = savedText;
    }
  });

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isEditMode = !isEditMode;
      updateEditModeState(isEditMode, toggleBtn, editBanner, editableElements);
    });
  }

  if (resetTextBtn) {
    resetTextBtn.addEventListener("click", () => {
      if (confirm("Kembalikan seluruh teks halaman ke tulisan bawaan awal?")) {
        editableElements.forEach((el) => {
          const key = "orbit_text_" + el.getAttribute("data-editable");
          localStorage.removeItem(key);
        });
        window.location.reload();
      }
    });
  }
}

function updateEditModeState(active, btn, banner, elements) {
  if (active) {
    btn.classList.add("bg-indigo-600", "text-white", "border-indigo-700");
    btn.classList.remove("bg-slate-50", "text-slate-700", "border-slate-200");
    btn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      <span>Mode Edit Aktif</span>
    `;

    if (banner) banner.classList.remove("hidden");

    elements.forEach((el) => {
      el.setAttribute("contenteditable", "true");
      el.classList.add("outline-none", "border-b-2", "border-dashed", "border-indigo-500", "bg-indigo-50/50", "rounded", "px-1");
      
      el.addEventListener("blur", () => {
        const key = "orbit_text_" + el.getAttribute("data-editable");
        localStorage.setItem(key, el.innerText.trim());
      });
    });

    showToast("Mode Edit Aktif: Klik pada teks mana saja untuk mengedit!");
  } else {
    btn.classList.remove("bg-indigo-600", "text-white", "border-indigo-700");
    btn.classList.add("bg-slate-50", "text-slate-700", "border-slate-200");
    btn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
      <span>Mode Edit Teks</span>
    `;

    if (banner) banner.classList.add("hidden");

    elements.forEach((el) => {
      el.removeAttribute("contenteditable");
      el.classList.remove("outline-none", "border-b-2", "border-dashed", "border-indigo-500", "bg-indigo-50/50", "rounded", "px-1");
    });
  }
}

/* ==========================================================
   4. Formulir Kontak & Sistem Kotak Masuk Pesan Real-Time
   ========================================================== */
function initContactFormAndInbox() {
  const contactForm = document.getElementById("contact-form");
  const modal = document.getElementById("message-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const toggleInboxBtn = document.getElementById("toggle-inbox-btn");
  const inboxContainer = document.getElementById("inbox-dashboard-container");
  const inboxList = document.getElementById("inbox-messages-list");
  const inboxBadge = document.getElementById("inbox-badge-count");
  const clearInboxBtn = document.getElementById("clear-inbox-btn");

  // Fungsi muat pesan
  function getMessages() {
    try {
      const data = localStorage.getItem("orbit_inbox_messages");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Fungsi simpan pesan
  function saveMessages(msgs) {
    try {
      localStorage.setItem("orbit_inbox_messages", JSON.stringify(msgs));
    } catch {}
    renderInbox();
  }

  // Render daftar pesan di Dashboard
  function renderInbox() {
    const msgs = getMessages();
    if (inboxBadge) inboxBadge.innerText = msgs.length;

    if (!inboxList) return;

    if (msgs.length === 0) {
      inboxList.innerHTML = `
        <div class="text-center py-12 text-slate-400 space-y-2">
          <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
          </div>
          <p class="font-medium text-slate-600">Belum ada pesan yang masuk</p>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Isi formulir di atas untuk menguji pengiriman pesan secara langsung.</p>
        </div>
      `;
      return;
    }

    inboxList.innerHTML = msgs
      .map(
        (m, idx) => `
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5 relative group hover:shadow-md transition-all">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-900">${escapeHtml(m.name)}</span>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">Pesan #${msgs.length - idx}</span>
              </div>
              <h5 class="text-xs font-semibold text-indigo-600 pt-0.5">${escapeHtml(m.subject)}</h5>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="text-[11px] font-mono">${m.date}</span>
              <button onclick="window.deleteInboxItem(${m.id})" class="text-slate-300 hover:text-rose-500 p-1 rounded transition-colors" title="Hapus pesan ini">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
          <p class="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">${escapeHtml(m.message)}</p>
        </div>
      `
      )
      .join("");
  }

  // Delete handler expose ke window
  window.deleteInboxItem = (id) => {
    const updated = getMessages().filter((item) => item.id !== id);
    saveMessages(updated);
    showToast("Pesan berhasil dihapus dari Inbox.");
  };

  // Kosongkan seluruh inbox
  if (clearInboxBtn) {
    clearInboxBtn.addEventListener("click", () => {
      if (confirm("Kosongkan semua pesan di dashboard?")) {
        saveMessages([]);
        showToast("Dashboard pesan telah dikosongkan.");
      }
    });
  }

  // Toggle rahasia dashboard
  if (toggleInboxBtn && inboxContainer) {
    toggleInboxBtn.addEventListener("click", () => {
      inboxContainer.classList.toggle("hidden");
      renderInbox();
      if (!inboxContainer.classList.contains("hidden")) {
        inboxContainer.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Submit Formulir Kontak
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("sender-name");
      const subjectInput = document.getElementById("sender-subject");
      const messageInput = document.getElementById("sender-message");

      const name = nameInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !subject || !message) {
        alert("Harap isi semua kolom formulir.");
        return;
      }

      const now = new Date();
      const formattedDate = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMsg = {
        id: Date.now(),
        name,
        subject,
        message,
        date: formattedDate,
      };

      const existing = getMessages();
      saveMessages([newMsg, ...existing]);

      // Tampilkan Modal Notifikasi Sukses Interaktif
      if (modal) {
        document.getElementById("modal-summary-name").innerText = name;
        document.getElementById("modal-summary-subject").innerText = subject;
        modal.classList.remove("hidden");
      }

      contactForm.reset();
    });
  }

  // Tutup Modal
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Inisialisasi awal render inbox
  renderInbox();
}

/* ==========================================================
   5. Helper: Toast Notification & HTML Escaping
   ========================================================= */
function showToast(message) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className =
      "fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xl transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none flex items-center gap-2";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span>${message}</span>
  `;

  toast.classList.remove("translate-y-10", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0", "pointer-events-none");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 3200);
}

function escapeHtml(string) {
  const div = document.createElement("div");
  div.innerText = string;
  return div.innerHTML;
}
