"use client";

import React, { useState, useRef  } from "react";
import {Button, Input } from "@heroui/react";
import { motion } from "motion/react"
import ModalComp from "./ModalComp";
import ReCAPTCHA from 'react-google-recaptcha';



export default function Form() {
    const [licenceId, setLicenceId] = React.useState <string>("");

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [licenceInfo, setLicenceInfo] = useState(null);

    const [showModalDetail, setShowModalDetail] = useState(false);

    const [captchaCompleted, setCaptchacompleted] = useState(false);

    const [loading, SetLoading] = useState(false);

    const errors: any[] = [];

    const endpoint = `https://erei74m8ye.execute-api.us-east-1.amazonaws.com/v1/getLicence?Id=${licenceId}`;

    const GetLicenceInfo = async (endpoint: string) => {
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                    },
                });
            
            const licence_info = await response.json();

            setLicenceInfo(licence_info);
        } catch (error: any) {
            const err: any = {error: error.message}
            setLicenceInfo(err);
        }
        finally {
            setShowModalDetail(true);
            SetLoading(false);
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setCaptchacompleted(false);
            }
        }
    }
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        GetLicenceInfo(endpoint);
        SetLoading(true);
  };

    if(licenceId.length !== 12) errors.push("La longitud de la licencia debe ser de 12");

    if(licenceId.match(/^[A-F0-9]*$/) ? false : true) errors.push("Solo debe contener números y letras [A-F]")

    return (
        <motion.div initial={{ opacity: 0, scale: 0, transform: "translateY(200px)"  }} animate={{ opacity: 1, scale: 1, transform: "translateY(0px)"  }} transition={{ type: "spring" }} className = " bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 rounded-xl w-8/10 h-9/10 md:w-5/10 md:h-7/10 shadow-xl/30 flex flex-col gap-1 md:gap-10 items-center justify-center p-[5%]">
            <h1 className="text-center font-bold text-medium md:text-2xl">Ingresa el número de la licencia para consultarla</h1>
            <form className="w-full max-w-xs flex items-center justify-center flex-col gap-1 md:gap-5" onSubmit={onSubmit}>
            <Input
                label="Licencia"
                labelPlacement="outside"
                variant="faded"
                name="licencia"
                type="text"
                isClearable
                maxLength={12}
                isInvalid = {errors.length > 0 || !captchaCompleted}
                isDisabled = {loading}
                onChange={(e) => setLicenceId(e.target.value.toUpperCase())}
                onClear={() => setLicenceId("")}
                size="lg"
                value = {licenceId}
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
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "cursor-text!",
                ]
                }}
            />
            <ReCAPTCHA
                sitekey="6LfTG2grAAAAAPdyw1vlBJGfZSyv_j_mMTKfogHc"
                onChange={() => setCaptchacompleted(true)}
                onExpired={() => setCaptchacompleted(false)}
                ref={recaptchaRef}
                size="compact"
            />
            {!captchaCompleted && (
            <p className="text-red-600 text-sm font-semibold">
                Debes completar el CAPTCHA antes de consultar.
            </p>)}
            <Button color="primary" type="submit" variant="shadow" isLoading = {loading} size="lg" isDisabled ={errors.length > 0 || !captchaCompleted}>
                Consultar
            </Button>
            </form>
        {showModalDetail && (
            <ModalComp licence_info={licenceInfo} onClose={() => {setShowModalDetail(false)}}></ModalComp>
        )}
        </motion.div>
    );
}