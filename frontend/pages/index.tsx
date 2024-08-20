import React, {useEffect, useState} from "react";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function index() {
  const [userAgent, setUserAgent] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const Loading = () => (
    <div>
        <h1>Loading...</h1>
    </div>
  );

  useEffect(() => {
    const userAgent = navigator.userAgent;
    fetch('http://127.0.0.1:8080/api/userAgent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAgent
      }),
    })
    .then((response) => response.json())
    .then(async (data) => {
      setUserAgent(data.userAgent);
      await sleep(2000);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching user agent:', error);
      setLoading(false);
    });

  }, []);
 
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/home")
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);
    });
  }, []);

/*
  useEffect(() => {
    var ipData = "hello";
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        ipData = JSON.stringify(data.ip);
        //setIpAddress(ipData);
      });
    setIpAddress(ipData);
    fetch('http://127.0.0.1:8080/api/ipAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: "",
    })
    .then((response) => response.json())
    .then((data) => {
      setIpAddress(data.ip_address);
    });
  }, []);
*/
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://127.0.0.1:8080/api/echo", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
      setMessage(`Username: ${data.username}\nPassword: ${data.password}`);
      setUsername('');
      setPassword('');
    });
  }

  if (loading) {
    return <Loading />
  }

  if (userAgent.includes('Googlebot')) {
    //cloaked page
    return (
      <div>
        <h1>Cloaked</h1>
    </div>
    );
  } else {
    //login page
    return (
      <div className="App">
      <header className="App-header">
        <h1>Sign in</h1>
      </header>
      <div className="General">
        <div className="Inputpanel">
          <form onSubmit={handleSubmit} className="Text">
            <div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="App-input"/>
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="App-input" />
            </div>
            <div>  
              <button type="submit" disabled={!username || !password}>Sign In</button>
            </div>
          </form>
        </div>
        <div className="Outputpanel">
          <p className="Text">{message}</p>
        </div>
      </div>
    </div>
  );
  }
}

export default index;



