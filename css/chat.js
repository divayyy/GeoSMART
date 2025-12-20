// public/scripts/chat.js

const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chat-box');

// Fungsi utama yang dijalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const soal = sessionStorage.getItem('soalUntukAI');
    
    if (soal) {
        // 1. Tampilkan soal di textarea (Simulasi CTRL+V)
        userInput.value = soal.trim();
        // 2. Kunci input agar tidak bisa diubah/dihapus
        userInput.setAttribute('readonly', 'true');
        
        // Pesan awal dari sistem
        tampilkanPesan('ai', 'Selamat datang. Soal Anda sudah di sini. Klik "Dapatkan Petunjuk" untuk mendapatkan bantuan.');
        
    } else {
        userInput.value = "Tidak ada soal yang disalin. Silakan kembali ke halaman soal.";
        sendBtn.disabled = true;
    }
});

// Event Listener untuk tombol "Dapatkan Petunjuk"
sendBtn.addEventListener('click', async () => {
    const userSoal = userInput.value;
    if (!userSoal || sendBtn.disabled) return;
    
    // Menonaktifkan tombol setelah klik pertama (Pembatasan Percakapan)
    sendBtn.disabled = true; 
    sendBtn.innerText = 'Memproses Petunjuk...';
    userInput.style.backgroundColor = '#cccccc';

    tampilkanPesan('ai', 'Mencari petunjuk...⏳');

    try {
        // Mengirim soal ke server Node.js
        const response = await fetch('/api/get-clue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ soal: userSoal })
        });

        const data = await response.json();

        // Hapus pesan loading
        hapusPesanLoading();

        if (response.ok) {
            tampilkanPesan('ai', data.clue);
        } else {
            tampilkanPesan('ai', 'Maaf, terjadi masalah pada server. ' + (data.error || 'Silakan coba lagi.'));
        }

    } catch (error) {
        console.error("Kesalahan jaringan:", error);
        hapusPesanLoading();
        tampilkanPesan('ai', 'Terjadi kesalahan koneksi.');
    }
});

// Fungsi untuk menampilkan pesan di chat box
function tampilkanPesan(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = text.replace(/\n/g, '<br>'); 
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk menghapus pesan loading
function hapusPesanLoading() {
    const loadingMessage = chatBox.querySelector('.message.ai:last-child');
    if (loadingMessage && loadingMessage.innerHTML.includes('Mencari petunjuk...')) {
        chatBox.removeChild(loadingMessage);
    }
}