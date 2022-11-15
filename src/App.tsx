import { Redirect, Route } from "react-router-dom";
import {IonApp, IonRouterOutlet, setupIonicReact} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
//import Home from './pages/Home';
import Splashscreen from "./pages/Splash/Splashscreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardFuelman from "./pages/Dashboard/DashboardFuelman";
import P2HList from "./pages/Fuel/P2H/P2HList";
import P2HInput from "./pages/Fuel/P2H/P2HInput";
import P2HDetail from "./pages/Fuel/P2H/P2HDetail";
import GAP2HList from "./pages/Fuel/P2H/GAP2HList";
import GAP2HDetail from "./pages/Fuel/P2H/GAP2HDetail";
import NotifikasiList from "./pages/Notifikasi/NotifikasiList";
import UnitList from "./pages/Fuel/GantiUnit/UnitList";
import PermintaanUnitList from "./pages/Fuel/GantiUnit/PermintaanUnitList";
import PermintaanUnitDetail from "./pages/Fuel/GantiUnit/PermintaanUnitDetail";
import ApprovemenPermintaanUnitDetail from "./pages/Fuel/GantiUnit/ApprovemenPermintaanUnitDetail";
import FuelHomepage from "./pages/Fuel/Home/FuelHome";
import GAFuelHomepage from "./pages/Fuel/Home/GAFuelHome";

import MealHomepage from "./pages/Meal/Home/MealHomepage";
import RequestList from "./pages/Meal/Request/RequestList";
import RequestForm from "./pages/Meal/Request/RequestForm";
import RequestFormDivision from "./pages/Meal/Request/RequestFormDivision";
import RequestFormVisitor from "./pages/Meal/Request/RequestFormVisitor";
import MenuSehatHome from "./pages/Meal/menuSehat/MenuSehatHome";
import MenuSehatForm from "./pages/Meal/menuSehat/MenuSehatForm";
import MenuSehatView from "./pages/Meal/menuSehat/MenuSehatView";
import DayoffHome from "./pages/Meal/Dayoff/DayoffHome";
import DayoffForm from "./pages/Meal/Dayoff/DayoffForm";
import MealPacketHome from "./pages/Meal/Packet/PacketHome";
import MealPacketForm from "./pages/Meal/Packet/PacketForm";
import MealVvipHome from "./pages/Meal/Vvip/VvipHome";
import MealVvipForm from "./pages/Meal/Vvip/VvipForm";
import MenuVvipView from "./pages/Meal/menuVvip/MenuVvipView";
import MenuVvipForm from "./pages/Meal/menuVvip/MenuVvipForm";
import MenuVvipHome from "./pages/Meal/menuVvip/MenuVvipHome";

import VisitHomepage from "./pages/Visit/VisitHomepage";
import VisitList from "./pages/Visit/VisitList";
import RequestVisitList from "./pages/Visit/RequestVisitList";
import RequestVisitEmployee from "./pages/Visit/RequestVisitEmployee";
import FormRequesTempUnit from "./pages/Fuel/TempUnit/FormRequesTempUnit";
import PermintaanTempUnitList from "./pages/Fuel/TempUnit/PermintaanTempUnitList";
import PermintaanTempUnitDetail from "./pages/Fuel/TempUnit/PermintaanTempUnitDetail";
import BuatLaporan from "./pages/GACare/BuatLaporan";
import ListLaporan from "./pages/GACare/ListLaporan";
import KirimLaporan from "./pages/GACare/KirimLaporan";
import Profile from "./pages/Profile/Profile";
import CouponList from "./pages/Fuel/Kupon/CouponList";
import FormUpdateOdo from "./pages/Fuel/UpdateOdo/FormUpdateOdo";

import GAPermintaanUnitList from "./pages/Fuel/GantiUnit/GA/GAPermintaanUnitList";
import GAPermintaanUnitDetail from "./pages/Fuel/GantiUnit/GA/GAPermintaanUnitDetail";

import GAPermintaanTempUnitList from "./pages/Fuel/TempUnit/GA/GAPermintaanTempUnitList";
import GAPermintaanTempUnitDetail from "./pages/Fuel/TempUnit/GA/GAPermintaanTempUnitDetail";
import PermintaanBahanBakarList from "./pages/Fuel/RequestFuel/RequestFuelList";
import GAPermintaanBahanBakarList from "./pages/Fuel/RequestFuel/GA/GARequestFuelList";
import PermintaanBahanBakar from "./pages/Fuel/RequestFuel/FormRequestFuel";
import DetailPermintaanBahanBakar from "./pages/Fuel/RequestFuel/DetailRequestFuel";
import GaApprovalPermintaanBahanBakar from "./pages/Fuel/RequestFuel/GA/GaApprovalRequestFuel";
import FinanceApprovalPermintaanBahanBakar from "./pages/Fuel/RequestFuel/Finance/FinanceApprovalRequestFuel";
import RequestFuel from "./pages/Fuel/RequestFuel/Kupon/RequestFuel";

import OtherCouponList from "./pages/Fuel/OtherCoupon/OtherCouponList";
import GAOtherCouponList from "./pages/Fuel/OtherCoupon/GA/GAOtherCouponList";
import PermintaanOtherCoupon from "./pages/Fuel/OtherCoupon/FormOtherCoupon";
import DetailOtherCoupon from "./pages/Fuel/OtherCoupon/DetailOtherCoupon";
import GaApprovalOtherCoupon from "./pages/Fuel/OtherCoupon/GA/GaApprovalOtherCoupon";
import FinanceApprovalOtherCoupon from "./pages/Fuel/OtherCoupon/Finance/FinanceApprovalOtherCoupon";
import RequestOtherCoupon from "./pages/Fuel/OtherCoupon/Kupon/RequestOtherCoupon";

import FuelmanFuelHome from "./pages/Fuel/Home/FuelmanFuelHome";
import FuelmanScanQR from "./pages/Fuel/Home/Scanner/FuelmanScanQR";
import DetailScanFuel from "./pages/Fuel/RequestFuel/Fuelman/DetailScanFuel";
import DetailScanOtherCoupon from "./pages/Fuel/OtherCoupon/Fuelman/DetailScanOtherCoupon";
import DetailScanDOFuel from "./pages/Fuel/PO/Fuelman/DetailScanDOFuel";
import FuelmanNotifikasi from "./pages/Fuel/RequestFuel/Fuelman/FuelmanNotifikasi";
import GantiStokList from "./pages/Fuel/Stok/GantiStokList";
import GantiStokDetail from "./pages/Fuel/Stok/GantiStokDetail";
import FormGantiStok from "./pages/Fuel/Stok/FormGantiStok";

import LogisticFuelHome from "./pages/Fuel/Home/LogisticFuelHome";
import POFuelList from "./pages/Fuel/PO/Logistic/POFuelList";
import DetailPOFuel from "./pages/Fuel/PO/Logistic/DetailPOFuel";
import DetailDOFuel from "./pages/Fuel/PO/Logistic/DetailDOFuel";

import {App as CapacitorApp} from "@capacitor/app";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/tailwind.css";
import React, { Component } from "react";
import DetailLaporan from "./pages/GACare/DetailLaporan";
import DashboardGA from "./pages/Dashboard/DashboardGA";
import {SplashScreen} from "@capacitor/splash-screen";
import QRScan from "./pages/QRScan";


// import MenuVvipForm from "./pages/Meal/menuVvip/MenuVvipForm";
// import MenuVvipHome from "./pages/Meal/menuVvip/MenuVvipHome";
// import MenuVvipHomeGa from "./pages/Meal/menuVvip/MenuVvipHomeGa";

setupIonicReact({
  hardwareBackButton: true
});

// CapacitorApp.addListener("backButton", ({canGoBack}) => {
//   if(!canGoBack){
//     CapacitorApp.exitApp();
//   } else {
//     window.history.back();
//   }
// })

const App: React.FC = () => (
  <IonApp className="bg-gradient-to-r from-red-700 to-red-500">
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Splashscreen />
        </Route>

        {/* Dashboard */}
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/dashboard2">
          <DashboardFuelman />
        </Route>
        <Route exact path="/dashboard-ga">
          <DashboardGA />
        </Route>

        {/* Profile Page */}
        <Route exact path="/profil">
          <Profile />
        </Route>

        {/* Coupon Page */}
        <Route exact path="/all-coupon">
          <CouponList />
        </Route>

        {/* Notifikasi */}
        <Route exact path="/notifikasi">
          <NotifikasiList />
        </Route>

        {/* MDForFuel Dashboard */}
        <Route exact path="/fuel/homepage">
          <FuelHomepage />
        </Route>

        {/* Notifikasi */}
        <Route exact path="/ga-care/list-laporan">
          <ListLaporan />
        </Route>
        <Route exact path="/ga-care/buat-laporan">
          <BuatLaporan />
        </Route>
        <Route exact path="/ga-care/detail-laporan">
          <DetailLaporan />
        </Route>
        <Route exact path="/ga-care/kirim-laporan">
          <KirimLaporan />
        </Route>

        {/* MDForFuel Dashboard GA*/}
        <Route exact path="/ga/fuel/homepage">
          <GAFuelHomepage />
        </Route>
        {/* MDForFuel Dashboard Finance*/}
        <Route exact path="/finance/fuel/homepage">
          <GAFuelHomepage />
        </Route>

        {/* P2H */}
        <Route exact path="/fuel/p2h/p2hlist">
          <P2HList />
        </Route>
        <Route path="/fuel/p2h/p2hdetail/:id">
          <P2HDetail />
        </Route>

        <Route exact path="/fuel/p2h/p2hinput">
          <P2HInput />
        </Route>
        <Route exact path="/fuel/p2h/gap2hlist">
          <GAP2HList />
        </Route>
        <Route path="/fuel/p2h/gap2hdetail/:id" component={Component}>
          <GAP2HDetail />
        </Route>

        {/* Meal Dashboard */}
        <Route exact path="/meal">
          <MealHomepage />
        </Route>

        <Route exact path="/meal/request">
          <RequestList />
        </Route>

        <Route exact path="/meal/request/form">
          <RequestForm />
        </Route>

        <Route exact path="/meal/request/form-division">
          <RequestFormDivision />
        </Route>

        <Route exact path="/meal/request/form-visitor">
          <RequestFormVisitor />
        </Route>

        <Route exact path="/meal/menusehat">
          <MenuSehatHome />
        </Route>

        <Route exact path="/meal/menusehat/form">
          <MenuSehatForm />
        </Route>

        <Route exact path="/meal/menusehat/detail/:id">
          <MenuSehatView />
        </Route>

        <Route exact path="/meal/dayoff">
          <DayoffHome />
        </Route>

        <Route exact path="/meal/dayoff/form">
          <DayoffForm />
        </Route>

        <Route exact path="/meal/packet">
          <MealPacketHome />
        </Route>

        <Route exact path="/meal/packet/form/:id">
          <MealPacketForm />
        </Route>


        <Route exact path="/meal/menuvvip">
          <MenuVvipHome />
        </Route>
        <Route exact path="/meal/menuvvip/form">
          <MenuVvipForm />
        </Route>
        <Route exact path="/meal/menuvvip/detailpengajuan/:id">
          <MenuVvipView />
        </Route>


        {/* Visit Dashboard */}
        <Route exact path="/visit/homepage">
          <VisitHomepage />
        </Route>

        {/* Visit */}
        <Route exact path="/visit/visitlist">
          <VisitList />
        </Route>
        <Route exact path="/visit/requestvisit">
          <RequestVisitList />
        </Route>
        <Route exact path="/visit/requestvisitemployee">
          <RequestVisitEmployee />
        </Route>

        {/* MDForFuel - Ganti Unit */}
        <Route exact path="/fuel/unit/ganti">
          <UnitList />
        </Route>
        <Route exact path="/fuel/unit/detail/:id" component={Component}>
          <PermintaanUnitDetail />
        </Route>
        <Route exact path="/fuel/unit/daftar-permintaan">
          <PermintaanUnitList />
        </Route>

        <Route exact path="/fuel/ga/unit/detail/:id" component={Component}>
          <GAPermintaanUnitDetail />
        </Route>
        <Route exact path="/fuel/ga/unit/daftar-permintaan">
          <GAPermintaanUnitList />
        </Route>

        <Route
          exact
          path="/fuel/unit/approvemen-detail/:id"
          component={Component}
        >
          <ApprovemenPermintaanUnitDetail />
        </Route>

        {/* MDForFuel - Temporary Unit */}
        <Route exact path="/fuel/temp-unit/create">
          <FormRequesTempUnit />
        </Route>
        <Route exact path="/fuel/temp-unit/detail/:id" component={Component}>
          <PermintaanTempUnitDetail />
        </Route>
        <Route exact path="/fuel/temp-unit/daftar-permintaan">
          <PermintaanTempUnitList />
        </Route>
        <Route exact path="/fuel/temp-unit/ga-detail/:id" component={Component}>
          <GAPermintaanTempUnitDetail />
        </Route>
        <Route exact path="/fuel/temp-unit/ga-daftar-permintaan">
          <GAPermintaanTempUnitList />
        </Route>

        {/* MDForFuel - Request MDForFuel */}
        <Route exact path="/fuel/req-fuel/daftar-permintaan">
          <PermintaanBahanBakarList />
        </Route>
        <Route exact path="/fuel/req-fuel/ga-daftar-permintaan">
          <GAPermintaanBahanBakarList />
        </Route>
        <Route exact path="/fuel/req-fuel/finance-daftar-permintaan">
          <GAPermintaanBahanBakarList />
        </Route>
        <Route exact path="/fuel/req-fuel/create-form">
          <PermintaanBahanBakar />
        </Route>
        <Route exact path="/fuel/req-fuel/detail/:id">
          <DetailPermintaanBahanBakar />
        </Route>
        <Route exact path="/fuel/req-fuel/ga-approval/:id">
          <GaApprovalPermintaanBahanBakar />
        </Route>
        <Route exact path="/fuel/req-fuel/finance-approval/:id">
          <FinanceApprovalPermintaanBahanBakar />
        </Route>
        <Route exact path="/fuel/kupon/detail-fuel/:id">
          <RequestFuel />
        </Route>
        <Route exact path="/fuel/perbaikan-odo">
          <FormUpdateOdo />
        </Route>

        {/* MDForFuel - Request Other Coupon */}
        <Route exact path="/fuel/req-other/daftar-permintaan">
          <OtherCouponList />
        </Route>
        <Route exact path="/fuel/req-other/ga-daftar-permintaan">
          <GAOtherCouponList />
        </Route>
        <Route exact path="/fuel/req-other/finance-daftar-permintaan">
          <GAOtherCouponList />
        </Route>
        <Route exact path="/fuel/req-other/create-form">
          <PermintaanOtherCoupon />
        </Route>
        <Route exact path="/fuel/req-other/detail/:id">
          <DetailOtherCoupon />
        </Route>
        <Route exact path="/fuel/req-other/ga-approval/:id">
          <GaApprovalOtherCoupon />
        </Route>
        <Route exact path="/fuel/req-other/finance-approval/:id">
          <FinanceApprovalOtherCoupon />
        </Route>
        <Route exact path="/fuel/kupon/detail-other/:id">
          <RequestOtherCoupon />
        </Route>


        {/* Fuelman */}
        <Route exact path="/fuelman/fuel/homepage">
          <FuelmanFuelHome />
        </Route>
        <Route exact path="/fuel/scan">
          <FuelmanScanQR />
        </Route>
        <Route exact path="/fuel/notifikasi">
          <FuelmanNotifikasi />
        </Route>
        <Route exact path="/fuel/detail/:id" component={Component}>
          <DetailScanFuel />
        </Route>
        <Route exact path="/fuel/detail-other/:id" component={Component}>
          <DetailScanOtherCoupon />
        </Route>
        <Route exact path="/fuel/detail-do/:id" component={Component}>
          <DetailScanDOFuel />
        </Route>
        {/* Ganti Stok */}
        <Route exact path="/fuel/ganti-stok/daftar">
          <GantiStokList/>
        </Route>
        <Route exact path="/fuel/ganti-stok/create">
          <FormGantiStok/>
        </Route>
        <Route exact path="/fuel/ganti-stok/detail:id" component={Component}>
          <GantiStokDetail/>
        </Route>

        {/* Logistic */}
        <Route exact path="/logistic/fuel/homepage">
          <LogisticFuelHome />
        </Route>
        <Route exact path="/fuel/po">
          <POFuelList />
        </Route>
        <Route exact path="/fuel/po/detail/:id">
          <DetailPOFuel />
        </Route>
        <Route exact path="/fuel/do/detail/:id">
          <DetailDOFuel />
        </Route>

        <Route exact path="/scan">
          <QRScan />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
