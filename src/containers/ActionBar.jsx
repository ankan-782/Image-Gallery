import { motion } from "framer-motion";
import useLocalStorageImageValues from "../hooks/useLocalStorageImageValues";

function filesLength(filesNumber) {
    switch (filesNumber) {
        case 0:
            return 'No files selected';

        case 1:
            return '1 file selected';

        default:
            return `${filesNumber} files selected`;
    }
}

export default function ActionBar() {
    // getting values from context
    const { storedImages, setStoredImages, selectedImages, setSelectedImages } = useLocalStorageImageValues();

    // deleting selected images
    function handleDelete() {
        const remainingImages = storedImages.filter(storedImage => {
            // Check if the stored image's id exists in the selected images array
            return !selectedImages.some(selectedImage => selectedImage.id === storedImage.id);
        });

        setStoredImages(remainingImages);
        // replacing the remaining image objects array into localStorage
        localStorage.setItem("images", JSON.stringify(remainingImages));

        setSelectedImages([]);
    }

    // selecting/unselecting all images
    function handleAllImageSelect(e) {
        if (e.target.checked === true) {
            setSelectedImages([...storedImages]);
        } else {
            setSelectedImages([]);
        }
    }

    return (
        <section aria-label="Action Bar">
            <div className="container py-7 border-b-2">
                <div className="flex items-center justify-between gap-10 flex-wrap max-[300px]:justify-center">
                    <div className="flex items-center justify-between gap-3">
                        {selectedImages.length > 0
                            ? <motion.div
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="checkbox"
                                    name="checkboxAll"
                                    id="checkboxAll"
                                    className="w-5 h-5 cursor-pointer"
                                    checked={storedImages.length === selectedImages.length}
                                    onChange={handleAllImageSelect}
                                />
                                <p className="font-bold text-2xl">{filesLength(selectedImages.length)}</p>
                            </motion.div>
                            : <motion.p
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="font-bold text-2xl"
                            >
                                Gallery
                            </motion.p>}
                    </div>
                    {selectedImages.length > 0 && <motion.button
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.99 }}
                        className="text-red-600 font-bold"
                        onClick={handleDelete}
                    >
                        Delete files
                    </motion.button>}
                </div>
            </div>
        </section>
    );
}
