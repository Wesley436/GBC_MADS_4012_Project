const name = document.getElementById('name');
const registry_number = document.getElementById('registry_number');
const submit = document.getElementById('submit');

/** 
 *  When the name input is updated, update the submit button to be disabled or not depending on whether the name is empty or not
 */
function setSubmitButtonDisabled(event) {
    submit.disabled = name.value.length === 0;
}

name.addEventListener("change", setSubmitButtonDisabled);

setSubmitButtonDisabled(null);