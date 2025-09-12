interface Option {
    value: string | number;
    label: string;
}

export const roleOptions: Option[] = [
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Customer" },
    { value: "partner", label: "Partner" },
    { value: "staff", label: "Staff" },
];

export const isActiveOptions: Option[] = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
];

export const isVerifiedOptions: Option[] = [
    { value: "true", label: "Verified" },
    { value: "false", label: "Unverified" },
];