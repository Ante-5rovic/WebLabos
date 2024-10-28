async function submitForm() {
  const form = document.getElementById("addticket-form");
  const formData = new FormData(form);

  const data = Object.fromEntries(formData.entries());
  console.log(data);

  var token = null;
  try {
    const response = await fetch("/getToken");
    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    token = data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
  }

  await fetch("/kupnja-ulaznice", {
    method: "post",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlVDb1haQnNfczJwdXVlb1NWUWluQiJ9.eyJpc3MiOiJodHRwczovL2Rldi10b3IwN3RmZTU3dHJscDJsLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJoWThLczU1aUdBOExyRlBWWmZVelN1VHN2S0tjbktJdEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtdG9yMDd0ZmU1N3RybHAybC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTczMDA4MDk0OSwiZXhwIjoxNzMwMTY3MzQ5LCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJoWThLczU1aUdBOExyRlBWWmZVelN1VHN2S0tjbktJdCJ9.dLlwsPM1wmwn4iTRNSEEu0j5bqyCAbjcW2hKo1GTx9nMMnwTNWs41WlRPVTRjMe147mw_ZZuJYfpccYFCeVg2QfKpmeiGtyUKI22L1wa5HOKHGSEjh8JnaCWjTgAIyd8EXueU8RDFCU6n2tPEe6_bpqpkHUF_2ooiy-FQ_wFcvwSgZTPlDKsV2nx9WYMTuRbfFgIdwAJuRcnYdojXyuzPffHRaEi-GmwfeZAc-W4RN2LKAmWgFfhQAr2U2uxd1qfhDM2IcuhLUln3m8yoI67L35OYOCaW-5b89rTcW8unedpu984Z9vqQoMdJsQKLq8uBTYHqBMA0R2R-WGbAqgKuw",
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    
}
