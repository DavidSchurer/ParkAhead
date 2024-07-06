import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebase';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import styles from './Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberLogin, setRememberLogin] = useState(false);
    const [savedCredentials, setSavedCredentials] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedCredentials = async () => {
            try {
                const docRef = doc(db, 'rememberedLogins', 'userCredentials');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSavedCredentials(data);
                }
            } catch (error) {
                console.error('Error fetching saved credentials:', error);
            }
        };

        fetchSavedCredentials();
    }, []);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRememberLoginChange = (event) => {
        setRememberLogin(event.target.checked);
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('isLoggedIn', 'true');

            if (rememberLogin) {
                const saveCredentials = window.confirm('Do you want to save your login credentials?');
                if (saveCredentials) {
                    await setDoc(doc(db, 'rememberedLogins', 'userCredentials'), {
                        email: email,
                        password: password,
                    });
                }
            } else {
                await setDoc(doc(db, 'rememberedLogins', 'userCredentials'), {
                    email: '',
                    password: '',
                });
            }

            navigate('/HomePage');
        } catch (error) {
            alert('Invalid email or password');
        }
    };

    const handleCreateAccount = () => {
        navigate('/CreateAccount');
    };

    const handleInputClick = () => {
        if (savedCredentials && savedCredentials.email && savedCredentials.password) {
            setShowPopup(true);
        }
    };

    const autofillCredentials = () => {
        setEmail(savedCredentials.email);
        setPassword(savedCredentials.password);
        setShowPopup(false);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.loginHeader}>Login</h2>
                <form>
                    <div className={styles.formGroup}>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            onClick={handleInputClick}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onClick={handleInputClick}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberLogin}
                                onChange={handleRememberLoginChange}
                            />
                            Remember me
                        </label>
                    </div>
                    <button type="button" className={styles.loginButton} onClick={handleLogin}>
                        Login
                    </button>
                    <p>Don't have an account?</p>
                    <button type="button" className={styles.createAccountButton} onClick={handleCreateAccount}>
                        Create Account
                    </button>
                </form>
                {showPopup && (
                  <>
                    <div className={styles.overlay} onClick={() => setShowPopup(false)}></div>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                        <h2>Saved Account Autofill</h2>
                        </div>
                        <p><strong>Suggested Email: </strong> {savedCredentials.email}</p>
                        <p><strong>Suggested Password: </strong> {'•'.repeat(savedCredentials.password.length)}</p>
                        <button className={styles.popupButton} type="button" onClick={autofillCredentials}>
                            Autofill Email and Password
                        </button>
                        <br/>
                        <br/>
                        <button className={styles.popupButton} type="button" onClick={() => setShowPopup(false)}>
                            Cancel
                        </button>
                    </div>
                  </>
                )}
            </div>
        </div>
    );
}

export default Login;