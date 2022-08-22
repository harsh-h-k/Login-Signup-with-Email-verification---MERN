import React, { useEffect } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, CardFooter } from "reactstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Dashboard() {

    const token = localStorage.getItem('token')
    let navigate = useNavigate()

    const logout = () => {
        axios.post("https://minddefttask.herokuapp.com/user/logout",{},{
            headers : { Authorization: `Bearer ${token}`}
        })
        .then((res) => {
            console.log(res)
            if (res.status === 200) {
                localStorage.clear()
                navigate("/login")
                window.location.reload()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }


  return (
    <Card>
        <CardBody>
            <CardHeader>
                Hello {localStorage.getItem('name')} , I hope you are fine
            </CardHeader>
            <div className='m-5'>

            <Button color='primary' onClick={logout}>Logout</Button>
            </div>
            <CardFooter>Developed By <a href='https://github.com/harsh-h-k'>Harsh Kesharwani</a></CardFooter>
        </CardBody>
    </Card>
  )
}

export default Dashboard