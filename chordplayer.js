const player = {
    buttons: {
        play: elem('play'),
        stop: elem('stop'),
        loop: elem('loop'),
        clear: elem('clear')
    },
    fields: {
        chords: elem('chords', true),
        octave: elem('octave', true),
        beats_per_chord: elem('beatsperchord', true),
        beat_length: elem('beatlength', true),
        tempo: elem('tempo', true)
    },
    now_playing: {
        chord: elem('current_chord'),
        step: elem('current_step'),
    },
    mixer: {
        sliders: {
            pad: elem('pad-mix', true),
            bass: elem('bass-mix', true),
            arp: elem('arp-mix', true),
            piano: elem('piano-mix', true),
            guitar: elem('guitar-mix', true),
        }
    },
    misc: {
        allowedChords: elem('chordnames'),
        warningList: elem('warning-list')
    }
};
let play_state = "stop";

// Initialization
player.misc.allowedChords.innerHTML = '<li>' + Tonal.Chord.names().join('</li><li>') + '</li>';
player.buttons.play.addEventListener('mousedown', () => playButtonClicked("play"));
player.buttons.loop.addEventListener('mousedown', () => loopButtonClicked("loop"));
player.buttons.stop.addEventListener('mousedown', stopButtonClicked);
player.buttons.clear.addEventListener('mousedown', () => player.fields.chords.value = "");
for (const channel in player.mixer.sliders) {
    player.mixer.sliders[channel].addEventListener('change', event => setVolume(channel, event.target.value));
}

// Lib
function clearWarnings() {
    player.misc.warningList.innerHTML = "";
}

function addWarning(warning) {
    player.misc.warningList.innerHTML += `<li>${warning}</li>`;
}

function checkIfChordExists(chord) {
    if (!Tonal.Chord.exists(chord)) {
        addWarning(`${chord} is not an allowed chord`);
    }
}

function readPlayerForm() {
    const chords = player.fields.chords.value
        .trim()
        .split("\n")
        .join(" ")
        .split(" ")
        .map(chord => chord.trim().replace('dim', 'o'))
        .filter(chord => chord.length);
    const beats_per_chord = parseInt(player.fields.beats_per_chord.value);
    const beat_length = 4 / parseInt(player.fields.beat_length.value);
    const seconds_per_chord = 60 * beats_per_chord * beat_length / parseInt(player.fields.tempo.value);
    const octave = parseInt(player.fields.octave.value);
    return [ chords, octave, seconds_per_chord, beats_per_chord ];
}

function isValid([ chords, octave, seconds_per_chord, beats_per_chord ]) {
    if (chords.length === 1 && chords[0] === "") {
        addWarning("No chords provided");
        return false;
    }
    return true;
}

function setPlayMode(new_play_state) {
    player.buttons.play.disabled = true;
    player.buttons.loop.disabled = true;
    player.buttons.stop.disabled = false;
    play_state = new_play_state;
}

function setStopMode() {
    player.buttons.play.disabled = false;
    player.buttons.loop.disabled = false;
    player.buttons.stop.disabled = true;
    play_state = "stop";
}

function getTotalDuration(chords) {
    let t = 0;
    chords.forEach(chord => {
        [ chord, scale_factor ] = parseLengthModifier(chord);
        t += scale_factor;
    });
    return t;
}

function playButtonClicked() {
    reset();
    clearWarnings();

    let form_values = readPlayerForm();
    if (!isValid(form_values)) {
        return;
    }
    let [ chords, octave, seconds_per_chord, beats_per_chord ] = form_values;
    const total_t = getTotalDuration(chords);
    addChords(form_values, { repeat: 0, callback: showChord({total_t})});

    play();
    setPlayMode();
    setTimeout(stopButtonClicked, 1000 * total_t * seconds_per_chord);
}

function loopButtonClicked() {
    reset();
    stop();
    clearWarnings();
    let form_values = readPlayerForm();
    if (!isValid(form_values)) {
        return;
    }
    let [ chords, octave, seconds_per_chord, beats_per_chord ] = form_values;
    const total_t = getTotalDuration(chords);
    addChords(form_values, { repeat: total_t * seconds_per_chord, callback: showChord({total_t})});

    setPlayMode();
    play();
}

function showChord(a_priori_data) {
    return function(event_data) {
        const final_time = a_priori_data.total_t * event_data.seconds_per_chord;
        const chord = event_data.tonic + event_data.chord_type.replace("o", "dim");
        player.now_playing.chord.innerHTML = chord;
        player.now_playing.step.innerHTML = `${event_data.t+1}/${a_priori_data.total_t}`;
        document.querySelectorAll('.chord').forEach(element => {
            if (idenfityBaseChord(chord, elem('sevenths').checked ? "sevenths" : "basic").indexOf(element.textContent) !== -1) {
                element.style.background = "gray";
            } else {
                element.style.background = "white";
            }
        });
        document.querySelectorAll('.key').forEach(element => showNotes(Tonal.Chord.notes(chord)));
    };
}

function stopButtonClicked() {
    stop();
    setStopMode();
}

function containsSubChords(chord_spec) {
    return chord_spec.split(",").length > 1;
}

function addSubChords(chord_spec, octave, t, seconds_per_chord, beats_per_chord, scale_factor, options) {
    const subchords = chord_spec.split(",");
    const num_subchords = subchords.length;
    for (let i = 0; i < num_subchords; i++) {
        addChord(
            subchords[i],
            octave,
            t + i/num_subchords,
            seconds_per_chord,
            beats_per_chord,
            scale_factor/num_subchords,
            options
        );
    }
}

function addChords([ chords, octave, seconds_per_chord, beats_per_chord ], options) {
    let t = 0;
    chords.forEach(chord => {
        let bass_note;
        [ chord, scale_factor ] = parseLengthModifier(chord);
        addChord(chord, octave, t, seconds_per_chord, beats_per_chord, scale_factor, options);
        t += scale_factor;
    });
    return t + 1;
}

function addChord(chord_spec, octave, t, seconds_per_chord, beats_per_chord, scale_factor, options) {
    // Pad
    chord_spec = chord_spec.trim();
    if (containsSubChords(chord_spec)) {
        addSubChords(chord_spec, octave, t, seconds_per_chord, beats_per_chord, scale_factor, options);
        return;
    }
    let tonic, chord, chord_type, bass_note;
    [ chord, octave, bass_note ] = parseModifiers(chord_spec, octave);
    checkIfChordExists(chord);
    [ tonic, chord_type ] = parseChord(chord);
    addChordEvent({ t, tonic, octave, chord_type, bass_note, seconds_per_chord, scale_factor, options });

    // Bass and arp patterns

    const arp_notes = Tonal.Chord.notes(tonic + octave, chord_type);
    let arp_ctr = 0;
    for (let i = 0; i < beats_per_chord; i++) {
        for (let j = 0; j < scale_factor; j++) {
            addNoteEvent({
                note: bass_note,
                instrument: "bass",
                seconds: seconds_per_chord / beats_per_chord,
                t: t + (i*scale_factor + j) / beats_per_chord,
                seconds_per_chord,
                options
            });
            for (let k = 0; k < 2; k++) {
                arp_ctr++;
                addNoteEvent({
                    note: arp_notes[arp_ctr % arp_notes.length],
                    instrument: "arp",
                    seconds: seconds_per_chord / (2*beats_per_chord),
                    t: t + (i*scale_factor + (j + k/2)) / beats_per_chord,
                    seconds_per_chord,
                    options
                });
            }
        }
    }
}
