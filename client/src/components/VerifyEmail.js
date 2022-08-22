import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, CardFooter } from "reactstrap"
import { Link } from "react-router-dom"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function VerifyEmail() {

    let navigate = useNavigate()

    const [userEmail, setUserEmail] = useState()
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [apiError, setApiError] = useState(false)
    const [otp, setOtp] = useState()

    const verifyOtp = () => {
        console.log(otp)
        axios.post("https://minddefttask.herokuapp.com/public/verifyEmail", {
            email: userEmail,
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
            email: userEmail,
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

                    Enter your registered email and received otp
                    <br />
                    Note : Otp is Valid for only 24hrs
                    <div style={{ margin: "20px 0px", width: "40%", margin: "0px auto" }}>
                        <Form>
                            <FormGroup>
                                <Label>Email Address</Label>
                                <Input onChange={e => setUserEmail(e.target.value)} />
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

                    <CardFooter>Developed By <a href='https://github.com/harsh-h-k'>Harsh Kesharwani</a></CardFooter>
                </CardBody>
            </Card>
        </div>

    )
}

export default VerifyEmail