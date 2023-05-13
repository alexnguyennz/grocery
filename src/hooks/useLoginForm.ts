import { useForm } from "@mantine/form";

export default function useLoginForm() {
  return useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 0 ? null : "Enter your password"),
    },
  });
}
