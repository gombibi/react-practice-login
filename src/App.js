import React, { useContext } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import AuthContext from './store/auth_context';

function App() {
	const ctx = useContext(AuthContext);

	return (
		//prop vs context
		//prop : 데이터를 전달할 때! 컴포넌트를 구성하고 그것들을 재사용할 수 있도록 하는 매커니즘
		//context : 많은 컴포넌트를 통해 전달하고자 하는 것이 있을 때! (ex) Navigation.js - ctx.onLogout )
		<React.Fragment>
			<MainHeader />
			<main>
				{!ctx.isLoggedIn && <Login />}
				{ctx.isLoggedIn && <Home />}
			</main>
		</React.Fragment>
	);
}

export default App;
