/**
 * SCRIPT.JS - Absensi Mapel Koding & AI Kelas X.TKJ 5 (FIXED VERSION)
 * Pure Vanilla JavaScript
 */

// ==========================================================================
// 1. DATA MASTER SISWA KELAS X.TKJ 5
// ==========================================================================
const STUDENTS_DATA = [
    { name: "Aisyah Putri", gender: "P" },
    { name: "Alyfha Auryna", gender: "P" },
    { name: "Anggun Rosmi", gender: "P" },
    { name: "Akhmad Danu Saputra", gender: "L" },
    { name: "Aulia Cahyani", gender: "P" },
    { name: "Basyro Muqoda", gender: "L" },
    { name: "Cahya Rahma Dannin", gender: "P" },
    { name: "Dwi Marina", gender: "P" },
    { name: "Dzaky Raihandika", gender: "L" },
    { name: "Fakir Wahyu Pratama", gender: "L" },
    { name: "Faisal Irawan", gender: "L" },
    { name: "Firmansyah", gender: "L" },
    { name: "Frandika Alfian", gender: "L" },
    { name: "Hanifa", gender: "P" },
    { name: "Herlan", gender: "L" },
    { name: "Ilham Ghalib Ahnaf", gender: "L" },
    { name: "Indira Aisyah Ramadhani", gender: "P" },
    { name: "Kiki Rahmadhani", gender: "P" },
    { name: "M. Adi Nugroho", gender: "L" },
    { name: "M. Aditya Alfiansyah", gender: "L" },
    { name: "Muhammad Al Fatih Fauzan Azhima", gender: "L" },
    { name: "M. Noko Merdeka P", gender: "L" },
    { name: "M. Syakir Abdullah Al-Husnif", gender: "L" },
    { name: "Muhammad Alvino Pratama", gender: "L" },
    { name: "Muhammad Iqbal", gender: "L" },
    { name: "Muhammad Marcellino R", gender: "L" },
    { name: "Muhammad Sultan Adira", gender: "L" },
    { name: "Nadila Riyanti", gender: "P" },
    { name: "Naila Putri", gender: "P" },
    { name: "Padila Ramadhani", gender: "P" },
    { name: "Putri Ayu Lestari", gender: "P" },
    { name: "Rama Andika", gender: "L" },
    { name: "Rindi Septiana", gender: "P" },
    { name: "Syifa Altafunnisa", gender: "P" },
    { name: "Syntia Maharani", gender: "P" },
    { name: "Wahyu Maulana", gender: "L" }
];

// Global State
let selectedStudent = null;
let attendanceSchedule = [];
let audioEnabled = true;

// ==========================================================================
// 2. DOM INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initCanvasParticles();
    generateAttendanceSchedule();
    renderStudentGrid();
    setupEventListeners();
    startRealtimeClock();
    checkSavedSession();
    updateLiveCodePreview();
});

// ==========================================================================
// 3. CANVAS PARTICLES ENGINE
// ==========================================================================
function initCanvasParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#06b6d4' : '#a855f7',
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));

    function render() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
        });
        requestAnimationFrame(render);
    }
    render();
}

// ==========================================================================
// 4. SCHEDULE GENERATOR (27 MONDAY MEETINGS)
// ==========================================================================
function generateAttendanceSchedule() {
    attendanceSchedule = [];
    let startDate = new Date(2026, 7, 10); // 10 Agustus 2026

    for (let i = 1; i <= 27; i++) {
        let meetingDate = new Date(startDate);
        meetingDate.setDate(startDate.getDate() + (i - 1) * 7);

        const dateFormatted = meetingDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        attendanceSchedule.push({
            meetingNo: i,
            dayName: "Senin",
            dateStr: dateFormatted,
            rawDate: meetingDate
        });
    }
}

// ==========================================================================
// 5. RENDER STUDENT GRID
// ==========================================================================
function renderStudentGrid(filter = "") {
    const grid = document.getElementById("studentGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = STUDENTS_DATA.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach(student => {
        const card = document.createElement("div");
        card.className = `student-card ${selectedStudent && selectedStudent.name === student.name ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="gender-badge ${student.gender === 'P' ? 'gender-p' : 'gender-l'}">
                ${student.gender}
            </div>
            <div>
                <strong>${student.name}</strong>
                <div style="font-size:0.75rem; color: var(--text-secondary);">Siswa Kelas X.TKJ 5</div>
            </div>
        `;

        card.addEventListener("click", (e) => {
            createRippleEffect(e, card);
            playAudioEffect("click");
            selectedStudent = student;
            document.querySelectorAll(".student-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            const btnEnter = document.getElementById("btnEnterDashboard");
            if (btnEnter) btnEnter.disabled = false;
        });

        grid.appendChild(card);
    });
}

// ==========================================================================
// 6. PAGE NAVIGATION
// ==========================================================================
function navigateToPage(targetPageId) {
    showLoadingOverlay(() => {
        document.querySelectorAll(".page-view").forEach(p => p.classList.add("hidden"));
        const target = document.getElementById(targetPageId);
        if (target) {
            target.classList.remove("hidden");
        }

        if (targetPageId === "pageDashboard") {
            setupDashboardData();
        }
    });
}

function showLoadingOverlay(callback) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
        overlay.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.add("hidden");
            if (callback) callback();
        }, 400);
    } else {
        if (callback) callback();
    }
}

// ==========================================================================
// 7. SETUP DASHBOARD & ATTENDANCE
// ==========================================================================
function setupDashboardData() {
    if (!selectedStudent) return;

    document.getElementById("txtWelcomeUser").textContent = `Welcome, ${selectedStudent.name}`;
    document.getElementById("dashStudentName").textContent = selectedStudent.name;
    document.getElementById("dashStudentGender").textContent = selectedStudent.gender === "L" ? "Laki-Laki (L)" : "Perempuan (P)";
    document.getElementById("idCardName").textContent = selectedStudent.name;
    document.getElementById("idCardGender").textContent = selectedStudent.gender === "L" ? "Laki-Laki" : "Perempuan";
    
    const qrImage = document.getElementById("qrImage");
    if (qrImage) {
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=XTKJ5-${encodeURIComponent(selectedStudent.name)}`;
    }

    renderAttendanceCards();
    updateAttendanceStatistics();
}

function renderAttendanceCards() {
    const grid = document.getElementById("attendanceGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const userRecords = getSavedUserAttendance(selectedStudent.name);
    const today = new Date();

    attendanceSchedule.forEach(m => {
        const card = document.createElement("div");
        card.className = "glass-card meeting-card";

        const isAttended = userRecords.includes(m.meetingNo);
        const isSameDay = today.toDateString() === m.rawDate.toDateString();
        
        let statusBadge = `<span class="status-badge locked"><i class="fa-solid fa-lock"></i> Belum Dibuka</span>`;
        let btnAction = `<button class="btn-secondary-sm" disabled><i class="fa-solid fa-lock"></i> Terkunci</button>`;

        if (isAttended) {
            statusBadge = `<span class="status-badge done"><i class="fa-solid fa-circle-check"></i> Hadir</span>`;
            btnAction = `<button class="btn-primary-sm" style="background:#10b981;" disabled><i class="fa-solid fa-check"></i> Sudah Absen</button>`;
        } else if (isSameDay) {
            statusBadge = `<span class="status-badge open"><i class="fa-solid fa-door-open"></i> Absensi Dibuka</span>`;
            btnAction = `<button class="btn-primary-sm ripple-btn" onclick="executeAttendance(${m.meetingNo})"><i class="fa-solid fa-pen"></i> Isi Absensi</button>`;
        }

        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                    <strong>Pertemuan ${m.meetingNo}</strong>
                    ${statusBadge}
                </div>
                <h4 style="color:var(--neon-cyan);">${m.dayName}, ${m.dateStr}</h4>
                <small style="color:var(--text-secondary);">Mata Pelajaran Koding & AI</small>
            </div>
            <div>${btnAction}</div>
        `;

        grid.appendChild(card);
    });

    const todayRecord = attendanceSchedule.find(s => s.rawDate.toDateString() === today.toDateString());
    const dashStatusText = document.getElementById("dashTodayStatus");
    
    if (dashStatusText) {
        if (todayRecord) {
            const attended = userRecords.includes(todayRecord.meetingNo);
            dashStatusText.textContent = attended ? "Sudah Hadir" : "Belum Absen";
            dashStatusText.style.color = attended ? "var(--neon-green)" : "var(--neon-pink)";
        } else {
            dashStatusText.textContent = "Tidak Ada Jadwal Hari Ini";
            dashStatusText.style.color = "var(--text-secondary)";
        }
    }
}

function executeAttendance(meetingNo) {
    if (!selectedStudent) return;

    let records = getSavedUserAttendance(selectedStudent.name);
    if (!records.includes(meetingNo)) {
        records.push(meetingNo);
        localStorage.setItem(`att_${selectedStudent.name}`, JSON.stringify(records));

        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        playAudioEffect("success");
        showToast(`Absensi Pertemuan ${meetingNo} Berhasil!`);
        renderAttendanceCards();
        updateAttendanceStatistics();
    }
}

function getSavedUserAttendance(studentName) {
    const data = localStorage.getItem(`att_${studentName}`);
    return data ? JSON.parse(data) : [];
}

function updateAttendanceStatistics() {
    if (!selectedStudent) return;

    const records = getSavedUserAttendance(selectedStudent.name);
    const totalHadir = records.length;
    const totalSisa = 27 - totalHadir;
    const percentage = Math.round((totalHadir / 27) * 100);

    document.getElementById("statTotalHadir").textContent = totalHadir;
    document.getElementById("statTotalSisa").textContent = totalSisa;
    document.getElementById("statPersentase").textContent = `${percentage}%`;

    document.getElementById("semesterProgressBar").style.width = `${percentage}%`;
    document.getElementById("progressText").textContent = `${totalHadir} / 27 Pertemuan Selesai`;
    document.getElementById("progressPercent").textContent = `${percentage}%`;

    const tableBody = document.getElementById("tableAttendanceHistory");
    if (tableBody) {
        tableBody.innerHTML = "";
        attendanceSchedule.forEach(m => {
            if (records.includes(m.meetingNo)) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>Pertemuan ${m.meetingNo}</td>
                    <td>${m.dateStr}</td>
                    <td>08:00 WIB</td>
                    <td><span style="color:var(--neon-green); font-weight:bold;">Hadir</span></td>
                `;
                tableBody.appendChild(tr);
            }
        });
    }
}

// ==========================================================================
// 8. EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
    // Tombol Lanjut Landing Page
    const btnLandingNext = document.getElementById("btnLandingNext");
    if (btnLandingNext) {
        btnLandingNext.addEventListener("click", (e) => {
            e.preventDefault();
            playAudioEffect("click");
            navigateToPage("pageSelectStudent");
        });
    }

    // Input Search Nama
    const inputSearch = document.getElementById("inputSearchStudent");
    if (inputSearch) {
        inputSearch.addEventListener("input", (e) => {
            renderStudentGrid(e.target.value);
        });
    }

    // Tombol Masuk Dashboard
    const btnEnter = document.getElementById("btnEnterDashboard");
    if (btnEnter) {
        btnEnter.addEventListener("click", () => {
            if (!selectedStudent) return;
            localStorage.setItem("active_student", JSON.stringify(selectedStudent));
            playAudioEffect("click");
            navigateToPage("pageDashboard");
        });
    }

    // Ganti Nama
    const btnSwitch = document.getElementById("btnSwitchAccount");
    if (btnSwitch) {
        btnSwitch.addEventListener("click", () => {
            localStorage.removeItem("active_student");
            selectedStudent = null;
            navigateToPage("pageSelectStudent");
        });
    }

    // Navigasi Sidebar & Bottom
    const allNavButtons = document.querySelectorAll(".nav-btn, .bottom-nav-btn");
    allNavButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            playAudioEffect("click");
            const targetSecId = btn.getAttribute("data-target");

            allNavButtons.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(`[data-target="${targetSecId}"]`).forEach(b => b.classList.add("active"));

            document.querySelectorAll(".dashboard-section").forEach(s => s.classList.add("hidden"));
            const targetSec = document.getElementById(targetSecId);
            if (targetSec) targetSec.classList.remove("hidden");
        });
    });

    // Tab Materi
    document.querySelectorAll(".tab-btn").forEach(tab => {
        tab.addEventListener("click", () => {
            playAudioEffect("click");
            document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".materi-tab-content").forEach(c => c.classList.add("hidden"));
            
            tab.classList.add("active");
            const targetTab = document.getElementById(tab.getAttribute("data-tab"));
            if (targetTab) targetTab.classList.remove("hidden");
        });
    });

    // Live Code Editor
    const btnRun = document.getElementById("btnRunCode");
    if (btnRun) {
        btnRun.addEventListener("click", () => {
            playAudioEffect("click");
            updateLiveCodePreview();
            showToast("Kode Berhasil Dijalankan!");
        });
    }

    const btnReset = document.getElementById("btnResetCode");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            playAudioEffect("click");
            document.getElementById("codeEditorInput").value = `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; text-align: center; color: #38bdf8; background: #0f172a; }\n  </style>\n</head>\n<body>\n  <h1>Halo, X.TKJ 5!</h1>\n</body>\n</html>`;
            updateLiveCodePreview();
        });
    }

    // Toggle Theme & Audio
    const chkAudio = document.getElementById("chkAudioSound");
    if (chkAudio) {
        chkAudio.addEventListener("change", (e) => { audioEnabled = e.target.checked; });
    }

    const btnTheme = document.getElementById("btnToggleTheme");
    if (btnTheme) {
        btnTheme.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            showToast("Mode Tampilan Diperbarui!");
        });
    }

    // Export Buttons
    const btnExcel = document.getElementById("btnExportExcel");
    if (btnExcel) btnExcel.addEventListener("click", exportToExcel);

    const btnPDF = document.getElementById("btnExportPDF");
    if (btnPDF) btnPDF.addEventListener("click", exportToPDF);

    const btnPrint = document.getElementById("btnPrintData");
    if (btnPrint) btnPrint.addEventListener("click", () => window.print());
}

// Live Code Preview Update
function updateLiveCodePreview() {
    const input = document.getElementById("codeEditorInput");
    const iframe = document.getElementById("codePreviewFrame");
    if (!input || !iframe) return;
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(input.value);
    iframeDoc.close();
}

// Realtime Clock & Countdown
function startRealtimeClock() {
    setInterval(() => {
        const now = new Date();
        const clockTime = document.getElementById("clockTime");
        const clockDate = document.getElementById("clockDate");

        if (clockTime) clockTime.textContent = now.toLocaleTimeString("id-ID") + " WIB";
        if (clockDate) clockDate.textContent = now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        updateCountdownTimer(now);
    }, 1000);
}

function updateCountdownTimer(now) {
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
    nextMonday.setHours(8, 0, 0, 0);

    const diff = nextMonday - now;
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const cdD = document.getElementById("cdDays");
        const cdH = document.getElementById("cdHours");
        const cdM = document.getElementById("cdMinutes");
        const cdS = document.getElementById("cdSeconds");

        if (cdD) cdD.textContent = String(days).padStart(2, '0');
        if (cdH) cdH.textContent = String(hours).padStart(2, '0');
        if (cdM) cdM.textContent = String(minutes).padStart(2, '0');
        if (cdS) cdS.textContent = String(seconds).padStart(2, '0');
    }
}

// Session Check
function checkSavedSession() {
    const saved = localStorage.getItem("active_student");
    if (saved) {
        try {
            selectedStudent = JSON.parse(saved);
            navigateToPage("pageDashboard");
        } catch (e) {
            localStorage.removeItem("active_student");
        }
    }
}

// Safely Wrapped Web Audio
function playAudioEffect(type) {
    if (!audioEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const audioCtx = new AudioCtx();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === "click") {
            osc.frequency.value = 600;
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === "success") {
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        }
    } catch (err) {
        // Abaikan error Web Audio jika diblokir browser
    }
}

function showToast(msg) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--neon-cyan);"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => { toast.remove(); }, 3000);
}

function createRippleEffect(event, element) {
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-effect");

    const ripple = element.getElementsByClassName("ripple-effect")[0];
    if (ripple) ripple.remove();

    element.appendChild(circle);
}

// Export Handlers
function exportToExcel() {
    if (!selectedStudent || typeof XLSX === "undefined") return;
    const records = getSavedUserAttendance(selectedStudent.name);
    
    const data = attendanceSchedule.map(m => ({
        "Pertemuan": `Pertemuan ${m.meetingNo}`,
        "Tanggal": m.dateStr,
        "Status": records.includes(m.meetingNo) ? "Hadir" : "Tidak Hadir"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Presensi");
    XLSX.writeFile(wb, `Absensi_${selectedStudent.name}_XTKJ5.xlsx`);
}

function exportToPDF() {
    const element = document.getElementById("exportPrintArea");
    if (!element || typeof html2pdf === "undefined") return;

    const opt = {
        margin: 0.5,
        filename: `Rekap_Absensi_${selectedStudent ? selectedStudent.name : 'Siswa'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

