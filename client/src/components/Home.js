import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, CardFooter } from "reactstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Home() {
    let navigate = useNavigate()

    const [formData, setFormData] = useState({})
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [apiError, setApiError] = useState(false)
    const [emailVerifyLeft, setEmailVerifyLeft] = useState(false)


    const submitAndLogin = () => {
        console.log(formData)

        axios.post("https://minddefttask.herokuapp.com/public/login", formData)
            .then((res) => {
                setLoadingSubmit(false)
                console.log(res)
                if (res.status === 201) {
                    setApiError(true)
                    setErrorMessage(res.data.data.errorResult)
                    if(res.data.data.errorResult === "Please verify email first"){
                        setEmailVerifyLeft(true)
                    }
                }
                if (res.status === 200) {
                    localStorage.setItem('token',res.data.data.successResult.token)
                    localStorage.setItem('userId',res.data.data.successResult.userId)
                    localStorage.setItem('name',res.data.data.successResult.name)
                    window.alert("login successful, redirecting to dashboard")
                    navigate("/dashboard")
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <Card>
                <CardHeader>Hello , Welcome to Harsh's Login Page</CardHeader>
                <CardBody>
                    Kindly Login to Start...
                    <div style={{ disply: "flex", flexDirection: "row", width: "40%", justifyContent: "center", alignItems: "center", margin: "20px auto" }}>
                        <Card className='p-5'>
                            <Form>
                                <FormGroup>
                                    <div className='my-2'>
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
                                        {emailVerifyLeft ? <Link to="/verifyEmail" > Click here to verify</Link> : null }
                                    </div>
                                    {loadingSubmit ? <Button onClick={submitAndLogin} color="primary" disabled>Login</Button> : <Button onClick={submitAndLogin} color="primary">Login</Button>}
                                </FormGroup>
                            </Form>
                            <div>
                                <Link to="/Signup">New Here? Click to register now</Link>
                            </div>

                            <div>
                                <Link to="/ForgotPassword">Forgot Password? Click to reset password</Link>

                            </div>
                        </Card>
                    </div>
                    <CardFooter>Developed By <a href='https://github.com/harsh-h-k'>Harsh Kesharwani</a></CardFooter>
                </CardBody>
            </Card>
        </div>

    )
}

export default Home