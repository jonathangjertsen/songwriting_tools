const piano = {
    frame: elem('piano-frame', false),
    options: {
        sustain: elem('sustain-pedal', true),
        note_labels: elem('note-labels', true),
    }
};

const pianoNoteEvents = {};
const keyboardToNote = {
    a: { note: "C3", held: false },
    w: { note: "Db3", held: false },
    s: { note: "D3", held: false },
    e: { note: "Eb3", held: false },
    d: { note: "E3", held: false },
    f: { note: "F3", held: false },
    t: { note: "Gb3", held: false },
    g: { note: "G3", held: false },
    y: { note: "Ab3", held: false },
    h: { note: "A3", held: false },
    u: { note: "Bb3", held: false },
    j: { note: "B3", held: false },
    k: { note: "C4", held: false },
    o: { note: "Db4", held: false },
    l: { note: "D4", held: false },
    p: { note: "Eb4", held: false },
    ø: { }
};

function playPianoNote(note) {
    if (piano.options.sustain.checked) {
        pianoNoteEvents[note] = synths.piano.triggerAttackRelease(note, 4);
    } else {
        pianoNoteEvents[note] = synths.piano.triggerAttack(note);
    }
}

function stopPianoNote(note) {
    if (!piano.options.sustain.checked) {
        synths.piano.triggerRelease(pianoNoteEvents[note]);
    }
}

document.querySelectorAll('.key').forEach(note_cell => {
    note_cell.addEventListener('mousedown', click_event =>  {
        playPianoNote(click_event.target.id.split("piano-")[1]);
    });
    note_cell.addEventListener('mouseup', click_event =>  {
        stopPianoNote(click_event.target.id.split("piano-")[1]);
    });
});

function showNotes(notes, octave_sensitive) {
    document.querySelectorAll('.key').forEach(element => {
        const key_note = octave_sensitive ? element.id.split("piano-")[1] : element.dataset.note;
        if (notes.indexOf(key_note) !== -1) {
            element.style.background = "gray";
        } else {
            element.style.background = element.classList.contains('black') ? "black" : "white";
        }
    });
}

function setNoteLabelVisibility(visible) {
    if (visible) {
        piano.frame.classList.add('with-labels');
    } else {
        piano.frame.classList.remove('with-labels');
    }
}
setNoteLabelVisibility(piano.options.note_labels.checked);
piano.options.note_labels.addEventListener('change', event => {
    setNoteLabelVisibility(event.target.checked);
});

document.addEventListener('keydown', event => {
    if (event.key in keyboardToNote && !(keyboardToNote[event.key].held)) {
        playPianoNote(keyboardToNote[event.key].note);
        keyboardToNote[event.key].held = true;
        showNotes(Object.keys(keyboardToNote).filter(key => keyboardToNote[key].held).map(key => keyboardToNote[key].note), true);
    }
});

document.addEventListener('keyup', event => {
    if (event.key in keyboardToNote) {
        stopPianoNote(keyboardToNote[event.key]);
        keyboardToNote[event.key].held = false;
        showNotes(Object.keys(keyboardToNote).filter(key => keyboardToNote[key].held).map(key => keyboardToNote[key].note), true);
    }
});
