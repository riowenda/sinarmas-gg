import { IonContent, IonPage } from "@ionic/react"
import { useHistory } from "react-router"
import { CardDaftarPermintaan } from "../../components/Card"
import ListHeader from "../../components/Header/ListHeader"


const DaftarPermintaan: React.FC = () => {
    const history = useHistory()

    return (
        <div className="bg-gradient-to-r from-red-700 to-red-500">
            <IonPage className="bg-gradient-to-r from-red-700 to-red-500">
                <IonContent fullscreen className="bg-gradient-to-r from-red-700 to-red-500 bg-danger h-auto">
                    <div className="bg-white">
                        <ListHeader title={"Daftar Permintaan"} isReplace={false} link={""} addButton={false} />
                        <div className="px-5 py-5">
                            <CardDaftarPermintaan handleOnPress={() => history.push("/ga-care/detail-permintaan")} />
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </div>
    )
}

export default DaftarPermintaan