const accessToken = localStorage.getItem("fitbit_access_token");

async function getDateSteps() {
    if (!accessToken) {
        document.getElementById("steps").textContent = "Login required";
        return;
    }

    // Get date in YYYY-MM-DD format
    const date = new Date();
    date.setDate(date.getDate()); // Adjust this to get the date you want
    const formattedDate = date.toISOString().split("T")[0];

    try {
        const response = await fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${formattedDate}/1d.json`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        const steps = data["activities-steps"][0]["value"];
        document.getElementById("steps").textContent = steps;
    } catch (error) {
        console.error("Error fetching steps:", error);
        document.getElementById("steps").textContent = "Error fetching data";
    }
}

getDateSteps();
