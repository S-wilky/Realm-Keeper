import { useNavigate } from "react-router-dom";
import RK_Icon from "./RK_Icon";

export default function SideMenu() {
    const navigate = useNavigate();

    return <div className="m-0 p-3 sticky bg-erie flex flex-col items-center top-0 w-25 h-screen gap-5">
                <img
                    onClick={() => navigate("/")}
                    src="/src/assets/RealmKeeperLogo.png"
                    alt="Realm Keeper Logo"
                    className="w-20 h-20 mb-10 self-center cursor-pointer"
                />
                {/* <RK_Icon size="md" color="duskyBlue" onClick={() => {}} />
                <RK_Icon icon="chat" size="md" color="duskyBlue" onClick={() => {}} />
                <RK_Icon icon="connect" size="md" color="duskyBlue" onClick={() => {}} /> */}
                <div className="mt-auto">
                    <RK_Icon icon="settings" size="md" color="duskyBlue" onClick={() => {navigate("/profile")}} />
                </div>
            </div>
}