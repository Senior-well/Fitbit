const accessToken = localStorage.getItem("fitbit_access_token");

if (!accessToken) {
    alert("Please log in to Fitbit first.");
}

// Get date in YYYY-MM-DD format
const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

// Function to fetch Steps data
async function getDateSteps() {
    if (!accessToken) {
        document.getElementById("steps").textContent = "Login required";
        return;
    }

    try {
        const response = await fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${formattedDate}/1d.json`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data["activities-steps"] && data["activities-steps"].length > 0) {
            const steps = data["activities-steps"][0]["value"];
            document.getElementById("steps").textContent = steps;
        } else {
            document.getElementById("steps").textContent = "No step data available";
        }
    } catch (error) {
        console.error("Error fetching steps:", error);
        document.getElementById("steps").textContent = "Error fetching data";
    }
}

// Function to fetch real-time Heart Rate data
async function getHeartRate() {
    if (!accessToken) {
        document.getElementById('heartRate').textContent = 'Login required';
        return;
    }

    try {
        const response = await fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("Fitbit API Response:", data); // Print the full API response to debug

        if (data["activities-heart-intraday"] && data["activities-heart-intraday"]["dataset"].length > 0) {
            const heartRateData = data["activities-heart-intraday"]["dataset"];
            const latestHeartRate = heartRateData[heartRateData.length - 1].value;
            document.getElementById("heartRate").textContent = `${latestHeartRate} bpm`;
        } else {
            document.getElementById("heartRate").textContent = "No real-time data available. Check API access.";
        }
    } catch (error) {
        console.error("Error fetching heart rate:", error);
        document.getElementById("heartRate").textContent = "Error fetching data";
    }
}

// Function to fetch both Steps and Heart Rate data
async function fetchFitbitData() {
    if (!accessToken) {
        document.getElementById("steps").textContent = "Login required";
        document.getElementById("heartRate").textContent = "Login required";
        return;
    }

    await Promise.all([getDateSteps(), getHeartRate()]); // Fetch steps & heart rate in parallel
}

// Fetch both Steps & Heart Rate on page load
fetchFitbitData();

// Refresh heart rate every 60 seconds for near real-time updates
setInterval(getHeartRate, 60000);
