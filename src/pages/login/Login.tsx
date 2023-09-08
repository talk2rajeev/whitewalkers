import * as React from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Input } from 'antd';
import './login.css';

export interface ILoginProps {
}

export function Login (props: ILoginProps) {
  let navigate = useNavigate();
  const [username, setUsername] = React.useState<string>('wpl-admin');
  const [password, setPassword] = React.useState<string>('wpl@123$*');
  const [security, setSecurity] = React.useState<string>('2023@wpl');
  
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if(name === 'username') {
        setUsername(value);
    } else if(name === 'password') {
        setPassword(value);
    } else if (name === 'security') {
        setSecurity(value);
    } 
  }

  const authenticate = () => {
    if(!username || !password || !security) {
        alert('Please enter Login detail');
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "username": username,
      "password": password,
      "security": security
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };
    fetch("https://wtcfinal.online/api/auth.php", requestOptions)
    .then(response => response.text())
    .then(result => {
        if(result === 'true'){
          sessionStorage.setItem('login', 'true');
          console.log(result);
          return navigate("/admin");
        } else {
          alert('Login Failed !!!');
        }
    })
    .catch(error => console.log('error', error));
  }  

  return (
    <div>
      <div className='login-box'>
        <h3 style={{textAlign: 'center'}}>ADMIN LOGIN</h3>
        <Input placeholder="Username" name='username' onChange={onInputChange} defaultValue={username} value={username} />
        <Input type='password' name='password' placeholder="Password" onChange={onInputChange} defaultValue={password} value={password} />
        <Input type='password' name='security' placeholder='Security code' onChange={onInputChange} defaultValue={security} value={security} />
        <Button type="primary" onClick={authenticate} block>Login</Button>
      </div>
    </div>
  );
}
