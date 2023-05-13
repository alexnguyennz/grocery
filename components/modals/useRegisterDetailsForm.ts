import { useForm } from "@mantine/form";

export default function useRegisterDetailsForm() {
  return useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: null,
    },
    validate: {
      firstName: (value) => (value.length > 0 ? null : "Enter your first name"),
      lastName: (value) => (value.length > 0 ? null : "Enter your last name"),
      phoneNumber: (value) =>
        value.length > 0 ? null : "Enter your phone number",
      dateOfBirth: (value) => (value ? null : "Enter your date of birth"),
    },
  });
}
