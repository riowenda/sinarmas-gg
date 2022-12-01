import {
	IonContent,
	IonPage, IonRefresher, IonRefresherContent, useIonLoading,
	useIonToast, useIonViewDidEnter, useIonViewWillEnter
} from '@ionic/react';
import React, { useState, useCallback, useRef } from 'react';
import './Login.css';
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
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
	pref_is_google,
	pref_is_isafe,
	pref_pegawai_id,
	pref_unit,
	pref_unit_id,
	pref_pegawai_unit_id,
	FB_NOTIF_URI,
	pref_token_fbnotif,
	FB_NOTIF_REG,
	pref_lng,
	pref_user_auth,
	pref_fuel_station_id,
	pref_fuel_station,
	FB_NOTIF_TOPIC_PUBLIC, pref_json_token_identity, AUTH_FUEL_STATION, AUTH_FUEL_MANAGER
} from '../constant/Index';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { RefresherEventDetail } from "@ionic/core";
import {
	clearPref,
	getPref,
	removePref, setIdentityPref,
	setJsonPref,
	setJsonTokenIdentityPref,
	setPref,
	setPrefLng, setTokenPref, simpanDataPegawai, simpanDataPegawaiUnit
} from "../helper/Preferences";
import ActionSheet from 'actionsheet-react';
import {useTranslation} from "react-i18next";
import {getPermPref} from "../helper/PermanentPreferences";
import {BaseAPI} from "../api/ApiManager";
import {RegisterNotifications} from "../api/FirebaseUtils";

const Login: React.FC = () => {
	const history = useHistory();
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>("");
	const [remember, setRemember] = useState<boolean>(false);
	const [isIsafe, setIsIsafe] = useState<boolean>(true);
	const [presentToast] = useIonToast();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [present, dismiss] = useIonLoading();
	const [lng, setLng] = useState("id");
	const { t, i18n } = useTranslation();

	const ref = useRef();

	const onClickLanguageChange = (e: any) => {
		const language = e;
		i18n.changeLanguage(language); //change the language
		setPref(pref_lng, language);
		setPrefLng(language);
		setLng(language);
		// @ts-ignore
		ref.current.close();
	}

	function doRefresh(event: CustomEvent<RefresherEventDetail>) {
		console.log('Begin async operation');

		setTimeout(() => {
			console.log('Async operation has ended');
			event.detail.complete();
		}, 2000);
	}

	const apiFB = axios.create({
		baseURL: `${BaseAPI()}` + `${API_URI}` + `${FB_NOTIF_URI}`
	});

	const handleLogin = () => {
		const loading = present({
			message: 'Memproses permintaan ...',
			backdropDismiss: false
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
			baseURL: `${BaseAPI()}` + `${API_URI}` + `${AUTH_URI}`
		})
		api.post(loginApi, loginData, config)
			.then(res => {
				console.log("Status Login: ", res.data.status);
				console.log("berhasil Login tanpa google: ", res);
				// @ts-ignore
				if (res.data !== null && res.data.status !== null && res.data.status !== 'FAILED') {
					//sukses arahkan ke dashboard
					console.log("Preference: ", res.data)
					processLogin(res.data.data, isIsafe ? "isafe" : "non");
				} else {
					dismiss();
					// @ts-ignore
					console.log(res['message']);
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
					message: "Login gagal. Terjadi Kesalahan! [" + error.message + "]",
					duration: 1500,
					position: "top"
				})
			})

	};

	// declare the async data fetching function
	const loginGoogle = useCallback(async () => {

		const data = await GoogleAuth.signIn();
		console.log("hasil login google: ",data);
		if (data != null && data.authentication != null) {
			const loginData = {
				"username": data.email,
				"password": data.authentication.accessToken,
				"imageUrl": data.imageUrl != null && data.imageUrl != "" ? data.imageUrl.toString() : "",
			}
			const api = axios.create({
				baseURL: `${BaseAPI()}` + `${API_URI}` + `${AUTH_URI}`
			})
			api.post(`${LOGIN_GOOGLE_URI}`, loginData)
				.then(res => {
					console.log("berhasil login: ", res);
					if (res.data !== null && res.data.status !== null && res.data.status !== 'FAILED') {
						//saveToPreference(res.data, "google");
						processLogin(res.data.data, "google");
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
						message: "Login gagal. Terjadi Kesalahan! [" + error.message + "]",
						duration: 1500,
						position: "top"
					})
				})
		}
	}, [])

	const rememberMe = (e: any) => {
		// @ts-ignore
		setPref(pref_remember_me, e.toString()).then(r => r);
		setRemember(e);
		if (e) {
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
			if (res === 'true') {
				getPref(pref_username).then(res => setUsername(res));
				getPref(pref_password).then(res => setPassword(res));
			}
		});
	}

	const token = (data: any, t: string) => {
		let regData = {
			"pegawai_id": data.id,
			"token": t
		}
		let apiFB = axios.create({
			baseURL: `${BaseAPI()}` + `${API_URI}` + `${FB_NOTIF_URI}`
		})
		apiFB.post(`${FB_NOTIF_REG}`, regData).then(f =>{
			//alert('registerok:'+ JSON.stringify(f));
		})
	}

	const processLogin = (data: any, tipe: string) => {
		clearPref().then(r=> {
			getPermPref(pref_token_fbnotif).then(t => {
				if(t != null){
					token(data, t.toString());
				} else {
					let tk = window.localStorage.getItem(pref_token_fbnotif);
					if(tk != null){
						token(data, tk.toString());
					}
				}
				console.log("########################### token fb "+t);
			});
			let lng = window.localStorage.getItem(pref_lng);
			console.log("LOGIN : lng dari window localStorage "+lng);
			if(lng != null) {
				setPref(pref_lng, lng).then(r => r);
			}

			/*setPref(pref_token, data['accessToken']).then(r => r);*/

			setPref(pref_token, data.token).then(r => r);
			setTokenPref(data.token);
			setPref(pref_identity, data.id).then(r => r);
			setIdentityPref(data.id);

			let jsonTokenIdentity = {token: data.token, identity: data.id};

			setJsonTokenIdentityPref(jsonTokenIdentity).then(r => r);

			// console.log("token: ", data.token);
			setPref(pref_is_login, true).then(r => r);
			setPref(pref_user_auth, data.authorities).then(r => r);

			simpanDataPegawai(data, data.pegawai);

			simpanDataPegawaiUnit(data.pegawaiUnit);

			//fuel station
			if (data.pegawai.fuelStation != null) {
				setPref(pref_fuel_station_id, data.pegawai.fuelStation.id).then(r => r);
				setPref(pref_fuel_station, JSON.stringify(data.pegawai.fuelStation)).then(r => r);
			} else {
				setPref(pref_fuel_station, null).then(r => r);
				setPref(pref_fuel_station_id, null).then(r => r);
			}

			setPref(pref_remember_me, remember).then(r => r);

			if (remember) {
				setPref(pref_username, username).then(r => r);
				setPref(pref_password, password).then(r => r);
			} else {
				removePref(pref_username).then(r => r);
				removePref(pref_password).then(r => r);
			}
			// console.log("keep sync to preference");
			if (tipe === 'non' || tipe === 'isafe') {
				setPref(pref_is_google, false).then(r => r);
				setPref(pref_is_isafe, tipe === 'isafe' ? true : false).then(r => r);
			} else {
				setPref(pref_is_google, true).then(r => r);
				setPref(pref_is_isafe, false).then(r => r);
			}

			let auth = data.authorities;
			if((auth.toString()).includes(AUTH_FUEL_STATION) || (auth.toString()).includes(AUTH_FUEL_MANAGER)){
				history.replace("/homepage-fuel");
			} else {
				//sukses arahkan ke dashboard
				history.replace("/dashboard");
			}

			dismiss();
		});
	}

	useIonViewWillEnter(() => {
		// all topic
		apiFB.get(`${FB_NOTIF_TOPIC_PUBLIC}`).then(topics =>{
			//alert(topics);
			RegisterNotifications(topics.data.data).then(r => { });
		})

		getPref(pref_is_login).then(r => {
			if (r != null && r == true) {
				history.replace("/dashboard");
			} else {
				loadRememberMe();
				GoogleAuth.initialize({
					clientId: `${GOOGLE_AUTH_SERVER_CLIENT_WEB_ID}`,
					scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
					grantOfflineAccess: true,
				});
			}
		});
		getPref(pref_lng).then(l => {
			if(l == null){
				let lng = window.localStorage.getItem(pref_lng);
				// @ts-ignore
				setLng(lng);
			} else {
				setLng(l);
			}
		})
	});

	/* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
	jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
	useIonViewDidEnter(() => {
	});

	const handleOpen = () => {
		/* Todo: disable dulu*/
		// @ts-ignore
		// ref.current.open();
	};

	return (
		<IonPage>
			<IonContent>
				<IonRefresher slot="fixed" onIonRefresh={doRefresh}>
					<IonRefresherContent />
				</IonRefresher>
				<div className='h-screen bg-white'>
					<div className='bg-red-700 rounded-b-3xl h-56 drop-shadow-lg'>
						<div className='absolute right-8 top-4'>
							<div onClick={handleOpen} className='flex justify-between items-center px-2 py-1 rounded-full w-20 bg-gray-200'>
								<img id="langID" className="w-4 h-4 rounded-full ring-1 ring-gray-300" src={lng === "id" ? "assets/images/flag-id.png" : "assets/images/flag-us.png"} alt="id-flag" />
								<span className='font-bold text-xs'>{lng === "id" ? "ID" : "ENG"}</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" className="w-4 h-4">
									<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
								</svg>
							</div>
						</div>
						<div className="h-56 flex justify-center">
							<img className="object-cover pointer-events-none h-20 w-50 mt-20" src="assets/images/logo-with-stroke.png" ></img>
						</div>
					</div>
					<div className='mt-8 px-8 text-sm'>
						<div className='flex justify-between items-center'>
							<div className='mt-3'>
								<h3 className='font-bold text-xl'>{t('login.login')}</h3>
							</div>
							<div className="docs-demo-mode-toggle w-40 mr-0">
								<button type="button" onClick={(event) => setIsIsafe(true)} className={isIsafe ? "is-button  is-selected" : "is-button"} title="Login dengan iSafe">iSafe</button>
								<button type="button" className={!isIsafe ? "is-button  is-selected" : "is-button"} onClick={(event) => setIsIsafe(false)} title="Login tanpa iSafe">Non iSafe</button>
							</div>
						</div>
						<div className='mt-4'>
							{/* <label htmlFor="username" className="block font-medium text-gray-700">
								Username
							</label> */}
							<div className="relative mt-1 text-gray-700">
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
										<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
									</svg>
								</div>
								<input
									id="username"
									value={username}
									name="username"
									autoComplete="username"
									onChange={(event) => setUsername(event.target.value)}
									required
									className="pl-10 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm "
								/>
							</div>
						</div>
						<div className='mt-4'>
							{/* <label htmlFor="password" className="block font-medium text-gray-700">
								Password
							</label> */}
							<div className="relative mt-1 text-gray-700">
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
										<path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
									</svg>
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									autoComplete="current-password"
									required
									// onChange={}
									className="pl-10 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm"
								/>
								<div onClick={event => setShowPassword(showPassword ? false : true)} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									{!showPassword ?
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
											<path stroke-linecap="round" stroke-linejoin="round"
												d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
											<path stroke-linecap="round" stroke-linejoin="round"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										:
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
											<path stroke-linecap="round" stroke-linejoin="round"
												d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
										</svg>
									}
								</div>
							</div>
						</div>
						<div className="text-center items-center mt-8">
							<button type="button" className="w-full rounded-md bg-red-700 py-2 px-4 font-medium text-white"
								onClick={handleLogin}
							>
								{t('login.login')}
							</button>
							<div className="relative flex py-5 items-center">
								<div className="flex-grow border-t border-gray-400"></div>
								<span className="flex-shrink mx-4 text-gray-800 text-xs">{t('login.or')}</span>
								<div className="flex-grow border-t border-gray-400"></div>
							</div>
							<div onClick={loginGoogle} className="flex w-full justify-center rounded-md bg-white py-2 px-4 font-medium text-gray-700 border border-1 border-gray-700">
								{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill='currentColor' className='w-4 h-4 mr-2 text-white'>
									<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
								</svg> */}
								<img
									className="h-4 w-4 mr-2"
									src="assets/icon/g-logo.png"
									alt="g-logo"
								/>
								{t('login.google')}
							</div>
						</div>
					</div>
					<div className='w-full text-xs text-center mt-16'>
						<div className='text-gray-500'>Provided by Digitech - GEMS</div>
						<div className='text-gray-500'>© 2022 PT. Borneo Indobara</div>
					</div>
				</div>
			</IonContent>
			<ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out">
				<div className="overflow-hidden rounded-2xl bg-white">
					<div className="divide-y pb-6 divide-gray-300">
						<p className="font-bold text-gray-900 p-6">
							{t('login.pilih_bahasa')}
						</p>
						<div>
							<div className='px-4 divide-y'>
								<div onClick={event => {onClickLanguageChange('id')}} className="w-full py-4 px-2 inline-flex">
									<img id="langID" className="w-6 h-6 rounded-full ring-1 ring-gray-300" src="assets/images/flag-id.png" alt="id-flag" />
									<div className='flex justify-between w-full'>
										<div>
											<span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">Indonesia</span>
										</div>
										{lng === 'id' &&
											<div>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
													 fill="currentColor" className='w-6 h-6 text-emerald-500'>
													<path
														d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
												</svg>
											</div>
										}
									</div>
								</div>
								<div onClick={event => {onClickLanguageChange('en')}} className="w-full py-4 px-2 inline-flex">
									<img id="langUS" className="w-6 h-6 rounded-full ring-1 ring-gray-300" src="assets/images/flag-us.png" alt="id-flag" />
									<div className='flex justify-between w-full'>
										<div>
											<span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">English</span>
										</div>
										{/* Tambahkan atribut hidden untuk bahasa yg tidak diselect */}
										{lng === 'en' &&
											<div>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
													 fill="currentColor" className='w-6 h-6 text-emerald-500'>
													<path
														d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
												</svg>
											</div>
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ActionSheet>
		</IonPage>
	);
};

// @ts-ignore
export default Login;