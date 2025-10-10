"use client";

import React, { useState, useRef } from "react";
import { Button, Input } from "@heroui/react";
import { motion } from "motion/react";
import ModalComp from "./ModalComp";
import ReCAPTCHA from "react-google-recaptcha";

type DynamicInputProps = {
    licenceId: string;
    setLicenceId: (val: string) => void;
    errors: string[];
    loading: boolean;
};

function BaseInput({
    className,
    isCenter,
    length,
    onChange,
    isLoadingOld
}: {
    className?: string;
    isCenter?: boolean;
    length?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoadingOld?: boolean;
}) {
    return (
        <Input
            variant="faded"
            size="md"
            maxLength={length}
            type="text"
            onChange={onChange}
            isDisabled={isLoadingOld}
            classNames={{
                inputWrapper: [
                    "shadow-sm",
                    "bg-default-200/100",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "cursor-text!",
                ],
                input: ["focus:outline-none", isCenter ? "text-center" : "text-left", "uppercase",],
            }}
            className={className}
        />
    );
}





type InputOldProps = {
    setLicenceIdOld: (val: string) => void;
    isLoadingOld?: boolean;
};

function InputOld({ setLicenceIdOld, isLoadingOld }: InputOldProps) {
    const [parts, setParts] = useState(Array(5).fill(""));

    const handlePartChange = (index: number, value: string) => {
        const newParts = [...parts];
        const upperVal = value.toUpperCase();
        newParts[index] = upperVal;


        setParts(newParts);

        const concatenated = newParts.join("-");
        setLicenceIdOld(concatenated);
    };

    return (
        <div className="w-full items-center">
            <div className="flex gap-3 items-center justify-center w-full">
                <BaseInput
                    className="w-[65%]"
                    length={7}
                    isLoadingOld={isLoadingOld}
                    onChange={(e) => handlePartChange(0, e.target.value)}
                />
                -
                <BaseInput
                    className="w-[50%]"
                    length={4}
                    isLoadingOld={isLoadingOld}
                    onChange={(e) => handlePartChange(1, e.target.value)}
                />
                -
                <BaseInput
                    className="w-[30%]"
                    length={1}
                    isCenter
                    isLoadingOld={isLoadingOld}
                    onChange={(e) => handlePartChange(2, e.target.value)}
                />
                -
                <BaseInput
                    className="w-[50%]"
                    length={4}
                    isLoadingOld={isLoadingOld}
                    onChange={(e) => handlePartChange(3, e.target.value)}
                />
                -
                <BaseInput
                    className="w-[40%]"
                    length={2}
                    isCenter
                    isLoadingOld={isLoadingOld}
                    onChange={(e) => handlePartChange(4, e.target.value)}
                />
            </div>
        </div>
    );
}



function InputNew({ licenceId, setLicenceId, errors, loading }: DynamicInputProps) {

    return (
        <Input
            label="Licencia familia 9"
            labelPlacement="outside-top"
            variant="faded"
            name="licencia"
            type="text"
            isClearable
            maxLength={12}
            minLength={12}
            isInvalid={errors.length > 0}
            isDisabled={loading}
            onChange={(e) => setLicenceId(e.target.value.toUpperCase())}
            onClear={() => setLicenceId("")}
            size="md"
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

type LicenceButtonProps = {
    loading: boolean;
    errors: string[];
    captchaCompleted: boolean;
    onSubmit: () => void;
    text: string;
    otherLoading?: boolean
};

function LicenceButton({ loading, errors, captchaCompleted, onSubmit, text, otherLoading }: LicenceButtonProps) {
    return (
        <Button
            color="primary"
            variant="shadow"
            isLoading={loading}
            size="lg"
            isDisabled={errors.length > 0 || !captchaCompleted || otherLoading}
            onPress={onSubmit}
        >
            {text}
        </Button>
    );
}



export default function Form() {
    const [licenceId, setLicenceId] = useState<string>("");
    const [licenceIdOld, setLicenceIdOld] = useState<string>("");
    const [licenceInfo, setLicenceInfo] = useState<any>(null);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [captchaCompleted, setCaptchacompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingOld, setLoadingOld] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const errors: string[] = [];
    if (licenceId.length !== 12) errors.push("La longitud de la licencia debe ser de 12 caracteres");
    if (!/^[A-F0-9]*$/.test(licenceId)) errors.push("Solo debe contener números y letras [A-F]");

    const oldErrors: string[] = [];
    const patternOld = /^(AAN|ACA|ACE|AED|AEX|ALL|AOC|AOR|CAN|CCA|CCB|CCE|CEX|CFL|CLL|COC|COR|CRD|IAN|ICA|ICE|IEX|ILL|IOC|IOR|RCA)[0-9]{4}-[A-Z0-9]{4}-[1345]-(AD70|AD75|AD80|AD88|CO30|CO32|CO33|CO37|NO20|NO21|NO22|NO27|PV20|PV23)-(1|3|5|10|20|OP)$/;

    if (!patternOld.test(licenceIdOld)) oldErrors.push("No cumple con el formato valido");

    const endpoint = `/api/getLicences?Id=${licenceId}`;
    const endpointOld = `/api/getLicencesOld?Id=${licenceIdOld}`;

    const GetLicenceInfo = async (endpoint: string, captchaToken: string, isNew: boolean) => {
        try {
            const response = await fetch(`${endpoint}&captchaToken=${captchaToken}`);
            const licence_info = await response.json();
            setLicenceInfo(licence_info);
        } catch (error: any) {
            setLicenceInfo({ error: error.message });
        } finally {
            setShowModalDetail(true);
            isNew ? setLoading(false) : setLoadingOld(false);
            recaptchaRef.current?.reset();
            setCaptchacompleted(false);
        }
    };


    const onSubmit = (endpoint: string, isNew: boolean) => {
        const token = recaptchaRef.current?.getValue();
        if (token) {
            GetLicenceInfo(endpoint, token, isNew);
            isNew ? setLoading(true) : setLoadingOld(true);
        } else {
            alert("Por favor completa el CAPTCHA antes de enviar el formulario.");
        }
    };



    return (
        <div className="w-8/10 h-8/10 md:w-7/12 md:h-7/10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white/45 rounded-4xl shadow-xl/30 backdrop-filter backdrop-blur-md bg-opacity-10 w-full h-full flex flex-col gap-1 md:gap-10 items-center justify-center p-[5%]"
            >
                <div className="w-full max-w-[100%] md:max-w-[85%] flex items-center justify-center flex-col gap-5">
                    <div className="w-full flex flex-col lg:flex-row gap-3 justify-center items-center">
                        <InputNew
                            licenceId={licenceId}
                            setLicenceId={setLicenceId}
                            errors={errors}
                            loading={loading}
                        />
                        <LicenceButton
                            loading={loading}
                            errors={errors}
                            captchaCompleted={captchaCompleted}
                            onSubmit={() =>onSubmit(endpoint, true)}
                            text="Consultar"
                            otherLoading={loadingOld}
                        />
                    </div>
                    <div className="w-full text-left">
                        <label className="text-small">Licencia familia 2K8 y 2KDoce</label>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-3 justify-center items-center">
                        <InputOld
                            setLicenceIdOld={setLicenceIdOld}
                            isLoadingOld={loadingOld}
                        />
                        <LicenceButton
                            loading={loadingOld}
                            errors={oldErrors}
                            captchaCompleted={captchaCompleted}
                            onSubmit={() =>onSubmit(endpointOld, false)}
                            text="Consultar"
                            otherLoading={loading}
                        />
                    </div>

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
                </div>

                {showModalDetail && <ModalComp licence_info={licenceInfo} onClose={() => setShowModalDetail(false)} />}
            </motion.div>
        </div>
    );
}
