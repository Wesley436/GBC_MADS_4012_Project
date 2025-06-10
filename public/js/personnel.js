function selectShip(personnel_id, event) {
    const assignment_form = document.getElementById("assignment-form" + personnel_id);
    assignment_form.addEventListener('formdata', (e) => {
        const formData = e.formData;
        formData.set("personnel_id", personnel_id);

        const ship_id = event.target.value;
        if (ship_id.length > 0) {
            formData.set("ship_id", ship_id);
        }
    });
    assignment_form.submit();
}