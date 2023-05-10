import { IonContent, IonPage } from "@ionic/react";
import { useState } from "react";
import { useHistory } from 'react-router';
import { Link } from "react-router-dom";
import { sendPasswordReset } from "./../firebase";
import "./Reset.css";

function Reset() {
    const [email, setEmail] = useState("");
    const [requestSent, setRequestSent] = useState(false);
    const history = useHistory();

    const emailSent = (() => {
        setRequestSent(true);
    });

    const backToLogin = (() => {
        setRequestSent(false);
        history.push({ pathname: '/page/Login' });
    });

    return (
        <IonPage>
            <IonContent fullscreen class="background">
                <div className="reset">
                    <div className="reset__container">
                        {
                            !requestSent
                            &&
                            <>
                                <input
                                    type="text"
                                    className="reset__textBox"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-mail Address"
                                />
                                <button
                                    className="reset__btn"
                                    onClick={() => sendPasswordReset(email, emailSent)}
                                >
                                    Send password reset email
                                </button>
                                {/* <div>
                          Don't have an account? <Link to="/register">Register</Link> now.
                      </div> */}
                            </>
                        }
                        {
                            requestSent
                            &&
                            <div>
                                <a onClick={() => backToLogin()}>Back to Login</a>
                            </div>
                        }
                        <div>
                         <Link to="/page/Login">Back to Login</Link>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}
export default Reset;