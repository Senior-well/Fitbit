const accessToken = localStorage.getItem("fitbit_access_token");

async function getYesterdaySteps() {
    if (!accessToken) {
        document.getElementById("steps").textContent = "Login required";
        return;
    }

    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];

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

getYesterdaySteps();
