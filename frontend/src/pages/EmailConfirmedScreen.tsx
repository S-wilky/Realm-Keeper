import RK_Button from "../components/RK_Button";
import { useNavigate } from "react-router-dom";


const EmailConfirmedScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen flex flex-col bg-[#2C3539] text-[#D9DDDC] p-6 gap-4">
            <p>
                Email Confirmed!
            </p><p>
                Sign in on target device or click the button below to redirect to dashboard.
            </p>
            <div className="w-60">
                <RK_Button type="accent" size="sm" onClick={() => navigate("/")}>
                    Go to Dashboard
                </RK_Button>
            </div>
        </div>
    );
};

export default EmailConfirmedScreen;