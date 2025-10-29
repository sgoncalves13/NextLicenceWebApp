import { motion } from "motion/react"

interface LicenceInfoType {
    [key: string]: any;
    error?: string;
}

interface ModalCompProps {
    licence_info: LicenceInfoType | null;
    onClose: () => void;
    status?: number | null;
    errors?: string[];
}

export default function ModalComp({ licence_info, onClose, status, errors }: ModalCompProps) {

    // Si hay errores, mostrarlos en el modal en forma del lista

    if (errors && errors.length > 0) {
        return (
            <motion.div initial={{ y: "5%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-5%", opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
                <div
                    className="bg-gray-900/70 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md p-8 shadow-xl max-w-lg w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >

                    <h1 className="text-2xl font-bold mb-4 text-white">Licencia NO válida:</h1>
                    <div className="text-center gap-3 flex flex-col">
                        {errors.map((error, i) => (
                            <p className="mb-2 text-white" key={i}>{error}</p>
                        ))}
                    </div>


                    <button
                        className="absolute top-3 right-3 text-white hover:text-red-400 text-3xl font-light leading-none"
                        aria-label="Cerrar"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </motion.div>
        );
    }

    // Ya aqui no hay errores, por lo que se llamo al API y se tiene una respuesta
    if (!licence_info) return null;

    const { error, ...fields } = licence_info;

    const fieldCount = Object.keys(fields).length;

    // Si el status es 404, mostrar mensaje de licencia no en encontrada
    if (status === 404) {
        return (
            <motion.div initial={{ y: "5%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-5%", opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
                <div
                    className="bg-gray-900/70 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md p-8 shadow-xl max-w-lg w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h1 className="text-2xl font-bold mb-4 text-white">Licencia NO válida:</h1>
                    <p className="mb-2 text-white text-center">{licence_info.error}</p>
                    <button
                        className="absolute top-3 right-3 text-white hover:text-red-400 text-3xl font-light leading-none"
                        aria-label="Cerrar"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </motion.div>
        );
    }

    // Si el status es otro diferente de 200, mostrar mensaje de error generico
    else if (status && status !== 200) {
        return (
            <motion.div initial={{ y: "5%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-5%", opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
                <div
                    className="bg-gray-900/70 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md p-8 shadow-xl max-w-lg w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h1 className="text-2xl font-bold mb-4 text-white">Error al cargar la información de la licencia ({status}):</h1>
                    <p className="mt-2 text-xl">Error: {licence_info.error}</p>

                    <button
                        className="absolute top-3 right-3 text-white hover:text-red-400 text-3xl font-light leading-none"
                        aria-label="Cerrar"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </motion.div>
        );
    }

    const formatDescription = (desc: string) => {
        let result = [];
        let parts = desc.split(', ');
        result.push(parts[0] + ", " + parts[1]);

        const formatAAMM = (text: string) => {
            const match = text.match(/(\d{4})(?!.*\d)/);
            if (match) {
                const aamm = match[1];
                const formatted = aamm.slice(0, 2) + '/' + aamm.slice(2);
                return text.replace(aamm, formatted);
            }
            return text;
        };

        if (parts[2] && parts[2].includes("AAMM")) {
            parts[2] = parts[2].replace("Expira AAMM:", "Expira Año/Mes (AAMM):");
            parts[2] = formatAAMM(parts[2]);
            result.push(parts[2]);
        } else if (parts[2]) {
            result.push(parts[2]);
        }

        if (parts[3] && parts[3].includes("AAMM")) {
            parts[3] = parts[3].replace("Expira AAMM:", "Expira Año/Mes (AAMM):");
            parts[3] = formatAAMM(parts[3]);
            result.push(parts[3]);
        } else if (parts[3]) {
            result.push(parts[3]);
        }

        return result;
    };


    let licence_description = formatDescription(licence_info.DescProducto);

    // Si el status es 200, mostrar la informacion de la licencia
    return (
        <motion.div initial={{ y: "5%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-5%", opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-gray-900/70 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md p-8 shadow-xl max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                {fieldCount > 4 ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4 text-white">Licencia válida:</h1>
                        <p className="mb-2 text-white"><strong>Licencia:</strong> {licence_info.Id}</p>
                        <p className="mb-2 text-white"><strong>Cliente:</strong> {licence_info.DescCliente}</p>
                        {licence_description.map((line: string, i: number) => (
                            <p key={i} className="text-white mb-1">{line}</p>
                        ))}
                        <p className="mb-4 text-white"><strong>Estado:</strong> {licence_info.DescEstado}</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4 text-white">Licencia válida:</h1>
                        <p className="mb-2 text-white"><strong>Licencia:</strong> {licence_info.Id}</p>
                        <p className="mb-2 text-white">{licence_info.DescProducto}</p>
                        <p className="mb-2 text-white"><strong>Cliente:</strong> {licence_info.DescCliente}</p>
                    </>
                )}

                <button
                    className="absolute top-3 right-3 text-white hover:text-red-400 text-3xl font-light leading-none"
                    aria-label="Cerrar"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </motion.div>
    );
}