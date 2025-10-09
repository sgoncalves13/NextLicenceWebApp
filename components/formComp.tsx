"use client";

import React, { useState, useRef } from "react";
import { Button, Input } from "@heroui/react";
import { AnimatePresence, motion } from "motion/react";
import ModalComp from "./ModalComp";
import ReCAPTCHA from "react-google-recaptcha";

type DynamicInputProps = {
    isNew: boolean;
    licenceId: string;
    setLicenceId: (val: string) => void;
    errors: string[];
    loading: boolean;
    captchaCompleted: boolean;
};

function DynamicInput({ isNew, licenceId, setLicenceId, errors, loading, captchaCompleted }: DynamicInputProps) {
    if (isNew) {
        return (
            <Input
                label="Número de licencia"
                labelPlacement="outside"
                variant="faded"
                name="licencia"
                type="text"
                isClearable
                maxLength={12}
                minLength={12}
                isInvalid={errors.length > 0 || !captchaCompleted}
                isDisabled={loading}
                onChange={(e) => setLicenceId(e.target.value.toUpperCase())}
                onClear={() => setLicenceId("")}
                size="lg"
                value={licenceId}
                errorMessage={() => (
                    <ul>
                        {errors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                )}
                classNames={{
                    inputWrapper: [
                        "shadow-sm",
                        "bg-default-200/100",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "cursor-text!",
                    ],
                    input: [
                        "focus:outline-none",
                    ]
                }}
                className="font-rethink"
            />
        );
    }

    return (
        <div className="flex gap-[2%] text-center justify-center items-center">
            <Input></Input> -
            <Input></Input> -
            <Input></Input> -
            <Input></Input>
        </div>
    );
}

type FormProps = {
    isNew: boolean;
};

export default function Form({ isNew }: FormProps) {
    const [licenceId, setLicenceId] = useState<string>("");
    const [licenceInfo, setLicenceInfo] = useState<any>(null);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [captchaCompleted, setCaptchacompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const errors: string[] = [];
    if (licenceId.length !== 12) errors.push("La longitud de la licencia debe ser de 12");
    if (!/^[A-F0-9]*$/.test(licenceId)) errors.push("Solo debe contener números y letras [A-F]");

    const endpoint = `/api/getLicences?Id=${licenceId}`;

    const GetLicenceInfo = async (endpoint: string, captchaToken: string) => {
        try {
            const response = await fetch(`${endpoint}&captchaToken=${captchaToken}`);
            const licence_info = await response.json();
            setLicenceInfo(licence_info);
        } catch (error: any) {
            setLicenceInfo({ error: error.message });
        } finally {
            setShowModalDetail(true);
            setLoading(false);
            recaptchaRef.current?.reset();
            setCaptchacompleted(false);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = recaptchaRef.current?.getValue();
        if (token) {
            GetLicenceInfo(endpoint, token);
            setLoading(true);
        } else {
            alert("Por favor completa el CAPTCHA antes de enviar el formulario.");
        }
    };

    return (
        <div className="w-8/10 h-8/10 md:w-7/12 md:h-7/10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isNew ? "new" : "old"}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white/45 rounded-4xl shadow-xl/30 backdrop-filter backdrop-blur-md w-full h-full flex flex-col gap-1 md:gap-10 items-center justify-center p-[5%]"
                >
                    <form className="w-full max-w-100 flex items-center justify-center flex-col gap-5" onSubmit={onSubmit}>
                        <DynamicInput isNew={isNew} licenceId={licenceId} setLicenceId={setLicenceId} errors={errors} loading={loading} captchaCompleted={captchaCompleted} />

                        <ReCAPTCHA
                            sitekey="6LfTG2grAAAAAPdyw1vlBJGfZSyv_j_mMTKfogHc"
                            onChange={() => setCaptchacompleted(true)}
                            onExpired={() => setCaptchacompleted(false)}
                            ref={recaptchaRef}
                            size="compact"
                        />

                        {!captchaCompleted && (
                            <p className="text-red-600 text-sm font-semibold text-center">
                                Debes completar el CAPTCHA antes de consultar.
                            </p>
                        )}

                        <Button
                            color="primary"
                            type="submit"
                            variant="shadow"
                            isLoading={loading}
                            size="lg"
                            isDisabled={errors.length > 0 || !captchaCompleted}
                        >
                            Consultar
                        </Button>
                    </form>

                    {showModalDetail && <ModalComp licence_info={licenceInfo} onClose={() => setShowModalDetail(false)} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
