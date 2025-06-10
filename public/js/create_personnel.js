const name = document.getElementById('name');
const rank = document.getElementById('rank');
const skill = document.getElementById('skill');
const add_skill = document.getElementById('add_list_item');
const clear_skill = document.getElementById('clear_list_item');
const skills_adding = document.getElementById('list_items_adding');
const submit = document.getElementById('submit');
const personnel_form = document.getElementById('personnel_form');

const skills = [];

/** 
 *  When the name input is updated, update the submit button to be disabled or not depending on whether the name is empty or not
 */
function setSubmitButtonDisabled(event) {
    submit.disabled = name.value.length === 0;
}

/** 
 *  Add the text in the skill input to the skills list (to be submitted), then updates the displayed skills to add list
 */
function addSkill() {
    if (skill.value.length > 0) {
        skills.push(skill.value);
        skill.value = ``;
    }

    skills_adding.innerText = skills;
}

/** 
 *  Clears skills list
 */
function clearSkill() {
    skills.splice(0, skills.length);
    skills_adding.innerText = '';
}

name.addEventListener("change", setSubmitButtonDisabled);
add_skill.addEventListener(`click`, addSkill);
clear_skill.addEventListener(`click`, clearSkill);
personnel_form.addEventListener('formdata', (e) => {
    const formData = e.formData;
    formData.delete("skill");
    formData.set("skills", skills);
});

setSubmitButtonDisabled(null);

if (skills_adding.innerText.length > 0) {
    const prefill_skills = skills_adding.innerText.split(',');
    prefill_skills.forEach(o => skills.push(o));
}