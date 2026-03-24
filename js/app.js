// LoveNotes App
let db;

document.addEventListener('DOMContentLoaded', async () => {
    db = await openDB();
    loadNotes();
    setupEventListeners();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
});

function setupEventListeners() {
    document.getElementById('add-note-btn').addEventListener('click', showAddForm);
    document.getElementById('note-form').addEventListener('submit', saveNote);
    document.getElementById('cancel-btn').addEventListener('click', hideAddForm);
}

function showAddForm() {
    document.getElementById('notes-list').style.display = 'none';
    document.getElementById('add-note-form').style.display = 'block';
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

function hideAddForm() {
    document.getElementById('add-note-form').style.display = 'none';
    document.getElementById('notes-list').style.display = 'block';
    document.getElementById('note-form').reset();
}

async function saveNote(event) {
    event.preventDefault();
    const date = document.getElementById('date').value;
    const place = document.getElementById('place').value;
    const content = document.getElementById('content').value;

    const note = { date, place, content };
    await addNote(db, note);
    hideAddForm();
    loadNotes();
}

async function loadNotes() {
    const notes = await getAllNotes(db);
    const container = document.getElementById('notes-container');
    container.innerHTML = '';

    notes.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.innerHTML = `
            <h3>${note.place}</h3>
            <p><strong>Date:</strong> ${note.date}</p>
            <p>${note.content}</p>
            <button onclick="deleteNoteById(${note.id})">Delete</button>
        `;
        container.appendChild(noteEl);
    });
}

async function deleteNoteById(id) {
    await deleteNote(db, id);
    loadNotes();
}