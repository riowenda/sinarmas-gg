// export const BASE_API_URL = "https://dev-backendsvr-01.borneo-indobara.com";
// export const BASE_API_URL = 'http://localhost:8080';
export const BASE_API_URL = "http://35.219.126.93:8080";
export const API_URI = "/api";
export const AUTH_URI = "/auth";
export const LOGIN_URI = "/login";
export const REGISTER_URI = "/register";
export const LOGIN_ISAFE_URI = "/signin";
export const LOGIN_GOOGLE_URI = "/googlesignin";
export const API_URL_IMAGE_GACARE =  BASE_API_URL+API_URI+"/file/image/GA_CARE/";
export const IMAGE_FUEL_URI = "/file/image/FUEL_MANAGEMENT/"
export const P2H_CRUD_URI = "/p2h";
export const P2H_LIST_GA_URI = "/p2h";
export const P2H_LIST_USER_URI = "/p2h/by-user";
export const P2H_ITEM_URI = "/p2h/daftar-item";
export const P2H_APPROVAL_URI = "/p2h/approval";
export const UNIT_CRUD_URI = "/md/units";
export const UNIT_LIST_URI = "/md/units";
export const UNIT_VIEWS_URI = "/views";
export const PEGAWAI_UNIT_CRUD_URI = "/pegawai-unit";
export const PEGAWAI_UNIT_BY_USER_URI = "/find-by-user";
export const PEGAWAI_UNIT_SET_UNIT_USER_URI = "/set-unit-user";
export const PEGAWAI_UNIT_TAKEOVER_URI = "/takeover";
export const PEGAWAI_UNIT_APPROVED_URI = "/approved";
export const PEGAWAI_UNIT_RELEASED_URI = "/released";
export const TAKEOVER_UNIT_URI = "/takeover";
export const TAKEOVER_ALL_USER_URI = "/get-all-user";
export const TAKEOVER_APPROVAL_USER_URI = "/get-approval-user";
export const TAKEOVER_ALL_GA_URI = "/takeover/get-all-ga";
export const TAKEOVER_ALL_GA_APPROVAL_URI = "/get-all-ga-approval";
export const TAKEOVER_GET_REQUEST_DETAIL_USER_URI = "/get-request";
export const TAKEOVER_GET_ALL_REQUEST_USER_URI = "/get-all-request";
export const TEMP_UNIT_URI = "/temporari-unit";
export const TEMP_UNIT_LIST_URI = "/temporari-unit";
export const TEMP_UNIT_CREATE_URI = "/request";
export const TEMP_UNIT_APPROVAL_URI = "/approval";
export const TEMP_UNIT_ALL_GA_URI = "/get-all-ga";
export const TEMP_UNIT_ALL_GA_APPROVAL_URI = "/get-all-ga-approval";
export const TEMP_UNIT_GET_REQUEST_DETAIL_USER_URI = "/get-request";
export const TEMP_UNIT_GET_ALL_REQUEST_USER_URI = "/get-all-request";
export const FUEL_REQ_UNIT_URI = "/fuel/kupon";
export const FUEL_REQ_UNIT_CREATE_URI = "/request";
export const FUEL_REQ_UNIT_APPROVAL_URI = "/approval";
export const FUEL_REQ_UNIT_CONFIRMATION_URI = "/confirmation";
export const FUEL_REQ_UNIT_FORGIVENES_URI = "/forgiveness";
export const FUEL_REQ_USER_LIST_URI = "/find-list-for-user";
export const FUEL_REQ_USER_LAST_REDEM = "/find-last-redem";
export const FUEL_REQ_FUELMAN_FILL_URI = "/fill";
export const FUEL_REQ_GA_LIST_URI = "/get-for-approval-ga";
export const FUEL_REQ_UNIT_GA_FORGIVEN_URL = "/forgiven";
export const FUEL_REQ_FINANCE_LIST_URI = "/get-for-approval-finance";
export const FUEL_REQ_FIND_EXISTING_URI = "/find-existing";
export const OTHER_COUPON_URI = "/fuel/other-kupon";
export const OTHER_COUPON_CREATE_URI = "/request";
export const OTHER_COUPON_APPROVAL_URI = "/approval";
export const OTHER_COUPON_CONFIRMATION_URI = "/confirmation";
export const OTHER_COUPON_USER_LIST_URI = "/find-list-for-user";
export const OTHER_COUPON_FUELMAN_FILL_URI = "/fill";
export const OTHER_COUPON_GA_LIST_URI = "/find-list-for-ga";
export const OTHER_COUPON_FINANCE_LIST_URI = "/find-list-for-finance";
export const PO_URI = "/fuel-po";
export const PO_DETAIL_URI = "/detailPO";
export const PO_DO_DETAIL_URI = "/detailDO";
export const PO_DO_CREATE_URI = "/createDeliverOrder";
export const PO_DO_APPROVEMENT_LOGISTIC_URI = "/processDOByLogistic";
export const PO_DO_CONFIRMATION_FUELMAN_URI = "/do/confirmation-fuelman";
export const PO_CONFIRMATION_GA_URI = "/do/confirmation-ga";

//MD-FOR-FUEL
export const MD_OTHER_COUPON_URI = "/other-coupon";
export const MD_FUEL_STATION_URI = "/fuel-station";
export const MD_FUEL_STATION_AVAILABLE = "/fuel-station/available";
export const MD_PEGAWAI_URI = "/md/pegawais/";
export const UTILS_URI = "/utils";
export const QR_CODE_GENERATE_URI = "/qrcodes/create";
export const MD_JENIS_UNIT_URI = "/md/jenis-units";
export const MD_VENDOR_URI = "/md/vendors";
export const MD_TIPE_UNIT_URI = "/md/tipe-units";
export const MD_SPESIFIKASI_UNIT_URI = "/md/spesifikasi-units";
export const MD_DIVISI_URI = "/md/organisasis";
export const MD_SISTEM_KERJA_URI = "/commons/list-sistem-kerja-type";
export const MD_QUALITY_URI = "/quality";

export const MEAL_REQ_SELF = "/mealrequests/self";

export const GOOGLE_AUTH_SCOPE = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];
export const GOOGLE_AUTH_SERVER_CLIENT_WEB_ID =
  "785423644522-ar1cd7csqkhc821m3lk8gr06q40s1mju.apps.googleusercontent.com";

//Preference -> UserDefaults on iOS and SharedPreferences on Android
export const pref_identity = "identity";
export const pref_user_id = "user_id";
export const pref_user_role = "role";
export const pref_language = "languange";
export const pref_is_isafe = "isafe";
export const pref_is_google = "gauth";
export const pref_user_name = "nama_user";
export const pref_user_photo = "photo";
export const pref_user_nik = "nik";
export const pref_user_email = "email";
export const pref_json_pegawai_info_login = "user_info";
export const pref_user_detail = "user_detail";
export const pref_is_login = "is_login";
export const pref_token = "token";
export const pref_is_exist = "data_is_exist";
export const pref_remember_me = "remember_me";
export const pref_username = "username";
export const pref_password = "password";
export const pref_pegawai_id = "pegawai_id";
export const pref_unit = "unit";
export const pref_unit_id = "unit_id";
export const pref_pegawai_unit_id = "pegawai_unit_id"; //untuk kebutuhan identitas unit yang sedang digunakan oleh si pegawai
export const pref_fuel_station_id = "fuel_station_id";
