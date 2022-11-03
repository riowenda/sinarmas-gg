import {
	IonContent,
	IonIcon,
	IonPage, IonRefresher, IonRefresherContent, useIonLoading,
	useIonToast
} from '@ionic/react';
import {logoGoogle} from 'ionicons/icons';
import React, { useEffect, useState, useCallback } from 'react';
import './Login.css';
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
	BASE_API_URL,
	API_URI,
	AUTH_URI,
	LOGIN_ISAFE_URI,
	LOGIN_GOOGLE_URI,
	LOGIN_URI,
	GOOGLE_AUTH_SERVER_CLIENT_WEB_ID,
	pref_remember_me,
	pref_username,
	pref_password,
	pref_identity,
	pref_user_id,
	pref_user_role,
	pref_user_nik,
	pref_user_name,
	pref_user_photo,
	pref_is_login,
	pref_token,
	pref_user_email,
	pref_json_pegawai_info_login,
	pref_is_google, pref_is_isafe, pref_pegawai_id, pref_unit, pref_unit_id, pref_pegawai_unit_id
} from '../constant/Index';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {RefresherEventDetail} from "@ionic/core";
import {clearPref, getPref, removePref, setJsonPref, setPref} from "../helper/preferences";
import {getName} from "ionicons/dist/types/components/icon/utils";

const Login: React.FC = () => {
	const history = useHistory();
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [remember, setRemember] = useState<boolean>(false);
	const [iserror, setIserror] = useState<boolean>(false);
	const [isIsafe, setIsIsafe] = useState<boolean>(true);
	const [message, setMessage] = useState<string>("");
	const [presentToast] = useIonToast();
	const [handlerMessage, setHandlerMessage] = useState('');
	const [roleMessage, setRoleMessage] = useState('');
	const [present, dismiss] = useIonLoading();
	function doRefresh(event: CustomEvent<RefresherEventDetail>) {
		console.log('Begin async operation');

		setTimeout(() => {
			console.log('Async operation has ended');
			event.detail.complete();
		}, 2000);
	}


	const handleLogin = () => {
		const loading = present({
			message: 'Memproses permintaan ...',
		})

		const loginData = {
			"username": username,
			"password": password
		}

		let config = {
			headers: {
				"Content-Type": "application/json"
			}
		}
		const loginApi = isIsafe ? `${LOGIN_ISAFE_URI}` : `${LOGIN_URI}`;
		// console.log(loginApi);

		/* contoh API */
		const api = axios.create({
			baseURL: `${BASE_API_URL}`+`${API_URI}`+`${AUTH_URI}`
		})
		api.post(loginApi, loginData, config)
			.then(res => {
				console.log(res)
				if(res.data !== null && res.data.status !== null && res.data.status !== 'FAILED'){
					//sukses arahkan ke dashboard
					// history.push("/dashboard");
					saveToPreference(res.data, isIsafe ? "isafe":"non");
				} else {
					dismiss();
					console.log(res.data.message);
					presentToast({
						message: "Login gagal. Terjadi Kesalahan!",
						duration: 1500,
						position: "top"
					})
				}
			})
			.catch(error => {
				dismiss();
				presentToast({
					message: "Login gagal. Terjadi Kesalahan! ["+error.message+"]",
					duration: 1500,
					position: "top"
				})
				// console.log(error)
				// setMessage("Auth failure! Please create an account");
				// setIserror(true)
			})
		// history.push("/dashboard/");

	};

	// declare the async data fetching function
	const loginGoogle = useCallback(async () => {
		
		const data = await GoogleAuth.signIn();
		// console.log(data);
		if(data != null && data.authentication != null){
			const loginData = {
				"username": data.email,
				"password": data.authentication.accessToken
			}
			const api = axios.create({
				baseURL: `${BASE_API_URL}`+`${API_URI}`+`${AUTH_URI}`
			})
			api.post(`${LOGIN_GOOGLE_URI}`, loginData)
				.then(res => {
					console.log(res);
					if(res.data !== null && res.data.status !== null && res.data.status !== 'FAILED'){
						saveToPreference(res.data, "google");
					} else {
						dismiss();
						presentToast({
							message: "Login gagal. Terjadi Kesalahan!",
							duration: 1500,
							position: "top"
						})
						console.log(res.data.message);
					}
				})
				.catch(error => {
					dismiss();
					console.log(error.message);
					// setMessage("Auth failure! Please create an account");
					// setIserror(true);
					// alert(error.message);
					presentToast({
						message: "Login gagal. Terjadi Kesalahan! ["+error.message+"]",
						duration: 1500,
						position: "top"
					})
				})
		}


		/* history.push("/dashboard/"); */
	}, [])

	const rememberMe = (e : any) => {
		// @ts-ignore
		setPref(pref_remember_me, e.toString()).then(r => r);
		setRemember(e);
		if(e){
			setPref(pref_username, username).then(r => r);
			setPref(pref_password, password).then(r => r);
		} else {
			removePref(pref_username).then(r => r);
			removePref(pref_password).then(r => r);
		}
	}

	const loadRememberMe = async () => {
		getPref(pref_remember_me).then(res => {
			setRemember(res === 'true');
			if(res === 'true'){
				getPref(pref_username).then(res => setUsername(res));
				getPref(pref_password).then(res => setPassword(res));
			}
		} );
	}

	const saveToPreference = (data : any, tipe : string) => {
		clearPref().then(r => {
			// clearPref().then(r=>r);
			setPref(pref_identity, data['id']).then(r => r);
			setPref(pref_user_id, data['id']).then(r => r);
			setPref(pref_user_role, data['roles'].toString()).then(r => r);
			setPref(pref_user_name, data['pegawai']['name']).then(r => r);
			setPref(pref_user_nik, data['pegawai']['nik']).then(r => r);
			setPref(pref_user_photo, data['pegawai']['foto']).then(r => r);
			setPref(pref_user_email, data['email']).then(r => r);
			setPref(pref_is_login, true).then(r => r);
			setPref(pref_token, data['accessToken']).then(r => r);
			setPref(pref_is_login, true).then(r => r);
			setPref(pref_pegawai_id, data['pegawai']['id']).then(r => r);
			let peg = {
				name: data['pegawai']['name'],
				email: data['email'],
				nik: data['pegawai']['nik'],
				imageUrl:data['pegawai']['foto'],
				identity: data['id'],
				userId: data['id'],
				role: data['roles']
			}
			setPref(pref_remember_me, remember).then(r => r);
			setPref(pref_json_pegawai_info_login, JSON.stringify(peg)).then(r => r);
			if(data['pegawaiUnit'] != null){
				setPref(pref_unit, JSON.stringify(data['pegawaiUnit']['unit'])).then(r => r);
				setPref(pref_unit_id, data['pegawaiUnit']['unit']['id']).then(r=>r);
				setPref(pref_pegawai_unit_id, data['pegawaiUnit']['id']).then(r=>r);
			} else {
				setPref(pref_unit, null);
			}
			if(remember){
				setPref(pref_username, username).then(r => r);
				setPref(pref_password, password).then(r => r);
			} else {
				removePref(pref_username).then(r => r);
				removePref(pref_password).then(r => r);
			}
			console.log("keep sync to preference");
			if(tipe === 'non' || tipe === 'isafe') {
				setPref(pref_is_google, false).then(r => r);
				setPref(pref_is_isafe, tipe === 'isafe' ? true : false).then(r => r);
			} else {
				setPref(pref_is_google, true).then(r => r);
				setPref(pref_is_isafe, false).then(r => r);
			}

			//sukses arahkan ke dashboard
			if(data['roles'] == "FUELMAN"){
				history.push("/dashboard2");
			} else {
				history.push("/dashboard");
			}
			
			dismiss();
		});
	}
	
	// the useEffect is only there to call `fetchData` at the right time
	useEffect(() => {
		getPref(pref_is_login).then(r => {
			if(r !== 'null' && r === 'true'){
				history.push("/dashboard");
			}else{
				loadRememberMe();
				GoogleAuth.initialize({
					clientId: `${GOOGLE_AUTH_SERVER_CLIENT_WEB_ID}`,
					scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
					grantOfflineAccess: true,
				});
			}
		});
	}, [])

	return (
		<IonPage>
			<IonContent>
			<IonRefresher slot="fixed" onIonRefresh={doRefresh}>
				<IonRefresherContent/>
			</IonRefresher>

		
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
			<div className="flex min-h-full flex-col justify-center py-12 sm:px-2 lg:px-4">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<img
						className="mx-auto h-12 w-auto"
						src="/assets/icon/logo.png?color=indigo&shade=600"
						alt="PT. Borneo Indobara"
					/>
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>

				</div>


				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md p-8 ">
					<div className="bg-white py-8 px-8 shadow sm:rounded-lg sm:px-10">
						<form className="space-y-6" action="#" method="POST">
							<div className="docs-demo-mode-toggle w-full">
								<button type="button" onClick={(event) => setIsIsafe(true)} className={isIsafe ? "is-button  is-selected" : "is-button"} title="Login dengan iSafe">iSafe</button>
								<button type="button" className={!isIsafe ? "is-button  is-selected" : "is-button"} onClick={(event) => setIsIsafe(false)} title="Login tanpa iSafe">Non iSafe</button>
							</div>
							<div>
								<label htmlFor="username" className="block text-sm font-medium text-gray-700">
									Username
								</label>
								<div className="mt-1">
									<input
										id="username"
										value={username}
										name="username"
										autoComplete="username"
										onChange={(event) => setUsername(event.target.value)}
										required
										className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<div className="mt-1">
									<input
										id="password"
										name="password"
										type="password"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										autoComplete="current-password"
										required
										// onChange={}
										className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										onChange={(event) => rememberMe(event.target.checked)}
										id="remember-me"
										name="remember-me"
										type="checkbox"
										checked={remember}
										className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									/>
									<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
										Remember me
									</label>
								</div>
							</div>

							<div className="text-center font-medium">
								<button type="button" className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={handleLogin}>
									Sign in
								</button>
								Or
								<button type="button" onClick={loginGoogle} className="flex w-full justify-center rounded-md border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2">
									<IonIcon icon={logoGoogle} className="py-1 px-1" /> Sign in with Google
								</button>
							</div>

						</form>
					</div>
				</div>
			</div>
			</IonContent>
		</IonPage>
	);
};

export default Login;
