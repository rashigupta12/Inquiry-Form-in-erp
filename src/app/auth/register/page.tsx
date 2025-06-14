import RegisterForm from "@/components/form/auth/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className=" flex items-center">
      <div className="flex-grow bg-gradient-to-r from-emerald-500 to-blue-500 ">
        <RegisterForm text="Register to get started" role={"SALES_REP"} />
      </div>
    </div>
  );
}

export default RegisterPage;
