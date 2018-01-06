function makeChordsClickable() {
    const chord_textarea = elem('chords');
    document.querySelectorAll('.chord').forEach(chord_cell => {
        chord_cell.addEventListener('mousedown', click_event =>  {
            chord_textarea.value = `${chord_textarea.value} ${click_event.target.textContent}`;
            chord_textarea.dispatchEvent(new Event('change'));
        });
    });
}

const chordchart = {
    buttons: {
        generate: elem('makechart')
    },
    fields: {
        tonic: elem('tonic', true)
    },
    checkboxes: {
        sevenths: elem('sevenths', true)
    },
    table: {
        major: elem('majorscale'),
        dorian: elem('dorianscale'),
        phrygian: elem('phrygianscale'),
        lydian: elem('lydianscale'),
        mixolydian: elem('mixolydianscale'),
        minor: elem('minorscale'),
        locrian: elem('locrianscale')
    }
};

const chord_types = {
    basic: ["", "m", "m", "", "", "m", "dim"],
    sevenths: ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"],
};
chord_types.current = chord_types.sevenths;

function makeChordRow(notes, offset) {
    return notes.map((note, idx) => `<td class='chord'>${note}${chord_types.current[(idx+offset)%7]}</td>`).join("");
}

function makeChart() {
    if (chordchart.checkboxes.sevenths.checked) {
        chord_types.current = chord_types.sevenths;
    } else {
        chord_types.current = chord_types.basic;
    }

    const tonic = chordchart.fields.tonic.value;

    chordchart.table.major.innerHTML = "<th>Major</th>" + makeChordRow(Tonal.Scale.notes(tonic, "major"), 0);
    chordchart.table.dorian.innerHTML = "<th>Dorian</th>" + makeChordRow(Tonal.Scale.notes(tonic, "dorian"), 1);
    chordchart.table.phrygian.innerHTML = "<th>Phrygian</th>" + makeChordRow(Tonal.Scale.notes(tonic, "phrygian"), 2);
    chordchart.table.lydian.innerHTML = "<th>Lydian</th>" + makeChordRow(Tonal.Scale.notes(tonic, "lydian"), 3);
    chordchart.table.mixolydian.innerHTML = "<th>Mixolydian</th>" + makeChordRow(Tonal.Scale.notes(tonic, "mixolydian"), 4);
    chordchart.table.minor.innerHTML = "<th>Minor</th>" + makeChordRow(Tonal.Scale.notes(tonic, "minor"), 5);
    chordchart.table.locrian.innerHTML = "<th>Locrian</th>" + makeChordRow(Tonal.Scale.notes(tonic, "locrian"), 6);

    makeChordsClickable();
}

makeChart();
chordchart.fields.tonic.addEventListener('change', makeChart);
chordchart.buttons.generate.addEventListener('click', makeChart);
chordchart.checkboxes.sevenths.addEventListener('click', makeChart);
