import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Area from "../../Assets/area.json"
const PaymentPage = () => {
    const [dummyPay, setDummyPay] = useState({})
    const history = useHistory()

    const handleConfim = () => {
        history.replace("/transaction")
    }

    useEffect(() => {
        const x = localStorage.getItem("formPayment")
        setDummyPay(JSON.parse(x))
    }, [])

    return (
        <div className='payment-container'>
            <div className='payment-header'>
                <span className='header-text'>Silahkan melakukan pembayaran</span>
            </div>
            <div className='payment-method'>
                <img src={`/icons/${dummyPay?.payment}.png`} alt="bank" />
            </div>
            <div className='payment-info'>
                <div className='payment-item'>
                    <span className='key'>Bank</span>
                    <span className='val'>{dummyPay?.payment}</span>
                </div>
                <div className='payment-item'>
                    <span className="key">Rekening</span>
                    <span className="val">2702067261</span>
                </div>
                <div className='payment-item'>
                    <span className="key">Nama</span>
                    <span className="val">Jhon Andrean</span>
                </div>
            </div>
            <button
                onClick={handleConfim}
                className='payment-button'>Konfirmasi Pembayaran</button>
        </div>
    )
}

export default PaymentPage