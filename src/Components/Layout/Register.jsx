import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import './login.css';
function Register() {
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [user, setuser] = useState([]);
    const [userGG, setuserGG] = useState([])
    useEffect(() => {
        const fetchuser = async () => {
            try {
                const response = await fetch('http://localhost:3000/user')
                const data = await response.json();
                setuser(data);
            } catch (error) {
                console.error('Error fetch', error);
            }
        }
        fetchuser()
    }, [])
    useEffect(() => {
        const fetchuserGG = async () => {
            try {
                const response = await fetch('http://localhost:3000/user/userGG')
                const data = await response.json();
                setuserGG(data);
            } catch (error) {
                console.error('Error fetch', error);
            }
        }
        fetchuserGG()
    }, [])
    const handleLoginError = () => {
        console.log("Login failed");
    };

    const handleLoginSuccess = async (credentialResponse) => {
        const credential = credentialResponse.credential;
        if (credential) {
            const decodedToken = jwtDecode(credential);
            // console.log(decodedToken.name, decodedToken.email);
            const Name = decodedToken.name
            const Email = decodedToken.email
            console.log(typeof(Name), Email);
            console.log(decodedToken);
            try {
                const response = await fetch('http://localhost:3000/user/addUserGG', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({Name,Email}),
                });
                if (response.ok) {
                    console.log("thanh cong");
                    navigate('/')

                } else {
                    navigate('/')
                }
            } catch (error) {
                console.error('Error adding product:', error);
            }
        }
    };
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
    console.log(watch("example"))
    const onSubmit = async (data) => {
        // console.log(data);

        try {
            const response = await fetch('http://localhost:3000/user/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log("thanh cong");
                navigate('/login')

            } else {
                // Xử lý lỗi
                console.error('Error adding product:', await response.json());
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }
    return (
        <>
            <body className='body'>
                <div className="login-container">
                    <div className="login-card">
                        <h2 className="login-header">
                            Welcome Back
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                            <div className="form-group">
                                <label htmlFor="Name">
                                    Name
                                </label>
                                <input
                                    className="form-control"
                                    id="Name"
                                    required
                                    type="Name"
                                    {...register("Name")}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Phone">
                                    Phone
                                </label>
                                <input
                                    className="form-control"
                                    id="Phone"
                                    required
                                    type="Phone"
                                    {...register("Phone")}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="form-control"
                                    id="email"
                                    required
                                    type="email"
                                    {...register("Email")}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    id="password"
                                    required
                                    type="password"
                                    {...register("Password")}
                                />
                            </div>
                            <button
                                className="login-btn"
                                type="submit"
                            >
                                Login
                            </button>
                            {showNotification && (
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: '#FF0000',
                                        color: 'white',
                                        padding: '20px',
                                        borderRadius: '5px',
                                        zIndex: 9999,
                                    }}
                                >
                                    <p>Email này đã tồn tại</p>
                                </div>
                            )}
                            <div className="login_container">
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={handleLoginError}
                                    // magin_left ="30"
                                    shape="circle"  // Hiển thị logo Google mà không có văn bản
                                    logo_alignment="center"  // Căn chỉnh logo Google ở giữa
                                    text="signin_with"  // Hoặc sử dụng "signin_with" để chỉ hiển thị logo mà không có địa chỉ email
                                    width="50"  // Điều chỉnh kích thước nút
                                    className="custom_google_login"
                                />
                            </div>


                        </form>
                        <p className="signup-link">
                            Bạn không có tài khoản ?{' '}
                            <a>
                                Sign up
                            </a>
                        </p>
                        <p className="signup-link">
                            <a>
                                Bạn quên tài khoản ?
                            </a>
                        </p>
                    </div>
                </div>
            </body>
        </>
    );
}

export default Register;