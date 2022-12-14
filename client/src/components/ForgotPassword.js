import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, CardFooter } from "reactstrap"
import { Link } from "react-router-dom"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha";


function ForgotPassword() {

    let navigate = useNavigate()

    const [userEmail, setUserEmail] = useState()
    const [otpSend, setOtpSend] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [apiError, setApiError] = useState(false)
    const [newPassword, setNewPassword] = useState()
    const [otp, setOtp] = useState()

    const sendOtp = () => {
        setLoadingSubmit(true)
        setApiError(false)
        axios.post("https://minddefttask.herokuapp.com/public/resendOtp", {
            email: userEmail,
            type: "forgotPassword"
        })
            .then((res) => {
                setLoadingSubmit(false)
                console.log(res)
                console.log(res.data.data.errorResult)
                setLoadingSubmit(false)
                if (res.status === 201) {
                    setApiError(true)
                    setErrorMessage(res.data.data.errorResult)
                }
                if (res.status === 200) {
                    setOtpSend(true)
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

    const resetPassword = () => {
        setLoadingSubmit(true)
        axios.post("https://minddefttask.herokuapp.com/public/resetPassword", {
            email: userEmail,
            otp,
            password: newPassword
        })
            .then((res) => {
                setLoadingSubmit(false)
                console.log(res)
                console.log(res.data.data.errorResult)
                setLoadingSubmit(false)
                if (res.status === 201) {
                    setApiError(true)
                    setErrorMessage(res.data.data.errorResult)
                }
                if (res.status === 200) {
                    window.alert("Password resetted succesfully, login with new password")
                    navigate("/")
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

    const verifyCaptcha = (value) => {
        if (value) {
            setLoadingSubmit(false)
        }
    }


    return (
        <>
            <Card>
                <CardHeader>
                    No worries if you have forgot the password, we are here for you
                </CardHeader>
                <CardBody>
                    Kindly verify your account, we will send an otp to verify it's you.
                    <div style={{ width: "40%", margin: "0px auto" }}>
                        <Form>
                            <FormGroup>
                                <Label>Enter your registered email</Label>
                                <Input placeholder='abc@xyz.com' onChange={e => setUserEmail(e.target.value)} />
                                <div className='m-2'>
                                    {apiError ? <div style={{ color: "red" }}>Error : {errorMessage}</div> : null}
                                </div>
                                {otpSend ?
                                    <>
                                        <Label>Enter Otp</Label>
                                        <Input onChange={e => setOtp(e.target.value)} />
                                        <Label>Enter New Password</Label>
                                        <Input onChange={e => setNewPassword(e.target.value)} />
                                        <div className='my-1'>
                                             <Button onClick={resetPassword} color="primary" disabled={loadingSubmit}>Reset Password</Button> 
                                        </div>
                                    </>

                                    : <>
                                    <div className='my-2'>
                                    <ReCAPTCHA
                                            sitekey="6LeWoqkhAAAAANgW5c9ERjLoMtO_58922LdpAVFB"
                                            onChange={verifyCaptcha}
                                        />
                                    </div>
                                        
                                        <Button onClick={sendOtp} color="primary" disabled={loadingSubmit} >Send Otp</Button>
                                    </>}

                            </FormGroup>
                        </Form>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default ForgotPassword