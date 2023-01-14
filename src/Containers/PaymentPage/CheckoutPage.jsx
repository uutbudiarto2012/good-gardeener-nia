import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import "./PaymentPage.css"

const PaymentPage = () => {
    const history = useHistory()
    const [form, setForm] = useState({
        payment: "",
        name: "",
        telepon: "",
        address: "",
    })
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem("formPayment", JSON.stringify(form))
        console.log("OK")
        history.replace("/payment")
    }
    return (
        <div className="payment-container">
            <h2>Form Pembayaran</h2>
            <form
                onSubmit={handleSubmit}
            >
                <select
                    onChange={handleChange}
                    value={form.payment}
                    className="payment-input"
                    name="payment" id="payment">
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="bca">Bank BCA</option>
                    <option value="bni">Bank BNI</option>
                </select>
                <input
                    onChange={handleChange}
                    value={form.name}
                    type="text"
                    name="name"
                    className="payment-input"
                    placeholder='nama penerima'
                />
                <input
                    onChange={handleChange}
                    type="number"
                    value={form.telepon}
                    name="telepon"
                    className="payment-input"
                    placeholder='telepon'
                />
                <textarea
                    onChange={handleChange}
                    value={form.address}
                    className='payment-input'
                    name="address"
                    id="address"
                    rows={10}
                    placeholder='alamat'
                />
                <button className='payment-button'>
                    Proses Order
                </button>
            </form>
        </div>
    )
}

export default PaymentPage