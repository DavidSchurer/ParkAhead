import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentPortal.module.css';

function PaymentPortal() {
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');

    const handlePaymentSubmit = (event) => {
        event.preventDefault();
        console.log('Payment Submitted', { cardNumber, expirationMonth, expirationYear, cvv, cardHolderName });
        // Payment processing logic will go here
        navigate('/ConfirmationPage');
    };

    return (
        <div className={styles.paymentContainer}>
            <div className={styles.paymentBox}>
                <h2 className={styles.paymentHeader}>Payment Portal</h2>
                <form onSubmit={handlePaymentSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                            type="text"
                            id="cardNumber"
                            placeholder="•••• •••• •••• ••••"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="expirationDate">Expiration Date</label>
                        <div className={styles.expirationDateContainer}>
                            <input
                                type="text"
                                id="expirationMonth"
                                placeholder="MM"
                                value={expirationMonth}
                                onChange={(e) => setExpirationMonth(e.target.value)}
                                required
                                className={`${styles.inputField} ${styles.expirationInput}`}
                            />
                            <input
                                type="text"
                                id="expirationYear"
                                placeholder="YY"
                                value={expirationYear}
                                onChange={(e) => setExpirationYear(e.target.value)}
                                required
                                className={`${styles.inputField} ${styles.expirationInput}`}
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="cvv">CVV</label>
                        <input
                            type="text"
                            id="cvv"
                            placeholder="•••"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="cardHolderName">Cardholder's Name</label>
                        <input
                            type="text"
                            id="cardHolderName"
                            placeholder="John Smith"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <button className={styles.payButton} type="submit">Pay</button>
                </form>
            </div>
        </div>
    );

};

export default PaymentPortal;