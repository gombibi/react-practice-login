import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth_context';
import Input from '../UI/Input/Input';

//useReducer 사용하기
//[1] 리듀서 함수 만들기
//리듀서 함수는 컴포넌트 함수 밖에도 위치할 수 있음
//이유는 리듀서 함수 내부에서는 컴포넌트 함수 내부에서 만들어진 어떤 데이터도 필요하지 않기 때문
//파라미터: 1. 최신 state 스냅샷, 2. 디스패치된 액션
//반환값: 새로운 state
const emailReducer = (state, action) => {
	if (action.type === 'USER_INPUT') {
		return { value: action.value, isValid: action.value.includes('@') };
	}
	if (action.type === 'INPUT_BLUR') {
		return { value: state.value, isValid: state.value.includes('@') };
	}
	return { value: '', isValid: false };
};
const passwordReducer = (state, action) => {
	if (action.type === 'USER_INPUT') {
		return { value: action.value, isValid: action.value.trim().length > 6 };
	}
	if (action.type === 'INPUT_BLUR') {
		return { value: state.value, isValid: state.value.trim().length > 6 };
	}
	return { value: '', isValid: false };
};

const Login = (props) => {
	// const [enteredEmail, setEnteredEmail] = useState('');
	// const [emailIsValid, setEmailIsValid] = useState();
	// const [enteredPassword, setEnteredPassword] = useState('');
	// const [passwordIsValid, setPasswordIsValid] = useState();
	const [formIsValid, setFormIsValid] = useState(false);

	//[2] useReducer 호출
	//useReducer 파라미터: 1. 리듀서함수, 2. 초기값
	const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: false });
	const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: false });

	const authCtx = useContext(AuthContext);

	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	//의존성 배열 추가하기 : 모든 상태 변수와 함수를 포함(컴포넌트 함수 내 정의된 변수나 상태, props, 함수!)
	//함수의 포인터를 추가하면 함수 그 자체를 의존성으로 추가하는 것
	//몇가지 예외사항 : 아래 내용들은 추가할 필요X
	//1) 상태 업데이트 기능 : 리액트는 해당 함수가 절대 변경되지 않도록 보장함(ex)setFormIsValid)
	//2) 내장 API 혹은 함수 : 브라우저 API, 전역 기능은 리액트 컴포넌트 렌더링 주기와 관련이 없고, 변경되지 않음 (ex) fetch(), localStorage)
	//3) 컴포넌트 외부에 정의된 변수나 함수 : 컴포넌트 함수 내부에서 생성되지 않았으므로 변경해도 컴포넌트에 영향X -> 컴포넌트 재평가X
	const { isValid: emailIsValid } = emailState; //Object Distructuring; :를 통해 alias 줄 수 있음
	const { isValid: passwordIsValid } = passwordState;
	useEffect(() => {
		//디바운싱 -> setTimeout으로 키가 입력될때마다 실행되는 것을 방지
		const identifier = setTimeout(() => {
			console.log(1111, 'EFFECT RUNNING');
			setFormIsValid(emailIsValid && passwordIsValid);
		}, 500);

		//clean-up function
		//익명의 arrow function 반환
		//컴포넌트가 DOM에서 unmount할 때마다 실행 ---> 모든 새로운 사이드 이펙트 함수가 실행되기 전에 && 컴포넌트가 제거되기 전에 실행
		//첫번째 사이드이펙트 함수가 실행되기 전에는 실행되지 않음
		return () => {
			//키가 입력될때마다 실행
			console.log(2222, 'EFFECT CLEANUP');
			clearTimeout(identifier);
		};
		//useEffect는 다른 state를 기준으로 state를 업데이트하는 괜찮은 방법 -> state 업데이트 시 반드시 실행되는 것이 보장됨
		// }, [emailState, passwordState]);		//[최적화] 값(value)만 변경되도 useEffect가 실행되므로 전체 객체 대신 특정 속성을 의존성으로 추가
		// }, [emailState.isValid, passwordState.emailState]); //작동은 하지만, 이런 코드사용은 피해야 함! useEffect가 객체가 변경될때마다 재실행되기 때문!(단일 속성이 아님)
		//isValid를 비구조화할당으로 꺼내서 의존성에 추가함 -> useEffect가 불필요하게 실행되는 것 방지
	}, [emailIsValid, passwordIsValid]);

	const emailChangeHandler = (event) => {
		// setEnteredEmail(event.target.value);

		dispatchEmail({ type: 'USER_INPUT', value: event.target.value });

		// 중복 코드가 발생하므로 (passwordChangeHandler) useEffect를 사용하는 것이 좋음
		// 만약, useEffect를 사용하고 싶지 않다면?
		// 아래의 코드는 리액트가 state 업데이트를 스케줄링하는 방식때문에, enteredPassword가 항상 최신의 state임을 보장할 수 없음
		// 이미 함수 폼 사용 규칙을 위반하고 있음(state 업데이트가 이전 state에 의존하는 경우에 사용한다)
		// 업데이트 전에 함수가 실행될 수 있으므로, 함수 폼을 사용하는 것을 권장함 -----------> useReducer 사용!
		// setFormIsValid(event.target.value.includes('@') && enteredPassword.trim().length > 6);
		//useReducer 사용! ---> emailState.isValid
		// setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
	};

	const passwordChangeHandler = (event) => {
		// setEnteredPassword(event.target.value);

		//[4] dispatch 호출
		dispatchPassword({ type: 'USER_INPUT', value: event.target.value });

		// setFormIsValid(enteredEmail.includes('@') && event.target.value.trim().length > 6);
		//useReducer 사용! ---> emailState.value
		//[3] 상태 업데이트
		// setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
	};

	const validateEmailHandler = () => {
		// setEmailIsValid(enteredEmail.includes('@'));
		//useReducer 사용! ---> emailState.value
		// setEmailIsValid(emailState.isValid);
		dispatchEmail({ type: 'INPUT_BLUR' });
	};

	const validatePasswordHandler = () => {
		// setPasswordIsValid(enteredPassword.trim().length > 6);
		//[4] dispatch 호출
		dispatchPassword({ type: 'INPUT_BLUR' });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			authCtx.onLogin(emailState.value, passwordState.value);
		} else if (!emailIsValid) {
			emailInputRef.current.focus();
		} else {
			passwordInputRef.current.focus();
		}
	};

	//props vs useContext
	//구성을 하려면 props!
	//컴포넌트 또는 전체 앱에서 state 관리를 하려면 context!
	//그러나, 너무 자주 바뀐다면 사용을 권장하지 않음 ---> 리덕스가 대체!
	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				{/* [5] value에 state값으로 변경 */}
				<Input ref={emailInputRef} type='email' id='email' label='E-Mail' isValid={emailIsValid} value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} />
				<Input ref={passwordInputRef} type='password' id='password' label='Password' isValid={passwordIsValid} value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} />
				{/* <div className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}>
					<label htmlFor='email'>E-Mail</label>
					<input type='email' id='email' value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} />
				</div>
				<div className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''}`}>
					<label htmlFor='password'>Password</label>
					<input type='password' id='password' value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} />
				</div> */}
				<div className={classes.actions}>
					<Button type='submit' className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
