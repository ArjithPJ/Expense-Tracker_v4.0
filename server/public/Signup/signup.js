async function signup(e) {
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(signupDetails)
        const response =await axios.post('http://3.80.139.21:3000/signup', signupDetails)
        if(response.status ===201){
            window.location.href = "../Login/login.html";
        }
        else{
            throw new Error('Failed to signup');
        }
    }
    catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err} <div>`;
    };
};