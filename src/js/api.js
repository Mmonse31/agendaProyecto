function APICheckHealth(url) {
    fetch(`${url}/health`).then(res => {
        console.log(res);
    })
}

function APILogin() {
    let data = {
        username: "admin",
        password: "password"
    };
    fetch(`https://api.ekiim.xyz/login`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    }).then(res => {
        console.log(res);
        return res.json()
    }).then(console.log)
}
