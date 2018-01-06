function idenfityBaseChord(chord, type) {
    const subsets = Tonal.Chord.subsets(chord);
    const [ tonic, chord_type ] = parseChord(chord);
    if (chord_type === "m" || subsets.indexOf("m") !== -1) {
        if (type === "basic") {
            return [tonic + "m"];
        } else {
            return [tonic + "m7"];
        }
    } else if (chord_type === "" || chord_type === "M" || subsets.indexOf("M") !== -1) {
        if (type === "basic") {
            return [tonic];
        } else {
            return [tonic + "maj7", tonic + "7"];
        }
    } else if (chord_type === "dim" || subsets.indexOf("o") !== -1) {
        if (type === "basic") {
            return [tonic + "dim"];
        } else {
            return [tonic + "m7b5"];
        }
    } else {
        return []
    }
}

function parseLengthModifier(chord_spec) {
    let scale_factor;
    if (chord_spec[1] === "x") {
        scale_factor = parseInt(chord_spec[0]);
        chord_spec = chord_spec.substring(2);
    } else {
        scale_factor = 1;
    }

    return [ chord_spec, scale_factor ];
}

function parseOctaveModifier(prev_chord, prev_octave) {
    let chord, octave;
    if (prev_chord[0] === "v") {
        octave = prev_octave - 1;
        chord = prev_chord.substring(1);
    } else if (prev_chord[0] === "^") {
        octave = prev_octave + 1;
        chord = prev_chord.substring(1);
    } else {
        octave = prev_octave;
        chord = prev_chord;
    }
    return [ chord, octave ];
}

function parseBassModifier(prev_chord, octave) {
    const chord_components = prev_chord.split("/");
    let chord, bass_note;
    if (chord_components.length > 1) {
        chord = chord_components[0];
        bass_note = chord_components[1] + (octave - 2);
    } else {
        chord = prev_chord;
        let [ tonic, _ ] = parseChord(chord);
        bass_note = tonic + (octave - 2);
    }
    return [ chord, bass_note ];
}

function parseChord(chord) {
    let tonic, chord_type;
    if (chord[1] === "b" || chord[1] === "#") {
        tonic = chord[0] + chord[1];
        chord_type = chord.substring(2);
    } else {
        tonic = chord[0];
        chord_type = chord.substring(1);
    }
    return [ tonic, chord_type ];
}

function parseModifiers(chord_spec, octave) {
    let chord, bass_note;
    [ chord, octave ] = parseOctaveModifier(chord_spec, octave);
    [ chord, bass_note ] = parseBassModifier(chord, octave);
    return [ chord, octave, bass_note ];
}
