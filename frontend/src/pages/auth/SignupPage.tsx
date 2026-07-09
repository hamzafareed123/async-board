import AuthForm from "../../components/forms/AuthForm";

const SignupPage = () => {
  const handleSignup = async (values: { name?: string; email: string; password: string }) => {
    console.log('signing up', values)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <AuthForm mode="signup" onSubmit={handleSignup} />
    </div>
  )
}

export default SignupPage