import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, CardFooter } from "reactstrap"
import { Link } from "react-router-dom"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha";


function Signup() {

    let navigate = useNavigate()

    const [formData, setFormData] = useState({})
    const [loadingSubmit, setLoadingSubmit] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [apiError, setApiError] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [otp, setOtp] = useState()

    const registerUser = () => {
        console.log(formData)
        setLoadingSubmit(true)
        setApiError(false)
        axios.post("https://minddefttask.herokuapp.com/public/registerUser", formData)
            .then((res) => {
                console.log(res)
                console.log(res.data.data.errorResult)
                setLoadingSubmit(false)
                if (res.status === 201) {
                    setApiError(true)
                    setErrorMessage(res.data.data.errorResult)
                }
                if (res.status === 200) {
                    setRegistered(true)
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


    const verifyOtp = () => {
        console.log(otp)
        axios.post("https://minddefttask.herokuapp.com/public/verifyEmail", {
            email: formData.email,
            type: "signup",
            otp
        })
            .then((res) => {
                console.log(res)
                console.log(res.data.data.errorResult)
                setLoadingSubmit(false)
                if (res.status === 201) {
                    setApiError(true)
                    setErrorMessage(res.data.data.errorResult)
                }
                if (res.status === 200) {
                    window.alert("You have successfully registered, Kindly login!")
                    navigate("/")
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

    const resendOtp = () => {
        axios.post("https://minddefttask.herokuapp.com/public/resendOtp", {
            email: formData.email,
            type: "signup"
        })
            .then((res) => {
                console.log(res)
                setLoadingSubmit(false)
                if (res.status === 200) {
                    window.alert("Otp Resended")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <Card>
                <CardHeader>New Here, No worries... register now!</CardHeader>
                <CardBody>
                    {registered ? <>
                        Congrats ! You have successfully registered. Kindly Visit your email : {formData.email} and Enter the Otp below.
                        <br />
                        Note : Otp is Valid for only 24hrs
                        <div style={{ margin: "20px 0px", width: "40%", margin: "0px auto" }}>
                            <Form>
                                <FormGroup>
                                    <Label>Otp</Label>
                                    <Input onChange={e => setOtp(e.target.value)} />
                                    <div className='m-2'>
                                        {apiError ? <div style={{ color: "red" }}>Error : {errorMessage}</div> : null}
                                    </div>

                                    {loadingSubmit ? <Button onClick={verifyOtp} color="primary" disabled>Verify Otp</Button> : <Button onClick={verifyOtp} color="primary">Verify Otp</Button>}
                                    <div className='m-2'>
                                        Note : It takes 10-15 seconds for getting mail.
                                        Didn't received any mail? <Button className='my-1' outline color='primary' onClick={resendOtp}>resend Otp</Button>
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </> : <>
                        Kindly Fill the details and register now...
                        <div style={{ disply: "flex", flexDirection: "row", width: "40%", justifyContent: "center", alignItems: "center", margin: "20px auto" }}>
                            <Card className='p-5'>
                                <Form>
                                    <FormGroup>
                                        <div className='my-2'>

                                            <div className='my-2'>
                                                <Label>Your Name</Label>
                                                <Input onChange={e => setFormData({
                                                    ...formData,
                                                    name: e.target.value
                                                })} />
                                            </div>
                                            <Label>Email</Label>
                                            <Input onChange={e => setFormData({
                                                ...formData,
                                                email: e.target.value
                                            })} />
                                        </div>

                                        <div className='my-2'>
                                            <Label>Password</Label>
                                            <Input type='password' onChange={e => setFormData({
                                                ...formData,
                                                password: e.target.value
                                            })} />
                                        </div>
                                        <div className='m-2'>
                                            {apiError ? <div style={{ color: "red" }}>Error : {errorMessage}</div> : null}
                                        </div>

                                        <ReCAPTCHA
                                            sitekey="6LeWoqkhAAAAANgW5c9ERjLoMtO_58922LdpAVFB"
                                            onChange={verifyCaptcha}
                                        />

                                        <Button onClick={registerUser} color="primary" disabled={loadingSubmit}>Signup</Button> 

                                    </FormGroup>
                                </Form>
                                <div>
                                    <Link to="/">Already Registered? Login Now</Link>
                                </div>

                            </Card>
                        </div>
                    </>}

                    <CardFooter>Developed By <a href='https://github.com/harsh-h-k'>Harsh Kesharwani</a></CardFooter>
                </CardBody>
            </Card>
        </div>

    )
}

export default Signup