# jonathrg's songwriting tools

Uses [tonal](https://github.com/danigb/tonal), [Tone.js](https://github.com/Tonejs/Tone.js) and [Vanilla JS](http://vanilla-js.com/) to build a songwriting widgets

![screenshot](https://raw.githubusercontent.com/jonathangjertsen/songwriting_tools/master/images/songwriting-tools.png)

## Installation

Download and serve the source code

## Widgets

* **Chord player**: plays the chord progression that is written into a text field
  * A synth pad plays the full chord, a synth bass plays the root, and another synth arpeggiates the chords. More "themes" are planned
  * Supports the chord symbols in tonal as well as notation for
    * octave shifting (`^<chord>` or `v<chord>`)
    * different chord lengths (`2x<chord>`, `4x<chord>` etc. to lengthen; `<chord1>,<chord2>` to fit more chords into a measure)
    * slash chords (`<chord>/<root>`)
* **Now playing**: shows which chord is being played
* **Mixer**: changes the volume of each instrument
* **Warnings**: if there is something wrong with the chord progression (if so, check the "Allowed chord names" widget)
* **Mode explorer**: inspired by Native Construct's video [How to make interesting Chord Progressions with Modal Interchange](https://www.youtube.com/watch?v=1dRA28cdt5c). Shows a table with the chords from all of the parallel modes.
* **Piano**: shows the notes in the chord that is being played as it would show up in the piano. Can be played either by clicking on the keys or by playing on the keyboard.
* **Guitar tuner**: a guitar tuner

