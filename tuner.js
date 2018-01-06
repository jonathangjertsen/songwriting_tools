document.querySelectorAll('.note').forEach(note_cell => {
    note_cell.addEventListener('mousedown', click_event =>  {
        playNoteNow(click_event.target.textContent, "guitar", 4);
    });
});

document.querySelectorAll('.up').forEach(up_cell => {
    up_cell.addEventListener('mousedown', click_event => {
        incrementNote(document.getElementById(`string-${click_event.target.id.split("up-")[1]}`));
    });
});

document.querySelectorAll('.down').forEach(down_cell => {
    down_cell.addEventListener('mousedown', click_event => {
        decrementNote(document.getElementById(`string-${click_event.target.id.split("down-")[1]}`));
    });
});

document.getElementById('all-up').addEventListener('mousedown', () => document.querySelectorAll('.string').forEach(incrementNote));
document.getElementById('all-down').addEventListener('mousedown', () => document.querySelectorAll('.string').forEach(decrementNote));

function incrementNote(note_cell) {
    note_cell.textContent = Tonal.Note.simplify(Tonal.Distance.transpose(note_cell.textContent, "2m"));
}

function decrementNote(note_cell) {
    note_cell.textContent = Tonal.Note.simplify(Tonal.Distance.transpose(note_cell.textContent, "-2m"));
}
