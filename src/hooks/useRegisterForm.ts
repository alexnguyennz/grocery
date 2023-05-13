import { useForm } from "@mantine/form";

export default function useRegisterForm() {
  return useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length <= 0) return "Enter your password";
        if (value.length < 6) return "Password should be at least 6 characters";
      },
      confirmPassword: (value, values) => {
        if (value.length <= 0) return "Re-enter your password";
        if (value !== values.password) return "Passwords do not match";
      },
    },
  });
}
