function elem(id, is_param) {
    const element = document.getElementById(id);

    if (is_param) {
        const prev_value = localStorage.getItem(id);
        if (prev_value === null) {
            localStorage.setItem(id, element.value);
        } else {
            element.value = prev_value;
            if(isCheckboxValue(prev_value)) {
                element.checked = valueToChecked(prev_value);
                element.addEventListener('change', event => localStorage.setItem(id, checkedToValue(element.checked)));
            } else {
                element.addEventListener('change', event => localStorage.setItem(id, event.target.value));
            }
        }
    }

    return element;
}

function isCheckboxValue(value) {
    return value === "on" || value === "off";
}

function checkedToValue(checked) {
    return checked ? "on" : "off";
}

function valueToChecked(value) {
    return value === "on";
}

function showWidgetIffChecked(checkbox) {
    elem(checkbox.id.split("show-")[1], false).style.display = checkbox.checked ? "block" : "none";
}

document.querySelectorAll('.show-widget').forEach(checkbox => {
    elem(checkbox.id, true).addEventListener('change', event => {
        showWidgetIffChecked(checkbox);
    });
    showWidgetIffChecked(checkbox);
});
