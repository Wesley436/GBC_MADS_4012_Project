const name = document.getElementById('name');
const registry_number = document.getElementById('registry_number');
const submit = document.getElementById('submit');

/** 
 *  When the name or registry_number input is updated, update the submit button to be disabled or not depending on whether any of the fields are empty or not
 */
function setSubmitButtonDisabled(event) {
    submit.disabled = name.value.length === 0 || registry_number.value.length === 0;
}

name.addEventListener("change", setSubmitButtonDisabled);
registry_number.addEventListener("change", setSubmitButtonDisabled);

setSubmitButtonDisabled(null);