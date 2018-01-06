const init_mix = {
    pad: -20,
    bass: 0,
    guitar: 0,
    arp: -15,
    piano: 0
};

const samples = {
    piano: {
        C6: "./samples/piano/C6.mp3",
    },
    guitar: {
    }
};

const guitar_notes = ["E2", "A2", "D3", "G3", "B3", "E4"];
for (let note = 1; note < 6; note++) {
    samples.guitar[guitar_notes[note]] = `./samples/guitar/${guitar_notes[note]}.mp3`;
}

const piano_notes = ["C", "A", "F"];
for (let oct = 1; oct < 5; oct++) {
    for (let note in piano_notes) {
        samples.piano[piano_notes[note] + oct] = `./samples/piano/${piano_notes[note]}${oct}.mp3`;
    }
}

const synths = {
    pad: new Tone.PolySynth(8, Tone.DuoSynth).set({harmonicity: 2}).chain(
        new Tone.Freeverb(0.7, 3000).toMaster(),
        new Tone.StereoWidener(0.75).toMaster(),
        Tone.Master
    ),
    bass: new Tone.Synth().chain(
        new Tone.Filter(1500, "lowpass"),
        Tone.Master
    ),
    arp: new Tone.DuoSynth({
        vibratoAmount: 0.05,
        vibratoRate: 8,
        harmonicity: 2,
        voice1: {
            oscillator: {
                type: "triangle"
            }
        },
        voice2: {
            oscillator: {
                type: "triangle"
            }
        }
    }).chain(
        new Tone.Filter(6000, "lowpass"),
        new Tone.Freeverb(0.7, 8000).toMaster(),
        Tone.Master
    ),
    guitar: new Tone.Sampler(samples.guitar).chain(
        new Tone.Freeverb(0.2, 2000).toMaster(),
        Tone.Master
    ),
    piano: new Tone.Sampler(samples.piano).chain(
        new Tone.Freeverb(0.8, 15000).toMaster(),
        Tone.Master
    )
};
Tone.Master.volume.value = -20;

let noteEvents = [];

for (const synth in synths) {
    setVolume(synth, init_mix[synth]);
}

function setVolume(synth, volume) {
    synths[synth].volume.value = volume;
}

function toggleMute(synth) {

}

function clearNoteEvents() {
    noteEvents.forEach(function(eventId) {
        Tone.Transport.clear(eventId);
    });
}

function playChordNow(tonic, chord_type, bass_note, octave, duration) {
    synths.pad.triggerAttackRelease(Tonal.Chord.notes(tonic + octave, chord_type), duration);
    //synths.bass.triggerAttackRelease(bass_note, duration);
}

function scheduleChord(event_data) {
    let { t, tonic, octave, chord_type, bass_note, seconds_per_chord, scale_factor, options } = event_data;
    let { repeat, callback } = options;
    const event = () => {
        callback(event_data);
        playChordNow(tonic, chord_type, bass_note, octave, seconds_per_chord * scale_factor);
    };
    if (repeat) {
        return Tone.Transport.scheduleRepeat(event, repeat, t * seconds_per_chord);
    } else {
        return Tone.Transport.schedule(event, t * seconds_per_chord);
    }
}

function addChordEvent(event_data) {
    noteEvents.push(scheduleChord(event_data));
}

function playNoteNow(note, instrument, seconds) {
    if (!instrument) {
        instrument = "pad";
    }
    synths[instrument].triggerAttackRelease(note, seconds);
}

function scheduleNote({note, instrument, seconds, t, seconds_per_chord, options}) {
    const event = () => {
        playNoteNow(note, instrument, seconds);
    };
    if (options.repeat) {
        return Tone.Transport.scheduleRepeat(event, options.repeat, t * seconds_per_chord);
    } else {
        return Tone.Transport.schedule(event, t * seconds_per_chord);
    }
}

function addNoteEvent(event_data) {
    noteEvents.push(scheduleNote(event_data));
}
function play() {
    Tone.Transport.start();
}

function stop() {
    Tone.Transport.stop();
}

function reset() {
    stop();
    clearNoteEvents();
}