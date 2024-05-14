async function resetPassword(e) {
    try {
        e.preventDefault();
        const password = e.target.querySelector('#password').value;
        console.log(password);
        const email = e.target.querySelector('#email').value;
        const newPasswordDetails = {
            email: email,
            password: password
        }
        const response = await axios.post('http://localhost:3000/password/resetpassword', newPasswordDetails, {
        validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept only status codes between 200 and 499
        }
    });
        console.log(response.status);
        if (response.status === 200) {
            console.log("Password Updated");
            const htmlContent = `
                <html>
                <head>
                    <title>Password Updated</title>
                </head>
                <body>
                    <h1>Password Updated Successfully!</h1>
                    <p>Your password has been updated.</p>
                    
                </body>
                </html>
            `;
            // Create a new page and display the HTML content
            const newWindow = window.open();
            newWindow.document.open();
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else if (response.status === 401) {
            console.log("Reset Password link expired");
            // Handle 401 status code here
            const htmlContent = `
                <html>
                <head>
                    <title>Error</title>
                </head>
                <body>
                    <h1>Reset Password link expired</h1>
                    <p>Please request reset link again</p>
                    
                </body>
                </html>
            `;
            const newWindow = window.open();
            newWindow.document.open();
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else {
            console.error("Unexpected status code:", response.status);
        }
    } catch (error) {
        console.error("Error updating password:", error);
    }
}
