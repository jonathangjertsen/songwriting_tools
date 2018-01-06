const rack = {
    pad: {
        harmonicity: elem('pad-harmonicity'),
        type: elem('pad-osc-type')
    },
    bass: {

    },
    guitar: {

    },
    arp: {

    }
};

for (synth in rack) {
    for (param in rack[synth]) {
        rack[synth][param].addEventListener('change', event => {
            let params = {};
            params[param] = event.target.value;
            synths[synth].set(params);
        });
    }
}
