"use client"

import FormComp from "@/components/formComp";
import { motion } from "motion/react"
import { useState } from "react";
export default function Licence() {

    const [isNewLicence, setIsNewLicence] = useState(true);

    return (
    <div className="w-full h-full flex flex-col justify-center items-center">
            <FormComp />
    </div>
    );
}