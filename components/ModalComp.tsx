import { motion } from "motion/react"

interface LicenceInfoType {
    DescCliente?: string;
    DescEstado?: string;
    DescProducto?: string;
    Id?: string;
    Status?: any;
    error?: string;
}

interface ModalCompProps {
    licence_info: LicenceInfoType | null;
    onClose: () => void;
}

export default function ModalComp({ licence_info, onClose }: ModalCompProps) {
    if (!licence_info) {
        return null; 
    }

    return (
        <motion.div initial={{ scale: 0, transform: "translateX(-200px)"  }} animate={{ scale: 1, transform: "translateX(0px)"  }} transition={{ type: "spring" }} className="fixed inset-0 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-gray-900/40 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-1 border-black-100 p-8 shadow-2xl max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                {licence_info.error ? (
                    <div className="text-white text-lg font-semibold text-center">
                        <p>Error al cargar la información de la licencia:</p>
                        <p className="mt-2 text-xl">{licence_info.error}</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4 text-white">Detalle de la Licencia: {licence_info.Id}</h1>
                        <p className="mb-2 text-white"><strong>Cliente:</strong> {licence_info.DescCliente}</p>
                        <p className="mb-2 text-white"><strong>Producto:</strong> {licence_info.DescProducto}</p>
                        <p className="mb-4 text-white"><strong>Estado:</strong> {licence_info.DescEstado}</p>
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