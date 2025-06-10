const destination_planet = document.getElementById('destination_planet');
const mission_purpose = document.getElementById('mission_purpose');
const submit = document.getElementById('submit');

/** 
 *  When the destination_planet or mission_purpose input is updated, update the submit button to be disabled or not depending on whether any of the fields are empty or not
 */
function setSubmitButtonDisabled(event) {
    submit.disabled = destination_planet.value.length === 0 || mission_purpose.value.length === 0;
}

destination_planet.addEventListener("change", setSubmitButtonDisabled);
mission_purpose.addEventListener("change", setSubmitButtonDisabled);

setSubmitButtonDisabled(null);