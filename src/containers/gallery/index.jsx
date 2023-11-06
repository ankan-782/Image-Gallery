import { DndContext, DragOverlay, MouseSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import useLocalStorageImageValues from "../../hooks/useLocalStorageImageValues";
import ImageCard from "./ImageCard";

const nextImageId = (imagesArray) => {
    const maxId = imagesArray.reduce((maxId, currentObject) => Math.max(currentObject.id, maxId), 0);
    return maxId + 1;
};

export default function Gallery() {
    // getting values from context
    const { storedImages, setStoredImages } = useLocalStorageImageValues();

    const [activeImageElement, setActiveImageElement] = useState(null);

    // select files from local computer and store into localStorage.
    function handleImagesUpload(e) {
        const files = e.target.files;

        // array for storing new uploaded images with previous stored images [localStorage array replacing reason]
        const uploadedImageObjectsArray = [...storedImages];

        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // creating image object for every file
                    const imageObject = {
                        id: nextImageId(uploadedImageObjectsArray),
                        image: e.target.result, // Base64 encoded image data
                    };

                    // storing every uploaded image into the array
                    uploadedImageObjectsArray.push(imageObject);

                    // replacing the uploaded image objects array into localStorage
                    localStorage.setItem("images", JSON.stringify(uploadedImageObjectsArray));

                    // Storing every uploaded image object into local state array for first time for state changes so immediately display images by retrieving images from localStorage using useEffect hook [written in custom hook]
                    setStoredImages(prevStoredImages => [...prevStoredImages, imageObject]);

                    //  wrote this logic before to store only on local state [ignore] 
                    // ======================================================
                    // store the image objects into local state
                    // setImages((prevImages => {
                    //     return [...prevImages, {
                    //         id: nextImageId(uploadedImageObjectsArray),
                    //         image: e.target.result, // Base64 encoded image data
                    //     }];
                    // }));
                    // =======================================================

                };
                reader.readAsDataURL(file);
            });
        }
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        const activeImageElementId = active.id;
        const overImageElementId = over.id;

        if (activeImageElementId === overImageElementId) return;
        setStoredImages(prevImages => {
            const activeImageElementIndex = prevImages.findIndex(image => image.id === activeImageElementId);
            const overImageElementIndex = prevImages.findIndex(image => image.id === overImageElementId);

            localStorage.setItem("images", JSON.stringify(arrayMove(prevImages, activeImageElementIndex, overImageElementIndex)));

            return arrayMove(prevImages, activeImageElementIndex, overImageElementIndex);
        });
    }

    function handleDragStart(event) {
        if (event?.active?.data?.current?.type === 'imageElement') {
            setActiveImageElement(event?.active?.data?.current?.element);
            return;
        }
    }

    // pointer sensor configuration for dragging images
    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    });

    // touch sensor configuration for dragging images
    const touchSensor = useSensor(TouchSensor);

    // mouse sensor configuration for dragging images
    const mouseSensor = useSensor(MouseSensor);

    const sensors = useSensors(pointerSensor, touchSensor, mouseSensor);

    return (
        <section aria-label="Gallery">
            <div className="container py-7">
                <div className="grid grid-cols-2 min-[350px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 auto-rows-fr gap-8">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={storedImages.map(images => images.id)}
                        >
                            {/* loading screen will be added later */}
                            {/* {Array(11).fill(null).map((_, index) => <div
                                key={index}
                                className={`min-w-[70px] min-h-[70px] bg-white border-2 border-solid border-black/25 rounded-2xl ${index === 0 && 'col-span-2 row-span-2'}`}
                            ></div> */}
                            {storedImages.map((element, index) => (
                                <ImageCard
                                    key={element.id}
                                    element={element}
                                    index={index}
                                />
                            ))}
                        </SortableContext>
                        {createPortal(<DragOverlay>
                            {activeImageElement && (
                                <ImageCard element={activeImageElement} />
                            )}
                        </DragOverlay>, document.body)}
                        <label
                            htmlFor="galleryImage"
                            className={`flex flex-col justify-center items-center border-2 border-dashed border-black/25 rounded-2xl space-y-3 max-[500px]:space-y-1 cursor-pointer ${storedImages.length < 1 ? 'min-h-[120px] lg:min-h-[150px] xl:min-h-[200px] 2xl:min-h-[250px] min-w-[100px]' : 'min-w-[70px] min-h-[70px]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <p className="font-medium text-center max-[500px]:text-sm max-[250px]:text-xs">Add Images</p>
                        </label>
                        <input
                            type="file"
                            name="galleryImage"
                            id="galleryImage"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImagesUpload}
                        />
                    </DndContext>
                </div>
            </div>
        </section >
    );
}
