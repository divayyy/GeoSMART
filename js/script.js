const nameInput = document.getElementById('nameInput');
const studentName = document.getElementById('studentName');
const startBtn = document.getElementById('startBtn');
const askAI = document.getElementById('askAI');

startBtn.onclick = () => {
  if (nameInput.value.trim() !== "") {
    studentName.textContent = nameInput.value;
  }
};

askAI.onclick = () => {
  if (studentName.textContent === "[Student's Name]") return;

  const text = `Halo Gemini, saya ${studentName.textContent}.
Saya sedang mengerjakan soal geometri.
Mohon berikan CLUE / PETUNJUK saja,
BUKAN jawaban akhir.`;

  navigator.clipboard.writeText(text);
  window.open("https://gemini.google.com/app", "_blank");
};
