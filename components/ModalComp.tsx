import { motion } from "motion/react"

interface LicenceInfoType {
    [key: string]: any;
    error?: string;
}

interface ModalCompProps {
    licence_info: LicenceInfoType | null;
    onClose: () => void;
}

export default function ModalComp({ licence_info, onClose }: ModalCompProps) {
    if (!licence_info) return null;

    const { error, ...fields } = licence_info;

    const fieldCount = Object.keys(fields).length;

    return (
        <motion.div initial={{ scale: 0, transform: "translateX(-200px)" }} animate={{ scale: 1, transform: "translateX(0px)" }} transition={{ type: "spring" }} className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-gray-900/70 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md p-8 shadow-xl max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                {licence_info.error ? (
                    <div className="text-white text-lg font-semibold text-center">
                        <p>Error al cargar la información de la licencia:</p>
                        <p className="mt-2 text-xl">{licence_info.error}</p>
                    </div>
                ) : (

                    <>
                        {fieldCount > 4 ? (
                            <>
                                <h1 className="text-2xl font-bold mb-4 text-white">Licencia: {licence_info.Id}</h1>
                                <p className="mb-2 text-white"><strong>Cliente:</strong> {licence_info.DescCliente}</p>
                                <p className="mb-2 text-white"><strong>Producto:</strong> {licence_info.DescProducto}</p>
                                <p className="mb-4 text-white"><strong>Estado:</strong> {licence_info.DescEstado}</p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold mb-4 text-white">Licencia: {licence_info.Id}</h1>
                                <p className="mb-2 text-white"><strong>Cliente:</strong> {licence_info.DescCliente}</p>
                                <p className="mb-2 text-white"><strong>Articulo:</strong> {licence_info.DescArticulo}</p>
                                <p className="mb-4 text-white"><strong>Última fecha:</strong> {licence_info.UFecha}</p>
                            </>
                        )}
                    </>
                )}

                <button
                    className="absolute top-3 right-3 text-white hover:text-gray-700 text-3xl font-light leading-none"
                    aria-label="Cerrar"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </motion.div>
    );
}