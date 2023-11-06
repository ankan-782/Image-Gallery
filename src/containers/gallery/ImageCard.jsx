import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Picture from "../../components/common/Picture";
import useLocalStorageImageValues from "../../hooks/useLocalStorageImageValues";

export default function ImageCard({ element, index }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: element.id,
        data: {
            type: "imageElement",
            element,
        }
    });

    const { selectedImages, setSelectedImages } = useLocalStorageImageValues();

    const style = {
        transform: CSS.Translate.toString(transform),
        transition
    };

    // storing selected images into selected image array
    const handleImageSelectionChange = (imageElement) => {
        setSelectedImages((prevSelectedImages) => {
            if (prevSelectedImages.some(imageObject => imageObject.id === imageElement.id)) {
                // If image is already selected, remove it from the array
                return prevSelectedImages.filter((selectedImageObject) => selectedImageObject.id !== imageElement.id);
            } else {
                // If image is not selected, add it to the array
                return [...prevSelectedImages, imageElement];
            }
        });
    };


    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`min-w-[70px] min-h-[70px] bg-white border-2 border-solid border-black/25 rounded-2xl relative overflow-hidden touch-none ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
            ></div>);
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`min-w-[70px] min-h-[70px] bg-white border-2 border-solid border-black/25 rounded-2xl overflow-hidden relative touch-none group ${index === 0 && 'col-span-2 row-span-2'}`}
        >
            <label
                {...listeners}
                // htmlFor={`image-${element.id}`}
                // I am turning off label and input association by giving id and for attribute.
                // Because of not wanting checkbox selected or deselected by pressing on top of images. 
                // Because images is wrapped within label element.
                // I am wanting, later I will implement pressing on gallery image will open that image
                // And pressing on checkbox's will select or deselect the images only
                className={`relative cursor-grab transition-all duration-500 ${selectedImages.some(imageObject => imageObject.id === element.id) ? 'opacity-50' : 'opacity-100'}`}
            >
                <Picture
                    src={element.image}
                    alt={`image-${element.id}`}
                    extraClasses=""
                />
                <div className="transition-all duration-500 absolute inset-0 bg-black opacity-0 group-hover:opacity-50"></div>
            </label>

            <input
                type="checkbox"
                // id={`image-${element.id}`}
                className={`w-4 h-4 sm:w-5 sm:h-5 absolute top-4 left-4 lg:top-5 lg:left-5 xl:top-6 xl:left-6 cursor-pointer transition-opacity duration-500 ${selectedImages.some(imageObject => imageObject.id === element.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                checked={selectedImages.some(imageObject => imageObject.id === element.id)}
                onChange={() => handleImageSelectionChange(element)}
            />
        </div>
    );
}
