import React, { useEffect, useState } from 'react';

//기본값이 있으면 provider는 필요 없음 -> 충돌
//그러나 실제로는 변할 수 있는 값을 가지기 위해서 컨텍스트를 사용할 것 -> provider로만 가능
//충돌이 일어나지 않게 하려면 provider 세팅 필요(App.js)
const AuthContext = React.createContext({
	isLoggedIn: false,
	onLogout: () => {},
	onLogin: (email, password) => {},
});

export const AuthContextProvider = (props) => {
	//useState는 값이 변경될때마다 리랜더링됨 -> 무한루프에 걸릴 수 있음
	//이런 경우, 언제 실행될지 제어할 수 있는 useEffect를 사용해야 함.
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	//useEffect(param 1.함수, 2.의존성 배열)
	//사이드 이펙트(http 리퀘스트, 키 입력으로 입력된 데이터 저장 + 그에 대한 응답으로 다른 액션 실행(ex)입력데이터 validate)) 처리하기 위해 존재.
	//모든 컴포넌트 재평가 후에 실행 -> 의존성이 변경되면 다시 재실행
	//2번째 파라미터(의존성 배열)가 빈배열일 경우, 의존성이 없으므로 절대 변경되지 않음 -> 앱이 시작될 때 한번만 실행됨
	//---> 새로고침해도 로그인된 상태 유지
	useEffect(() => {
		const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');
		if (storedUserLoggedInInformation === '1') {
			setIsLoggedIn(true); //state가 변경 ---> 컴포넌트 함수가 재실행되도록 트리거됨
		}
	}, []);

	const loginHandler = () => {
		localStorage.setItem('isLoggedIn', '1');
		setIsLoggedIn(true);
	};

	const logoutHandler = () => {
		localStorage.removeItem('isLoggedIn');
		setIsLoggedIn(false);
	};

	//충돌을 막기 위해 value prop 추가
	//state나 앱 컴포넌트를 통해 값 변경 가능
	//변경될 때마다 새로운 값이 이 컨텍스트를 소비하는 모든 consumer 컴포넌트에 전달됨
	return <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler }}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
