import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Home from './Home';

const App = () => {

   const [loggedIn, setLoggedIn] = useState(false);
   const verifyAuth = async () => {
	try {
		const token = localStorage.getItem('token');
		const response = await axios.post('/api/verify', {}, {headers: {
			'Authorization': token
		  }});
		setLoggedIn(response.status == 200);
	} catch(e) {
		setLoggedIn(false);
	}
   }
   useEffect(() => {
	verifyAuth();
  

   },[])

  return (
	<Router>
		<Route path="/">
			<Redirect to={loggedIn ? "/home" : "/login"} />
		</Route>
		<Route path="/home" component={Home} />
		<Route  path="/login" component={Login} />
	</Router>
  );
};

export default App;