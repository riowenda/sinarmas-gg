// export const BASE_API_URL = "https://dev-backendsvr-01.borneo-indobara.com";
 export const BASE_API_URL = 'https://dev-backendsvr-01.borneo-indobara.com';
// export const BASE_API_URL = 'http://192.168.43.191:8080';
// export const BASE_API_URL = "https://ga-be-dirty.bgs-dev.my.id"
// export const BASE_API_URL_DEV = "http://localhost:8080";
export const BASE_API_URL_DEV = "https://dev-backendsvr-01.borneo-indobara.com";
export const API_URI = "/api"
export const AUTH_URI = "/auth";
export const LOGIN_URI = "/login";
export const REGISTER_URI = "/register";
export const LOGIN_ISAFE_URI = "/signin";
export const LOGIN_GOOGLE_URI = "/googlesignin";
export const LOGOUT_URI = "/logout";
export const API_URL_IMAGE_GACARE = "/file/image/GA_CARE/";
export const IMAGE_FUEL_URI = "/file/image/FUEL_MANAGEMENT/";
export const IMAGE_MD_URI = "/file/image/MASTER_DATA_MANAGEMENT/";
export const P2H_CRUD_URI = "/p2h";
export const P2H_LIST_GA_URI = "/p2h";
export const P2H_LIST_USER_URI = "/p2h/by-user";
export const P2H_ITEM_URI = "/p2h/daftar-item";
export const P2H_APPROVAL_URI = "/p2h/approval";
export const P2H_EXISTING_URI = "/p2h/by-pegawai-unit";
export const P2H_EXISTING_BY_PU_URI = "/p2h/exist-by-pegawai-unit";
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
export const FUEL_TRANSACTION_URI = "/fuel/transaction/datasource";
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
export const DO_REQ_URI = "/fuel-do";
export const DO_REQ_CREATE = "/request";
export const DO_REQ_LIST_BY_STATION_URI = "/find-by-station";
export const DO_REQ_LIST_GA_URI = "/find-for-ga";
export const DO_REQ_DATASOURCE_URI = "/datasource";
export const DO_REQ_DETAIL_URI = "/detail";
export const DO_REQ_LOGISTIC_URI = "/processByLogistic";
export const DO_REQ_CONFIRM_FUELMAN_URI = "/do/confirmation-fuelman";
export const DO_REQ_CONFIRM_GA_URI = "/do/confirmation-ga";
export const LANG_API = "/i18ns/lang";
export const FUEL_STATION_TRANSACTION_BY_NOMOR_URI = "/fuel-transaction/by-nomor";
export const UPDATE_ODO_DATASOURCE_URI = "/perbaikan/datasource";
export const UPDATE_ODO_CREATE_URI = "/perbaikan";
export const UPDATE_ODO_APPROVAL_GA_URI = "/perbaikan/approval";
export const UPDATE_ODO_DETAIL_URI = "/perbaikan/byid";
export const COUNT_P2H_URI = "/p2h/jumlah-proposed";
export const COUNT_FUEL_URI = "/fuel/kupon/kupon/jumlah-proposed";
export const COUNT_OTHER_URI = "/fuel/other-kupon/jumlah-proposed";
export const COUNT_FUEL_FINANCE_URI = "/fuel/kupon/kupon/jumlah-approved";
export const COUNT_OTHER_FINANCE_URI = "/fuel/other-kupon/jumlah-approved";
export const COUNT_TEMPORARY_URI = "/temporari-unit/jumlah-proposed";
export const COUNT_CHANGE_URI = "/takeover/jumlah-proposed";
export const COUNT_ODO_URI = "/fuel/kupon/kupon-perbaikan/jumlah-proposed";
export const COUNT_PO_URI = "/fuel-po/jumlah-proposed";
export const COUNT_DO_URI = "/fuel-do/jumlah-proposed";
export const COUNT_PO_OPENED_URI = "/fuel-po/po/jumlah-opened";
export const COUNT_DO_OPENED_URI = "/fuel-do/jumlah-opened";
export const UNIT_HISTORY_BY_USER_URI = "/get-history-by-user";
export const USER_WORK_STATUS_URI = "/get-status-user-now";

export const VERSION_APPS_CHECK_URI = "/versions";
export const POINTS_PEGAWAI_URI = "/point";

//MD-FOR-FUEL
export const MD_LEAVE_URI = "/md/leaves";
export const MD_OTHER_COUPON_URI = "/other-coupon";
export const MD_FUEL_STATION_URI = "/fuel-station";
export const MD_FUEL_STATION_AVAILABLE = "/fuel-station/available";
export const MD_PEGAWAI_URI = "/md/pegawais";
export const MD_PEGAWAI_DETAIL_URI = "/detail";
export const MD_PEGAWAI_CUSTODIAN = "/list-by-auth";
export const MD_PEGAWAI_UPDATE_PROFILE = "/update-foto-profile";
export const MD_PEGAWAI_SIMPER_URI = "/get-isafe"
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
export const MEAL_REQ_SELF_SAVE = "/mealrequests/self";
export const MEAL_REQ_DIVISION_SAVE = "/mealrequests/division";
export const MEAL_REQ_VISITOR_SAVE = "/mealrequests/visitor";
export const MEAL_PACKET = "/packetproposals";
export const MEAL_PACKET_SAVE = "/packetproposals";

//NOTIFIKASI
export const NOTIFIKASI_LIST_RECEIVER_URI = "/notifications/list/receiver";
export const NOTIFIKASI_SET_READ_URI = "/notifications/setreaded";
export const NOTIFIKASI_COUNT_RECEIVER_URI = "/notifications/list/receivercount";
export const NOTIFIKASI_DETAIL_URI = "/notifications/list/receiver-detail";

 //GA-CARE-LAPORAN
 export const GA_CARE_LAPORAN_URI_UPDATE = "/gacare/laporans/update";
 export const GA_CARE_LAPORAN_URI_CREATE = "/gacare/laporans/create";
 export const GA_CARE_LAPORAN_URI_DETAIL = "/gacare/laporans/detail";
 export const GA_CARE_LAPORAN_URI_ADD_KOMENTAR = "/gacare/laporans/add-komentar";
 export const GA_CARE_LAPORAN_URI_UPDATE_STATUS = "/gacare/laporans/update-status";


//GA-CARE-KATEGORI
export const GA_CARE_KATEGORI_URI_LIST_TREE = "/gacare/kategoris/list-tree";

//PEGAWAI
export const MD_PEGAWAI_URI_LIST_SELECT = "/md/pegawais/select2/search";

//GA-CARE-TIPE
export const GA_CARE_TIPE_URI_LIST = "/gacare/tipe";

//GA-CARE-TIPE
export const LOKASI_KERJA_URI_LIST_TREE = "/md/lokasi-kerjas/list-tree";

// FIREBASE URI
export const FB_NOTIF_URI = "/notifications"
export const FB_NOTIF_REG = "/register"
export const FB_NOTIF_TOPIC_USER = "/topics"
export const FB_NOTIF_TOPIC_PUBLIC = "/topics/public"

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
export const pref_user_auth = "authorities";
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
export const pref_fuel_station = "fuel_station";
export const pref_token_fbnotif = "notif";
export const pref_lng = "i18nextLng";
export const pref_open_notif = "open_notif";
export const pref_json_token_identity = "json_token_idendity";
export const pref_app_version = "app_version";
export const pref_app_server_version = "app_server_version";
export const pref_app_base_api_url = "base_api_url";
export const pref_json_simper = "simper";

//Authorities
export const AUTH_MEAL_REQUEST = "MEAL_REQUEST";
export const AUTH_MEAL_REQUEST_DIVISION = "MEAL_REQUEST_DIVISION";
export const AUTH_MEAL_REQUEST_GUEST = "MEAL_REQUEST_GUEST";
export const AUTH_MEAL_CATERING = "MEAL_CATERING";
export const AUTH_MEAL_GA = "MEAL_GA";
export const AUTH_MEAL_COMMITE_MENU = "MEAL_COMMITE_MENU";
export const AUTH_FUEL_REQUEST = "FUEL_REQUEST";
export const AUTH_FUEL_REQUEST_OTHER = "FUEL_REQUEST_OTHER";
export const AUTH_FUEL_OTHER_REQUEST = "FUEL_OTHER_REQUEST";
export const AUTH_FUEL_GA = "FUEL_GA";
export const AUTH_FUEL_FINANCE = "FUEL_FINANCE";
export const AUTH_FUEL_STATION = "FUEL_STATION";
export const AUTH_FUEL_LOGISTIC = "FUEL_LOGISTIC";
export const AUTH_FUEL_MANAGER = "FUEL_MANAGER";
export const AUTH_VISIT_REQUEST = "VISIT_REQUEST";
export const AUTH_VISIT_REQUEST_GUEST = "VISIT_REQUEST_GUEST";
export const AUTH_VISIT_GA = "VISIT_GA";
export const AUTH_VISIT_HR = "VISIT_HR";
export const AUTH_MD_MANAGER = "MD_MANAGER";
export const AUTH_MD_ADMIN_DIVISION = "MD_ADMIN_DIVISION";
export const AUTH_CARE_GA = "CARE_GA";

export const ROLE_FUEL_GA = "GA";
export const ROLE_FUEL_FUELMAN = "FUELMAN";
export const ROLE_FUEL_LOGISTIC = "LOGISTIC";
export const ROLE_GENERAL = "GENERAL";
export const ROLE_FUEL_FINANCE = "FINANCE";
export const ROLE_GA_CARE = "GA_CARE";

export const APP_MODE_DEV = "dev";
export const APP_MODE_PROD = "prod";