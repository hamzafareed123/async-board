import AuthForm from "../../components/forms/AuthForm";

const LoginPage = () => {
  const handleLogin = async (values: { email: string; password: string }) => {
    // call your login API here
    console.log('logging in', values)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <AuthForm mode="login" onSubmit={handleLogin} />
    </div>
  )
}

export default LoginPage