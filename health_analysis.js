const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById("btnSearch");
const patients = [];

function addPatient() {
  const name = document.getElementById("name").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = document.getElementById("age").value;
  const condition = document.getElementById("condition").value;

  if (name && gender && age && condition) {
    patients.push({ name, gender: gender, age, condition });

    resetForm();
    generateReport();
  }
}

function resetForm() {
  const name = (document.getElementById("name").value = "");
  const gender = (document.querySelector('input[name="gender"]:checked').value =
    false);
  const age = (document.getElementById("age").value = "");
  const condition = (document.getElementById("condition").value = "");
}

function generateReport() {
  const patientCount = patients.length;

  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };
  const genderConditionCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };

  for (patient of patients) {
    conditionsCount[patient.condition]++;
    genderConditionCount[patient.gender][patient.condition]++;
  }

  report.innerHTML = `Number of Patients: ${patientCount}<br>`;
  report.innerHTML += `Condition Break Down:<br>`;
  for (condition in conditionsCount) {
    report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
  }

  report.innerHTML += `Gender Break Down:<br>`;
  for (gender in genderConditionCount) {
    report.innerHTML += `${gender}:<br>`;
    for (const condition in genderConditionCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionCount[gender][condition]}<br>`;
    }
  }
}

addPatientButton.addEventListener("click", addPatient);

function searchCondition() {
  const input = document.getElementById("conditionInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  fetch("health_analysis.json")
    .then((response) => response.json())
    .then((data) => {
      const conditions = data.conditions.find(
        (item) => item.name.toLowerCase() === input,
      );

      if (conditions) {
        const symptoms = conditions.symptoms.join(", ");
        const prevention = conditions.symptoms.join(", ");
        const treatment = conditions.treatment;

        resultDiv.innerHTML += `<h2>${conditions.name}</h2>`;
        resultDiv.innerHTML += `<img src="assets/${conditions.imagesrc}" alt="Image"/>`;

        resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
        resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
        resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
      } else {
        resultDiv.innerHTML = `<p>No information found for the condition: ${input}</p>`;
      }
    })
    .catch((error) => {
      console.error("Error", error);
      resultDiv.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    });
}

btnSearch.addEventListener("click", searchCondition);
