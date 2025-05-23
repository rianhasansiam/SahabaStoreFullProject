import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../../assets/img/bg-img.jpg';
import { contextData } from '../../Contex';
import { onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // ✅ FIXED: imported missing Firebase methods
import auth from './Firebase';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { usePostData } from '../../hooks/usePostData';

const Login = () => {
  const { googleLogReg, redirectPath } = useContext(contextData); // ✅ use only from context
  const { mutate } = usePostData('/userData');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ FIXED: added isLoading state

  const navigate = useNavigate();

  // Submit login form
  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          navigate(redirectPath);
        } else {
          console.log('user nai vai login error');
        }
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Something is Wrong',
          text: 'Login Failed',
          confirmButtonText: 'OK',
        });
      });
  };

  // Google login handler
  const handleGoogleModalSubmit = async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider(); // ✅ FIXED: moved inside this function
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ FIXED: removed undefined phone
      
              const userData = {
        email: user.email,
        phone: user.phone || '',
        displayName: user.displayName || '',
        uid: user.uid,
      };
      
              mutate(userData, {
                onSuccess: () => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  navigate('/');
                },
                onError: (error) => {
                  Swal.fire({ icon: 'error', title: 'Post Error', text: error.message });
                },
              });



      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      Swal.fire({ icon: 'error', title: 'Google Sign-in Failed', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(redirectPath);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="login container mx-auto flex flex-col lg:flex-row justify-center gap-20 my-10">
      {/* LOGIN ACCESS */}
      <div className="login__access w-[90vw] !lg:w-[40%] max-sm:mx-auto">
        <h1 className="text-2xl my-4 text-center font-semibold">Log in to your account.</h1>

        <div className="login__area lg:w-[100%]">
          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__content">
              {/* Email Field */}
              <div className="login__box bg-gray-100 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="login__input w-full p-3 rounded"
                />
                <label className="login__label absolute left-3 top-7 text-sm text-gray-600">Email</label>
              </div>

              {/* Password Field */}
              <div className="login__box bg-gray-100 my-8 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="login__input w-full p-3 rounded pr-10"
                />
                <label className="login__label absolute left-3 top-7 text-sm text-gray-600">Password</label>
                <div
                  className="absolute right-7 top-[50%] translate-y-[-50%] text-gray-600 cursor-pointer z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* <Link to="#" className="text-right block hover:text-[#22874b] hover:font-semibold underline">
              Forgot your password?
            </Link> */}

            <button type="submit" className="login__button bg-[#22874b] text-white py-2 w-full rounded mt-4">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Social Login */}
          <div className="login__social mt-6">
            <p className="text-center font-semibold">Or login with</p>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleGoogleModalSubmit}
                className="login__button bg-gray-200 py-3 px-5 flex items-center gap-2 rounded hover:bg-gray-300"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  alt="Google login"
                  className="w-6"
                />
                <span>Google</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-right mt-4">
            Don't have an account?
            <Link to="/register" className="underline hover:text-[#22874b] hover:font-semibold ml-1">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* LOGIN IMAGE */}
      <div className="lg:w-[100%] w-[90vw] max-sm:mx-auto rounded-xl  lg:rounded-r-3xl overflow-hidden">
        <img className="h-full w-full" src={bgImg} alt="Login Background" />
      </div>
    </div>
  );
};

export default Login;
