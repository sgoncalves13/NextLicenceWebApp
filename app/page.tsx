"use client"

import FormComp from "@/components/formComp";
import { motion } from "motion/react"
import { useState } from "react";
export default function Licence() {

    const [isNewLicence, setIsNewLicence] = useState(true);
    const [loading, setLoading] = useState(false);

    return (
    <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="relative flex mb-8 rounded-full bg-gray-200 p-1">
                <motion.div
                layout
                className="absolute top-0 bottom-0 rounded-full bg-white shadow"
                style={{
                    left: isNewLicence ? 0 : '50%',
                    width: '50%',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />

                <button
                className={`relative z-10 w-32 py-2 font-semibold transition-colors font-rethink ${
                    isNewLicence ? 'text-black' : 'text-gray-500'
                }`}
                onClick={() => setIsNewLicence(true)}
                disabled={loading}
                >
                Nueva
                </button>
                <button
                className={`relative z-10 w-32 py-2 font-semibold transition-colors ${
                    !isNewLicence ? 'text-black' : 'text-gray-500'
                }`}
                onClick={() => setIsNewLicence(false)}
                disabled={loading}
                >
                Vieja
                </button>
            </div>
            <FormComp isNew={isNewLicence} loading={loading} setLoading={setLoading} />
    </div>
    );
}