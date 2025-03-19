async function loginUser(event) {
    event.preventDefault(); // Prevent form submission reload

    // Get input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if fields are empty
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/login", { // Adjust API URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (data.success) {
            alert("Login successful!");
            window.location.href = "home.html"; // Redirect on success
        } else {
            alert(data.message); // Show error message
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred. Please try again.");
    }
}
