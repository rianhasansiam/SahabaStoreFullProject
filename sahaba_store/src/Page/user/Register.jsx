import React, { useEffect, useState } from 'react';
import bgImg from '../../assets/img/bg-img.jpg';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import auth from './Firebase';
import { usePostData } from '../../hooks/usePostData';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { mutate } = usePostData('/userData');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Use at least 6 chars, one uppercase and one special character.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Mismatch',
        text: 'Passwords do not match',
      });
      return;
    }

    const name = `${firstName} ${lastName}`;
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: name });

        const userData = {
          email,
          phone,
          displayName: name,
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

        
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Auth Error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Auth
  const provider = new GoogleAuthProvider();

  const googleLogReg = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        email: user.email,
        phone,
        displayName: user.displayName,
        uid: user.uid,
      };

      mutate(userData, {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/');
        },
        onError: (error) => {
          Swal.fire({ icon: 'error', title: 'Post Error', text: error.message });
        },
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      Swal.fire({ icon: 'error', title: 'Google Sign-in Failed', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleModalSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Phone Required',
        text: 'Please enter a valid phone number.',
      });
      return;
    }
    document.getElementById('my_modal_5').close();
    googleLogReg();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) navigate('/');
      if (!user) console.log('No user logged in');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="login container mx-auto flex flex-col lg:flex-row justify-center gap-20 my-10">
      {/* Image */}
      <div className="lg:w-[100%] w-[90vw] max-sm:mx-auto  rounded-xl  lg:rounded-l-3xl overflow-hidden">
        <img className="h-full w-full" src={bgImg} alt="Register background" />
      </div>

      {/* Form */}
      <div className="login__access w-[90vw] max-sm:mx-auto !lg:w-[40%]">
        <h1 className="text-2xl my-6 text-center font-semibold">Create your account.</h1>
        <div className="login__area ">
          <form className="login__form" onSubmit={handleRegister}>
            <div className="login__content">
              <div className="flex justify-between">
                <div className="login__box bg-gray-100 mb-4 w-[48%]">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="register__label ml-4">First Name</label>
                </div>
                <div className="login__box bg-gray-100 mb-4 w-[48%]">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="register__label ml-4">Last Name</label>
                </div>
              </div>

              <div className="login__box bg-gray-100 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  className="login__input"
                />
                <label className="register__label ml-4">Email</label>
              </div>

              <div className="login__box bg-gray-100 mb-4">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder=" "
                  className="login__input"
                  pattern="[0-9]{10,15}"
                />
                <label className="register__label ml-4">Phone</label>
              </div>

              <div className="login__box bg-gray-100 mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=" "
                  className="login__input"
                />
                <label className="register__label ml-4">Password</label>
              </div>

              <div className="login__box bg-gray-100 mb-6">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder=" "
                  className="login__input"
                />
                <label className="register__label ml-4">Confirm Password</label>
              </div>

              <button type="submit" className="login__button !my-0" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          {/* Social Login */}
          <div className="login__social my-6">
            <p className="text-center font-semibold">Or register with</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => document.getElementById('my_modal_5').showModal()}
                className="login__button !bg-gray-200 !py-4 !my-0"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  alt="Google login"
                  className="w-10"
                />
              </button>
            </div>
          </div>

          <p className="text-right">
            Already have an account?
            <Link to="/login" className="underline hover:text-[#22874b] hover:font-semibold ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-3 text-center">
            Enter your phone number to continue.
          </h3>
          <form onSubmit={handleGoogleModalSubmit}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder=" "
              className="login__input !bg-gray-100"
              pattern="[0-9]{10,15}"
            />
            <label className="register__label absolute left-10 top-20 !font-semibold">Phone</label>
            <div className="modal-action mt-4">
              <button type="submit" className="btn bg-[#22874b] text-white w-20">
                OK
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Register;
